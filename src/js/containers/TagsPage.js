import Relay from 'react-relay';
import { div, h } from 'react-hyperscript-helpers';

import TagTable from 'containers/TagTable';

import CreateContainerMutation from 'mutations/CreateContainerMutation';

export const TagsPage = props => {
  function deploy(Image, name) {
    props.relay.commitUpdate(
      new CreateContainerMutation({
        Image,
        name,
        viewer: props.viewer,
      })
    );
  }

  return div([
    h(TagTable, { tags: props.viewer.tags, handleOnClick: deploy }),
  ]);
};

export default Relay.createContainer(TagsPage, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${CreateContainerMutation.getFragment('viewer')},
        tags(first: 100) {
          ${TagTable.getFragment('tags')}
        }
      }
    `,
  },
});
