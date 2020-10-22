import React, { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import {
  vamps as vampireAddress,
  vials as vialAddress,
 } from '../../constants/tokenAddresses'
import { getBalance, getEthBalance} from '../../utils'

import Context from './Context'

const Provider: React.FC = ({ children }) => {
  const [vampireBalance, setVampireBalance] = useState<BigNumber>()
  const [vialBalance, setVialBalance] = useState<BigNumber>()
  const [ethBalance,setEthBalance] = useState<BigNumber>()	
	
  const { account, ethereum }: { account: string | null, ethereum: provider } = useWallet()
 
  const fetchBalances = useCallback(async (userAddress: string, provider: provider) => {
	  
    const balances = await Promise.all([
      await getBalance(provider, vampireAddress, userAddress), // user Vampires  					//0
      await getBalance(provider, vialAddress, userAddress),   // user Vials							//1
      await getEthBalance(provider,userAddress),				// user Eth							//2 
	])
	
    setVampireBalance(new BigNumber(balances[0]).dividedBy(new BigNumber(10).pow(18)))
    setVialBalance(new BigNumber(balances[1]).dividedBy(new BigNumber(10).pow(18)))
    setEthBalance(new BigNumber(balances[2]).dividedBy(new BigNumber(10).pow(18)))
	
	
  }, [
    setVampireBalance,
    setVialBalance,
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
	  ethBalance, 
    }}>
      {children}
    </Context.Provider>
  )
}

export default Provider
