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
	ctrl.success('Browserify OK')


tasks =

commands = {
	coffee_compile: (src, dest) -> "coffee --compile --output #{dest} #{src}"
}


#--------------- Main ---------------

make
	coffee: doCoffee
	browserify: doBrowserify
	build: ['coffee', 'browserify']
