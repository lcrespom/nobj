taskInfo = null

serialize = (taskList) ->
	runTaskFromList = (i) ->
		task = taskList[i]
		return if not task
		runTask(task, ->
			runTaskFromList(i+1)
		)
	return (ctrl) ->
		ctrl.log("Running tasks #{(''+taskList).replace(',','+')} in sequence...")
		runTaskFromList(0)

taskControl = {
	fail: (msg) ->
		@failCB(msg)
		throw(msg)
	success: (msg) ->
		console.log(msg)
		@successCB(msg)
	log: (msg) -> console.log(msg)
	warn: (msg) -> console.warn(msg)
	failCB: (msg) ->
	successCB: (msg) ->
}

runTask = (task, successCB) ->
	taskImpl = taskInfo[task]
	if !taskImpl
		taskControl.fail("Error: task '#{task}' not found")
	else if taskImpl.constructor == Array
		taskImpl = serialize(taskImpl)
	else if taskImpl.constructor != Function
		taskControl.fail("Task '#{task}' is invalid")
	if successCB then taskControl.successCB = successCB
	taskControl.task = task
	taskControl.log("Running task '#{task}'...")
	taskImpl(taskControl, process.argv[3..])

module.exports = (tasks) ->
	taskInfo = tasks
	task = process.argv[2]
	if !task
		throw('Missing task')
	runTask(task)
