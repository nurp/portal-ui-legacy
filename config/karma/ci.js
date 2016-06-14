const path = require('path');

export default config => {
  const single = require('./single').default(config);

  // Browsers to run on Sauce Labs
  // Check out https://saucelabs.com/platforms for all browser/OS combos
  const customLaunchers = {
    SL_Chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
    },
    SL_Firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
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
