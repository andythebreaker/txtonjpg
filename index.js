#!/usr/bin/env node
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
  .option('string', {
    alias: 's',
    type: 'string',
    description: 'String to render',
  })
  .option('b64', {
    alias: 'b',
    type: 'string',
    description: 'Base64 string of image data',
  })
  .check((argv) => {
    if (!argv.string && !argv.b64) {
      throw new Error('You must provide either --string or --b64 argument');
    }
    return true;
  })
  .argv;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
page.setDefaultTimeout(180_000);
await page.goto('https://andythebreaker.github.io/txtonjpg/');

await page.setViewport({ width: 1080, height: 1024 });
await page.waitForSelector('.ql-editor');

const fileInput = await page.$('#loadjpg');
if (fileInput) {
  const filePath = path.resolve(__dirname, 'a.jpg');
  var file2up = await page.$('#file');
  await file2up.uploadFile(filePath);
} else {
  console.error('File input element not found!');
}

await page.waitForFunction('renderText("__puppeteer__")');

const textToRender = argv.string || 'default text';
await page.evaluate((text) => {
  renderText(text);
}, textToRender+"\n");

const dataurl_ = await page.$('.__puppeteer__');
const imageUrl = await page.evaluate(el => el.href || el.src, dataurl_);
var dataurl = String(imageUrl);
if (dataurl && dataurl.startsWith('data:image')) {
  const base64Data = dataurl.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync('image.jpg', buffer);

  console.log('Image saved as image.jpg');
} else {
  console.log('No base64 data URL found.');
}

await browser.close();
