pragma solidity >=0.4.25 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

// bloodVial is a stablecoin that is based on Uniswap and the vampireToken representing the eth collateral backing it. It is a simple erc20 contract that has a rebase fucntionality to manage forced liquidations. 

contract BloodVial is IERC20, Ownable{ // we start from IERC20 since we need to redefine a lot of the basic ERC20
	
	using SafeMath for uint256;
	using Address for address;
	
	uint256 private _dropsOfBloodPerVial; 
	
	// balance are denominated in dropsOfBlood, those poured into value stable bloodVials
	
    mapping (address => uint256) private _balances;  

    mapping (address => mapping (address => uint256)) private _allowances;
	
	uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    uint8 private _decimals;
	
	address public controller;
	
	// the controller is able to mint and burn tokens. This is to be given to the VampireContract after deployment.
	modifier onlyController() {
	        require(msg.sender == controller, "You are not calling from controller address");
	        _;
	    }
	
    event Rebase(
         uint256 fractionalIncreasePermille 
    );
	
	constructor() public {
		_dropsOfBloodPerVial = 1000;
		_name = "BloodVials";
		_symbol = "Vials";
		_decimals = 18;
	    _mint(msg.sender, 10 * 10**18 );
		controller = msg.sender;
	}
	
	
	// reproduce basic ERC20
	
    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }
	
    function decimals() public view returns (uint8) {
        return _decimals;
    }
	
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }
	
	
    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }
	
    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }
	
    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
		
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        
		return true;
    }
    
	
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }
	
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }
	
	// modified ERC20 fucntions. We work in dropsOfBlood and covert user input and displayed output. Otherwise it is standart
	
    function totalSupply() public view override returns (uint256) {
        return _totalSupply.div(_dropsOfBloodPerVial) ;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account].div(_dropsOfBloodPerVial);
    }
	
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: mint to the zero address");

		uint256 numberFragments = amount.mul(_dropsOfBloodPerVial);	

        _totalSupply = _totalSupply.add(numberFragments);
        _balances[account] = _balances[account].add(numberFragments);
        emit Transfer(address(0), account, numberFragments );
    }
	
    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: burn from the zero address");

		uint256 numberFragments = amount.mul(_dropsOfBloodPerVial);	
		
        _balances[account] = _balances[account].sub(numberFragments, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(numberFragments);
        emit Transfer(account, address(0), numberFragments);
    }
	
    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

		uint256 numberFragments = amount.mul(_dropsOfBloodPerVial);

        _balances[sender] = _balances[sender].sub( numberFragments, "ERC20: transfer amount exceeds balance");
        _balances[recipient] = _balances[recipient].add( numberFragments);
        emit Transfer(sender, recipient,  numberFragments);
    }
	
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount; // approve is directly denominated in coins
        emit Approval(owner, spender, amount);
    }
	
	
	// new fucntionality, all locked to the controlling smart contract
	
    function rebase(uint256 fractionalIncreasePermille) public onlyController returns (bool) { 
           
        _dropsOfBloodPerVial = _dropsOfBloodPerVial.mul(fractionalIncreasePermille).div(1000); 
		  
		emit Rebase(fractionalIncreasePermille);
		return true;
    }
	
    function mint(address account, uint256 amount) public onlyController returns (bool) {
        _mint(account,amount);
		return true;
    }
	
    function burn(address account, uint256 amount) public onlyController returns (bool) {
        _burn(account,amount);
		return true;
    }
	
	// allows the transfer of the contoller by the owner
	
	function setController(address new_controller) public onlyOwner returns (bool) {
		controller = new_controller;
		
	}
	
}
