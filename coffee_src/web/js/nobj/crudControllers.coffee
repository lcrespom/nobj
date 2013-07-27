define(['./nobj', './data'], (nobj, data) ->

	global = @
	controllers = {}
	actionHandlers = {}


	class EditActionHandler
		label: 'Edit'
		mask: '$edit'
		subscribe: (collection, item) ->

	class DeleteActionHandler
		label: 'Edit'
		mask: '$edit'
		subscribe: (collection, item) ->


	#----- Controllers for creating, updating and listing a collection -----

	class CreatingController
		constructor: (@collection, @query) ->
		afterLoad: ->
			form = $(@query)
			form.submit( =>
				nobj.post(form, @collection).done( ->
					alert('New item added')
				).fail( ->
					alert('Error while adding item')
				)
				return false
			)


	class UpdatingController
		constructor: (@collection, @query) ->
		afterLoad: ->
			form = $(@query)
			nobj.obj2form(global.nobj.collections[@collection].current, form)
			form.submit( =>
				nobj.put(form, @collection).done( ->
					alert('Item Saved')
				).fail(->
					alert('Error while updating item')
				)
				return false
			)


	class ListingController
		constructor: (@collection, @query) ->

		registerActions: (row, item) ->
			$('a.editLink', row).click( =>
				global.nobj.collections[@collection].current = item
			)
			$('a.delLink', row).click( =>
				data.delete(@collection, item._id).done( (result) ->
					alert('Item deleted: ' + result.result)
					row.remove()
				).fail( (err) ->
					alert('Error: ' + err)
				)
				return false
			)

		fillTable: ->
			data.get(@collection).done( (result) =>
				nobj.fillTable(result.items, $(@query), (item, row) =>
					
					actions = '<a class="editLink" href="#' + @collection + '/edit">Edit</a>'
					actions += ' / <a class="delLink" href="">Delete</a>'
					$('td:last', row).append(actions)
					@registerActions(row, item)
				)
			).fail( (err) ->
				alert 'Error: ' + err
			)

		afterLoad: ->
			@fillTable()


	# Main: the crudControllers object provides a way to automatically register all CRUD controllers
	#		for a given collection
	crudControllers =
		addCollection: (collection) ->
			global.nobj = global.nobj || {}
			global.nobj.collections = global.nobj.collections || {}
			global.nobj.collections[collection] = {}
			controllers[collection + '/list'] = new ListingController(collection, "##{collection}_list")
			controllers[collection + '/edit'] = new UpdatingController(collection, "##{collection}_edit")
			controllers[collection + '/new'] = new CreatingController(collection, "##{collection}_new")

		getController: (viewId) -> controllers[viewId]

		ListingController: ListingController
		UpdatingController: UpdatingController
		CreatingController: CreatingController

		addActionHandler: (mask, actionHandler) ->
			actionHandlers[mask] = actionHandler


	crudControllers.addActionHandler('$edit', new EditActionHandler())
	crudControllers.addActionHandler('$delete', new DeleteActionHandler())

	return crudControllers
)