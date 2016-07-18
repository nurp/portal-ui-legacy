import { Link } from 'react-router';
import { h, div } from 'react-hyperscript-helpers';
import { Row, Column } from 'uikit/Flex';

const App = (props) => (
  h(Column, {
    children: [
      div({
        children: [
          h(Link, { to: { pathname: '/' } }, '~~~home~~~'),
          h(Link, { to: { pathname: '/files' } }, '~~~files~~~'),
          h(Link, { to: { pathname: '/annotations' } }, '~~~annotations~~~'),
          h(Row, { children: props.children }),
        ],
      }),
    ],
  })
);

export default App;
