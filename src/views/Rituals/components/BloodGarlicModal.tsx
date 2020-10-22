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
import Split from '../../../components/Split'
import Label from '../../../components/Label'
import FancyValue from '../../../components/FancyValue'
import useBalances from '../../../hooks/useBalances'
import useVampireStats from '../../../hooks/useVampireStats'
interface BloodGarlicModalProps extends ModalProps {
  onCall: (amount: string) => void,
}

const BloodGarlicModal: React.FC<BloodGarlicModalProps> = ({
  isOpen,
  onDismiss,
  onCall,
}) => {

  const [val, setVal] = useState('')
  const [val2, setVal2] = useState('')
  const {vampireBalance, vialBalance} = useBalances()
  const {totalVampires, totalVials} = useVampireStats()
		
  	
  const getDisplayBalance = useCallback((value?: BigNumber) => {
     if (value) {
          return numeral(value).format('0.000')
        } else {
          return '--'
        }
      }, [])  	
	
  const fullBalance = getDisplayBalance(vampireBalance)
  
  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setVal(e.currentTarget.value)
	if (totalVials && totalVampires) {
	  const requiredBlood = totalVials.dividedBy(totalVampires).multipliedBy(Number(e.currentTarget.value))
	  setVal2(numeral(requiredBlood).format('0.000'))  
	}  
  }, [setVal,setVal2,totalVials,totalVampires])

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  	if (totalVials && totalVampires) {
  	  const requiredBlood = totalVials.multipliedBy(fullBalance).dividedBy(totalVampires)
  	  setVal2(numeral(requiredBlood).format('0.000'))  
  	}  
  }, [fullBalance, setVal, setVal2,totalVials,totalVampires])

  const handleEtherClick = useCallback(() => {
    onCall(val)
  }, [onCall, val])

  return (
    <Modal isOpen={isOpen}> 
      <ModalTitle text="Blood Garlic" />
      <ModalContent>
	    <Label text='Poison Vampires with Garlic and loot their treasury' />
	  	
	    <TokenInput
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullBalance}
          symbol="🧛🏼‍♂️"
        />
		<Spacer />  
		<Split>  
		  <FancyValue
	        icon="🩸"
            label="Required Blood"
            value={val2}
          />  
		  <FancyValue
	        icon="🩸"
            label="Available Blood"
            value={getDisplayBalance(vialBalance)}
          />
		</Split>
      </ModalContent>
      <ModalActions>
        <Button
          onClick={onDismiss}
          text="Cancel"
          variant="secondary"
        />
        <Button
          disabled={!val || !Number(val) || (vialBalance && Number(val2) > vialBalance.toNumber())}
          onClick={handleEtherClick}
          text="Poison Vampires"
          variant={!val || !Number(val) || (vialBalance && Number(val2) > vialBalance.toNumber())? 'secondary' : 'default'}
        />
      </ModalActions>
    </Modal>
  )
}

export default BloodGarlicModal