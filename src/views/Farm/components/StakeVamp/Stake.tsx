import React, { useCallback, useMemo, useState } from 'react'

import Countdown, { CountdownRenderProps} from 'react-countdown'
import numeral from 'numeral'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardIcon,
} from 'react-neu'
import { useWallet } from 'use-wallet'

import Label from '../../../../components/Label'
import Value from '../../../../components/Value'

import useFarming from '../../../../hooks/useFarming'

import { bnToDec } from '../../../../utils'

import StakeModal from './components/StakeModal'
import UnstakeModal from './components/UnstakeModal'

const Stake: React.FC = () => {
  const [stakeModalIsOpen, setStakeModalIsOpen] = useState(false)
  const [unstakeModalIsOpen, setUnstakeModalIsOpen] = useState(false)

  const { status } = useWallet()
  const {
    isApprovedVamp,
    isApprovingVamp,
    isStakingVamp,
    isUnstakingVamp,
    onApproveVamp,
    onStakeVamp,
    onUnstakeVamp,
    stakedBalanceVamp,
  } = useFarming()

  const handleDismissStakeModal = useCallback(() => {
    setStakeModalIsOpen(false)
  }, [setStakeModalIsOpen])

  const handleDismissUnstakeModal = useCallback(() => {
    setUnstakeModalIsOpen(false)
  }, [setUnstakeModalIsOpen])

  const handleOnStake = useCallback((amount: string) => {
    onStakeVamp(amount)
    handleDismissStakeModal()
  }, [handleDismissStakeModal, onStakeVamp])

  const handleOnUnstake = useCallback((amount: string) => {
    onUnstakeVamp(amount)
    handleDismissUnstakeModal()
  }, [
    handleDismissUnstakeModal,
    onUnstakeVamp,
  ])

  const handleStakeClick = useCallback(() => {
    setStakeModalIsOpen(true)
  }, [setStakeModalIsOpen])

  const handleUnstakeClick = useCallback(() => {
    setUnstakeModalIsOpen(true)
  }, [setUnstakeModalIsOpen])

  const StakeButton = useMemo(() => {
    if (status !== 'connected') {
      return (
        <Button
          disabled
          full
          text="Stake"
          variant="secondary"
        />
      )
    }
    if (isStakingVamp) {
      return (
        <Button
          disabled
          full
          text="Staking..."
          variant="secondary"
        />
      )
    }
    if (!isApprovedVamp) {
      return (
        <Button
          disabled={isApprovingVamp}
          full
          onClick={onApproveVamp}
          text={!isApprovingVamp ? "Approve staking" : "Approving staking..."}
          variant={isApprovingVamp || status !== 'connected' ? 'secondary' : 'default'}
        />
      )
    }
    if (isApprovedVamp) {
      return (
        <Button
          full
          onClick={handleStakeClick}
          text="Stake"
          variant="secondary"
        />
      )
    }
  }, [
    handleStakeClick,
    isApprovingVamp,
    onApproveVamp,
    status,
  ])

  const UnstakeButton = useMemo(() => {
    const hasStaked = stakedBalanceVamp && stakedBalanceVamp.toNumber() > 0
    if (status !== 'connected' || !hasStaked) {
      return (
        <Button
          disabled
          full
          text="Unstake"
          variant="secondary"
        />
      )
    }
    if (isUnstakingVamp) {
      return (
        <Button
          disabled
          full
          text="Unstaking..."
          variant="secondary"
        />
      )
    }
    return (
      <Button
        full
        onClick={handleUnstakeClick}
        text="Unstake"
        variant="secondary"
      />
    )
  }, [
    handleUnstakeClick,
    isApprovingVamp,
    onApproveVamp,
    status,
  ])

  const formattedStakedBalance = useMemo(() => {
    if (stakedBalanceVamp) {
      return numeral(bnToDec(stakedBalanceVamp)).format('0.00a')
    } else {
      return '--'
    }
  }, [stakedBalanceVamp])


  return (
    <>
      <Card>
        <CardIcon>🤺</CardIcon>
        <CardContent>
          <Box
            alignItems="center"
            column
          >
            <Value value={formattedStakedBalance} />
            <Label text="Staked Uniswap Vamp-Eth Tokens" />
          </Box>
        </CardContent>
        <CardActions>
          {UnstakeButton}
          {StakeButton}
        </CardActions>
      </Card>
      <StakeModal
        isOpen={stakeModalIsOpen}
        onDismiss={handleDismissStakeModal}
        onStake={handleOnStake}
      />
      <UnstakeModal
        isOpen={unstakeModalIsOpen}
        onDismiss={handleDismissUnstakeModal}
        onUnstake={handleOnUnstake}
      />
    </>
  )
}

export default Stake