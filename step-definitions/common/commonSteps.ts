import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../src/fixtures/customWorld';

// Navigation
When('I navigate to {string}', async function (this: CustomWorld, url: string) {
  const baseUrl = process.env.BASE_URL || '';
  await this.page!.goto(`${baseUrl}${url}`);
});

When('I go back', async function (this: CustomWorld) {
  await this.page!.goBack();
});

When('I go forward', async function (this: CustomWorld) {
  await this.page!.goForward();
});

When('I reload the page', async function (this: CustomWorld) {
  await this.page!.reload();
});

// Waits
When('I wait for {int} seconds', async function (this: CustomWorld, seconds: number) {
  await this.page!.waitForTimeout(seconds * 1000);
});

When('I wait for element {string} to be visible', async function (this: CustomWorld, selector: string) {
  await this.page!.waitForSelector(selector, { state: 'visible' });
});

When('I wait for page to load', async function (this: CustomWorld) {
  await this.page!.waitForLoadState('domcontentloaded');
});

// Assertions
Then('the page title should be {string}', async function (this: CustomWorld, expectedTitle: string) {
  const title = await this.page!.title();
  expect(title).toBe(expectedTitle);
});

Then('the page title should contain {string}', async function (this: CustomWorld, expectedText: string) {
  const title = await this.page!.title();
  expect(title).toContain(expectedText);
});

Then('the current URL should be {string}', async function (this: CustomWorld, expectedUrl: string) {
  const currentUrl = this.page!.url();
  expect(currentUrl).toBe(expectedUrl);
});

Then('the current URL should contain {string}', async function (this: CustomWorld, expectedText: string) {
  const currentUrl = this.page!.url();
  expect(currentUrl).toContain(expectedText);
});

Then('element {string} should be visible', async function (this: CustomWorld, selector: string) {
  const isVisible = await this.page!.locator(selector).isVisible();
  expect(isVisible).toBeTruthy();
});

Then('element {string} should not be visible', async function (this: CustomWorld, selector: string) {
  const isVisible = await this.page!.locator(selector).isVisible();
  expect(isVisible).toBeFalsy();
});

Then('element {string} should be enabled', async function (this: CustomWorld, selector: string) {
  const isEnabled = await this.page!.locator(selector).isEnabled();
  expect(isEnabled).toBeTruthy();
});

Then('element {string} should be disabled', async function (this: CustomWorld, selector: string) {
  const isEnabled = await this.page!.locator(selector).isEnabled();
  expect(isEnabled).toBeFalsy();
});

Then('element {string} should have text {string}', async function (this: CustomWorld, selector: string, expectedText: string) {
  const text = await this.page!.locator(selector).textContent();
  expect(text?.trim()).toBe(expectedText);
});

Then('element {string} should contain text {string}', async function (this: CustomWorld, selector: string, expectedText: string) {
  const text = await this.page!.locator(selector).textContent();
  expect(text).toContain(expectedText);
});

// Screenshots
When('I take a screenshot', async function (this: CustomWorld) {
  await this.attachScreenshot(`screenshot-${Date.now()}`);
});

When('I take a screenshot named {string}', async function (this: CustomWorld, name: string) {
  await this.attachScreenshot(name);
});
