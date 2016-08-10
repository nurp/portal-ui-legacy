import { CALL_API } from 'redux-api-middleware'

const DEFAULTS = {
  method: 'get',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': true,
    'X-Auth-Token': 'secret admin token',
  },
}

export function fetchAuth(options) {
  return {
    [CALL_API]: {
      ...DEFAULTS,
      ...options,
      endpoint: `/auth/${options.endpoint}`,
    },
  }
}
