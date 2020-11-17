import React, { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import ConfirmTransactionModal from '../../components/ConfirmTransactionModal'
import { vialUniLp as vialUniLpAddress } from '../../constants/tokenAddresses'
import { vampUniLp as vampUniLpAddress } from '../../constants/tokenAddresses'
import useApproval from '../../hooks/useApproval'
import useVampire from '../../hooks/useVampire'

import {
  getEarned,
  getStaked,
  harvest,
  redeem,
  stake,
  unstake,
} from '../../vampire-sdk/utils'

import Context from './Context'


const Provider: React.FC = ({ children }) => {
  const [confirmTxModalIsOpen, setConfirmTxModalIsOpen] = useState(false)
  const [isHarvestingVial, setIsHarvestingVial] = useState(false)
  const [isRedeemingVial, setIsRedeemingVial] = useState(false)
  const [isStakingVial, setIsStakingVial] = useState(false)
  const [isUnstakingVial, setIsUnstakingVial] = useState(false)

  const [earnedBalanceVial, setEarnedBalanceVial] = useState<BigNumber>()
  const [stakedBalanceVial, setStakedBalanceVial] = useState<BigNumber>()
  
  const [isHarvestingVamp, setIsHarvestingVamp] = useState(false)
  const [isRedeemingVamp, setIsRedeemingVamp] = useState(false)
  const [isStakingVamp, setIsStakingVamp] = useState(false)
  const [isUnstakingVamp, setIsUnstakingVamp] = useState(false)

  const [earnedBalanceVamp, setEarnedBalanceVamp] = useState<BigNumber>()
  const [stakedBalanceVamp, setStakedBalanceVamp] = useState<BigNumber>()
  
  const vampire = useVampire()
  const { account } = useWallet()
  
  const vialPoolAddress = vampire ? vampire.contracts.vial_pool.options.address : ''
  const vampPoolAddress = vampire ? vampire.contracts.vamp_pool.options.address : ''
  var { isApproved , isApproving, onApprove} = useApproval(
    vialUniLpAddress,
	vialPoolAddress,
    () => setConfirmTxModalIsOpen(false)
  )
  const isApprovedVial = isApproved;
  const isApprovingVial = isApproving;
  const onApproveVial = onApprove; 

  var { isApproved , isApproving, onApprove} = useApproval(
    vampUniLpAddress,
	vampPoolAddress,
    () => setConfirmTxModalIsOpen(false)
  )
  const isApprovedVamp = isApproved;
  const isApprovingVamp = isApproving;
  const onApproveVamp = onApprove; 


  const fetchEarnedBalanceVial = useCallback(async () => {
    if (!account || !vampire) return
    const balance = await getEarned(vampire, vampire.contracts.vial_pool, account)
    setEarnedBalanceVial(balance)
  }, [
    account,
    setEarnedBalanceVial,
    vampire
  ])

  const fetchEarnedBalanceVamp = useCallback(async () => {
    if (!account || !vampire) return
    const balance = await getEarned(vampire, vampire.contracts.vamp_pool, account)
    setEarnedBalanceVamp(balance)
  }, [
    account,
    setEarnedBalanceVamp,
    vampire
  ])

  const fetchStakedBalanceVial = useCallback(async () => {
    if (!account || !vampire) return
    const balance = await getStaked(vampire, vampire.contracts.vial_pool, account)
    setStakedBalanceVial(balance)
  }, [
    account,
    setStakedBalanceVial,
    vampire
  ])

  const fetchStakedBalanceVamp = useCallback(async () => {
    if (!account || !vampire) return
    const balance = await getStaked(vampire, vampire.contracts.vamp_pool, account)
    setStakedBalanceVamp(balance)
  }, [
    account,
    setStakedBalanceVamp,
    vampire
  ])

  const fetchBalances = useCallback(async () => {
    fetchEarnedBalanceVial()
    fetchStakedBalanceVial()
    fetchEarnedBalanceVamp()
    fetchStakedBalanceVamp()
  }, [
    fetchEarnedBalanceVial,
    fetchStakedBalanceVial,
    fetchEarnedBalanceVamp,
    fetchStakedBalanceVamp,
  ])

  const handleApproveVial = useCallback(() => {
    setConfirmTxModalIsOpen(true)
    onApproveVial()
  }, [
    onApproveVial,
    setConfirmTxModalIsOpen,
  ])
  const handleApproveVamp = useCallback(() => {
    setConfirmTxModalIsOpen(true)
    onApproveVamp()
  }, [
    onApproveVamp,
    setConfirmTxModalIsOpen,
  ])
  
  const handleHarvestVial = useCallback(async () => {
    if (!vampire) return
    setConfirmTxModalIsOpen(true)
    await harvest(vampire,vampire.contracts.vial_pool, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsHarvestingVial(true)
    })
    setIsHarvestingVial(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsHarvestingVial,
    vampire
  ])
  const handleHarvestVamp = useCallback(async () => {
    if (!vampire) return
    setConfirmTxModalIsOpen(true)
    await harvest(vampire,vampire.contracts.vamp_pool, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsHarvestingVamp(true)
    })
    setIsHarvestingVamp(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsHarvestingVamp,
    vampire
  ])

  const handleRedeemVial = useCallback(async () => {
    if (!vampire) return
    setConfirmTxModalIsOpen(true)
    await redeem(vampire, vampire.contracts.vial_pool, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsRedeemingVial(true)
    })
    setIsRedeemingVial(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsRedeemingVial,
    vampire
  ])
  const handleRedeemVamp = useCallback(async () => {
    if (!vampire) return
    setConfirmTxModalIsOpen(true)
    await redeem(vampire, vampire.contracts.vamp_pool, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsRedeemingVamp(true)
    })
    setIsRedeemingVamp(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsRedeemingVamp,
    vampire
  ])
  
  const handleStakeVial = useCallback(async (amount: string) => {
    if (!vampire) return
    setConfirmTxModalIsOpen(true)
    await stake(vampire, vampire.contracts.vial_pool
  , amount, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsStakingVial(true)
    })
    setIsStakingVial(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsStakingVial,
    vampire
  ])

  const handleStakeVamp = useCallback(async (amount: string) => {
    if (!vampire) return
    setConfirmTxModalIsOpen(true)
    await stake(vampire, vampire.contracts.vamp_pool
  , amount, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsStakingVamp(true)
    })
    setIsStakingVamp(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsStakingVamp,
    vampire
  ])

  const handleUnstakeVial = useCallback(async (amount: string) => {
    if (!vampire) return
    setConfirmTxModalIsOpen(true)
    await unstake(vampire, vampire.contracts.vial_pool
  , amount, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsUnstakingVial(true)
    })
    setIsUnstakingVial(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsUnstakingVial,
    vampire
  ])

  const handleUnstakeVamp = useCallback(async (amount: string) => {
    if (!vampire) return
    setConfirmTxModalIsOpen(true)
    await unstake(vampire, vampire.contracts.vamp_pool
  , amount, account, () => {
      setConfirmTxModalIsOpen(false)
      setIsUnstakingVamp(true)
    })
    setIsUnstakingVamp(false)
  }, [
    account,
    setConfirmTxModalIsOpen,
    setIsUnstakingVamp,
    vampire
  ])
  
  useEffect(() => {
    fetchBalances()
    let refreshInterval = setInterval(() => fetchBalances(), 10000)
    return () => clearInterval(refreshInterval)
  }, [fetchBalances])



  return (
    <Context.Provider value={{
      earnedBalanceVial,
      isApprovedVial,
      isApprovingVial,
      isHarvestingVial,
      isRedeemingVial,
      isStakingVial,
      isUnstakingVial,
      onApproveVial: handleApproveVial,
      onHarvestVial: handleHarvestVial,
      onRedeemVial: handleRedeemVial,
      onStakeVial: handleStakeVial,
      onUnstakeVial: handleUnstakeVial,
      stakedBalanceVial,
      earnedBalanceVamp,
      isApprovedVamp,
      isApprovingVamp,
      isHarvestingVamp,
      isRedeemingVamp,
      isStakingVamp,
      isUnstakingVamp,
      onApproveVamp: handleApproveVamp,
      onHarvestVamp: handleHarvestVamp,
      onRedeemVamp: handleRedeemVamp,
      onStakeVamp: handleStakeVamp,
      onUnstakeVamp: handleUnstakeVamp,
      stakedBalanceVamp,
    }}>
      {children}
      <ConfirmTransactionModal isOpen={confirmTxModalIsOpen} />
    </Context.Provider>
  )
}

export default Provider