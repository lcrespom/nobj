require(['nobj/nav', 'nobj/crudControllers'], (nav, crudControllers) ->

	# This is to avoid silly errors in IE when compatibility mode is disabled
	if !window.console
		window.console = { log: -> }

	# Create application data
	window.nobj = { collections: { books: {} } }

	#  Register controllers
	nav.getController = (viewId) ->
		controllers =
			books:
				afterLoad: crudControllers.afterListLoad('books', '#books')
			edit:
				afterLoad: crudControllers.afterEditLoad('books', '#book_edit')
			new:
				afterLoad: crudControllers.afterNewLoad('books', '#book_new')
		controllers[viewId]

	# Navigate to the default page
	nav.defaultViewId = 'books'
	nav.loadView(nav.defaultViewId)

)