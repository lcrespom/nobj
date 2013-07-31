exec = require('child_process').exec
make = require('./myMake')


#--------------- Tasks ---------------

doCoffee = (ctrl) ->
	ctrl.log('Compiling coffee files')
	exec(commands.coffee_compile('coffee_src/', '.'), (err, stdout, stderr) ->
		if err then ctrl.fail(err)
		ctrl.log(stdout + stderr) if stdout.length > 0 || stderr.length > 0
		ctrl.success('Coffe compile OK')
	)

doBrowserify = (ctrl) ->
	ctrl.log('Joining modules using browserify, with source map')
	exec(commands.browserify('clt/main.js', 'web/js/app.js'), (err, stdout, stderr) ->
		if err then ctrl.fail(err)
		ctrl.log(stdout + stderr) if stdout.length > 0 || stderr.length > 0
		ctrl.success('Browserify OK')
	)

doCoffeeify = (ctrl) ->
	ctrl.log('Joining modules using coffeeify, with source map')
	exec(commands.coffeeify('coffee_src/clt/main.coffee', 'web/js/app.js'), (err, stdout, stderr) ->
		if err then ctrl.fail(err)
		ctrl.log(stdout + stderr) if stdout.length > 0 || stderr.length > 0
		ctrl.success('Coffeeify OK')
	)


commands = {
	coffee_compile: (src, dest) -> "coffee --compile --output #{dest} #{src}"
	browserify: (main, app) -> "browserify --debug #{main} -o #{app}"
	coffeeify: (main, app) -> "browserify --transform coffeeify --debug #{main} -o #{app}"
}


#--------------- Main ---------------

make
	coffee:		doCoffee
	browserify:	doBrowserify
	coffeeify:	doCoffeeify
	build:		['coffee', 'browserify']
