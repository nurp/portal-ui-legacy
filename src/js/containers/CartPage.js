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
import Card from 'uikit/Card'
import CasesAggregations from 'containers/CasesAggregations'
import FilesAggregations from 'containers/FilesAggregations'
import FileTable from 'containers/FileTable'
import SummaryCard from 'components/SummaryCard'
import theme from 'theme'

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
            <Column>
              <Card style={{ padding: '1rem', width: '15rem' }}>
                <Row>
                  <Column>
                    <Row style={{ fontSize: '1rem' }}>FILES</Row>
                    <Row style={{ fontSize: '2rem' }}>{files.length}</Row>
                  </Column>
                  <Row style={{ marginLeft: 'auto', alignItems: 'center' }}>
                    <FileIcon style={{ width: '4rem', height: '4rem' }} />
                  </Row>
                </Row>
              </Card>
              <Card style={{ padding: '1rem', width: '15rem' }}>
                <Row>
                  <Column>
                    <Row style={{ fontSize: '1rem' }}>CASES</Row>
                    <Row style={{ fontSize: '2rem' }}>0</Row>
                  </Column>
                  <Row style={{ marginLeft: 'auto', alignItems: 'center' }}>
                    <CaseIcon style={{ width: '4rem', height: '4rem' }} />
                  </Row>
                </Row>
              </Card>
              <Card style={{ padding: '1rem', width: '15rem' }}>
                <Row>
                  <Column>
                    <Row style={{ fontSize: '1rem' }}>FILE SIZE</Row>
                    <Row style={{ fontSize: '2rem' }}>0</Row>
                  </Column>
                  <Row style={{ marginLeft: 'auto', alignItems: 'center' }}>
                    <FileSizeIcon style={{ width: '4rem', height: '4rem' }} />
                  </Row>
                </Row>
              </Card>
            </Column>
            <SummaryCard
              title="File Counts by Project"
              data={[1, 2, 3]}
              style={{ flex: 1 }}
            />
            <SummaryCard
              title="File Counts by Authorization Level"
              data={[1, 2, 3]}
              style={{ flex: 1 }}
            />
            <Card style={{ flex: 1 }}>
              <div style={styles.header}>How to download files in my Cart?</div>
              <p>
                <strong>Download Manifest:</strong>
                Downloading and analyzing large BAMs or large
                number of files can be very resource intensive and so it is recommended
                to use the GDC Data Transfer Tool for this purpose. The GDC Data
                Transfer Tool provides several different download modes to provide
                the most efficient transfer possible. For more info, click here.

                <strong>Download Cart:</strong>
                Download Files in your Cart directly from the Web Browser.
              </p>
            </Card>
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
            hits(first: $first, offset: $offset, filters: $filters, sort: $sort) @include(if: $getFiles) {
              ${FileTable.getFragment('hits')}
            }
          }
        }
      `,
    },
  }
)
