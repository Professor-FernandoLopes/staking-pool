import { createSelector } from 'reselect'
import { get } from 'lodash'

const web3 = state => get(state, 'web3.connection')
export const web3Selector = createSelector(web3, w => w)

const network = state => get(state, 'web3.network')
export const networkSelector = createSelector(network, n => n)

const account = state => get(state, 'web3.account')
export const accountSelector = createSelector(account, a => a)

const balance = state => get(state, 'web3.balance', 0)
export const balanceSelector = createSelector(balance, e => e)

const contract = state => get(state, 'contract.contract')
export const contractSelector = createSelector(contract, c => c)

const modal = state => get(state, 'modal.modal', true)
export const modalSelector = createSelector(modal, status => status)

const modal1 = state => get(state, 'modal.modal1', true)
export const modal1Selector = createSelector(modal1, status => status)

const stakeAmount = state => get(state, 'contract.amount')
export const stakeAmountSelector = createSelector(stakeAmount, a => a)

const contractBalance = state => get(state, 'contract.balance')
export const contractBalanceSelector = createSelector(contractBalance, b => b)