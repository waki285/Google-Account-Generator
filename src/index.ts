import puppeteer from "puppeteer-extra";
import { Browser, Page } from "puppeteer";
import axios from "axios";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { EventEmitter } from "events";
import { magenta, bgWhite, green, cyan, yellowBright, red, bgRed } from "chalk";
import { name } from "faker";
import { config } from "dotenv";
import { readFile } from "fs/promises"
config();

const K = `[${magenta("*")}] ${bgWhite.black("GAG")}`;
const SUCCESS = green("SUCCESS!");
const INFO = cyan("info");
const WARN = yellowBright("WARNING");
const ERR = red("ERROR!");
const FATAL = bgRed("ERROR!");

puppeteer.use(stealthPlugin());

type GeneratorOptions = {
  use2captcha?: boolean
}

class GAGError extends Error {
  constructor(message: string) {
    super(message);
    this.name = `${K} ${FATAL}`;
  };
}

type GeneratorEvents = "browserLaunched" | "wentToGoogle";

interface Infos {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

class StrictEventEmitter extends EventEmitter {
  on(eventName: GeneratorEvents, listener: (...args: any[]) => void): this {
    return super.on(eventName, listener);
  };
  once(eventName: GeneratorEvents, listener: (...args: any[]) => void): this {
    return super.once(eventName, listener);
  };
  emit(eventName: GeneratorEvents, ...args: any[]): boolean {
    return super.emit(eventName, ...args);
  };
  off(eventName: GeneratorEvents, listener: (...args: any[]) => void): this {
    return super.off(eventName, listener);
  };
}

class Generator extends StrictEventEmitter {
  private _use2captcha: boolean
  private _browser: Browser | null;
  constructor(options?: GeneratorOptions) {
    super();
    if (options?.use2captcha) this._use2captcha = options.use2captcha; else this._use2captcha = true;
    this._browser = null;
    console.log(`${K} ${SUCCESS} initialized.`);
  };
  async launch(): Promise<Browser> {
    console.log(`${K} ${INFO} launching browser...`);
    this._browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ]
    });
    console.log(`${K} ${SUCCESS} browser launched.`);
    this.emit("browserLaunched", this._browser);
    return this._browser;
  }
  async gotoGoogle(): Promise<Page> {
    if (!this._browser) throw new GAGError("You don't launch browser! please run generator.launch()");
    console.log(`${K} ${INFO} go to https://google.com register page.`);
    const page: Page = (await this._browser.pages())[0] || await this._browser.newPage();
    await page.goto("https://accounts.google.com/signup/v2/webcreateaccount?continue=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dgoogle%26rlz%3D1C1FQRR_jaJP983JP983%26oq%3Dgoogle%26aqs%3Dchrome..69i57j0i271l3.579j0j1%26sourceid%3Dchrome%26ie%3DUTF-8&hl=en&dsh=S-1139929386%3A1642222684357616&biz=false&flowName=GlifWebSignIn&flowEntry=SignUp")
    console.log(`${K} ${SUCCESS} success go to google register page.`);
    this.emit("wentToGoogle", page);
    return page;
  };
  async typeInfo(): Promise<Infos> {
    if (!this._browser) throw new GAGError("You don't launch browser! please run generator.launch()");
    const page = (await this._browser.pages())[0];
    if (!page) throw new GAGError("You don't open google! please run generator.gotoGoogle()"); 
    console.log(`${K} ${INFO} type infos.`);
    const firstName: string = name.firstName();
    const lastName: string = name.lastName();
    console.log(`${K} ${INFO} type first name and last name ${firstName} ${lastName}`);
    await page.type("input[name=firstName]", firstName);
    await page.type("input[name=lastName]", lastName);
    const emails: string = await readFile("./config/emails.txt", "utf-8");
    if (emails) {
      const emailList: string[] = emails.split("\n");
      const email = emailList[Math.floor(Math.random() * emailList.length)];
      console.log(`${K} ${INFO} email name used ${email}@gmail.com`);
      await page.type()
    }
  }
};

(async () => {
  const gen = new Generator();
  await gen.launch()
  await gen.gotoGoogle();
})()