import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'

import { bnToDec} from '../utils'
import useVampire from './useVampire'

const useAlpha = (decimals = 3) => {

  const [balance, setBalance] = useState<number>()
  const vampire = useVampire()

  const fetchBalance = useCallback(async () => {
    if (!vampire ) {
      return
    }
    const bal = await vampire.contracts.vampire.methods.getDarkEnergy().call()
    setBalance(bnToDec(new BigNumber(bal), decimals))
  }, [
	decimals,  
    vampire
  ])

  useEffect(() => {
    fetchBalance()
  }, [
	decimals,
    vampire
  ])
  return balance
}

export default useAlpha