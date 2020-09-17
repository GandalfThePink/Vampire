pragma solidity >=0.4.25 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol"; 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./BloodVial.sol";

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/lib/contracts/libraries/FixedPoint.sol';

import '@uniswap/v2-periphery/contracts/libraries/UniswapV2OracleLibrary.sol';
import '@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol';

// this contract controlls the blood and acts in such a way that blood remains close to 1 Dai in value. It is not a hard stablecoin and can deviate somewhat from the peg. But over the time of a few days it should readjust and provide accurate values. 

contract Vampire is ERC20,Ownable {

	
	using SafeMath for uint256;
	using Address for address;
	using FixedPoint for *;
	
	
    uint public constant PERIOD = 1 hours;  // this is the minimal time for the vwap oracle 
	uint public constant EPOCH = 1 days;    // this is reference timescale for the contract
	uint constant MAX_UINT = 2**256 - 1;

    IUniswapV2Pair immutable pairWethDai;
    IUniswapV2Pair immutable pairVampireWeth;
    IUniswapV2Pair immutable pairBloodWeth;
	IUniswapV2Router02 immutable routerV2;
    
    
	address internal constant factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f ;
	address internal constant router = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D ;
	
	address internal constant tokenWeth = 0xd0A1E359811322d97991E03f863a0C30C2cF029C; //weth
	// kovan weth 0xd0A1E359811322d97991E03f863a0C30C2cF029C
	// ropsten weth 0xc778417E063141139Fce010982780140Aa0cD5Ab
	address internal constant tokenDai = 0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa; //dai
	// kovan dai 0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa
	// ropsten dai 0xaD6D458402F60fD3Bd25163575031ACDce07538D
	address internal immutable tokenVampire;
	address internal immutable tokenBlood;
	

    uint    public priceWethCumulativeLast;
    uint    public priceDaiCumulativeLast;
    uint    public priceBloodCumulativeLast;
    uint32  public blockTimestampLast;
    FixedPoint.uq112x112 public priceWethAverage; // price of weth in dai
    FixedPoint.uq112x112 public priceDaiAverage; // price of dai in weth
    FixedPoint.uq112x112 public priceBloodAverage; // price of vial in weth
	
	BloodVial internal bloodVial;
			
	constructor(address bloodVial_) public ERC20("Vampire","Vampires") {
		
		bloodVial = BloodVial(bloodVial_);  
		tokenBlood = bloodVial_;
		tokenVampire = address(this);
	    
		_mint(msg.sender, 1000 * 10**18 ); 
		
        pairWethDai = IUniswapV2Pair(UniswapV2Library.pairFor(factory, tokenWeth, tokenDai));
		pairVampireWeth = IUniswapV2Pair(UniswapV2Library.pairFor(factory,address(this), tokenWeth)); 
		pairBloodWeth = IUniswapV2Pair(UniswapV2Library.pairFor(factory, bloodVial_, tokenWeth)); 
		routerV2 = IUniswapV2Router02(router);
		bloodVial.approve(router,MAX_UINT); 				// give uniswap the right to excahnge vials
		_approve(address(this),router,MAX_UINT); 			// give uniswap the right to excahnge vampires
		
			
	}
	
    receive() external payable { } // payable fallback function
	
	 
	function activateOracles() public onlyOwner {
        // we initialise the two Uniswap pairs and seed the vwap oracle
			
		uint priceDummy1;
		uint priceDummy2;
		(priceDummy1,priceDummy2,blockTimestampLast) = UniswapV2OracleLibrary.currentCumulativePrices(address(pairBloodWeth));
    	priceBloodCumulativeLast = (tokenBlood < tokenWeth ? priceDummy1 : priceDummy2);
		
		(priceDummy1,priceDummy2,blockTimestampLast) = UniswapV2OracleLibrary.currentCumulativePrices(address(pairWethDai));
		priceWethCumulativeLast = (tokenWeth < tokenDai ? priceDummy1 : priceDummy2);
		priceDaiCumulativeLast = (tokenWeth < tokenDai ? priceDummy2 : priceDummy1);
		
	} 
	 
	    
    function updateOracle() internal returns (uint32){
		// this function updates the vwap oracle
		
		uint priceDummy1;
		uint priceDummy2;
		uint32 blockTimestamp;
		uint32 timeElapsed;
		
		(priceDummy1,priceDummy2,blockTimestamp) = UniswapV2OracleLibrary.currentCumulativePrices(address(pairBloodWeth));
    	uint priceBloodCumulative = (tokenBlood < tokenWeth ? priceDummy1 : priceDummy2);
		
		(priceDummy1,priceDummy2,blockTimestamp) = UniswapV2OracleLibrary.currentCumulativePrices(address(pairWethDai));
		uint priceWethCumulative = (tokenWeth < tokenDai ? priceDummy1 : priceDummy2);
		uint priceDaiCumulative = (tokenWeth < tokenDai ? priceDummy2 : priceDummy1);
		
		timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired
		
        // ensure that at least one full period has passed since the last update
		require(timeElapsed >= PERIOD, 'More time must pass before the next ritual can be held');

        priceWethAverage = FixedPoint.uq112x112(uint224((priceWethCumulative - priceWethCumulativeLast) / timeElapsed));
        priceDaiAverage = FixedPoint.uq112x112(uint224((priceDaiCumulative - priceDaiCumulativeLast) / timeElapsed));
        priceBloodAverage = FixedPoint.uq112x112(uint224((priceBloodCumulative - priceBloodCumulativeLast) / timeElapsed));
        
        priceWethCumulativeLast = priceWethCumulative; //price of token Weth in Dai
        priceDaiCumulativeLast = priceDaiCumulative; //price of token Weth in Dai
        priceBloodCumulativeLast = priceBloodCumulative; //price of token Weth in Dai
        
		blockTimestampLast = blockTimestamp;
		
		return timeElapsed;
    }

    
	function getDarkEnergy() public view returns (uint256 darkEnergy) {	
		// darkEnergy is the fundamental security parameter. It is the ratio of guaranteed value in blood divided by the total collateral.
		// 1000 means that we can exactly gurantee all bloodVials. We aim for 1500 or 50% overcollateralisation 
		
		uint256 ethReserves = address(this).balance;
		uint256 treasury = uint256(priceWethAverage.mul(ethReserves).decode144()); // value of contract eth in dai
		uint256 liabilities = bloodVial.totalSupply();  // fictional value of the blood assuming each vial is worth one dai
		
		darkEnergy = treasury.mul(1000).div(liabilities);
		
	}
	
	
    function darkRitual() internal returns (bool){ 
		// the darkRitual calls a bloodRitual when enough time has passed. Otherwise it does nothing so the calling fucntion can proceed
		
		uint priceDummy1;
		uint priceDummy2;
		uint32 blockTimestamp;
		uint32 timeElapsed;
		
		(priceDummy1,priceDummy2,blockTimestamp) = UniswapV2OracleLibrary.currentCumulativePrices(address(pairBloodWeth));	
		timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired
		
		if (timeElapsed >= PERIOD) {
			bloodRitual();
		}
		 
		return true;
	}
		
    function bloodRitual() public returns (bool) {
		// the bloodRitual tries to bring the value of a vial back to one dai. To acchieve this the vampires will draw or consume blood. If darkEnergy is too low, they will call a liquidation by rebasing the bloodVials

	  	uint32 timeElapsed = updateOracle(); 
		uint256 darkEnergy = getDarkEnergy();
		
		if (darkEnergy > 1500){
			// Vampires firmly in power, only defend the value of blood 
			fillBloodVials(darkEnergy,timeElapsed);
			
		} else if (darkEnergy > 800){
			// recrout new Vampires to increase darkEnergy. Also defend price of Blood
			recruitVampires(darkEnergy,timeElapsed);
			fillBloodVials(darkEnergy,timeElapsed);
			
			
		} else {
			// here the vampires have lost controll. A liquidation is needed. We rebase bloodVials until we have enough darkPower to back their price. 
			uint256 one = 10**18;
			uint256 price = uint256(priceBloodAverage.mul(one).decode144()); // price of one vial in weth
			uint256 daiPrice = uint256(priceWethAverage.mul(price).decode144()); // price of one vial in dai
			
			if (daiPrice > one){
				// as long as the market price is above one dai we do not rebase. Instead people can just sell and be happy.
				recruitVampires(darkEnergy,timeElapsed);
				
			}
			else {
			// rebase bloodVials
				rebase(); 
				
				// do not use price oracles here as they are outdated after the rebase. This may also affect other fucntions that use  priceBloodAverage. Currently this is never used outside of the bloodRitual so there is no concern. But if in the future there would be callable fucntions relying on it we would need to update it here
			}	
		}
		
		// reward the caller, a bit less than 1% of vampires per year 
		uint256 reward = totalSupply().mul(timeElapsed).div(1000000).div(1 hours);
		_mint(msg.sender,reward);  
		
		return true;
    } 
	 
	 
    function rebase() internal returns (bool) {
		
		uint256 ethReserves = address(this).balance;
		uint256 treasury = uint256(priceWethAverage.mul(ethReserves).decode144()); 
		
		uint256 liabilities = bloodVial.totalSupply();  
		
		uint256 bloodDropIncrease = liabilities.mul(1000).div(treasury);
		// this balances the bloodVials to current backing eth
		// never do more than a 3x in one step
		if (bloodDropIncrease > 3000) {
			bloodDropIncrease = 3000;
		}
		bloodVial.rebase(bloodDropIncrease);
		pairBloodWeth.sync(); // need to update uniswap pool after a rebase
		
		return true;
    } 
	
    function recruitVampires( uint darkEnergy,uint32 timeElapsed) internal returns (bool) {
    	// this function recruits new vampires and sells them to get more eth to bloster darkEnergy
		
		// darkEnergy < 1000: recruit 10% per epoch
		// darkEnergy < 1200: recruit 1% per epoch
		// darkEnergy > 1200: recruit 0.1% per epoch
			
		uint recruitFactor = 1;
		if (darkEnergy < 1000) recruitFactor = 100;
		else if (darkEnergy < 1200) recruitFactor = 10;
		
		uint256 targetRecruitment = recruitFactor.mul(timeElapsed).mul(totalSupply()).div(1000).div(EPOCH); 
		

        uint112 reserve0;
        uint112 reserve1;
		uint32 dummyTime;
        (reserve0, reserve1, dummyTime) = pairVampireWeth.getReserves();
		uint256 reserveVampire = (tokenVampire < tokenWeth? reserve0 : reserve1); 
		
		uint256 maxRecruitment = reserveVampire.mul(3).div(1000); // this is so we do not get too much slippage and can be frontrun 
		uint256 recruitment = (targetRecruitment < maxRecruitment? targetRecruitment: maxRecruitment);
		
		_mint(address(this),recruitment);  
		
		// dump the new recruits on the market and get darkEnergy
		address[] memory path = new address[](2);
		path[0] = tokenVampire;
		path[1] = routerV2.WETH();
		routerV2.swapExactTokensForETH(recruitment, 0, path, address(this), block.timestamp);
		
		return true;
    } 
	
	
    function fillBloodVials(uint darkEnergy,uint32 timeElapsed) internal returns (bool) {
    	// here we draw or consume blood to keep the value stable
		
		uint256 one = 10**18;
		uint256 price = uint256(priceBloodAverage.mul(one).decode144()); // price of one vial in weth
		uint256 daiPrice = uint256(priceWethAverage.mul(price).decode144()); // price of one vial in dai
		
		uint256 reserveWeth;
		uint256 reserveBlood;
		
        { // local scope
		uint112 reserve0;
        uint112 reserve1;
		uint32 dummyTime;
        (reserve0, reserve1, dummyTime) = pairBloodWeth.getReserves();
		
		reserveWeth = (tokenBlood < tokenWeth? reserve1 : reserve0);
		reserveBlood = (tokenBlood < tokenWeth? reserve0 : reserve1);
		}
		
		uint256 bloodVialSupply = bloodVial.totalSupply();
		
		if (daiPrice > one) {
			// draw and sell
			uint256 delta = daiPrice.sub(one).mul(10000).div(one); 
			// delta is fractional price difference, the higher the more we want to draw
			
			uint256 baseRate = 500; // print an extra 5%
			if (darkEnergy < 1000) baseRate = 0; // no extra print if we are not collateralised
			else if (darkEnergy < 1200) baseRate = 100; // print extra 1%
			uint256 epochIssuance = delta.add(baseRate).mul(bloodVialSupply).div(10000); 
			uint256 targetIssuance = epochIssuance.mul(timeElapsed).div(EPOCH);
				
	        
			uint256 maxIssuance = reserveBlood.mul(3).div(1000);
			
			// if live price is far away we can issue even more. We may get frontrun, but if price is good there is no problem
			price = one.mul(reserveWeth).div(reserveBlood);
			daiPrice = uint256(priceWethAverage.mul(price).decode144());
			if (daiPrice > one) {
				delta = daiPrice.sub(one).mul(10000).div(one);
				if (delta > 330){ // more then 3.3% price differnce
					uint256 slip = delta.sub(300); // trade to 3%
					if (slip > 500){slip = 500;} // never slip more than 5%
					maxIssuance = reserveBlood.mul(slip).div(10000);
				
				}
			}
			
			uint256 issuance = (targetIssuance < maxIssuance? targetIssuance: maxIssuance);
			
			bloodVial.mint(address(this),issuance);  
		
			// sell new blood to drop the price
			address[] memory path = new address[](2);
			path[0] = tokenBlood;
			path[1] = routerV2.WETH();
			routerV2.swapExactTokensForETH(issuance, 0, path, address(this), block.timestamp);
						 
		}
		else {
		 	// here price is low, so we want to buy back blood and consume it
			uint256 delta = one.sub(daiPrice).mul(10000).div(one); 
			uint256 epochBurn = delta.mul(bloodVialSupply).div(10000);
			uint256 targetBurn = epochBurn.mul(timeElapsed).div(EPOCH);
			
			uint256 maxBurn = reserveBlood.mul(3).div(1000);  // limit maximum slippage
			
			
			// again check if live price is far too low, then buy even more
			price = one.mul(reserveWeth).div(reserveBlood);
			daiPrice = uint256(priceWethAverage.mul(price).decode144());
			if (daiPrice < one) {
				delta = one.sub(daiPrice).mul(10000).div(one);
				if (delta > 330){ // more then 3.3% price differnce
					uint256 slip = delta.sub(300); // trade to 3%
					if (slip > 500){slip = 500;} // never slip more than 5%
					maxBurn = reserveBlood.mul(slip).div(10000);
				
				}
			}
			
			
			uint256 burn = (targetBurn < maxBurn? targetBurn: maxBurn);
			uint256 ethBurn = uint256(priceBloodAverage.mul(burn).decode144()); 
			uint256 maxEthBurn = address(this).balance.div(2); // never burn more than half the treasury
			if (ethBurn > maxEthBurn) {
				ethBurn = maxEthBurn;
			}
			
			// buy and consume blood
			address[] memory path = new address[](2);
			path[0] = routerV2.WETH();
			path[1] = tokenBlood;
			routerV2.swapExactETHForTokens{value: ethBurn}(0, path, address(this),  block.timestamp );
			
			burn = bloodVial.balanceOf(address(this));
			
			bloodVial.burn(address(this),burn);
			
			
		}
		
	
		return true;
		
    }
	
	
	
	function sliverBullet(uint vampires) public returns (bool) {
		// this kills of your vampires and steals their eth
		
		require(balanceOf(msg.sender) >= vampires,'Cannot kill more vampires than you have found');
		
		darkRitual();
		
		// this is a copy of getDarkEnergy, we call it like this since we need intermediate quantities
		uint256 ethReserves = address(this).balance;
		uint256 treasury = uint256(priceWethAverage.mul(ethReserves).decode144()); 
		uint256 liabilities = bloodVial.totalSupply(); 
		
		uint256 darkEnergy = treasury.mul(1000).div(liabilities);
		
		require(darkEnergy > 2000, 'The Vampires are still hiding in their lairs');
		
		uint256 lootedDai = (treasury.sub(liabilities)).mul(vampires).div(totalSupply()); 
		uint256 targetDarkEnergy = (treasury.sub(lootedDai)).mul(1000).div(liabilities); 
		
		require(targetDarkEnergy > 2000,"Be more careful! Now the vampires are hiding");
			
		// alternatice calculation: (treasury - liabilities)/treasury * ethReserves/supply*vampires (would not require dai oracle)
		uint256 lootedEth = uint256(priceDaiAverage.mul(lootedDai).decode144());
		_burn(msg.sender, vampires );
		msg.sender.transfer(lootedEth);
		
	
		return true;
		
	}
	
	
	function bloodGarlic(uint vampires) public returns (bool) {
		// destroy an equal share of vampires and bloodVials to get a fraction of locked eth
		
		// this curse puts a constraint that the value of vampires and bloodVials must be at least equivalent to the ethreserve. 
		
		require(balanceOf(msg.sender) >= vampires,'Cannot poison more vampires than you have found');
		
		darkRitual(); // if you want to exit, at least update the oracles for us :)
		
		uint256 requiredBloodVials = vampires.mul(bloodVial.totalSupply()).div(totalSupply());
		require(bloodVial.balanceOf(msg.sender) >= requiredBloodVials,'Need more blood to contaminate it with garlic');
		
		uint256 ethReserves = address(this).balance;
		uint256 requestedEth = vampires.mul(ethReserves).div(totalSupply());
		_burn(msg.sender, vampires );
		bloodVial.burn(msg.sender, requiredBloodVials);
		
		msg.sender.transfer(requestedEth);
		
		return true;
		
	}
	
	function etherRitual() public payable returns (bool) {
		// this spell creates both blood and vampires out of ether, leaving the darkPower invariant
		// it can only be allowed if the vampires are strong enough if close to liquidation this otherwise could lead to the paradoxical situation of more Vials being filled 
		// when active it contrains the value of vampires and bloodVials from above
		
		darkRitual(); 
		require (getDarkEnergy() > 1500,'the vampires are too weak to cast this spell');
		// msg.value
		uint256 ethReserves = address(this).balance - msg.value; // ethReserves before the spell
		
		uint256 bloodVials = (msg.value).mul(bloodVial.totalSupply()).div(ethReserves);
		uint256 vampires = (msg.value).mul(totalSupply()).div(ethReserves);

		_mint(msg.sender, vampires );
		bloodVial.mint(msg.sender, bloodVials);
		
		return true;
		
	}
	
	// put v1 on github
	// invite people
	// code reward
	// 1. exxess trade reward, it may be easier to just give it to coll and collect money from there directl
	// 2. percent reward 1 percent a year -> 0.01/365/24 per hour = 0.00000114. At cap of one mill : 1 buck an hour!
	// deploy to mainnet
	// basegrowthh should depend on alpha 
	
		
	// name: unistable ,, stable coin on top of uniswap
	// unilev
	// plans for v2: fair governance
	// -- gov token gained from staking liquidity
	// -- gov token rewards gainsed from staking gov token
	// -- voting contracts
	// -- interest rate rebases
	// interest rate
	// gov rewards
	// modular price oracles
	// rebase for gov token??
	
	// rewards for liquidity and calling the function, oracle liquidity to lure in new folks
	//...
}
