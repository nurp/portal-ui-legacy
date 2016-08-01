// Vendor
import React from 'react'
import { Link } from 'react-router'
import ShoppingCartIcon from 'react-icons/lib/fa/shopping-cart'
import LockedIcon from 'react-icons/lib/fa/lock'
import UnlockedIcon from 'react-icons/lib/fa/unlock-alt'

// Custom
import Button from 'uikit/Button'
import { Th, Td } from 'uikit/Table'
import { formatFileSize } from 'utils'
import AddToCartButtonSingle from 'components/AddToCartButtonSingle'

/*----------------------------------------------------------------------------*/

function getAnnotations(file) {
  return file.annotations.length === 1
    ? <a href={`annotations/${file.annotations[0].annotation_id}`}>1</a>
    : <a>more annotations withfilter </a>
}

const fileTable = [
  {
    name: 'Add to Cart',
    id: 'file_actions',
    th:
      <Th key="file_actions">
        <Button style={{ padding: '3px 4px', margin: '0 auto' }}>
          <ShoppingCartIcon />
        </Button>
      </Th>,
    td: file =>
      <Td key="file_actions">
        <AddToCartButtonSingle file={file} />
      </Td>,
  },
  {
    name: 'File UUID',
    id: 'file_id',
    td: file =>
      <Td key="file_id">
        <Link to={{ pathname: `/files/${file.file_id}` }}>
          {file.file_id}
        </Link>
      </Td>,
    sortable: true,
    hidden: true,
  },
  {
    name: 'File Submitter ID',
    id: 'submitter_id',
    td: file => <Td key="submitter_id">{file.submitter_id || '--'}</Td>,
    sortable: true,
    hidden: true,
  },
  {
    name: 'Access',
    id: 'access',
    td: file =>
      <Td key="access">
        {file.access === 'open' ? <UnlockedIcon /> : <LockedIcon />}
        {file.access}
      </Td>,
    sortable: true,
  },
  {
    name: 'File Name',
    id: 'file_name',
    td: file => <Td key="file_name"><a href={`files/${file.file_id}`}>{file.file_name}</a></Td>,
    sortable: true,
  },
  {
    name: 'Cases',
    id: 'cases.case_id',
    td: file => <Td key="cases.case_id">{file.cases.length}</Td>,
  },
  {
    name: 'Project',
    id: 'cases.project.project_id',
    td: file =>
      <Td key="cases.project.project_id">
        {[...new Set(file.cases.map(c => c.project.project_id))]}
      </Td>,
    sortable: true,
  },
  {
    name: 'Data Category',
    id: 'data_category',
    td: file => <Td key="data_category">{file.data_category || '--'}</Td>,
    sortable: true,
  },
  {
    name: 'Data Format',
    id: 'data_format',
    td: file => <Td key="data_format">{file.data_format || '--'}</Td>,
    sortable: true,
  },
  {
    name: 'Size',
    id: 'file_size',
    td: file => <Td key="file_size">{formatFileSize(file.file_size) || '--'}</Td>,
    sortable: true,
  },
  {
    name: 'Annotations',
    id: 'annotations.annotation_id',
    td: file => {
      if (file.annotations) {
        return file.annotations.length ? getAnnotations(file) : 0
      }
      return <Td key="annotations.annotation_id"><a>test</a></Td>
    },
  },
  {
    name: 'Data Type',
    id: 'data_type',
    td: file => <Td key="data_type">{file.data_type || '--'}</Td>,
    sortable: false,
    hidden: true,
  },
  {
    name: 'Experimental Strategy',
    id: 'experimental_strategy',
    td: file => <Td key="experimental_strategy">{file.experimental_strategy || '--'}</Td>,
    sortable: false,
    hidden: true,
  },
  {
    name: 'Platform',
    id: 'platform',
    td: file => <Td key="platform">{file.platform || '--'}</Td>,
    sortable: false,
    hidden: true,
  },
]

/*----------------------------------------------------------------------------*/

export default fileTable
