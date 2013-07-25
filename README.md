nobj
====

Naked objects with Node.js, MongoDB, jQuery and CoffeeScript

Current support:
- A simple REST interface to mongodb.
- Generic UI support for CRUD of collections
	- Zero JS code required
	- The only custom code required	is the HTML pages of the table and forms
		for each specific collection. This is what is used by the generic
		controllers in order to infer the list of fields of a given collection.
