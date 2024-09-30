import React from "react"
import { Modal , Button} from "react-bootstrap"
// import parse from 'html-react-parser';
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from "utilities/constants"

function ConfirmModal(props) {
    const { title, content , show, onAction} = props
    return (
        <Modal 
            show={ show } 
            onHide={() => onAction(MODAL_ACTION_CLOSE)}
            backdrop="static"// animation -> create waiting findDOMNode id deprecated in StrictMode
            keyboard={false}
            animation={false}
        >
            <Modal.Header closeButton>
                <Modal.Title className="h5">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{content}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onAction(MODAL_ACTION_CLOSE)}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => onAction(MODAL_ACTION_CONFIRM)}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    )
  }
  
export default ConfirmModal 