import { test, expect } from '@playwright/test';
import { POManager } from '../../pageobjects/POManager';
import { readFileSync } from 'fs';

const testData = JSON.parse(readFileSync('./playwright/testdata/testdataAll.json', 'utf-8'));  // Replace with the correct path to your test data file

test.describe('Standalone Carousel Test Suite', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    if (typeof baseURL === 'string') {
      await page.goto(baseURL);
      // allure.label('Base URL', baseURL);
    } else {
      // allure.severity('baseURL is not defined or not a string');
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

    // Use innerText() to extract the text content from the elements
    const header = await schedulePage.standaloneHeader.innerText();
    const description = await schedulePage.standaloneDescription.innerText();

    // Validate the header text
    expect(header.trim()).toBe(standaloneCarouselData.Heading); // Comparing with the expected Heading from JSON

    // Validate the description text
    expect(description.trim()).toBe(standaloneCarouselData.description); // Comparing with the expected description from JSON
  });

});
