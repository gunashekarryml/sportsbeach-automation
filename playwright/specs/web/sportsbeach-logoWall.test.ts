import { test, expect, Page, APIRequestContext } from '@playwright/test';
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

test('Validate the logo wall', async ({ page, request }) => {
  // Go to the page
  await page.goto('https://sportbeach-dev.vercel.app/');
  const partnerstLocators = page.locator('//*[@id="main-content"]/section[1]/div/div[2]/div[*]/div[1]/div/div/div/a[*]');
  const partnersCount = await partnerstLocators.count();
  console.log("Total partner count: " + partnersCount);

  // Initialize arrays to store valid and invalid links
  const validLinks: string[] = [];
  const invalidLinks: string[] = [];

  // Loop through all links and check if they are valid
  for (let i = 0; i < partnersCount; i++) {
    const partner = partnerstLocators.nth(i); // Get the partner at index i

    // Capture the 'href' attribute (link) of the partner
    const link = await partner.getAttribute('href');
    console.log(`Checking link: ${link}`);

    if (link) {
      // If the href is not null or undefined, check the link status using the API request
      const isValid = await checkLinkStatus(request, link);

      // Store valid or invalid links based on status
      if (isValid) {
        validLinks.push(link);
        console.log(`Link ${link} is valid.`);
      } else {
        invalidLinks.push(link);
        console.error(`Link ${link} is broken or not reachable.`);
      }
    }
  }

  // Print the results for valid and invalid links
  console.log("\n--- Summary ---");
  console.log(`Total Valid Links: ${validLinks.length}`);
  validLinks.forEach((link, index) => {
    console.log(`Valid Link ${index + 1}: ${link}`);
  });

  console.log(`\nTotal Invalid Links: ${invalidLinks.length}`);
  invalidLinks.forEach((link, index) => {
    console.error(`Invalid Link ${index + 1}: ${link}`);
  });

  // Optionally, assert that no links are invalid (to ensure the page is fully working)
  expect(invalidLinks.length).toBe(0);  // This will fail the test if there are invalid links
});


test('Validate captured links against expected links', async ({ page }) => {
  // Load the expected links from the JSON file
  const expectedLinks = loadExpectedLinks();

  // Go to the page
  await page.goto('https://sportbeach-dev.vercel.app/');

  // Capture all the links on the page
  const partnerstLocators = page.locator('//*[@id="main-content"]/section[1]/div/div[2]/div[*]/div[1]/div/div/div/a[*]');
  const partnersCount = await partnerstLocators.count();
  console.log("Total partner count: " + partnersCount);

  // Capture all the links as an array of strings
  const capturedLinks: string[] = [];
  for (let i = 0; i < partnersCount; i++) {
    const partner = partnerstLocators.nth(i); // Get the partner at index i
    const link = await partner.getAttribute('href');
    if (link) {
      capturedLinks.push(link);
    }
  }

  // Assert that the captured links match the expected links
  expect(capturedLinks).toEqual(expectedLinks);

  // Print the results
  console.log("\nCaptured Links:");
  capturedLinks.forEach((link, index) => {
    console.log(`Captured Link ${index + 1}: ${link}`);
  });

  console.log("\nExpected Links:");
  expectedLinks.forEach((link, index) => {
    console.log(`Expected Link ${index + 1}: ${link}`);
  });
});
