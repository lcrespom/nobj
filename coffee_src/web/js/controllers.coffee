define(['data', 'nobj'], (data, nobj) ->

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
					registerActions(newRowElement, book)
					rows.append(newRowElement)
			).fail( (err) ->
				alert 'Error: ' + err
			)

		fillTable()


	afterEditLoad = ->
		form = $('#book_edit')
		nobj.obj2form(global.books.current, form)
		form.submit( ->
			nobj.put(form, 'books').done( ->
				alert('Data Saved')
			).fail(->
				alert('Error while saving data')
			)
			return false
		)


	afterNewLoad = ->
		form = $('#book_new')
		form.submit( ->
			nobj.post(form, 'books').done( ->
				alert('New book added')
			).fail( ->
				alert('Error while saving data')
			)
			return false
		)

	return {
		books:
			afterLoad: afterBooksLoad
		edit:
			afterLoad: afterEditLoad
		new:
			afterLoad: afterNewLoad
	}
)