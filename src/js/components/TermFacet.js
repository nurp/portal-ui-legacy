// Vendor
import React, { PropTypes } from 'react'
import { compose, withState, mapProps, pure } from 'recompose'
import { Link, withRouter } from 'react-router'
import AngleIcon from 'react-icons/lib/fa/angle-down'

// Custom
import { mergeFilters, setFilters, setFilter, inCurrentFilters } from 'utils/filters'
import CountBubble from 'components/CountBubble'
import { Row, Column } from 'uikit/Flex'
import A from 'uikit/A'
import theme from 'theme'

/*----------------------------------------------------------------------------*/

const styles = {
  container: {
    padding: '1rem 1.2rem',
  },
  header: {
    color: theme.primaryLight1,
    fontSize: '1.7rem',
    marginBottom: '0.5rem',
    cursor: 'pointer',
  },
  bucketRow: {
    padding: '0.3rem 0',
  },
  bucketLink: {
    color: '#3a3a3a',
    textDecoration: 'none',
  },
  toggleMore: {
    marginLeft: 'auto',
    color: theme.primaryLight1,
    fontSize: '1.2rem',
    cursor: 'pointer',
    ':hover': {
      color: 'blue',
      textDecoration: 'underline',
    },
  },
  bottomRow: {
    padding: '0.5rem',
  },
}

const TermFacet = ({
  location,
  field,
  title,
  buckets,
  pathname,
  state,
  toggleCollapsed,
  toggleShowMore,
}) => {
  const { filters, offset, ...query } = location.query
  const dotField = field.replace(/__/g, '.')
  const currentFilters = location.query.filters ? JSON.parse(filters).content : []

  return (
    <Column style={styles.container}>
      <Row style={styles.header} onClick={() => toggleCollapsed()}>
        <AngleIcon style={{ transform: `rotate(${state.collapsed ? 270 : 0}deg)` }} />
        {title}
      </Row>
      {!state.collapsed &&
        <Column>
          {buckets
          // Sort by active
          .reduce((acc, b) => (inCurrentFilters({ key: b.key, dotField, currentFilters })
            ? [b, ...acc]
            : [...acc, b]
          ), [])
          .slice(0, state.showingMore ? Infinity : 5)
          .map(bucket => {
            const sameField = currentFilters.find(x => x.content.field === dotField)

            let nextFilters

            if (sameField) {
              const value = sameField.content.value.includes(bucket.key)
                ? sameField.content.value.filter(x => x !== bucket.key)
                : [...sameField.content.value, bucket.key]

              nextFilters = value.length
                ? setFilter({ value, field: dotField })
                : setFilters(currentFilters.filter(x => x.content.field !== dotField))
            } else {
              nextFilters = mergeFilters({
                filterContent: currentFilters || [],
                value: [bucket.key],
                field: dotField,
              })
            }

            return (
              <Row key={bucket.key} style={styles.bucketRow}>
                <Link
                  style={styles.bucketLink}
                  to={{
                    pathname,
                    query: {
                      ...query,
                      ...(nextFilters ? {
                        filters: JSON.stringify(nextFilters),
                        offset,
                      } : {}),
                    },
                  }}
                >
                  <input
                    type="checkbox"
                    style={{ pointerEvents: 'none' }}
                    checked={inCurrentFilters({ key: bucket.key, dotField, currentFilters })}
                  />
                  {bucket.key}
                </Link>
                <CountBubble>{bucket.doc_count}</CountBubble>
              </Row>
            )
          })}

          {buckets.length > 5 &&
            <Row style={styles.bottomRow}>
              <Row style={styles.toggleMore} onClick={() => toggleShowMore()}>
                {state.showingMore
                  ? <A>Less...</A>
                  : <A>{buckets.length - 5} More...</A>
                }
              </Row>
            </Row>
          }
        </Column>
      }
    </Column>
  )
}

TermFacet.propTypes = {
  title: PropTypes.string,
  buckets: PropTypes.array,
  pathname: PropTypes.string,
  filters: PropTypes.object,
  state: PropTypes.object, // TODO: make shape
  toggleCollapsed: PropTypes.func,
  toggleShowMore: PropTypes.func,
  location: PropTypes.object,
  field: PropTypes.string,
}

const enhance = compose(
  withRouter,
  withState('state', 'setState', { collapsed: false, showingMore: false }),
  mapProps(({ setState, ...rest }) => ({
    toggleCollapsed: () => setState(state => ({ collapsed: !state.collapsed })),
    toggleShowMore: () => setState(state => ({ showingMore: !state.showingMore })),
    ...rest,
  })),
  pure
)

/*----------------------------------------------------------------------------*/

export default enhance(TermFacet)
