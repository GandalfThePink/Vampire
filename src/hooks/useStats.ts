import { useMemo } from 'react'

import {
  vamps as vampireAddress,
  vials as vialAddress,
  dai as daiAddress,
  weth as wethAddress,
  vialFactory as vialFactoryAddress,
  vampFactory as vampireFactoryAddress,
  daiFactory as daiFactoryAddress,
} from '../constants/tokenAddresses'

//import usePrices from 'hooks/usePrices'
import useTokenBalance from '../hooks/useTokenBalance'


const useStats = () => {
 


  const vampireReserves = useTokenBalance(vampireFactoryAddress,vampireAddress)	
  const wethVampireReserves = useTokenBalance(vampireFactoryAddress,wethAddress)	

 
  const pVamp = (vampireReserves != null && wethVampireReserves != null) ? wethVampireReserves/vampireReserves : 0	
	
	
  const daiReserves = useTokenBalance(daiFactoryAddress,daiAddress)	
  const wethDaiReserves = useTokenBalance(daiFactoryAddress,wethAddress)	
  const pWeth = (daiReserves != null && wethDaiReserves != null) ? daiReserves/wethDaiReserves : 0
	
  const vialReserves = useTokenBalance(vialFactoryAddress,vialAddress)	
  const wethVialReserves = useTokenBalance(vialFactoryAddress,wethAddress)	
  const pVial = (vialReserves != null && wethVialReserves != null) ? wethVialReserves/vialReserves : 0

  const priceVial = pVial*pWeth
  const priceVampire = pVamp*pWeth*1000

  
  return {
	priceVampire,
    priceVial,
  }
}

export default useStats