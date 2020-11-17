  
import { createContext } from 'react'

import { ContextValues } from './types'

const Context = createContext<ContextValues>({
    onApproveVial: () => {},
    onHarvestVial: () => {},
    onRedeemVial: () => {},
    onStakeVial: () => {},
    onUnstakeVial: () => {},
	onApproveVamp: () => {},
    onHarvestVamp: () => {},
    onRedeemVamp: () => {},
    onStakeVamp: () => {},
    onUnstakeVamp: () => {}
})

export default Context