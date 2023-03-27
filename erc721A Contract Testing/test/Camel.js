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
  let admin_Minter;

  it("deployment", async () => {
    [owner, token, camelNft, minter1, minter2, minter3, minter4, admin_Minter] =
      await ethers.getSigners();
    expect(owner.address).to.not.equal(undefined);

    //***************************************deploy token***************************************
    const Token = await ethers.getContractFactory("Camel");
    token = await Token.deploy();
    token.deployed();
    expect(token.address).to.not.equal(undefined);

    //***************************************deploy camel***************************************
    const CamelNft = await ethers.getContractFactory("CamelNFT");
    camelNft = await CamelNft.deploy("0x54C57ddb5F94Bd850CD8F797a7b318dE53311E93", "https://camel.com/", "2000000000000000000", 10000, 100);
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
    const admin = await camelNft.ADMIN_ROLE();

    expect(await camelNft.hasRole(admin, owner.address)).to.equal(true);
  });
  //***************************************Update the price ***************************************
  it("update the price of the of NFT", async () => {
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
    await expect(camelNft.connect(minter2).setBaseURI(newBaseURI)).to.be.revertedWith("AccessControl: account 0x15d34aaf54267db7d7c367839aaf71a00a2c6a65 is missing role 0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775");
  });

  //***************************************set the reserving nft ***************************************
  it("set the reserve NFT by owner", async () => {
    const reserve = await camelNft.reserveQuantity();
    expect(await camelNft.reserveQuantity()).to.equal(100);
    const setreserve = await camelNft.setreserve(200);
    expect(await camelNft.reserveQuantity()).to.equal(200);
    // expect(await camelNft.balanceOf(owner.address)).to.equal(5);
  })
  it("reserve the NFTS", async () => {
    const reserve = await camelNft.reserve(200);
    expect(await camelNft.balanceOf(owner.address)).to.equal(200);
  })



  //***************************************getting the Tokens from  Token contract ***************************************
  it("Checking the balance of Token owner", async () => {
    // console.log(await token.decimals());
    const balance = await token.balanceOf(owner.address);
    expect(await ethers.utils.formatEther(balance)).to.equal("0.0");
    token.mint(owner.address, ethers.utils.parseEther("50000.0"));
  });
  //***************************************setting token address in camel smart contract ***************************************
  it("setting token address", async () => {
    const firsttoken = await camelNft.tokenAddress();
    // console.log(firsttoken,"token");
    await camelNft.setTokenAddress(token.address);
    // const token1=await camelNft.tokenAddress();
    // console.log(token1,"token");
  });
  //***************************************checking token address correctly ***************************************
  it("should set the token address correctly", async () => {
    expect(await camelNft.tokenAddress()).to.equal(token.address);
  });

  //***************************************checking Admin Mint ***************************************
  it("checking  Admin mint", async () => {
    const minter = await camelNft.MINTER_ROLE();
    expect(await camelNft.hasRole(minter, admin_Minter.address)).to.equal(false);
  })
  it("seting Admin mint Role", async () => {
    const minter = await camelNft.MINTER_ROLE();
    await camelNft.grantRole(minter, admin_Minter.address);
    expect(await camelNft.hasRole(minter, admin_Minter.address)).to.equal(true);
  })
  //***************************************Admin Mint failing ***************************************
  it("mintAdmin for user by wrong user", async () => {
    await expect(camelNft.connect(minter1).adminMint(1, minter3.address)).to.be.revertedWith
      ("AccessControl: account 0x90f79bf6eb2c4f870365e785982e1f101e93b906 is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6");
  });


  //***************************************Admin Mint ***************************************
  it("mintAdmin for  user by AdminMint", async () => {
    const mint = await camelNft.connect(admin_Minter).adminMint(1, minter3.address);
    expect(await camelNft.balanceOf(minter3.address)).to.equal(3);
  })

  //***************************************failing minting Nft without having a erc20 token ***************************************
  it("Failing Not enough Token", async () => {
    await expect(
      camelNft
        .connect(minter1)
        .mint(1)
    ).to.be.revertedWithCustomError(camelNft, 'NotEnoughTokens');
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
    ).to.be.revertedWithCustomError(camelNft, "NotvalidAmount");
  });
  // ***************************************minting NFTS with zero amount NFT ***************************************
  it("mint with less token", async () => {
    await expect(camelNft.connect(minter1).mint(0)).to.be.revertedWithCustomError(camelNft, "NotvalidAmount");
  })

  //***************************************minting NFTS ***************************************
  it("minting NFT minter 1", async () => {
    const minting = await camelNft
      .connect(minter1)
      .mint(1);
    const balance = await token.balanceOf(minter1.address);
    expect(await ethers.utils.formatEther(balance)).to.equal("9999.0");
    expect(await camelNft.balanceOf(minter1.address)).to.equal(3);
  });
  it("minting NFT minter 2", async () => {
    const minting = await camelNft
      .connect(minter2)
      .mint(2);
    const balance = await token.balanceOf(minter2.address);
    expect(await ethers.utils.formatEther(balance)).to.equal("9998.0");
    expect(await camelNft.balanceOf(minter2.address)).to.equal(6);
  });
  it("minting NFT minter 3", async () => {
    const minting = await camelNft
      .connect(minter3)
      .mint(3);
    const balance = await token.balanceOf(minter3.address);
    expect(await ethers.utils.formatEther(balance)).to.equal("9997.0");
    //12 because adimminter also mint 3nft on that address
    expect(await camelNft.balanceOf(minter3.address)).to.equal(12);
  });
  //***************************************minting NFTS with amount that user donot give allowance  ***************************************
  it("Mint with more amount", async () => {
    await expect(camelNft.connect(minter1).mint(1)).to.be.revertedWithCustomError(camelNft, "NotEnoughAllowance");
  })


  //***************************************total supply and max supply checking NFTS ***************************************
  it("supply of NFT", async () => {
    const nft = await camelNft.totalSupply();
    const nft1 = await camelNft.Max_Supply();
    console.log(nft, "total Supply");
    console.log(nft1, "max Supply");
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
    ).to.be.revertedWithCustomError(camelNft, 'NotEnoughAllowance');


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
      .mint(11)).to.be.revertedWithCustomError(camelNft, 'NotvalidAmount');
  });

  //***************************************Failing With Draw  amount ***************************************

  it("should fail to withdraw if called by a non-owner account", async () => {

    await expect(camelNft.connect(minter1).withdraw()).to.be.revertedWith('AccessControl: account 0x90f79bf6eb2c4f870365e785982e1f101e93b906 is missing role 0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775');
  });

  //***************************************With Draw amount ***************************************
  it("withdraw amount", async () => {
    console.log("before withdraw", await token.balanceOf(owner.address));
    const withdraw = await camelNft.withdraw();
    console.log("after withdraw", await token.balanceOf(owner.address));

  })

  //***************************************Max supply ***************************************
  it("max supply", async () => {
    // console.log("before withdraw",await camelNft.setMaxSupply(3));
    const supply = await camelNft.Max_Supply();
    console.log("Maxsupply", supply);
    const update = await camelNft.setMaxSupply(1500);
    const total = await camelNft.totalSupply();
    console.log("totalsupply", total);
    const supply1 = await camelNft.Max_Supply();
    console.log("maxsupply2", supply1);


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
  });
  it("minting NFT minter 1", async () => {
    const approving = token
      .connect(minter1)
      .approve(camelNft.address, ethers.utils.parseEther("2.0"));
    const minting = await camelNft
      .connect(minter1)
      .mint(1);
    const balance = await token.balanceOf(minter1.address);
    expect(await ethers.utils.formatEther(balance)).to.equal("9994.0");
    expect(await camelNft.balanceOf(minter1.address)).to.equal(18);
  });

  it("minting NFT minter 4", async () => {
    const approving = token
      .connect(minter4)
      .approve(camelNft.address, ethers.utils.parseEther("6.0"));
    const minting = await camelNft
      .connect(minter4)
      .mint(3);
    const balance = await token.balanceOf(minter1.address);
    expect(await ethers.utils.formatEther(balance)).to.equal("9994.0");
    expect(await camelNft.balanceOf(minter4.address)).to.equal(9);
    // console.log(await camelNft.balanceOf(minter3.address),"balance"); to check the test  of burn function
  });
  //***************************************Approving NFTS ***************************************
  it("should allow the contract owner to burn the token", async () => {
    const tokenId = 201;
    await camelNft.burn(tokenId);
    expect(await camelNft.balanceOf(minter3.address)).to.equal(11);
    expect(await camelNft.totalSupply()).to.equal(244);

  });
  it("should allow the NFT owner to burn the token", async () => {
    const tokenId = 200;
    await camelNft.connect(minter3).burn(tokenId);
    expect(await camelNft.balanceOf(minter3.address)).to.equal(10);
    expect(await camelNft.totalSupply()).to.equal(243);

  });

  it("should not allow the admin to burn the token", async () => {
    const tokenId = 202;
    await expect(camelNft.connect(admin_Minter).burn(tokenId)).to.be.revertedWith("notOwner");
    expect(await camelNft.balanceOf(minter3.address)).to.equal(10);
    expect(await camelNft.totalSupply()).to.equal(243);
  });

  it("should not allow a non-owner and non-admin to burn the token", async () => {
    const tokenId = 202;
    await expect(camelNft.connect(minter1).burn(tokenId)).to.be.revertedWith("notOwner");
    expect(await camelNft.balanceOf(minter3.address)).to.equal(10);
    expect(await camelNft.totalSupply()).to.equal(243);
  });

});
