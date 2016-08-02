// Vendor
import { REHYDRATE } from 'redux-persist/constants'

// Custom
import fileTable from 'models/fileTable'
import { namespaceActions } from 'dux/utils'

/*----------------------------------------------------------------------------*/

const activeFileTableColumns = namespaceActions('activeFileTableColumns', [
  'TOGGLE_COLUMN',
  'RESTORE',
  'SET',
])

const toggleFileTableColumn = id => ({ type: activeFileTableColumns.TOGGLE_COLUMN, payload: id })
const restoreFileTableColumns = () => ({ type: activeFileTableColumns.RESTORE })
const setFileTableColumns = columnIds => ({ type: activeFileTableColumns.SET, payload: columnIds })

// Store ids of table items that are not hidden by default
const initialState = fileTable.reduce((acc, x) => (
  [...acc, ...(!x.hidden ? [x.id] : [])]
), [])

function reducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE: {
      const incoming = action.payload.activeFileTableColumns
      if (incoming) return incoming
      return state
    }

    case activeFileTableColumns.TOGGLE_COLUMN: {
      return state.find(id => id === action.payload)
        ? state.filter(id => id !== action.payload)
        : [...state, action.payload]
    }

    case activeFileTableColumns.RESTORE:
      return initialState

    case activeFileTableColumns.SET:
      return action.payload

    default:
      return state
  }
}

/*----------------------------------------------------------------------------*/

export { toggleFileTableColumn, restoreFileTableColumns, setFileTableColumns }
export default reducer
