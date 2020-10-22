import React, { useCallback} from 'react'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import {
  Box,
  Card,
  CardContent,
  Spacer,
} from 'react-neu'

import FancyValue from '../../../components/FancyValue'
import useVampireStats from '../../../hooks/useVampireStats'


const Stats: React.FC = () => {
	
  const {priceVampire, priceVial} = useVampireStats()	
	
  const getDisplayBalance = useCallback((value?: BigNumber, multiplier=1) => {
      if (value) {
        return numeral(value.multipliedBy(multiplier)).format('0.00a')
      } else {
        return '--'
      }
    }, [])
	
  	
  return (
    <Box column>
	  <Spacer />
      <Card>
        <CardContent>
          <FancyValue
            icon="🩸"
            label="Current price"
	        value={getDisplayBalance(priceVial) + ' DAI'}
          />
        </CardContent>
      </Card>
      <Spacer />
      <Card>
        <CardContent>
          <FancyValue
            icon="🎯"
            label="Target price"
            value="1 DAI"
          />
        </CardContent>
      </Card>
	  <Spacer />
      <Card>
        <CardContent>
          <FancyValue
            icon="🧛🏼‍♂️"
            label="Current price per 1k Vampires"
            value={getDisplayBalance(priceVampire,1000) + ' DAI'}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default Stats
