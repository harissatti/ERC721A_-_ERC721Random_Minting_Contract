
const hre =require("hardhat");
const { TASK_COMPILE_SOLIDITY_LOG_NOTHING_TO_COMPILE } = require("hardhat/builtin-tasks/task-names");

async function main() {
 //Get contract Factory 
 const Camel=await hre.ethers.getContractFactory("Camel");
 const CamelNFT=await hre.ethers.getContractFactory("CamelNFT");
 //deploy the Contract

 const camel=await Camel.deploy();
 await camel.deployed();
 const camelNFT= await CamelNFT.deploy("0x37e3509E62CDD84e759656aa984D1d2bdb959181","https://camel.com/","2000000000000000000",10000,100);
 

 //wait for contract to be mined
 await camelNFT.deployed();

 
 
  
 
  

 //print the contract address to console
 
 console.log("camelNFT deployed to",camelNFT.address);   
 console.log("Camel token deployed to",camel.address);           

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//camelNFT deployed to 0x61BF2A16932Bc0cB7378F2648eaCCDe5680Ac96f
//Camel token deployed to 0x37e3509E62CDD84e759656aa984D1d2bdb959181
//nft
//https://testnet.bscscan.com/address/0xFd31957ec7f8923eA865E9a04f4Fe8B054f2175a#code
// camel Token
//https://testnet.bscscan.com/address/0x54C57ddb5F94Bd850CD8F797a7b318dE53311E93#code