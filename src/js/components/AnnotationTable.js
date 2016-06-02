import Relay from 'react-relay';
import { h2, div, table, thead, tr, th, h } from 'react-hyperscript-helpers';

import AnnotationTBody from 'components/AnnotationTBody';
import FilePagination from 'components/FilePagination';

export const AnnotationTable = props => {
  console.log('AnnotationTable', props);
  return div([
    h2(`Annotations ${props.hits.pagination.count} : ${props.hits.pagination.total}`),
    table([
      thead([
        tr([
          th('UUID'),
          th('Case UUID'),
          th('Project'),
          th('Entity Type'),
          th('Entity UUID'),
          th('Category'),
          th('Classification'),
          th('Date Created'),
        ]),
      ]),
      h(AnnotationTBody, { edges: props.hits.edges }),
    ]),
    h(FilePagination, { pagination: props.hits.pagination }),
  ]);
};

export default Relay.createContainer(AnnotationTable, {
  initialVariables: {
    first: 0,
    offset: 0,
    filters: null,
  },
  fragments: {
    hits: () => Relay.QL`
      fragment on AnnotationConnection {
        pagination {
          count
          total
          ${FilePagination.getFragment('pagination')}
        }
        edges {
          ${AnnotationTBody.getFragment('edges')}
        }
      }
    `,
  },
});
