import { test, expect } from '@playwright/test';
import { POManager } from '../../pageobjects/POManager';
import { BasePage } from '../../pageobjects/BasePage';

test.describe('Global Navigation - Test Suite', () => {
  
  let basePage: BasePage;

  test.beforeEach(async ({ page, baseURL }) => {
    // Initialize the POManager and BasePage object
    const poManager = new POManager(page);
    basePage = poManager.getBasePage();

    if (typeof baseURL === 'string') {
      await page.goto(baseURL);
    } else {
      throw new Error('baseURL is not defined or not a string');
    }
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

test('Global Navigation - Validate links are underlined on hover', async ({ page }) => {

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

test.only('Global Navigation - Validate text and background color for lets partner tab', async ({ page }) => {

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

test('Global Navigation - Validate page URL after clicking each link', async ({ page }) => {

  // List of links to test with role and name, along with the expected URLs
  const links = [
    { role: 'link', name: 'Schedule', expectedUrl: 'https://sportbeach-dev.vercel.app/schedule' },
    { role: 'link', name: 'Roster', expectedUrl: 'https://sportbeach-dev.vercel.app/roster' },
    { role: 'link', name: 'Partners', expectedUrl: 'https://sportbeach-dev.vercel.app/partners' },
    { role: 'link', name: 'FAQ', expectedUrl: 'https://sportbeach-dev.vercel.app/faq' },
    { role: 'link', name: 'Login', expectedUrl: 'https://sportbeach-dev.vercel.app/signin' },  // Add more links with expected URLs
  ];

  // Iterate over each link and perform the click and URL verification
  for (const { role, name, expectedUrl } of links) {
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

    // Assert that the current URL matches the expected URL (Optional)
    expect(currentUrl).toBe(expectedUrl);
    console.log(`Verified the URL for "${name}" link: ${currentUrl} matches the expected URL: ${expectedUrl}`);
  }
});

});
