// Vendor
import React, { PropTypes } from 'react'
import DownloadIcon from 'react-icons/lib/fa/download'
import DownCaretIcon from 'react-icons/lib/fa/caret-down'

// Custom
import withDropdown from 'uikit/withDropdown'
import Button from 'uikit/Button'
import { Column, Row } from 'uikit/Flex'
import { dropdown } from 'theme/mixins'
import theme from 'theme'

/*----------------------------------------------------------------------------*/

const styles = {
  row: {
    color: theme.greyScale2,
    padding: '0.6rem 1rem',
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
  },
  iconSpacing: {
    marginRight: '0.6rem',
  },
}

const CartDownloadButton = ({
  active,
  setActive,
  mouseDownHandler,
  mouseUpHandler,
  style,
}) => (
  <Button
    style={style}
    leftIcon={<DownloadIcon />}
    rightIcon={<DownCaretIcon />}
    onClick={() => setActive(true)}
  >
    Download

    {active &&
      <Column
        style={{ ...dropdown, width: '22rem' }}
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
      >
        <Row style={styles.row}>
          <DownloadIcon style={styles.iconSpacing} /> Manifest
        </Row>
        <Row style={{ ...styles.row, borderBottom: `1px solid ${theme.greyScale5}` }}>
          <DownloadIcon style={styles.iconSpacing} /> Cart
        </Row>
        <Row style={styles.row}>
          <DownloadIcon style={styles.iconSpacing} /> Clinical
        </Row>
        <Row style={styles.row}>
          <DownloadIcon style={styles.iconSpacing} /> Biospecimen
        </Row>
        <Row style={styles.row}>
          <DownloadIcon style={styles.iconSpacing} /> SRA XML, MAGE TAB
        </Row>
        <Row style={styles.row}>
          <DownloadIcon style={styles.iconSpacing} /> File Metadata
        </Row>
      </Column>

    }
  </Button>
)

CartDownloadButton.propTypes = {
  active: PropTypes.bool,
  setActive: PropTypes.func,
  mouseDownHandler: PropTypes.func,
  mouseUpHandler: PropTypes.func,
  style: PropTypes.object,
}

/*----------------------------------------------------------------------------*/

export default withDropdown(CartDownloadButton)
