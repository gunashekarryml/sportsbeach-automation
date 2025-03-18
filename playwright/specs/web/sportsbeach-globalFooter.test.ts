import { test, expect } from '@playwright/test';

test('Validate links in global footer: URL and Status code after click, then navigate back', async ({ page, request }) => {
  // Navigate to the test page
  await page.goto('https://sportbeach-dev.vercel.app/'); // Replace with your actual URL
  await page.getByRole('button', { name: 'Accept cookies' }).click();

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
  // Navigate to the page where the global footer with social network icons exists
  await page.goto('https://sportbeach-dev.vercel.app/');
  await page.getByRole('button', { name: 'Accept cookies' }).click();

  // List of social media links with their corresponding names and selector
  const socialLinks = [
    { name: 'Visit Instagram', selector: 'a[aria-label="Visit Instagram"]' },
    { name: 'Visit X Profile', selector: 'a[aria-label="Visit X Profile"]' },
    { name: 'Visit LinkedIn', selector: 'a[aria-label="Visit LinkedIn"]' }
  ];

  // Create an array to hold the popup pages
  let popups: any[] = [];

  // Listen for the popups (new tabs)
  page.on('popup', (popup) => {
    console.log(`Popup opened: ${popup.url()}`); // Log popup URL for debugging
    popups.push(popup); // Add the new popup to the array
  });

  // Iterate over each social media link to perform the hover and validate the circle appearance
  for (const { name, selector } of socialLinks) {
    // Get the social network icon element
    const iconLocator = page.locator(selector);

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
  await page.getByRole('link', { name: 'Visit Instagram' }).click();
  await page.getByRole('link', { name: 'Visit X Profile' }).click();
  await page.getByRole('link', { name: 'Visit LinkedIn' }).click();

  // Wait a bit to ensure the popups open (you can increase the timeout if necessary)
  await page.waitForTimeout(2000); // Wait for 2 seconds to ensure popups have time to open

  // Ensure the popups have been captured by checking the number of popups in the array
  expect(popups.length).toBe(3); // Ensure that 3 popups have been captured

  // Optionally, you can log the URLs of the popups to debug
  console.log('Captured popups:', popups.map(popup => popup.url()));

  // Ensure the URLs of the popups are correct before proceeding with the assertions
  for (let i = 0; i < popups.length; i++) {
    console.log(`Popup URL at index ${i}: ${popups[i].url()}`);
    await expect(popups[i]).toHaveURL(new RegExp(`${socialLinks[i].name.split(' ')[1].toLowerCase()}.com`)); // Validate URL (e.g., instagram.com, twitter.com, linkedin.com)
  }

  // Optionally, you can also check if the popups have finished loading
  await Promise.all(popups.map(popup => popup.waitForLoadState('load')));
});

test('Validate text and background color for lets partner tab on hovering', async ({ page }) => {
  // Navigate to the test page
  await page.goto('https://sportbeach-dev.vercel.app/'); // Replace with your actual URL

  // Define the locator for the element (e.g., Schedule link)
  const elementLocator = page.getByRole('link', { name: 'Let\'s Partner' }); // Replace with your actual locator

  // Define the expected colors (adjust these according to your actual values)
  const expectedTextColorBeforeHover = 'rgb(255, 255, 255)'; // Example: black text color
  const expectedBackgroundColorBeforeHover = 'rgba(0, 0, 0, 0)'; // Example: white background

  const expectedTextColorAfterHover = 'rgb(0, 82, 125)'; // Example: red text color
  const expectedBackgroundColorAfterHover = 'rgb(163, 238, 255)'; // Example: green background

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
