// Vendor
import React, { PropTypes } from 'react';
import { compose, withState, mapProps } from 'recompose';
import { Link } from 'react-router';
import AngleIcon from 'react-icons/lib/fa/angle-down';

// Custom
import { Row, Column } from 'uikit/Flex';
import A from 'uikit/A';
import theme from 'theme';

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
  countBubble: {
    marginLeft: 'auto',
    backgroundColor: '#5b5151',
    fontSize: '1rem',
    color: 'white',
    padding: '.2em .6em .3em',
    borderRadius: '.25em',
    fontWeight: 'bold',
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
};

const mergeFilters = ({ filterContent, value, field }) => ({
  op: 'and',
  content: [
    ...filterContent,
    {
      op: 'in',
      content: { field, value },
    },
  ],
});

const TermFacet = ({
  title,
  buckets,
  pathname,
  params,
  state,
  toggleCollapsed,
  toggleShowMore,
}) => {
  const dotField = title.replace(/__/g, '.');

  return (
    <Column style={styles.container}>
      <Row style={styles.header} onClick={() => toggleCollapsed()}>
        <AngleIcon style={{ transform: `rotate(${state.collapsed ? 270 : 0}deg)` }} />
        {title}
      </Row>
      {!state.collapsed &&
        <Column>
          {buckets.slice(0, state.showingMore ? Infinity : 5).map(bucket => {
            const mergedFilters = mergeFilters({
              filterContent: (params.filters || {}).content || [],
              value: [bucket.key],
              field: dotField,
            });

            return (
              <Row key={bucket.key} style={styles.bucketRow}>
                <Link
                  style={styles.bucketLink}
                  to={{
                    pathname,
                    query: {
                      ...params,
                      offset: 0,
                      filters: JSON.stringify(mergedFilters),
                    },
                  }}
                >
                  <input type="checkbox" />
                  {bucket.key}
                </Link>
                <A style={styles.countBubble}>{bucket.doc_count}</A>
              </Row>
            );
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
  );
};

TermFacet.propTypes = {
  title: PropTypes.string,
  buckets: PropTypes.array,
  pathname: PropTypes.string,
  params: PropTypes.object,
  filters: PropTypes.object,
  state: PropTypes.object, // TODO: make shape
  toggleCollapsed: PropTypes.func,
  toggleShowMore: PropTypes.func,
};

const enhance = compose(
  withState('state', 'setState', { collapsed: false, showingMore: false }),
  mapProps(({ setState, ...rest }) => ({
    toggleCollapsed: () => setState(state => ({ collapsed: !state.collapsed })),
    toggleShowMore: () => setState(state => ({ showingMore: !state.showingMore })),
    ...rest,
  }))
);

export default enhance(TermFacet);
