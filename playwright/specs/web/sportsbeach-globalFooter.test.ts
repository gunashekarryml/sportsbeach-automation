import { test, expect } from '@playwright/test';
import { POManager } from '../../pageobjects/POManager';
import { BasePage } from '../../pageobjects/BasePage';
import * as fs from 'fs';

test.describe('Partner Card Test Suite', () => {
  
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

  test('Validate links in global footer: URL and Status code after click, then navigate back', async ({ page, request }) => {
    // const poManager = new POManager(page);
    // const basePage = poManager.getBasePage();

    await basePage.acceptCookies.click();

    // List of links to test by their visible text and expected URL parts
    const links = [
      { name: 'Privacy Policy', expectedUrl: 'https://sportbeach-dev.vercel.app/privacy' },
      { name: 'Terms and Conditions', expectedUrl: 'https://sportbeach-dev.vercel.app/terms' },
      { name: 'Contact Us', expectedUrl: 'https://www.cnbc.com/video/2023/10/06/why-sports-marketing-is-a-growth-area-a-stagwellas-ceo-mark-penn.html' },
    ];

    // Iterate over each link and perform the validation
    for (const { name, expectedUrl } of links) {
      const elementLocator = page.locator(`text=${name}`);

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
      console.log(`Text-decoration after hover for "${name}": ${textDecorationAfterHover}`);

      // 4. Validate if the element is underlined (check if 'underline' is in the 'text-decoration' value)
      const isUnderlined = textDecorationAfterHover.includes('underline');
      expect(isUnderlined).toBe(true); // This will fail the test if not underlined
      console.log(`Is the "${name}" link underlined on hover? ${isUnderlined ? 'Yes' : 'No'}`);

      // 5. Make an API request to check the status code before clicking the link
      const response = await request.get(expectedUrl);
      console.log(`Status code for "${name}" before click: ${response.status()}`);
      expect(response.status()).toBe(200); // Ensure the status code is 200 (OK)

      // 6. Click on the link to navigate to the corresponding page (same tab)
      await elementLocator.click();

      // 7. Wait for the page to load and validate the URL
      await page.waitForURL(expectedUrl, { timeout: 10000 }); // Ensures we wait for the full URL to load
      const currentUrl = page.url();
      console.log(`URL after clicking "${name}": ${currentUrl}`);

      // 8. Validate the complete URL
      expect(currentUrl).toBe(expectedUrl); // Ensure the full URL matches the expected URL

      // 9. Navigate back to the original page (since the link opened in the same tab)
      await page.goBack();
      await page.waitForLoadState('domcontentloaded'); // Ensure the page is loaded again

      console.log(`Navigated back to the main page after clicking on "${name}".`);
    }
  });

  test('Validate social media icon hovering and navigation', async ({ page }) => {

    await basePage.acceptCookies.click();

    // List of social media links with their corresponding names and expected URL patterns
    const socialLinks = [
      { name: 'Instagram', expectedUrlPattern: 'instagram.com' },
      { name: 'XProfile', expectedUrlPattern: 'x.com' }, // Update to match x.com for the new X platform
      { name: 'LinkedIn', expectedUrlPattern: 'linkedin.com' }
    ];

    // Create an array to hold the popup pages
    let popups: any[] = [];

    // Listen for the popups (new tabs)
    page.on('popup', (popup) => {
      console.log(`Popup opened: ${popup.url()}`); // Log popup URL for debugging
      popups.push(popup); // Add the new popup to the array
    });

    // Iterate over each social media link to perform hover and validate the circle appearance
    for (const { name, expectedUrlPattern } of socialLinks) {
      // Get the social network icon element
      const iconLocator = basePage.openSocialMediaLink(name);

      // 1. Hover over the social network icon
      await iconLocator.hover();

      // 2. Wait for the hover effect to be fully applied (adjust timeout if needed)
      await page.waitForTimeout(1000);  // Wait for 1 second to allow animation to finish

      // 3. Check for the CSS changes after hover (border-radius and border)
      const borderRadius = await iconLocator.evaluate((el: HTMLElement) => {
        return window.getComputedStyle(el).getPropertyValue('border-radius');
      });

      const borderColor = await iconLocator.evaluate((el: HTMLElement) => {
        return window.getComputedStyle(el).getPropertyValue('border-color');
      });

      console.log(`CSS after hover for "${name}": border-radius: ${borderRadius}, border-color: ${borderColor}`);

      // 4. Assert that the border-radius is a large value (i.e., circular shape) and the border is visible (not transparent)
      expect(borderRadius).toBe('9999px'); // Checking for large value that indicates a circular shape
      expect(borderColor).not.toBe('transparent'); // Ensure the border has changed to something visible

      // 5. Log success message
      console.log(`Circle appears on hover for "${name}": Border radius is ${borderRadius} and border color is ${borderColor}`);
    }

    // Now, click the social media links to open the new tabs
    for (const { name } of socialLinks) {
      console.log(`Clicking the ${name} link to open popup.`);
      await basePage.openSocialMediaLink(name).click();
    }

    // Wait a bit to ensure the popups open (you can increase the timeout if necessary)
    await page.waitForTimeout(5000); // Wait for 5 seconds to ensure popups have time to open

    // Ensure the popups have been captured by checking the number of popups in the array
    expect(popups.length).toBe(3); // Ensure that 3 popups have been captured

    // Optionally, you can log the URLs of the popups to debug
    console.log('Captured popups:', popups.map(popup => popup.url()));

    // Ensure the URLs of the popups are correct before proceeding with the assertions
    for (let i = 0; i < popups.length; i++) {
      console.log(`Popup URL at index ${i}: ${popups[i].url()}`);
      await expect(popups[i]).toHaveURL(new RegExp(socialLinks[i].expectedUrlPattern)); // Validate URL with the updated pattern
    }

    // Optionally, you can also check if the popups have finished loading
    await Promise.all(popups.map(async (popup, index) => {
      try {
        console.log(`Waiting for popup URL at index ${index}: ${popup.url()}`);
        await popup.waitForLoadState('domcontentloaded', { timeout: 40000 }); // Adjust timeout
        console.log(`Popup loaded: ${popup.url()}`);
      } catch (error) {
        console.error(`Popup at index ${index} failed to load within the timeout: ${error}`);
      }
    }));
  });

  test('Validate text and background color for lets partner tab on hovering', async ({ page }) => {
    await basePage.acceptCookies.click();
    const elementLocator = basePage.letsPartnerButton;  // Locate by text
  
    // Expected colors before and after hover
    const expectedTextColorBeforeHover = 'rgb(255, 255, 255)';
    const expectedBackgroundColorBeforeHover = 'rgba(0, 0, 0, 0)';
    const expectedTextColorAfterHover = 'rgb(0, 82, 125)';
    const expectedBackgroundColorAfterHover = 'rgb(163, 238, 255)';
  
    // Wait until the element is visible
    await elementLocator.waitFor({ state: 'visible', timeout: 10000 });
  
    // Check the initial state of the element (before hover)
    const initialTextColor = await elementLocator.evaluate((el) => {
      const computedStyle = window.getComputedStyle(el);
      return computedStyle.getPropertyValue('color');
    });
    const initialBackgroundColor = await elementLocator.evaluate((el) => {
      const computedStyle = window.getComputedStyle(el);
      return computedStyle.getPropertyValue('background-color');
    });
  
    console.log(`Initial text color: ${initialTextColor}`);
    console.log(`Initial background color: ${initialBackgroundColor}`);
  
    // Assert initial colors
    expect(initialTextColor).toBe(expectedTextColorBeforeHover);
    expect(initialBackgroundColor).toBe(expectedBackgroundColorBeforeHover);
  
    // Hover over the element
    await elementLocator.hover();
    
    // Wait for hover effect to settle
    await page.waitForTimeout(3000);
  
    // Check text and background color after hover
    const textColorAfterHover = await elementLocator.evaluate((el) => {
      const computedStyle = window.getComputedStyle(el);
      return computedStyle.getPropertyValue('color');
    });
    const backgroundColorAfterHover = await elementLocator.evaluate((el) => {
      const computedStyle = window.getComputedStyle(el);
      return computedStyle.getPropertyValue('background-color');
    });
  
    console.log(`Text color after hover: ${textColorAfterHover}`);
    console.log(`Background color after hover: ${backgroundColorAfterHover}`);
  
    // Assert the colors after hover
    expect(textColorAfterHover).toBe(expectedTextColorAfterHover);
    expect(backgroundColorAfterHover).toBe(expectedBackgroundColorAfterHover);
  
    console.log('Text and background colors are correct after hover');
  });

});
