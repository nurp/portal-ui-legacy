import path from 'path';
import webpack from 'webpack';

import config from '../';

const babelPlugins = config.get('globals').TEST_ENV === 'watch'
  ? []
  : [
    path.join(__dirname, 'plugins', 'babelRelayPlugin'),
    'react-hot-loader/babel',
  ];

export default {
  target: 'web',
  devtool: '#source-map',
  entry: {
    bundle: [path.join(config.get('dir_src'), 'js', 'index.jsx')],
  },
  output: {
    path: path.join(config.get('dir_dist'), config.get('globals').__BASE__, 'js'),
    pathInfo: true,
    publicPath: path.join('/', config.get('globals').__BASE__, 'js/'),
    filename: 'bundle.js',
  },
  module: {
    preLoaders: [],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: `${config.get('fdt_modules')}/babel-loader`,
        exclude: ['node_modules'],
        include: `${config.get('dir_src')}/js`,
        query: {
          presets: [
            `${config.get('fdt_modules')}/babel-preset-react`,
            `${config.get('fdt_modules')}/babel-preset-es2015-webpack`,
            `${config.get('fdt_modules')}/babel-preset-stage-0`,
            {
              plugins: babelPlugins,
            },
          ],
        },
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
    noParse: [/\.min\.js$/],
  },
  resolve: {
    extentions: ['', '.js', '.jsx'],
    modules: ['node_modules'],
    alias: {
      react: path.resolve(path.join(config.get('path_project'), 'node_modules', 'react')),
      routes: path.resolve(path.join(config.get('path_project'), 'src', 'js', 'routes')),
      components: path.resolve(path.join(config.get('path_project'), 'src', 'js', 'components')),
      containers: path.resolve(path.join(config.get('path_project'), 'src', 'js', 'containers')),
      mutations: path.resolve(path.join(config.get('path_project'), 'src', 'js', 'mutations')),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.get('globals')['process.env'],
      __API__: JSON.stringify(config.get('globals').__API__),
      __DEV__: JSON.stringify(config.get('globals').__DEV__),
      __PROD__: JSON.stringify(config.get('globals').__PROD__),
      __DEBUG__: JSON.stringify(config.get('globals').__DEBUG__),
      __BASE__: JSON.stringify(config.get('globals').__BASE__),
    }),
  ],
};
