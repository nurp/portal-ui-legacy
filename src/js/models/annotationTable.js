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
      <Td>
        <a href={`/legacy-archive/annotations/${note.annotation_id}`}>
          [row.annotation_id}
        </a>
      </Td>,
  },
  {
    name: 'Case UUID',
    id: 'case_id',
    sortable: true,
    td: note => <Td>{note.case_id}</Td>,
  },
  {
    name: 'Program',
    id: 'project.program.name',
    sortable: true,
    hidden: true,
    td: note =>
      <Td>
        {note.project && note.project.program && note.project.program.name}
      </Td>,
  },
  {
    name: 'Project',
    id: 'project.project_id',
    sortable: true,
    td: note =>
      <Td>
        {note.project && note.project.project_id}
      </Td>,
  },
  {
    name: 'Entity Type',
    id: 'entity_type',
    sortable: true,
    td: note => <Td>{note.entity_type}</Td>,
  },
  {
    name: 'Entity ID',
    id: 'entity_id',
    sortable: true,
    td: note => <Td>{note.entity_id}</Td>,
  },
  {
    name: 'Entity Barcode',
    id: 'entity_submitter_id',
    sortable: true,
    hidden: true,
    td: note => <Td>{note.entity_submitter_id}</Td>,
  },
  {
    name: 'Category',
    id: 'category',
    sortable: true,
    td: note => <Td>{note.category}</Td>,
  },
  {
    name: 'Classification',
    id: 'classification',
    sortable: true,
    td: note => <Td>{note.classification}</Td>,
  },
  {
    name: 'Created Date',
    id: 'created_datetime',
    td: note =>
      <Td>
        {note.created_datetime && note.created_datetime}
      </Td>,
  },
  {
    name: 'Status',
    id: 'status',
    td: note => <Td>{note.status}</Td>,
    sortable: true,
    hidden: true,
  },
  {
    name: 'Notes',
    id: 'notes',
    td: note => <Td>{note.notes}</Td>,
    sortable: false,
    hidden: true,
  },
]

/*----------------------------------------------------------------------------*/

export default annotationTable
