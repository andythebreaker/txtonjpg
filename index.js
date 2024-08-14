import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
// Get the directory name
const __dirname = path.dirname(__filename);

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://127.0.0.1:48489/index.html');

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

  await page.waitForSelector("#preview"); // Wait for the image upload to complete

  // Call the renderText function if necessary
  await page.evaluate(() => {
    renderText("abc");
  });



// Type into search box.
//await page.locator('.devsite-search-field').fill('automate beyond recorder');

// Wait and click on first result.
//await page.locator('.devsite-result-item-link').click();

// Locate the full title with a unique string.
//const textSelector = await page
//  .locator('text/Customize and automate')
//  .waitHandle();
//const fullTitle = await textSelector?.evaluate(el => el.textContent);

// Print the full title.
//console.log('The title of this blog post is "%s".', fullTitle);

//await browser.close();