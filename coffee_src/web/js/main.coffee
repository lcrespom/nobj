require(['nav', 'controllers'], (nav, controllers) ->

	# This is to avoid silly errors in IE when compatibility mode is disabled
	if !window.console
		window.console = { log: -> }

	# Create application data
	window.books = {}

	### A sample console controller
	consoleController = (viewId) ->
		beforeUnload: -> console.log('Before unload ' + viewId)
		beforeLoad: -> console.log('Before load ' + viewId)
		afterLoad: -> console.log('After load ' + viewId)
	###

	#  Register controllers
	nav.getController = (viewId) -> controllers[viewId]

	# Navigate to the default page
	nav.defaultViewId = 'books'
	nav.loadView(nav.defaultViewId)

)