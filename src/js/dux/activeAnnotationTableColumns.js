// Vendor
import { REHYDRATE } from 'redux-persist/constants'

// Custom
import annotationTable from 'models/annotationTable'
import { namespaceActions } from 'dux/utils'

/*----------------------------------------------------------------------------*/

const activeAnnotationTableColumns = namespaceActions('activeAnnotationTableColumns', [
  'TOGGLE_COLUMN',
  'RESTORE',
  'SET',
])

const toggleAnnotationTableColumn = id => ({
  type: activeAnnotationTableColumns.TOGGLE_COLUMN,
  payload: id,
})

const restoreAnnotationTableColumns = () => ({
  type: activeAnnotationTableColumns.RESTORE,
})

const setAnnotationTableColumns = columnIds => ({
  type: activeAnnotationTableColumns.SET,
  payload: columnIds,
})

// Store ids of table items that are not hidden by default
const initialState = annotationTable.reduce((acc, x) => (
  [...acc, ...(!x.hidden ? [x.id] : [])]
), [])

function reducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE: {
      const incoming = action.payload.activeAnnotationTableColumns
      if (incoming) return incoming
      return state
    }

    case activeAnnotationTableColumns.TOGGLE_COLUMN: {
      return state.find(id => id === action.payload)
        ? state.filter(id => id !== action.payload)
        : [...state, action.payload]
    }

    case activeAnnotationTableColumns.RESTORE:
      return initialState

    case activeAnnotationTableColumns.SET:
      return action.payload

    default:
      return state
  }
}

/*----------------------------------------------------------------------------*/

export { toggleAnnotationTableColumn, restoreAnnotationTableColumns, setAnnotationTableColumns }
export default reducer
