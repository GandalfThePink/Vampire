import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { createTheme, ThemeProvider } from 'react-neu'
import {
  BrowserRouter as Router,
  Route,	
  Switch,
} from 'react-router-dom'


import TopBar from './components/TopBar'
import PageHeader from './components/PageHeader'
import Page from './components/Page'

import { UseWalletProvider } from 'use-wallet';
import { BalancesProvider } from './contexts/Balances'
import { VampireStatsProvider } from './contexts/VampireStats'
import { RitualProvider} from './contexts/RitualProvider'
import  VampireProvider  from './contexts/VampireProvider'

import Home from './views/Home'
import Faq from './views/Faq'
import Trade from './views/Trade'
import Rituals from './views/Rituals'


const ASTRONAUTS = [
  '🦹',
  '🦹‍♂️',
  '🦹🏻‍♂️',
  '🦹🏻‍♀️',
  '🦹🏼‍♀️',
  '🦹🏼‍♂️',
  '🦹🏽‍♂️',
  '🦹🏽‍♀️',
  '🦹🏾‍♂️',
  '🦹🏾‍♀️',
  '🦹🏿‍♂️',
  '🦹🏿‍♀️',
]



const App: React.FC = () => {
	
  const [astronaut, setAstronaut] = useState('🦹')


  const updateAstronaut = useCallback(() => {
      const newAstro = ASTRONAUTS[Math.floor(Math.random()*ASTRONAUTS.length)]
      setAstronaut(newAstro)
  }, [setAstronaut])

  useEffect(() => {
      const refresh = setInterval(updateAstronaut, 800)
      return () => clearInterval(refresh)
  }, [updateAstronaut])	
  	
  return (

    <Router>
      <Providers>
	    <TopBar/> 
	    <Switch>
          <Route exact path="/">
            <Home /> 
          </Route>
          <Route exact path="/trade"> 
 		    <Trade /> 
          </Route>

          <Route exact path="/rituals"> 
 		    <Rituals /> 
          </Route>
          <Route exact path="/farm"> 
	       <Page>
            <PageHeader
              icon='👩‍🌾'
              subtitle="Coming soon!"
              title="Farming"
            />
		   </Page>	
          </Route>
          <Route exact path="/governance"> 
	       <Page>
	        <PageHeader
	          icon={`${astronaut}`}
	          subtitle="Coming soon!"
	          title="Governance"
	        />	
	       </Page>
          </Route>	
          <Route exact path="/faq"> 
	        <Faq />
          </Route>	  
	    </Switch>
	  </Providers>
    </Router>
 

  );

}

const Providers: React.FC = ({ children }) => {
	const { dark: darkTheme, light: lightTheme } = useMemo(() => {
    return createTheme({
      baseColor:  { h: 200, s: 100, l: 15 },
      baseColorDark: { h: 200, s: 100, l: 15 },
      borderRadius: 28,
    })
  }, [])
	
  return (
	<ThemeProvider
	  darkTheme={darkTheme}
	  lightTheme={lightTheme}>  	  
      <UseWalletProvider
        chainId={1}
        connectors={{
          walletconnect: { rpcUrl: 'https://mainnet.eth.aragon.network/' },
      }}>
        <VampireProvider>
	      <BalancesProvider>
	  		<VampireStatsProvider>
	  		  <RitualProvider>
                {children}
			  </RitualProvider>
			</VampireStatsProvider>
		  </BalancesProvider>
	    </VampireProvider>						
      </UseWalletProvider>
	</ThemeProvider>
  );
}

export default App;

