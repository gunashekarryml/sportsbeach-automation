import { test, expect } from '@playwright/test';
import { POManager } from '../../pageobjects/POManager';
import { readFileSync } from 'fs';

const testData = JSON.parse(readFileSync('./playwright/testdata/testdataAll.json', 'utf-8'));  // Replace with the correct path to your test data file

test.describe('Standalone Carousel Test Suite', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    if (typeof baseURL === 'string') {
      await page.goto(baseURL);
      // allure.label('Base URL', baseURL);
    } else {
      // allure.severity('baseURL is not defined or not a string');
      throw new Error('baseURL is not defined or not a string');
    }
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('Validate the oversized CTA in Base page', async ({ page }) => {

    const poManager = new POManager(page);
    const basePage = poManager.getBasePage();
  
    // Request a Pass
    await expect(page.locator('#main-content')).toContainText('Request a pass');
    await basePage.requestPassAnimator.hover();
    await basePage.requestPassAnimatorLink.click();
    expect(page.url()).toBe('https://sportbeach-dev.vercel.app/register');
    await expect(page.locator('iframe').contentFrame().getByText('Sorry! This page doesn\'t')).toBeVisible();
    // Add a page object assertion, currently 404
    await page.goBack();
    await page.goBack();
    expect(page.url()).toBe('https://sportbeach-dev.vercel.app/');
  
  });

});
