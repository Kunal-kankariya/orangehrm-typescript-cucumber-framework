const common = {
  requireModule: ['ts-node/register'],
  require: ['step-definitions/**/*.ts'],
  format: [
    'progress-bar',
    'html:reports/html/cucumber-report.html',
    'json:reports/json/cucumber-report.json'
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  },
  dryRun: false,
  parallel: 1
};

module.exports = {
  default: {
    ...common,
    paths: ['features/**/*.feature']
  },
  smoke: {
    ...common,
    paths: ['features/**/*.feature'],
    tags: '@smoke'
  },
  regression: {
    ...common,
    paths: ['features/**/*.feature'],
    tags: '@regression'
  },
  parallel: {
    ...common,
    paths: ['features/**/*.feature'],
    parallel: 4
  }
};
