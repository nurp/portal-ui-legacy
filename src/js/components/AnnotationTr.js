import Relay from 'react-relay';
import { tr, td } from 'react-hyperscript-helpers';

const AnnotationTr = ({ node }) => (
  tr([
    td(node.annotation_id),
    td(node.case_id),
    td(node.project.project_id),
    td(node.entity_type),
    td(node.entity_id),
    td(node.category),
    td(node.classification),
    td(node.created_datetime),
  ])
);

export default Relay.createContainer(AnnotationTr, {
  fragments: {
    node: () => Relay.QL`
      fragment on Annotation {
        annotation_id
        case_id
        project {
          project_id
        }
        entity_type
        entity_id
        category
        classification
        created_datetime
      }
    `,
  },
});
