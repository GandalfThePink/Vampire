import React, { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import {
  Container,
  Spacer,
  Box,
  Card,
  CardIcon,
  Button,
  CardContent,
  CardActions,
}
from 'react-neu'


import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Split from '../../components/Split'
import Label from '../../components/Label'
import Value from '../../components/Value'

import useVampireStats from '../../hooks/useVampireStats'


import uniswapLogo from '../../assets/UNISWAP.svg'


const Trade: React.FC = () => {
	
	const { priceVial, priceVampire, priceVampireEst} = useVampireStats()	

	const getDisplayBalance = useCallback((value?: BigNumber, multiplier=1) => {
	    if (value) {
	      return numeral(value.multipliedBy(multiplier)).format('0.00a')
	    } else {
	      return '--'
	    }
	  }, [])
	
	return (
	  <Page>
	  <PageHeader
	     icon={ <img src={uniswapLogo} style={{ height: 110 }} alt='Uniswap Logo' />}
	     //subtitle={ "open 24/7 just for you"}
	     title="Trade on Uniswap"
	    />
		<Container>	
		  <Split>
            <Card>
              <CardIcon>‍🩸</CardIcon>
              <CardContent>
                <Box
                  alignItems="center"
                  column
                >
		 		<Value value={getDisplayBalance(priceVial)}  />
            	<Label text="DAI per Vial" />
		        <Spacer />
		        <Value value="1.00"  />
            	<Label text="Target Value" />
                </Box>
              </CardContent>
              <CardActions>
                <Box row justifyContent="center">
                  <Button
                    href="https://app.uniswap.org/#/swap?outputCurrency=0xffDD4d26C91752d4f7AEfa4d50737212126c04A2&inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&exactAmount=1&theme=dark"
                    text="Uniswap DAI-🩸"
                    variant="secondary"
                  />
                </Box>
              </CardActions>
            </Card>
            <Card>
              <CardIcon>🧛🏼‍♂️</CardIcon>
              <CardContent>
                <Box
                  alignItems="center"
                  column
                >
		 		  <Value value={getDisplayBalance(priceVampire,1000)}  />
            	  <Label text="DAI per 1k Vampires" />
		          <Spacer />
		          <Value value={getDisplayBalance(priceVampireEst,1000)}  />
            	  <Label text="Estimated Value based on Treasury" />
                </Box>
              </CardContent>
              <CardActions>
                <Box row justifyContent="center">
                  <Button
                    href="https://app.uniswap.org/#/swap?outputCurrency=0x6457AA01f871754e6907B42CBCaF09383eFf60aC&exactAmount=1&theme=dark"
                    text="Uniswap ETH-🧛🏼‍♂️"
                    variant="secondary"
                  />
                </Box>
              </CardActions>
            </Card>          
            
		  </Split>
        </Container>
		 
	  </Page>
	)
    
   
}

export default Trade

