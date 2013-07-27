require(['nobj/nav', 'nobj/controllers', 'users'], (nav, controllers, users) ->

	# This is to avoid silly errors in IE when compatibility mode is disabled
	if !window.console
		window.console =
			log: ->
			warn: ->
			error: ->

	#  Register controllers
	controllers.addCollection('books')
	controllers.addCollection('users')
	userEditChain = new controllers.ChainController([
		controllers.getController('users/edit')
		new users.BookListController()
	])
	controllers.setController('users/edit', userEditChain)
	#controllers.setController('users/edit',
	nav.getController = controllers.getController

	# Navigate to the default page
	nav.setNavigationArea('navArea', 'collections')
	nav.loadDefaultView()

)