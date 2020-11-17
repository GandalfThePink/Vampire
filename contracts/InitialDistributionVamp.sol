pragma solidity >=0.4.25 <0.7.0;

import "./SuperVillain.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";


// File: contracts/CurveRewards.sol

contract LPTokenWrapperVamp { 
	
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
	
	address internal constant LPToken = 0x9e7AbF31E9172144E02f501f272a03807aB148b4;
	
    IERC20 public uniLP = IERC20(LPToken); // token to use for rewards

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function stake(uint256 amount) virtual public {
        _totalSupply = _totalSupply.add(amount);
        _balances[msg.sender] = _balances[msg.sender].add(amount);
        uniLP.safeTransferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) virtual public {
        _totalSupply = _totalSupply.sub(amount);
        _balances[msg.sender] = _balances[msg.sender].sub(amount);
        uniLP.safeTransfer(msg.sender, amount);
    }
}

contract InitialDistributionVamp is LPTokenWrapperVamp {
   
	address internal constant superVillainToken = 0xc1Ee2FDac2096d80F6dF62AB4e8dD1DD01b8113A;
    
    SuperVillain internal superVillain = SuperVillain(superVillainToken); 
	using SafeERC20 for SuperVillain; 
   
    uint256 internal lastUpdate;
    uint256 internal rewardPerTokenStored;
	mapping(address => uint256) internal userRewardPerTokenPaid;
    mapping(address => uint256) internal rewards;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

  
    modifier updateReward(address account) {
		
		if (superVillain.isController(address(this))){
			uint256 issuance = block.number          // newly minted coins 
                .sub(lastUpdate)
                .mul(1e18);
			
            superVillain.mint(address(this),issuance); 
		}
		rewardPerTokenStored = rewardPerToken();
		lastUpdate = block.number;
		
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }
  
    function rewardPerToken() public view returns (uint256) {
        if (totalSupply() == 0 || !(superVillain.isController(address(this)))) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored.add(
                block.number
                    .sub(lastUpdate)
                    .mul(1e18)   // these lines are the new rewards allowcated
					.mul(1e18)   // this converts to reward per full coin, not per 'satoshi'
                    .div(totalSupply())  
			);
    }

    function earned(address account) public view returns (uint256) {
        return
            balanceOf(account)
                .mul(rewardPerToken().sub(userRewardPerTokenPaid[account])).div(1e18)
                .add(rewards[account]);
    }

    // stake visibility is public as overriding LPTokenWrapper's stake() function
    function stake(uint256 amount) public override updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        super.stake(amount);
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) public override updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        super.withdraw(amount);
        emit Withdrawn(msg.sender, amount);
    }

    function exit() external {
        withdraw(balanceOf(msg.sender));
        getReward();
    }

    function getReward() public updateReward(msg.sender) {
        uint256 reward = earned(msg.sender);
        if (reward > 0) {
            rewards[msg.sender] = 0;
            superVillain.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }
	
	
}