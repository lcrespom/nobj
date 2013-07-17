define( ->
	nav = {
		oldViewId: ''
		defaultViewId: ''
		loadView: (viewId) ->
			@controller?.beforeUnload?(@oldViewId)
			@controller = @getController?(viewId)
			@controller?.beforeLoad?(viewId)
			url = viewId + '.html'
			$('#view').load(url, =>
				console.log('Loaded ' + url)
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
