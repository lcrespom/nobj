(function() {
  var connect, data, launchServer, svrConfig;

  connect = require('connect');

  data = require('./data');

  data.dbConfig = {
    url: 'mongodb://localhost/test'
  };

  svrConfig = {
    port: 1337,
    host: 'localhost',
    rootDir: 'web'
  };

  launchServer = function() {
    var svr;
    svr = connect().use(connect.static(svrConfig.rootDir)).use(connect.urlencoded()).use('/data', data.connectHandler);
    svr.listen(svrConfig.port, svrConfig.host);
    return console.log("Server running at http://" + svrConfig.host + ":" + svrConfig.port + "/");
  };

  data.openDbConnection(function(err) {
    if (err) {
      return console.error('Could not connect to database', err);
    } else {
      return launchServer();
    }
  });

}).call(this);
