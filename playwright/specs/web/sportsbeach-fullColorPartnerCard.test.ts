import { test, expect } from '@playwright/test';
import { POManager } from '../../pageobjects/POManager';
import { readFileSync } from 'fs';

const testData = JSON.parse(readFileSync('./playwright/testdata/testdataAll.json', 'utf-8'));  // Replace with the correct path to your test data file

test.describe('Full Color Partner Card Test Suite', () => {

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

  test('Full Color Partner Card - Content Validation', async ({ page }) => {
    const fullColorPartnerCardData = testData.fullColorPartnerCard[0]; // Extracting the first item in the standaloneCarousel array
    
    // Create objects to access the page objects
    const poManager = new POManager(page);
    const basePage = poManager.getBasePage();
    const partnersPage = poManager.getPartnersPage();

    // Navigate to the partners page
    basePage.partnersLink.click();

    // Use innerText() to extract the text content from the elements
    const mainPartnerName = await partnersPage.mainPartnerName.innerText();
    const mainPartnerHeader = await partnersPage.mainPartnerHeader.innerText();
    const mainPartnerDescription = await partnersPage.mainPartnerDescription.innerText();

    // Validate the mainPartnerName text
    expect(mainPartnerName.trim()).toBe(fullColorPartnerCardData.mainPartnerName); // Comparing with the expected name from JSON

    // Validate the mainPartnerHeader text
    expect(mainPartnerHeader.trim()).toBe(fullColorPartnerCardData.mainPartnerHeader); // Comparing with the expected Heading from JSON
  
    // Validate the mainPartnerDescription text
    expect(mainPartnerDescription.trim()).toBe(fullColorPartnerCardData.mainPartnerDescription); // Comparing with the expected description from JSON

  });

});
