// Vendor
import React from 'react';
import ShoppingCartIcon from 'react-icons/lib/fa/shopping-cart';
// import _ from 'lodash';

// Custom
import Button from 'uikit/Button';
import { Th } from 'uikit/Table';

/*----------------------------------------------------------------------------*/

function getAnnotations(file) {
  return file.annotations.length === 1
    ? <a href={`annotations/${file.annotations[0].annotation_id}`}>1</a>
    : <a>more annotations withfilter </a>;
}

const fileTable = [
  {
    id: 'file_actions',
    th:
      <Th>
        <Button style={{ padding: '3px 5px', margin: '0 auto' }}>
          <ShoppingCartIcon />
        </Button>
      </Th>,
    td: () => <div>add-to-cart-single-icon</div>,
  },
  {
    name: 'File UUID',
    id: 'file_id',
    td: file => <a href={`files/${file.file_id}`}>{file.file_id}</a>,
    sortable: true,
    hidden: true,
  },
  {
    name: 'File Submitter ID',
    id: 'submitter_id',
    td: file => file.submitter_id || '--',
    sortable: true,
    hidden: true,
  },
  {
    name: 'Access',
    id: 'access',
    td: file => file.access,
    sortable: true,
  },
  {
    name: 'File Name',
    id: 'file_name',
    td: file => <a href={`files/${file.file_id}`}>{file.file_name}</a>,
    sortable: true,
  },
  {
    name: 'Cases',
    id: 'cases.case_id',
    td: file => file.cases.length,
  },
  // {
  //   name: 'Project',
  //   id: 'cases.project.project_id',
  //   // TODO: use Set, [].map
  //   td: row => _.unique(_.map(row.cases, p => p.project.project_id)).join('<br>') || '--',
  //   sortable: true,
  // },
  {
    name: 'Data Category',
    id: 'data_category',
    td: file => file.data_category || '--',
    sortable: true,
  },
  {
    name: 'Data Format',
    id: 'data_format',
    td: file => file.data_format || '--',
    sortable: true,
  },
  {
    name: 'Size',
    id: 'file_size',
    td: file => file.file_size,
    sortable: true,
  },
  {
    name: 'Annotations',
    id: 'annotations.annotation_id',
    td: file => {
      if (file.annotations) {
        return file.annotations.length ? getAnnotations(file) : 0;
      }
      return <a>test</a>;
    },
  },
  {
    name: 'Data Type',
    id: 'data_type',
    td: file => file.data_type,
    sortable: false,
    hidden: true,
  },
  {
    name: 'Experimental Strategy',
    id: 'experimental_strategy',
    td: file => file.experimental_strategy,
    sortable: false,
    hidden: true,
  },
  {
    name: 'Platform',
    id: 'platform',
    td: file => file.platform || '--',
    sortable: false,
    hidden: true,
  },
];

/*----------------------------------------------------------------------------*/

export default fileTable;
