import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../src/fixtures/customWorld';

Given('I am on the login page', async function (this: CustomWorld) {
  await this.loginPage!.navigate();
  const isLoaded = await this.loginPage!.isLoginPageLoaded();
  expect(isLoaded).toBeTruthy();
});

Given('I navigate to the login page', async function (this: CustomWorld) {
  await this.loginPage!.navigate();
});

When('I enter username {string}', async function (this: CustomWorld, username: string) {
  await this.loginPage!.enterUsername(username);
});

When('I enter password {string}', async function (this: CustomWorld, password: string) {
  await this.loginPage!.enterPassword(password);
});

When('I click the login button', async function (this: CustomWorld) {
  await this.loginPage!.clickLoginButton();
});

When(
  'I login with username {string} and password {string}',
  async function (this: CustomWorld, username: string, password: string) {
    const result = await this.loginPage!.login(username, password);
    this.testData = { loginResult: result };
  }
);

When('I login with valid credentials', async function (this: CustomWorld) {
  const username = 'Admin';
  const password = '[REDACTED_GENERIC_PASSWORD_1]';

  const result = await this.loginPage!.login(username, password);
  this.testData = { loginResult: result };
});

Then('I should see the login page', async function (this: CustomWorld) {
  const isLoaded = await this.loginPage!.isLoginPageLoaded();
  expect(isLoaded).toBeTruthy();
});

Then('I should see error message', async function (this: CustomWorld) {
  const isErrorDisplayed = await this.loginPage!.isErrorDisplayed();
  expect(isErrorDisplayed).toBeTruthy();
});

Then('I should be redirected to the dashboard', async function (this: CustomWorld) {
  const isDashboard = await this.loginPage!.isDashboardVisible();
  expect(isDashboard).toBeTruthy();
});

Then('login should be successful', async function (this: CustomWorld) {
  const loginResult = this.testData?.loginResult;
  if (loginResult) {
    expect(loginResult.success).toBeTruthy();
  } else {
    // If no loginResult in testData, check dashboard visibility
    const isDashboard = await this.loginPage!.isDashboardVisible();
    expect(isDashboard).toBeTruthy();
  }
});

Then('login should fail', async function (this: CustomWorld) {
  const loginResult = this.testData?.loginResult;
  expect(loginResult?.success).toBeFalsy();
});

Then('the dashboard title should be {string}', async function (this: CustomWorld, expectedTitle: string) {
  const dashboardTitle = await this.loginPage!.getDashboardTitle();
  expect(dashboardTitle).toBe(expectedTitle);
});
