const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Convert Cucumber JSON to Allure Results
 */
function convertCucumberToAllure() {
  const cucumberJsonPath = path.join(
    __dirname,
    '..',
    'reports',
    'json',
    'cucumber-report.json'
  );
  const allureResultsDir = path.join(__dirname, '..', 'allure-results');

  // Create allure-results directory
  if (!fs.existsSync(allureResultsDir)) {
    fs.mkdirSync(allureResultsDir, { recursive: true });
  }

  // Read Cucumber JSON
  if (!fs.existsSync(cucumberJsonPath)) {
    console.error('❌ Cucumber JSON report not found:', cucumberJsonPath);
    return;
  }

  const cucumberData = JSON.parse(fs.readFileSync(cucumberJsonPath, 'utf8'));

  console.log('🔄 Converting Cucumber JSON to Allure format...');

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  // Process each feature
  cucumberData.forEach((feature) => {
    feature.elements.forEach((scenario) => {
      totalTests++;

      const uuid = crypto.randomUUID();
      const status =
        scenario.steps.some((step) => step.result.status === 'failed')
          ? 'failed'
          : scenario.steps.some((step) => step.result.status === 'skipped')
          ? 'skipped'
          : 'passed';

      if (status === 'passed') passedTests++;
      if (status === 'failed') failedTests++;

      const start = scenario.steps[0]?.result?.duration
        ? Date.now() - scenario.steps[0].result.duration / 1000000
        : Date.now();
      const stop = Date.now();

      // Create Allure test result
      const allureResult = {
        uuid,
        historyId: crypto
          .createHash('md5')
          .update(feature.name + scenario.name)
          .digest('hex'),
        fullName: `${feature.name}: ${scenario.name}`,
        labels: [
          { name: 'feature', value: feature.name },
          { name: 'suite', value: feature.name },
          { name: 'framework', value: 'cucumber' },
          { name: 'language', value: 'typescript' },
          ...scenario.tags.map((tag) => ({ name: 'tag', value: tag.name }))
        ],
        links: [],
        name: scenario.name,
        status,
        stage: 'finished',
        statusDetails: {},
        steps: scenario.steps.map((step) => ({
          name: `${step.keyword}${step.name}`,
          status: step.result.status,
          stage: 'finished',
          steps: [],
          attachments: [],
          parameters: [],
          start: start,
          stop: start + (step.result.duration || 0) / 1000000
        })),
        attachments: [],
        parameters: [],
        start,
        stop
      };

      // Add failure details if failed
      if (status === 'failed') {
        const failedStep = scenario.steps.find(
          (step) => step.result.status === 'failed'
        );
        if (failedStep && failedStep.result.error_message) {
          allureResult.statusDetails = {
            message: failedStep.result.error_message.split('\\n')[0],
            trace: failedStep.result.error_message
          };
        }
      }

      // Write Allure result file
      const resultFileName = `${uuid}-result.json`;
      const resultFilePath = path.join(allureResultsDir, resultFileName);
      fs.writeFileSync(resultFilePath, JSON.stringify(allureResult, null, 2));
    });
  });

  // Create environment properties
  const envProps = `Browser=${process.env.BROWSER || 'chromium'}
Environment=${process.env.ENV || 'qa'}
Base.URL=${process.env.BASE_URL || 'N/A'}
Node.Version=${process.version}
`;
  fs.writeFileSync(
    path.join(allureResultsDir, 'environment.properties'),
    envProps
  );

  // Create executor info
  const executorInfo = {
    name: 'GitHub Actions',
    type: 'github',
    buildOrder: process.env.GITHUB_RUN_NUMBER || Date.now(),
    buildName: `Build #${process.env.GITHUB_RUN_NUMBER || 'local'}`,
    buildUrl: process.env.GITHUB_SERVER_URL
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : 'Local Execution',
    reportUrl: '',
    reportName: 'Allure Report'
  };
  fs.writeFileSync(
    path.join(allureResultsDir, 'executor.json'),
    JSON.stringify(executorInfo, null, 2)
  );

  console.log('✅ Allure results generated successfully!');
  console.log(`📊 Total: ${totalTests} | ✅ Passed: ${passedTests} | ❌ Failed: ${failedTests}`);
  console.log(`📁 Results saved to: ${allureResultsDir}`);
}

// Run conversion
convertCucumberToAllure();
