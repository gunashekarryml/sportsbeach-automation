import { test, expect } from '@playwright/test';

test('validate captured text against allowed list', async ({ page }) => {

    // Go to the target page
    await page.goto('https://sportbeach-dev.vercel.app/');

    // Define the allowed list of text
    const allowedTextList = ['BEACH', 'SPORT']; // Update with your allowed text

    // Define the locator for the div element that matches the specific regex text
    const locator = page.locator('div').filter({ hasText: /^SPORTBEACHSPORTBEACHSPORTBEACHSPORTBEACH$/ });

    // Use `.first()` to capture the first matching element
    const firstElement = locator.first();

    // Capture the textContent of the matched element
    const capturedText = await firstElement.textContent();
    console.log("Captured text===>" + capturedText);

    // Check if the captured text is in the allowed list
    const isValid = allowedTextList.some(allowedText => capturedText?.includes(allowedText));

    // Perform the assertion
    expect(isValid).toBe(true); // This will fail if the text is not in the allowed list
});


test.only('validate captured text against allowed list for multiple texts', async ({ page }) => {

    // Go to the target page
    await page.goto('https://sportbeach-dev.vercel.app/');

    // Define the allowed list of text
    const allowedTextList = ['BEACH', 'SPORT', 'CANNES', '2021']; // Update with your allowed text

    // Define the locators for each specific text
    const locator1 = page.locator('div').filter({ hasText: /^SPORTBEACHSPORTBEACHSPORTBEACHSPORTBEACH$/ });
    const locator2 = page.locator('div').filter({ hasText: /^CANNES2025CANNES2025CANNES2025CANNES2025$/ });
    const locator3 = page.locator('div').filter({ hasText: /^SPORTBEACHSPORTBEACHSPORTBEACHSPORTBEACH$/ }); // Replace with the actual text for text 3

    // Function to capture and validate text for the first element of the locator
    const captureAndValidateText = async (locator) => {
        // Capture the first element that matches the locator
        const firstElement = locator.first();

        // Capture the text content of the first element
        const capturedText = await firstElement.textContent();
        console.log("Captured text ===> " + capturedText);

        // Check if the captured text is in the allowed list
        const isValid = allowedTextList.some(allowedText => capturedText?.includes(allowedText));
        
        // Perform the assertion
        expect(isValid).toBe(true); // This will fail if the text is not in the allowed list
    };

    // Validate for each of the three locators
    await captureAndValidateText(locator1);
    await captureAndValidateText(locator2);
    await captureAndValidateText(locator3);
});