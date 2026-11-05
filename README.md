# OrangeHRM Automation - Playwright + Cucumber + TypeScript

Enterprise-grade test automation framework for **OrangeHRM** using Playwright, Cucumber (BDD), and TypeScript.

## 🎯 Project Overview

This framework automates testing for **OrangeHRM** - an open-source Human Resource Management system.

**Application Under Test:** https://opensource-demo.orangehrmlive.com/

## ✨ Features

- ✅ **TypeScript** - Type-safe test automation
- ✅ **BDD with Cucumber** - Gherkin syntax for readable tests
- ✅ **Page Object Model** - Maintainable and scalable
- ✅ **Advanced Logging** - Winston logger with daily rotation
- ✅ **Screenshot on Failure** - Automatic failure capturing
- ✅ **HTML Reports** - Beautiful test reports
- ✅ **CI/CD Ready** - GitHub Actions workflow included
- ✅ **Multi-Environment Support** - dev, qa, staging configs

## 🛠 Tech Stack

- **Playwright** v1.49.0 - Browser automation
- **Cucumber** v11.0.1 - BDD framework
- **TypeScript** v5.7.2 - Type safety
- **Winston** v3.17.0 - Logging
- **Node.js** >= 18.x

## 📦 Installation

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Setup Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd practice_ui_playwright_project
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Playwright browsers**
```bash
npx playwright install chromium
```

## ⚙️ Configuration

### Environment Variables

Default credentials for OrangeHRM (already configured in `.env`):
```env
TEST_USERNAME=Admin
TEST_PASSWORD=[REDACTED_GENERIC_PASSWORD_1]
```

### Browser Settings
```env
BROWSER=chromium          # chromium, firefox, webkit
HEADLESS=false           # Set to true for headless mode
LOG_LEVEL=info           # debug, info, warn, error
```

## 🚀 Running Tests

### Run all login tests
```bash
npm test
```

### Run with specific tags
```bash
# Run only smoke tests
npm run test:smoke

# Run only positive tests
npx cucumber-js --tags "@positive"

# Run only critical tests
npx cucumber-js --tags "@critical"

# Run negative tests
npx cucumber-js --tags "@negative"
```

### Run in different environments
```bash
npm run test:dev
npm run test:qa
npm run test:staging
```

### Run in parallel
```bash
npm run test:parallel
```

### Run specific feature
```bash
npx cucumber-js features/login/login.feature
```

### Run specific scenario (by line number)
```bash
npx cucumber-js features/login/login.feature:10
```

## 📊 Reports

### Generate HTML Report
```bash
npm run report
```

Reports are generated in:
- **HTML Report:** `reports/html/cucumber-report.html`
- **JSON Report:** `reports/json/cucumber-report.json`
- **Logs:** `reports/logs/test-execution-YYYY-MM-DD.log`
- **Screenshots:** `reports/screenshots/` (on failure)

### View Reports
After running tests, open:
```bash
start reports/html/cucumber-report.html
```

## 📁 Project Structure

```
practice_ui_playwright_project/
├── src/
│   ├── pages/
│   │   ├── base/
│   │   │   └── BasePage.ts          # Base page with wrapper methods
│   │   └── login/
│   │       └── LoginPage.ts         # OrangeHRM login page
│   ├── components/
│   │   └── Header.ts                # Reusable components
│   ├── fixtures/
│   │   └── customWorld.ts           # Cucumber World
│   ├── utils/
│   │   └── logger.ts                # Winston logger
│   ├── config/
│   │   └── env/
│   │       ├── dev.env              # Dev environment config
│   │       ├── qa.env
│   │       └── staging.env
│   └── types/
│       ├── index.d.ts               # Global types
│       └── custom.d.ts              # Cucumber World types
├── features/
│   └── login/
│       └── login.feature            # Login test scenarios
├── step-definitions/
│   ├── hooks/
│   │   └── hooks.ts                 # Before/After hooks
│   ├── login/
│   │   └── loginSteps.ts            # Login step definitions
│   └── common/
│       └── commonSteps.ts           # Reusable steps
├── test-data/
│   └── json/
│       └── users.json               # Test user data
├── reports/                         # Test reports
├── .github/
│   └── workflows/
│       └── ci.yml                   # GitHub Actions CI/CD
├── package.json
├── tsconfig.json
├── cucumber.config.js
├── .env
└── README.md
```

