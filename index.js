import puppeteer from 'puppeteer';
import path from 'path';import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
// Get the directory name
const __dirname = path.dirname(__filename);

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://andythebreaker.github.io/txtonjpg/');

  // Set screen size.
  await page.setViewport({ width: 1080, height: 1024 });
  await page.waitForSelector('.ql-editor');

  // Upload the image
  const fileInput = await page.$('#loadjpg'); 
  if (fileInput) {
    const filePath = path.resolve(__dirname, 'a.jpg'); // Path to the image file
    var file2up=await page.$('#file');
    await file2up.uploadFile(filePath);
  } else {
    console.error('File input element not found!');
  }

  await page.waitForFunction('renderText("__puppeteer__")');

  // Call the renderText function if necessary
  await page.evaluate(() => {
    renderText("abc\n");
  });


const dataurl_ = await page.$('.__puppeteer__'); 
const imageUrl = await page.evaluate(el => el.href || el.src, dataurl_);
 var dataurl =String(imageUrl);
 //console.log(dataurl);
if (dataurl && dataurl.startsWith('data:image')) {
    // Extract the base64 string from the data URL
    const base64Data = dataurl.split(',')[1];

    // Decode the base64 string
    const buffer = Buffer.from(base64Data, 'base64');

    // Save the image to a file
    fs.writeFileSync('image.jpg', buffer);

    console.log('Image saved as image.jpg');
  } else {
    console.log('No base64 data URL found.');
  }

