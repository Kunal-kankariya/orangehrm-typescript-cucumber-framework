const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

/**
 * Send Email Report after test execution
 */
async function sendEmailReport() {
  try {
    // Read test results
    const reportPath = path.join(__dirname, '..', 'reports', 'json', 'cucumber-report.json');

    if (!fs.existsSync(reportPath)) {
      console.error('❌ Report file not found:', reportPath);
      process.exit(1);
    }

    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

    // Calculate test statistics
    let totalScenarios = 0;
    let passedScenarios = 0;
    let failedScenarios = 0;
    let skippedScenarios = 0;

    reportData.forEach(feature => {
      feature.elements.forEach(scenario => {
        totalScenarios++;
        const failed = scenario.steps.some(step => step.result.status === 'failed');
        const skipped = scenario.steps.some(step => step.result.status === 'skipped');

        if (failed) {
          failedScenarios++;
        } else if (skipped) {
          skippedScenarios++;
        } else {
          passedScenarios++;
        }
      });
    });

    const passPercentage = ((passedScenarios / totalScenarios) * 100).toFixed(2);
    const status = failedScenarios === 0 ? '✅ PASSED' : '❌ FAILED';
    const statusColor = failedScenarios === 0 ? '#28a745' : '#dc3545';

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || '[REDACTED_EMAIL_ADDRESS_2]',
        pass: process.env.EMAIL_PASSWORD || '' // Use app-specific password
      }
    });

    // HTML Email Template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .status {
      background-color: ${statusColor};
      color: white;
      padding: 15px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
    }
    .stats {
      padding: 30px;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      border-bottom: 1px solid #eee;
    }
    .stat-label {
      font-weight: bold;
      color: #555;
    }
    .stat-value {
      font-weight: bold;
      font-size: 18px;
    }
    .passed { color: #28a745; }
    .failed { color: #dc3545; }
    .skipped { color: #ffc107; }
    .total { color: #007bff; }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      padding: 20px 30px;
    }
    .metric-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .metric-value {
      font-size: 32px;
      font-weight: bold;
      margin: 10px 0;
    }
    .metric-label {
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧪 Test Execution Report</h1>
      <p>OrangeHRM Playwright Automation</p>
    </div>

    <div class="status">
      ${status}
    </div>

    <div class="metrics">
      <div class="metric-card">
        <div class="metric-label">Total Tests</div>
        <div class="metric-value total">${totalScenarios}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Pass Rate</div>
        <div class="metric-value passed">${passPercentage}%</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Passed</div>
        <div class="metric-value passed">${passedScenarios}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Failed</div>
        <div class="metric-value failed">${failedScenarios}</div>
      </div>
    </div>

    <div class="stats">
      <div class="stat-row">
        <span class="stat-label">Environment:</span>
        <span class="stat-value">${process.env.ENV || 'QA'}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Browser:</span>
        <span class="stat-value">${process.env.BROWSER || 'Chromium'}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Execution Date:</span>
        <span class="stat-value">${new Date().toLocaleString()}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Duration:</span>
        <span class="stat-value">~${Math.round(totalScenarios * 5)} seconds</span>
      </div>
    </div>

    <div class="footer">
      <p>🤖 Generated automatically by Playwright Cucumber Framework</p>
      <p>Repository: <a href="https://github.com/Kunal-kankariya/orangehrm-typescript-cucumber-framework">GitHub</a></p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER || '[REDACTED_EMAIL_ADDRESS_2]',
      to: '[REDACTED_EMAIL_ADDRESS_2]',
      subject: `${status} - Test Execution Report - ${new Date().toLocaleDateString()}`,
      html: htmlContent,
      attachments: [
        {
          filename: 'cucumber-report.json',
          path: reportPath
        }
      ]
    };

    // Only send if EMAIL_PASSWORD is configured
    if (!process.env.EMAIL_PASSWORD) {
      console.log('\n📧 Email Report Preview:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Status: ${status}`);
      console.log(`Total Scenarios: ${totalScenarios}`);
      console.log(`Passed: ${passedScenarios}`);
      console.log(`Failed: ${failedScenarios}`);
      console.log(`Pass Rate: ${passPercentage}%`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n⚠️  EMAIL_PASSWORD not set. Email not sent.');
      console.log('💡 Set EMAIL_PASSWORD environment variable to enable email notifications.');
      return;
    }

    const info = await transporter.sendMail(mailOptions);

    console.log('\n✅ Email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📬 Sent to: [REDACTED_EMAIL_ADDRESS_2]`);
    console.log(`📊 Test Results: ${passedScenarios}/${totalScenarios} passed (${passPercentage}%)`);

  } catch (error) {
    console.error('❌ Error sending email:', error);
    process.exit(1);
  }
}

sendEmailReport();
