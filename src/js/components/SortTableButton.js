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
import fileTable from 'models/fileTable'
import theme from 'theme'

/*----------------------------------------------------------------------------*/

const styles = {
  checkboxRow: {
    padding: '0.3rem',
    ':hover': {
      backgroundColor: theme.greyScale6,
      borderRight: `2px solid ${theme.secondary}`,
    },
  },
  radioRow: {
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
}) => {
  const { sort, ...query } = location.query
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
          {fileTable.filter(x => x.sortable).map(x => {
            const nextSort = sort.includes(x.id)
              ? fields.filter(f => !f.includes(x.id)).join(',')
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
                      checked={sort.includes(x.id)}
                    />
                    <span style={{ marginLeft: '0.3rem' }}>{x.name}</span>
                  </Link>
                </Row>
                <Row style={styles.radioRow}>
                  <ArrowDownIcon />
                  <input type="radio" />
                  <ArrowUpIcon />
                  <input type="radio" />
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
}

/*----------------------------------------------------------------------------*/

export default withRouter(withDropdown(SortTableButton))
