// Vendor
import React, { PropTypes } from 'react'
import { Link, withRouter } from 'react-router'
import SortIcon from 'react-icons/lib/fa/sort-alpha-asc'
import ArrowDownIcon from 'react-icons/lib/fa/long-arrow-down'
import ArrowUpIcon from 'react-icons/lib/fa/long-arrow-up'

// Custom
import { Row, Column } from 'uikit/Flex'
import Button from 'uikit/Button'
import withDropdown from 'uikit/withDropdown'
import { dropdown } from 'theme/mixins'
import entities from 'entities'
import theme from 'theme'

/*----------------------------------------------------------------------------*/

const styles = {
  checkboxRow: {
    padding: '0.3rem 0.6rem',
    ':hover': {
      backgroundColor: theme.greyScale6,
      borderRight: `2px solid ${theme.secondary}`,
    },
  },
  radioRow: {
    padding: '0.3rem 0.6rem',
    marginLeft: 'auto',
    alignItems: 'center',
  },
}

const SortTableButton = ({
  style,
  setActive,
  active,
  mouseDownHandler,
  mouseUpHandler,
  location,
  entityType,
}) => {
  const { sort = '', ...query } = location.query
  const fields = sort.split(',')

  return (
    <Button
      style={style}
      leftIcon={<SortIcon />}
      onClick={() => setActive(true)}
    >
      {active &&
        <Column
          style={{ ...dropdown, width: '22rem' }}
          onMouseDown={mouseDownHandler}
          onMouseUp={mouseUpHandler}
        >
          {entities[entityType].table.filter(x => x.sortable).map(x => {
            const sameField = fields.find(f => f.split(':')[0] === x.id)
            const otherFields = fields.filter(f => f.split(':')[0] !== x.id)

            const nextSort = sameField
              ? otherFields.join(',')
              : [...fields, `${x.id}:asc`].join(',')

            return (
              <Row key={x.id} style={{ lineHeight: '1.5' }}>
                <Row style={styles.checkboxRow} flex="1">
                  <Link
                    style={{ width: '100%' }}
                    to={{
                      pathname: location.pathname,
                      query: {
                        ...query,
                        ...(nextSort ? { sort: nextSort } : {}),
                      },
                    }}
                    onClick={() => setTimeout(() => setActive(false))}
                  >
                    <input
                      readOnly
                      style={{ pointerEvents: 'none' }}
                      type="checkbox"
                      checked={!!sameField}
                    />
                    <span style={{ marginLeft: '0.3rem' }}>{x.name}</span>
                  </Link>
                </Row>
                <Row style={styles.radioRow}>
                  <Link
                    style={{ width: '100%' }}
                    to={{
                      pathname: location.pathname,
                      query: {
                        ...query,
                        sort: [...otherFields, `${x.id}:asc`].join(','),
                      },
                    }}
                    onClick={() => setTimeout(() => setActive(false))}
                  >
                    <ArrowDownIcon />
                    <input
                      readOnly
                      type="radio"
                      checked={!!sameField && sameField.split(':')[1] === 'asc'}
                    />
                  </Link>
                  <Link
                    style={{ width: '100%' }}
                    to={{
                      pathname: location.pathname,
                      query: {
                        ...query,
                        sort: [...otherFields, `${x.id}:desc`].join(','),
                      },
                    }}
                    onClick={() => setTimeout(() => setActive(false))}
                  >
                    <ArrowUpIcon />
                    <input
                      readOnly
                      type="radio"
                      checked={!!sameField && sameField.split(':')[1] === 'desc'}
                    />
                  </Link>
                </Row>
              </Row>
            )
          })}
        </Column>
      }
    </Button>
  )
}

SortTableButton.propTypes = {
  style: PropTypes.object,
  setActive: PropTypes.func,
  active: PropTypes.bool,
  mouseDownHandler: PropTypes.func,
  mouseUpHandler: PropTypes.func,
  location: PropTypes.object,
  entityType: PropTypes.string,
}

/*----------------------------------------------------------------------------*/

export default withRouter(withDropdown(SortTableButton))
