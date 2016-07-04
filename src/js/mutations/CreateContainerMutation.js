import Relay from 'react-relay';

export default class CreateContainerMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User { id }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{createContainer}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on CreateContainerPayload @relay(pattern: true) {
        containerEdge
        viewer { containers }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'containers',
      edgeName: 'containerEdge',
      rangeBehaviors: () => 'prepend',
    }];
  }
  getVariables() {
    return {
      Image: this.props.Image,
      name: this.props.name,
    };
  }
  getOptimisticResponse() {
    return {
      containerEdge: {
        node: {
          Names: [this.props.name],
          Image: this.props.Image,
          State: 'Deploying',
        },
      },
      viewer: {
        id: this.props.viewer.id,
      },
    };
  }
}
