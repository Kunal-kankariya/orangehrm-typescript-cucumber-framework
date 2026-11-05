import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { log } from '../../utils/logger';
import { LoginResult } from '../../types';

export class LoginPage extends BasePage {
  // OrangeHRM Locators
  private readonly usernameInput = 'input[name="username"]';
  private readonly passwordInput = 'input[name="password"]';
  private readonly loginButton = 'button[type="submit"]';
  private readonly errorMessage = '.oxd-alert-content-text';
  private readonly dashboardHeader = 'h6.oxd-topbar-header-breadcrumb-module';
  private readonly loginLogo = '.orangehrm-login-branding img';

  constructor(page: Page) {
    super(page);
  }

  // Navigate to login page
  async navigate(): Promise<void> {
    const baseUrl = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com';
    await this.navigateTo(`${baseUrl}/web/index.php/auth/login`);
    await this.waitForPageLoad();
    // Wait for login form to be visible
    await this.page.waitForSelector(this.usernameInput, {
      state: 'visible',
      timeout: 15000
    });
  }

  // Enter username
  async enterUsername(username: string): Promise<void> {
    log.info(`Entering username: ${username}`);
    await this.waitForElement(this.usernameInput);
    await this.fill(this.usernameInput, username);
  }

  // Enter password
  async enterPassword(password: string): Promise<void> {
    log.info('Entering password');
    await this.fill(this.passwordInput, password);
  }

  // Click login button
  async clickLoginButton(): Promise<void> {
    log.info('Clicking login button');
    await this.click(this.loginButton);
  }

  // Complete login flow
  async login(username: string, password: string): Promise<LoginResult> {
    try {
      await this.enterUsername(username);
      await this.enterPassword(password);
      await this.clickLoginButton();

      // Wait for navigation or error
      await this.page.waitForTimeout(2000);

      // Check if login was successful by looking for dashboard
      const isDashboard = await this.isDashboardVisible();

      if (isDashboard) {
        log.info('Login successful - Dashboard loaded');
        return {
          success: true
        };
      } else {
        const error = await this.getErrorMessage();
        log.error(`Login failed: ${error}`);
        return {
          success: false,
          errorMessage: error
        };
      }
    } catch (error) {
      log.error(`Login error: ${error}`);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get error message
  async getErrorMessage(): Promise<string> {
    try {
      if (await this.isVisible(this.errorMessage)) {
        return await this.getText(this.errorMessage);
      }
      return '';
    } catch {
      return '';
    }
  }

  // Verify login page loaded
  async isLoginPageLoaded(): Promise<boolean> {
    try {
      // Wait for username field first
      await this.page.waitForSelector(this.usernameInput, {
        state: 'visible',
        timeout: 10000
      });

      // Then check all elements
      return (
        (await this.isVisible(this.usernameInput)) &&
        (await this.isVisible(this.passwordInput)) &&
        (await this.isVisible(this.loginButton))
      );
    } catch (error) {
      log.error(`Login page not loaded: ${error}`);
      return false;
    }
  }

  // Check if dashboard is visible (successful login)
  async isDashboardVisible(): Promise<boolean> {
    try {
      await this.page.waitForSelector(this.dashboardHeader, {
        state: 'visible',
        timeout: 10000
      });
      return true;
    } catch {
      return false;
    }
  }

  // Verify error is displayed
  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  // Get dashboard title (after successful login)
  async getDashboardTitle(): Promise<string> {
    try {
      return await this.getText(this.dashboardHeader);
    } catch {
      return '';
    }
  }
}
