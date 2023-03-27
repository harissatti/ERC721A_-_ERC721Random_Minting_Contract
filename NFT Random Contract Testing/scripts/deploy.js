
const hre =require("hardhat");
const { TASK_COMPILE_SOLIDITY_LOG_NOTHING_TO_COMPILE } = require("hardhat/builtin-tasks/task-names");

async function main() {
 //Get contract Factory 
 const Camel=await hre.ethers.getContractFactory("Camel");
 const CamelNFT=await hre.ethers.getContractFactory("CamelNFT");
 //deploy the Contract

 const camel=await Camel.deploy();
 await camel.deployed();
 const camelNFT= await CamelNFT.deploy(camel.address,"https://camel.com/","2000000000000000000");
 

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

//camelNFT deployed to 0xC0fcA4cd4E4c0A59DFb48e5A4cF6D929c39d08f7
//Aura deployed to 0xD1eaabD98Acff1166BE2Fb571394E47ff42Cb27a
//https://testnet.bscscan.com/address/0xC0fcA4cd4E4c0A59DFb48e5A4cF6D929c39d08f7#code
// camel Token
//https://testnet.bscscan.com/address/0xD1eaabD98Acff1166BE2Fb571394E47ff42Cb27a#code