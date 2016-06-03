import Relay from 'react-relay';
import { Link, withRouter } from 'react-router';
import { div, span, h3, h } from 'react-hyperscript-helpers';

import TermFacet from 'components/TermFacet';

export const AnnotationsAggregations = props => {
  console.log('AnnotationsAggregations', props);
  console.log(props.router.createLocation({ query: { a: 1 } }));

  return div([
    h(TermFacet, {
      pathname: '/annotations',
      field: 'annotations.classification',
      params: props.relay.route.params,
      buckets: props.aggregations.classification.buckets,
    }),
    h3('Classification'),
    div(props.aggregations.classification.buckets.map(b => div([h(Link, {
      to: {
        pathname: '/annotations',
        query: {
          ...props.relay.route.params,
          filters: btoa(JSON.stringify({
            op: 'and',
            content: [
              {
                op: '=',
                content: {
                  field: 'classification',
                  value: b.key,
                },
              },
            ],
          })),
        },
      },
    }, b.key), span([b.doc_count + 0])]))),
  ]);
};

export default Relay.createContainer(withRouter(AnnotationsAggregations), {
  prepareVariable: prevState => {
    console.log('aa: ', prevState);
  },
  fragments: {
    aggregations: () => Relay.QL`
      fragment on AnnotationsAgg {
        classification {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
});
