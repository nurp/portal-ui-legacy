/* @flow */

import React from 'react';
import Relay from 'react-relay';
import { compose } from 'recompose';
import { createContainer } from 'recompose-relay';
import { Link } from 'react-router';

type PropsType = {
  node: {
    annotation_id: string,
    case_id: string,
    category: string,
    classification: string,
    created_datetime: string,
    entity_id: string,
    entity_type: string,
    project: {
      project_id: string,
    },
  },
};

const AnnotationTr = ({ node }: PropsType) => (
  <tr>
    <td>
      <Link to={{ pathname: `/annotations/${node.annotation_id}` }}>
        {node.annotation_id}
      </Link>
    </td>
    <td>{node.case_id}</td>
    <td>{node.project.project_id}</td>
    <td>{node.entity_type}</td>
    <td>{node.entity_id}</td>
    <td>{node.category}</td>
    <td>{node.classification}</td>
    <td>{node.created_datetime}</td>
  </tr>
);

const AnnotationTrQuery = {
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
};

export default compose(
  createContainer(AnnotationTrQuery)
)(AnnotationTr);