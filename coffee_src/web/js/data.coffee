define( ->
	return {
		get: (collection) ->
			deferred = $.Deferred()
			$.ajax(
				type: 'POST'
				url: "/data/#{collection}"
				data: { _method: 'get' }
			).done( (result) ->
				if result.err then deferred.reject(result.err)
				else deferred.resolve(result.items)
			).fail( (result) ->
				deferred.reject(result)
			)
			return deferred.promise()

		put: (collection, putData) ->
			deferred = $.Deferred()
			putData._method = 'put'
			$.ajax(
				type: 'POST'
				url: "/data/#{collection}"
				data: putData
			).done( (result) ->
				if (result.err) then deferred.reject(result.err)
				else deferred.resolve(result)
			).fail( (result) ->
				deferred.reject(result)
			)
			return deferred.promise()
	}
)