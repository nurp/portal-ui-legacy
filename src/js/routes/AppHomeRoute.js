import Relay from 'react-relay';

export default class Home extends Relay.Route {
  static routeName = 'AppHomeRoute';
  static queries = {
    viewer: (Component) => Relay.QL`
      query root {
        viewer {
          ${Component.getFragment('viewer')}
        }
      }
    `,
  };
}
