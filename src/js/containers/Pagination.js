// Vendor
import React, { PropTypes } from 'react'
import Radium from 'radium'
import Relay from 'react-relay'
import { Link as L } from 'react-router'
import DoubleLeftIcon from 'react-icons/lib/fa/angle-double-left'
import LeftIcon from 'react-icons/lib/fa/angle-left'
import RightIcon from 'react-icons/lib/fa/angle-right'
import DoubleRightIcon from 'react-icons/lib/fa/angle-double-right'
import CaretUpIcon from 'react-icons/lib/fa/caret-up'
import _ from 'lodash'

// Custom
import { prepareJsonParam } from 'routes/utils'
import ButtonGroup from 'uikit/ButtonGroup'
import { Row, Column } from 'uikit/Flex'
import Button from 'uikit/Button'
import withDropdown from 'uikit/withDropdown'
import { dropdown } from 'theme/mixins'
import theme from 'theme'

/*----------------------------------------------------------------------------*/

const Link = Radium(L)

const styles = {
  container: {
    padding: '1rem',
    alignItems: 'center',
  },
  tableActionButtons: {
    padding: '0.6rem',
    backgroundColor: 'white',
    color: theme.greyScale1,
    border: `1px solid ${theme.greyScale4}`,
  },
  inactive: {
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
  },
  active: {
    backgroundColor: theme.secondary,
    color: 'white',
  },
  firstDropdown: {
    minWidth: '0px',
    alignItems: 'center',
    bottom: '32px',
    top: 'auto',
  },
}

const arrowStyles = {
  ...styles.tableActionButtons,
  ...styles.inactive,
}

export const Pagination = ({
  relay,
  pathname,
  pagination,
  setActive,
  active,
  mouseUpHandler,
  mouseDownHandler,
  ...props,
}) => {
  console.log('Pagination', props)

  const { filters: f, ...params } = relay.route.params

  const filters = f ? prepareJsonParam(relay.route.params.f) : {}

  const merge = query => ({
    ...params,
    ...query,
  })

  const to = offset => ({
    pathname,
    query: merge({
      offset,
      ...(filters || {}),
    }),
  })

  const currentPage = (params.offset / params.first) + 1
  const totalPages = pagination.total / params.first
  const pageOffset = 10 * Math.floor((currentPage - 1) / 10)

  return (
    <Row style={styles.container}>
      <Row style={{ alignItems: 'center' }}>
        <span>Show</span>
        <Button
          rightIcon={<CaretUpIcon />}
          style={{ ...arrowStyles, margin: '0 0.5rem' }}
          onClick={() => setActive(true)}
        >
          {params.first}
          {active &&
            <Column
              style={{ ...dropdown, ...styles.firstDropdown }}
              onMouseDown={mouseDownHandler}
              onMouseUp={mouseUpHandler}
            >
              {_.range(1, 6).map(x =>
                <Link
                  key={x}
                  to={{ pathname, query: { ...params, ...(filters || {}), first: x * 20 } }}
                  style={{ padding: '1rem' }}
                  onClick={() => setTimeout(() => setActive(false))}
                >
                  {x * 20}
                </Link>
              )}
            </Column>
          }
        </Button>
        <span>results</span>
      </Row>
      <Row style={{ marginLeft: 'auto' }}>
        <ButtonGroup>
          <Link style={arrowStyles} to={to(0)}><DoubleLeftIcon /></Link>
          <Link
            style={arrowStyles}
            to={to(params.offset - params.first)}
          >
            <LeftIcon />
          </Link>
          {_.range(1 + pageOffset, Math.min(11 + pageOffset, totalPages)).map(x =>
            <Link
              key={x}
              style={{
                ...styles.tableActionButtons,
                ...(currentPage === x ? styles.active : styles.inactive),
              }}
              to={to((x - 1) * params.first)}
            >
              {x}
            </Link>
          )}
          <Link
            style={arrowStyles}
            to={to(params.offset + params.first)}
          >
            <RightIcon />
          </Link>
          <Link
            style={arrowStyles}
            to={to(pagination.total - pagination.total % pagination.size)}
          >
            <DoubleRightIcon />
          </Link>
        </ButtonGroup>
      </Row>
    </Row>
  )
}

Pagination.propTypes = {
  relay: PropTypes.object,
  pathname: PropTypes.string,
  pagination: PropTypes.object,
  setActive: PropTypes.func,
  active: PropTypes.bool,
  mouseDownHandler: PropTypes.func,
  mouseUpHandler: PropTypes.func,
}

export default Relay.createContainer(withDropdown(Pagination), {
  fragments: {
    pagination: () => Relay.QL`
      fragment on ESPagination {
        total
        size
        count
        offset
        sort
      }
    `,
  },
})
