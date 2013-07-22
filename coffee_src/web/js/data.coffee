define( ->

	ajax = (collection, method, data) ->
		deferred = $.Deferred()
		data = data || {}
		if data.constructor == String then data += "&_method=#{method}"
		else data._method = method
		$.ajax(
			type: 'POST'
			url: "/data/#{collection}"
			data: data
		).done( (result) ->
			if result.err then deferred.reject(result.err)
			else deferred.resolve(result)
		).fail( (result) ->
			deferred.reject(result)
		)
		return deferred.promise()

	return {
		get: (collection) ->
			return ajax(collection, 'get')

		put: (collection, putData) ->
			return ajax(collection, 'put', putData)

		post: (collection, postData) ->
			return ajax(collection, 'post', postData)

		delete: (collection, oid) ->
			delData = { _id: oid }
			return ajax(collection, 'delete', delData)

	}
)