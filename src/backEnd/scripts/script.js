const Contract = artifacts.require("Contract")

module.exports = async function(callback) {
  try {
    // Get Accounts
    const accounts = await web3.eth.getAccounts()
    // Assign accounts to variables
    const acc1 = accounts[0]
    const acc2 = accounts[1]

    // Fetch the deployed contract
    const contract = await Contract.deployed()
    console.log('Contract fetched', contract.address)
  }
  catch(error) {
    console.log(error)
  }

  callback()
}