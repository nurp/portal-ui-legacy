import Relay from 'react-relay';
import { Link } from 'react-router';
import { div, span, h3, h } from 'react-hyperscript-helpers';

export const FileAggregations = props => {
  console.log('FileAggregations', props);
  return div([
    h3('Access Level'),
    div(props.aggregations.access.buckets.map(b => div([h(Link, {
      to: {
        pathname: '/files',
        query: {
          ...props.relay.route.params,
          filters: btoa(JSON.stringify({
            op: '=',
            content: {
              field: 'files.access',
              value: b.key,
            },
          })),
        },
      },
    }, b.key), span([b.doc_count])]))),
    h3('Platform'),
    div(props.aggregations.platform.buckets.map(b => div([h(Link, {
      to: {
        pathname: '/files',
        query: {
          ...props.relay.route.params,
          filters: btoa(JSON.stringify({
            op: '=',
            content: {
              field: 'files.platform',
              value: b.key,
            },
          })),
        },
      },
    }, b.key), span([b.doc_count])]))),
    h3('Origin'),
    div(props.aggregations.origin.buckets.map(b => div(`${b.key}: ${b.doc_count}`))),
    h3('Center Name'),
    div(props.aggregations.center__name.buckets.map(b => div(`${b.key}: ${b.doc_count}`))),
  ]);
};

export default Relay.createContainer(FileAggregations, {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on FilesAgg {
        access {
          buckets {
            doc_count
            key
          }
        }
        origin {
          buckets {
            doc_count
            key
          }
        }
        platform {
          buckets {
            doc_count
            key
          }
        }
        center__name {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
});
