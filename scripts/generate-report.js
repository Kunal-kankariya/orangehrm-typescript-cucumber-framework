const reporter = require('cucumber-html-reporter');
const path = require('path');

const options = {
  theme: 'bootstrap',
  jsonFile: path.join(__dirname, '../reports/json/cucumber-report.json'),
  output: path.join(__dirname, '../reports/html/cucumber-report.html'),
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  metadata: {
    'App Version': '1.0.0',
    'Test Environment': process.env.ENV || 'dev',
    Browser: process.env.BROWSER || 'chromium',
    Platform: process.platform,
    'Execution Date': new Date().toISOString()
  },
  failedSummaryReport: true
};

reporter.generate(options);

console.log('✅ HTML Report generated successfully!');
console.log(`📊 Report location: ${options.output}`);
