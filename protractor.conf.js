exports.config = {
    // The file path to the selenium server jar.
    seleniumServerJar: './node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-3.8.1.jar',
    chromeOnly: true,
    capabilities: {
        browserName: 'chrome'
    },

    specs: ['app/tests/**/*.spec.js'],
    baseUrl: 'http://localhost:3000',
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        reporter: 'list',
        enableTimeouts: false
    }
};
