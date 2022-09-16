export function web3Loaded(connection) {
  return {
    type: 'WEB3_LOADED',
    connection
  }
}

export function web3NetworkLoaded(network) {
  return {
    type: 'WEB3_NETWORK_LOADED',
    network
  }
}

export function web3AccountLoaded(account) {
  return {
    type: 'WEB3_ACCOUNT_LOADED',
    account
  }
}

export function web3BalanceLoaded(balance) {
  return {
    type: 'WEB3_BALANCE_LOADED',
    balance
  }
}

export function contractLoaded(contract) {
  return {
    type: 'CONTRACT_LOADED',
    contract
  }
}

export function modalOpened() {
  return {
    type: 'MODAL_OPENED'
  }
}

export function modalClosed() {
  return {
    type: 'MODAL_CLOSED'
  }
}

export function modal1Opened() {
  return {
    type: 'MODAL1_OPENED'
  }
}

export function modal1Closed() {
  return {
    type: 'MODAL1_CLOSED'
  }
}

export function stakeAmount(amount) {
  return {
    type: 'STAKE_AMOUNT',
    amount
  }
}

export function contractBalance(balance) {
  return {
    type: 'CONTRACT_BALANCE',
    balance
  }
}