import { useMemo } from 'react'

import {
  vamps as vampireAddress,
  vials as vialAddress,
} from '../constants/tokenAddresses'

//import usePrices from 'hooks/usePrices'
import useTotalSupply from '../hooks/useTotalSupply'
import useEthBalance from '../hooks/useEthBalance'
import useAlpha from '../hooks/useAlpha'

const treasuryAddress = vampireAddress

const useTreasury = () => {
  //const { yamTwap } = usePrices()
  const	treasury = useEthBalance(treasuryAddress)
  const darkEnergy = useAlpha()
  const vialBalance = useTotalSupply(vialAddress)

  
  return {
	treasury,
    darkEnergy,
    vialBalance,
  }
}

export default useTreasury