define(['data'], (data) ->

	global = @

	afterBooksLoad = ->

		registerActions = (row, book) ->
			$('a.editLink', row).click( -> global.books.current = book )
			$('a.delLink', row).click( ->
				data.delete('books', book._id).done( (result) ->
					alert('Book deleted: ' + result)
					row.remove()
				).fail( (err) ->
					alert('Error: ' + err)
				)
				return false
			)

		fillTable = ->
			data.get('books').done( (result) ->
				items = result.items
				rows = $('#books tbody')
				for book in items
					newRow = '<tr><td>' + book.title + '</td>'
					newRow += '<td>' + book.author + '</td>'
					newRow += '<td><a class=\'editLink\' href=\'#edit\'>Edit</a>'
					newRow += ' / <a class=\'delLink\' href=\'\'>Delete</a></td></tr>'
					newRowElement = $(newRow)
					registerActions newRowElement, book
					rows.append newRowElement
			).fail( (err) ->
				alert 'Error: ' + err
			)

		fillTable()


	afterEditLoad = ->
		return if not global.books or not global.books.current
		$('#book_title').val global.books.current.title
		$('#book_author').val global.books.current.author
		$('#book_edit').submit ->
			putData =
				title: $('#book_title').val()
				author: $('#book_author').val()
				_id: global.books.current._id
			data.put('books', putData).done( ->
				alert('Data Saved')
			).fail(->
				alert('Error while saving data')
			)
			return false


	afterNewLoad = ->
		$('#book_new').submit ->
			postData =
				title: $('#book_title').val()
				author: $('#book_author').val()
			data.post('books', postData).done( ->
				alert('New book added')
			).fail( ->
				alert('Error while saving data')
			)
			return false


	return {
		books:
			afterLoad: afterBooksLoad
		edit:
			afterLoad: afterEditLoad
		new:
			afterLoad: afterNewLoad
	}
)