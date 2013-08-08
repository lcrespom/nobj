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
	cmd = commands.coffee_compile('coffee_src/', '.')
	ctrl.log('Running command: ' + cmd)
	exec(cmd, (err, stdout, stderr) ->
		ctrl.log(stdout + stderr) if stdout.length > 0 || stderr.length > 0
		if err then ctrl.fail(err)
		ctrl.success('Coffe compile OK')
	)

doBrowserify = (ctrl) ->
	ctrl.log('Joining modules using browserify, with source map')
	cmd = commands.browserify('clt/main.js', 'web/js/app.js')
	ctrl.log('Running command: ' + cmd)
	exec(cmd, (err, stdout, stderr) ->
		ctrl.log(stdout + stderr) if stdout.length > 0 || stderr.length > 0
		if err then ctrl.fail(err)
		ctrl.success('Browserify OK')
	)

doCoffeeify = (ctrl) ->
	ctrl.log('Joining modules using coffeeify, with source map')
	cmd = commands.coffeeify("coffee_src/clt/#{REQ_PREFIX}main.coffee", 'web/js/app.js')
	ctrl.log('Running command: ' + cmd)
	exec(cmd, (err, stdout, stderr) ->
		ctrl.log(stdout + stderr) if stdout.length > 0 || stderr.length > 0
		if err then ctrl.fail(err)
		ctrl.success('Coffeeify OK')
	)

doRequirify = (ctrl) ->
	ctrl.log('Prepending .coffee suffix to requires')
	files = glob.sync('coffee_src/clt/**/*.coffee')
	for fileName in files
		continue if path.basename(fileName).indexOf(REQ_PREFIX) == 0
		code = fs.readFileSync(fileName, { encoding: 'utf8' })
		reqName = path.dirname(fileName) + path.sep + REQ_PREFIX + path.basename(fileName)
		err = fs.writeFileSync(reqName, requirify(code))
		if (err) then ctrl.fail(err)
	ctrl.success('Requirify OK')

doDeleteRequirify = (ctrl) ->
	ctrl.log('Deleting intermediate requirify files')
	files = glob.sync("coffee_src/clt/**/#{REQ_PREFIX}*.coffee")
	for fileName in files
		fs.unlinkSync(fileName)
	ctrl.success('Delete requirify OK')


commands = {
	coffee_compile: (src, dest) -> "coffee --compile --output #{dest} #{src}"
	browserify: (main, app) -> "browserify --debug #{main} -o #{app}"
	coffeeify: (main, app) -> "browserify --transform coffeeify --debug #{main} -o #{app}"
}

REQ_PREFIX = '_req_'


#--------------- Internal ---------------

appendCoffee = (line) ->
	regex = /require\s*\(?\s*['"]([^"']+)['"]\s*\)?/g #'
	return line.replace(regex, (match, module) ->
		if module.indexOf('.') == 0 and not module.match(/\.js$|\.coffee$/i)
			return match.replace(module,
				path.dirname(module) + '/' + REQ_PREFIX + path.basename(module) + '.coffee')
		return match
	)

requirify = (code) ->
	lines = code.split('\n')
	newLines = []
	for line in lines
		newLines.push(appendCoffee(line))
	return newLines.join('\n')

#--------------- Main ---------------

make
	coffee:			doCoffee
	browserify:		doBrowserify
	requirify:		doRequirify
	delrequirify:	doDeleteRequirify
	coffeeify:		doCoffeeify
	coffeeify2:		['requirify', 'coffeeify', 'delrequirify']
	build:		['coffee', 'browserify']
