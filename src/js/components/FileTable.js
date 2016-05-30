import Relay from 'react-relay';
import { h2, div, table, thead, tr, th, h } from 'react-hyperscript-helpers';

import FileTBody from 'components/FileTBody';
import FilePagination from 'components/FilePagination';

export const FileTable = props => {
  console.log('FileTable', props);
  return div([
    h2(`Files ${props.hits.pagination.count} : ${props.hits.pagination.total}`),
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
      h(FileTBody, { edges: props.hits.edges }),
    ]),
    h(FilePagination, { pagination: props.hits.pagination }),
  ]);
};

export default Relay.createContainer(FileTable, {
  initialVariables: {
    first: 0,
    offset: 0,
    filters: null,
  },
  fragments: {
    hits: () => Relay.QL`
      fragment on FileConnection {
        pagination {
          count
          total
          ${FilePagination.getFragment('pagination')}
        }
        edges {
          ${FileTBody.getFragment('edges')}
        }
      }
    `,
  },
});
