const path = require('path');

export default config => {
  const single = require('./single').default(config);

  // Browsers to run on Sauce Labs
  // Check out https://saucelabs.com/platforms for all browser/OS combos
  const customLaunchers = {
    SL_Chrome_OSX: {
      name: '[unit] Chrome (latest) OSX',
      tags: ['chrome', 'osx', 'unit'],
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'latest',
      platform: 'OS X 10.11',
    },
    SL_Firefox_OSX: {
      name: 'Firefox/OSX - Unit',
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'latest',
      platform: 'OS X 10.11',
    },
    SL_Safari_OSX: {
      name: 'Safari/OSX - Unit',
      base: 'SauceLabs',
      browserName: 'safari',
      version: 'latest',
      platform: 'OS X 10.11',
    },
    SL_Chrome_Linux: {
      name: 'Chrome/Linux - Unit',
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'latest',
      platform: 'Linux',
    },
    SL_Firefox_Linux: {
      name: 'Firefox/Linux - Unit',
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'latest',
      platform: 'Linux',
    },
    SL_Chrome_Windows_10: {
      name: 'Chrome/Windows 10 - Unit',
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'latest',
      platform: 'Windows 10',
    },
    SL_Firefox_Windows_10: {
      name: 'Firefox/Windows 10 - Unit',
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'latest',
      platform: 'Windows 10',
    },
    SL_IE_Windows_10: {
      name: 'IE Windows 10 Unit',
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: 'latest',
      platform: 'Windows 10',
    },
    SL_Firefox_NCI_Windows_8: {
      name: 'Firefox 38 Windows 8 Unit Tests',
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '38',
      platform: 'Windows 8',
    },
  };

  config.set({
    ...single,
    // Increase timeout in case connection in CI is slow
    captureTimeout: 120000,
    browserNoActivityTimeout: 30000,
    customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: [...single.reporters, 'coverage', 'saucelabs'],
    plugins: [...single.plugins, 'karma-sauce-launcher', 'karma-coverage'],
    sauceLabs: {
      // testName: 'Unit Test Suite',
      // recordScreenshots: false,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      startConnect: false,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log',
      },
    },
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'lcov', subdir: '.', file: 'lcov.info' },
      ],
    },
    webpack: {
      ...single.webpack,
      isparta: {
        embedSource: true,
        noAutoWrap: true,
      },
      module: {
        ...single.webpack.module,
        preLoaders: [
          ...single.webpack.module.preLoaders,
          // transpile and instrument testing files with isparta
          {
            test: /\.js$/,
            include: path.resolve('src/js/'),
            exclude: /test.js$/,
            loader: 'isparta',
          },
        ],
      },
    },
  });

  return config;
};
