import { test, expect } from '@playwright/test';
import { POManager } from '../../pageobjects/POManager';
import { readFileSync } from 'fs';

// Helper function to validate main content text
async function validateMainContent(page, text) {
  await expect(page.locator('#main-content')).toContainText(text);
}

// Helper function to validate article content
async function validateArticleContent(page, title, text1, text2) {
  await page.getByText(title).first().click();
  await expect(page.locator('#main-content')).toContainText(text1);
  await expect(page.locator('#main-content')).toContainText(text2);
}
test.describe('Featured 1 UP Test Suite', () => {

  // allure.suite('Featured 1 UP Feature Testcases');
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

  test('Featured1UP - Validate content', async ({ page }) => {
    // Load the test data from the JSON file
    const testData = JSON.parse(readFileSync('./playwright/testdata/testdataAll.json', 'utf-8'));  // Replace with the correct path to your test data file

    // Load the Featured1UP data from the testData
    const featured1UPData = testData.featured1UP[0]; // Get the first item from the 'featured1UP' array

    const poManager = new POManager(page);
    const basePage = poManager.getBasePage();

    // Navigate to the URL and close the alert pop-up
    // await basePage.closePopup.click();

    // Validate the main content text from the test data
    await validateMainContent(page, featured1UPData.mainContentText);

    // Validate the article content
    await validateArticleContent(page, featured1UPData.articleTitle, featured1UPData.articleText1, featured1UPData.articleText2);

    // Validate that the 'The Latest' link is visible
    await expect(page.getByRole('link', { name: featured1UPData.latestLinkName })).toBeVisible();
  });

  test('Featured1UP - Validate the animation', async ({ page }) => {

    const poManager = new POManager(page);
    const basePage = poManager.getBasePage();

    // Define the locator for the element you want to track the animation on
    const locator = basePage.featured1UPAnimation;

    // Get the initial CSS transform value (this includes translateX)
    const initialTransform = await locator.evaluate((element) => {
      return window.getComputedStyle(element).transform;
    });

    // Log the initial transform value for debugging
    console.log('Initial Transform (Before Animation):', initialTransform);

    // Scroll to the bottom of the page to trigger the animation
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);  // Scroll to the bottom
    });

    // Wait for the animation to complete (adjust time based on your animation speed)
    await page.waitForTimeout(500);  // Wait for 500ms or adjust according to your animation's duration

    // Get the new CSS transform value after scrolling (this will be after the animation)
    const newTransform = await locator.evaluate((element) => {
      return window.getComputedStyle(element).transform;
    });

    // Log the new transform value for debugging
    console.log('New Transform (After Animation):', newTransform);

    // Extract translateX values from the transform matrix for both initial and new transforms
    const initialTranslateX = initialTransform.match(/matrix.*\((.*),\s*(.*),\s*(.*),\s*(.*),\s*(.*),\s*(.*)\)/)?.[5]; // 5th value is translateX
    const newTranslateX = newTransform.match(/matrix.*\((.*),\s*(.*),\s*(.*),\s*(.*),\s*(.*),\s*(.*)\)/)?.[5];  // 5th value is translateX

    // Log translateX values for debugging
    console.log('Initial translateX:', initialTranslateX);
    console.log('New translateX:', newTranslateX);

    // Assert that translateX has changed after the scroll (indicating animation happened)
    expect(initialTranslateX).not.toEqual(newTranslateX);  // Ensure translateX changed
  });

});