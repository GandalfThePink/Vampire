import { useContext } from 'react'
import { Context } from '../contexts/VampireProvider'

const useVampire = () => {
  const { vampire } = useContext(Context)
  return vampire
}

export default useVampire