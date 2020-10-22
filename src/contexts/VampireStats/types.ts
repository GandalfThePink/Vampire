import BigNumber from 'bignumber.js'

export interface ContextValues {
  priceVial?: BigNumber,
  priceVampire?: BigNumber,
  priceVampireEst?: BigNumber,
  treasury?: BigNumber,
  treasuryDai?: BigNumber,	
  totalVampires?: BigNumber,
  totalVials?: BigNumber,
  darkEnergy?: BigNumber,
}