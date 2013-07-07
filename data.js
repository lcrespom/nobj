(function() {
  var MongoClient, ObjectID, connectDB, dataHandler, db, doDelete, doGet, doPost, doPut, respondJson, url, utils, _;

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
    var collName, collection, oid, parsedUrl, pathParts;
    parsedUrl = url.parse(req.url, true);
    console.log("\n--- " + req.method + " ---");
    console.log(parsedUrl.pathname, parsedUrl.query);
    pathParts = parsedUrl.pathname.split('/');
    collName = pathParts[1];
    oid = pathParts[2];
    if (!collName) {
      next("Invalid request path: " + parsedUrl.pathname + " - missing collection name");
      return;
    }
    collection = db.collection(collName);
    console.log("Collection: " + collection.collectionName);
    switch (req.method) {
      case 'GET':
        return doGet(req, res, next, collection, parsedUrl, oid);
      case 'POST':
        return doPost(req, res, next, collection, parsedUrl, oid);
      case 'PUT':
        return doPut(req, res, next, collection, parsedUrl, oid);
      case 'DELETE':
        return doDelete(req, res, next, collection, parsedUrl, oid);
      default:
        return next("Method '" + req.method + "' not supported");
    }
  };

  doGet = function(req, res, next, collection, parsedUrl, oid) {
    if (_.isEmpty(parsedUrl.query)) {
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

  doPost = function(req, res, collection, parsedUrl, oid) {
    throw 'POST not yet supported';
  };

  doPut = function(req, res, collection, parsedUrl, oid) {
    throw 'PUT not yet supported';
  };

  doDelete = function(req, res, collection, parsedUrl, oid) {
    throw 'DELETE not yet supported';
  };

  respondJson = function(res, obj) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    if (!obj) {
      return res.end('{ result: <null> }');
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
