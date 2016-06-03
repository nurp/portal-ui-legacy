import { Link } from 'react-router';
import { div, span, h3, h } from 'react-hyperscript-helpers';

const TermFacet = props => {
  const wrapAnd = {
    op: 'and',
    content: [],
  };

  return div([
    h3(props.field),
    div(props.buckets.map(bucket => {
      const mergeFilters = (filters, b) => {
        console.log(filters);
        return {
          op: 'and',
          content: [
            ...filters.content,
            {
              op: 'in',
              content: {
                field: props.field,
                value: [b.key],
              },
            },
          ],
        };
      };

      const mergedFilters = mergeFilters(props.params.filters || wrapAnd, bucket);
      console.log(bucket.key, mergedFilters);
      return div([
        h(Link, {
          to: {
            pathname: props.pathname,
            query: {
              ...props.params,
              offset: 0,
              filters: btoa(JSON.stringify(mergedFilters)),
            },
          },
        }, bucket.key),
        span([bucket.doc_count]),
      ]);
    })),
  ]);
};

export default TermFacet;
