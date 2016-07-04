import Relay from 'react-relay';
import { tbody, h } from 'react-hyperscript-helpers';

import ContainerTr from 'containers/ContainerTr';

export const ContainerTBody = props => (
  tbody(
    props.edges.map(e => (
      h(ContainerTr, {
        ...e,
        key: e.node.id,
      })
    ))
  )
);

export default Relay.createContainer(ContainerTBody, {
  fragments: {
    edges: () => Relay.QL`
      fragment on ContainerEdge @relay(plural: true){
        node {
          id
          ${ContainerTr.getFragment('node')}
        }
      }
    `,
  },
});
