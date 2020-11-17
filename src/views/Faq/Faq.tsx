import React, { useMemo } from 'react'

import {
  Card,
  CardContent,
  Container,
} from 'react-neu'
import { useLocation } from 'react-router-dom'

//import ExternalLink from '../../components/ExternalLink'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'

import Question from './components/Question'

const Faq: React.FC = () => {
  const { pathname } = useLocation()
  const pathArr = pathname.split('/')

  const activeSlug = useMemo(() => {
    if (pathArr.length > 2) {
      return pathArr[2]
    }
  }, [pathArr])

  return (
    <Page>
      <PageHeader
        icon="📖"
        title="FAQ"
      />
      <Container>
        <Card>
          <CardContent>
            
            <Question
              active={activeSlug === "home"}
              question="What is supervillain.finance?"
              slug="home"
            >
              <span>
			    Supervillain is a new protocoll build on top of uniswap that delivers both a stablecoin (🩸) and a levergaed ethereum long position (🧛🏼‍♂️).
			    The assumed risk for the long holders is employed to guarantee price stability for the stablecoin holders. The protocoll acts entirely onchain
			    and nobody has any special priviledges. 
			    <br />
			    <b> Right now this is only an early test version. Use only to experiment with the smart contracts and be carefull depositing funds. There may be bugs!</b> 
			  </span>
            </Question>
            <Question
              active={activeSlug === "home"}
              question="Is supervillain.finance safe?"
              slug="home"
            >
              <span>
			    No. It is only a beta version. We did test the smart contracts and to our knowledge there are no bugs, but there always can be something we missed. 
			  </span>
            </Question>
            <Question
              active={activeSlug === "home"}
              question="How are superVillains trained?"
              slug="home"
            >
              <span>
			    Anyone can train freshly minted superVillain governance tokens (🦹) by providing liquidity for 🩸 and 🧛🏼‍♂️ on uniswap. <br />
			    First, obtain 🩸 or 🧛🏼‍♂️ tokens from uniswap (make sure uniswap prices are accurate!), 
			    or via the EtherRitual minting new 🩸 and 🧛🏼‍♂️ tokens. <br />
			    Second, supply those in the respective uniswap pool paired with ether (links found in the dojo). <br />
			    Finally deposit the liquidity token in our farming contracts (also found in the dojo). <br />
			    Each block starting from Monday 23rd November 2020 will generate two 🦹 distributed to the liquidity providers. The initial farming will end with the deployment of version 1.0 at a yet 
			    unspecified date. At that point 🦹 will be usuable in the governance of the protocoll. Please note that 🦹 have no value and only provide voting rights, with the sole goal to 
			    allow users of the protocoll to self-govern. The supply is inflationary, with a constant initial issuence and a planned fixed fractional issuence in v1.0. <br /> 
			    There is no guanrantee v1.0 will ever be completed, meaning there is no guarantee that 🦹 will ever have a usecase.   
	          </span>
            </Question>  
            <Question
              active={activeSlug === "home"}
              question="What is the point of creating a stablecoin linked to the value of DAI? Why not just use DAI?"
              slug="home"
            >
              <span>
			    This is only the minimal design for the first test version. In later versions we intend to upgrade it to the media of a basket of stablecoins that trade on uniswap.
			    But even now there is some utlity. 🩸 minting and liquidation works differntly and may be suitable for some use cases. For example while the maximal
			    supply of dai is fixed 🩸 can always be minted as long as there is enough collateral without a hard cap. Also, opposed to the CBDs used for dai, we have a fungible long position (🧛🏼‍♂️). 
			  </span>
            </Question>
            <Question
              active={activeSlug === "home"}
              question="What are rituals?"
              slug="home"
            >
              <span>
			    As a normal user you never need to use those. You can buy and sell 🩸 and 🧛🏼‍♂️ on uniswap and passively enjoy their value developement compared to ether.
			    Only make sure that the price is close enough to the prices we estimated on the trade page. <br />
			   
			    We have four rituals for advanced users. First the blood ritual is the heart of the protocoll. It can be called at most once per hour
			    and tries to stabilise the price of 🩸 via programatic trading of the reserves on uniswap. <br />
			  
			    Second there are the ether ritual and the blood garlic. The first deposits ether into the treasury and mints new 🩸 and 🧛🏼‍♂️. The second reverses this and allows 
			    holders of pairs of 🩸 and 🧛🏼‍♂️ to reclaim their colleteral. <br />
			  
			    Finally, the silver bullet allows 🧛🏼‍♂️ holders to reclaim excess colleteral, but it is only active if the protocoll already has more than enough funds.   
			  </span>
            </Question>  
          </CardContent>
        </Card>
      </Container>
    </Page>
  )
}

export default Faq
