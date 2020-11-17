import BigNumber from 'bignumber.js'

export interface ContextValues {
  vampireBalance?: BigNumber,
  vialBalance?: BigNumber,
  vialUniLpBalance?: BigNumber,
  vampUniLpBalance?: BigNumber,
  ethBalance?: BigNumber,
}