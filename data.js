(function() {
  var MongoClient, ObjectID, connectDB, dataHandler, db, doGet, doPost, respondJson, url, utils, _;

  MongoClient = require('mongodb').MongoClient;

  ObjectID = require('mongodb').ObjectID;

  url = require('url');

  utils = require('./utils');

  _ = require('underscore');

  db = null;

  connectDB = function(callback) {
    return MongoClient.connect(exports.dbConfig.url, function(err, dbConnection) {
      db = dbConnection;
      return callback(err);
    });
  };

  dataHandler = function(req, res, next) {
    switch (req.method) {
      case 'GET':
        return doGet(req, res, next);
      case 'POST':
        return doPost(req, res, next);
      default:
        return next("Method '" + req.method + "' not supported");
    }
  };

  doGet = function(req, res, next) {
    var collName, collection, oid, parsedUrl, pathParts;
    parsedUrl = url.parse(req.url, true);
    console.log('\n--- get ---');
    console.log(parsedUrl.pathname, parsedUrl.query);
    pathParts = parsedUrl.pathname.split('/');
    collName = pathParts[1];
    if (!collName) {
      next("Invalid request path: " + parsedUrl.pathname + " - missing collection name");
      return;
    }
    collection = db.collection(collName);
    console.log("Collection: " + collection.collectionName);
    if (_.isEmpty(parsedUrl.query)) {
      oid = pathParts[2];
      if (oid) {
        return collection.findOne({
          _id: ObjectID(oid)
        }, function(err, item) {
          return respondJson(res, {
            err: err,
            item: item
          });
        });
      } else {
        return collection.find().toArray(function(err, items) {
          return respondJson(res, {
            err: err,
            items: items
          });
        });
      }
    } else {
      return collection.find(parsedUrl.query).toArray(function(err, items) {
        return respondJson(res, {
          err: err,
          items: items
        });
      });
    }
  };

  doPost = function(req, res) {
    throw 'Not supported';
  };

  respondJson = function(res, obj) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    if (!obj) {
      return res.end('<null>');
    } else if (obj.constructor === String) {
      return res.end(obj);
    } else {
      return res.end(utils.jsonStringifyNoCircular(obj));
    }
  };

  exports.openDbConnection = connectDB;

  exports.connectHandler = dataHandler;

  exports.dbConfig = {};

}).call(this);
