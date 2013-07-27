require(['nobj/nav', 'nobj/crudControllers'], (nav, crudControllers) ->

	# This is to avoid silly errors in IE when compatibility mode is disabled
	if !window.console
		window.console =
			log: ->
			warn: ->
			error: ->

	crudControllers.addCollection('books')
	crudControllers.addCollection('users')
	#  Register controllers
	nav.getController = crudControllers.getController

	# Navigate to the default page
	nav.setNavigationArea('navArea', 'collections')
	nav.loadDefaultView()

)