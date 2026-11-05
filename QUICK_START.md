# 🚀 Quick Start Guide - OrangeHRM Automation

Get up and running in **5 minutes**!

---

## ⚡ Step 1: Install Dependencies (2 min)

```bash
cd "D:\Kunal personal project file\practice_ui_playwright_project"
npm install
```

**Wait for installation to complete...**

---

## 🌐 Step 2: Install Browser (1 min)

```bash
npx playwright install chromium
```

**If you get certificate errors:** Browsers may already be installed from your other Playwright project. Skip this if you already have them.

---

## ✅ Step 3: Run Your First Test (1 min)

### Run all login tests:
```bash
npm test
```

### Or run just smoke tests:
```bash
npm run test:smoke
```

### Or run a specific scenario:
```bash
npx cucumber-js features/login/login.feature:10
```

---

## 📊 Step 4: View Report (30 sec)

After tests finish:

```bash
npm run report
```

Then open: `reports/html/cucumber-report.html`

---

## 🎯 Quick Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:smoke` | Run smoke tests only |
| `npx cucumber-js --tags "@positive"` | Run positive tests |
| `npx cucumber-js --tags "@negative"` | Run negative tests |
| `npm run report` | Generate HTML report |
| `npm run clean` | Clean reports |

---

## 🔧 Configuration

### Change Browser:
Edit `.env`:
```env
BROWSER=chromium    # or firefox, webkit
HEADLESS=false     # Set true for headless
```

### Change Environment:
```bash
npm run test:dev      # Development
npm run test:qa       # QA
npm run test:staging  # Staging
```

---

## 📁 What's Included

```
✅ Login Feature with 6 scenarios
   ├── Positive: Valid credentials (2 scenarios)
   ├── Negative: Invalid username/password (3 scenarios)
   └── UI: Verify page elements (1 scenario)

✅ Page Object Model
   └── LoginPage with all methods

✅ TypeScript types
   └── Full type safety

✅ Logging (Winston)
   └── reports/logs/

✅ Screenshots on failure
   └── reports/screenshots/

✅ HTML Reports
   └── reports/html/
```

---

## 🐛 Common Issues

### ❌ Certificate Error (Browser Install)
**Solution:** Use browsers from your WellSky project, or install on home network

### ❌ TypeScript Errors
**Solution:** Reload VS Code window (`Ctrl+Shift+P` → "Reload Window")

### ❌ Tests Timeout
**Solution:** Increase timeout in `.env`:
```env
DEFAULT_TIMEOUT=60000
```

---

## 🚀 Push to GitHub

### Initialize Git:
```bash
git init
git add .
git commit -m "feat: Initial OrangeHRM automation framework with login tests"
```

### Create GitHub Repository:
1. Go to https://github.com/new
2. Create repository (e.g., `orangehrm-playwright-automation`)
3. **Don't** initialize with README (we already have one)

### Push to GitHub:
```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

### GitHub Actions will automatically:
- ✅ Run tests on push
- ✅ Generate reports
- ✅ Upload screenshots on failure

---

## 📖 Next Steps

1. ✅ **Run tests locally** - Verify everything works
2. ✅ **Push to GitHub** - Set up CI/CD
3. ✅ **Add more tests** - Expand coverage
4. ✅ **Explore OrangeHRM** - Add more page objects

---

## 🎓 Learning Path

**Week 1: Login Module**
- [x] Basic login tests
- [ ] Add "Forgot Password" tests
- [ ] Add "Remember Me" tests

**Week 2: Employee Module**
- [ ] Create EmployeePage.ts
- [ ] Add employee CRUD tests
- [ ] Table interactions

**Week 3: Advanced Features**
- [ ] File uploads
- [ ] Reports
- [ ] API integration

---

## 💡 Tips

1. **Run tests frequently** - Don't wait until you have many tests
2. **Check logs** - `reports/logs/` has detailed execution logs
3. **Use tags** - Organize tests with `@smoke`, `@regression`, `@critical`
4. **Keep scenarios small** - One scenario = one test case
5. **Use Page Objects** - Never put locators in step definitions

---

## 🆘 Need Help?

Check these files:
- **README.md** - Full documentation
- **reports/logs/errors-*.log** - Error logs
- **cucumber.config.js** - Cucumber configuration
- **tsconfig.json** - TypeScript configuration

---

**You're all set! Happy Testing! 🎉**

Run: `npm test`
