import Relay from 'react-relay';
import { div, h1, button, table, thead, tr, th, h } from 'react-hyperscript-helpers';

import FileTBody from 'components/FileTBody';

export const FileTable = props => {
  console.log(1, props);
  return div([
    h1(`Files ${props.files.hits.pagination.count} : ${props.files.hits.pagination.total}`),
    button({
      onClick: () => {
        props.relay.setVariables({
          offset: 0,
          filters: {
            op: '=',
            content: {
              field: 'files.access',
              value: 'controlled',
            },
          },
        });
      },
    }, 'Add Filters!'),
    button({
      onClick: () => {
        props.relay.setVariables({
          offset: 0,
          filters: null,
        });
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
    button({
      onClick: () => props.relay.setVariables({
        offset: 0,
        filters: null,
      }),
    }, '<<'),
    button({
      onClick: () => props.relay.setVariables({
        offset: props.files.hits.pagination.offset - 20,
        filters: null,
      }),
    }, '<'),
    button({
      onClick: () => props.relay.setVariables({
        offset: props.files.hits.pagination.offset + 20,
        filters: null,
      }),
    }, '>'),
    button({
      onClick: () => props.relay.setVariables({
        offset: props.files.hits.pagination.total - props.files.hits.pagination.total % 20,
        filters: null,
      }),
    }, '>>'),
  ]);
};

export default Relay.createContainer(FileTable, {
  initialVariables: {
    first: 20,
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
