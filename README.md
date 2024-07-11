# Assessment Smart Contract

This project contains a smart contract written in Solidity for minting, burning, and transferring tokens. Follow the steps below to set up the project and interact with the contract.

## Prerequisites
- [Hardhat](https://hardhat.org/)
- [MetaMask](https://metamask.io/)

## Setup Instructions

### Step 1: Clone the Repository

Clone the project repository to your local machine:

```sh
git clone <repository-url>
```


### Step 2: Install Dependencies
Open a terminal and run the following command to install the required dependencies:

``` sh
npm install
```

### Step 3: Start the Local Blockchain
Open a new terminal and start the Hardhat local node:

```sh
npx hardhat node
```

After starting the node, you will see a list of generated wallet addresses and private keys. Import one of these accounts into your MetaMask wallet and connect it to the local network.

### Step 4: Deploy the Contract
In another terminal, deploy the smart contract to the local Hardhat network:

```sh

npx hardhat run --network localhost scripts/deploy.js
```

### Step 5: Start the Frontend
In the first terminal, run the following command to start the development server:

```sh
npm run dev
```
**Your site will be locally hosted at:**
```sh
http://localhost:3000/
```
Open this link in your browser to interact with the smart contract.

### Interacting with the Contract
You can use the frontend to perform the following actions:

**Mint Tokens:** Mint new tokens to your account (only contract owner).

**Burn Tokens:** Burn tokens from your account.

**Transfer Tokens:** Transfer tokens to another account.

