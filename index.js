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
  }).option('input', {
    alias: 'i',
    type: 'string',
    description: 'Input image file path',
    demandOption: true,
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'Output file path for the generated image',
  })
  .check((argv) => {
    if (!((argv.string || argv.b64)&&argv.input&&argv.output)) {
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
    const filePath = path.resolve(__dirname, argv.input);
    const file2up = await page.$('#file');
    await file2up.uploadFile(filePath);
  } else {
    console.error('File input element not found!');
    await browser.close();
    process.exit(1);
  }
  
  await page.waitForFunction('renderText("__puppeteer__")');
  
  const textToRender = argv.string;
  await page.evaluate((text) => {
    renderText(text);
  }, textToRender + "\n");
  
  const dataurl_ = await page.$('.__puppeteer__');
  const imageUrl = await page.evaluate(el => el.href || el.src, dataurl_);
  const dataurl = String(imageUrl);
  if (dataurl && dataurl.startsWith('data:image')) {
    const base64Data = dataurl.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    const outputFilePath = path.resolve(__dirname, argv.output);
    fs.writeFileSync(outputFilePath, buffer);
  
    console.log(`Image saved as ${outputFilePath}`);
  } else {
    console.log('No base64 data URL found.');
  }
  
  await browser.close();