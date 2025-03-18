import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';  // Import Node.js fs module

test.describe('Speaker Card Test Suite', () => {

  // allure.suite('Sauce Lab Login Feature Testcases');
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

  test('Speaker Card - Validate social media icon hovering for multiple icons', async ({ page }) => {
    // Navigate to the page where the global footer with social network icons exists
    await page.goto('https://sportbeach-dev.vercel.app/roster');
    await page.getByRole('button', { name: 'Accept cookies' }).click();
  
    // Locator for the social media links
    const socialMediaLinksLocator = page.locator('//body/div/main/div/div/div/div[*]/div[2]/a[*]');
  
    // Get the total number of social media links (in this case, it's 300)
    const linksCount = await socialMediaLinksLocator.count();

    console.log("Total Links : "+linksCount);
  
    // Create an array to hold the popups
    let popups: any[] = [];
  
    // Listen for the popups (new tabs)
    page.on('popup', (popup) => {
      console.log(`Popup opened: ${popup.url()}`); // Log popup URL for debugging
      popups.push(popup); // Add the new popup to the array
    });
  
    // Iterate over each social media link to perform the hover and validate the circle appearance
    for (let i = 0; i < linksCount; i++) {
      // Get the social media link element at index 'i'
      const iconLocator = socialMediaLinksLocator.nth(i);
  
      // 1. Hover over the social media icon
      await iconLocator.hover();
  
      // 2. Wait for the hover effect to be fully applied (adjust timeout if needed)
    //   await page.waitForTimeout(10000);  // Wait for 1 second to allow animation to finish
  
      // 3. Check for the CSS changes after hover (border-radius and border)
      const borderRadius = await iconLocator.evaluate((el: HTMLElement) => {
        return window.getComputedStyle(el).getPropertyValue('border-radius');
      });
  
      const borderColor = await iconLocator.evaluate((el: HTMLElement) => {
        return window.getComputedStyle(el).getPropertyValue('border-color');
      });
  
    //   console.log(`CSS after hover for icon ${i + 1}: border-radius: ${borderRadius}, border-color: ${borderColor}`);
  
      // 4. Assert that the border-radius is a large value (i.e., circular shape) and the border is visible (not transparent)
      expect(borderRadius).toBe('9999px'); // Checking for large value that indicates a circular shape
      expect(borderColor).not.toBe('transparent'); // Ensure the border has changed to something visible
  
      // 5. Log success message
    //   console.log(`Circle appears on hover for icon ${i + 1}: Border radius is ${borderRadius} and border color is ${borderColor}`);
    }
  
    // // Now, click the social media links to open the new tabs
    // for (let i = 0; i < linksCount; i++) {
    //   const iconLocator = socialMediaLinksLocator.nth(i);
    //   await iconLocator.click();
    // }
  
    // // Wait a bit to ensure the popups open (you can increase the timeout if necessary)
    // await page.waitForTimeout(5000); // Wait for 5 seconds to ensure popups have time to open
  
    // // Ensure the popups have been captured by checking the number of popups in the array
    // expect(popups.length).toBe(linksCount); // Ensure the number of popups matches the number of social media links
  
    // // Optionally, you can log the URLs of the popups to debug
    // console.log('Captured popups:', popups.map(popup => popup.url()));
  
    // // Optionally, you can check the URLs of the popups to ensure they are correct
    // for (let i = 0; i < popups.length; i++) {
    //   console.log(`Popup URL at index ${i}: ${popups[i].url()}`);
    //   // Adjust the validation logic as needed, for example, based on the social media platform
    //   // Note: You may need a more sophisticated way of verifying URLs here depending on your actual case
    //   await expect(popups[i]).toHaveURL(/(instagram|x\.com|linkedin\.com)/); // Match social media URLs
    // }
  
    // // Optionally, you can also check if the popups have finished loading
    // await Promise.all(popups.map(popup => popup.waitForLoadState('load')));
  });
  

  

});