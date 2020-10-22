import React, { useCallback} from 'react'

import { useWallet } from 'use-wallet'

import useVampire from '../../hooks/useVampire'

//import {
//  stake,
//} from 'yam-sdk/utils'

import Context from './Context'

const Provider: React.FC = ({ children }) => {
  
  const vampire = useVampire()
  const { account } = useWallet()
  
  const handleEtherRitual = useCallback(async (amount: string) => {
    if (!vampire) return
	const value = await vampire.web3.utils.toWei(amount,'ether')	
    await vampire.contracts.vampire.methods.etherRitual().send({ from: account, gas: 400000 , value: value})
  }, [
    account,
    vampire
  ])
  
  const handleSilverBullet = useCallback(async (amount: string) => {
    if (!vampire) return
	const value = await vampire.web3.utils.toWei(amount,'ether') // we recylce the conversion since we have same number of digits	
    await vampire.contracts.vampire.methods.sliverBullet(value).send({ from: account, gas: 400000})
  }, [
    account,
    vampire
  ])
  
  const handleBloodGarlic = useCallback(async (amount: string) => {
    if (!vampire) return
	const value = await vampire.web3.utils.toWei(amount,'ether') // we recylce the conversion since we have same number of digits	
    await vampire.contracts.vampire.methods.bloodGarlic(value).send({ from: account, gas: 400000})
  }, [
    account,
    vampire
  ])

//  useEffect(() => {
//    fetchBalances()
//    let refreshInterval = setInterval(() => fetchBalances(), 10000)
//    return () => clearInterval(refreshInterval)
//  }, [fetchBalances])

  
  return (
    <Context.Provider value={{
      onEtherRitual: handleEtherRitual,
	  onSilverBullet: handleSilverBullet,
	  onBloodGarlic: handleBloodGarlic,
	}}>
      {children}
     </Context.Provider>
  )
}

export default Provider