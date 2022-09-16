import { modalClosed, modal1Opened } from '../store/actions'
import { modalSelector } from '../store/selectors'
import { Modal, Button } from "react-bootstrap";
import React, { Component } from 'react'
import { connect } from 'react-redux'

class Main extends Component {
  closeModal = () => {
    const { dispatch } = this.props
    dispatch(modalClosed())
  }

  openModal1 = () => {
    const { dispatch } = this.props
    dispatch(modalClosed())
    dispatch(modal1Opened())
  }

  render() {
    return(
      <Modal backdrop="static" show={this.props.isModalOpen} onHide={this.closeModal} centered >
        <Modal.Header closeButton> </Modal.Header>
          <h1 className="text-center text-monospace"><b>Risk Warning</b></h1>
        <Modal.Body className="modal-dialog modal-dialog-centered" size="lg" role="dialog">
          <h5 className="text-center text-monospace">
            Although you can earn rewards for doing work that benefits the network, you can lose ETH for malicious actions, going offline, and failing to validate.
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <Button className="text-monospace" variant="warning" block onClick={this.openModal1}>
            <h5>I understand</h5>
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    isModalOpen: modalSelector(state),
  }
}

export default connect(mapStateToProps)(Main)