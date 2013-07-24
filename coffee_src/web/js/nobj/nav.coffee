define( ->
	nav = {
		oldViewId: ''
		defaultViewId: ''
		loadView: (viewId) ->
			oldController = @controller
			@controller = @getController?(viewId)
			if (!@controller) then console.warn("No controller found for view '#{viewId}'")
			oldController?.beforeUnload?(@oldViewId)
			@controller?.beforeLoad?(viewId)
			url = viewId + '.html'
			$('#view').load(url, (text, status) =>
				console.log('Loaded', url, '- status:', status)
				oldController?.afterUnload?(@oldViewId)
				@controller?.afterLoad?(viewId)
				@oldViewId = viewId
			)
	}

	window.onhashchange = ->
		console.log('Hash changed to ' + location.hash)
		if location.hash.length <= 0 then viewId = nav.defaultViewId
		else viewId = location.hash.substring(1)
		nav.loadView(viewId)

	return nav
)
