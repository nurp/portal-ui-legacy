const path = require('path');

export default config => {
  const single = require('./single').default(config);

  // Browsers to run on Sauce Labs
  // Check out https://saucelabs.com/platforms for all browser/OS combos
  const customLaunchers = {
    SL_Chrome_OSX: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'latest',
      platform: 'OS X 10.11',
    },
    SL_Firefox_OSX: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'latest',
      platform: 'OS X 10.11',
    },
    SL_Safari_OSX: {
      base: 'SauceLabs',
      browserName: 'safari',
      version: 'latest',
      platform: 'OS X 10.11',
    },
    SL_Chrome_Linux: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'latest',
    },
    SL_Firefox_Linux: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'latest',
    },
    SL_Chrome_Windows_10: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'latest',
      platform: 'Windows 10',
    },
    SL_Firefox_Windows_10: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'latest',
      platform: 'Windows 10',
    },
    SL_IE_Windows_10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: 'latest',
      platform: 'Windows 10',
    },
    SL_Edge_Windows_10: {
      base: 'SauceLabs',
      browserName: 'edge',
      version: 'latest',
      platform: 'Windows 10',
    },
    SL_Firefox_NCI_Windows_8: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '38.7.1',
      platform: 'Windows 8',
    },
  };

  config.set({
    ...single,
    // Increase timeout in case connection in CI is slow
    captureTimeout: 120000,
    customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: [...single.reporters, 'coverage', 'saucelabs'],
    plugins: [...single.plugins, 'karma-sauce-launcher', 'karma-coverage'],
    sauceLabs: {
      testName: 'GDC Legacy Portal UI',
      recordScreenshots: false,
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
