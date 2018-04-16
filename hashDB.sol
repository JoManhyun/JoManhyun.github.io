pragma solidity ^0.4.21;

contract HashDB{

	struct hashStruct {
		uint num;
		string hashValue;
	}
	hashStruct[] public searchData;

	uint count = 0;

	function storeHash(string hash) public{
		searchData[count].hashValue.push(hash);
		count = count + 1;
	}

	function getArrNum() public constant returns (uint) {
	    return count - 1;
	}

	function sunchaSearch(uint a)public constant returns(uint) {
		uint size = getArrNum();
		uint local = 0;
		for(uint i=0; i<size; i++) {
				searchData.push(hashStruct(i, hashArr[i]));
		}
		while(local<=size && searchData[local].num != a) {
			local = local +1;
			if(local > a) {
				local = 0;
			}
		}
		return searchData[local].num;
	}

	function getData(uint a) public constant returns(string) {
	    return hashArr[a];
	}


}
