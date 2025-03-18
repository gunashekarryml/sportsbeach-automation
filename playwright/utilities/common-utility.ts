import { Page, Locator } from 'playwright';

// Utility function to get the computed style for a given property
async function getComputedStyle(page: Page, selector: string, property: string): Promise<string> {
  const element: Locator = page.locator(selector);
  return element.evaluate((el: HTMLElement, prop: string) => {
    const computedStyle = window.getComputedStyle(el);
    return computedStyle.getPropertyValue(prop);
  }, property);
}

// Utility function to validate color
async function validateColor(page: Page, selector: string, expectedColor: string): Promise<boolean> {
  const color = await getComputedStyle(page, selector, 'color');
  console.log(`Color of ${selector}: ${color}`);
  return color === expectedColor;
}

// Utility function to validate background color
async function validateBackgroundColor(page: Page, selector: string, expectedColor: string): Promise<boolean> {
  const bgColor = await getComputedStyle(page, selector, 'background-color');
  console.log(`Background color of ${selector}: ${bgColor}`);
  return bgColor === expectedColor;
}

// Utility function to validate animation
async function validateAnimation(page: Page, selector: string, expectedAnimationName: string): Promise<boolean> {
  const animationName = await getComputedStyle(page, selector, 'animation-name');
  console.log(`Animation applied to ${selector}: ${animationName}`);
  return animationName !== 'none' && animationName === expectedAnimationName;
}