## 🧪 Test Scenarios

### Login Feature (`features/login/login.feature`)

Current test scenarios:
- ✅ **Positive Tests:**
  - Login with valid credentials (step-by-step)
  - Login with valid credentials (using login method)
  
- ✅ **Negative Tests:**
  - Login with invalid username
  - Login with invalid password
  - Login with empty credentials
  
- ✅ **UI Tests:**
  - Verify login page elements

## 🔧 Development Commands

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Code Formatting
```bash
npm run format
```

### Clean Reports
```bash
npm run clean
```

## 🎨 Writing New Tests

### 1. Add Scenario to Feature File

```gherkin
@positive @smoke
Scenario: New test scenario
  Given I am on the login page
  When I perform some action
  Then I should see expected result
```

### 2. Implement Step Definitions (if new steps)

```typescript
// step-definitions/login/loginSteps.ts
When('I perform some action', async function (this: CustomWorld) {
  await this.loginPage!.performAction();
});
```

### 3. Add Page Methods (if needed)

```typescript
// src/pages/login/LoginPage.ts
async performAction(): Promise<void> {
  await this.click(this.someButton);
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

The project includes a complete CI/CD pipeline (`.github/workflows/ci.yml`).

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual trigger with environment selection
- Scheduled nightly runs (2 AM UTC)

**Features:**
- ✅ Runs on `ubuntu-latest`
- ✅ Tests on multiple browsers (chromium, firefox)
- ✅ Parallel execution with 4 shards
- ✅ Automatic report generation
- ✅ Screenshot/video upload on failure
- ✅ Artifact retention (30 days for reports, 7 days for media)

### Running in GitHub Actions

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - OrangeHRM automation framework"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **GitHub Actions will automatically run tests**

3. **View results** in GitHub Actions tab

### Manual Workflow Trigger

Go to **Actions** → **Playwright Cucumber Tests** → **Run workflow**

Select:
- Environment: `dev`, `qa`, or `staging`
- Tags: `@smoke`, `@regression`, etc.

## 🐛 Troubleshooting

### Browser Installation Issues

If you get certificate errors:
```bash
# Use existing browsers from another Playwright installation
# Or install on a non-corporate network
```

### TypeScript Errors

Reload VS Code:
1. Press `Ctrl + Shift + P`
2. Type "Reload Window"
3. Press Enter

### Tests Failing

Check logs:
```bash
cat reports/logs/test-execution-*.log
cat reports/logs/errors-*.log
```

## 📝 Best Practices

1. ✅ Use Page Object Model for all UI interactions
2. ✅ Use descriptive scenario names
3. ✅ Tag scenarios appropriately (@smoke, @regression, @critical)
4. ✅ Keep scenarios independent (no dependencies between tests)
5. ✅ Use logger instead of console.log
6. ✅ Follow TypeScript best practices (type safety)
7. ✅ Clean up after tests (hooks handle this automatically)

## 🔐 Credentials

**OrangeHRM Demo:**
- URL: https://opensource-demo.orangehrmlive.com/
- Username: `Admin`
- Password: `[REDACTED_GENERIC_PASSWORD_1]`

**Note:** These are public demo credentials. Never commit real credentials to Git!

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Commit with descriptive message
5. Push and create Pull Request

## 👨‍💻 Author

**Kunal Kankriya**
- 8+ years experience in QA
- 4+ years experience with Playwright

## 📄 License

ISC

---

**Happy Testing! 🚀**
