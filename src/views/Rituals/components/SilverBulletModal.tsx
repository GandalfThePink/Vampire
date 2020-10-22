import React, { useCallback, useState } from 'react'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import {
  Button,
  Modal,
  ModalActions,
  ModalContent,
  ModalProps,
  ModalTitle,
  Spacer,
} from 'react-neu'

import TokenInput from '../../../components/TokenInput'
import Label from '../../../components/Label'
import FancyValue from '../../../components/FancyValue'
import useBalances from '../../../hooks/useBalances'
import useVampireStats from '../../../hooks/useVampireStats'

import daiLogo from '../../../assets/Dai.png'
import uniswapLogo from '../../../assets/UNISWAP.svg'



interface SilverBulletModalProps extends ModalProps {
  onCall: (amount: string) => void,
}

const SilverBulletModal: React.FC<SilverBulletModalProps> = ({
  isOpen,
  onDismiss,
  onCall,
}) => {

  const [val, setVal] = useState('')
  const {vampireBalance} = useBalances()
  const {priceVampire, priceVampireEst} = useVampireStats()
		
  	
  const getDisplayBalance = useCallback((value?: BigNumber, multiplier=1) => {
     if (value) {
          return numeral(value.multipliedBy(multiplier)).format('0.000')
        } else {
          return '--'
        }
      }, [])  	
	
  const fullBalance = getDisplayBalance(vampireBalance)
  
  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setVal(e.currentTarget.value)
  }, [setVal])

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const handleEtherClick = useCallback(() => {
    onCall(val)
  }, [onCall, val])

  return (
    <Modal isOpen={isOpen}> 
      <ModalTitle text="Silver Bullet" />
      <ModalContent>
	    <Label text='Hunt vampires and steal their ether' />
	  	
	    
	    <TokenInput
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullBalance}
          symbol="🧛🏼‍♂️"
        />
		<Spacer />
        <FancyValue
		  icon = {<img src={daiLogo} style={{ height: 38 }} alt='Dai Logo'/>}  
          label="Estimated loot"
          value={getDisplayBalance(priceVampireEst,val)}
        />
		<Spacer />  
        <FancyValue
		   icon = {<img src={uniswapLogo} style={{ height: 38 }} alt='Uniswap Logo' />}
           label="Dai you could get on Uniswap instead"
           value={getDisplayBalance(priceVampire,val)}
        /> 
		  
      </ModalContent>
      <ModalActions>
        <Button
          onClick={onDismiss}
          text="Cancel"
          variant="secondary"
        />
        <Button
          disabled={!val || !Number(val)}
          onClick={handleEtherClick}
          text="Hunt Vampires"
          variant={!val || !Number(val) ? 'secondary' : 'default'}
        />
      </ModalActions>
    </Modal>
  )
}

export default SilverBulletModal