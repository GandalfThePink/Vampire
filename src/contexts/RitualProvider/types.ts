import BigNumber from 'bignumber.js'

export interface ContextValues {
  onEtherRitual: (amount: string) => void,
  onSilverBullet: (amount: string) => void,
  onBloodGarlic: (amount: string) => void,	
}