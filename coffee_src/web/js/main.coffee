require(['nav'], (nav) ->
	if !window.console
		window.console = { log: -> }

	# This is the first page being loaded
	nav.loadView("books.html")

	window.books = {}
)