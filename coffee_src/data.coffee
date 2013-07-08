# Requires
MongoClient = require('mongodb').MongoClient
ObjectID = require('mongodb').ObjectID
url = require('url')
utils = require('./utils')
_ = require('underscore')

db = null

# Creates a connection with the mongo server
connectDB = (callback) ->
	MongoClient.connect(exports.dbConfig.url, (err, dbConnection) ->
		db = dbConnection
		callback(err)
	)

# Database connect middleware function
dataHandler = (req, res, next) ->
	parsedUrl = url.parse(req.url, true)
	console.log("\n--- #{req.method} ---")
	console.log(parsedUrl.pathname, parsedUrl.query)
	pathParts = parsedUrl.pathname.split('/')
	collName = pathParts[1]
	oid = pathParts[2]
	if not collName
		next("Invalid request path: #{parsedUrl.pathname} - missing collection name")
		return
	collection = db.collection(collName)
	console.log("Collection: #{collection.collectionName}")
	console.log('Body:', req.body)
	switch req.method
		when 'GET'		then doGet(req, res, next, collection, parsedUrl, oid)
		when 'POST'		then doPost(req, res, next, collection)
		when 'PUT'		then doPut(req, res, next, collection)
		when 'DELETE'	then doDelete(req, res, next, collection)
		else next("Method '#{req.method}' not supported")

doGet = (req, res, next, collection, parsedUrl, oid) ->
	if _.isEmpty(parsedUrl.query)
		if oid
			# Direct fetch of oid collection
			collection.findOne(_id: ObjectID(oid), (err, item) ->
				respondJson(res, { err: err, item: item }))
		else
			# List all elements in collection
			collection.find().toArray((err, items) ->
				respondJson(res, { err: err, items: items }))
	else
		# Find all items in collection that match a query
		collection.find(parsedUrl.query).toArray((err, items) ->
				respondJson(res, { err: err, items: items }))

doPost = (req, res, next, collection) ->
	# Create new entry
	delete req.body._id		#TODO this is temporary until client gets smarter
	collection.insert(req.body, w: 1, (err, result) ->
		respondJson(res, { err: err, result: result }))

doPut = (req, res, next, collection) ->
	#TODO update entry
	throw 'PUT not yet supported'

doDelete = (req, res, next, collection) ->
	collection.remove(_id: ObjectID(req.body._id), {w:1}, (err, numRemoved) ->
		respondJson(res, { err: err, result: numRemoved }))

respondJson = (res, obj) ->
	res.writeHead(200, 'Content-Type': 'application/json')
	if not obj
		res.end('{ result: <null> }')
	else if obj.constructor == String
		res.end(obj)
	else
		res.end(utils.jsonStringifyNoCircular(obj))	

exports.openDbConnection = connectDB
exports.connectHandler = dataHandler
exports.dbConfig = {}
