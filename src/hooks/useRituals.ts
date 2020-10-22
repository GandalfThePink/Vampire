import { useContext } from 'react'

import { RitualContext } from '../contexts/RitualProvider'

const useRituals = () => {
  return { ...useContext(RitualContext) }
}

export default useRituals