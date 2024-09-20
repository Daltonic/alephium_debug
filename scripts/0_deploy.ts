import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from 'alephium.config'
import { AlphHack } from '../artifacts/ts'
import { testNodeWallet } from '@alephium/web3-test'
import { web3, CallContractParams } from '@alephium/web3'

const deployContract: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const issueTokenAmount = network.settings.issueTokenAmount
  const result = await deployer.deployContract(AlphHack, {
    issueTokenAmount,
    initialFields: {
      balance: BigInt(0)
    }
  })

  console.log('Contract id: ' + result.contractInstance.contractId)
  console.log('Contract address: ' + result.contractInstance.address)

  web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
  const signer = await testNodeWallet()
  const accounts = await signer.getAccounts()
  // const address = accounts[0]
  const account = accounts[0]

  //   const amount = BigInt(10) // ALPH tokens

  const params: CallContractParams<{ user: string }> = {
    args: { user: account.address }
  }

  const contract = result.contractInstance
  let getBalance = await contract.view.getUserBal(params)
  console.log(getBalance.returns)
  // console.log(contract)
}

export default deployContract
