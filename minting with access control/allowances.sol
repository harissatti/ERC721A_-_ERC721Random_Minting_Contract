// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Allowances {

    using EnumerableSet for EnumerableSet.Bytes32Set;

    mapping(bytes32 => address) private _tokenAllowed;
    mapping(bytes32 => address) private _currencyAllowed;

    EnumerableSet.Bytes32Set private _totalTokens;
    EnumerableSet.Bytes32Set private _totalCurrencies;

    function stringToBytes32(string memory source) internal pure returns (bytes32 result) {
      bytes memory tempEmptyStringTest = bytes(source);
      if (tempEmptyStringTest.length == 0) {
          return 0x0;
    }
      assembly {
        result := mload(add(source, 32))
    }
    }

    function bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    /**
    @dev Add a contract address, make sure that the contract address corresponds to a erc721
    @param _tokenName the token name is the key that stores the value of tokenAddress
    @param tokenAddress is the value stored by the key, make sure it is an erc721 contract.
    */
    function _addToken(string memory _tokenName, address tokenAddress) internal {
        bytes32 tokenName = stringToBytes32(_tokenName);
        require(tokenAddress != address(0), "Allowances: The Zero Address is not allowed");
        _tokenAllowed[tokenName] = tokenAddress;
        _totalTokens.add(tokenName);
    }

    function _removeToken(string memory _tokenName) internal {
        bytes32 tokenName = stringToBytes32(_tokenName);
        require(_tokenAllowed[tokenName] != address(0));

        _totalTokens.remove(tokenName);
        delete _tokenAllowed[tokenName];
    }

    /**
    @dev  add an erc20 coin to be used as a means of payment, make sure the coin meets the erc20 standard.
    @param _currency is the key to store the value
    @param currencyAddress the contract address stored by the key, must be an erc20
    */

    function _addCurrency(string memory _currency, address currencyAddress) internal {
        bytes32 currency = stringToBytes32(_currency);
        require(currencyAddress != address(0), "Allowances: The Zero Address is not allowed");
        _currencyAllowed[currency] = currencyAddress;
        _totalCurrencies.add(currency);
    }

    function _removeCurrency(string memory _currency) internal {
        bytes32 currency = stringToBytes32(_currency);
        require(_currencyAllowed[currency] != address(0));

        _totalCurrencies.remove(currency);
        delete _currencyAllowed[currency];
    }

    function addressToken(string memory _tokenName) public view returns(address) {
        bytes32 tokenName = stringToBytes32(_tokenName);
        return _tokenAllowed[tokenName];
    }

    function addressCurrency(string memory _currency) public view returns(address) {
        bytes32 currency = stringToBytes32(_currency);
        return _currencyAllowed[currency];
    }

    /**
    @dev use this function to get all erc721 allowed to create auctions 
    */
     function allTokensAllowed() public view returns(string[] memory) {
        uint256 indexMax = _totalTokens.length();
        string[] memory tokens = new string[](indexMax);

        for (uint256 index = 0; index < indexMax; ++index) {
            bytes32 nameToken = _totalTokens.at(index);
            tokens[index] = bytes32ToString(nameToken);
        }
        return tokens;
    }


    function _allowedCurrency(string memory _currency) internal view returns(bool){
        bytes32 currency = stringToBytes32(_currency);
        return _currencyAllowed[currency] != address(0);
    }

    /**
    @dev use this function to get all erc20 allowed as payment method in the contract.
    */
     function allCurrenciesAllowed() public view returns(string[] memory) {
        uint256 indexMax = _totalCurrencies.length();
        string[] memory currencies = new string[](indexMax);
        for (uint256 index = 0; index < indexMax; ++index) {
            bytes32 currency = _totalCurrencies.at(index);
            currencies[index] = bytes32ToString(currency);
        }
        return currencies;
    }
     
    modifier currencyAllowed(string memory _currency)  {
        bytes32 currency = stringToBytes32(_currency);
         require(_currencyAllowed[currency] != address(0), "Allowances: This currency its not allowed" );
        _;
    }

    modifier tokenAllowed(string memory _tokenName) {
        bytes32 tokenName = stringToBytes32(_tokenName);
        require(_tokenAllowed[tokenName] != address(0), "Allowances: This token its not allowed" );
        _;
    }
    
}