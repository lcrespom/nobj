define(['data'], (data) ->

	return {

		fillTable: (items, table, rowcb) ->
			heads = $('thead tr th', table)
			fields = []
			for head in heads
				fields.push($(head).attr('data-nobj-field'))
			rows = $('tbody', table)
			for item in items
				newRow = '<tr>'
				for field in fields
					newRow += '<td>' + (item[field] || '') + '</td>'
				newRow += '</tr>'
				newRowElement = $(newRow)
				rowcb(item, newRowElement)
				rows.append(newRowElement)


		obj2form: (obj, form) ->
			for input in $('[name]', form)
				jqInput = $(input)
				value = obj[jqInput.attr('name')]
				if value then jqInput.val(value)

		post: (form, collection) -> data.post(collection, form.serialize())

		put: (form, collection) ->
			putData = form.serialize()
			data.put(collection, putData)
	}
)