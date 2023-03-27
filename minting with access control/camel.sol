// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./ERC721r.sol";
import "./allowances.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


error  NotEnoughTokens();
error NotvalidAmount();
error InsufficientEther();

contract CamelNFT is ERC721r, ReentrancyGuard,Allowances,AccessControl {
    uint256 public price = 1 ether;
   
    using SafeERC20 for IERC20;
    IERC20 private ERC20;
    string private PackCurrency;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    constructor() ERC721r("MyToken", "MTK", 27) {
        _setupRole(DEFAULT_ADMIN_ROLE,_msgSender());
        _setupRole(ADMIN_ROLE, _msgSender());
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721r, AccessControl) returns (bool) {
    return ERC721r.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
    }

    
    /**
    * @dev Adds a new currency to the list of available currencies for camel races.
    * @dev The _addCurrency internal function is called to add the currency to the _currencies list along with its corresponding smart contract address.
    */
    function addCurrency(string memory currency, address currencyAddress) external onlyRole(ADMIN_ROLE){
        _addCurrency(currency, currencyAddress);
    }

    /**
    @dev Removes a currency from the list of available currencies for camel races.
    @dev The _removeCurrency internal function is called to remove the currency from the _currencies list.
    */
    function removeCurrency(string memory currency) external onlyRole(ADMIN_ROLE){
        _removeCurrency(currency);
    }
    //update the Pack Currency 
    function UpdatePackCurrency(string memory _packCurrency)external onlyRole(ADMIN_ROLE){
         require(_allowedCurrency(_packCurrency), "Curreny Not Allowed");
        PackCurrency =_packCurrency;
    }

    function Pack_Currency()public view returns(string memory) {
      return PackCurrency;
    }


    
    function setPrice(uint256 _price) public onlyRole(ADMIN_ROLE){
        price=_price;
    }

    function mint(uint256 pack) public  {
        //
        require(_allowedCurrency(Pack_Currency()), "Curreny Not Allowed");
        address tokenAddress=addressCurrency(Pack_Currency());
        if(pack < 0 || pack>10){
            revert NotvalidAmount();
        }
        uint256 nftIdsToMint = pack * 3;
        uint256 amount = nftIdsToMint * price;
        if(IERC20(tokenAddress).balanceOf(msg.sender) < amount){
            revert NotEnoughTokens();
        }
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        _mintRandom(msg.sender, nftIdsToMint);
    }

    function reserve() external  onlyRole(ADMIN_ROLE) {
        for (uint i = 5; i > 0; i--) {
            _mintAtIndex(msg.sender, i - 1);
        }
    }

    function _baseURI()
        internal
        view
        virtual
        override
        onlyRole(ADMIN_ROLE)
        returns (string memory)
    {
        return "ipfs://YOUR_CID/";
    }
}
