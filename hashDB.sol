pragma solidity ^0.4.21;

contract HashDB{

	struct hashStruct {
		uint num;
		string hashValue;
	}
	hashStruct[] public hashData;

	uint count = 0;

	function storeData(string hash) public{
		hashData.push(hashStruct(count, hash));
		count = count + 1;
	}

	function sunchaSearch(uint a)public constant returns(uint) {
		uint size = count - 1;
		uint local = 0;
		while(local<=size && hashData[local].num != a) {
			local = local +1;
			if(local > a) {
				local = 0;
			}
		}
		return hashData[local].num;
	}

	function getData(uint a) public constant returns(string) {
	    return hashData[a].hashValue;
	}
}
