require(['nav', 'controllers'], (nav, controllers) ->

	# This is to avoid silly errors in IE when compatibility mode is disabled
	if !window.console
		window.console = { log: -> }

	# Create application data
	window.books = {}

	#  Register controllers
	nav.getController = (viewId) -> controllers[viewId]

	# Navigate to the default page
	nav.defaultViewId = 'books'
	nav.loadView(nav.defaultViewId)

)