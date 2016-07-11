import Relay from 'react-relay';
import { div, h, h2 } from 'react-hyperscript-helpers';

import ContainerTable from 'containers/ContainerTable';

export const ContainersPage = props => (
  div([
    h2('Running Pull Requests'),
    h(ContainerTable, { containers: props.viewer.containers }),
    h2('Deploy new Pull Request'),
    props.children,
  ])
);

export default Relay.createContainer(ContainersPage, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        containers(first: 20) {
          ${ContainerTable.getFragment('containers')}
        }
      }
    `,
  },
});
