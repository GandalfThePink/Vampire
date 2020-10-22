import BigNumber from 'bignumber.js'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});


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

