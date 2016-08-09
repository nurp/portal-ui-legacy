// Vendor
import React, { PropTypes } from 'react'
import { shouldUpdate, lifecycle, compose } from 'recompose'
import Relay from 'react-relay'
import { connect } from 'react-redux'
import FileIcon from 'react-icons/lib/fa/file-o'
import CaseIcon from 'react-icons/lib/fa/user'
import FileSizeIcon from 'react-icons/lib/fa/floppy-o'

// Custom
import { Row, Column } from 'uikit/Flex'
import theme from 'theme'
import CasesAggregations from 'containers/CasesAggregations'
import FilesAggregations from 'containers/FilesAggregations'
import FileTable from 'containers/FileTable'
import SummaryCard from 'components/SummaryCard'
import HowToDownload from 'components/HowToDownload'
import CountCard from 'components/CountCard'
import CartDownloadButton from 'components/CartDownloadButton'
import RemoveFromCartButton from 'components/RemoveFromCartButton'

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
  console.log('...', viewer, files)
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
                count={0}
                icon={<FileSizeIcon style={{ width: '4rem', height: '4rem' }} />}
              />
            </Column>
            <SummaryCard
              title="File Counts by Project"
              data={[1, 2, 3, 4, 5]}
              style={{ flex: 1 }}
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
  getFiles: true,
  filters: {
    content: [{
      content: {
        field: 'files.file_id',
        value: files.map(x => x.file_id),
      },
      op: 'in',
    }],
    op: 'and',
  },
})

const enhance = compose(
  lifecycle({
    componentDidMount() {
      if (this.props.files.length) {
        this.props.relay.setVariables(getCartFilterVariables(this.props.files))
      }
    },
  }),
  shouldUpdate((props, nextProps) => {
    if (props.files.length !== nextProps.files.length && nextProps.files.length) {
      props.relay.setVariables(getCartFilterVariables(nextProps.files))
    }

    return true
  })
)

export { CartPage }

export default Relay.createContainer(
  connect(state => state.cart)(enhance(CartPage)), {
    initialVariables: {
      first: 20,
      offset: 0,
      filters: {},
      getFiles: false,
      sort: '',
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Root {
          cases {
            aggregations(filters: $filters) {
              ${CasesAggregations.getFragment('aggregations')}
            }
          }
          files {
            aggregations(filters: $filters) {
              ${FilesAggregations.getFragment('aggregations')}
            }
            hits(first: $first, offset: $offset, filters: $filters, sort: $sort)
            @include(if: $getFiles) {
              ${FileTable.getFragment('hits')}
            }
          }
        }
      `,
    },
  }
)
