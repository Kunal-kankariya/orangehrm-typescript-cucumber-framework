# 🚀 Advanced Features Setup Guide

This guide explains how to use the advanced features in this framework.

---

## 📧 Email Reports

### Setup Gmail for Email Notifications

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App-Specific Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter: "Playwright Test Reports"
   - Click "Generate"
   - Copy the 16-character password

3. **Add to GitHub Secrets**
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `EMAIL_USER`: `[REDACTED_EMAIL_ADDRESS_2]`
     - `EMAIL_PASSWORD`: `your-16-char-app-password`

4. **Test Locally**
   ```bash
   # Set environment variables
   export EMAIL_USER="[REDACTED_EMAIL_ADDRESS_2]"
   export EMAIL_PASSWORD="your-app-password"

   # Run tests and send email
   npm test
   npm run email:report
   ```

### Email Report Features

- ✅ Beautiful HTML email with test statistics
- 📊 Pass/Fail metrics with percentages
- 📧 Auto-sends after every test run in CI/CD
- 📎 Attaches JSON report for detailed analysis
- 🎨 Professional styling with graphs

---

## ✨ Allure Reports

### Generate Allure Reports Locally

```bash
# Run tests
npm test

# Generate Allure report
npm run allure:generate

# Open report in browser
npm run allure:open

# Or serve report (auto-opens browser)
npm run allure:serve
```

### Allure Report Features

- 📊 **Beautiful Interactive Dashboard**
- 📈 **Test Trends** (historical data)
- 📸 **Screenshots on failure** (auto-attached)
- 🎥 **Video recordings** (failed tests)
- 📝 **Step-by-step execution** details
- ⏱️ **Duration graphs**
- 📋 **Categories and tags**
- 🔍 **Search and filter** capabilities

### View Allure Reports in GitHub Actions

After each run:
1. Go to: **Actions** → Select workflow run
2. Scroll to **Artifacts**
3. Download `allure-report-combined`
4. Extract and open `index.html`

Or view the deployed report:
- https://your-username.github.io/your-repo-name/allure-report

---

## 👁️ Visual Regression Testing

### How to Use

```typescript
import { VisualRegression } from '../src/utils/visualRegression';

const visualTest = new VisualRegression();

// Take screenshot and compare with baseline
const result = await visualTest.compareScreenshot(
  page,
  'login-page',
  {
    fullPage: true,
    threshold: 0.1, // 0.1% difference allowed
    mask: ['.dynamic-element'] // Mask dynamic elements
  }
);

if (!result.pass) {
  console.log(`Visual test failed: ${result.diffPercentage}% difference`);
}
```

### First Time Setup

1. **Generate Baselines**
   ```bash
   # Run tests first time - creates baseline screenshots
   npm test
   ```

2. **Baseline images saved in:**
   ```
   screenshots/
   ├── baseline/     # Golden images (committed to git)
   ├── actual/       # Current test screenshots
   └── diff/         # Difference images (when tests fail)
   ```

3. **Commit baselines to Git**
   ```bash
   git add screenshots/baseline/
   git commit -m "chore: add visual regression baselines"
   git push
   ```

### Update Baselines

When UI intentionally changes:

```typescript
// Update baseline after verifying changes are correct
await visualTest.updateBaseline('login-page');
```

Or manually:
```bash
# Copy actual to baseline
cp screenshots/actual/login-page.png screenshots/baseline/login-page.png
```

---

## ⚡ Parallel Execution

### Run Tests in Parallel Locally

```bash
# Run with 4 parallel workers
npm run test:parallel

# Or specify workers
cucumber-js --config cucumber.config.js --parallel 8
```

### Parallel Execution in CI/CD

Already configured! GitHub Actions runs tests in 4 parallel shards automatically.

**Benefits:**
- 🚀 4x faster execution
- ⚡ Each shard runs independently
- 📊 Combined reports at the end

---

## ⏰ Scheduled Runs

### Configured Schedules

GitHub Actions runs automatically:

1. **Nightly Build** 🌙
   - Runs every day at 2 AM UTC
   - Full regression suite
   - Email report sent

2. **Weekly Regression** 📅
   - Runs every Sunday at 6 AM UTC
   - Complete test suite
   - Detailed Allure report

### Manual Trigger

You can also trigger runs manually:
1. Go to: **Actions** → **Playwright Cucumber Tests**
2. Click **Run workflow**
3. Select branch and click **Run workflow**

---

## 📸 Screenshots & Videos

### Automatic Capture on Failure

Already configured! On test failure:

1. **📸 Screenshot**
   - Full page screenshot
   - Saved to `screenshots/` folder
   - Attached to Cucumber & Allure reports

2. **🎥 Video Recording**
   - Complete test execution video
   - Saved to `videos/` folder  
   - Attached to Allure report
   - Only kept for failed tests (saves space)

### Manual Screenshot

```typescript
// In your test steps
const screenshotPath = await page.screenshot({
  path: 'screenshots/my-screenshot.png',
  fullPage: true
});
```

### Access in CI/CD

After each run:
1. Go to workflow run
2. Download artifacts:
   - `screenshots-chromium-*`
   - `videos-chromium-*`

---

## 🎯 Run Different Test Suites

```bash
# Smoke tests only
npm run test:smoke

# Regression tests
npm run test:regression

# Specific environment
npm run test:dev
npm run test:qa
npm run test:staging

# Parallel execution
npm run test:parallel

# All reports
npm run report:all
```

---

## 📊 View Reports

### Local Reports

```bash
# HTML Report
open reports/html/cucumber-report.html

# Allure Report
npm run allure:serve
```

### CI/CD Reports

1. **Allure Report**: https://your-username.github.io/your-repo-name/allure-report
2. **Artifacts**: Download from GitHub Actions artifacts
3. **Email**: Check [REDACTED_EMAIL_ADDRESS_2]

---

## 🔧 Environment Variables

Add to GitHub Secrets:

| Secret | Description | Example |
|--------|-------------|---------|
| `EMAIL_USER` | Gmail address | `[REDACTED_EMAIL_ADDRESS_2]` |
| `EMAIL_PASSWORD` | Gmail app password | `xxxx xxxx xxxx xxxx` |

---

## 📈 Test Trends

Allure automatically tracks:
- ✅ Pass/Fail trends over time
- ⏱️ Duration trends
- 📊 Flaky test detection
- 📉 Test health metrics

View in Allure Report → Graphs section

---

## 🎨 What You Get

### 1. Beautiful Allure Reports
- Interactive dashboard
- Graphs and charts
- Screenshot and video attachments
- Step-by-step execution

### 2. Email Notifications
- Automatic after each run
- Beautiful HTML template
- Pass/Fail statistics
- JSON report attached

### 3. Visual Regression
- Screenshot comparison
- Pixel-level differences
- Configurable thresholds
- Automatic baseline management

### 4. Parallel Execution
- 4x faster tests
- Shard-based execution
- Combined reports

### 5. Scheduled Runs
- Nightly builds (2 AM UTC)
- Weekly regression (Sunday 6 AM)
- Manual triggers

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# Generate all reports
npm run report:all

# Send email report (if configured)
npm run email:report

# Open Allure report
npm run allure:serve
```

---

## 📚 More Resources

- [Allure Documentation](https://docs.qameta.io/allure/)
- [Playwright Video Guide](https://playwright.dev/docs/videos)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Visual Regression Testing](https://playwright.dev/docs/test-snapshots)

---

🤖 **Generated with [Claude Code](https://claude.com/claude-code)**
