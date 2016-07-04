import Relay from 'react-relay';
import { tbody, h } from 'react-hyperscript-helpers';

import TagTr from 'containers/TagTr';

export const TagTBody = props => (
  tbody(
    props.edges.map(e => (
      h(TagTr, {
        ...e,
        handleOnClick: props.handleOnClick,
        key: e.node.id,
      })
    ))
  )
);

export default Relay.createContainer(TagTBody, {
  fragments: {
    edges: () => Relay.QL`
      fragment on TagEdge @relay(plural: true){
        node {
          id
          ${TagTr.getFragment('node')}
        }
      }
    `,
  },
});
