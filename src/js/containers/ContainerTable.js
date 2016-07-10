import Relay from 'react-relay';
import { div, table, thead, tr, th, h } from 'react-hyperscript-helpers';

import ContainerTBody from 'containers/ContainerTBody';

export const ContainerTable = props => (
  div([
    table([
      thead([
        tr([
          th('Pull Request'),
          th('Created'),
          th('State'),
          th('Status'),
          th('Ports'),
        ]),
      ]),
      h(ContainerTBody, { edges: props.containers.edges }),
    ]),
  ])
);

export default Relay.createContainer(ContainerTable, {
  fragments: {
    containers: () => Relay.QL`
      fragment on ContainerConnection {
        edges {
          ${ContainerTBody.getFragment('edges')}
        }
      }
    `,
  },
});
