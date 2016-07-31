// Vendor
import React, { PropTypes } from 'react'
import { Link, withRouter } from 'react-router'
import UndoIcon from 'react-icons/lib/md/undo'

// Custom
import Button from 'uikit/Button'
import { Row } from 'uikit/Flex'

/*----------------------------------------------------------------------------*/

const styles = {
  leftParen: {
    fontSize: '2rem',
    marginRight: '0.3rem',
  },
  rightParen: {
    fontSize: '2rem',
    marginRight: '0.3rem',
  },
}

const CurrentFilters = ({ location }) => {
  const { filters, ...query } = location.query
  const currentFilters = filters ? JSON.parse(filters).content : []

  return (
    <Row wrap spacing="0.3rem">
      <Link to={{ pathname: location.pathname, query }}>
        <Button leftIcon={<UndoIcon />}>Clear</Button>
      </Link>

      {currentFilters.map((filter, i) =>
        <Row key={filter.content.field} spacing="0.3rem">
          <Button>{filter.content.field}</Button>
          {filter.op === 'in' && filter.content.value.length === 1 && <Button>IS</Button>}
          {filter.op === 'in' && filter.content.value.length > 1 && <Button>IN</Button>}
          {filter.op !== 'in' && <Button>{filter.op}</Button>}
          {filter.content.value.length > 1 && <span style={styles.leftParen}>(</span>}
          {filter.content.value.map(value =>
            <Button key={value}>{value}</Button>
          )}
          {filter.content.value.length > 1 && <span style={styles.rightParen}>)</span>}
          {i < currentFilters.length - 1 && <Button >AND</Button>}
        </Row>
      )}
    </Row>
  )
}

CurrentFilters.propTypes = {
  location: PropTypes.object,
}

/*----------------------------------------------------------------------------*/

export default withRouter(CurrentFilters)
