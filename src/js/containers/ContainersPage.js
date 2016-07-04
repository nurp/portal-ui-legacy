import Relay from 'react-relay';
import { Link } from 'react-router';
import { div, h } from 'react-hyperscript-helpers';

import ContainerTable from 'containers/ContainerTable';

export const ContainersPage = props => (
  div([
    h(ContainerTable, { containers: props.viewer.containers }),
    h(Link, { to: { pathname: '/containers/tags' } }, 'Deploy new Container'),
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
