import { test, expect } from '@playwright/test';

test('Validate the oversized CTA in Base page', async ({ page }) => {
  // View Roster  
  await page.goto('https://sportbeach-dev.vercel.app/');
  await expect(page.getByRole('heading', { name: 'Download the App 🚨' })).toBeVisible();
  await page.getByRole('button', { name: 'Close Alert Pop Up' }).click();
  await expect(page.locator('#main-content')).toContainText('View Roster');
  await page.getByRole('link', { name: 'View Roster' }).hover();
  await page.getByRole('link', { name: 'View Roster View Roster View' }).click();
  expect(page.url()).toBe('https://sportbeach-dev.vercel.app/roster');
  await expect(page.getByRole('heading', { name: 'Roster', exact: true })).toBeVisible();
  await page.goBack();
  expect(page.url()).toBe('https://sportbeach-dev.vercel.app/');
  // Request a Pass
  await expect(page.locator('#main-content')).toContainText('Request a pass');
  await page.getByRole('link', { name: 'Request a pass' }).hover();
  await page.getByRole('link', { name: 'Request a pass Request a pass' }).click();
  expect(page.url()).toBe('https://sportbeach-dev.vercel.app/register');
  await expect(page.locator('iframe').contentFrame().getByText('Sorry! This page doesn\'t')).toBeVisible();
  // Add a page object assertion, currently 404
  await page.goBack();
  await page.goBack();
  expect(page.url()).toBe('https://sportbeach-dev.vercel.app/');

  // Learn More
  await expect(page.locator('#main-content')).toContainText('Learn More');
  await page.locator('//*[@id="main-content"]/a[3]/div[3]/div/span').hover();
//   await page.getByRole('link', { name: 'Learn More Learn More Learn' }).hover();
  await page.getByRole('link', { name: 'Learn More Learn More Learn' }).click();
  expect(page.url()).toBe('https://player.vimeo.com/video/899862060?h=13b1234477');
//   await expect(page.getByRole('heading', { name: 'Player error' })).toBeVisible();
  // Add a page object assertion, currently 404
  await page.goBack();
  expect(page.url()).toBe('https://sportbeach-dev.vercel.app/');

});