
const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("Camel NFT", function () {
  let owner;
  let token;
  let camelNft;
  let minter1;
  let minter2;
  let minter3;
  let minter4;

  it("deployment", async () => {
    [owner, token, camelNft, minter1, minter2, minter3,minter4] =
      await ethers.getSigners();
    expect(owner.address).to.not.equal(undefined);

    //***************************************deploy token***************************************
    const Token = await ethers.getContractFactory("Camel");
    token = await Token.deploy();
    token.deployed();
    expect(token.address).to.not.equal(undefined);

    //***************************************deploy camel***************************************
    const CamelNft = await ethers.getContractFactory("CamelNFT");
    camelNft = await CamelNft.deploy(token.address,"https://camel.com/","2000000000000000000");
    camelNft.deployed();
    expect(camelNft.address).to.not.equal(undefined);
  });
  //***************************************checking Both Contract are deployed***************************************
  it("check contract are Deployed are not", async () => {
    expect(token.address).to.exist;
    expect(camelNft.address).to.exist;
  });
  //***************************************owner checking ***************************************
  it("should set the contract owner correctly", async () => {
    expect(await camelNft.owner()).to.equal(owner.address);
  });
  //***************************************Update the price ***************************************
  it("update the price of the of NFT",async()=>{
    await camelNft.setPrice("1000000000000000000");
    expect(await camelNft.price()).to.equal("1000000000000000000");
  })

  //***************************************check base URI  ***************************************

  it("check base URI", async () => {
    const baseURI = await camelNft.baseURI();
    expect(baseURI).to.equal("https://camel.com/")
  });
   //***************************************update the  base URI  ***************************************
  
  it("should allow the contract owner to update the base URI", async () => {
    const newBaseURI = "https://newcamel.com/";
    await camelNft.setBaseURI(newBaseURI);
    const baseURI = await camelNft.baseURI();
    expect(baseURI).to.equal(newBaseURI);
  });
  //***************************************checking if other user can update the base URI: ***************************************

  it("check other user can update the base URI", async () => {
    const newBaseURI = "https://newexample.com/";
    await expect(camelNft.connect(minter2).setBaseURI(newBaseURI)).to.be.revertedWith("Ownable: caller is not the owner");
  });
 
  //***************************************reserving nft ***************************************
  it("reserve the NFT by owner",async()=>{
    await  camelNft.reserve();
    const balance = await camelNft.balanceOf(owner.address);
    console.log(balance,"nft0");
    //expect(await camelNft.balanceOf(owner.address)).to.equal(5);
  })
 
  //***************************************getting the Tokens from  Token contract ***************************************
  it("Checking the balance of Token owner", async () => {
    // console.log(await token.decimals());
    const balance = await token.balanceOf(owner.address);
    expect(await ethers.utils.formatEther(balance)).to.equal("0.0");
    token.mint(owner.address,ethers.utils.parseEther("50000.0"))
  });
  //***************************************setting token address in camel smart contract ***************************************
  it("setting token address", async () => {
    const set = await camelNft.setTokenAddress(token.address);
  });
   //***************************************checking token address correctly ***************************************
   it("should set the token address correctly", async () => {
    expect(await camelNft.tokenAddress()).to.equal(token.address);
  });

  //***************************************failing minting Nft without having a erc20 token ***************************************
  it("Failing Not enough Token", async () => {
    await expect(
      camelNft
        .connect(minter1)
        .mint(1)
    ).to.be.revertedWithCustomError(camelNft,'NotEnoughTokens');
  });

  //***************************************transfer Tokens from  Token contract ***************************************
  it("transfer the token to other user address", async () => {
    const Transfer = await token.transfer(
      minter1.address,
      ethers.utils.parseEther("10000.0")
    );
    const Transfer2 = await token.transfer(
      minter2.address,
      ethers.utils.parseEther("10000.0")
    );
    const Transfer3 = await token.transfer(
      minter3.address,
      ethers.utils.parseEther("10000.0")
    );
    const Transfer4 = await token.transfer(
      minter4.address,
      ethers.utils.parseEther("10000.0")
    );
    expect(await token.balanceOf(minter1.address)).to.equal(
      ethers.utils.parseEther("10000.0")
    );
    expect(await token.balanceOf(minter2.address)).to.equal(
      ethers.utils.parseEther("10000.0")
    );
    expect(await token.balanceOf(minter3.address)).to.equal(
      ethers.utils.parseEther("10000.0")
    );
  });

 
  // ***************************************Approve camel nft contract for token from  Token contract ***************************************
  it("approving Token ", async () => {
    const approving = token
      .connect(minter1)
      .approve(camelNft.address, ethers.utils.parseEther("1.0"));
    const approving1 = token
      .connect(minter2)
      .approve(camelNft.address, ethers.utils.parseEther("2.0"));
    const approving2 = token
      .connect(minter3)
      .approve(camelNft.address, ethers.utils.parseEther("3.0"));
    const allowance = await token
      .connect(minter1.address)
      .allowance(minter1.address, camelNft.address);
    const allowance1 = await token
      .connect(minter2.address)
      .allowance(minter2.address, camelNft.address);
    const allowance2 = await token
      .connect(minter3.address)
      .allowance(minter3.address, camelNft.address);

      const approving4 = token
      .connect(minter4)
      .approve(camelNft.address, ethers.utils.parseEther("10.0"));
      const allowance4 = await token
      .connect(minter4.address)
      .allowance(minter4.address, camelNft.address);
      
    expect(allowance).to.equal(ethers.utils.parseEther("1.0"));
    expect(allowance1).to.equal(ethers.utils.parseEther("2.0"));
    expect(allowance2).to.equal(ethers.utils.parseEther("3.0"));
  });
  //***************************************minting more NFTS then allowed ***************************************
  it("exceed amount NFT", async () => {
    await expect(
      camelNft
        .connect(minter1)
        .mint(11)
    ).to.be.revertedWithCustomError(camelNft,"NotvalidAmount");
  });
   // ***************************************minting NFTS with zero amount NFT ***************************************
   it("mint with less token",async()=>{
    await expect(camelNft.connect(minter1).mint(0)).to.be.revertedWithCustomError(camelNft,"NotvalidAmount");
  })
 
  //***************************************minting NFTS ***************************************
  it("minting NFT minter 1", async () => {
    const minting = await camelNft
      .connect(minter1)
      .mint(1);
    console.log("getting the ids minter 1:",await camelNft.connect(minter1).getUserTokenIDS(minter1.address));
    const balance = await token.balanceOf(minter1.address);
    expect(await ethers.utils.formatEther(balance)).to.equal("9999.0");
    expect(await camelNft.balanceOf(minter1.address)).to.equal(3);
  });
  it("minting NFT minter 2", async () => {
    const minting = await camelNft
      .connect(minter2)
      .mint(2);
      console.log("getting the ids minter 2:",await camelNft.connect(minter2).getUserTokenIDS(minter2.address));
    const balance = await token.balanceOf(minter2.address);
     expect(await ethers.utils.formatEther(balance)).to.equal("9998.0");
    expect(await camelNft.balanceOf(minter2.address)).to.equal(6);
  });
  it("minting NFT minter 3", async () => {
    const minting = await camelNft
      .connect(minter3)
      .mint(3);
      console.log("getting the ids minter 3:",await camelNft.connect(minter3).getUserTokenIDS(minter3.address));

    const balance = await token.balanceOf(minter3.address);
     expect(await ethers.utils.formatEther(balance)).to.equal("9997.0");
     expect(await camelNft.balanceOf(minter3.address)).to.equal(9);
  });
   //***************************************minting NFTS with amount that user donot give allowance  ***************************************
   it("Mint with more amount",async()=>{
    await expect(camelNft.connect(minter1).mint(1)).to.be.revertedWithCustomError(camelNft,"NotEnoughAllowance");
  })


    //***************************************total supply and max supply checking NFTS ***************************************
    it("supply of NFT",async ()=>{
      const nft=await camelNft.totalSupply();
      const nft1=await camelNft.maxSupply();
      console.log(nft,"total Supply");
      console.log(nft1,"max Supply");
    })
     //***************************************Approve less Tokens from  Token contract & mint NFT ***************************************
  it("Fail minting NFT", async () => {
    await token
      .connect(minter1)
      .approve(camelNft.address, ethers.utils.parseEther("3.0"));
    

    await expect(
      camelNft
        .connect(minter1)
        .mint(10)
    ).to.be.revertedWithCustomError(camelNft,'NotEnoughAllowance');
    

  });

    //***************************************total supply and max supply checking NFTS ***************************************
    it("minting more token in one transaction", async () => {
      const approving = token
      .connect(minter1)
      .approve(camelNft.address, ethers.utils.parseEther("33.0"));
      const allowance = await token
      .connect(minter1.address)
      .allowance(minter1.address, camelNft.address);
      await expect(camelNft
        .connect(minter1)
        .mint(11)).to.be.revertedWithCustomError(camelNft,'NotvalidAmount');  
    });
    
    //***************************************With Draw amount ***************************************
    it("withdraw amount",async()=>{
      console.log("before withdraw",await token.balanceOf(owner.address));
      const withdraw= await camelNft.withdraw();
      console.log("after withdraw",await token.balanceOf(owner.address));

    })

    //***************************************Max supply ***************************************
    it("max supply",async()=>{
      //console.log("before withdraw",await camelNft.maxSupply(3));
      const withdraw= await camelNft.maxSupply();
      console.log("supply",withdraw);
      const update= await camelNft.updateMaxSupply(15);
      const total=await camelNft.totalSupply();
      console.log("totalsupply",total);
      const withdraw1= await camelNft.maxSupply();
      console.log("supply1",withdraw1);
      

    })
    it("minting NFT minter 1", async () => {
      const approving = token
      .connect(minter1)
      .approve(camelNft.address, ethers.utils.parseEther("2.0"));
      const minting = await camelNft
        .connect(minter1)
        .mint(2);
      const balance = await token.balanceOf(minter1.address);
      // expect(await ethers.utils.formatEther(balance)).to.equal("9999.0");
      expect(await camelNft.balanceOf(minter1.address)).to.equal(9);
      console.log("getting the ids minter 1:",await camelNft.connect(minter1).getUserTokenIDS(minter1.address));
    });
    it("minting NFT minter 1", async () => {
      const approving = token
      .connect(minter1)
      .approve(camelNft.address, ethers.utils.parseEther("2.0"));
      const minting = await camelNft
        .connect(minter1)
        .mint(2);
      const balance = await token.balanceOf(minter1.address);
      // expect(await ethers.utils.formatEther(balance)).to.equal("9999.0");
      expect(await camelNft.balanceOf(minter1.address)).to.equal(15);
      console.log("getting the ids minter 1:",await camelNft.connect(minter1).getUserTokenIDS(minter1.address));
    });
    it("minting NFT minter 1", async () => {
      const approving = token
      .connect(minter1)
      .approve(camelNft.address, ethers.utils.parseEther("2.0"));
      const minting = await camelNft
        .connect(minter1)
        .mint(1);
      const balance = await token.balanceOf(minter1.address);
      // expect(await ethers.utils.formatEther(balance)).to.equal("9999.0");
      expect(await camelNft.balanceOf(minter1.address)).to.equal(18);
      console.log("getting the ids minter 1:",await camelNft.connect(minter1).getUserTokenIDS(minter1.address));
    });
    
    it("max supply",async()=>{
      //console.log("before withdraw",await camelNft.maxSupply(3));
      const withdraw= await camelNft.maxSupply();
      console.log("supply",withdraw);
      const update= await camelNft.updateMaxSupply(15);
      const total=await camelNft.totalSupply();
      console.log("totalsupply",total);
      const withdraw1= await camelNft.maxSupply();
      console.log("supply1",withdraw1);
      

    })
    it("minting NFT minter 4", async () => {
      const approving = token
      .connect(minter4)
      .approve(camelNft.address, ethers.utils.parseEther("6.0"));
      const minting = await camelNft
        .connect(minter4)
        .mint(3);
      const balance = await token.balanceOf(minter1.address);
      // expect(await ethers.utils.formatEther(balance)).to.equal("9999.0");
      // expect(await camelNft.balanceOf(minter1.address)).to.equal(18);
      console.log("getting the ids minter 1:",await camelNft.connect(minter4).getUserTokenIDS(minter4.address));
    });
  // //***************************************Approving NFTS ***************************************
  // it("burn nfts",async()=>{
  //   // const approve= await camelNft.connect(minter1).approve(owner.address,);
  //   console .log("balance",await camelNft.balanceOf(minter1.address));
  //   // expect(await camelNft.balanceOf(minter1.address)).to.equal(2);
  //   //  const burn=await camelNft.connect(minter1).burn(27);
  //   //  const burn1=await camelNft.connect(minter1).burn(26);
  //   //  const burn2=await camelNft.connect(minter1).burn(22);
  //   //  const burn3=await camelNft.connect(minter1).burn(23);
  //   //  const burn4=await camelNft.connect(minter1).burn(21);
  //   //  const burn5=await camelNft.connect(minter1).burn(19);
  //   //  const burn6=await camelNft.connect(minter1).burn(18);
  //   //  const burn7=await camelNft.connect(minter1).burn(17);
  //   //  const burn8=await camelNft.connect(minter1).burn(16);
  //   //  console.log(burn,"burn");
  //   //  console.log(burn1,"burn");
  //   //  console.log(burn2,"burn");
  //   //  console.log(burn3,"burn");
  //   //  console.log(burn4,"burn");
  //   //  console.log(burn5,"burn");
  //   //  console.log(burn6,"burn");
  //   //  console.log(burn7,"burn");
  //   //  expect(await camelNft.balanceOf(minter1.address)).to.equal(9);

  // })
});
