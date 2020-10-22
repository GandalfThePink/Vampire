import { useContext } from 'react'

import { VampireStatsContext } from '../contexts/VampireStats'

const useVampireStats = () => {
  return {
    ...useContext(VampireStatsContext)
  }
}

export default useVampireStats