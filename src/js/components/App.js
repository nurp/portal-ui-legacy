import Relay from 'react-relay';
import { div } from 'react-hyperscript-helpers';

// import FileTable from 'components/FileTable';
// import CaseTable from 'components/CaseTable';

export const App = (props) => {
  console.log(0, props.relay.getPendingTransactions(props.viewer));
  return div({
    children: [
      props.children,
      // h(FileTable, props.viewer),
      // h(CaseTable, props.viewer.cases),
    ],
  });
};

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        cases {
          hits(first: 2) {
            edges {
              node {
                id
              }
            }
          }
        }

      }
    `,
  },
});
