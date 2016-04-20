import Relay from 'react-relay';
import { div, h1, button, table, thead, tbody, tr, th, h } from 'react-hyperscript-helpers';

import FileTr from 'components/FileTr';

export const FileTable = props => {
  console.log(props);
  return div([
    h1(`Files ${props.hits.pagination.count} : ${props.hits.pagination.total}`),
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
    props.hits.pagination.offset > 0 && button({
      onClick: () => props.handleBBack(),
    }, '<<'),
    props.hits.pagination.offset > 0 && button({
      onClick: () => props.handleBack(props.hits.pagination.offset - 20),
    }, '<'),
    props.hits.pagination.offset < props.hits.pagination.total - 20 && button({
      onClick: () => props.handleForward(props.hits.pagination.offset + 20),
    }, '>'),
    props.hits.pagination.offset < props.hits.pagination.total - 20 && button({
      onClick: () => props.handleFForward(
        props.hits.pagination.total - props.hits.pagination.total % 20
      ),
    }, '>>'),
  ]);
};

export default Relay.createContainer(FileTable, {
  fragments: {
    hits: () => Relay.QL`
      fragment on FileConnection {
        pagination {
          total
          size
          count
          offset
          sort
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
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
