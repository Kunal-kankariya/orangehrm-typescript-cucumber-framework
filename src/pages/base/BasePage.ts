import { Page, Locator } from '@playwright/test';
import { log } from '../../utils/logger';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation methods
  async navigateTo(url: string): Promise<void> {
    log.page.navigate(url);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async reload(): Promise<void> {
    log.info('Reloading page');
    await this.page.reload();
  }

  async goBack(): Promise<void> {
    log.info('Navigating back');
    await this.page.goBack();
  }

  async goForward(): Promise<void> {
    log.info('Navigating forward');
    await this.page.goForward();
  }

  // Wait methods
  async waitForElement(
    selector: string,
    timeout: number = 30000
  ): Promise<void> {
    log.debug(`Waiting for element: ${selector}`);
    await this.page.waitForSelector(selector, { timeout, state: 'visible' });
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForNetworkIdle(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  // Click methods
  async click(selector: string): Promise<void> {
    log.page.click(selector);
    await this.page.waitForSelector(selector, { state: 'visible' });
    await this.page.locator(selector).click();
  }

  async doubleClick(selector: string): Promise<void> {
    log.debug(`Double clicking element: ${selector}`);
    await this.page.locator(selector).dblclick();
  }

  async forceClick(selector: string): Promise<void> {
    log.debug(`Force clicking element: ${selector}`);
    await this.page.locator(selector).click({ force: true });
  }

  async clickByText(text: string): Promise<void> {
    log.debug(`Clicking element with text: ${text}`);
    await this.page.locator(`text=${text}`).click();
  }

  // Input methods
  async fill(selector: string, text: string): Promise<void> {
    log.page.fill(selector, text);
    await this.page.locator(selector).fill(text);
  }

  async clearAndFill(selector: string, text: string): Promise<void> {
    log.debug(`Clearing and filling ${selector}`);
    await this.page.locator(selector).clear();
    await this.page.locator(selector).fill(text);
  }

  async type(selector: string, text: string, delay: number = 50): Promise<void> {
    log.debug(`Typing in ${selector}: ${text}`);
    await this.page.locator(selector).type(text, { delay });
  }

  async pressKey(key: string): Promise<void> {
    log.debug(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  // Dropdown methods
  async selectDropdown(selector: string, value: string): Promise<void> {
    log.debug(`Selecting ${value} from dropdown ${selector}`);
    await this.page.locator(selector).selectOption(value);
  }

  async selectDropdownByText(selector: string, text: string): Promise<void> {
    log.debug(`Selecting option with text ${text} from ${selector}`);
    await this.page.locator(selector).selectOption({ label: text });
  }

  // Checkbox & Radio methods
  async check(selector: string): Promise<void> {
    log.debug(`Checking checkbox: ${selector}`);
    await this.page.locator(selector).check();
  }

  async uncheck(selector: string): Promise<void> {
    log.debug(`Unchecking checkbox: ${selector}`);
    await this.page.locator(selector).uncheck();
  }

  // Assertion helpers
  async isVisible(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isVisible();
    } catch {
      return false;
    }
  }

  async isEnabled(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isEnabled();
    } catch {
      return false;
    }
  }

  async isChecked(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isChecked();
  }

  // Get methods
  async getText(selector: string): Promise<string> {
    const text = await this.page.locator(selector).textContent();
    return text?.trim() || '';
  }

  async getInputValue(selector: string): Promise<string> {
    return await this.page.locator(selector).inputValue();
  }

  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return await this.page.locator(selector).getAttribute(attribute);
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  // Scroll methods
  async scrollToElement(selector: string): Promise<void> {
    log.debug(`Scrolling to element: ${selector}`);
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async scrollToBottom(): Promise<void> {
    log.debug('Scrolling to bottom of page');
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollToTop(): Promise<void> {
    log.debug('Scrolling to top of page');
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  // Screenshot methods
  async takeScreenshot(name: string): Promise<Buffer> {
    log.info(`Taking screenshot: ${name}`);
    return await this.page.screenshot({
      path: `reports/screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    });
  }

  async takeElementScreenshot(selector: string, name: string): Promise<Buffer> {
    log.info(`Taking element screenshot: ${name}`);
    return await this.page.locator(selector).screenshot({
      path: `reports/screenshots/${name}-${Date.now()}.png`
    });
  }

  // Alert/Dialog methods
  async handleAlert(action: 'accept' | 'dismiss', promptText?: string): Promise<void> {
    log.info(`Handling alert: ${action}`);
    this.page.on('dialog', async (dialog) => {
      if (action === 'accept') {
        await dialog.accept(promptText);
      } else {
        await dialog.dismiss();
      }
    });
  }

  // Hover methods
  async hover(selector: string): Promise<void> {
    log.debug(`Hovering over element: ${selector}`);
    await this.page.locator(selector).hover();
  }

  // Count methods
  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  // Wait methods with custom conditions
  async waitForTimeout(timeout: number): Promise<void> {
    await this.page.waitForTimeout(timeout);
  }

  async waitForUrl(url: string | RegExp, timeout: number = 30000): Promise<void> {
    await this.page.waitForURL(url, { timeout });
  }
}
