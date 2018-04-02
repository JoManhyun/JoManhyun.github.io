pragma solidity ^0.4.21;

contract HashDB{

	string[] hashArr;

	uint count = 0;

	function getArrNum() public constant returns (uint) {
	    return count - 1;
	}

	function storeHash(string hash) public{
		hashArr.push(hash);
		count = count + 1;
	}

	function getData(uint a) public constant returns(string) {
	    return hashArr[a];
	}


}
