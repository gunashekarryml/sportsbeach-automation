import { test, expect } from '@playwright/test';
import { POManager } from '../../pageobjects/POManager';
import { readFileSync } from 'fs';

const testData = JSON.parse(readFileSync('./playwright/testdata/testdataAll.json', 'utf-8'));  // Replace with the correct path to your test data file

test.describe('Standalone Carousel Test Suite', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    if (typeof baseURL === 'string') {
      await page.goto(baseURL);
      // Ensure that page has loaded completely
      await page.waitForLoadState('load');
    } else {
      throw new Error('baseURL is not defined or not a string');
    }
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('Standalone Carousel - Content Validation', async ({ page }) => {
    const standaloneCarouselData = testData.standaloneCarousel[0]; // Extracting the first item in the standaloneCarousel array
    
    // Create objects to access the page objects
    const poManager = new POManager(page);
    const basePage = poManager.getBasePage();
    const schedulePage = poManager.getSchedulePage();

    // Navigate to the schedule page
    basePage.scheduleLink.click();

    // Wait for the page navigation to complete
    await page.waitForNavigation({ waitUntil: 'load' });

    // Ensure the elements are visible before interacting with them
    await schedulePage.standaloneHeader.waitFor({ state: 'visible', timeout: 20000 }); // Wait for the header to be visible
    await schedulePage.standaloneDescription.waitFor({ state: 'visible', timeout: 20000 }); // Wait for the description to be visible

    // Capture the visible text from the header and description elements
    const header = await schedulePage.standaloneHeader.innerText();  // Use innerText() to capture visible text
    const description = await schedulePage.standaloneDescription.innerText();  // Use innerText() to capture visible text

    // Validate the header text
    expect(header.trim()).toBe(standaloneCarouselData.Heading); // Comparing with the expected Heading from JSON

    // Validate the description text
    expect(description.trim()).toBe(standaloneCarouselData.description); // Comparing with the expected description from JSON
  });

});
