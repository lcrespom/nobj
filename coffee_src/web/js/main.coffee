require(['nobj/nav', 'nobj/crudControllers'], (nav, crudControllers) ->

	# This is to avoid silly errors in IE when compatibility mode is disabled
	if !window.console
		window.console = { log: -> }

	crudControllers.addCollection('books')
	#  Register controllers
	nav.getController = crudControllers.getController

	# Navigate to the default page
	nav.defaultViewId = 'collections'
	nav.loadView(nav.defaultViewId)

)