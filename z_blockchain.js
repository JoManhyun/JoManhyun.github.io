var contractAddr = '0x65380c3af43235a80120e7925a25af9f4394eaf7';
var accountAddr = "0x91d0ef5cbdd81d1ca3b879b94810172acecc17ed";

var abi = [{"constant":true,"inputs":[{"name":"a","type":"uint256"}],"name":"getData","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"hashData","outputs":[{"name":"num","type":"uint256"},{"name":"hashValue","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"sunchaSearch","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"string"}],"name":"storeData","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];

var hashDBContract;
var hashDB;

window.addEventListener('load', function() {
	if (typeof web3 !== 'undefined') {
		window.web3 = new Web3(web3.currentProvider);
	}

	else {
		console.log('No web3? You should consider trying MetaMask!')
		window.web3 = new Web3(new Web3.providers.HttpProvider("http://ropsten.infura.io/"));
	}

	startApp();
});

function startApp(){
	hashDBContract = web3.eth.contract(abi);
	hashDB = hashDBContract.at(contractAddr);
	document.getElementById('contractAddr').innerHTML = getLink(contractAddr);
	document.getElementById('accountAddr').innerHTML = getLink(accountAddr);
}

function getLink(addr){
	return '<a target="_blank" href=https://ropsten.etherscan.io/address/' + addr + '>' + addr +'</a>';
}

function store_hash_data() {
	var str = $("#hash_data").text();
	var txid;
	hashDB.storeData(str, function(e,r){
		document.getElementById('tranAddr').innerHTML = r;
		document.getElementById('blockNum').innerHTML = '<span id="pending" style="color:red;">블록체인에 등록 중 입니다.</span>';
		document.getElementById('num').innerHTML = '<span id = "hashArrNum">등록이 완료되면 찾으실 때 사용하실 번호가 출력됩니다.</span>';
	txid = r;
	});

	var filter = web3.eth.filter('latest');

	filter.watch(function(e,r){
		web3.eth.getTransaction(txid, function(e,r){
			if(r != null && r.blockNumber > 0) {
				document.getElementById('pending').innerHTML = '등록완료';
				document.getElementById('pending').style.cssText = 'color:green;';
				get_hashArrNum();
				filter.stopWatching();
			}
		});
	});
}

function get_hashArrNum(){
	hashDB.sunchaSearch(
		function(e,r)
		{
			document.getElementById('hashArrNum').innerHTML = r.toNumber();
		}
	);

	web3.eth.getBlockNumber(
		function(e,r){
			document.getElementById('lastBlock').innerHTML = r;
		}
	);
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
	if (str == cmp_str){document.getElementById('result_cmp').innerHTML = "등록된 문서와 동일한 문서입니다.";}
	else{document.getElementById('result_cmp').innerHTML = "등록된 문서와 전혀 다른 문서입니다.";}
}
