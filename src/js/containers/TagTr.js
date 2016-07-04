import Relay from 'react-relay';
import { button, tr, td } from 'react-hyperscript-helpers';

const TagTr = ({ node, handleOnClick }) => (
  tr([
    td(node.name),
    td(node.start_ts),
    td([
      button({
        children: 'Deploy',
        onClick: () => {
          handleOnClick('quay.io/ncigdc/portal-ui', node.name);
        },
      }),
    ]),
  ])
);

export default Relay.createContainer(TagTr, {
  fragments: {
    node: () => Relay.QL`
      fragment on Tag {
        name
        start_ts
      }
    `,
  },
});
