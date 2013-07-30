define(['nobj/nobj', 'nobj/data'], (nobj, data) ->

	global = @
	reservedColInfo = null
	user = null
	reservedTbody = null

	removeArrayElement = (a, e) ->
		ret = []
		for elem in a
			if elem != e then ret.push(elem)
		return ret

	arrayContainsElement = (a, e) ->
		for elem in a
			if elem == e then return true
		return false


	class AddBookActionHandler
		actionMask: '$add-book'
		getHTML: (collection) -> '<a class="addLink" href="#">Reserve</a>'
		subscribe: (collection, domNode, item) ->
			$('a.addLink', domNode).click( ->
				if arrayContainsElement(user.books, item._id) then return false
				user.books.push(item._id)
				reservedTbody.append(nobj.buildTableRow(collection, item, reservedColInfo))
				return false
			)

	class DelBookActionHandler
		actionMask: '$del-book'
		getHTML: (collection) -> '<a class="delLink" href="#">Remove</a>'
		subscribe: (collection, domNode, item) ->
			$('a.delLink', domNode).click( ->
				user.books = removeArrayElement(user.books, item._id)
				$(nobj.getParentNode(domNode.get(0), 'TR')).remove()
				return false
			)

	class UserEditController
		constructor: (@collection, @query) ->
		afterLoad: ->
			# Prepare variables used by AddBookActionHandler
			user = global.nobj.collections.users.current
			user.books = user.books || []
			reservedColInfo = nobj.parseTableHeaders('books', $('#reserved_books_list'))
			reservedTbody = $('#reserved_books_list tbody')
			# Fill book table
			data.get('books'
			).done( (result) ->
				nobj.fillTable('books', result.items, $('#books_list'))
			).fail( (err) ->
				alert 'Error: ' + err
			)
			# Capture form submit in order to populate book list
			$('#users_edit').submit( ->
				#TODO add hidden field with JSON of user.books
			)


	nobj.addActionHandler(new AddBookActionHandler())
	nobj.addActionHandler(new DelBookActionHandler())

	return {
		UserEditController: UserEditController
	}
)