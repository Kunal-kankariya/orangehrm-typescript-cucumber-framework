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
import fs from 'fs';

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

  // Always take screenshot and video on failure
  if (status === Status.FAILED) {
    try {
      // Take screenshot
      const screenshotPath = path.join(
        process.cwd(),
        'screenshots',
        `failure-${pickle.name.replace(/\s+/g, '-')}-${Date.now()}.png`
      );

      // Ensure screenshots directory exists
      const screenshotDir = path.dirname(screenshotPath);
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      if (this.page) {
        const screenshot = await this.page.screenshot({ path: screenshotPath, fullPage: true });

        // Attach to Cucumber report
        await this.attach(screenshot, 'image/png');

        // Attach to Allure report
        if (fs.existsSync(screenshotPath)) {
          await this.attach(fs.readFileSync(screenshotPath), {
            mediaType: 'image/png',
            fileName: `failure-screenshot-${Date.now()}.png`
          });
        }

        log.info(`📸 Screenshot saved: ${screenshotPath}`);
      }

      // Attach video path if video recording is enabled
      if (this.context) {
        const videoPath = await this.page?.video()?.path();
        if (videoPath && fs.existsSync(videoPath)) {
          log.info(`🎥 Video saved: ${videoPath}`);

          // Wait for video to be saved
          await this.page?.close();
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Attach video to report
          if (fs.existsSync(videoPath)) {
            await this.attach(fs.readFileSync(videoPath), {
              mediaType: 'video/webm',
              fileName: `failure-video-${Date.now()}.webm`
            });
          }
        }
      }

      // Attach error message and stack trace to Allure
      if (result?.message) {
        await this.attach(`Error: ${result.message}`, 'text/plain');
      }

    } catch (error) {
      log.error(`Failed to capture screenshot/video: ${error}`);
    }
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
