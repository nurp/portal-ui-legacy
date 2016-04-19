import Relay from 'react-relay';
import { table, thead, tbody, tr, th, h } from 'react-hyperscript-helpers';

import FileTr from 'components/FileTr';

export const FileTable = props => (
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
    tbody(
      ((props.hits || {}).edges || []).map(e => (
        h(FileTr, {
          key: e.node.id,
          file: e.node,
        })
      ))
    ),
  ]),
);

export default Relay.createContainer(FileTable, {
  fragments: {
    hits: () => Relay.QL`
      fragment on FileConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
          total
        }
        edges {
          node {
            id
            ${FileTr.getFragment('file')}
          }
        }
      }
    `,
  },
});
