define([], ->
	class BookListController
		constructor: (@collection, @query) ->
		afterLoad: ->
			console.log('User edit after load')

	return {
		BookListController: BookListController
	}
)