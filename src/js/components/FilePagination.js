import Relay from 'react-relay';
import { Link } from 'react-router';
import { div, h } from 'react-hyperscript-helpers';

export const FilePagination = props => {
  console.log('FilePagination', props);
  return div([
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
          filters: props.relay.route.params.filters
            ? btoa(JSON.stringify(props.relay.route.params.filters))
            : null,
          offset: props.pagination.total - props.pagination.total % 20,
        },
      },
    }, ' >> '),
  ]);
};

export default Relay.createContainer(FilePagination, {
  fragments: {
    pagination: () => Relay.QL`
      fragment on ESPagination {
        total
        size
        count
        offset
        sort
      }
    `,
  },
});
