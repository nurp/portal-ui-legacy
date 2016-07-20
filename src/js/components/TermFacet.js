import React, { PropTypes } from 'react';
import { withState } from 'recompose';
import { Link } from 'react-router';
import { Row, Column } from 'uikit/Flex';
import AngleIcon from 'react-icons/lib/fa/angle-down';

const styles = {
  container: {
    padding: '1rem 1.2rem',
  },
  header: {
    color: '#bb0e3d',
    fontSize: '1.7rem',
    marginBottom: '0.5rem',
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
  collapsed,
  toggleCollapsed,
}) => {
  const dotField = title.replace(/__/g, '.');

  return (
    <Column style={styles.container}>
      <Row style={styles.header} onClick={() => toggleCollapsed(x => !x)}>
        <AngleIcon />
        {title}
      </Row>
      {!collapsed &&
        <div>
          {buckets.slice(0, 5).map(bucket => {
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
                <span style={styles.countBubble}>{bucket.doc_count}</span>
              </Row>
            );
          })}
        </div>
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
};

export default withState('collapsed', 'toggleCollapsed', false)(TermFacet);
