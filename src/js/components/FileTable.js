import Relay from 'react-relay';
import { Link } from 'react-router';
import { div, h1, table, thead, tr, th, h } from 'react-hyperscript-helpers';

import FileTBody from 'components/FileTBody';

export const FileTable = props => {
  console.log(1, props);
  return div([
    h1(`Files ${props.files.hits.pagination.count} : ${props.files.hits.pagination.total}`),
    h(Link, {
      to: {
        pathname: '/files',
        query: {
          ...props.relay.route.params,
          offset: 0,
          filters: btoa(JSON.stringify({
            op: '=',
            content: {
              field: 'files.access',
              value: 'controlled',
            },
          })),
        },
      },
    }, 'Add Filters!'),
    h(Link, {
      to: {
        pathname: '/files',
        query: {
          ...props.relay.route.params,
          offset: 0,
          filters: null,
        },
      },
    }, 'Remove Filters!'),
    table([
      thead([
        tr([
          th('Access'),
          th('Name'),
          th('Cases'),
          th('Projects'),
          th('Category'),
          th('Format'),
          th('Size'),
        ]),
      ]),
      h(FileTBody, props.files.hits),
    ]),
    h(Link, {
      to: {
        pathname: '/files',
        query: {
          ...props.relay.route.params,
          filters: props.relay.route.params.filters
            ? btoa(JSON.stringify(props.relay.route.params.filters))
            : null,
          offset: 0,
        },
      },
    }, ' << '),
    h(Link, {
      to: {
        pathname: '/files',
        query: {
          ...props.relay.route.params,
          filters: props.relay.route.params.filters
            ? btoa(JSON.stringify(props.relay.route.params.filters))
            : null,
          offset: props.relay.route.params.offset - props.relay.route.params.first,
        },
      },
    }, ' < '),
    h(Link, {
      to: {
        pathname: '/files',
        query: {
          ...props.relay.route.params,
          filters: props.relay.route.params.filters
            ? btoa(JSON.stringify(props.relay.route.params.filters))
            : null,
          offset: props.relay.route.params.offset + props.relay.route.params.first,
        },
      },
    }, ' > '),
    h(Link, {
      to: {
        pathname: '/files',
        query: {
          ...props.relay.route.params,
          offset: props.files.hits.pagination.total - props.files.hits.pagination.total % 20,
        },
      },
    }, ' >> '),
  ]);
};

export default Relay.createContainer(FileTable, {
  initialVariables: {
    first: 0,
    offset: 0,
    filters: null,
  },
  fragments: {
    files: () => Relay.QL`
      fragment on Files {
        hits(first: $first offset: $offset, filters: $filters) {
          pagination {
            total
            size
            count
            offset
            sort
          }
          edges {
            ${FileTBody.getFragment('edges')}
          }
      }
      }
    `,
  },
});
