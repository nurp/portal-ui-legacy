// inside that file
import babelRelayPlugin from 'babel-relay-plugin';
import { introspectionQuery } from 'graphql/utilities';
import request from 'sync-request';

const graphqlHubUrl = 'http://localhost:5000/graphql';
const response = request('POST', graphqlHubUrl, {
  json: {
    query: introspectionQuery,
  },
});

const schema = JSON.parse(response.body.toString('utf-8'));

module.exports = babelRelayPlugin(schema.data, {
  abortOnError: true,
});
