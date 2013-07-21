define( ->
	nav = {
		oldViewId: ''
		defaultViewId: ''
		loadView: (viewId) ->
			oldController = @controller
			@controller = @getController?(viewId)
			oldController?.beforeUnload?(@oldViewId)
			@controller?.beforeLoad?(viewId)
			url = viewId + '.html'
			$('#view').load(url, =>
				console.log('Loaded ' + url)
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
