pragma solidity ^0.4.21;

contract HashDB{

	struct hashStruct {
		uint num;
		string hashValue;
	}
	hashStruct[] public hashData;

	uint count = 0;
	string tmp;

	function storeData(string hash)public{
		hashData.push(hashStruct(count, hash));
		tmp = hashData[count].hashValue;
		count = count + 1;
	}

	function sunchaSearch()public constant returns(uint) {
		uint size = count;
		uint local;
		for(uint i = 0; i<size; i++) {
			if(keccak256(hashData[i].hashValue) == keccak256(tmp)) {
				local = i;
				break;
			}
		}
		return hashData[local].num;
	}

	function getData(uint a) public constant returns(string) {
		return hashData[a].hashValue;
	}
}
