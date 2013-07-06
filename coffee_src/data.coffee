# Requires
mongo = require('mongodb').MongoClient
url = require('url')
utils = require('./utils')

db = null

# Creates a connection with the mongo server
connectDB = (callback) ->
	mongo.connect(exports.dbConfig.url, (err, dbConnection) ->
		db = dbConnection
		callback(err)
	)

# Database connect middleware function
dataHandler = (req, res, next) ->
	switch req.method
		when 'GET' then doGet(req, res)
		when 'POST' then doPost(req, res)
		else next('Method not supported')

doGet = (req, res) ->
	parsedUrl = url.parse(req.url, true)
	console.log(parsedUrl)
	#TODO inspect URL and make db query accordingly
	res.writeHead(200, 'Content-Type': 'application/json')
	res.end(utils.jsonStringifyNoCircular(req))

doPost = (req, res) ->
	throw 'Not supported'


exports.openDbConnection = connectDB
exports.connectHandler = dataHandler
exports.dbConfig = {}
