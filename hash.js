(function () {
	"use strict";
	var drop_zone, is_crypto = false;
	document.getElementById('drop_zone').onclick = function () {
		document.getElementById('files').click();
		return false;
	};

	if ((typeof File !== 'undefined') && !File.prototype.slice) {
		if(File.prototype.webkitSlice) {
			File.prototype.slice = File.prototype.webkitSlice;
		}

		if(File.prototype.mozSlice) {
			File.prototype.slice = File.prototype.mozSlice;
		}
	}

	if (!window.File || !window.FileReader || !window.FileList || !window.Blob || !File.prototype.slice) {
		alert('브라우저에서 파일에 대한 API를 지원하지 않습니다. Chrome 또는 Firefox를 사용해주십시오.');
	}

	is_crypto = window.crypto && window.crypto.subtle && window.crypto.subtle.digest;

	function hash_file(file, workers) {
		var i, buffer_size, block, threads, reader, blob, handle_hash_block, handle_load_block;

		handle_load_block = function (event) {
			for( i = 0; i < workers.length; i += 1) {
				threads += 1;
				workers[i].postMessage({
					'message' : event.target.result,
					'block' : block
				});
			}
		};
		handle_hash_block = function (event) {
			threads -= 1;

			if(threads === 0) {
				if(block.end !== file.size) {
					block.start += buffer_size;
					block.end += buffer_size;

					if(block.end > file.size) {
						block.end = file.size;
					}
					reader = new FileReader();
					reader.onload = handle_load_block;
					blob = file.slice(block.start, block.end);

					reader.readAsArrayBuffer(blob);
				}
			}
		};
		buffer_size = 64 * 16 * 1024;
		block = {
			'file_size' : file.size,
			'start' : 0
		};

		block.end = buffer_size > file.size ? file.size : buffer_size;
		threads = 0;

		for (i = 0; i < workers.length; i += 1) {
			workers[i].addEventListener('message', handle_hash_block);
		}
		reader = new FileReader();
		reader.onload = handle_load_block;
		blob = file.slice(block.start, block.end);

		reader.readAsArrayBuffer(blob);
	}

	function handle_worker_event(id) {
		return function (event) {
			if (event.data.result) {
				$("#" + id).parent().html(event.data.result);
			} else {
				$("#" + id + ' .bar').css('width', event.data.block.end * 100 / event.data.block.file_size + '%');
			}
		};
	}

	function handle_crypto_progress(id, total, loaded) {
		$(id + ' .bar').css('width', loaded * 100 / total + '%');
	}

	function handle_file_select(event) {
		event.stopPropagation();
		event.preventDefault();


		var i, fileInfoArr, files, file, workers, worker, reader, crypto_files, crypto_algos, max_crypto_file_size = 500 * 1024 * 1024;

		files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
		fileInfoArr = [];


		crypto_files = [];

		for (i = 0; i < files.length; i += 1) {
			file = files[i];
			workers = [];
			crypto_algos = [];

			fileInfoArr.push('<tr><td class="span12"><strong>', file.name, '</strong></td><td> (', file.type || 'n/a', ') - ', file.size, ' bytes</td></tr>');

			if (is_crypto && file.size < max_crypto_file_size) {
				crypto_algos.push({id: "#sha256_file_hash", name: "SHA-256"});
			}
			else {
				worker = new Worker('/js/calculator/calculator.worker.sha256.js');
				worker.addEventListener('message', handle_worker_event('sha256_file_hash'));
				workers.push(worker);
			}

			if (is_crypto && crypto_algos.length > 0) {
				crypto_files.push({file: file, algos: crypto_algos});
			}

			hash_file(file, workers);
		}

		if (is_crypto) {
			handle_crypto_files(crypto_files);
		}

		document.getElementById('hash_data').innerHTML = '<div class="progress progress-striped active" id="sha256_file_hash"></div>';

		document.getElementById('file_info').innerHTML = fileInfoArr.join('');

	}


	function handle_crypto_files(crypto_files) {
		var crypto_file, handle_crypto_file, handle_crypto_block, reader;

		crypto_file = crypto_files.pop();

		handle_crypto_block = function(data, algos) {
			var algo = algos.pop();

			if (algo) {
				window.crypto.subtle.digest({name: algo.name}, data)
				.then(function(hash) {
					var hexString = '', hashResult = new Uint8Array(hash);

					for (var i = 0; i < hashResult.length; i++) {
						hexString += ("00" + hashResult[i].toString(16)).slice(-2);
					}
					$(algo.id).parent().html(hexString);

					handle_crypto_block(data, algos);
				})
				.catch(function(error) {
					console.error(error);
				});
			} else {
				handle_crypto_files(crypto_files);
			}
		};

		handle_crypto_file = function(file, crypto_algos) {
			reader = new FileReader();

			reader.onprogress = (function(crypto_algos) {
				var algos = crypto_algos;

				return function(event) {
					var i;

					for (i = 0; i < algos.length; i++) {
						handle_crypto_progress(algos[i].id, event.total, event.loaded);
					}
				}
			})(crypto_algos);

			reader.onload = (function(crypto_algos) {
				var algos = crypto_algos;

				return function(event) {
					handle_crypto_block(event.target.result, algos);
				}
			})(crypto_algos);

			reader.readAsArrayBuffer(file);
		};

		if (crypto_file) {
			handle_crypto_file(crypto_file.file, crypto_file.algos);
		}
	}

	function handle_drag_over(event) {
		event.stopPropagation();
		event.preventDefault();
	}

	drop_zone = document.getElementById('drop_zone');

	drop_zone.addEventListener('dragover', handle_drag_over, false);
	drop_zone.addEventListener('drop', handle_file_select, false);

	document.getElementById('files').addEventListener('change', handle_file_select, false);
}());

