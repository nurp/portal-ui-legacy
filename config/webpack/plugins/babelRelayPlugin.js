// inside that file
import chalk from 'chalk'
import babelRelayPlugin from 'babel-relay-plugin'
import config from '../../'
import schema from '../../../data/schema.json'

console.log(`⇅  Loading ${chalk.white('GraphQL schema')} into ${chalk.white('Relay')}`)

module.exports = babelRelayPlugin(schema.data, {
  abortOnError: !config.get('globals').__DEV__,
})
