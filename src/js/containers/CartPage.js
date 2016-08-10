// Vendor
import React, { PropTypes } from 'react'
import { shouldUpdate, lifecycle, compose } from 'recompose'
import Relay from 'react-relay'
import { connect } from 'react-redux'
import FileIcon from 'react-icons/lib/fa/file-o'
import CaseIcon from 'react-icons/lib/fa/user'
import FileSizeIcon from 'react-icons/lib/fa/floppy-o'

// Custom
import { formatFileSize } from 'utils'
import { Row, Column } from 'uikit/Flex'
import theme from 'theme'
import FileTable from 'containers/FileTable'
import SummaryCard from 'components/SummaryCard'
import HowToDownload from 'components/HowToDownload'
import CountCard from 'components/CountCard'
import CartDownloadButton from 'components/CartDownloadButton'
import RemoveFromCartButton from 'components/RemoveFromCartButton'
import { toggleLoading } from 'dux/relayLoading'

/*----------------------------------------------------------------------------*/

const styles = {
  container: {
    padding: '2rem 2.5rem 13rem',
  },
  header: {
    padding: '1rem',
    borderBottom: `1px solid ${theme.greyScale4}`,
    color: theme.primary,
  },
}

const CartPage = ({ viewer, files }) => {
  console.log('...', viewer)
  return (
    <Column style={styles.container}>
      {!files.length && <h1>Your cart is empty.</h1>}
      {!!files.length && !!viewer.files.hits &&
        <Column>
          <Row spacing="2rem" style={{ marginBottom: '2rem' }}>
            <Column spacing="0.8rem">
              <CountCard
                title="FILES"
                count={files.length}
                icon={<FileIcon style={{ width: '4rem', height: '4rem' }} />}
              />
              <CountCard
                title="CASES"
                count={0}
                icon={<CaseIcon style={{ width: '4rem', height: '4rem' }} />}
              />
              <CountCard
                title="FILE SIZE"
                count={formatFileSize(viewer.summary.aggregations.fs.value)}
                icon={<FileSizeIcon style={{ width: '4rem', height: '4rem' }} />}
              />
            </Column>
            <SummaryCard
              title="File Counts by Project"
              data={viewer.summary.aggregations.project__project_id.buckets}
              style={{ flex: 1 }}
              footer={`${viewer.summary.aggregations.project__project_id.buckets.length} Projects`}
            />
            <SummaryCard
              title="File Counts by Authorization Level"
              data={[1, 2]}
              style={{ flex: 1 }}
            />
            <HowToDownload style={{ flex: 1 }} />
          </Row>
          <Row style={{ marginBottom: '2rem' }}>
            <Row style={{ marginLeft: 'auto' }} spacing="1rem">
              <CartDownloadButton />
              <RemoveFromCartButton />
            </Row>
          </Row>
          <FileTable hits={viewer.files.hits} />
        </Column>
      }
    </Column>
  )
}

CartPage.propTypes = {
  viewer: PropTypes.object,
  files: PropTypes.array,
}

const getCartFilterVariables = files => ({
  content: [{
    content: {
      field: 'files.file_id',
      value: files.map(x => x.file_id),
    },
    op: 'in',
  }],
  op: 'and',
})

const enhance = compose(
  lifecycle({
    componentDidMount() {
      const { files, relay } = this.props
      if (files.length) {
        relay.setVariables({ filters: getCartFilterVariables(files) })
      }
    },
    componentWillReceiveProps(nextProps) {
      const { files, relay } = this.props
      if (files.length !== nextProps.files.length && nextProps.files.length) {
        relay.setVariables({ filters: getCartFilterVariables(nextProps.files) })
      }
    },
  })
)

export { CartPage }

export default Relay.createContainer(
  connect(state => state.cart)(enhance(CartPage)), {
    initialVariables: {
      first: 20,
      offset: 0,
      filters: getCartFilterVariables([{ file_id: 'DUMMY_ID' }]),
      sort: '',
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Root {
          summary {
            aggregations(filters: $filters) {
              project__project_id {
                buckets {
                  case_count
                  doc_count
                  file_size
                  key
                }
              }
              fs { value }
            }
          }
          files {
            hits(first: $first, offset: $offset, filters: $filters, sort: $sort) {
              ${FileTable.getFragment('hits')}
            }
          }
        }
      `,
    },
  }
)
