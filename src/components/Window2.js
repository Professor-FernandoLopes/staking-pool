import { Modal, Button } from "react-bootstrap";
import { deposit } from '../store/interactions'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  stakeAmountSelector,
  balanceSelector,
  modal1Selector,
  modalSelector,
  web3Selector
} from '../store/selectors'
import {
  modal1Opened,
  modal1Closed,
  stakeAmount
} from '../store/actions'

class Main extends Component {
  closeModal1 = () => {
    const { dispatch } = this.props
    dispatch(modal1Closed())
  }

  stakeAmount = (value) => {
    const {dispatch} = this.props
    dispatch(stakeAmount(value))
    dispatch(modal1Opened())
  }

  stake = async (amount) => {
    const { dispatch } = this.props

    await deposit(dispatch, amount)
  }

  render() {
  	return(
	    <Modal className="text-monospace" show={!this.props.isModalOpen && this.props.isModal1Open} onHide={this.closeModal1} centered>
	      <Modal.Header closeButton></Modal.Header>
	      <Modal.Body className="border text-center">
	        <div className="content text-center">
	          <h1><b>How much ETH would you like to stake?</b></h1>
	        <div className="d-flex p-5">
	          <input
	            style={{width: '400px'}}
	            type="number"
	            step="0.01"
	            className="form-control form-control-lg border border-success"
	            placeholder="..."
	            onChange={(e) => {this.stakeAmount(e.target.value)}}
	            required
	          />
	        </div>
						<div>Your balance is: <b>{this.props.balance} ETH</b></div>
	        <div className="d-inline-flex p-0">
	          <div className="container d-flex p-1" style={{width: '400px'}}>&nbsp;
	            <br></br>
	          </div>
	        </div>
	       </div>
	      </Modal.Body>
	      <Modal.Footer>
	        <Button variant="success" block onClick={(event) => {
	          event.preventDefault()
	          //start with digit, digit+dot* or single dot*, end with digit.
	          var reg = new RegExp("^[0-9]*.?[0-9]+$")

	          if(reg.test(this.props.amount)){
	            const amount = (this.props.amount).toString()
	            this.stake(this.props.web3.utils.toWei(amount))
	          } else {
	            window.alert('Please type positive interger or float number')
	          }
	        }}>
	        <b className="text-monospace"><h5>STAKE</h5></b>
	        </Button>
	      </Modal.Footer>
	    </Modal>
  	)
  }
}

function mapStateToProps(state) {
  return {
    web3: web3Selector(state),
    balance: balanceSelector(state),
    amount: stakeAmountSelector(state),
    isModalOpen: modalSelector(state),
    isModal1Open: modal1Selector(state),
  }
}

export default connect(mapStateToProps)(Main)