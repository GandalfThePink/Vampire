import React, { useCallback, useState, useMemo } from 'react'
import {
  Container,
  Spacer,
  Box,
  Card,
  CardIcon,
  CardTitle,
  Button,
  CardContent,
  CardActions,
}
from 'react-neu'


import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Split from '../../components/Split'
import Label from '../../components/Label'

import useVampireStats from '../../hooks/useVampireStats'
import useRituals from '../../hooks/useRituals'

import EtherModal from './components/EtherModal'
import SilverBulletModal from './components/SilverBulletModal'
import BloodGarlicModal from './components/BloodGarlicModal'
import ethLogo from '../../assets/eth.png'



const Rituals: React.FC = () => {
	
	const {darkEnergy} = useVampireStats()
	
	const [etherModalIsOpen, setEtherModalIsOpen] = useState(false)
	
	const handleEtherClick = useCallback(() => {
	    setEtherModalIsOpen(true)
	}, [setEtherModalIsOpen])
	  
	const handleDismissEtherModal = useCallback(() => {
	  setEtherModalIsOpen(false)
	}, [setEtherModalIsOpen])  
	
	const [silverBulletModalIsOpen, setSilverBulletModalIsOpen] = useState(false)
	
	const handleSilverBulletClick = useCallback(() => {
	    setSilverBulletModalIsOpen(true)
	}, [setSilverBulletModalIsOpen])
	  
	const handleDismissSilverBulletModal = useCallback(() => {
	  setSilverBulletModalIsOpen(false)
	}, [setSilverBulletModalIsOpen])  
	
    const {
       onEtherRitual,
	   onSilverBullet,
	   onBloodGarlic,
    } = useRituals()
	
	const [bloodGarlicModalIsOpen, setBloodGarlicModalIsOpen] = useState(false)
	
	const handleBloodGarlicClick = useCallback(() => {
	    setBloodGarlicModalIsOpen(true)
	}, [setBloodGarlicModalIsOpen])
	  
	const handleDismissBloodGarlicModal = useCallback(() => {
	  setBloodGarlicModalIsOpen(false)
	}, [setBloodGarlicModalIsOpen])  
	

	const handleEtherCall = useCallback((amount: string) => {
	  onEtherRitual(amount)
	  handleDismissEtherModal()
	}, [handleDismissEtherModal,onEtherRitual ])

	const handleSilverBulletCall = useCallback((amount: string) => {
	  onSilverBullet(amount)
	  handleDismissSilverBulletModal()
	}, [handleDismissSilverBulletModal,onSilverBullet ])
	
	const handleBloodGarlicCall = useCallback((amount: string) => {
	  onBloodGarlic(amount)
	  handleDismissBloodGarlicModal()
	}, [handleDismissBloodGarlicModal,onBloodGarlic ])

	
	const SilverBullet = useMemo(() => {
	    
	  if (darkEnergy && darkEnergy.toNumber() > 2000) {
 	    return (
          <Card>
		    <CardIcon>‍🧿</CardIcon>
		    <CardTitle text="Silver Bullet" />
            <CardContent>
			   <Box column>
                 <Label text= "Redeem 🧛🏼‍♂️ for their corresponding collateral"   />
          
			   </Box>
              
            </CardContent>
            <CardActions>
              <Box row justifyContent="center">
                <Button
                  onClick={handleSilverBulletClick}
                  text="Silver Bullet"
                  variant="secondary"
                />
              </Box>
	       </CardActions>	 
	     </Card>
	      )
	    }
	    return (
          <Card>
		    <CardIcon>‍🧿</CardIcon>
		    <CardTitle text="Silver Bullet" />
            <CardContent>
			   <Box column>
                 <Label text= "Not enough collateral in the treasury, the 🧛🏼‍♂️ are hiding"   />  
			   </Box>
              
              </CardContent>
            <CardActions>
              <Box row justifyContent="center">
                <Button
			      disabled
                  text="Silver Bullet"
                />
              </Box>
            </CardActions>	 
           </Card>
	    )
	  }, [darkEnergy,handleSilverBulletClick])
	  
  	const EtherRitual = useMemo(() => {
	    
  	  if (darkEnergy && darkEnergy.toNumber() > 1500) {
  	    return (
          <Card>    
		    <CardIcon>‍<img src={ethLogo} style={{ height: 67}} alt='ether-logo'/></CardIcon>
		    <CardTitle text="Ether Ritual" />  
            <CardContent>
			   <Box column>
                 <Label text= "Add Ether to the treasury to mint new 🧛🏼‍♂️ and 🩸" />
			   </Box>
	        </CardContent>
            <CardActions>
              <Box row justifyContent="center">
                <Button
                  onClick={handleEtherClick}
                  text="Ether Ritual"
                  variant="secondary"
                />
              </Box>
            </CardActions>
          </Card> 
  	      )
  	    }
  	    return (
          <Card> 
		    <CardIcon>‍<img src={ethLogo} style={{ height: 67}} alt='ether-logo'/></CardIcon>
		    <CardTitle text="Ether Ritual" />       
            <CardContent>
			   <Box column>
                 <Label text= "The Vampires are too weak to cast this ritual" />
			   </Box>
          </CardContent>
          <CardActions>
            <Box row justifyContent="center">
              <Button
			    disabled
                text="Ether Ritual"
              />
            </Box>
          </CardActions>
        </Card> 
  	    )
  	  }, [darkEnergy,handleEtherClick])	  
	
	
	
	return (
	  <Page>
	    <PageHeader
	     icon={"🧙🏼‍♀️"}
	     subtitle={ "not for the faint of heart"}
	     title="Rituals and Protection"
	    />
		<Container> 
		 {EtherRitual}
		<Spacer /> 
	    <EtherModal
         isOpen={etherModalIsOpen}
         onDismiss={handleDismissEtherModal}
         onCall={handleEtherCall}/>
        <Split>
	     {SilverBullet}
	    
        <Card>
		  <CardIcon>‍🧄</CardIcon>
		  <CardTitle text="Blood Garlic" />
          <CardContent>
            <Box row justifyContent="center" alignItems="center">
              <Label text= "Redeem 🧛🏼‍♂️ and 🩸 for their corresponding treasury share"  />
            </Box>
		  </CardContent>
          <CardActions>
            <Box row justifyContent="center">
              <Button
                onClick={handleBloodGarlicClick}
                text="Poison Vampires"
                variant="secondary"
              />
            </Box>
          </CardActions>	 
         </Card> 
	   </Split>	  
	   <SilverBulletModal
	     isOpen={silverBulletModalIsOpen}
	     onDismiss={handleDismissSilverBulletModal}
	     onCall={handleSilverBulletCall}/>	
	   <BloodGarlicModal
	     isOpen={bloodGarlicModalIsOpen}
	     onDismiss={handleDismissBloodGarlicModal}
	     onCall={handleBloodGarlicCall}/>  
	  </Container> 	                  
	 
		 
    </Page>
  )
      
}



export default Rituals

