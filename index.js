
var infura = "https://ropsten.infura.io/nlBYklDNPJ8np6E9jwVx";
var w_a_addr = "0x79db56242bb11f1168d58f49c211471dd7c25741";
var w_c_addr = "0x65380c3af43235a80120e7925a25af9f4394eaf7";
var abi = [{"constant":true,"inputs":[{"name":"a","type":"uint256"}],"name":"getData","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"hashData","outputs":[{"name":"num","type":"uint256"},{"name":"hashValue","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"}],"name":"sunchaSearch","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"string"}],"name":"storeData","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];

(function() {
    Web3 = require('web3');
    web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.56.1:8545"));
    web3.eth.defaultAccount = w_a_addr;
    web3.eth.coinbase = w_a_addr;
})();
