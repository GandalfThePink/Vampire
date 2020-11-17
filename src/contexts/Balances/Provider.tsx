import React, { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import {
  vamps as vampireAddress,
  vials as vialAddress,
  vialUniLp as vialUniLpAddress,
  vampUniLp as vampUniLpAddress,
  	
 } from '../../constants/tokenAddresses'
import { getBalance, getEthBalance} from '../../utils'

import Context from './Context'

const Provider: React.FC = ({ children }) => {
  const [vampireBalance, setVampireBalance] = useState<BigNumber>()
  const [vialBalance, setVialBalance] = useState<BigNumber>()
  const [vialUniLpBalance, setVialUniLpBalance] = useState<BigNumber>()
  const [vampUniLpBalance, setVampUniLpBalance] = useState<BigNumber>()
  const [ethBalance,setEthBalance] = useState<BigNumber>()	
	
  const { account, ethereum }: { account: string | null, ethereum: provider } = useWallet()
 
  const fetchBalances = useCallback(async (userAddress: string, provider: provider) => {
	  
    const balances = await Promise.all([
      await getBalance(provider, vampireAddress, userAddress), // user Vampires  					//0
      await getBalance(provider, vialAddress, userAddress),   // user Vials							//1
      await getBalance(provider, vialUniLpAddress, userAddress),   // user Vials					//2
      await getBalance(provider, vampUniLpAddress, userAddress),   // user Vials					//3
	  await getEthBalance(provider,userAddress),				// user Eth							//4 
	])
	
    setVampireBalance(new BigNumber(balances[0]).dividedBy(new BigNumber(10).pow(18)))
    setVialBalance(new BigNumber(balances[1]).dividedBy(new BigNumber(10).pow(18)))
    setVialUniLpBalance(new BigNumber(balances[2]).dividedBy(new BigNumber(10).pow(18)))
    setVampUniLpBalance(new BigNumber(balances[3]).dividedBy(new BigNumber(10).pow(18)))
	setEthBalance(new BigNumber(balances[4]).dividedBy(new BigNumber(10).pow(18)))
	
	
  }, [
    setVampireBalance,
    setVialBalance,
    setVialUniLpBalance,
    setVampUniLpBalance,
	setEthBalance,
  ])

  useEffect(() => {
    if (account && ethereum ) {
      fetchBalances(account, ethereum)
	 }
  }, [
	account,
    ethereum,
    fetchBalances,
  ])

  useEffect(() => {
    if (account && ethereum) {
      fetchBalances(account, ethereum)
	  let refreshInterval = setInterval(() => fetchBalances(account, ethereum), 10000)
      return () => clearInterval(refreshInterval)
    }
  }, [
	account,
    ethereum,
    fetchBalances,
  ])

  return (
    <Context.Provider value={{
      vampireBalance,
      vialBalance,
      vialUniLpBalance,
      vampUniLpBalance,
	  ethBalance, 
    }}>
      {children}
    </Context.Provider>
  )
}

export default Provider
