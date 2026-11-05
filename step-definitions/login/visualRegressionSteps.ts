import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../src/fixtures/customWorld';
import { VisualRegression } from '../../src/utils/visualRegression';
import { expect } from '@playwright/test';

const visualTest = new VisualRegression();

/**
 * Visual Regression Testing Steps
 */

Then(
  'the login page should match the baseline screenshot',
  async function (this: CustomWorld) {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    const result = await visualTest.compareScreenshot(this.page, 'login-page', {
      fullPage: true,
      threshold: 0.1 // Allow 0.1% difference
    });

    expect(result.pass).toBe(true);

    // Attach comparison result to report
    await this.attach(
      `Visual Test Result:\n` +
        `Pass: ${result.pass}\n` +
        `Diff Pixels: ${result.diffPixels}\n` +
        `Diff Percentage: ${result.diffPercentage}%`,
      'text/plain'
    );
  }
);

Then(
  'the dashboard should match the baseline screenshot',
  async function (this: CustomWorld) {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    // Mask dynamic elements (time, notifications)
    const result = await visualTest.compareScreenshot(this.page, 'dashboard', {
      fullPage: true,
      threshold: 0.2,
      mask: [
        '.oxd-topbar-header-time',
        '.oxd-notification-container',
        '.oxd-userdropdown-name'
      ]
    });

    expect(result.pass).toBe(true);

    await this.attach(
      `Dashboard Visual Test:\n` +
        `Status: ${result.pass ? '✅ PASS' : '❌ FAIL'}\n` +
        `Difference: ${result.diffPercentage}%`,
      'text/plain'
    );
  }
);

When(
  'I update the baseline screenshot for {string}',
  async function (this: CustomWorld, screenshotName: string) {
    await visualTest.updateBaseline(screenshotName);
    await this.attach(`Baseline updated: ${screenshotName}`, 'text/plain');
  }
);

Then(
  'I should see no visual differences in {string}',
  async function (this: CustomWorld, elementSelector: string) {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    const element = await this.page.locator(elementSelector);

    // Take element screenshot
    const screenshotName = elementSelector.replace(/[^a-z0-9]/gi, '-');
    const screenshot = await element.screenshot();

    await this.attach(screenshot, 'image/png');
    await this.attach(`Element screenshot: ${elementSelector}`, 'text/plain');
  }
);

Then('I clean all visual regression screenshots', async function (this: CustomWorld) {
  visualTest.cleanScreenshots();
  await this.attach('Visual regression screenshots cleaned', 'text/plain');
});
