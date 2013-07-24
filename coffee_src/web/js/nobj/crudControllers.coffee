define(['./nobj', './data'], (nobj, data) ->

	global = @
	controllers = {}

	addController = (collection, page, event, callback) ->
		viewId = collection + '/' + page
		controllers[viewId] = controllers[viewId] || {}
		controllers[viewId][event] = callback


	return {

		addCollection: (collection) ->
			global.nobj = global.nobj || {}
			global.nobj.collections = global.nobj.collections || {}
			global.nobj.collections[collection] = {}
			addController(collection, 'list', 'afterLoad', @afterListLoad(collection, "##{collection}_list"))
			addController(collection, 'edit', 'afterLoad', @afterEditLoad(collection, "##{collection}_edit"))
			addController(collection, 'new', 'afterLoad', @afterNewLoad(collection, "##{collection}_new"))

		getController: (viewId) -> controllers[viewId]

		afterNewLoad: (collection, formQuery) ->
			return ->
				form = $(formQuery)
				form.submit( ->
					nobj.post(form, collection).done( ->
						alert('New item added')
					).fail( ->
						alert('Error while adding item')
					)
					return false
				)

		afterEditLoad: (collection, formQuery) ->
			return ->
				form = $(formQuery)
				nobj.obj2form(global.nobj.collections[collection].current, form)
				form.submit( ->
					nobj.put(form, collection).done( ->
						alert('Item Saved')
					).fail(->
						alert('Error while updating item')
					)
					return false
				)


		afterListLoad: (collection, tableQuery) ->

			registerActions = (row, item) ->
				$('a.editLink', row).click( ->
					global.nobj.collections[collection].current = item
				)
				$('a.delLink', row).click( ->
					data.delete(collection, item._id).done( (result) ->
						alert('Item deleted: ' + result.result)
						row.remove()
					).fail( (err) ->
						alert('Error: ' + err)
					)
					return false
				)

			fillTable = ->
				data.get(collection).done( (result) ->
					nobj.fillTable(result.items, $(tableQuery), (item, row) ->
						actions = '<a class="editLink" href="#' + collection + '/edit">Edit</a>'
						actions += ' / <a class="delLink" href="">Delete</a>'
						$('td:last', row).append(actions)
						registerActions(row, item)
					)
				).fail( (err) ->
					alert 'Error: ' + err
				)

			return ->
				fillTable()

	}
)