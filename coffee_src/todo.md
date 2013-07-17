REST DB layer
-------------
- [x] POST for Create, PUT for Update, DELETE for Delete --> see http://www.senchalabs.org/connect/methodOverride.html
- [ ] Proper error handling
- [ ] Limits by configuration (e.g. max number of results to return etc.)
- [ ] Access control: allow operations depending on user identity
- [ ] Refactor data.connectHandler so dbParams can be passed during server startup, like this:
	svr.use('/data', data.connectHandler(dbParams))

UI Layer
--------
- [x] Start with example --> 2nd hand book website
	- [x] CRUD => post (Create) / get (Read) / put (Update) / delete (Delete)
- [x] use requireJS
- [x] refactor
	- [x] create data module to encapsulate all data REST calls
	- [x] remove JS code from HTML pages
- [ ] Abstract to naked objects

Dev env
-------
- [ ] Automated tests
- [ ] Automated build (cake?)
- [ ] Automated repository integration (github?)
- [ ] Dependencies:
	- [ ] connect, mongodb, underscore
	- [ ] Create module definition file with dependencies

Testing / issues
----------------
- [x] JSON GET cache problems in explorer => convert into POST with _method="get"
- [ ] Extensive cross-browser testing, especially of hash-based navigation