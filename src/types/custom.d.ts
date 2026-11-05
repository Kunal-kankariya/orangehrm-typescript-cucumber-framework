import { Page, BrowserContext, Browser } from '@playwright/test';
import { LoginPage } from '../pages/login/LoginPage';
import { TestContext, User } from './index';

// Extend Cucumber World to include Playwright and custom properties
declare module '@cucumber/cucumber' {
  interface World {
    // Playwright objects
    browser?: Browser;
    context?: BrowserContext;
    page?: Page;

    // Page Objects
    loginPage?: LoginPage;

    // Test Context
    testContext?: TestContext;

    // Test Data
    currentUser?: User;
    testData?: Record<string, any>;

    // Session Data
    authToken?: string;
    sessionId?: string;

    // Scenario Information
    scenarioName?: string;
    scenarioTags?: string[];

    // Screenshots & Attachments
    screenshots?: string[];
    attachments?: Array<{
      data: Buffer;
      mediaType: string;
      fileName: string;
    }>;
  }
}

// Extend Playwright Page with custom helper methods (if you add any)
declare module '@playwright/test' {
  interface Page {
    // Add custom methods here if needed
    // waitForNetworkIdle(): Promise<void>;
    // scrollToBottom(): Promise<void>;
  }
}

export {};
