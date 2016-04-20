import Relay from 'react-relay';
import { div, button, h } from 'react-hyperscript-helpers';

import FileTable from 'components/FileTable';
import CaseTable from 'components/CaseTable';

export const App = props => (
  div({
    children: [
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
      h(FileTable, {
        ...props.viewer.files,
        handleBBack: () => {
          props.relay.setVariables({
            offset: 0,
          });
        },
        handleBack: (offset) => {
          props.relay.setVariables({
            offset,
          });
        },
        handleForward: (offset) => {
          props.relay.setVariables({
            offset,
          });
        },
        handleFForward: (offset) => {
          props.relay.setVariables({
            offset,
          });
        },
      }),
      h(CaseTable, props.viewer.cases),
    ],
  })
);

export default Relay.createContainer(App, {
  initialVariables: {
    first: 20,
    offset: 0,
    filters: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        cases {
          hits(first: 2) {
            ${CaseTable.getFragment('hits')}
          }
        }
        files {
          hits(first: $first offset: $offset filters: $filters) {
            ${FileTable.getFragment('hits')}
          }
        }
      }
    `,
  },
});
