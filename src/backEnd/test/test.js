import expectEvent from '@openzeppelin/test-helpers/src/expectEvent';
import { web3 } from '@openzeppelin/test-helpers/src/setup';
import { expect } from 'chai';
import { tokens, ether, ETHER_ADDRESS } from './helpers'

const EthStakingPool = artifacts.require('./EthStakingPool')
const { time, expectRevert } = require('@openzeppelin/test-helpers');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Contract', ([deployer, user1, user2]) => {
  let contract
  const endSale = 1611705600

  beforeEach(async () => {
    contract = await EthStakingPool.new()
  })

  describe('Before deadline', () => {
    let result

    beforeEach(async () => {
      result = await contract.sendTransaction({to: contract.address, value: ether(.1), from: user1})
    })

    describe('Success', () => {
      it('does contract accept payments?/contract balance increased', async () => {
        expect(Number(await web3.eth.getBalance((contract.address)))).to.eq(Number(ether(.1)))
      })

      it('does depositer contract balance increase after deposit?', async () => {
        expect(Number(await contract.balances(user1))).to.eq(Number(ether(.1)))
      })

      it('is deadline setup correctly?', async () => {
        expect(Number(await contract.deadline())).to.eq(endSale)
      })
      
      it('is deployer the owner?', async () => {
        expect(await contract.owner()).to.eq(deployer)
      })

      it('check log values', async () => {
        expect(result.logs[0].event).to.eq('EthReceived')

        expectEvent.inLogs(result.logs, 'EthReceived', {
          account: user1,
          amount: ether(.1)
        })
      })
    })

    describe('Failure', () => {
      it('Not allow to call deposit by owner', async () => {
        expectRevert(contract.deposit("0x1", "0x2", "0x2", "0x4"), "must be finalized")
      })

      it('Not allow to finalize', async () => {
        expectRevert(contract.finalize(), "must be after deadline")
      })
      
      it('Not allow to claim', async () => {
        expectRevert(contract.claim(), "must be finalized")
      })
    })
  })

  describe('After deadline', () => {
    let result, user1Amount, user2Amount, wholeDepositAmount, amountToClaim

    it('Testing Success&Failure for Finalizing&Claiming', async () => {
      //Declare
      user1Amount = Number(ether(31))
      user2Amount = Number(ether(2))
      wholeDepositAmount = user1Amount+user2Amount
      amountToClaim = wholeDepositAmount-Number(ether(32))

      console.log('\namountToClaim = ', amountToClaim)

      //Check time before
      const timeBefore = await time.latest()
      console.log("timeBefore: ", Number(timeBefore))

      //Send 31 ETH from User1
      console.log('User1 depositing ETH...')
      await contract.sendTransaction({to: contract.address, value: ether(31), from: user1})

      //Check if user1 contract balance increased
      expect(Number(await contract.balances(user1))).to.eq(Number(ether(31)))

      //Send 2 ETH from User2
      console.log('User2 depositing ETH...')
      await contract.sendTransaction({to: contract.address, value: ether(2), from: user2})

      //Check if user2 contract balance increased
      expect(Number(await contract.balances(user2))).to.eq(Number(ether(2)))

      //Increase Time
      console.log('\nMonth after...')
      await time.increaseTo(endSale+10)
      const timeAfter = await time.latest()

      //Don't allow to deposit ETH
      console.log('Preveting deposit ETH...')
      expectRevert(contract.sendTransaction({to: contract.address, value: ether(2), from: user2}), "must be before deadline")

      //Finalize
      console.log('Finalizing...')
      result = await contract.finalize()

      //Check log values
      console.log('Checking finalizing log values...')
      expect(result.logs[0].event).to.eq("Finalize")
      expectEvent.inLogs(result.logs, "Finalize", {
        account: deployer,
        timestamp: timeAfter
      })

      //Test Finalize
      console.log('Checking if finalized is true...')
      expect(await contract.finalized()).to.eq(true)

      //Don't allow to claim by deployer (since didn't deposit)
      console.log('Preveting to claim for unauthorized actors...')
      expectRevert(contract.claim(), "balance must be greater than 0")

      //Test Claim for user1 who deposited 31 of 33 ETH
      console.log('User1 claiming ETH...')
      result = await contract.claim({from: user1})
      const user1AmountToClaim = BigInt(BigInt(amountToClaim)*BigInt(user1Amount))/BigInt(wholeDepositAmount)

      //Check log values
      console.log('Checking User1 claiming ETH log values...')
      expect(result.logs[0].event).to.eq("Claim")
      expectEvent.inLogs(result.logs, "Claim", {
        account: user1,
        amount: user1AmountToClaim.toString()
      })

      //Test Claim for user2 who deposited 2 of 33 ETH
      console.log('User2 claiming ETH...')
      result = await contract.claim({from: user2})
      const user2AmountToClaim = BigInt(BigInt(amountToClaim)*BigInt(user2Amount))/BigInt(wholeDepositAmount)

      //Check log values
      console.log('Checking User2 claiming ETH log values...\n')
      expect(result.logs[0].event).to.eq("Claim")
      expectEvent.inLogs(result.logs, "Claim", {
        account: user2,
        amount: user2AmountToClaim.toString()
      })
    })
  })
})