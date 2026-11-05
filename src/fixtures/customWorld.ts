import { World, IWorldOptions } from '@cucumber/cucumber';
import { BrowserContext, Page, Browser, chromium, firefox, webkit } from '@playwright/test';
import { LoginPage } from '../pages/login/LoginPage';
import { TestContext } from '../types';
import { log } from '../utils/logger';

export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  // Page Objects
  loginPage?: LoginPage;

  // Test Context
  testContext?: TestContext;
  scenarioName?: string;
  scenarioTags?: string[];

  // Test Data
  currentUser?: any;
  testData?: Record<string, any>;

  // Session Data
  authToken?: string;
  sessionId?: string;

  // Screenshots
  screenshots: string[] = [];

  constructor(options: IWorldOptions) {
    super(options);
  }

  // Initialize browser and page
  async init(): Promise<void> {
    const browserType = process.env.BROWSER || 'chromium';
    const headless = process.env.HEADLESS === 'true';

    log.info(`Launching ${browserType} browser (headless: ${headless})`);

    // Launch browser
    switch (browserType) {
      case 'firefox':
        this.browser = await firefox.launch({ headless });
        break;
      case 'webkit':
        this.browser = await webkit.launch({ headless });
        break;
      default:
        this.browser = await chromium.launch({ headless });
    }

    // Create context
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo:
        process.env.VIDEO_ON_FAILURE === 'true' ? { dir: 'reports/videos' } : undefined
    });

    // Create page
    this.page = await this.context.newPage();

    // Set default timeout
    const timeout = parseInt(process.env.DEFAULT_TIMEOUT || '30000');
    this.page.setDefaultTimeout(timeout);

    // Initialize page objects
    this.loginPage = new LoginPage(this.page);

    log.info('Browser and page initialized successfully');
  }

  // Cleanup
  async cleanup(): Promise<void> {
    log.info('Cleaning up browser resources');

    if (this.page) {
      await this.page.close();
    }

    if (this.context) {
      await this.context.close();
    }

    if (this.browser) {
      await this.browser.close();
    }
  }

  // Attach screenshot
  async attachScreenshot(name: string): Promise<void> {
    if (this.page) {
      const screenshot = await this.page.screenshot({ fullPage: true });
      this.attach(screenshot, 'image/png');
      this.screenshots.push(name);
      log.info(`Screenshot attached: ${name}`);
    }
  }
}
