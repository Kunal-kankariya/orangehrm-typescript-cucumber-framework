# 📧 Email Notification Setup Guide

## Why Email Isn't Sending

Email notifications are **NOT configured** in GitHub Actions because they require **GitHub Secrets** to be set up.

The email feature works locally but needs additional setup for CI/CD.

---

## 🎯 Current Status

| Feature | Local | CI/CD |
|---------|-------|-------|
| Email Script | ✅ Ready | ⚠️ Needs Setup |
| Email Template | ✅ Working | ⚠️ Needs Setup |
| Gmail App Password | ❌ Not Set | ❌ Not Set |
| GitHub Secrets | N/A | ❌ Not Set |

---

## ✅ Option 1: Test Email Locally (Recommended First)

### Step 1: Create Gmail App Password

1. **Go to Google Account:**
   - Visit: https://myaccount.google.com/security

2. **Enable 2-Step Verification** (if not already enabled)
   - Click "2-Step Verification"
   - Follow setup instructions

3. **Create App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name: "Playwright Test Reports"
   - Click "Generate"
   - **Copy the 16-character password** (example: `abcd efgh ijkl mnop`)

### Step 2: Test Locally

```bash
# Set environment variables (Windows PowerShell)
$env:EMAIL_USER="[REDACTED_EMAIL_ADDRESS_2]"
$env:EMAIL_PASSWORD="your-16-char-app-password"

# Or on Windows CMD:
set EMAIL_USER=[REDACTED_EMAIL_ADDRESS_2]
set EMAIL_PASSWORD=your-16-char-app-password

# Or on Mac/Linux:
export EMAIL_USER="[REDACTED_EMAIL_ADDRESS_2]"
export EMAIL_PASSWORD="your-16-char-app-password"

# Run tests first
npm test

# Send email report
npm run email:report
```

### Step 3: Check Your Email

Within 1-2 minutes, you should receive a beautiful HTML email at `[REDACTED_EMAIL_ADDRESS_2]` with:
- ✅ Pass/Fail statistics
- ✅ Test duration
- ✅ Environment details
- ✅ JSON report attachment

---

## 🚀 Option 2: Enable Email in GitHub Actions

### Step 1: Create GitHub Secrets

1. **Go to Repository Settings:**
   - https://github.com/Kunal-kankariya/orangehrm-typescript-cucumber-framework/settings/secrets/actions

2. **Click "New repository secret"**

3. **Add EMAIL_USER:**
   - Name: `EMAIL_USER`
   - Value: `[REDACTED_EMAIL_ADDRESS_2]`
   - Click "Add secret"

4. **Add EMAIL_PASSWORD:**
   - Name: `EMAIL_PASSWORD`
   - Value: `your-16-char-app-password` (from Step 1 above)
   - Click "Add secret"

### Step 2: Update CI Workflow

The email job was **removed from CI** because secrets weren't configured. To add it back, update `.github/workflows/ci.yml`:

```yaml
# Add this as a new job at the end of the file

  # Send Email Report
  send-email:
    needs: test
    if: always()
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Download test reports
        uses: actions/download-artifact@v4
        with:
          name: test-reports
          path: reports

      - name: Send Email Report
        env:
          EMAIL_USER: ${{ secrets.EMAIL_USER }}
          EMAIL_PASSWORD: ${{ secrets.EMAIL_PASSWORD }}
        run: npm run email:report
```

### Step 3: Test in CI/CD

Push any commit and the email will be sent automatically after tests complete!

---

## 📧 What the Email Looks Like

The email includes:

### Subject:
```
✅ PASSED - Test Execution Report - 11/05/2024
```
or
```
❌ FAILED - Test Execution Report - 11/05/2024
```

### Body:
- 🎨 **Beautiful HTML template** with gradient header
- 📊 **Metrics cards**: Total Tests, Pass Rate, Passed, Failed
- 📋 **Environment details**: Browser, Environment, Date, Duration
- 📎 **Attachment**: cucumber-report.json

---

## 🔧 Troubleshooting

### Email Not Sending Locally

**Error:** `Email sending skipped (credentials not configured)`

**Solution:** 
- Make sure you set environment variables in the same terminal session
- Verify app password is correct (16 characters, no spaces)

### Gmail "Less Secure App" Error

**Error:** `Invalid login: 535-5.7.8 Username and Password not accepted`

**Solution:**
- You MUST use an **App Password**, not your regular Gmail password
- Enable 2-Step Verification first
- Generate a NEW app password

### Email Not Sending in GitHub Actions

**Error:** Email doesn't arrive after workflow runs

**Solution:**
1. Check GitHub Secrets are set correctly
2. Verify secret names are exact: `EMAIL_USER` and `EMAIL_PASSWORD`
3. Check workflow logs for errors

---

## 💡 Recommendations

### For Learning/Development:
✅ **Test locally first** - Easier to debug and see results immediately

### For Production:
✅ **Set up GitHub Secrets** - Automatic notifications after every run  
✅ **Consider adding more recipients** - Modify `scripts/send-email-report.js`

---

## 📝 Email Script Location

The email sending script is at:
```
scripts/send-email-report.js
```

You can customize:
- **Recipients** (line with `to:`)
- **Email template** (HTML content)
- **Subject line**
- **Attachment format**

---

## ❌ Don't Want Email Notifications?

If you don't want to set up email:

1. **Just ignore it** - The feature is optional
2. **All tests still work** without email
3. **Reports are still generated** (HTML, JSON)
4. **Use SETUP.md** for other features (Allure, etc.)

---

## 🎯 Summary

| Task | Time | Difficulty |
|------|------|------------|
| Create Gmail App Password | 5 min | Easy |
| Test Locally | 2 min | Easy |
| Set GitHub Secrets | 3 min | Easy |
| Update CI Workflow | 5 min | Medium |

**Total Time: ~15 minutes to fully set up**

---

## 🆘 Need Help?

If you encounter issues:
1. Check the error message in logs
2. Verify app password is correct
3. Make sure 2-Step Verification is enabled
4. Try creating a new app password

---

**Email notifications are a premium feature but completely optional!** ✨

All core testing features work without it.
