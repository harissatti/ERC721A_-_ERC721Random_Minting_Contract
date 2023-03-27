import React, {useState} from "react";
import {RandomMintNft} from './data';
import "./rand.css";

// import axios from 'axios';


const Web3 = require("web3");


const  RandomMint= ({ web3Obj, userInfo }) => {
  const [pack,setPack]=useState("");
  const [tokencontractAddress,setTokenContractAddress]=useState("");
  const [price,setPrice]=useState("");
  const [base_uri,setBase_uri]=useState("");
  const [tokenUri,setTokenUri]=useState("");
  const [nft,setNft]=useState("");
  const [userAddress,setUserAddress]=useState("");
  const [supply,setSupply]=useState("");

  //nftmint work

const PackValue=(e)=>{
  setPack(e.target.value);
}

const ContractAddressValue=(e)=>{
  setTokenContractAddress(e.target.value);
}

const PriceValue=(e)=>{
  setPrice(e.target.value);
}

const BaseuriValue=(e)=>{
  setBase_uri(e.target.value);
}
 const supplyValue=(e)=>{
  setSupply(e.target.value);
 }


const TokenUriValue=(e)=>{
  setTokenUri(e.target.value);
}

const NftValue=(e)=>{
  setNft(e.target.value);
}

const UserID=(e)=>{
  setUserAddress(e.target.value);
}


 
  //seting erc20 contract address in random nft
  const OnContractAddress=async(e)=>{
    e.preventDefault();
    var methods=new web3Obj.eth.Contract(RandomMintNft.ABI,RandomMintNft.contractAddress);
    const contractAddress=await methods.methods.setTokenAddress(tokencontractAddress).send({
      from:userInfo.account,
    });
    console.log(tokencontractAddress,"newcontractAddress");
  }

  //seting price of contract Address
  const OnPrice=async(e)=>{
    e.preventDefault();
    var methods=new web3Obj.eth.Contract(RandomMintNft.ABI,RandomMintNft.contractAddress);
    const  newprice=await methods.methods.setPrice(price).send({
      from:userInfo.account,
    })
  }
//seting BaseUri
  const OnBaseuri=async(e)=>{
    e.preventDefault();
    var methods=new web3Obj.eth.Contract(RandomMintNft.ABI,RandomMintNft.contractAddress);
    const  newprice=await methods.methods.setBaseURI(base_uri).send({
      from:userInfo.account,
    })
  }


 const OnupdateMaxSupply =async(e)=>{
  e.preventDefault();
  var methods=new web3Obj.eth.Contract(RandomMintNft.ABI,RandomMintNft.contractAddress);
  const  newprice=await methods.methods.updateMaxSupply(supply).send({
    from:userInfo.account,
  })
}

const OnMaxSupply =async(e)=>{
  e.preventDefault();
  var methods=new web3Obj.eth.Contract(RandomMintNft.ABI,RandomMintNft.contractAddress);
  const  newprice=await methods.methods.maxSupply().call();
  window.alert(newprice,"maxSupply");
}


//checking owner
  const OnOwner=async(e)=>{
    e.preventDefault();
    var methods=new web3Obj.eth.Contract(RandomMintNft.ABI,RandomMintNft.contractAddress);
    const owner=await methods.methods.owner().call();
    console.log(owner,"owner");
    window.alert(owner);

  }
 //reserve the nft
  const OnReserve=async(e)=>{
    e.preventDefault();
    var methods=new web3Obj.eth.Contract(RandomMintNft.ABI,RandomMintNft.contractAddress);
    const reserve= await methods.methods.reserve().send({
          from:userInfo.account,
        });
  } 

  //minting the NFT
  const OnMint=async(e)=>{
    e.preventDefault();
    var methods= new web3Obj.eth.Contract(RandomMintNft.ABI,RandomMintNft.contractAddress);
    const mint =await methods.methods.mint(pack).send({
      from:userInfo.account,
    });
  }

  //getting Token Uri
  const OnTokenUri=async(e)=>{
    e.preventDefault();
    var methods= new web3Obj.eth.Contract(RandomMintNft.ABI,RandomMintNft.contractAddress);
    const tokenURI=await methods.methods.tokenURI(tokenUri).call();
    console.log(tokenURI,"token URI");
    window.alert(tokenURI);

  }

  const OnBurn=async(e)=>{
    e.preventDefault();
    var methods= new web3Obj.eth.Contract(RandomMintNft.ABI,RandomMintNft.contractAddress);
    const burnToken=await methods.methods.burn(nft).send({
      from:userInfo.account,
    });
    console.log(burnToken,"burn");
  }

  const OnWithDraw=async(e)=>{
    e.preventDefault();
    var methods= new web3Obj.eth.Contract(RandomMintNft.ABI,RandomMintNft.contractAddress);
    const withdraw=await methods.methods.withdraw().send({
      from:userInfo.account,
    });
    console.log(withdraw,"Withdraw");
  }
  const OnGetIds=async(e)=>{
    e.preventDefault();
    var methods= new web3Obj.eth.Contract(RandomMintNft.ABI,RandomMintNft.contractAddress);
    const getid=await methods.methods.getUserTokenIDS(userAddress).call();
    console.log("getid",getid);
    window.alert(getid);
    setUserAddress("");

  }

  const OnGetBalance=async(e)=>{
    e.preventDefault();
    var methods= new web3Obj.eth.Contract(RandomMintNft.ABI,RandomMintNft.contractAddress);
    const getBalance=await methods.methods.balanceOf(userAddress).call();
    console.log("getBalance",getBalance);
    setUserAddress("");

  }

  return (
    <>
    <h3>Camel Random Minting contract calls</h3>
    
    <button className="marginTop" onClick={OnReserve}>Reserve </button>
    <button className="marginTop" onClick={OnOwner}>owner </button>
     {/* **********seting token Address*************** */}
    <form className="marginTop" onSubmit={OnContractAddress}>
        <div className="app-details">
          <h5>set Token Address</h5>
          <label htmlFor="tokenAddress">Token Address</label>
          <input type="text" value={tokencontractAddress} onChange={ContractAddressValue} />
          <br />
          </div>
        <button className="marginTop">Set</button>
      </form> 
      {/* **********Set Price*************** */}


      <form className="marginTop" onSubmit={OnPrice}>
        <div className="app-details">
          <h5>set Price </h5>
          <label htmlFor="tokenAddress">Price</label>
          <input type="text" value={price} onChange={PriceValue} />
          <br />
          </div>
        <button className="marginTop">Set</button>
      </form> 

           {/* **********SetBase Uri*************** */}
      <form className="marginTop" onSubmit={OnBaseuri}>
        <div className="app-details">
          <h5>set Base URI </h5>
          <label htmlFor="BaseUri">Baseuri</label>
          <input type="text" value={base_uri} onChange={BaseuriValue} />
          <br />
          </div>
        <button className="marginTop">Set</button>
      </form> 

         {/* **********SetMax Supply*************** */}
        
         <form className="marginTop" onSubmit={OnupdateMaxSupply}>
        <div className="app-details">
          <h5>set MaxSupply </h5>
          <label htmlFor="BaseUri">MaxSupply</label>
          <input type="text" value={supply} onChange={supplyValue} />
          <br />
          </div>
        <button className="marginTop">Set</button>
      </form> 

      <form className="marginTop" onSubmit={OnMaxSupply}>
      <div className="app-details">
        <h5>MaxSupply</h5>
      </div>
      <button className="marginTop">MaxSupply</button>
    </form>


       {/* **********minting*************** */}

      <form className="marginTop" onSubmit={OnMint}>
        <div className="app-details">
          <h5>mint</h5>
          <label htmlFor="mint">Pack</label>
          <input type="text" value={pack} onChange={PackValue} />
          <br />
          </div>
        <button className="marginTop">Mint</button>
      </form> 

       {/* **********TokenUri*************** */}

    <form className="marginTop" onSubmit={OnTokenUri}>
      <div className="app-details">
        <h5>Token Base Uri</h5>
        <label htmlFor="base Uri"> Token Base Uri</label>
        <input type="text" value={tokenUri} onChange={TokenUriValue}/>
        <br/>
      </div>
      <button className="marginTop">Get Token BaseUri</button>
    </form>

     {/* **********Burn*************** */}
    <form className="marginTop" onSubmit={OnBurn}>
      <div className="app-details">
        <h5>Token  Burn</h5>
        <label htmlFor="base Uri"> Burn</label>
        <input type="text" value={nft} onChange={NftValue}/>
        <br/>
      </div>
      <button className="marginTop">Burn</button>
    </form>
     {/* **********GET Nfts By user IDS*************** */}
     <form className="marginTop" onSubmit={OnGetIds}>
      <div className="app-details">
        <h5>get Nft By user IDS</h5>
        <label htmlFor="user ID"> User Address</label>
        <input type="text" value={userAddress} onChange={UserID}/>
      </div>
      <button className="marginTop">get IDS</button>
    </form>
     {/* **********geting balance of*************** */}
     <form className="marginTop" onSubmit={OnGetBalance}>
      <div className="app-details">
        <h5>get User Balance</h5>
        <label htmlFor="user ID"> User Address</label>
        <input type="text" value={userAddress} onChange={UserID}/>
      </div>
      <button className="marginTop">get Balance</button>
    </form>
    {/* **********WithDraw*************** */}
    <form className="marginTop" onSubmit={OnWithDraw}>
      <div className="app-details">
        <h5>With_Draw</h5>
      </div>
      <button className="marginTop">WithDraw</button>
    </form>

    
    
    </>
  )
}
export default RandomMint;