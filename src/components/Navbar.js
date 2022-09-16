import React, { Component } from 'react'
import { connect } from 'react-redux'
import Identicon from 'identicon.js';
import eth from '../images/eth.png'
import {
  accountSelector,
  balanceSelector,
  networkSelector,
  web3Selector
} from '../store/selectors'
import './Style.css';

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded-bottom border-bottom border-danger">
        <a
          className="navbar-brand bgDark3 rounded border border-danger"
          target="_blank"
          href="https://github.com/xternet/dapp_template_v2">
            Staking ETH
        </a>
          { this.props.account
          ? <div className="collapse navbar-collapse">
              <ul className="navbar-nav ml-auto">
                <div className="container">
                  <div className="row">
                    <div className="border border-danger rounded bgDark4" style={{ width: '125px' }}>
                      <li className="nav-item text-white nav-link small">
                        <b>{this.props.network}</b>
                      </li>
                    </div>
                    <div className="border border-danger rounded" style={{ width: '125px' }}>
                      <li className="nav-item text-white nav-link small bgDark5">
                        <b>{this.props.balance}</b>
                        <img src={eth} width='18' height='18' alt="eth" />
                      </li>
                    </div>
                    <div className="border border-danger rounded" style={{ width: '150px' }}>
                      <li className="nav-item text-white nav-link small bgDark6">
                        { this.props.network === 'Main' || this.props.network === 'Private' || this.props.network === 'Wrong network'
                        ? <b><a
                            className="text-white"
                            href={`https://etherscan.io/address/` + this.props.account}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                          {this.props.account.substring(0,6) + '...' + this.props.account.substring(38,42)}
                          </a></b>
                        : <b><a
                            className="text-white"
                            href={`https://${this.props.network}.etherscan.io/address/` + this.props.account}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                          {this.props.account.substring(0,6) + '...' + this.props.account.substring(38,42)}
                          </a></b>
                        }
                        <img
                          alt="id"
                          className="ml-2 id border border-danger"
                          width="20"
                          height="20"
                          src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                        />
                      </li>
                    </div>
                  </div>
                </div>
              </ul>
            </div>
          : <div className="collapse navbar-collapse">
              <ul className="navbar-nav ml-auto">
                { this.props.web3
                ? <button
                    className="btn btn-outline-success"
                    type="button"
                    onClick={async () => {
                      try {
                        await window.ethereum.enable()
                      } catch (e) {
                        console.log(e)
                      }
                    }}
                  >
                    Login
                  </button>
                : <button
                    className="btn btn-warning"
                    type="button"
                    onClick={() => {
                      try {
                        window.open("https://metamask.io/")
                      } catch (e) {
                        console.log(e)
                      }
                    }}
                  >
                    Get MetaMask
                  </button>
                }
              </ul>
            </div>
          }
      </nav>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: web3Selector(state),
    account: accountSelector(state),
    network: networkSelector(state),
    balance: balanceSelector(state)
  }
}

export default connect(mapStateToProps)(Navbar)