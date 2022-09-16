import { combineReducers } from 'redux';

function web3(state = {}, action) {
  switch (action.type) {
    case 'WEB3_LOADED':
      return { ...state, connection: action.connection }
    case 'WEB3_NETWORK_LOADED':
      return { ...state, network: action.network }
    case 'WEB3_ACCOUNT_LOADED':
      return { ...state, account: action.account }
    case 'WEB3_BALANCE_LOADED':
      return { ...state, balance: action.balance }
    default:
      return state
  }
}

function contract(state = {}, action) {
  switch (action.type) {
    case 'CONTRACT_LOADED':
      return { ...state, loaded: true, contract: action.contract }
    case 'CONTRACT_BALANCE':
      return { ...state, balance: action.balance}
    case 'STAKE_AMOUNT':
      return { ...state, amount: action.amount}
    default:
      return state
  }
}

function modal(state = {}, action) {
  switch(action.type) {
    case 'MODAL_OPENED':
      return { ...state, modal: true }
    case 'MODAL1_OPENED':
      return { ...state, modal1: true }
    default:
      return {
        ...state,
        modal: false,
        modal1: false
       }
  }
}

const rootReducer = combineReducers({
  web3,
  contract,
  modal
})

export default rootReducer