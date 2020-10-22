import React from 'react'
import {
  Container,
  Spacer,
} from 'react-neu'


import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Split from '../../components/Split'
import Stats from './components/Stats'
import Rebase from './components/Rebase'
import Treasury from './components/Treasury'

const Home: React.FC = () => {
	return (
	  <Page>
	  <PageHeader
	     icon={"🌑"}
	     subtitle={ "Watch out! The Vampires are looking for fresh blood."}
	     title="Shhhh ..."
	    />
		<Container>	
		  <Treasury /> 
		  <Spacer/>
          <Split>
            <Rebase/> 
            <Stats/>
          </Split>
		</Container>
		 
	  </Page>
	)
    
   
}

export default Home
