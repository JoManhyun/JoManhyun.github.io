pragma solidity ^0.4.21;

contract HashDB{

	string[] hashArr;
	struct hashStruct {
		uint num;
		string hashValue;
	}
	hashStruct[] searchData;

	uint count = 0;

	function storeHash(string hash) public{
		hashArr.push(hash);
		count = count + 1;
		getArrNum();
	}

	function getArrNum() public constant returns (uint) {
	    return count - 1;
	}

	function binarySearch(uint a)public constant returns(uint, string){
		uint low = 0;
		uint mid;
		uint high = count - 1;
		uint size = count - 1;
		hashStruct data = hashStruct(a, hashArr[a]);
		searchData.push(data);

		while(low <= high) {
			mid = (low + high)/2;
			if(a == searchData[size].num && hashArr[a] == searchData[size].hashValue) {
				return mid;
			}
			else if(a > searchData[size].num) {
				low = mid + 1;
			}
			else {
				high = mid - 1;
			}
		}
		return searchData[a].num;
		return searchData[a].hashValue;
	}

	function getData(uint a) public constant returns(string) {
	    return hashArr[a];
	}


}
