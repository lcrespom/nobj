# Node requires
exec = require('child_process').exec
fs = require('fs')
path = require('path')

# Third party requires
glob = require('glob')

# Own requires
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

doRequirify = (ctrl) ->
	requirify = (code) -> code	#TODO implement parsing
	ctrl.log('Prepending .coffee suffix to requires')
	files = glob.sync('coffee_src/clt/**/*.coffee')
	for fileName in files
		code = fs.readFileSync(fileName, { encoding: 'utf8' })
		reqName = path.dirname(fileName) + path.sep + '_requirify_' + path.basename(fileName)
		err = fs.writeFileSync(reqName, requirify(code))
		if (err) then ctrl.fail(err)
	ctrl.success('Requirify OK')

doDeleteRequirify = (ctrl) ->
	ctrl.log('Deleting intermediate requirify files')
	files = glob.sync('coffee_src/clt/**/_requirify_*.coffee')
	for fileName in files
		fs.unlinkSync(fileName)
	ctrl.success('Delete requirify OK')


commands = {
	coffee_compile: (src, dest) -> "coffee --compile --output #{dest} #{src}"
	browserify: (main, app) -> "browserify --debug #{main} -o #{app}"
	coffeeify: (main, app) -> "browserify --transform coffeeify --debug #{main} -o #{app}"
}


#--------------- Main ---------------

make
	coffee:			doCoffee
	browserify:		doBrowserify
	requirify:		doRequirify
	delrequirify:	doDeleteRequirify
	coffeeify:		doCoffeeify
	coffeeify2:		['requirify', 'coffeeify', 'delrequirify']
	build:		['coffee', 'browserify']
