// Vendor
import React, { PropTypes } from 'react'
import { Link, withRouter } from 'react-router'
import UndoIcon from 'react-icons/lib/md/undo'
import Color from 'color'

// Custom
import { setFilters, setFilter } from 'utils/filters'
import Button from 'uikit/Button'
import { Row } from 'uikit/Flex'
import theme from 'theme'
import { buttonLike } from 'theme/mixins'

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
  op: {
    ...buttonLike,
    backgroundColor: theme.primary,
    color: 'white',
  },
  field: {
    backgroundColor: theme.greyScale2,
    ':hover': {
      backgroundColor: Color(theme.greyScale2).lighten(0.7).rgbString(),
    },
  },
  value: {
    backgroundColor: theme.success,
    ':hover': {
      backgroundColor: Color(theme.success).lighten(0.7).rgbString(),
    },
  },
}

const CurrentFilters = ({ location }) => {
  const { filters, offset, ...query } = location.query
  const currentFilters = filters ? JSON.parse(filters).content : []

  return (
    <Row wrap spacing="0.3rem">
      <Link to={{ pathname: location.pathname, query }}>
        <Button leftIcon={<UndoIcon />}>Clear</Button>
      </Link>

      {currentFilters.map((filter, i) => {
        const nextFilters = setFilters(currentFilters.filter(x =>
          x.content.field !== filter.content.field
        ))

        return (
          <Row key={filter.content.field} spacing="0.3rem">
            <Link
              to={{
                pathname: location.pathname,
                query: {
                  ...query,
                  ...(nextFilters ? {
                    filters: JSON.stringify(nextFilters),
                    offset,
                  } : {}),
                },
              }}
            >
              <Button style={styles.field}>{filter.content.field}</Button>
            </Link>
            {filter.op === 'in' && filter.content.value.length === 1 &&
              <span style={styles.op}>IS</span>
            }
            {filter.op === 'in' && filter.content.value.length > 1 &&
              <span style={styles.op}>IN</span>
            }
            {filter.op !== 'in' && <Button style={styles.op}>{filter.op}</Button>}
            {filter.content.value.length > 1 && <span style={styles.leftParen}>(</span>}
            {filter.content.value.map(value => {
              const nextValue = filter.content.value.filter(x => x !== value)

              const nextFilters = nextValue.length // eslint-disable-line
                ? setFilter({ value: nextValue, field: filter.content.field })
                : setFilters(currentFilters.filter(x => x.content.field !== filter.content.field))

              return (
                <Link
                  to={{
                    pathname: location.pathname,
                    query: {
                      ...query,
                      ...(nextFilters ? {
                        filters: JSON.stringify(nextFilters),
                        offset,
                      } : {}),
                    },
                  }}
                >
                  <Button key={value} style={styles.value}>{value}</Button>
                </Link>
              )
            })}
            {filter.content.value.length > 1 && <span style={styles.rightParen}>)</span>}
            {i < currentFilters.length - 1 && <Button >AND</Button>}
          </Row>
        )
      })}
    </Row>
  )
}

CurrentFilters.propTypes = {
  location: PropTypes.object,
}

/*----------------------------------------------------------------------------*/

export default withRouter(CurrentFilters)
