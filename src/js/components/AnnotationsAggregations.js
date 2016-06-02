import Relay from 'react-relay';
import { Link } from 'react-router';
import { div, span, h3, h } from 'react-hyperscript-helpers';

export const AnnotationsAggregations = props => {
  console.log('AnnotationsAggregations', props);
  return div([
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

export default Relay.createContainer(AnnotationsAggregations, {
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
