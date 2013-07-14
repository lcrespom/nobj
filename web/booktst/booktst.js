$(function() {

	//-------------------- Navigation --------------------

	/* Make sure to test it works fine on all major browsers
	*/

	if (!window.console) {
		window.console = {
			log: function() {}
		}
	}

	function loadView(url) {
		$("#view").load(url, function() {
			console.log("Loaded " + url);
			//todo something?
		});
	}

	window.onhashchange = function() {
		console.log("Hash changed to " + location.hash);
		var url;
		if (location.hash.length <= 0) url = "books.html";
		else url = location.hash.substring(1) + ".html";
		loadView(url);
	}

	// This is the first page being loaded
	loadView("books.html");

	window.books = {};

});
