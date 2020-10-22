import React, { useCallback } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import numeral from 'numeral'
import {
  Box,
  Button,
  Modal,
  ModalActions,
  ModalContent,
  ModalProps,
  ModalTitle,
  Separator,
  Spacer
} from 'react-neu'

import FancyValue from '../../components/FancyValue'
import Split from '../../components/Split'
import ethLogo from '../../assets/eth.png'


import useBalances from '../../hooks/useBalances'
//import useVesting from '../../hooks/useVesting'

const WalletModal: React.FC<ModalProps> = ({
  isOpen,
  onDismiss,
}) => {

  const { reset } = useWallet()
  const {
    vampireBalance,
    vialBalance,
	ethBalance,
  } = useBalances()

 // const {
 //   vestedDelegatorRewardBalance,
 //   vestedMigratedBalance,
 // } = useVesting()

  const getDisplayBalance = useCallback((value?: BigNumber) => {
    if (value) {
      return numeral(value).format('0.00a')
    } else {
      return '--'
    }
  }, [])

  const handleSignOut = useCallback(() => {
    reset()
	if (onDismiss){
	  onDismiss()
	}
  }, [reset,onDismiss])

  return (
    <Modal isOpen={isOpen}>
      <ModalTitle text="My Wallet" />
      <ModalContent>
        <Split>
          <Box row>
            <FancyValue
              icon="🩸"
              label="Vials"
              value={getDisplayBalance(vialBalance)}
            />
          </Box>
          <Box row>
            <FancyValue
              icon="🧛🏼‍♂️"
              label="Vampires"
              value={getDisplayBalance(vampireBalance)}
            />
          </Box>
          <Box row>
            <FancyValue
              icon={<img src={ethLogo} style={{ height: 38 }} alt = 'ether-logo' />}
              label="Ether"
              value={getDisplayBalance(ethBalance)}
            />
          </Box>	  
        </Split>
        <Spacer />
      </ModalContent>
      <Separator />
      <ModalActions>
        <Button
          onClick={onDismiss}
          text="Cancel"
          variant="secondary"
        />
        <Button
          onClick={handleSignOut}
          text="SignOut"
        />
      </ModalActions>
    </Modal>
  )
}

export default WalletModal