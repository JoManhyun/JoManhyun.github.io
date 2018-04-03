var contractAddr = '0xD8309a0C1147BBBDD9b3d24d9504764BB818c253';
var abi = [{"constant":true,"inputs":[{"name":"a","type":"uint256"}],"name":"getData","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"string"}],"name":"storeHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getArrNum","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
var hashDBContract;
var hashDB;
window.addEventListener('load', function() {
	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 !== 'undefined') {
				// Use Mist/MetaMask's provider
				window.web3 = new Web3(web3.currentProvider);
	}
	else {
		console.log('No web3? You should consider trying MetaMask!')
		// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
		window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	}
	// Now you can start your app & access web3 freely:
	startApp();
});

function startApp(){
	hashDBContract = web3.eth.contract(abi);
	hashDB = hashDBContract.at(contractAddr);
	document.getElementById('contractAddr').innerHTML = getLink(contractAddr);
	web3.eth.getAccounts(function(e,r){document.getElementById('accountAddr').innerHTML = getLink(r[0]);});
}
function getLink(addr){
	return '<a target="_blank" href=https://ropsten.etherscan.io/address/' + addr + '>' + addr +'</a>';
}

function store_hash_data() {
	var str = $("#hash_data").text();
	hashDB.storeHash(str, function(e,r){});
	hashDB.getArrNum(function(e,r){document.getElementById('print_hash').innerHTML = r.toNumber();});
}

function load_hash_data(){
	var num = document.getElementById('search_num').value;
	hashDB.getData(num, function(e,r){document.getElementById('load_hash').innerHTML = r.toString();});
}

function search_hash_data(){
	var str = $("#hash_data").text();
	var cmp_str = $("#load_hash").text();
	console.log(str);
	console.log(cmp_str);
	if (str == cmp_str){document.getElementById('result_cmp').innerHTML = "헤헿 나  잘만들엇네 ^^";}
	else{document.getElementById('result_cmp').innerHTML = "왜 이유가먼데 ㅡㅡ;";}
}

// function cmp_hash(string a, string b)
// {

// }

