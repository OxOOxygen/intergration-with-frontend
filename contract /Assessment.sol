 // SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address public owner;
    mapping(address => uint256) public balances;

    event Minted(address indexed account, uint256 amt);
    event Burned(address indexed account, uint256 amt);
    event Transferred(address indexed sender, address indexed receiver, uint256 amt);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _;
    }

    function mint(uint256 amt) external onlyOwner payable {
        require(amt > 0, "Amount to mint must be greater than 0");
        balances[msg.sender] += amt;
        emit Minted(msg.sender, amt);
    }

    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }

    function burn(uint256 amt) external {
        require(balances[msg.sender] >= amt, "Not enough tokens to burn");
        balances[msg.sender] -= amt;
        emit Burned(msg.sender, amt);
    }

    function transfer(address receiver, uint256 amt) external {
        require(balances[msg.sender] >= amt, "Not enough tokens to transfer");
        require(receiver != address(0), "Cannot transfer to the zero address");

        balances[msg.sender] -= amt;
        balances[receiver] += amt;
        emit Transferred(msg.sender, receiver, amt);
    }
}
