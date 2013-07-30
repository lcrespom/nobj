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
	exec(commands.browserify('clt/main.js', 'web/js/app.js'), (err, stdout, stderr) ->
		if err then ctrl.fail(err)
		ctrl.log(stdout + stderr) if stdout.length > 0 || stderr.length > 0
		ctrl.success('Browserify OK')
	)


commands = {
	coffee_compile: (src, dest) -> "coffee --compile --output #{dest} #{src}"
	browserify: (main, app) -> "browserify #{main} -o #{app}"
}


#--------------- Main ---------------

make
	coffee: doCoffee
	browserify: doBrowserify
	build: ['coffee', 'browserify']
