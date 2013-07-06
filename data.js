(function() {
  var connectDB, dataHandler, db, doGet, doPost, mongo, url, utils;

  mongo = require('mongodb').MongoClient;

  url = require('url');

  utils = require('./utils');

  db = null;

  connectDB = function(callback) {
    return mongo.connect(exports.dbConfig.url, function(err, dbConnection) {
      db = dbConnection;
      return callback(err);
    });
  };

  dataHandler = function(req, res, next) {
    switch (req.method) {
      case 'GET':
        return doGet(req, res);
      case 'POST':
        return doPost(req, res);
      default:
        return next('Method not supported');
    }
  };

  doGet = function(req, res) {
    var parsedUrl;
    parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl);
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    return res.end(utils.jsonStringifyNoCircular(req));
  };

  doPost = function(req, res) {
    throw 'Not supported';
  };

  exports.openDbConnection = connectDB;

  exports.connectHandler = dataHandler;

  exports.dbConfig = {};

}).call(this);
