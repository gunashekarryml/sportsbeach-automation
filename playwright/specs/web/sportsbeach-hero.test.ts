import { test, expect } from '@playwright/test';

test('Validate that each captured word from locator matches any of the allowed words', async ({ page }) => {
  // Navigate to the page
  await page.goto('https://sportbeach-dev.vercel.app/');

  // Define the XPath locator with specific positions (2, 4, 6, 8)
  const locator = page.locator('//*[@id="main-content"]/div[1]/div[*]/div/div[1]/div/div/div//div[position() = 2 or position() = 4 or position() = 6 or position() = 8]');

  // Wait for the elements to be visible
//   await locator.waitFor({ state: 'visible' });

  // Get the number of elements matching the locator
  const elementCount = await locator.count();

  // Define the allowed words as a Set for fast lookups
  const allowedWords = new Set(['BEACH', 'SPORT', 'CANNES', '2024']);

  // Loop through each element and validate the text
  for (let i = 0; i < elementCount; i++) {
    // Get the visible text for the current element
    const textContent = await locator.nth(i).innerText();

    // Trim and split the text content into words, then convert each word to uppercase
    const textWords = textContent.trim().split(/\s+/).map(word => word.trim().toUpperCase());

    // Log the captured words for debugging
    console.log(`Captured words from element ${i + 1}:`, textWords);

    // Check if all words in the text match any of the allowed words
    textWords.forEach(word => {
      // Compare each word to see if it matches any allowed word
      expect(allowedWords.has(word)).toBe(true); // Ensure the word is in the allowed words list
    });
  }
});
