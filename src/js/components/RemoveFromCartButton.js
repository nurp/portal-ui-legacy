// Vendor
import React, { PropTypes } from 'react'
import XIcon from 'react-icons/lib/fa/close'
import DownCaretIcon from 'react-icons/lib/fa/caret-down'
import TrashIcon from 'react-icons/lib/fa/trash-o'

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

const RemoveFromCartButton = ({
  active,
  setActive,
  mouseDownHandler,
  mouseUpHandler,
  style,
}) => (
  <Button
    style={style}
    leftIcon={<TrashIcon />}
    rightIcon={<DownCaretIcon />}
    onClick={() => setActive(true)}
  >
    Remove From Cart

    {active &&
      <Column
        style={{ ...dropdown, width: '22rem' }}
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
      >
        <Row style={styles.row}>
          <XIcon style={styles.iconSpacing} /> All Files
        </Row>
        <Row style={styles.row}>
          <XIcon style={styles.iconSpacing} /> Unauthorized Files
        </Row>
      </Column>

    }
  </Button>
)

RemoveFromCartButton.propTypes = {
  active: PropTypes.bool,
  setActive: PropTypes.func,
  mouseDownHandler: PropTypes.func,
  mouseUpHandler: PropTypes.func,
  style: PropTypes.object,
}

/*----------------------------------------------------------------------------*/

export default withDropdown(RemoveFromCartButton)
