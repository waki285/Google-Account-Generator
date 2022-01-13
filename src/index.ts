import puppeteer from "puppeteer-extra";
import { Browser, Page } from "puppeteer";
import axios from "axios";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { EventEmitter } from "events";
import { magenta, bgWhite, green, cyan, yellowBright, red, bgRed } from "chalk";

import { config } from "dotenv";
config();

const K = `[${magenta("*")}] ${bgWhite("GAG")}`;
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
    this._use2captcha = options.use2captcha
  }
}