import React from 'react'
import styled from 'styled-components'

import useVampire from '../../../hooks/useVampire'
import { useWallet } from 'use-wallet'


const Nav: React.FC = () => {
	
  const vampire = useVampire()
  const { account } = useWallet()
  
  const handleDonation = () => {
	if (vampire) {
	  const value = vampire.web3.utils.toWei('0.02', "ether")
	  vampire.web3.eth.sendTransaction({from:account, to:"0x740eac515057280D2d4127fa19495a2CB84B698E", value: value})	
	}
  }  		

  return (
    <StyledNav>
      <StyledLink href="https://en.wikipedia.org/wiki/Under_Construction">Discord</StyledLink>
      <StyledLink href="https://github.com/GandalfThePink/Vampire/tree/master/contracts">Github</StyledLink>
      <StyledLink href="https://en.wikipedia.org/wiki/Under_Construction">Twitter</StyledLink>
      <StyledLink href="#" onClick={handleDonation}>Donate</StyledLink>
     </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
  color: ${props => props.theme.colors.grey[500]};
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.colors.grey[600]};
  }
`

export default Nav
