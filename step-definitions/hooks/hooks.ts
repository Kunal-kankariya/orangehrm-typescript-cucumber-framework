import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  BeforeStep,
  AfterStep,
  Status,
  setDefaultTimeout,
  setWorldConstructor
} from '@cucumber/cucumber';
import { CustomWorld } from '../../src/fixtures/customWorld';
import { log } from '../../src/utils/logger';
import dotenv from 'dotenv';
import path from 'path';

// Set custom world constructor
setWorldConstructor(CustomWorld);

// Set default timeout
setDefaultTimeout(60000);

// Load environment variables
BeforeAll(async function () {
  log.info('========================================');
  log.info('TEST EXECUTION STARTED');
  log.info('========================================');

  // Load base .env file
  dotenv.config();

  // Load environment-specific config
  const env = process.env.ENV || 'dev';
  const envPath = path.join(process.cwd(), 'src', 'config', 'env', `${env}.env`);
  dotenv.config({ path: envPath });

  log.info(`Environment: ${env}`);
  log.info(`Base URL: ${process.env.BASE_URL}`);
  log.info(`Browser: ${process.env.BROWSER || 'chromium'}`);
  log.info(`Headless: ${process.env.HEADLESS || 'false'}`);
  log.info('========================================');
});

// Before each scenario
Before(async function (this: CustomWorld, { pickle }) {
  this.scenarioName = pickle.name;
  this.scenarioTags = pickle.tags.map((tag) => tag.name);

  log.scenario.start(pickle.name);
  log.info(`Tags: ${this.scenarioTags.join(', ')}`);

  // Initialize browser and page
  await this.init();

  // Store start time
  this.testContext = {
    scenarioName: pickle.name,
    scenarioTags: this.scenarioTags,
    startTime: Date.now()
  };
});

// After each scenario
After(async function (this: CustomWorld, { pickle, result }) {
  const duration = Date.now() - (this.testContext?.startTime || 0);
  const status = result?.status || Status.UNKNOWN;

  log.scenario.end(pickle.name, status);
  log.info(`Duration: ${duration}ms`);

  // Take screenshot on failure
  if (status === Status.FAILED && process.env.SCREENSHOT_ON_FAILURE === 'true') {
    await this.attachScreenshot(`failure-${pickle.name}-${Date.now()}`);
  }

  // Cleanup browser resources
  await this.cleanup();
});

// Before each step
BeforeStep(async function (this: CustomWorld, { pickleStep }) {
  log.step.start(pickleStep.text);
});

// After each step
AfterStep(async function (this: CustomWorld, { pickleStep, result }) {
  const status = result.status;

  if (status === Status.PASSED) {
    log.step.end(pickleStep.text);
  } else if (status === Status.FAILED) {
    log.error(`Step failed: ${pickleStep.text}`);
    if (result.message) {
      log.error(`Error: ${result.message}`);
    }
  }
});

// After all scenarios
AfterAll(async function () {
  log.info('========================================');
  log.info('TEST EXECUTION COMPLETED');
  log.info('========================================');
});
