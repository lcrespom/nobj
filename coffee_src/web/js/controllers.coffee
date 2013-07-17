define( ->
	books:
		afterLoad: -> console.log('After load books')
	edit:
		afterLoad: -> console.log('After load edit')
	new:
		afterLoad: -> console.log('After load new')
)