// Vendor
import Relay from 'react-relay';
import { tbody, h } from 'react-hyperscript-helpers';

// Custom
import theme from 'theme';
import FileTr from 'containers/FileTr';

/*----------------------------------------------------------------------------*/

export const FileTBody = props => {
  console.log(2, props);
  return (
    tbody(
      props.edges.map((e, i) => (
        h(FileTr, {
          ...e,
          style: i % 2 === 0 ? { backgroundColor: theme.greyScale5 } : {},
          key: e.node.id,
        })
      ))
    )
  );
};

export default Relay.createContainer(FileTBody, {
  fragments: {
    edges: () => Relay.QL`
      fragment on FileEdge @relay(plural: true){
        node {
          id
          ${FileTr.getFragment('node')}
        }
      }
    `,
  },
});
