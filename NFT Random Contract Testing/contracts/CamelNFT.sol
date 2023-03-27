// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ERC721r.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error  NotEnoughTokens();
error NotvalidAmount();
error NotEnoughAllowance();
contract CamelNFT is ERC721r, ReentrancyGuard {
    uint256 public price;
    address public tokenAddress;
     string  public baseURI;
     
    event withdrawTokens(uint amount, address indexed owner);
    event TokenAddress(address indexed oldAddress, address indexed newAddress);
    event SetPrice(uint indexed oldPrice, uint indexed newPrice);

    constructor(address _tokenAddress,string memory baseUri,uint _price) ERC721r("Al-Hejin","ALH",24){
     baseURI= baseUri;
     tokenAddress=_tokenAddress;
     price= _price;
    }
    function setTokenAddress(address  _tokenAddress) public onlyOwner {
         address oldAddress = tokenAddress;
        tokenAddress = _tokenAddress;
        emit TokenAddress(oldAddress, tokenAddress);
    }
    function setPrice(uint256 _price) public onlyOwner{
        uint oldprice=price;
        price=_price;
        emit SetPrice(oldprice,price);
    }
     function setBaseURI(string memory baseuri) public onlyOwner {
        baseURI = baseuri;
    }
   
    function mint(uint256 pack) public{
        if(pack <= 0 || pack>10){
            revert NotvalidAmount();
        }
        uint256 nftIdsToMint = pack * 3;
        uint256 amount = pack * price;
        if(IERC20(tokenAddress).balanceOf(msg.sender) < amount){
            revert NotEnoughTokens();
        }
        if(IERC20(tokenAddress).allowance(msg.sender, address(this)) < amount)
        {
            revert NotEnoughAllowance();
        }
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        _mintRandom(msg.sender, nftIdsToMint);
    }
    
    function reserve() onlyOwner external{
        for(uint i=5; i>0;i--){
            _mintAtIndex(msg.sender,i-1);
        }
    }   
    
    
     function _baseURI()internal view override  returns (string memory){
        return baseURI;
    }
   
    function withdraw() onlyOwner nonReentrant public{
        uint _amount = IERC20(tokenAddress).balanceOf(address(this));
        IERC20(tokenAddress).transfer(msg.sender, _amount);
        emit withdrawTokens(_amount, msg.sender);
    }
}