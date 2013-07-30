data = require('./data')

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
				$(getParentNode(domNode.get(0), 'TR')).remove()
			).fail( (err) ->
				alert('Error: ' + err)
			)
			return false
		)


global = @
actionHandlers = []

getParentNode = (node, parentNodeName) ->
	while node && node.nodeName != parentNodeName
		node = node.parentElement
	return node

addActionHandler = (actionHandler) ->
	actionHandlers.push(actionHandler)

addActionHandler(new EditActionHandler())
addActionHandler(new DeleteActionHandler())


module.exports = {

	# Processes table header metadata, present in data-nobj-* attributes
	parseTableHeaders: (collection, table) ->
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
		return colInfos

	# Creates a table row node by iterating the columns and populating data and actions
	buildTableRow: (collection, item, colInfos) ->
		rowNode = $('<tr/>')
		for colInfo in colInfos
			cellNode = $('<td/>')
			#TODO should perform HTML filtering of field data to avoid attacks
			if colInfo.field
				cellNode.append(item[colInfo.field] || '')
			else if colInfo.handlers
				cellNode.append(colInfo.html)
				for handler in colInfo.handlers
					handler.subscribe(collection, cellNode, item)
			rowNode.append(cellNode)
		return rowNode

	fillTable: (collection, items, table, rowcb) ->
		colInfos = @parseTableHeaders(collection, table)
		rows = $('tbody', table)
		for item in items
			rowNode = @buildTableRow(collection, item, colInfos)
			rowcb?(item, rowNode)
			rows.append(rowNode)


	obj2form: (obj, form) ->
		for input in $('[name]', form)
			jqInput = $(input)
			value = obj[jqInput.attr('name')]
			if value then jqInput.val(value)

	post: (form, collection) -> data.post(collection, form.serialize())

	put: (form, collection) -> data.put(collection, form.serialize())

	addActionHandler: addActionHandler

	getParentNode: getParentNode

	processHandlers: (collection, mask) ->
		handlers = []
		for handler in actionHandlers
			if mask.indexOf(handler.actionMask) >= 0
				mask = mask.replace(handler.actionMask, handler.getHTML(collection))
				handlers.push(handler)
		return [mask, handlers]
}
