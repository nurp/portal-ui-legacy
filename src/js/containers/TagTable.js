import Relay from 'react-relay';
import { div, table, thead, tr, th, h } from 'react-hyperscript-helpers';

import TagTBody from 'containers/TagTBody';

export const TagTable = props => {
  const deployedPullRequests = props.containers.edges.map(e => e.node.Image.split(':')[1]);
  return div([
    table([
      thead([
        tr([
          th('Pull Request'),
          th('Date'),
        ]),
      ]),
      h(TagTBody, {
        edges: props.tags.edges.filter(e => !deployedPullRequests.includes(e.node.name)),
        handleOnClick: props.handleOnClick,
      }),
    ]),
  ]);
};

export default Relay.createContainer(TagTable, {
  fragments: {
    tags: () => Relay.QL`
      fragment on TagConnection {
        edges {
          node {
            name
          }
          ${TagTBody.getFragment('edges')}
        }
      }
    `,
    containers: () => Relay.QL`
      fragment on ContainerConnection {
        edges {
          node {
            Image
          }
        }
      }
    `,
  },
});
