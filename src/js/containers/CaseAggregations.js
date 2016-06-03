import Relay from 'react-relay';
import { Link } from 'react-router';
import { div, span, h3, h } from 'react-hyperscript-helpers';

export const CaseAggregations = props => {
  console.log('CaseAggregations', props);
  return div([
    h3('Primary Site'),
    div(props.aggregations.project__primary_site.buckets.map(b => div([h(Link, {
      to: {
        pathname: '/files',
        query: {
          ...props.relay.route.params,
          filters: btoa(JSON.stringify({
            op: 'and',
            content: [
              {
                op: '=',
                content: {
                  field: 'cases.project.primary_site',
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

export default Relay.createContainer(CaseAggregations, {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on CasesAgg {
        project__primary_site {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
});
