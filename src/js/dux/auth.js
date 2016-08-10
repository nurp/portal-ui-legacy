// Custom
import { fetchAuth } from 'utils/ajax'
import { namespaceActions } from 'dux/utils'

/*----------------------------------------------------------------------------*/

const auth = namespaceActions('auth', [
  'USER_REQUEST',
  'USER_SUCCESS',
  'USER_FAILURE',
])

const fetchUser = () => (
  fetchAuth({
    endpoint: 'user',
    types: [
      auth.USER_REQUEST,
      {
        type: auth.USER_SUCCESS,
        payload: async (action, state, res) => {
          const text = await res.text()
          const json = JSON.parse(text)
          return json
        },
      },
      auth.USER_FAILURE,
    ],
  })
)

const forceLogout = () => ({
  type: auth.USER_FAILURE,
  payload: { message: 'Session timed out or not authorized' },
})

const initialState = {
  isFetching: false,
  isAuthorized: false,
  user: null,
  error: {},
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case auth.USER_REQUEST:
      return {
        isFetching: true,
        isAuthorized: false,
        user: null,
        error: {},
      }
    case auth.USER_SUCCESS:
      return {
        isFetching: false,
        isAuthorized: Object.keys(action.payload.projects.gdc_ids || {}).length > 0,
        user: action.payload,
        error: {},
      }
    case auth.USER_FAILURE:
      return {
        isFetching: false,
        isAuthorized: false,
        error: action.payload,
        user: null,
      }
    default:
      return state
  }
}

/*----------------------------------------------------------------------------*/

export { fetchUser, forceLogout }

export default reducer
