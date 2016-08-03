// Vendor
import { REHYDRATE } from 'redux-persist/constants'

// Custom
import entities from 'entities'
import { namespaceActions } from 'dux/utils'

/*----------------------------------------------------------------------------*/

const tableColumns = namespaceActions('tableColumns', [
  'TOGGLE_COLUMN',
  'RESTORE',
  'SET',
])

const toggleColumn = ({ entityType, id }) => ({
  type: tableColumns.TOGGLE_COLUMN,
  payload: { entityType, id },
})

const restoreColumns = entityType => ({
  type: tableColumns.RESTORE,
  payload: entityType,
})

const setColumns = ({ entityType, ids }) => ({
  type: tableColumns.SET,
  payload: { entityType, ids },
})

// Store ids of table items that are not hidden by default
const reduceColumns = (acc, x) => ([...acc, ...(!x.hidden ? [x.id] : [])])

const initialState = Object.keys(entities).reduce((acc, key) => ({
  ...acc,
  [key]: entities[key].table.reduce(reduceColumns, []),
}), {})

function reducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE: {
      const incoming = action.payload.tableColumns
      if (incoming) return incoming
      return state
    }

    case tableColumns.TOGGLE_COLUMN: {
      const { entityType, id } = action.payload
      return state[entityType].find(x => x === id)
        ? { ...state, [entityType]: state[entityType].filter(x => x !== id) }
        : { ...state, [entityType]: [...state[entityType], id] }
    }

    case tableColumns.RESTORE: {
      const { entityType } = action.payload
      return { ...state, [entityType]: initialState[entityType] }
    }

    case tableColumns.SET: {
      const { entityType, ids } = action.payload
      return { ...state, [entityType]: ids }
    }

    default:
      return state
  }
}

/*----------------------------------------------------------------------------*/

export { toggleColumn, restoreColumns, setColumns }
export default reducer
