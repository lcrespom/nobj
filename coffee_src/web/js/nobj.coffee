define(['data'], (data) ->

	return {

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