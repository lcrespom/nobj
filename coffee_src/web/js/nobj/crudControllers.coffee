define(['./nobj', './data'], (nobj, data) ->

	global = @
	controllers = {}


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
		afterLoad: ->
			data.get(@collection).done( (result) =>
				nobj.fillTable(@collection, result.items, $(@query))
			).fail( (err) ->
				alert 'Error: ' + err
			)


	# Main: the crudControllers object provides a way to automatically register all CRUD controllers
	#		for a given collection
	return {
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
	}

)