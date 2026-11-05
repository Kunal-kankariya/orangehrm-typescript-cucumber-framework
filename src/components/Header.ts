import { Page } from '@playwright/test';
import { log } from '../utils/logger';

export class Header {
  private page: Page;

  // Locators
  private readonly logo = '[data-testid="logo"]';
  private readonly searchBox = 'input[placeholder="Search..."]';
  private readonly userMenu = '[data-testid="user-menu"]';
  private readonly logoutBtn = 'text=Logout';
  private readonly profileBtn = 'text=Profile';
  private readonly settingsBtn = 'text=Settings';
  private readonly notificationIcon = '[data-testid="notifications"]';
  private readonly notificationBadge = '[data-testid="notification-badge"]';

  constructor(page: Page) {
    this.page = page;
  }

  // Click logo
  async clickLogo(): Promise<void> {
    log.info('Clicking logo');
    await this.page.locator(this.logo).click();
  }

  // Search functionality
  async searchFor(query: string): Promise<void> {
    log.info(`Searching for: ${query}`);
    await this.page.locator(this.searchBox).fill(query);
    await this.page.locator(this.searchBox).press('Enter');
  }

  // Open user menu
  async openUserMenu(): Promise<void> {
    log.info('Opening user menu');
    await this.page.locator(this.userMenu).click();
  }

  // Logout
  async logout(): Promise<void> {
    log.info('Logging out from header');
    await this.openUserMenu();
    await this.page.locator(this.logoutBtn).click();
  }

  // Go to profile
  async goToProfile(): Promise<void> {
    log.info('Navigating to profile');
    await this.openUserMenu();
    await this.page.locator(this.profileBtn).click();
  }

  // Go to settings
  async goToSettings(): Promise<void> {
    log.info('Navigating to settings');
    await this.openUserMenu();
    await this.page.locator(this.settingsBtn).click();
  }

  // Get notification count
  async getNotificationCount(): Promise<number> {
    const badge = this.page.locator(this.notificationBadge);
    const isVisible = await badge.isVisible();
    if (isVisible) {
      const count = await badge.textContent();
      return parseInt(count || '0');
    }
    return 0;
  }

  // Click notifications
  async clickNotifications(): Promise<void> {
    log.info('Clicking notifications');
    await this.page.locator(this.notificationIcon).click();
  }

  // Verify header is visible
  async isHeaderVisible(): Promise<boolean> {
    return await this.page.locator(this.logo).isVisible();
  }
}
