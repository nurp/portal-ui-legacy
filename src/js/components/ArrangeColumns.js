// Vendor
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { compose, withState, pure } from 'recompose'
import ArrangeIcon from 'react-icons/lib/fa/bars'

// Custom
import theme from 'theme'
import { Row } from 'uikit/Flex'
import SortableItem from 'uikit/SortableItem'
import { toggleFileTableColumn, setFileTableColumns } from 'dux/activeFileTableColumns'

/*----------------------------------------------------------------------------*/

const styles = {
  row: {
    lineHeight: '1.5',
    alignItems: 'center',
    padding: '0.3rem 0.6rem',
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
  },
}

const ArrangeColumns = ({
  dispatch,
  fileTableColumns,
  setState,
  state,
  searchTerm,
}) => {
  const filteredColumns = state.columns.filter(x =>
    x.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      {filteredColumns.map((column, i) =>
        <SortableItem
          key={column.id}
          updateState={nextState => setState(state => { // eslint-disable-line
            if (!nextState.items && state.items) {
              const nextColumnIds = state.items.reduce((acc, x) => (
                [...acc, ...(fileTableColumns.includes(x.id) ? [x.id] : [])]
              ), [])

              dispatch(setFileTableColumns(nextColumnIds))
            }
            return { columns: filteredColumns, ...nextState }
          })}
          draggingIndex={state.draggingIndex}
          items={filteredColumns}
          sortId={i}
          outline="list"
        >
          <Row style={styles.row}>
            <Row onClick={() => dispatch(toggleFileTableColumn(column.id))}>
              <input
                readOnly
                style={{ pointerEvents: 'none' }}
                type="checkbox"
                checked={fileTableColumns.includes(column.id)}
              />
              <span style={{ marginLeft: '0.3rem' }}>{column.name}</span>
            </Row>
            <ArrangeIcon style={{ marginLeft: 'auto' }} />
          </Row>
        </SortableItem>
      )}
    </div>
  )
}

ArrangeColumns.propTypes = {
  dispatch: PropTypes.func,
  columns: PropTypes.array,
  fileTableColumns: PropTypes.array,
  setState: PropTypes.func,
  state: PropTypes.object,
  searchTerm: PropTypes.string,
}

const mapState = state => ({
  fileTableColumns: state.activeFileTableColumns,
})

const enhance = compose(
  withState('state', 'setState',
    ({ columns }) => ({ draggingIndex: null, columns })
  ),
  pure
)

/*----------------------------------------------------------------------------*/

export default connect(mapState)(enhance(ArrangeColumns))
