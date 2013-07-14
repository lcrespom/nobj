require(['nav'], (nav) ->

	# This is to avoid silly errors in IE when compatibility mode is disabled
	if !window.console
		window.console = { log: -> }

	# This is the first page being loaded
	nav.loadView("books.html")

	# Create application data
	window.books = {}
)