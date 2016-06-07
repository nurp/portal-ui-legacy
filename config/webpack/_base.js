import path from 'path';
import webpack from 'webpack';

import config from '../';

const babelPlugins = false // config.get('globals').TEST_ENV
  ? []
  : [
    './config/webpack/plugins/babelRelayPlugin',
    'react-hot-loader/babel',
  ];

export default {
  target: 'web',
  devtool: '#source-map',
  entry: {
    bundle: [path.join(config.get('dir_src'), 'js', 'index.js')],
  },
  output: {
    path: path.join(config.get('dir_dist'), config.get('globals').__BASE__, 'js'),
    pathInfo: true,
    publicPath: `/${path.join(config.get('globals').__BASE__, 'js/')}`,
    filename: 'bundle.js',
  },
  module: {
    preLoaders: [],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: ['node_modules'],
        include: `${config.get('dir_src')}/js`,
        query: {
          presets: [
            'react', 'es2015-webpack', 'stage-0',
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
