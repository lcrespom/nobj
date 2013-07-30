nav = require('./nobj/nav')
controllers = require('./nobj/controllers')
users = require('./users')

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
	new users.UserEditController()
	controllers.getController('users/edit')
])
controllers.setController('users/edit', userEditChain)

# Set registered controllers to the navigation controller
nav.getController = controllers.getController

# Navigate to the default page
nav.setNavigationArea('navArea', 'collections')

$ -> nav.loadDefaultView()
