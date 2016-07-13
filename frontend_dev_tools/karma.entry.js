// import config from './config';

const context = require.context('../src/js', true, /.+\.js$/);
context.keys().forEach(context);
module.exports = context;
