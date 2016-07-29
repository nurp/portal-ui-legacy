// Vendor
import React from 'react'
import { REHYDRATE } from 'redux-persist/constants'
import _ from 'lodash'
import UndoIcon from 'react-icons/lib/md/undo'

// Custom
import { notify } from 'dux/notification'
import { Column } from 'uikit/Flex'
import { center } from 'theme/mixins'

/*----------------------------------------------------------------------------*/

const UPDATE_CART = 'UPDATE_CART'

function toggleInCart(incomingFiles) {
  return (dispatch, getState) => {
    const incomingFilesArray = incomingFiles.constructor === Array ? incomingFiles : [incomingFiles]
    const existingFiles = getState().cart.files
    const nextFiles = _.xorBy(existingFiles, incomingFilesArray, 'file_id')

    if (nextFiles.length === existingFiles.length + 1) {
      dispatch(notify({
        action: 'add',
        component:
          <Column>
            <span>Added <strong>{incomingFiles.file_name}</strong> to the cart.</span>
            <span style={center}>
              <UndoIcon />
              <a onClick={() => dispatch(toggleInCart(incomingFiles))}>Undo</a>
            </span>
          </Column>,
      }))
    }

    if (nextFiles.length === existingFiles.length - 1) {
      dispatch(notify({
        action: 'remove',
        component:
          <Column>
            <span>Removed <strong>{incomingFiles.file_name}</strong> from the cart.</span>
            <span style={center}>
              <UndoIcon />
              <a onClick={() => dispatch(toggleInCart(incomingFiles))}>Undo</a>
            </span>
          </Column>,
      }))
    }

    dispatch({
      type: UPDATE_CART,
      payload: nextFiles,
    })
  }
}

const initialState = {
  files: [],
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE: {
      const incoming = action.payload.cart
      if (incoming) return { ...state, ...incoming }
      return state
    }

    case UPDATE_CART:
      return {
        ...state,
        files: action.payload.map(f => ({
          access: f.access,
          file_id: f.file_id,
          file_size: f.file_size,
          projects: f.projects || f.cases.map(c => c.project.project_id),
        })),
      }

    default:
      return state
  }
}

/*----------------------------------------------------------------------------*/

export { toggleInCart }
export default reducer
