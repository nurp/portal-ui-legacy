const NOTIFY = 'NOTIFY'

const notify = payload => ({ type: NOTIFY, payload })

const initialState = {
  component: null,
  action: null,
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case NOTIFY:
      return action.payload
    default:
      return state
  }
}

/*----------------------------------------------------------------------------*/

export { notify }
export default reducer
