import { Page, BrowserContext, Browser } from '@playwright/test';

// Global Environment Variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: 'dev' | 'qa' | 'staging' | 'prod';
      BASE_URL: string;
      API_URL: string;
      DB_HOST: string;
      DB_USER: string;
      DB_PASSWORD: string;
      LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
      HEADLESS: 'true' | 'false';
      BROWSER: 'chromium' | 'firefox' | 'webkit';
      SCREENSHOT_ON_FAILURE: 'true' | 'false';
      VIDEO_ON_FAILURE: 'true' | 'false';
      DEFAULT_TIMEOUT: string;
    }
  }
}

// Test Data Types
export interface User {
  username: string;
  password: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  firstName?: string;
  lastName?: string;
}

export interface TestData {
  users: Record<string, User>;
}

// API Types
export interface ApiResponse<T = any> {
  status: number;
  data: T;
  message?: string;
  timestamp: string;
  success: boolean;
}

export interface ApiRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

// Page Object Return Types
export interface LoginResult {
  success: boolean;
  token?: string;
  errorMessage?: string;
}

export interface NavigationResult {
  success: boolean;
  currentUrl?: string;
  error?: string;
}

// Custom Fixture Types
export interface TestContext {
  scenarioName: string;
  scenarioTags: string[];
  startTime: number;
  sessionId?: string;
  authToken?: string;
}

// Playwright Configuration
export interface BrowserOptions {
  headless: boolean;
  slowMo?: number;
  viewport?: {
    width: number;
    height: number;
  };
}

// Report Types
export interface TestResult {
  scenarioName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshots?: string[];
}

export {};
