import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { log } from './logger';

export class VisualRegression {
  private baselineDir: string;
  private actualDir: string;
  private diffDir: string;

  constructor() {
    this.baselineDir = path.join(process.cwd(), 'screenshots', 'baseline');
    this.actualDir = path.join(process.cwd(), 'screenshots', 'actual');
    this.diffDir = path.join(process.cwd(), 'screenshots', 'diff');

    // Create directories if they don't exist
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist(): void {
    [this.baselineDir, this.actualDir, this.diffDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Take a screenshot and compare with baseline
   */
  async compareScreenshot(
    page: Page,
    screenshotName: string,
    options: {
      fullPage?: boolean;
      threshold?: number;
      mask?: string[];
    } = {}
  ): Promise<{ pass: boolean; diffPixels: number; diffPercentage: number }> {
    const { fullPage = true, threshold = 0.1, mask = [] } = options;

    const baselinePath = path.join(this.baselineDir, `${screenshotName}.png`);
    const actualPath = path.join(this.actualDir, `${screenshotName}.png`);
    const diffPath = path.join(this.diffDir, `${screenshotName}.png`);

    // Take screenshot
    await page.screenshot({
      path: actualPath,
      fullPage,
      mask: mask.length > 0 ? await Promise.all(mask.map(selector => page.locator(selector).first())) : undefined
    });

    // If baseline doesn't exist, create it
    if (!fs.existsSync(baselinePath)) {
      log.info(`Baseline not found. Creating baseline: ${screenshotName}`);
      fs.copyFileSync(actualPath, baselinePath);
      return { pass: true, diffPixels: 0, diffPercentage: 0 };
    }

    // Compare screenshots
    const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
    const img2 = PNG.sync.read(fs.readFileSync(actualPath));

    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(
      img1.data,
      img2.data,
      diff.data,
      width,
      height,
      { threshold }
    );

    // Write diff image
    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    const totalPixels = width * height;
    const diffPercentage = (numDiffPixels / totalPixels) * 100;

    const pass = diffPercentage <= threshold;

    if (pass) {
      log.info(`✅ Visual test passed: ${screenshotName} (${diffPercentage.toFixed(2)}% diff)`);
    } else {
      log.error(`❌ Visual test failed: ${screenshotName} (${diffPercentage.toFixed(2)}% diff)`);
      log.error(`Diff image saved: ${diffPath}`);
    }

    return {
      pass,
      diffPixels: numDiffPixels,
      diffPercentage: parseFloat(diffPercentage.toFixed(2))
    };
  }

  /**
   * Update baseline with current screenshot
   */
  async updateBaseline(screenshotName: string): Promise<void> {
    const actualPath = path.join(this.actualDir, `${screenshotName}.png`);
    const baselinePath = path.join(this.baselineDir, `${screenshotName}.png`);

    if (fs.existsSync(actualPath)) {
      fs.copyFileSync(actualPath, baselinePath);
      log.info(`✅ Baseline updated: ${screenshotName}`);
    } else {
      log.error(`❌ Actual screenshot not found: ${screenshotName}`);
    }
  }

  /**
   * Clean all actual and diff screenshots
   */
  cleanScreenshots(): void {
    [this.actualDir, this.diffDir].forEach((dir) => {
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach((file) => {
          fs.unlinkSync(path.join(dir, file));
        });
      }
    });
    log.info('✅ Cleaned actual and diff screenshots');
  }
}
