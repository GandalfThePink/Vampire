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
    isApprovedVial,
    isApprovingVial,
    isStakingVial,
    isUnstakingVial,
    onApproveVial,
    onStakeVial,
    onUnstakeVial,
    stakedBalanceVial,
  } = useFarming()

  const handleDismissStakeModal = useCallback(() => {
    setStakeModalIsOpen(false)
  }, [setStakeModalIsOpen])

  const handleDismissUnstakeModal = useCallback(() => {
    setUnstakeModalIsOpen(false)
  }, [setUnstakeModalIsOpen])

  const handleOnStake = useCallback((amount: string) => {
    onStakeVial(amount)
    handleDismissStakeModal()
  }, [handleDismissStakeModal, onStakeVial])

  const handleOnUnstake = useCallback((amount: string) => {
    onUnstakeVial(amount)
    handleDismissUnstakeModal()
  }, [
    handleDismissUnstakeModal,
    onUnstakeVial,
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
    if (isStakingVial) {
      return (
        <Button
          disabled
          full
          text="Staking..."
          variant="secondary"
        />
      )
    }
    if (!isApprovedVial) {
      return (
        <Button
          disabled={isApprovingVial}
          full
          onClick={onApproveVial}
          text={!isApprovingVial ? "Approve staking" : "Approving staking..."}
          variant={isApprovingVial || status !== 'connected' ? 'secondary' : 'default'}
        />
      )
    }
    if (isApprovedVial) {
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
    isApprovingVial,
    onApproveVial,
    status,
  ])

  const UnstakeButton = useMemo(() => {
    const hasStaked = stakedBalanceVial && stakedBalanceVial.toNumber() > 0
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
    if (isUnstakingVial) {
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
    isApprovingVial,
    onApproveVial,
    status,
  ])

  const formattedStakedBalance = useMemo(() => {
    if (stakedBalanceVial) {
      return numeral(bnToDec(stakedBalanceVial)).format('0.00a')
    } else {
      return '--'
    }
  }, [stakedBalanceVial])


  return (
    <>
      <Card>
        <CardIcon>🤼</CardIcon>
        <CardContent>
          <Box
            alignItems="center"
            column
          >
            <Value value={formattedStakedBalance} />
            <Label text="Staked Uniswap Vial-Eth Tokens" />
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