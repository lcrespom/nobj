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
	switch req.method
		when 'GET' then doGet(req, res, next)
		when 'POST' then doPost(req, res, next)
		else next("Method '#{req.method}' not supported")

doGet = (req, res, next) ->
	parsedUrl = url.parse(req.url, true)
	console.log('\n--- get ---')
	console.log(parsedUrl.pathname, parsedUrl.query)
	pathParts = parsedUrl.pathname.split('/')
	collName = pathParts[1]
	if not collName
		next("Invalid request path: #{parsedUrl.pathname} - missing collection name")
		return
	collection = db.collection(collName)
	console.log("Collection: #{collection.collectionName}")
	if _.isEmpty(parsedUrl.query)
		oid = pathParts[2]
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

doPost = (req, res) ->
	#TODO support create, delete and update
	throw 'Not supported'

respondJson = (res, obj) ->
	res.writeHead(200, 'Content-Type': 'application/json')
	if not obj
		res.end('<null>')
	else if obj.constructor == String
		#TODO remove later
		res.end(obj)	
	else
		res.end(utils.jsonStringifyNoCircular(obj))	

exports.openDbConnection = connectDB
exports.connectHandler = dataHandler
exports.dbConfig = {}
