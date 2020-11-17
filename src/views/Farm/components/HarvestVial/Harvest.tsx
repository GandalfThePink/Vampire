import React, { useMemo } from 'react'

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

const Harvest: React.FC = () => {
  const {
    earnedBalanceVial,
    isHarvestingVial,
    isRedeemingVial,
    onHarvestVial,
  } = useFarming()

  const { status } = useWallet()

  const HarvestAction = useMemo(() => {
    if (status !== 'connected') {
      return (
        <Button
          disabled
          full
          text="Recruit"
          variant="secondary"
        />
      )
    }
    if (!isHarvestingVial) {
      return (
        <Button
          full
          onClick={onHarvestVial}
          text="Recruit"
		  variant="secondary"
        />
      )
    }
    if (isHarvestingVial) {
      return (
        <Button
          disabled
          full
          text="Recruiting..."
          variant="secondary"
        />
      )
    }
  }, [
    isHarvestingVial,
    isRedeemingVial,
    onHarvestVial,
  ])

  const formattedEarnedBalance = useMemo(() => {
    if (earnedBalanceVial) {
      return numeral(bnToDec(earnedBalanceVial)).format('0.00a')
    } else {
      return '--'
    }
  }, [earnedBalanceVial])

  return (
    <Card>
      <CardIcon>🦹‍♂️</CardIcon>
      <CardContent>
        <Box
          alignItems="center"
          column
        >
          <Value value={formattedEarnedBalance} />
          <Label text="SuperVillains trained" />
        </Box>
      </CardContent>
      <CardActions>
        {HarvestAction}
      </CardActions>
    </Card>
  )
}

export default Harvest