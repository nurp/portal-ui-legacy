import webpack from '../webpack/development'

const KARMA_ENTRY_FILE = 'karma.entry.js'

export default config => {
  config.set({
    browsers: ['Chrome'],
    // karma only needs to know about the test bundle
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      KARMA_ENTRY_FILE,
    ],
    // run the bundle through the webpack and sourcemap plugins
    preprocessors: {
      [KARMA_ENTRY_FILE]: ['webpack', 'sourcemap'],
    },
    frameworks: ['chai-sinon', 'mocha'],
    reporters: ['mocha'],
    mochaReporter: {
      showDiff: true,
    },
    plugins: [
      'karma-chrome-launcher',
      'karma-chai-sinon',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-sourcemap-loader',
      'karma-webpack',
    ],
    colors: true,

    // level of logging
    // possible values:
    // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    webpack,
    webpackMiddleware: {
      ...webpack.devServer,
      quiet: true,
    },
  })

  return config
}
