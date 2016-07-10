import Relay from 'react-relay';
import { a, tr, td } from 'react-hyperscript-helpers';

const ContainerTr = ({ node }) => {
  const pullRequest = node.Image.split(':')[1];
  return tr([
    td(pullRequest),
    td(node.Created),
    td(node.State),
    td(node.Status),
    td((node.Ports || []).filter(p => p.PrivatePort === 80).map(p => {
      const url = `${window.location.protocol}//${window.location.hostname}:${p.PublicPort}`;
      return a({
        children: url,
        href: url,
        target: '_blank',
      });
    })
  ),
  ]);
};

export default Relay.createContainer(ContainerTr, {
  fragments: {
    node: () => Relay.QL`
      fragment on Container {
        Image
        Created
        State
        Status
        Ports {
          PublicPort
          PrivatePort
        }
      }
    `,
  },
});
