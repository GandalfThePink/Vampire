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
} from 'react-neu'

import TokenInput from '../../../components/TokenInput'
import Label from '../../../components/Label'
import useBalances from '../../../hooks/useBalances'

interface EtherModalProps extends ModalProps {
  onCall: (amount: string) => void,
}

const EtherModal: React.FC<EtherModalProps> = ({
  isOpen,
  onDismiss,
  onCall,
}) => {


  const { ethBalance} = useBalances()	
  const [val, setVal] = useState('')
	
  const getDisplayBalance = useCallback((value?: BigNumber) => {
     if (value) {
          return numeral(value).format('0.000a')
        } else {
          return '--'
        }
      }, [])  	
	
  const fullBalance = getDisplayBalance(ethBalance)
  
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
      <ModalTitle text="Ether Ritual" />
      <ModalContent>
	    <Label text="Supply Ethereum to generate new Vampires and Vials" />
	    <TokenInput
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullBalance}
          symbol="ETH"
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
          text="Hold Ritual"
          variant={!val || !Number(val) ? 'secondary' : 'default'}
        />
      </ModalActions>
    </Modal>
  )
}

export default EtherModal