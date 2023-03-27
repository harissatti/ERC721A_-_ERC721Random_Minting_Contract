// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
error  NotEnoughTokens();
error NotvalidAmount();
error NotEnoughAllowance();
error NotAdminMinter();
contract CamelNFT is ERC721A,ReentrancyGuard,AccessControl{
    uint256 public price;
    address public tokenAddress;
    string  public baseURI;
    uint256 public Max_Supply ;
    uint256 public reserveQuantity;
    uint256 public burnCounter;
    //Access
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    event withdrawTokens(uint amount, address indexed owner);
    event TokenAddress(address indexed oldAddress, address indexed newAddress);
    event SetPrice(uint indexed oldPrice, uint indexed newPrice);
    constructor(address _tokenAddress,string memory baseUri,uint _price,uint _Max_Supply,uint256 _reserveQuantity) ERC721A("Al-Hejin","ALH") {
         baseURI= baseUri;
         tokenAddress=_tokenAddress;
         price= _price;
         Max_Supply=_Max_Supply;
         reserveQuantity=_reserveQuantity;
         _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
         _setupRole(ADMIN_ROLE, _msgSender());
         _grantRole(MINTER_ROLE, _msgSender());
    }
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721A, AccessControl) returns (bool){
        return super.supportsInterface(interfaceId);
    }
    function setTokenAddress(address  _tokenAddress) public onlyRole(ADMIN_ROLE) {
        address oldAddress = tokenAddress;
        tokenAddress = _tokenAddress;
        emit TokenAddress(oldAddress, tokenAddress);
    }
    function setMaxSupply(uint256 _maxSupply) public onlyRole(ADMIN_ROLE) {
        Max_Supply = _maxSupply;
    }
    function setPrice(uint256 _price) public onlyRole(ADMIN_ROLE){
        uint oldprice=price;
        price=_price;
        emit SetPrice(oldprice,price);
    }
     function setBaseURI(string memory baseuri) public onlyRole(ADMIN_ROLE) {
        baseURI = baseuri;
    }
    function setreserve(uint256 quantity) public onlyRole(ADMIN_ROLE) {
        reserveQuantity=quantity;
    }
    function _baseURI()internal view override  returns (string memory){
        return baseURI;
    }
    function reserve(uint256 quantity) public onlyRole(ADMIN_ROLE) {
        require(quantity <= reserveQuantity, "the quantity exceeds reserve");
        require(totalSupply() + quantity <= Max_Supply, "Not enough tokens left");
        reserveQuantity -= quantity;
        _safeMint(msg.sender, quantity);
    }
    function adminMint(uint256 pack,address to) public onlyRole(MINTER_ROLE){
         if(pack <= 0 || pack>10){
            revert NotvalidAmount();
        }
         uint256 nftIdsToMint = pack * 3;
         require(totalSupply() + nftIdsToMint <= Max_Supply, "Not enough tokens left");
         _safeMint(to,nftIdsToMint);
    }
    function mint(uint256 pack) public{
        if(pack <= 0 || pack>10){
            revert NotvalidAmount();
        }
        uint256 nftIdsToMint = pack * 3;
        uint256 amount = pack * price;
        require(totalSupply() + nftIdsToMint <= Max_Supply, "Not enough tokens left");
        if(IERC20(tokenAddress).balanceOf(msg.sender) < amount){
            revert NotEnoughTokens();
        }
        if(IERC20(tokenAddress).allowance(msg.sender, address(this)) < amount)
        {
            revert NotEnoughAllowance();
        }
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        _mint(msg.sender,nftIdsToMint );
    }
   function burn(uint256 tokenId) public  {
       
       require(hasRole(ADMIN_ROLE, msg.sender) || msg.sender == ownerOf(tokenId), "notOwner");
        _burn(tokenId);
         burnCounter++;
        }
    function withdraw() onlyRole(ADMIN_ROLE) nonReentrant public{
        uint _amount = IERC20(tokenAddress).balanceOf(address(this));
        IERC20(tokenAddress).transfer(msg.sender, _amount);
        emit withdrawTokens(_amount, msg.sender);
    }
}