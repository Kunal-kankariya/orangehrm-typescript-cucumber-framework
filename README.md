# 🧪 OrangeHRM TypeScript Cucumber Framework

![Tests](https://github.com/Kunal-kankariya/orangehrm-typescript-cucumber-framework/actions/workflows/ci.yml/badge.svg)
![Playwright](https://img.shields.io/badge/Playwright-1.49-green)
![Cucumber](https://img.shields.io/badge/Cucumber-11.0-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Node](https://img.shields.io/badge/Node-18+-green)
![License](https://img.shields.io/badge/License-ISC-blue)

**Enterprise-grade Test Automation Framework** with Playwright, Cucumber, TypeScript, and BDD

---

## 🚀 Features

### Core Framework
- ✅ **Playwright** - Modern browser automation
- ✅ **Cucumber** - BDD with Gherkin syntax
- ✅ **TypeScript** - Type-safe code
- ✅ **Page Object Model** - Scalable architecture
- ✅ **BasePage Pattern** - Reusable utilities
- ✅ **Winston Logger** - Professional logging
- ✅ **Multi-Environment** - Dev/QA/Staging configs

### Advanced Features ✨
- ✨ **Allure Reports** - Beautiful interactive dashboards
- 📧 **Email Notifications** - Auto-send test results
- 👁️ **Visual Regression** - Screenshot comparison
- ⚡ **Parallel Execution** - 4x faster tests
- 📸 **Auto Screenshots** - Capture failures
- 🎥 **Video Recording** - Record failed tests
- ⏰ **Scheduled Runs** - Nightly/Weekly automation
- 🤖 **GitHub Copilot** - AI code reviews

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/Kunal-kankariya/orangehrm-typescript-cucumber-framework.git

# Navigate to project
cd orangehrm-typescript-cucumber-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Run Tests

```bash
# Run all tests
npm test

# Run with specific environment
npm run test:qa

# Run smoke tests only
npm run test:smoke

# Run in parallel (4 workers)
npm run test:parallel

# Run regression tests
npm run test:regression
```

---

## 📊 Reports

### Cucumber HTML Report
```bash
npm run report
open reports/html/cucumber-report.html
```

### Allure Report (New! ✨)
```bash
# Generate and open Allure report
npm run allure:serve

# Or generate separately
npm run allure:generate
npm run allure:open
```

### Email Report (New! 📧)
```bash
# Send email with test results
npm run email:report
```

**View Reports Online:**
- 📊 Allure Dashboard: https://kunal-kankariya.github.io/orangehrm-typescript-cucumber-framework/allure-report

---

## 🏗️ Project Structure

```
📂 orangehrm-typescript-cucumber-framework/
├── 📂 features/                    # Feature files (Gherkin)
│   └── login/
│       ├── login.feature
│       └── visual-regression.feature
├── 📂 step-definitions/           # Step definitions
│   ├── hooks/                     # Cucumber hooks
│   ├── login/                     # Login steps
│   └── common/                    # Common steps
├── 📂 src/
│   ├── 📂 pages/                  # Page Object Model
│   │   ├── base/                  # BasePage
│   │   ├── login/                 # LoginPage
│   │   └── components/            # Reusable components
│   ├── 📂 utils/                  # Utilities
│   │   ├── logger.ts              # Winston logger
│   │   └── visualRegression.ts   # Visual testing (New!)
│   ├── 📂 config/                 # Configuration
│   │   └── env/                   # Environment configs
│   ├── 📂 fixtures/               # Test fixtures
│   │   └── customWorld.ts         # Cucumber World
│   └── 📂 types/                  # TypeScript types
├── 📂 test-data/                  # Test data (JSON/CSV)
├── 📂 scripts/                    # Utility scripts
│   ├── generate-report.js
│   ├── generate-allure-results.js    # Allure converter (New!)
│   └── send-email-report.js          # Email sender (New!)
├── 📂 .github/workflows/          # GitHub Actions
│   ├── ci.yml                     # Main CI/CD pipeline
│   └── copilot-review.yml         # Copilot code review
├── 📄 README.md                   # This file
└── 📄 SETUP.md                    # Advanced features setup
```

---

## 🎯 Architecture

### Page Object Model (POM)

**BasePage** - Common methods for all pages
```typescript
class BasePage {
  click(), fill(), waitForElement(), getText()
  scrollToElement(), takeScreenshot(), etc.
}
```

**LoginPage** extends BasePage
```typescript
class LoginPage extends BasePage {
  async login(username, password) { ... }
  async enterUsername() { ... }
}
```

---

## 🧪 Writing Tests

### Feature File (Gherkin)
```gherkin
@smoke @login
Feature: User Login
  
  Scenario: Valid login
    Given I am on the OrangeHRM login page
    When I enter username "Admin"
    And I enter password "[REDACTED_GENERIC_PASSWORD_1]"
    And I click the login button
    Then I should see the dashboard
```

### Step Definition (TypeScript)
```typescript
Given('I am on the OrangeHRM login page', async function(this: CustomWorld) {
  await this.loginPage.navigate();
});

When('I enter username {string}', async function(this: CustomWorld, username: string) {
  await this.loginPage.enterUsername(username);
});
```

---

## ⚙️ Configuration

### Environment Files
- `src/config/env/dev.env` - Development
- `src/config/env/qa.env` - QA
- `src/config/env/staging.env` - Staging

```env
BASE_URL=https://opensource-demo.orangehrmlive.com
BROWSER=chromium
HEADLESS=true
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**Triggers:**
- Push to `main` or `develop`
- Pull requests
- Scheduled runs (nightly at 2 AM UTC, weekly on Sunday 6 AM UTC)
- Manual trigger

**Features:**
- ✅ Parallel execution (4 shards)
- ✅ Multi-browser support
- ✅ Screenshot & video capture
- ✅ Allure report generation
- ✅ Deploy to GitHub Pages
- ✅ Email notifications
- ✅ Artifact uploads

---

## 📧 Email Notifications (New! ✨)

Automatic email reports sent to: `[REDACTED_EMAIL_ADDRESS_2]`

**Setup:**
1. Generate Gmail app password
2. Add GitHub Secrets:
   - `EMAIL_USER`: [REDACTED_EMAIL_ADDRESS_2]
   - `EMAIL_PASSWORD`: your-app-password
3. See `SETUP.md` for detailed instructions

---

## 👁️ Visual Regression Testing (New! ✨)

```typescript
import { VisualRegression } from './src/utils/visualRegression';

const visualTest = new VisualRegression();

// Compare with baseline
const result = await visualTest.compareScreenshot(
  page, 
  'login-page',
  { threshold: 0.1, fullPage: true }
);
```

**Features:**
- Screenshot comparison
- Pixel-level difference detection
- Configurable thresholds
- Mask dynamic elements
- Auto-baseline management

---

## 📈 Test Reports Features

### Allure Report Includes:
- ✅ Pass/Fail statistics
- ✅ Duration metrics & trends
- ✅ Test trend analysis (historical data)
- ✅ Flaky test detection
- ✅ Screenshot attachments
- ✅ Video recordings
- ✅ Step-by-step execution logs
- ✅ Environment information

### Email Report Includes:
- ✅ Beautiful HTML template
- ✅ Pass/Fail metrics with percentages
- ✅ Test duration
- ✅ Environment details
- ✅ JSON report attachment

---

## 🛠️ Development

### Run Linting
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

### Type Check
```bash
npm run type-check
```

### Clean Reports
```bash
npm run clean
```

---

## 📚 Documentation

- **README.md** - This file (Quick start & overview)
- **SETUP.md** - Advanced features setup guide
- **PULL_REQUEST_TEMPLATE.md** - PR template

---

## 🎓 Best Practices

✅ Use Page Object Model  
✅ Keep step definitions simple  
✅ Reuse common steps  
✅ Use meaningful scenario names  
✅ Tag tests appropriately (@smoke, @regression)  
✅ Keep test data separate  
✅ Use BasePage for common operations  
✅ Log important actions  
✅ Take screenshots on failures  
✅ Write self-documenting code  

---

## 🔧 Troubleshooting

### Issue: Browser not installed
```bash
npx playwright install chromium --with-deps
```

### Issue: Tests fail locally but pass in CI
- Check environment variables
- Verify BASE_URL is correct
- Check browser version

### Issue: Email not sending
- Verify GitHub Secrets are set
- Check Gmail app password
- See SETUP.md for configuration

---

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Playwright** | Browser automation |
| **Cucumber** | BDD framework |
| **TypeScript** | Type-safe language |
| **Winston** | Logging |
| **Allure** | Test reporting |
| **Nodemailer** | Email notifications |
| **Pixelmatch** | Visual regression |
| **GitHub Actions** | CI/CD |

---

## 📊 Current Status

![Tests](https://github.com/Kunal-kankariya/orangehrm-typescript-cucumber-framework/actions/workflows/ci.yml/badge.svg)

- ✅ Framework: Complete
- ✅ CI/CD: Configured
- ✅ Reports: Integrated
- ✅ Documentation: Complete
- ✅ Advanced Features: Added

---

## 👨‍💻 Author

**Kunal Kankriya**
- GitHub: [@Kunal-kankariya](https://github.com/Kunal-kankariya)
- Email: [REDACTED_EMAIL_ADDRESS_2]

---

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/)
- [Cucumber](https://cucumber.io/)
- [Allure Framework](https://docs.qameta.io/allure/)
- [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/)

---

## 📄 License

ISC License

---

🤖 **Generated with [Claude Code](https://claude.com/claude-code)**

---

**⭐ Star this repo if you find it useful!**

**Repository:** https://github.com/Kunal-kankariya/orangehrm-typescript-cucumber-framework
