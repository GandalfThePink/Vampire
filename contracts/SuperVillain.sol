pragma solidity >=0.4.25 <0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// SuperVillain is the governance coin for the SuperVillain ecosystem of ether derived derivative projects, including initially the BloodVial stablecoin


contract SuperVillain is ERC20, Ownable{ 
	
	mapping (address => bool) public isController;
	mapping (address => uint256) public controllerTimeLock;
	uint256 constant timeLock = 40000;                         // in number of blocks.
															// (1 block = 15 seconds. 240 blocks = 1 hour, 5760 is a day) 
		
	// the controller is able to mint and burn tokens. This is to be given to the VampireContract after deployment.
	modifier onlyController() {
		require(isController[msg.sender] , "You are not calling from controller address");
	   	_;
	}
	
	constructor() public ERC20("SuperVillain","SUV") {
		
	}
	
    function mint(address account, uint256 amount) public onlyController returns (bool) { // allow the controler to mint
        _mint(account,amount);
		return true;
    }
	
    function burn(address account, uint256 amount) public onlyController returns (bool) { // allow the controler to burn
        _burn(account,amount);
		return true;
    }
	
	// owner can set the controller. This will be set to initial distribution contract and later updatied to the finanl governance contract. At this point the owner can be burned so that controller can no longer be changed. 
	
	function registerController(address controllerAddress) public onlyOwner returns (bool) { // register address to be future controler
		
		controllerTimeLock[controllerAddress] = block.number + timeLock;
		return true;
	}
	
	function unregisterController(address controllerAddress) public onlyOwner returns (bool) { // register address to be future controler
		
		controllerTimeLock[controllerAddress] = 0;
		return true;
	}
	
	function activateController(address controllerAddress) public onlyOwner returns (bool) { // set address to controller after timelock passed
		
		require(controllerTimeLock[controllerAddress] != 0, "Timelock not registered yet");
		require(block.number > controllerTimeLock[controllerAddress],"Timelock not passed yet");
		
		isController[controllerAddress] = true;
		controllerTimeLock[controllerAddress] = 0;
		return true; /// cannot unset controller ...
		
	}
	
	function deactivateController(address controllerAddress) public onlyOwner returns (bool) { // no timelock needed to deactivate controllers
		
		isController[controllerAddress] = false;
		controllerTimeLock[controllerAddress] = 0;
		return true; /// cannot unset controller ...
		
	}
	

	
}
