// Vendor
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { compose, withState, pure } from 'recompose'
import ArrangeIcon from 'react-icons/lib/fa/bars'
import SearchIcon from 'react-icons/lib/fa/search'

// Custom
import { toggleFileTableColumn, restoreFileTableColumns } from 'dux/activeFileTableColumns'
import { Row, Column } from 'uikit/Flex'
import Button from 'uikit/Button'
import withDropdown from 'uikit/withDropdown'
import { dropdown } from 'theme/mixins'
import fileTable from 'models/fileTable'
import theme from 'theme'

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
  searchIcon: {
    backgroundColor: theme.greyScale5,
    color: theme.greyScale2,
    padding: '0.7rem',
    width: '3rem',
    height: '3rem',
  },
  searchInput: {
    width: '100%',
    padding: '0.3rem 0.5rem',
  },
  restoreDefaults: {
    color: theme.secondary,
    padding: '0.3rem 0.6rem',
    cursor: 'pointer',
    ':hover': {
      textDecoration: 'underline',
    },
  },
}

let searchInput

const ArrangeColumnsButton = ({
  style,
  setActive,
  active,
  mouseDownHandler,
  mouseUpHandler,
  searchTerm,
  setState,
  dispatch,
  fileTableColumns
}) => {
  return (
    <Button
      style={style}
      leftIcon={<ArrangeIcon />}
      onClick={() => setActive(true)}
    >
      {active &&
        <Column
          style={{ ...dropdown, width: '22rem' }}
          onMouseDown={mouseDownHandler}
          onMouseUp={mouseUpHandler}
        >
          <Row>
            <SearchIcon style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Filter Columns"
              style={styles.searchInput}
              ref={node => { searchInput = node }}
              onChange={() => setState(() => searchInput.value)}
            />
          </Row>
          <Row
            style={styles.restoreDefaults}
            onClick={() => dispatch(restoreFileTableColumns())}
          >
            Restore Defaults
          </Row>
          {fileTable
          .filter(x => x.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(x =>
            <Row key={x.id} style={styles.row}>
              <Row onClick={() => dispatch(toggleFileTableColumn(x.id))}>
                <input
                  readOnly
                  style={{ pointerEvents: 'none' }}
                  type="checkbox"
                  checked={fileTableColumns.includes(x.id)}
                />
                <span style={{ marginLeft: '0.3rem' }}>{x.name}</span>
              </Row>
              <ArrangeIcon style={{ marginLeft: 'auto' }} />
            </Row>
          )}
        </Column>
      }
    </Button>
  )
}

ArrangeColumnsButton.propTypes = {
  style: PropTypes.object,
  setActive: PropTypes.func,
  active: PropTypes.bool,
  mouseDownHandler: PropTypes.func,
  mouseUpHandler: PropTypes.func,
  searchTerm: PropTypes.string,
  setState: PropTypes.func,
  dispatch: PropTypes.func,
  fileTableColumns: PropTypes.array,
}

const enhance = compose(
  withDropdown,
  withState('searchTerm', 'setState', ''),
  pure
)

const mapState = state => ({
  fileTableColumns: state.activeFileTableColumns,
})

/*----------------------------------------------------------------------------*/

export default connect(mapState)(enhance(ArrangeColumnsButton))
