import puppeteer from "puppeteer-extra";
import { Browser, Page } from "puppeteer";
import axios from "axios";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { EventEmitter } from "events";
import { magenta, bgWhite, green, cyan, yellowBright, red, bgRed } from "chalk";

import { config } from "dotenv";
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

class Generator extends EventEmitter {
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
    this.emit("browserLaunched");
    return this._browser
  }
};

(async () => {
  const gen = new Generator();
  await gen.launch()
})()