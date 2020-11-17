import React, { useMemo, useCallback } from 'react'

import {
  Box,
  Button,
  Container,
  Separator,
  Spacer,
} from 'react-neu'

import { useWallet } from 'use-wallet'

import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Split from '../../components/Split'

import useFarming from '../../hooks/useFarming'

import HarvestCardVial from './components/HarvestVial'
import StakeCardVial from './components/StakeVial'
import HarvestCardVamp from './components/HarvestVamp'
import StakeCardVamp from './components/StakeVamp'



const Farm: React.FC = () => {
  const { status } = useWallet()
  const {
    isRedeemingVial,
    onRedeemVial,
    isRedeemingVamp,
    onRedeemVamp,
  } = useFarming()


  const RedeemButton = useMemo(() => {
    if (status !== 'connected') {
      return (
		<Split>  
		  <Button
		    full
            disabled
            text="Exit Vial Pool"
            variant="secondary"
          />   
		  <Button
		    full
            disabled
            text="Exit Vampire Pool"
            variant="secondary"
          />   
		</Split>		
      )
    }
    if (!isRedeemingVial && !isRedeemingVamp) {
      return (
		<Split>  
          <Button
		    full
            onClick={onRedeemVial}
            text="Exit Vial Pool"
            variant="secondary"
          />
          <Button
			full
            onClick={onRedeemVamp}
            text="Exit Vampire Pool"
            variant="secondary"
          />
		</Split>  
      )
    }if (!isRedeemingVial) {
      return (
		<Split>  
          <Button
		    full
            onClick={onRedeemVial}
            text="Exit Vial Pool"
            variant="secondary"
          />
          <Button
			full
            disabled
			text="Exiting..."
            variant="secondary"
          />
		</Split>  
      )
    }
    if (!isRedeemingVamp) {
      return (
		<Split>  
          <Button
		    full
            disabled
			text="Exiting..."
            variant="secondary"
          />
          <Button
		    full
            onClick={onRedeemVamp}
            text="Exit Vampire Pool"
            variant="secondary"
          />
		</Split>  
      )
    }
    return (
	  <Split>	
        <Button
		  full
          disabled
          text="Exiting..."
          variant="secondary"
        />
        <Button
		  full
          disabled
          text="Exiting..."
          variant="secondary"
        />
	  </Split>	
    )
  }, [
    isRedeemingVial,
    onRedeemVial,
    isRedeemingVamp,
    onRedeemVamp,
  ])

  return (
    <Page>
      <PageHeader
        icon="‍🥋"
        subtitle="Stake Uniswap LP tokens to train new SuperVillains"
        title="Dojo"
      />
      <Container>
        <Spacer />
        <Split>
          <StakeCardVial />
	      <StakeCardVamp />
        </Split>
	    <Spacer />
        <Split>
          <HarvestCardVial />
          <HarvestCardVamp />
        </Split>
        <Spacer />
        <Box row justifyContent="center">
          {RedeemButton}
        </Box>
        <Spacer />
        <Separator />
        <Spacer />
        <Split> 
          <Button
		    full
            text="Get Vial-Eth LP tokens"
            href="https://app.uniswap.org/#/add/0xffDD4d26C91752d4f7AEfa4d50737212126c04A2/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
            variant="tertiary"
          />
          <Button
            full
            text="Get Vampire-Eth LP tokens"
            href="https://app.uniswap.org/#/add/0x6457AA01f871754e6907B42CBCaF09383eFf60aC/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
            variant="tertiary"
          />
         
        </Split>
      </Container>
    </Page>
  )
}

export default Farm