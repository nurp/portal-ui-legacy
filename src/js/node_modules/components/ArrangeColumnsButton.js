// Vendor
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { compose, withState, pure } from 'recompose'
import ArrangeIcon from 'react-icons/lib/fa/bars'
import SearchIcon from 'react-icons/lib/fa/search'

// Custom

import { Row, Column } from 'uikit/Flex'
import Button from 'uikit/Button'
import withDropdown from 'uikit/withDropdown'
import { dropdown } from 'theme/mixins'
import theme from 'theme'
import ArrangeColumns from 'components/ArrangeColumns'
import { restoreColumns } from 'dux/tableColumns'

/*----------------------------------------------------------------------------*/

const styles = {
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
  entityType,
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
            onClick={
              () => {
                dispatch(restoreColumns(entityType))
                setState(() => '')
              }
            }
          >
            Restore Defaults
          </Row>
          <ArrangeColumns
            entityType={entityType}
            searchTerm={searchTerm}
          />
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
  entityType: PropTypes.string,
}

const enhance = compose(
  withDropdown,
  withState('searchTerm', 'setState', ''),
  pure
)

/*----------------------------------------------------------------------------*/

export default connect()(enhance(ArrangeColumnsButton))
