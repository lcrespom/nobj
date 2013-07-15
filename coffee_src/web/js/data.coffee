define( ->
	return {
		get: (collection, cb) ->
			$.ajax(
				type: 'POST'
				url: "/data/#{collection}"
				data: { _method: 'get' }
			).done( (result) ->
				if result.err then alert(result.err)	#TODO use jQuery promise approach
				else cb(result.items)
			)

		put: (collection, putData, cb) ->
			putData._method = 'put'
			$.ajax(
				type: 'POST'
				url: "/data/#{collection}"
				data: putData
			).done( (result) ->
				cb(result)	#TODO use jQuery promise approach
			)
	}
)