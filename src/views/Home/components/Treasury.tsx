import React, { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import {
  Card,
  CardContent,
  CardTitle,
  Spacer,
} from 'react-neu'

import FancyValue from '../../../components/FancyValue'
import Split from '../../../components/Split'

import useVampireStats from '../../../hooks/useVampireStats'
import ethLogo from '../../../assets/eth.png'
import daiLogo from '../../../assets/Dai.png'


const Treasury: React.FC = () => {
  
  const { treasury, treasuryDai, darkEnergy, totalVials} = useVampireStats()	
  
  const getDisplayBalance = useCallback((value?: BigNumber, multiplier=1) => {
      if (value) {
        return numeral(value.multipliedBy(multiplier)).format('0.00a')
      } else {
        return '--'
      }
    }, [])

  
  
  return (
	    
    <Card>
      <CardTitle text="Vampire Treasury" />
     
	  <CardContent>
      <Spacer size="sm" />
        
        <Split>
          <FancyValue
	        icon={<img src={ethLogo} style={{ height: 38 }} alt='ether-logo'/>}
            label="Treasury value"
            value={getDisplayBalance(treasury)}
          />
          <FancyValue
	        icon={<img src={daiLogo} style={{ height: 38 }} alt='dai-logo'/>}
            label="equivalent in Dai"
            value={getDisplayBalance(treasuryDai)}
          />	
          <FancyValue
            icon="🩸"
            label="Total Vial Supply"
            value={getDisplayBalance(totalVials)}
          />
          <FancyValue
            icon="⚡"
            label="Collateralisation"
            value={getDisplayBalance(darkEnergy,0.001)}
          />
       
        </Split>
        
      </CardContent>
      
    </Card>
  )
}

export default Treasury
