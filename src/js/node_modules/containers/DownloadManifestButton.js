/* global __AUTH__ */

// Vendor
import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { compose, withState } from 'recompose'
import { withRouter } from 'react-router'
import DownloadIcon from 'react-icons/lib/fa/download'
import SpinnerIcon from 'react-icons/lib/fa/spinner'

// Custom
import download from 'utils/download'
import Button from 'uikit/Button'

const inProgress = () => {
  console.log('its in progress')
  // $scope.active = true;
  // $attrs.$set('disabled', 'disabled');
}

const done = () => {
  console.log('its done')
  // $scope.active = false;
  // $element.removeAttr('disabled');
}

const downloadManifest = ({ location, size }) => {
  const url = `${__AUTH__}/api/files`

  const { filters } = location.query
  const currentFilters = filters ? JSON.parse(filters).content : []

  const params = {
    size,
    filters: currentFilters,
    return_type: 'manifest',
    attachment: true,
    format: 'TSV',
    fields: ['file_id'],
  }

  const checkProgress = download({ params, url, method: 'POST' })
  checkProgress(inProgress, done)
}

/*----------------------------------------------------------------------------*/

const DownloadManifestButton = ({ location, hits, loading, toggleLoading }) => (
  <Button
    style={{ marginLeft: '0.3rem' }}
    leftIcon={loading ? <SpinnerIcon /> : <DownloadIcon />}
    onClick={
      () => {
        toggleLoading(() => true)
        downloadManifest({ location, size: hits.pagination.total })
      }
    }
  >
    Download Manifest
  </Button>
)

DownloadManifestButton.propTypes = {
  location: PropTypes.object,
  hits: PropTypes.object,
  loading: PropTypes.bool,
  toggleLoading: PropTypes.func,
}

const enhance = compose(
  withRouter,
  withState('loading', 'toggleLoading', false)
)

export default Relay.createContainer(
  enhance(DownloadManifestButton), {
    fragments: {
      hits: () => Relay.QL`
        fragment on FileConnection {
          pagination {
            total
          }
        }
      `,
    },
  }
)
