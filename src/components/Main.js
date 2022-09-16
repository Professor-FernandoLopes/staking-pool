import DateCountdown from 'react-date-countdown-timer';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Modal, Button } from "react-bootstrap";
import { modalOpened } from '../store/actions'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Window1 from './Window1'
import Window2 from './Window2'
import {
  web3Selector,
  accountSelector,
  contractBalanceSelector
} from '../store/selectors'

class Main extends Component {

  openModal = () => {
    const { dispatch } = this.props
    dispatch(modalOpened())
  }

  packsAmount(){
    return Math.floor(Number(Number(this.props.contractBalance/(32*10**18))))
  }

  ethToPack(){
    return parseFloat(Number(this.props.web3.utils.fromWei(((32*10**18)-(Number(this.props.contractBalance)%(32*10**18))).toString())).toFixed(5))
  }

  render() {
    if (typeof this.props.contractBalance !== 'undefined'){
      return (
        <div className="Main">
          <div className="container-fluid mt-5">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">
                  <h1>Earn <b className="text-danger">~4-22 APY</b> by staking ETH</h1>
                  <br></br>
                  <h3>Staking Closes at:</h3>
                  <h3><DateCountdown dateTo='January 27, 2021 00:00:00 GMT+01:00' callback={()=>alert('Time for staking is over!')} /></h3>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  { this.packsAmount() === 0 || this.packsAmount() === 1
                    ? <h3>Currently we are Holding <b>{this.packsAmount()}</b> pack of 32 ETH</h3>
                    : <h3>Currently we are Holding <b>{this.packsAmount()}</b> packs of 32 ETH</h3>
                  }
                  <br></br>
                  <div className="text-center">Contract balance: <b>~{parseFloat(Number(this.props.web3.utils.fromWei((this.props.contractBalance).toString())).toFixed(5))} ETH</b></div>
                  { this.packsAmount() === 0
                    /* global BigInt */
                    ? <h6 className='text-center'>To get <b>1st</b> pack we need at least: <b>~{this.ethToPack()} ETH</b></h6>
                    : this.packsAmount() === 1
                      ? <h6 className='text-center'>To get <b>2nd</b> pack we need at least: <b>~{this.ethToPack()} ETH</b></h6>
                      : this.packsAmount() === 2
                        ? <h6 className='text-center'>To get <b>3rd</b> pack we need at least: <b>~{this.ethToPack()} ETH</b></h6>
                        : <h6 className='text-center'>To get <b>{(1+Number(this.packsAmount()))}th</b> pack we need at least: <b>~{this.ethToPack()} ETH</b></h6>
                  }
                  <ProgressBar variant="success" animated now={((((this.props.contractBalance)/10**18)%32)/32)*100} />
                  <br></br>
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ height: "25vh" }}
                  >
                  { this.props.account
                    ? <Button variant="success" size="lg" onClick={this.openModal}><h1>STAKE N0W!</h1></Button>
                    : <Button variant="success" size="lg" data-toggle="tooltip" data-placement="top" title="In order to Enable login with MetaMask" disabled>STAKE N0W!</Button>
                  }
                  </div>
                  <div>
                    <Window1 />
                    <Window2 />
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      )
    } else {
      return(
        <div>LOADING...</div>
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    web3: web3Selector(state),
    account: accountSelector(state),
    contractBalance: contractBalanceSelector(state)
  }
}

export default connect(mapStateToProps)(Main)