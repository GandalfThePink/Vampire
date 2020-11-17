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
    earnedBalanceVamp,
    isHarvestingVamp,
    isRedeemingVamp,
    onHarvestVamp,
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
    if (!isHarvestingVamp) {
      return (
        <Button
          full
          onClick={onHarvestVamp}
          text="Recruit"
		  variant="secondary"
        />
      )
    }
    if (isHarvestingVamp) {
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
    isHarvestingVamp,
    isRedeemingVamp,
    onHarvestVamp,
  ])

  const formattedEarnedBalance = useMemo(() => {
    if (earnedBalanceVamp) {
      return numeral(bnToDec(earnedBalanceVamp)).format('0.00a')
    } else {
      return '--'
    }
  }, [earnedBalanceVamp])

  return (
    <Card>
      <CardIcon>🦹</CardIcon>
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