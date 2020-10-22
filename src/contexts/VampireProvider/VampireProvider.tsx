import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { Vampire } from '../../vampire-sdk/lib'

export interface VampireContext {
  vampire?: any
}

export const Context = createContext<VampireContext>({
  vampire: undefined,
})

declare global {
  interface Window {
    vampiresauce: any
  }
}

const VampireProvider: React.FC = ({ children }) => {
  const { ethereum } = useWallet()
  const [vampire, setVampire] = useState<any>()

  useEffect(() => {
    if (ethereum) {
      const vampireLib = new Vampire(
        ethereum,
        "1",
        false, {
          defaultAccount: "",
          defaultConfirmations: 1,
          autoGasMultiplier: 1.5,
          testing: false,
          defaultGas: "6000000",
          defaultGasPrice: "1000000000000",
          accounts: [],
          ethereumNodeTimeout: 10000
        }
      )

      setVampire(vampireLib)
      window.vampiresauce = vampireLib
    }
  }, [ethereum])

  return (
    <Context.Provider value={{ vampire }}>
      {children}
    </Context.Provider>
  )
}

export default VampireProvider