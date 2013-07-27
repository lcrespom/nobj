define(['./data'], (data) ->

	actionHandlers = []


	class EditActionHandler
		actionMask: '$edit'
		getHTML: (collection) -> '<a class="editLink" href="#' + collection + '/edit">Edit</a>'
		subscribe: (collection, domNode, item) ->
			$('a.editLink', domNode).click( ->
				global.nobj.collections[collection].current = item
			)

	class DeleteActionHandler
		actionMask: '$delete'
		getHTML: (collection) -> '<a class="delLink" href="">Delete</a>'
		subscribe: (collection, domNode, item) ->
			$('a.delLink', domNode).click( ->
				data.delete(collection, item._id).done( (result) ->
					alert('Item deleted: ' + result.result)
					domNode.remove()
				).fail( (err) ->
					alert('Error: ' + err)
				)
				return false
			)


	addActionHandler = (actionHandler) ->
		actionHandlers.push(actionHandler)

	addActionHandler(new EditActionHandler())
	addActionHandler(new DeleteActionHandler())


	return {

		fillTable: (collection, items, table, rowcb) ->
			# First, process headers metadata, present in data-nobj-* attributes
			heads = $('thead tr th', table)
			colInfos = []
			for head, i in heads
				headNode = $(head)
				field = headNode.attr('data-nobj-field')
				if field
					colInfos.push({ field: field })
				else
					mask = headNode.attr('data-nobj-actions')
					if mask
						[replaced, handlers] = @processHandlers(collection, mask)
						colInfos.push({ html: replaced, handlers: handlers })
					else colInfos.push({})
			# Then iterate over items and populate data and actions
			rows = $('tbody', table)
			for item in items
				newRow = '<tr>'
				#newRowNode = $('<tr></tr>')
				for colInfo in colInfos
					html = ''
					#TODO should perform HTML filtering of field data to avoid attacks
					if colInfo.field then html = item[colInfo.field] || ''
					#else if colInfo.handlers then html = colInfo.html
					newRow += '<td>' + html + '</td>'
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

		addActionHandler: addActionHandler

		processHandlers: (collection, mask) ->
			handlers = []
			for handler in actionHandlers
				if mask.indexOf(handler.actionMask) >= 0
					mask = mask.replace(handler.actionMask, handler.getHTML(collection))
					handlers.push(handler)
			return [mask, handlers]
	}
)