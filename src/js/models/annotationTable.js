// Vendor
import React from 'react'

// Custom
import { Td } from 'uikit/Table'

/*----------------------------------------------------------------------------*/

const annotationTable = [
  {
    name: 'ID',
    id: 'annotation_id',
    sortable: true,
    td: note =>
      <Td key="annotation_id">
        <a href={`/legacy-archive/annotations/${note.annotation_id}`}>
          {note.annotation_id}
        </a>
      </Td>,
  },
  {
    name: 'Case UUID',
    id: 'case_id',
    sortable: true,
    td: note => <Td key="case_id">{note.case_id}</Td>,
  },
  {
    name: 'Program',
    id: 'project.program.name',
    sortable: true,
    hidden: true,
    td: note =>
      <Td key="project.program.name">
        {note.project && note.project.program && note.project.program.name}
      </Td>,
  },
  {
    name: 'Project',
    id: 'project.project_id',
    sortable: true,
    td: note =>
      <Td key="project.project_id">
        {note.project && note.project.project_id}
      </Td>,
  },
  {
    name: 'Entity Type',
    id: 'entity_type',
    sortable: true,
    td: note => <Td key="entity_type">{note.entity_type}</Td>,
  },
  {
    name: 'Entity ID',
    id: 'entity_id',
    sortable: true,
    td: note => <Td key="entity_id">{note.entity_id}</Td>,
  },
  {
    name: 'Entity Barcode',
    id: 'entity_submitter_id',
    sortable: true,
    hidden: true,
    td: note => <Td key="entity_submitter_id">{note.entity_submitter_id}</Td>,
  },
  {
    name: 'Category',
    id: 'category',
    sortable: true,
    td: note => <Td key="category">{note.category}</Td>,
  },
  {
    name: 'Classification',
    id: 'classification',
    sortable: true,
    td: note => <Td key="classification">{note.classification}</Td>,
  },
  {
    name: 'Created Date',
    id: 'created_datetime',
    td: note =>
      <Td key="created_datetime">
        {note.created_datetime && note.created_datetime}
      </Td>,
  },
  {
    name: 'Status',
    id: 'status',
    td: note => <Td key="status">{note.status}</Td>,
    sortable: true,
    hidden: true,
  },
  {
    name: 'Notes',
    id: 'notes',
    td: note => <Td key="notes">{note.notes}</Td>,
    sortable: false,
    hidden: true,
  },
]

/*----------------------------------------------------------------------------*/

export default annotationTable
