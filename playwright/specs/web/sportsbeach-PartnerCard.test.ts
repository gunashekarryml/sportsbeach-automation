import { test, expect, APIRequestContext, Page } from '@playwright/test';
import { POManager } from '../../pageobjects/POManager';
import * as fs from 'fs';

async function checkLinkStatus(request: APIRequestContext, url: string): Promise<boolean> {
  try {
    // Send a GET request to check if the link is valid (status 200)
    const response = await request.get(url);

    // If the status is 200, the link is valid
    return response.status() === 200;
  } catch (error) {
    // If there is an error with the request (e.g., network issue), return false
    console.error(`Error checking link: ${url}`, error);
    return false;
  }
}

// Load the expected links from the JSON file
function loadExpectedLinks(): string[] {
  const data = fs.readFileSync('./playwright/testdata/expectedLinks.json', 'utf-8');
  return JSON.parse(data);
}

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
    // Load the data from the testdataall.json file
    const data = JSON.parse(fs.readFileSync('./playwright/testdata/partnersList.json', 'utf-8')).data;
    const data1 = JSON.parse(fs.readFileSync('./playwright/testdata/partnersList.json', 'utf-8')).expectedPartnersCount;

    // Create objects to access the page objects
    const poManager = new POManager(page);
    const basePage = poManager.getBasePage();
    const partnersPagePage = poManager.getPartnersPage();

    basePage.partnersLink.click();

    // Define the XPath locator for the partner names (update to correctly target the anchor tags)
    const elements = partnersPagePage.partnerName;

    // Wait for the elements to be visible and located
    await elements.first().waitFor({ state: 'visible' });

    // Get the element count (number of matches)
    const elementCount = await elements.count();

    // Ensure elements were found
    expect(elementCount).toEqual(data1); // Assert that elements are present

    // Loop through each element to get its inner text
    for (let i = 0; i < elementCount; i++) {
      const text = await elements.nth(i).innerText(); // Get the inner text of each element

      // Assert if the text is present in the data list
      expect(data).toContain(text); // Assert that the inner text is present in the list
    }
  });

  // // New Test Case: Validate Partner Links and Check API Status
  // test('Partner Card - Validate Partner Links and Check API Status', async ({ page, request }) => {
  //   // Create objects to access the page objects
  //   const poManager = new POManager(page);
  //   const basePage = poManager.getBasePage();
  //   const partnersPagePage = poManager.getPartnersPage();

  //   basePage.partnersLink.click();

  //   // Define the XPath locator for the partner names (this should target the correct anchor tags)
  //   const elements = partnersPagePage.partnerName;

  //   // Wait for the elements to be visible and located
  //   await elements.first().waitFor({ state: 'visible' });

  //   // Get the element count (number of matches)
  //   const elementCount = await elements.count();

  //   // Initialize arrays to store valid and invalid links
  //   const validLinks: string[] = [];
  //   const invalidLinks: string[] = [];

  //   // Loop through each element to get the link and check its status
  //   for (let i = 0; i < elementCount; i++) {
  //     const element = elements.nth(i); // Get the partner at index i
  //     const link = await element.getAttribute('href'); // Capture the 'href' attribute (link)

  //     if (link) {
  //       console.log(`Checking link: ${link}`);

  //       // Check the link status using the API request
  //       const isValid = await checkLinkStatus(request, link);

  //       // Store valid or invalid links based on status
  //       if (isValid) {
  //         validLinks.push(link);
  //         console.log(`Link ${link} is valid.`);
  //       } else {
  //         invalidLinks.push(link);
  //         console.error(`Link ${link} is broken or not reachable.`);
  //       }
  //     } else {
  //       console.warn(`Link at index ${i} is null or empty.`);
  //     }
  //   }

  //   // Print the results for valid and invalid links
  //   console.log("\n--- Summary ---");
  //   console.log(`Total Valid Links: ${validLinks.length}`);
  //   validLinks.forEach((link, index) => {
  //     console.log(`Valid Link ${index + 1}: ${link}`);
  //   });

  //   console.log(`\nTotal Invalid Links: ${invalidLinks.length}`);
  //   invalidLinks.forEach((link, index) => {
  //     console.error(`Invalid Link ${index + 1}: ${link}`);
  //   });

  //   // Optionally, assert that no links are invalid (to ensure the page is fully working)
  //   expect(invalidLinks.length).toBe(0); // This will fail the test if there are invalid links
  // });  


});
