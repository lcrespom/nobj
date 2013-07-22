define(['data'], (data) ->

	capitalize = (str) -> str.substring(0, 1).toUppercase() + str.substring(1)

	getFormInput = (form, field) -> $("[name=#{field}]", form)


	return {

		obj2form: (obj, form, spec) ->
			for fieldSpec in spec.fields
				getFormInput(form, fieldSpec.field)?.val(obj[fieldSpec.field])
			getFormInput(form, '_id')?.val(obj._id)

		post: (form, collection) -> data.post(collection, form.serialize())

		put: (form, collection) ->
			putData = form.serialize()
			data.put(collection, putData)
	}
)