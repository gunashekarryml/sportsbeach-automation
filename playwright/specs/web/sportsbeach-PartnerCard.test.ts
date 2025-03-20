import { test, expect } from '@playwright/test';
import { POManager } from '../../pageobjects/POManager';
import * as fs from 'fs';

test.describe('Partner Card Test Suite', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    if (typeof baseURL === 'string') {
      await page.goto(baseURL);
    } else {
      throw new Error('baseURL is not defined or not a string');
    }
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('Partner Card - Partners List Validation', async ({ page }) => {

    // Step 1: Load the data from the testdataall.json file
    const data = JSON.parse(fs.readFileSync('./playwright/testdata/partnersList.json', 'utf-8')).data;
    const data1 = JSON.parse(fs.readFileSync('./playwright/testdata/partnersList.json', 'utf-8')).expectedPartnersCount;

    // Step 2 : Create objects to access the page objects
    const poManager = new POManager(page);
    const basePage = poManager.getBasePage();
    const partnersPagePage = poManager.getPartnersPage();

    basePage.partnersLink.click();

    // Step 2: Define the XPath locator
    const elements = partnersPagePage.partnerName;

    // Step 3: Wait for the elements to be visible and located
    await elements.first().waitFor({ state: 'visible' }); // Wait for at least the first element to be visible

    // Step 4: Get the element count (number of matches)
    const elementCount = await elements.count();

    // Ensure elements were found
    expect(elementCount).toEqual(data1); // Assert that elements are present

    // Step 5: Loop through each element to get its inner text
    for (let i = 0; i < elementCount; i++) {
      const text = await elements.nth(i).innerText(); // Get the inner text of each element

      // Step 6: Assert if the text is present in the data list
      expect(data).toContain(text); // Assert that the inner text is present in the list
    }
  });
});
