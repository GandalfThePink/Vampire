import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { bnToDec, getEthBalance } from '../utils'

const useEthBalance = (accountAddress?: string, decimals = 18) => {

  const [balance, setBalance] = useState<number>()
  const { ethereum }: { ethereum: provider } = useWallet()

  const fetchBalance = useCallback(async () => {
    if (!accountAddress || !ethereum ) {
      return
    }
    const bal = await getEthBalance(ethereum, accountAddress)
    setBalance(bnToDec(new BigNumber(bal), decimals))
  }, [
    accountAddress,
    decimals,
    ethereum,
  ])

  useEffect(() => {
    fetchBalance()
  }, [
    accountAddress,
    decimals,
    ethereum,
  ])
  return balance
}

export default useEthBalance