import Relay from 'react-relay';
import { Link } from 'react-router';
import { h, div } from 'react-hyperscript-helpers';

export const App = (props) => (
  div({
    children: [
      h(Link, {
        to: {
          pathname: '/files',
        },
      }, '~~~files~~~'),
      props.children,
    ],
  })
);

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        cases {
          hits(first: 2) {
            edges {
              node {
                id
              }
            }
          }
        }

      }
    `,
  },
});
