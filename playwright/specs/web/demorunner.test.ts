import { test, expect } from '@playwright/test';
import { POManager } from '../../pageobjects/POManager';
import * as allure from "allure-js-commons";
const fs = require('fs'); // Import fs to read files
const path = require('path');

// Helper function to load test data from JSON file
function loadTestData(testCaseName) {
  const filePath = path.join(__dirname, './testdata/testdataAll.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return data[testCaseName]; // Return the specific test case data
}

test.describe('Login Feature Test Suite',() => {
    
  // allure.suite('Sauce Lab Login Feature Testcases');
  // This will run before each test to open the base URL
  test.beforeEach(async ({ page, baseURL }) => {
      
      if (typeof baseURL === 'string') {
          await page.goto(baseURL);
          //allure.
        //  allure.label('Base URL', baseURL);
      } else {
          // allure.severity('baseURL is not defined or not a string');
          throw new Error('baseURL is not defined or not a string');
      }
  });

  test.afterEach(async ({ page }, testInfo) => {
      console.log('Execution Status : ' + testInfo.status);
  });

test('Validate links are underlined on hover', async ({ page }) => {
  // Navigate to the test page
  // await page.goto('https://sportbeach-dev.vercel.app/');

  // List of links to test with role and name
  const links = [
    { role: 'link', name: 'Schedule' },
    { role: 'link', name: 'Roster' },
    { role: 'link', name: 'Partners' },
    { role: 'link', name: 'FAQ' },
    { role: 'link', name: 'Login' },   // Add more links here
  ];

  // Iterate over each link and perform the validation
  for (const { role, name } of links) {
    // Get the element using the role and name (accessible selectors)
    const elementLocator = page.locator(`role=${role}[name=${name}]`);

    // 1. Check the initial state of the element (before hover)
    const initialTextDecoration = await elementLocator.evaluate((el: HTMLElement) => {
      const computedStyle = window.getComputedStyle(el);
      return computedStyle.getPropertyValue('text-decoration');
    });
    console.log(`Initial text-decoration for "${name}": ${initialTextDecoration}`);

    // 2. Hover over the element
    await elementLocator.hover();

    // 3. Check the text-decoration after hover
    const textDecorationAfterHover = await elementLocator.evaluate((el: HTMLElement) => {
      const computedStyle = window.getComputedStyle(el);
      return computedStyle.getPropertyValue('text-decoration');
    });
    console.log(`text-decoration after hover for "${name}": ${textDecorationAfterHover}`);

    // 4. Validate if the element is underlined (check if 'underline' is in the 'text-decoration' value)
    const isUnderlined = textDecorationAfterHover.includes('underline');

    // Expect the element to be underlined after hover
    expect(isUnderlined).toBe(true); // This will fail the test if not underlined

    console.log(`Is the "${name}" link underlined on hover? ${isUnderlined ? 'Yes' : 'No'}`);
  }
});

test('Validate text and background color for lets partner tab', async ({ page }) => {
  // Navigate to the test page
  await page.goto('https://sportbeach-dev.vercel.app/'); // Replace with your actual URL

  //Create objects to access the page objects
  const poManager = new POManager(page);
  const basePage = poManager.getBasePage();

  // Define the locator for the element (e.g., Schedule link)
  // const elementLocator = page.locator('role=link[name="Let’s partner!"]'); // Replace with your actual locator
  const elementLocator = basePage.letsPartnerLink;

  // Define the expected colors (adjust these according to your actual values)
  const expectedTextColorBeforeHover = 'rgb(0, 82, 125)'; // Example: black text color
  const expectedBackgroundColorBeforeHover = 'rgb(163, 238, 255)'; // Example: white background

  const expectedTextColorAfterHover = 'rgb(255, 255, 255)'; // Example: red text color
  const expectedBackgroundColorAfterHover = 'rgb(0, 82, 125)'; // Example: green background

  // 1. Check the initial state of the element (before hover)
  const initialTextColor = await elementLocator.evaluate((el: HTMLElement) => {
    const computedStyle = window.getComputedStyle(el);
    return computedStyle.getPropertyValue('color');
  });
  const initialBackgroundColor = await elementLocator.evaluate((el: HTMLElement) => {
    const computedStyle = window.getComputedStyle(el);
    return computedStyle.getPropertyValue('background-color');
  });

  console.log(`Initial text color: ${initialTextColor}`);
  console.log(`Initial background color: ${initialBackgroundColor}`);

  // Assert the initial colors
  expect(initialTextColor).toBe(expectedTextColorBeforeHover);
  expect(initialBackgroundColor).toBe(expectedBackgroundColorBeforeHover);

  // 2. Hover over the element
  await elementLocator.hover();

  // 3. Check the text color and background color after hover
  const textColorAfterHover = await elementLocator.evaluate((el: HTMLElement) => {
    const computedStyle = window.getComputedStyle(el);
    return computedStyle.getPropertyValue('color');
  });
  const backgroundColorAfterHover = await elementLocator.evaluate((el: HTMLElement) => {
    const computedStyle = window.getComputedStyle(el);
    return computedStyle.getPropertyValue('background-color');
  });

  console.log(`Text color after hover: ${textColorAfterHover}`);
  console.log(`Background color after hover: ${backgroundColorAfterHover}`);

  // 4. Assert that the text color and background color have changed after hover
  expect(textColorAfterHover).not.toBe(initialTextColor); // Assert text color has changed
  expect(backgroundColorAfterHover).not.toBe(initialBackgroundColor); // Assert background color has changed

  // 5. Assert the exact expected text and background colors after hover
  expect(textColorAfterHover).toBe(expectedTextColorAfterHover); // Assert text color is the expected one
  expect(backgroundColorAfterHover).toBe(expectedBackgroundColorAfterHover); // Assert background color is the expected one

  console.log(`Text color and background color changed and are as expected after hover`);
});

test('Validate page URL after clicking each link', async ({ page }) => {
  // Load specific test data for Test Case 1
  const testData = loadTestData('globalNavigation');

  // Navigate to the test page
  await page.goto('https://sportbeach-dev.vercel.app/'); // Replace with your actual URL

  /// Iterate over each link in the data and perform the click and URL verification
  for (const { role, name, expectedUrl } of testData) {
    // Get the element using the role and name (accessible selectors)
    const elementLocator = page.locator(`role=${role}[name=${name}]`);

    // 1. Click the link and wait for navigation
    const [response] = await Promise.all([
      page.waitForNavigation(), // Wait for navigation to finish
      elementLocator.click(),   // Click the link
    ]);

    // 2. Verify the navigated URL
    const currentUrl = page.url(); // Get the current URL after navigation
    console.log(`Navigated to: ${currentUrl}`);

    // Assert that the current URL matches the expected URL
    expect(currentUrl).toBe(expectedUrl);
    console.log(`Verified the URL for "${name}" link: ${currentUrl} matches the expected URL: ${expectedUrl}`);
  }
});

});