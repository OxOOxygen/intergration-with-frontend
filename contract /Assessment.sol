// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address public owner;
    uint256 public tokenPrice = 0.00000000000000001 ether; // Price per token
    mapping(address => uint256) public balances;
    mapping(address => uint256) public stakedBalances;

    event Bought(address indexed buyer, uint256 amt);
    event Sold(address indexed seller, uint256 amt);
    event Transferred(address indexed sender, address indexed receiver, uint256 amt);
    event Staked(address indexed staker, uint256 amt);
    event Unstaked(address indexed unstaker, uint256 amt);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _;
    }

    function buy(uint256 amt) external payable {
        require(msg.value == amt * tokenPrice, "Incorrect Ether value sent");
        balances[msg.sender] += amt;
        emit Bought(msg.sender, amt);
    }

    function sell(uint256 amt) external {
        require(balances[msg.sender] >= amt, "Not enough tokens to sell");
        require(address(this).balance >= amt * tokenPrice, "Not enough Ether in the contract");

        balances[msg.sender] -= amt;
        payable(msg.sender).transfer(amt * tokenPrice);
        emit Sold(msg.sender, amt);
    }

    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }

    function transfer(address receiver, uint256 amt) external {
        require(balances[msg.sender] >= amt, "Not enough tokens to transfer");
        require(receiver != address(0), "Cannot transfer to the zero address");

        balances[msg.sender] -= amt;
        balances[receiver] += amt;
        emit Transferred(msg.sender, receiver, amt);
    }

    function stake(uint256 amt) external {
        require(balances[msg.sender] >= amt, "Not enough tokens to stake");

        balances[msg.sender] -= amt;
        stakedBalances[msg.sender] += amt;
        emit Staked(msg.sender, amt);
    }

    function unstake(uint256 amt) external {
        require(stakedBalances[msg.sender] >= amt, "Not enough tokens to unstake");

        stakedBalances[msg.sender] -= amt;
        balances[msg.sender] += amt;
        emit Unstaked(msg.sender, amt);
    }

    function getStakedBalance() external view returns (uint256) {
        return stakedBalances[msg.sender];
    }
}
