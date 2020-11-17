import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import {ethers} from 'ethers'


BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const waitTransaction = async (provider, txHash) => {
  const web3 = new Web3(provider)
  let txReceipt = null
  while (txReceipt === null) {
    const r = await web3.eth.getTransactionReceipt(txHash)
    txReceipt = r
    await sleep(2000)
  }
  return (txReceipt.status)
}

export const approve = async (tokenContract, poolContract, account) => {
  return tokenContract.methods
    .approve(poolContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account, gas: 80000 })
}

export const getLastBloodRitual = async (vampire) => {
  try {
    let now = await vampire.web3.eth.getBlock('latest').then(res => res.timestamp);
    let interval = 3600; // 12 hours
    	
	let pastBig = await vampire.contracts.vampire.methods.blockTimestampLast().call();
	// past is a string, not a number
	
	let past = parseInt(pastBig);
	
	if (past + interval <= now) {
		return 0;
	}
	
	let secondsToRebase = interval + past - now;
	
	return secondsToRebase;
  } catch (e) {
    console.log(e)
  }
  
}

export const getEarned = async (vampire, pool, account) => {
  const earned = new BigNumber(await pool.methods.earned(account).call())
  return earned
}

export const getStaked = async (vampire, pool, account) => {
  return vampire.toBigN(await pool.methods.balanceOf(account).call())
}


export const harvest = async (vampire, poolContract, account, onTxHash) => {
  return poolContract.methods
      .getReward()
      .send({ from: account, gas: 200000 }, async (error, txHash) => {
        if (error) {
            onTxHash && onTxHash('')
            console.log("Harvest error", error)
            return false
        }
        onTxHash && onTxHash(txHash)
        const status = await waitTransaction(vampire.web3.eth, txHash)
        if (!status) {
          console.log("Harvest transaction failed.")
          return false
        }
        return true
  })
 
}

export const redeem = async (vampire,poolContract, account, onTxHash) => {
  return poolContract.methods
      .exit()
      .send({ from: account, gas: 400000 }, async (error, txHash) => {
        if (error) {
            onTxHash && onTxHash('')
            console.log("Redeem error", error)
            return false
        }
        onTxHash && onTxHash(txHash)
        const status = await waitTransaction(vampire.web3.eth, txHash)
        if (!status) {
          console.log("Redeem transaction failed.")
          return false
        }
        return true
  })
 
}

export const stake = async (vampire, poolContract, amount, account, onTxHash) => {
  const gas = 400000
  return poolContract.methods
      .stake((new BigNumber(amount).times(new BigNumber(10).pow(18))).toString())
      .send({ from: account, gas }, async (error, txHash) => {
        if (error) {
            onTxHash && onTxHash('')
            console.log("Staking error", error)
            return false
        }
        onTxHash && onTxHash(txHash)
        const status = await waitTransaction(vampire.web3.eth, txHash)
        if (!status) {
          console.log("Staking transaction failed.")
          return false
        }
        return true
   })
 }

 export const unstake = async (vampire, poolContract, amount, account, onTxHash) => {
   return poolContract.methods
       .withdraw((new BigNumber(amount).times(new BigNumber(10).pow(18))).toString())
       .send({ from: account, gas: 200000 }, async (error, txHash) => {
         if (error) {
             onTxHash && onTxHash('')
             console.log("Unstaking error", error)
             return false
         }
         onTxHash && onTxHash(txHash)
         const status = await waitTransaction(vampire.web3.eth, txHash)
         if (!status) {
           console.log("Unstaking transaction failed.")
           return false
         }
         return true
    })
 }
