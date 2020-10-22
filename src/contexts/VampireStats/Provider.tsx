import React, { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import {
  vamps as vampireAddress,
  vials as vialAddress,
  dai as daiAddress,
  weth as wethAddress,
  vialFactory as vialFactoryAddress,
  vampFactory as vampireFactoryAddress,
  daiFactory as daiFactoryAddress,	
} from '../../constants/tokenAddresses'
import { getBalance, getEthBalance, getTotalSupply} from '../../utils'

import Context from './Context'
import useVampire from '../../hooks/useVampire'

const Provider: React.FC = ({ children }) => {
	
  const [priceVial, setPriceVial] = useState<BigNumber>()
  const [priceVampire, setPriceVampire] = useState<BigNumber>()
  const [priceVampireEst, setPriceVampireEst] = useState<BigNumber>()
  const [treasury,setTreasury] = useState<BigNumber>()	
  const [treasuryDai, setTreasuryDai] = useState<BigNumber>()
  const [totalVampires, setTotalVampires] = useState<BigNumber>()
  const [totalVials, setTotalVials] = useState<BigNumber>()
  const [darkEnergy,setDarkEnergy] = useState<BigNumber>()	
	
  const { account, ethereum }: { account: string | null, ethereum: provider } = useWallet()
  const vampire = useVampire()
	
  
  const fetchBalances = useCallback(async (userAddress: string, provider: provider) => {
	  
    const balances = await Promise.all([
      await getBalance(provider, daiAddress, daiFactoryAddress), // dai in daifactory  					//0
      await getBalance(provider, wethAddress, daiFactoryAddress),   // weth in daifactory				//1
      await getBalance(provider, vampireAddress, vampireFactoryAddress), // vamp in vampfactory  		//2
      await getBalance(provider, wethAddress, vampireFactoryAddress),   // weth in vampfactory			//3
      await getBalance(provider, vialAddress, vialFactoryAddress), // vial in vialfactory  				//4
      await getBalance(provider, wethAddress, vialFactoryAddress),   // weth in vialfactory				//5
      await getEthBalance(provider,vampireAddress),			  //  treasury								//6
      await getTotalSupply(provider,vampireAddress),		  //  Vampire Supply						//7
      await getTotalSupply(provider,vialAddress),			  //  Vial Supply							//8 
	])
	
	if (vampire){
		const bal = await vampire.contracts.vampire.methods.getDarkEnergy().call()
		setDarkEnergy(new BigNumber(bal))	
	}
	
	const peth = new BigNumber(balances[0]).dividedBy(new BigNumber(balances[1]))
	const pvamp = new BigNumber(balances[3]).dividedBy(new BigNumber(balances[2]))
	const pvial = new BigNumber(balances[5]).dividedBy(new BigNumber(balances[4]))
	
	setPriceVial( pvial.multipliedBy(peth))
	setPriceVampire( pvamp.multipliedBy(peth))
	
	const treasure = new BigNumber(balances[6]).dividedBy(new BigNumber(10).pow(18))
	const vampireSupply = new BigNumber(balances[7]).dividedBy(new BigNumber(10).pow(18))
	const vialSupply = new BigNumber(balances[8]).dividedBy(new BigNumber(10).pow(18))
	
	const vampValue = new BigNumber(treasure).multipliedBy(peth).minus(vialSupply) 
	
	setPriceVampireEst(vampValue.dividedBy(vampireSupply))     // treasury - liabilities / supply
    setTreasury(treasure)
    setTreasuryDai(treasure.multipliedBy(peth))
	setTotalVampires(vampireSupply)
    setTotalVials(vialSupply)
    
	
  }, [
	setPriceVampire,  
	setPriceVampireEst,  
	setPriceVial,
    setTreasury,
    setTreasuryDai,
    setTotalVampires,
    setTotalVials,
	setDarkEnergy,
	vampire,
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
      priceVial,
      priceVampire,
      priceVampireEst,
	  treasury,
	  treasuryDai,
	  totalVampires,
	  totalVials,
	  darkEnergy,
    }}>
      {children}
    </Context.Provider>
  )
}

export default Provider