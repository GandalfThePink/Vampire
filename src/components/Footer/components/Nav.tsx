import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink href="https://en.wikipedia.org/wiki/Under_Construction">Discord</StyledLink>
      <StyledLink href="https://github.com/GandalfThePink/Vampire/tree/master/contracts">Github</StyledLink>
      <StyledLink href="https://en.wikipedia.org/wiki/Under_Construction">Twitter</StyledLink>
	  <StyledLink href="https://en.wikipedia.org/wiki/Under_Construction">Donate</StyledLink>
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
