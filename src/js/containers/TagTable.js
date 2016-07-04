import Relay from 'react-relay';
import { div, table, thead, tr, th, h } from 'react-hyperscript-helpers';

import TagTBody from 'containers/TagTBody';

export const TagTable = props => (
  div([
    table([
      thead([
        tr([
          th('Pull Request'),
          th('Date'),
        ]),
      ]),
      h(TagTBody, { edges: props.tags.edges, handleOnClick: props.handleOnClick }),
    ]),
  ])
);

export default Relay.createContainer(TagTable, {
  fragments: {
    tags: () => Relay.QL`
      fragment on TagConnection {
        edges {
          ${TagTBody.getFragment('edges')}
        }
      }
    `,
  },
});
