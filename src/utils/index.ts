import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import {provider} from 'web3-core'
import { AbiItem } from 'web3-utils'

import ERC20ABI from '../constants/abi/ERC20.json'


export const getBalance = async (provider: provider, tokenAddress: string, userAddress: string): Promise<string> => {
  const tokenContract = getERC20Contract(provider, tokenAddress)
  try {
    const balance: string = await tokenContract.methods.balanceOf(userAddress).call()
    return balance
  } catch (e) {
    return '0'
  }
}

export const getTotalSupply = async (provider: provider, tokenAddress: string): Promise<string> => {
  const tokenContract = getERC20Contract(provider, tokenAddress)
  try {
    const balance: string = await tokenContract.methods.totalSupply().call()
    return balance
  } catch (e) {
    return '0'
  }
}


export const getEthBalance = async (provider: provider, userAddress: string): Promise<string> => {
  const web3 = new Web3(provider)
  try {	  
    const balance: string = await web3.eth.getBalance(userAddress)
    return balance
  } catch (e) {
    return '0'
  }
}


export const getERC20Contract = (provider: provider, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ERC20ABI.abi as unknown as AbiItem, address)
  return contract
}

export const bnToDec = (bn: BigNumber, decimals = 18) => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber()
}

export const decToBn = (dec: number, decimals = 18) => {
  return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals))
}

//export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
//  return balance.dividedBy(new BigNumber(10).pow(decimals)).toFixed()
//}