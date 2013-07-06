# Naked objects:
#	node.js on server
#	jQuery on client
#	CoffeeScript as language on both sides
#	NoSQL database (MongoDB)

# Requires
connect = require('connect')
data = require('./data')

# Global parameters
data.dbConfig = url: 'mongodb://localhost/test'
svrConfig =
	port: 1337
	host: 'localhost'
	rootDir: 'web'

# Server setup
launchServer = ->
	svr = connect()
		.use(connect.static(svrConfig.rootDir))
		.use(connect.urlencoded())
		.use('/data', data.connectHandler)
	svr.listen(svrConfig.port, svrConfig.host)
	console.log("Server running at http://#{svrConfig.host}:#{svrConfig.port}/")


# ----- Main -----
data.openDbConnection((err) ->
	if err
		console.error('Could not connect to database', err)
	else
		launchServer()
)
