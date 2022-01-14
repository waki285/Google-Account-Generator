/// <reference types="node" />
import { EventEmitter } from "events";
import { Browser } from "puppeteer"

declare class Generator extends EventEmitter {
  // ...
  
  on(event: "browserLaunched", listener: (browser: Browser) => void): this;
  once(event: string, listener: Function): this;
}

export default Generator;