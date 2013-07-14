define( ->
	nav = {
		loadView: (url) ->
			$("#view").load(url, ->
				console.log("Loaded " + url)
				#todo something?
			)
	}

	window.onhashchange = ->
		console.log("Hash changed to " + location.hash)
		if location.hash.length <= 0 then url = "books.html"
		else url = location.hash.substring(1) + ".html"
		nav.loadView(url)

	return nav
)
