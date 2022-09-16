import { update } from '../store/interactions'
import React, { Component } from 'react';
import { connect } from 'react-redux'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {
  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    /* User connect for 1st time */
    if(typeof window.ethereum !== 'undefined'){
      await update(dispatch)
      /* User switch account */
      window.ethereum.on('accountsChanged', async () => {
        await update(dispatch)
      });
      /* User switch network */
      window.ethereum.on('chainChanged', async () => {
        await update(dispatch)
      });
    }
  }

  render() {
    return (
      <div className="text-monospace text-center">
        <Navbar />
        <Main />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(App)