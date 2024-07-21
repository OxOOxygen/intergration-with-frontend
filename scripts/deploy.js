// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");

async function main() {
    const Assessment = await ethers.getContractFactory("Assessment");
    const assessment = await Assessment.deploy();
    await assessment.deployed();
    
    console.log("Assessment contract deployed to:", assessment.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


