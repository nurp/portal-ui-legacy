import Relay from 'react-relay';
import { div, h } from 'react-hyperscript-helpers';

import FileTable from 'components/FileTable';
import CaseTable from 'components/CaseTable';

export const App = props => (
  div({
    children: [
      h(FileTable, props.viewer.files),
      h(CaseTable, props.viewer.cases),
    ],
  })
);

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        cases {
          hits(first: 4) {
            ${CaseTable.getFragment('hits')}
          }
        }
        files {
          hits(first: 6) {
            ${FileTable.getFragment('hits')}
          }
        }
      }
    `,
  },
});
