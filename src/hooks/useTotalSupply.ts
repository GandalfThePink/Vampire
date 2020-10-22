import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { bnToDec, getTotalSupply } from '../utils'

const useTotalSupply = (tokenAddress?: string, decimals = 18) => {

  const [balance, setBalance] = useState<number>()
  const { ethereum }: { ethereum: provider } = useWallet()

  const fetchBalance = useCallback(async () => {
    if (!tokenAddress || !ethereum ) {
      return
    }
    const bal = await getTotalSupply(ethereum, tokenAddress)
    setBalance(bnToDec(new BigNumber(bal), decimals))
  }, [
    tokenAddress,
    decimals,
    ethereum,
  ])

  useEffect(() => {
    fetchBalance()
  }, [
    tokenAddress,
    decimals,
    ethereum,
  ])
  return balance
}

export default useTotalSupply