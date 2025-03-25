import { test, expect, APIRequestContext, Page } from '@playwright/test';
import { POManager } from '../../pageobjects/POManager';
import * as fs from 'fs';

// Helper function to check link status
async function checkLinkStatus(request: APIRequestContext, url: string): Promise<boolean> {
  try {
    const response = await request.get(url); // Send a GET request to check if the link is valid (status 200)
    return response.status() === 200; // Return true if status is 200
  } catch (error) {
    console.error(`Error checking link: ${url}`, error); // Handle errors (e.g., network issues)
    return false;
  }
}

// Load expected links from JSON file
function loadExpectedLinks(): string[] {
  const data = fs.readFileSync('./playwright/testdata/expectedLinks.json', 'utf-8');
  return JSON.parse(data); // Return the list of expected links
}

// Function to add a delay between checks
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test.describe('Partner Card Test Suite', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    if (typeof baseURL === 'string') {
      await page.goto(baseURL); // Navigate to the base URL
    } else {
      throw new Error('baseURL is not defined or not a string');
    }
  });

  test.afterEach(async ({ page }) => {
    await page.close(); // Close the page after each test
  });

  test('Partner Card - Partners List Validation', async ({ page }) => {
    // Load data from partnersList.json
    const data = JSON.parse(fs.readFileSync('./playwright/testdata/partnersList.json', 'utf-8')).data;
    const expectedPartnersCount = JSON.parse(fs.readFileSync('./playwright/testdata/partnersList.json', 'utf-8')).expectedPartnersCount;

    // Create page object instances
    const poManager = new POManager(page);
    const basePage = poManager.getBasePage();
    const partnersPage = poManager.getPartnersPage();

    basePage.partnersLink.click(); // Click the partners link

    // Wait for partner name elements to be visible
    const elements = partnersPage.partnerName;
    await expect(elements.first()).toBeVisible();

    // Get the element count and ensure the expected number of partners is found
    const elementCount = await elements.count();
    expect(elementCount).toEqual(expectedPartnersCount); 

    // Loop through each partner element to validate the text
    for (let i = 0; i < elementCount; i++) {
      const text = await elements.nth(i).innerText(); // Get inner text of the partner
      expect(data).toContain(text); // Assert that the partner is present in the expected data
    }
  });

  // New test case to validate partner links and check API status
  test.only('Partner Card - Validate Partner Links and Check API Status', async ({ page, request }) => {
    // Create page object instances
    const poManager = new POManager(page);
    const basePage = poManager.getBasePage();
    const partnersPage = poManager.getPartnersPage();

    basePage.partnersLink.click(); // Click the partners link

    // Define the XPath locator for partner links
    const elements = partnersPage.partnerName;

    // Wait for partner links to be visible
    await expect(elements.first()).toBeVisible();

    // Get the element count
    const elementCount = await elements.count();
    console.log("Partners Count: " + elementCount);

    // Initialize arrays to store valid and invalid links
    const validLinks: string[] = [];
    const invalidLinks: string[] = [];

    // Loop through each element to check the link status
    for (let i = 0; i < elementCount; i++) {
      const element = elements.nth(i); // Get partner at index i
      try {
        const link = await element.getAttribute('href'); // Get 'href' attribute

        if (link) {
          console.log(`Checking link: ${link}`);

          // Check the link status using the API request
          const isValid = await checkLinkStatus(request, link);

          // Store valid or invalid links based on status
          if (isValid) {
            validLinks.push(link);
            console.log(`Link ${link} is valid.`);
          } else {
            invalidLinks.push(link);
            console.error(`Link ${link} is broken or not reachable.`);
          }

          // Add delay between link checks to avoid overwhelming the server
          await delay(1000); // Delay 1 second between each link check
        } else {
          console.warn(`Link at index ${i} is null or empty.`);
        }
      } catch (error) {
        console.error(`Error checking link at index ${i}:`, error);
      }
    }

    // Print results for valid and invalid links
    console.log("\n--- Summary ---");
    console.log(`Total Valid Links: ${validLinks.length}`);
    validLinks.forEach((link, index) => {
      console.log(`Valid Link ${index + 1}: ${link}`);
    });

    console.log(`\nTotal Invalid Links: ${invalidLinks.length}`);
    invalidLinks.forEach((link, index) => {
      console.error(`Invalid Link ${index + 1}: ${link}`);
    });

    // Optionally assert that no invalid links are found
    expect(invalidLinks.length).toBe(0); // Fail the test if there are invalid links
  });
});
