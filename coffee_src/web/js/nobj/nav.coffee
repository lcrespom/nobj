define( ->

	#---------- The module object ----------
	nav =
		oldViewId: ''
		navArea: null
		history: {}

		setNavigationArea: (elementId, defaultViewId) ->
			@navArea = { id: elementId, defaultViewId: defaultViewId }

		loadDefaultView: ->
			@loadView(nav.navArea.defaultViewId)

		loadView: (viewId) ->
			oldController = @controller
			@controller = @getController?(viewId)
			if (!@controller) then console.warn("No controller found for view '#{viewId}'")
			oldController?.beforeUnload?(@oldViewId)
			@controller?.beforeLoad?(viewId)
			url = viewId + '.html'
			$('#' + @navArea.id).load(url, (text, status) =>
				console.log('Loaded', url, '- status:', status)
				oldController?.afterUnload?(@oldViewId)
				@controller?.afterLoad?(viewId)
				@oldViewId = viewId
			)


	#---------- Private code and setup ----------

	handleHistory = (loc) ->
		navArea = nav.history[loc]
		if navArea then nav.navArea = navArea
		else nav.history[loc] = nav.navArea

	window.onhashchange = ->
		console.log('Hash changed to ' + location.hash)
		if (!nav.navArea) then console.error('Navigation module has not been initialized')
		handleHistory(location.hash)
		if location.hash.length <= 0 then viewId = nav.navArea.defaultViewId
		else viewId = location.hash.substring(1)
		nav.loadView(viewId)

	return nav
)
