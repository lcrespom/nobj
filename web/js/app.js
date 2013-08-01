;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var controllers, nav, userEditChain, users;

nav = require('./nobj/_req_nav.coffee');

controllers = require('./nobj/_req_controllers.coffee');

users = require('./_req_users.coffee');

if (!window.console) {
  window.console = {
    log: function() {},
    warn: function() {},
    error: function() {}
  };
}

controllers.addCollection('books');

controllers.addCollection('users');

userEditChain = new controllers.ChainController([new users.UserEditController(), controllers.getController('users/edit')]);

controllers.setController('users/edit', userEditChain);

nav.getController = controllers.getController;

nav.setNavigationArea('navArea', 'collections');

$(function() {
  return nav.loadDefaultView();
});


},{"./_req_users.coffee":2,"./nobj/_req_controllers.coffee":3,"./nobj/_req_nav.coffee":5}],2:[function(require,module,exports){
(function(){var AddBookActionHandler, DelBookActionHandler, UserEditController, arrayContainsElement, data, global, nobj, removeArrayElement, reservedColInfo, reservedTbody, user;

nobj = require('./nobj/_req_nobj.coffee');

data = require('./nobj/_req_data.coffee');

global = this;

reservedColInfo = null;

user = null;

reservedTbody = null;

removeArrayElement = function(a, e) {
  var elem, ret, _i, _len;
  ret = [];
  for (_i = 0, _len = a.length; _i < _len; _i++) {
    elem = a[_i];
    if (elem !== e) {
      ret.push(elem);
    }
  }
  return ret;
};

arrayContainsElement = function(a, e) {
  var elem, _i, _len;
  for (_i = 0, _len = a.length; _i < _len; _i++) {
    elem = a[_i];
    if (elem === e) {
      return true;
    }
  }
  return false;
};

AddBookActionHandler = (function() {
  function AddBookActionHandler() {}

  AddBookActionHandler.prototype.actionMask = '$add-book';

  AddBookActionHandler.prototype.getHTML = function(collection) {
    return '<a class="addLink" href="#">Reserve</a>';
  };

  AddBookActionHandler.prototype.subscribe = function(collection, domNode, item) {
    return $('a.addLink', domNode).click(function() {
      if (arrayContainsElement(user.books, item._id)) {
        return false;
      }
      user.books.push(item._id);
      reservedTbody.append(nobj.buildTableRow(collection, item, reservedColInfo));
      return false;
    });
  };

  return AddBookActionHandler;

})();

DelBookActionHandler = (function() {
  function DelBookActionHandler() {}

  DelBookActionHandler.prototype.actionMask = '$del-book';

  DelBookActionHandler.prototype.getHTML = function(collection) {
    return '<a class="delLink" href="#">Remove</a>';
  };

  DelBookActionHandler.prototype.subscribe = function(collection, domNode, item) {
    return $('a.delLink', domNode).click(function() {
      user.books = removeArrayElement(user.books, item._id);
      $(nobj.getParentNode(domNode.get(0), 'TR')).remove();
      return false;
    });
  };

  return DelBookActionHandler;

})();

UserEditController = (function() {
  function UserEditController(collection, query) {
    this.collection = collection;
    this.query = query;
  }

  UserEditController.prototype.afterLoad = function() {
    user = global.nobj.collections.users.current;
    user.books = user.books || [];
    reservedColInfo = nobj.parseTableHeaders('books', $('#reserved_books_list'));
    reservedTbody = $('#reserved_books_list tbody');
    data.get('books').done(function(result) {
      return nobj.fillTable('books', result.items, $('#books_list'));
    }).fail(function(err) {
      return alert('Error: ' + err);
    });
    return $('#users_edit').submit(function() {});
  };

  return UserEditController;

})();

nobj.addActionHandler(new AddBookActionHandler());

nobj.addActionHandler(new DelBookActionHandler());

exports.UserEditController = UserEditController;


})()
},{"./nobj/_req_data.coffee":4,"./nobj/_req_nobj.coffee":6}],3:[function(require,module,exports){
(function(){var ChainController, CreatingController, ListingController, UpdatingController, controllers, data, global, nobj;

nobj = require('./_req_nobj.coffee');

data = require('./_req_data.coffee');

global = this;

controllers = {};

CreatingController = (function() {
  function CreatingController(collection, query) {
    this.collection = collection;
    this.query = query;
  }

  CreatingController.prototype.afterLoad = function() {
    var form,
      _this = this;
    form = $(this.query);
    return form.submit(function() {
      nobj.post(form, _this.collection).done(function() {
        return alert('New item added');
      }).fail(function() {
        return alert('Error while adding item');
      });
      return false;
    });
  };

  return CreatingController;

})();

UpdatingController = (function() {
  function UpdatingController(collection, query) {
    this.collection = collection;
    this.query = query;
  }

  UpdatingController.prototype.afterLoad = function() {
    var form,
      _this = this;
    form = $(this.query);
    nobj.obj2form(global.nobj.collections[this.collection].current, form);
    return form.submit(function() {
      nobj.put(form, _this.collection).done(function() {
        return alert('Item Saved');
      }).fail(function() {
        return alert('Error while updating item');
      });
      return false;
    });
  };

  return UpdatingController;

})();

ListingController = (function() {
  function ListingController(collection, query) {
    this.collection = collection;
    this.query = query;
  }

  ListingController.prototype.afterLoad = function() {
    var _this = this;
    return data.get(this.collection).done(function(result) {
      return nobj.fillTable(_this.collection, result.items, $(_this.query));
    }).fail(function(err) {
      return alert('Error: ' + err);
    });
  };

  return ListingController;

})();

ChainController = (function() {
  function ChainController(controllers) {
    this.controllers = controllers;
  }

  ChainController.prototype.beforeLoad = function() {
    var controller, _i, _len, _ref, _results;
    _ref = this.controllers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      controller = _ref[_i];
      _results.push(typeof controller.beforeLoad === "function" ? controller.beforeLoad() : void 0);
    }
    return _results;
  };

  ChainController.prototype.afterLoad = function() {
    var controller, _i, _len, _ref, _results;
    _ref = this.controllers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      controller = _ref[_i];
      _results.push(typeof controller.afterLoad === "function" ? controller.afterLoad() : void 0);
    }
    return _results;
  };

  ChainController.prototype.beforeUnload = function() {
    var controller, _i, _len, _ref, _results;
    _ref = this.controllers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      controller = _ref[_i];
      _results.push(typeof controller.beforeUnlad === "function" ? controller.beforeUnlad() : void 0);
    }
    return _results;
  };

  ChainController.prototype.afterUnload = function() {
    var controller, _i, _len, _ref, _results;
    _ref = this.controllers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      controller = _ref[_i];
      _results.push(typeof controller.afterUnload === "function" ? controller.afterUnload() : void 0);
    }
    return _results;
  };

  return ChainController;

})();

module.exports = {
  addCollection: function(collection) {
    global.nobj = global.nobj || {};
    global.nobj.collections = global.nobj.collections || {};
    global.nobj.collections[collection] = {};
    controllers[collection + '/list'] = new ListingController(collection, "#" + collection + "_list");
    controllers[collection + '/edit'] = new UpdatingController(collection, "#" + collection + "_edit");
    return controllers[collection + '/new'] = new CreatingController(collection, "#" + collection + "_new");
  },
  getController: function(viewId) {
    return controllers[viewId];
  },
  setController: function(viewId, controller) {
    return controllers[viewId] = controller;
  },
  ListingController: ListingController,
  UpdatingController: UpdatingController,
  CreatingController: CreatingController,
  ChainController: ChainController
};


})()
},{"./_req_data.coffee":4,"./_req_nobj.coffee":6}],4:[function(require,module,exports){
var ajax;

ajax = function(collection, method, data) {
  var deferred;
  deferred = $.Deferred();
  data = data || {};
  if (data.constructor === String) {
    data += "&_method=" + method;
  } else {
    data._method = method;
  }
  $.ajax({
    type: 'POST',
    url: "/data/" + collection,
    data: data
  }).done(function(result) {
    if (result.err) {
      return deferred.reject(result.err);
    } else {
      return deferred.resolve(result);
    }
  }).fail(function(result) {
    return deferred.reject(result);
  });
  return deferred.promise();
};

module.exports = {
  get: function(collection) {
    return ajax(collection, 'get');
  },
  put: function(collection, putData) {
    return ajax(collection, 'put', putData);
  },
  post: function(collection, postData) {
    return ajax(collection, 'post', postData);
  },
  "delete": function(collection, oid) {
    var delData;
    delData = {
      _id: oid
    };
    return ajax(collection, 'delete', delData);
  }
};


},{}],5:[function(require,module,exports){
var handleHistory, nav;

nav = {
  oldViewId: '',
  navArea: null,
  history: {},
  setNavigationArea: function(elementId, defaultViewId) {
    return this.navArea = {
      id: elementId,
      defaultViewId: defaultViewId
    };
  },
  loadDefaultView: function() {
    return this.loadView(nav.navArea.defaultViewId);
  },
  loadView: function(viewId) {
    var oldController, url, _ref,
      _this = this;
    oldController = this.controller;
    this.controller = typeof this.getController === "function" ? this.getController(viewId) : void 0;
    if (!this.controller) {
      console.warn("No controller found for view '" + viewId + "'");
    }
    if (oldController != null) {
      if (typeof oldController.beforeUnload === "function") {
        oldController.beforeUnload(this.oldViewId);
      }
    }
    if ((_ref = this.controller) != null) {
      if (typeof _ref.beforeLoad === "function") {
        _ref.beforeLoad(viewId);
      }
    }
    url = viewId + '.html';
    return $('#' + this.navArea.id).load(url, function(text, status) {
      var _ref1;
      console.log('Loaded', url, '- status:', status);
      if (oldController != null) {
        if (typeof oldController.afterUnload === "function") {
          oldController.afterUnload(_this.oldViewId);
        }
      }
      if ((_ref1 = _this.controller) != null) {
        if (typeof _ref1.afterLoad === "function") {
          _ref1.afterLoad(viewId);
        }
      }
      return _this.oldViewId = viewId;
    });
  }
};

handleHistory = function(loc) {
  var navArea;
  navArea = nav.history[loc];
  if (navArea) {
    return nav.navArea = navArea;
  } else {
    return nav.history[loc] = nav.navArea;
  }
};

window.onhashchange = function() {
  var viewId;
  console.log('Hash changed to ' + location.hash);
  if (!nav.navArea) {
    console.error('Navigation module has not been initialized');
  }
  handleHistory(location.hash);
  if (location.hash.length <= 0) {
    viewId = nav.navArea.defaultViewId;
  } else {
    viewId = location.hash.substring(1);
  }
  return nav.loadView(viewId);
};

module.exports = nav;


},{}],6:[function(require,module,exports){
(function(){var DeleteActionHandler, EditActionHandler, actionHandlers, addActionHandler, data, getParentNode, global;

data = require('./_req_data.coffee');

EditActionHandler = (function() {
  function EditActionHandler() {}

  EditActionHandler.prototype.actionMask = '$edit';

  EditActionHandler.prototype.getHTML = function(collection) {
    return '<a class="editLink" href="#' + collection + '/edit">Edit</a>';
  };

  EditActionHandler.prototype.subscribe = function(collection, domNode, item) {
    return $('a.editLink', domNode).click(function() {
      return global.nobj.collections[collection].current = item;
    });
  };

  return EditActionHandler;

})();

DeleteActionHandler = (function() {
  function DeleteActionHandler() {}

  DeleteActionHandler.prototype.actionMask = '$delete';

  DeleteActionHandler.prototype.getHTML = function(collection) {
    return '<a class="delLink" href="">Delete</a>';
  };

  DeleteActionHandler.prototype.subscribe = function(collection, domNode, item) {
    return $('a.delLink', domNode).click(function() {
      data["delete"](collection, item._id).done(function(result) {
        alert('Item deleted: ' + result.result);
        return $(getParentNode(domNode.get(0), 'TR')).remove();
      }).fail(function(err) {
        return alert('Error: ' + err);
      });
      return false;
    });
  };

  return DeleteActionHandler;

})();

global = this;

actionHandlers = [];

getParentNode = function(node, parentNodeName) {
  while (node && node.nodeName !== parentNodeName) {
    node = node.parentElement;
  }
  return node;
};

addActionHandler = function(actionHandler) {
  return actionHandlers.push(actionHandler);
};

addActionHandler(new EditActionHandler());

addActionHandler(new DeleteActionHandler());

module.exports = {
  parseTableHeaders: function(collection, table) {
    var colInfos, field, handlers, head, headNode, heads, i, mask, replaced, _i, _len, _ref;
    heads = $('thead tr th', table);
    colInfos = [];
    for (i = _i = 0, _len = heads.length; _i < _len; i = ++_i) {
      head = heads[i];
      headNode = $(head);
      field = headNode.attr('data-nobj-field');
      if (field) {
        colInfos.push({
          field: field
        });
      } else {
        mask = headNode.attr('data-nobj-actions');
        if (mask) {
          _ref = this.processHandlers(collection, mask), replaced = _ref[0], handlers = _ref[1];
          colInfos.push({
            html: replaced,
            handlers: handlers
          });
        } else {
          colInfos.push({});
        }
      }
    }
    return colInfos;
  },
  buildTableRow: function(collection, item, colInfos) {
    var cellNode, colInfo, handler, rowNode, _i, _j, _len, _len1, _ref;
    rowNode = $('<tr/>');
    for (_i = 0, _len = colInfos.length; _i < _len; _i++) {
      colInfo = colInfos[_i];
      cellNode = $('<td/>');
      if (colInfo.field) {
        cellNode.append(item[colInfo.field] || '');
      } else if (colInfo.handlers) {
        cellNode.append(colInfo.html);
        _ref = colInfo.handlers;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          handler = _ref[_j];
          handler.subscribe(collection, cellNode, item);
        }
      }
      rowNode.append(cellNode);
    }
    return rowNode;
  },
  fillTable: function(collection, items, table, rowcb) {
    var colInfos, item, rowNode, rows, _i, _len, _results;
    colInfos = this.parseTableHeaders(collection, table);
    rows = $('tbody', table);
    _results = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      rowNode = this.buildTableRow(collection, item, colInfos);
      if (typeof rowcb === "function") {
        rowcb(item, rowNode);
      }
      _results.push(rows.append(rowNode));
    }
    return _results;
  },
  obj2form: function(obj, form) {
    var input, jqInput, value, _i, _len, _ref, _results;
    _ref = $('[name]', form);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      input = _ref[_i];
      jqInput = $(input);
      value = obj[jqInput.attr('name')];
      if (value) {
        _results.push(jqInput.val(value));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  },
  post: function(form, collection) {
    return data.post(collection, form.serialize());
  },
  put: function(form, collection) {
    return data.put(collection, form.serialize());
  },
  addActionHandler: addActionHandler,
  getParentNode: getParentNode,
  processHandlers: function(collection, mask) {
    var handler, handlers, _i, _len;
    handlers = [];
    for (_i = 0, _len = actionHandlers.length; _i < _len; _i++) {
      handler = actionHandlers[_i];
      if (mask.indexOf(handler.actionMask) >= 0) {
        mask = mask.replace(handler.actionMask, handler.getHTML(collection));
        handlers.push(handler);
      }
    }
    return [mask, handlers];
  }
};


})()
},{"./_req_data.coffee":4}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcZGV2dG9vbHNcXG5vZGUtanMtdGVzdHNcXG5vYmpcXGNvZmZlZV9zcmNcXGNsdFxcX3JlcV9tYWluLmNvZmZlZSIsIkM6XFxkZXZ0b29sc1xcbm9kZS1qcy10ZXN0c1xcbm9ialxcY29mZmVlX3NyY1xcY2x0XFxfcmVxX3VzZXJzLmNvZmZlZSIsIkM6XFxkZXZ0b29sc1xcbm9kZS1qcy10ZXN0c1xcbm9ialxcY29mZmVlX3NyY1xcY2x0XFxub2JqXFxfcmVxX2NvbnRyb2xsZXJzLmNvZmZlZSIsIkM6XFxkZXZ0b29sc1xcbm9kZS1qcy10ZXN0c1xcbm9ialxcY29mZmVlX3NyY1xcY2x0XFxub2JqXFxfcmVxX2RhdGEuY29mZmVlIiwiQzpcXGRldnRvb2xzXFxub2RlLWpzLXRlc3RzXFxub2JqXFxjb2ZmZWVfc3JjXFxjbHRcXG5vYmpcXF9yZXFfbmF2LmNvZmZlZSIsIkM6XFxkZXZ0b29sc1xcbm9kZS1qcy10ZXN0c1xcbm9ialxcY29mZmVlX3NyY1xcY2x0XFxub2JqXFxfcmVxX25vYmouY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBLGtDQUFBOztBQUFBLENBQUEsRUFBQSxJQUFNLGlCQUFBOztBQUNOLENBREEsRUFDYyxJQUFBLElBQWQscUJBQWM7O0FBQ2QsQ0FGQSxFQUVRLEVBQVIsRUFBUSxjQUFBOztBQUdSLENBQUEsR0FBRyxFQUFPLENBQVY7Q0FDQyxDQUFBLENBQ0MsR0FESyxDQUFOO0NBQ0MsQ0FBSyxDQUFMLENBQUEsS0FBSztDQUFMLENBQ00sQ0FBQSxDQUFOLEtBQU07Q0FETixDQUVPLENBQUEsQ0FBUCxDQUFBLElBQU87Q0FKVCxHQUNDO0VBTkQ7O0FBWUEsQ0FaQSxNQVlBLElBQVcsRUFBWDs7QUFDQSxDQWJBLE1BYUEsSUFBVyxFQUFYOztBQUNBLENBZEEsQ0FnQkMsQ0FGbUIsQ0FBQSxDQUNWLE1BRHFCLENBRTlCLENBRkQsRUFBb0IsR0FDZjs7QUFHTCxD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L19yZXFfbmF2LmNvZmZlZScpXHJcbmNvbnRyb2xsZXJzID0gcmVxdWlyZSgnLi9ub2JqL19yZXFfY29udHJvbGxlcnMuY29mZmVlJylcclxudXNlcnMgPSByZXF1aXJlKCcuL19yZXFfdXNlcnMuY29mZmVlJylcclxuXHJcbiMgVGhpcyBpcyB0byBhdm9pZCBzaWxseSBlcnJvcnMgaW4gSUUgd2hlbiBjb21wYXRpYmlsaXR5IG1vZGUgaXMgZGlzYWJsZWRcclxuaWYgIXdpbmRvdy5jb25zb2xlXHJcblx0d2luZG93LmNvbnNvbGUgPVxyXG5cdFx0bG9nOiAtPlxyXG5cdFx0d2FybjogLT5cclxuXHRcdGVycm9yOiAtPlxyXG5cclxuIyAgUmVnaXN0ZXIgY29udHJvbGxlcnNcclxuY29udHJvbGxlcnMuYWRkQ29sbGVjdGlvbignYm9va3MnKVxyXG5jb250cm9sbGVycy5hZGRDb2xsZWN0aW9uKCd1c2VycycpXHJcbnVzZXJFZGl0Q2hhaW4gPSBuZXcgY29udHJvbGxlcnMuQ2hhaW5Db250cm9sbGVyKFtcclxuXHRuZXcgdXNlcnMuVXNlckVkaXRDb250cm9sbGVyKClcclxuXHRjb250cm9sbGVycy5nZXRDb250cm9sbGVyKCd1c2Vycy9lZGl0JylcclxuXSlcclxuY29udHJvbGxlcnMuc2V0Q29udHJvbGxlcigndXNlcnMvZWRpdCcsIHVzZXJFZGl0Q2hhaW4pXHJcblxyXG4jIFNldCByZWdpc3RlcmVkIGNvbnRyb2xsZXJzIHRvIHRoZSBuYXZpZ2F0aW9uIGNvbnRyb2xsZXJcclxubmF2LmdldENvbnRyb2xsZXIgPSBjb250cm9sbGVycy5nZXRDb250cm9sbGVyXHJcblxyXG4jIE5hdmlnYXRlIHRvIHRoZSBkZWZhdWx0IHBhZ2VcclxubmF2LnNldE5hdmlnYXRpb25BcmVhKCduYXZBcmVhJywgJ2NvbGxlY3Rpb25zJylcclxuXHJcbiQgLT4gbmF2LmxvYWREZWZhdWx0VmlldygpXHJcbiIsIm5vYmogPSByZXF1aXJlKCcuL25vYmovX3JlcV9ub2JqLmNvZmZlZScpXHJcbmRhdGEgPSByZXF1aXJlKCcuL25vYmovX3JlcV9kYXRhLmNvZmZlZScpXHJcblxyXG5cclxuZ2xvYmFsID0gQFxyXG5yZXNlcnZlZENvbEluZm8gPSBudWxsXHJcbnVzZXIgPSBudWxsXHJcbnJlc2VydmVkVGJvZHkgPSBudWxsXHJcblxyXG5yZW1vdmVBcnJheUVsZW1lbnQgPSAoYSwgZSkgLT5cclxuXHRyZXQgPSBbXVxyXG5cdGZvciBlbGVtIGluIGFcclxuXHRcdGlmIGVsZW0gIT0gZSB0aGVuIHJldC5wdXNoKGVsZW0pXHJcblx0cmV0dXJuIHJldFxyXG5cclxuYXJyYXlDb250YWluc0VsZW1lbnQgPSAoYSwgZSkgLT5cclxuXHRmb3IgZWxlbSBpbiBhXHJcblx0XHRpZiBlbGVtID09IGUgdGhlbiByZXR1cm4gdHJ1ZVxyXG5cdHJldHVybiBmYWxzZVxyXG5cclxuXHJcbmNsYXNzIEFkZEJvb2tBY3Rpb25IYW5kbGVyXHJcblx0YWN0aW9uTWFzazogJyRhZGQtYm9vaydcclxuXHRnZXRIVE1MOiAoY29sbGVjdGlvbikgLT4gJzxhIGNsYXNzPVwiYWRkTGlua1wiIGhyZWY9XCIjXCI+UmVzZXJ2ZTwvYT4nXHJcblx0c3Vic2NyaWJlOiAoY29sbGVjdGlvbiwgZG9tTm9kZSwgaXRlbSkgLT5cclxuXHRcdCQoJ2EuYWRkTGluaycsIGRvbU5vZGUpLmNsaWNrKCAtPlxyXG5cdFx0XHRpZiBhcnJheUNvbnRhaW5zRWxlbWVudCh1c2VyLmJvb2tzLCBpdGVtLl9pZCkgdGhlbiByZXR1cm4gZmFsc2VcclxuXHRcdFx0dXNlci5ib29rcy5wdXNoKGl0ZW0uX2lkKVxyXG5cdFx0XHRyZXNlcnZlZFRib2R5LmFwcGVuZChub2JqLmJ1aWxkVGFibGVSb3coY29sbGVjdGlvbiwgaXRlbSwgcmVzZXJ2ZWRDb2xJbmZvKSlcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQpXHJcblxyXG5jbGFzcyBEZWxCb29rQWN0aW9uSGFuZGxlclxyXG5cdGFjdGlvbk1hc2s6ICckZGVsLWJvb2snXHJcblx0Z2V0SFRNTDogKGNvbGxlY3Rpb24pIC0+ICc8YSBjbGFzcz1cImRlbExpbmtcIiBocmVmPVwiI1wiPlJlbW92ZTwvYT4nXHJcblx0c3Vic2NyaWJlOiAoY29sbGVjdGlvbiwgZG9tTm9kZSwgaXRlbSkgLT5cclxuXHRcdCQoJ2EuZGVsTGluaycsIGRvbU5vZGUpLmNsaWNrKCAtPlxyXG5cdFx0XHR1c2VyLmJvb2tzID0gcmVtb3ZlQXJyYXlFbGVtZW50KHVzZXIuYm9va3MsIGl0ZW0uX2lkKVxyXG5cdFx0XHQkKG5vYmouZ2V0UGFyZW50Tm9kZShkb21Ob2RlLmdldCgwKSwgJ1RSJykpLnJlbW92ZSgpXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0KVxyXG5cclxuY2xhc3MgVXNlckVkaXRDb250cm9sbGVyXHJcblx0Y29uc3RydWN0b3I6IChAY29sbGVjdGlvbiwgQHF1ZXJ5KSAtPlxyXG5cdGFmdGVyTG9hZDogLT5cclxuXHRcdCMgUHJlcGFyZSB2YXJpYWJsZXMgdXNlZCBieSBBZGRCb29rQWN0aW9uSGFuZGxlclxyXG5cdFx0dXNlciA9IGdsb2JhbC5ub2JqLmNvbGxlY3Rpb25zLnVzZXJzLmN1cnJlbnRcclxuXHRcdHVzZXIuYm9va3MgPSB1c2VyLmJvb2tzIHx8IFtdXHJcblx0XHRyZXNlcnZlZENvbEluZm8gPSBub2JqLnBhcnNlVGFibGVIZWFkZXJzKCdib29rcycsICQoJyNyZXNlcnZlZF9ib29rc19saXN0JykpXHJcblx0XHRyZXNlcnZlZFRib2R5ID0gJCgnI3Jlc2VydmVkX2Jvb2tzX2xpc3QgdGJvZHknKVxyXG5cdFx0IyBGaWxsIGJvb2sgdGFibGVcclxuXHRcdGRhdGEuZ2V0KCdib29rcydcclxuXHRcdCkuZG9uZSggKHJlc3VsdCkgLT5cclxuXHRcdFx0bm9iai5maWxsVGFibGUoJ2Jvb2tzJywgcmVzdWx0Lml0ZW1zLCAkKCcjYm9va3NfbGlzdCcpKVxyXG5cdFx0KS5mYWlsKCAoZXJyKSAtPlxyXG5cdFx0XHRhbGVydCAnRXJyb3I6ICcgKyBlcnJcclxuXHRcdClcclxuXHRcdCMgQ2FwdHVyZSBmb3JtIHN1Ym1pdCBpbiBvcmRlciB0byBwb3B1bGF0ZSBib29rIGxpc3RcclxuXHRcdCQoJyN1c2Vyc19lZGl0Jykuc3VibWl0KCAtPlxyXG5cdFx0XHQjVE9ETyBhZGQgaGlkZGVuIGZpZWxkIHdpdGggSlNPTiBvZiB1c2VyLmJvb2tzXHJcblx0XHQpXHJcblxyXG5cclxubm9iai5hZGRBY3Rpb25IYW5kbGVyKG5ldyBBZGRCb29rQWN0aW9uSGFuZGxlcigpKVxyXG5ub2JqLmFkZEFjdGlvbkhhbmRsZXIobmV3IERlbEJvb2tBY3Rpb25IYW5kbGVyKCkpXHJcblxyXG5leHBvcnRzLlVzZXJFZGl0Q29udHJvbGxlciA9IFVzZXJFZGl0Q29udHJvbGxlclxyXG5cclxuIiwibm9iaiA9IHJlcXVpcmUoJy4vX3JlcV9ub2JqLmNvZmZlZScpXHJcbmRhdGEgPSByZXF1aXJlKCcuL19yZXFfZGF0YS5jb2ZmZWUnKVxyXG5cclxuZ2xvYmFsID0gQFxyXG5jb250cm9sbGVycyA9IHt9XHJcblxyXG5cclxuIy0tLS0tIENSVUQgY29udHJvbGxlcnMgLS0tLS1cclxuXHJcbmNsYXNzIENyZWF0aW5nQ29udHJvbGxlclxyXG5cdGNvbnN0cnVjdG9yOiAoQGNvbGxlY3Rpb24sIEBxdWVyeSkgLT5cclxuXHRhZnRlckxvYWQ6IC0+XHJcblx0XHRmb3JtID0gJChAcXVlcnkpXHJcblx0XHRmb3JtLnN1Ym1pdCggPT5cclxuXHRcdFx0bm9iai5wb3N0KGZvcm0sIEBjb2xsZWN0aW9uXHJcblx0XHRcdCkuZG9uZSggLT5cclxuXHRcdFx0XHRhbGVydCgnTmV3IGl0ZW0gYWRkZWQnKVxyXG5cdFx0XHQpLmZhaWwoIC0+XHJcblx0XHRcdFx0YWxlcnQoJ0Vycm9yIHdoaWxlIGFkZGluZyBpdGVtJylcclxuXHRcdFx0KVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdClcclxuXHJcbmNsYXNzIFVwZGF0aW5nQ29udHJvbGxlclxyXG5cdGNvbnN0cnVjdG9yOiAoQGNvbGxlY3Rpb24sIEBxdWVyeSkgLT5cclxuXHRhZnRlckxvYWQ6IC0+XHJcblx0XHRmb3JtID0gJChAcXVlcnkpXHJcblx0XHRub2JqLm9iajJmb3JtKGdsb2JhbC5ub2JqLmNvbGxlY3Rpb25zW0Bjb2xsZWN0aW9uXS5jdXJyZW50LCBmb3JtKVxyXG5cdFx0Zm9ybS5zdWJtaXQoID0+XHJcblx0XHRcdG5vYmoucHV0KGZvcm0sIEBjb2xsZWN0aW9uXHJcblx0XHRcdCkuZG9uZSggLT5cclxuXHRcdFx0XHRhbGVydCgnSXRlbSBTYXZlZCcpXHJcblx0XHRcdCkuZmFpbCgtPlxyXG5cdFx0XHRcdGFsZXJ0KCdFcnJvciB3aGlsZSB1cGRhdGluZyBpdGVtJylcclxuXHRcdFx0KVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdClcclxuXHJcbmNsYXNzIExpc3RpbmdDb250cm9sbGVyXHJcblx0Y29uc3RydWN0b3I6IChAY29sbGVjdGlvbiwgQHF1ZXJ5KSAtPlxyXG5cdGFmdGVyTG9hZDogLT5cclxuXHRcdGRhdGEuZ2V0KEBjb2xsZWN0aW9uXHJcblx0XHQpLmRvbmUoIChyZXN1bHQpID0+XHJcblx0XHRcdG5vYmouZmlsbFRhYmxlKEBjb2xsZWN0aW9uLCByZXN1bHQuaXRlbXMsICQoQHF1ZXJ5KSlcclxuXHRcdCkuZmFpbCggKGVycikgLT5cclxuXHRcdFx0YWxlcnQgJ0Vycm9yOiAnICsgZXJyXHJcblx0XHQpXHJcblxyXG4jLS0tLS0gTWlzYyBjb250cm9sbGVycyAtLS0tLVxyXG5cclxuY2xhc3MgQ2hhaW5Db250cm9sbGVyXHJcblx0Y29uc3RydWN0b3I6IChAY29udHJvbGxlcnMpIC0+XHJcblx0YmVmb3JlTG9hZDogLT4gZm9yIGNvbnRyb2xsZXIgaW4gQGNvbnRyb2xsZXJzXHJcblx0XHRjb250cm9sbGVyLmJlZm9yZUxvYWQ/KClcclxuXHRhZnRlckxvYWQ6IC0+IGZvciBjb250cm9sbGVyIGluIEBjb250cm9sbGVyc1xyXG5cdFx0Y29udHJvbGxlci5hZnRlckxvYWQ/KClcclxuXHRiZWZvcmVVbmxvYWQ6IC0+IGZvciBjb250cm9sbGVyIGluIEBjb250cm9sbGVyc1xyXG5cdFx0Y29udHJvbGxlci5iZWZvcmVVbmxhZD8oKVxyXG5cdGFmdGVyVW5sb2FkOiAtPiBmb3IgY29udHJvbGxlciBpbiBAY29udHJvbGxlcnNcclxuXHRcdGNvbnRyb2xsZXIuYWZ0ZXJVbmxvYWQ/KClcclxuXHJcblxyXG4jIE1haW46IHRoZSBjcnVkQ29udHJvbGxlcnMgb2JqZWN0IHByb3ZpZGVzIGEgd2F5IHRvIGF1dG9tYXRpY2FsbHkgcmVnaXN0ZXIgYWxsIENSVUQgY29udHJvbGxlcnNcclxuI1x0XHRmb3IgYSBnaXZlbiBjb2xsZWN0aW9uXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGFkZENvbGxlY3Rpb246IChjb2xsZWN0aW9uKSAtPlxyXG5cdFx0Z2xvYmFsLm5vYmogPSBnbG9iYWwubm9iaiB8fCB7fVxyXG5cdFx0Z2xvYmFsLm5vYmouY29sbGVjdGlvbnMgPSBnbG9iYWwubm9iai5jb2xsZWN0aW9ucyB8fCB7fVxyXG5cdFx0Z2xvYmFsLm5vYmouY29sbGVjdGlvbnNbY29sbGVjdGlvbl0gPSB7fVxyXG5cdFx0Y29udHJvbGxlcnNbY29sbGVjdGlvbiArICcvbGlzdCddID0gbmV3IExpc3RpbmdDb250cm9sbGVyKGNvbGxlY3Rpb24sIFwiIyN7Y29sbGVjdGlvbn1fbGlzdFwiKVxyXG5cdFx0Y29udHJvbGxlcnNbY29sbGVjdGlvbiArICcvZWRpdCddID0gbmV3IFVwZGF0aW5nQ29udHJvbGxlcihjb2xsZWN0aW9uLCBcIiMje2NvbGxlY3Rpb259X2VkaXRcIilcclxuXHRcdGNvbnRyb2xsZXJzW2NvbGxlY3Rpb24gKyAnL25ldyddID0gbmV3IENyZWF0aW5nQ29udHJvbGxlcihjb2xsZWN0aW9uLCBcIiMje2NvbGxlY3Rpb259X25ld1wiKVxyXG5cclxuXHRnZXRDb250cm9sbGVyOiAodmlld0lkKSAtPiBjb250cm9sbGVyc1t2aWV3SWRdXHJcblxyXG5cdHNldENvbnRyb2xsZXI6ICh2aWV3SWQsIGNvbnRyb2xsZXIpIC0+IGNvbnRyb2xsZXJzW3ZpZXdJZF0gPSBjb250cm9sbGVyXHJcblxyXG5cdExpc3RpbmdDb250cm9sbGVyOiBMaXN0aW5nQ29udHJvbGxlclxyXG5cdFVwZGF0aW5nQ29udHJvbGxlcjogVXBkYXRpbmdDb250cm9sbGVyXHJcblx0Q3JlYXRpbmdDb250cm9sbGVyOiBDcmVhdGluZ0NvbnRyb2xsZXJcclxuXHRDaGFpbkNvbnRyb2xsZXI6IENoYWluQ29udHJvbGxlclxyXG59XHJcblxyXG4iLCJhamF4ID0gKGNvbGxlY3Rpb24sIG1ldGhvZCwgZGF0YSkgLT5cclxuXHRkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKVxyXG5cdGRhdGEgPSBkYXRhIHx8IHt9XHJcblx0aWYgZGF0YS5jb25zdHJ1Y3RvciA9PSBTdHJpbmcgdGhlbiBkYXRhICs9IFwiJl9tZXRob2Q9I3ttZXRob2R9XCJcclxuXHRlbHNlIGRhdGEuX21ldGhvZCA9IG1ldGhvZFxyXG5cdCQuYWpheChcclxuXHRcdHR5cGU6ICdQT1NUJ1xyXG5cdFx0dXJsOiBcIi9kYXRhLyN7Y29sbGVjdGlvbn1cIlxyXG5cdFx0ZGF0YTogZGF0YVxyXG5cdCkuZG9uZSggKHJlc3VsdCkgLT5cclxuXHRcdGlmIHJlc3VsdC5lcnIgdGhlbiBkZWZlcnJlZC5yZWplY3QocmVzdWx0LmVycilcclxuXHRcdGVsc2UgZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpXHJcblx0KS5mYWlsKCAocmVzdWx0KSAtPlxyXG5cdFx0ZGVmZXJyZWQucmVqZWN0KHJlc3VsdClcclxuXHQpXHJcblx0cmV0dXJuIGRlZmVycmVkLnByb21pc2UoKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Z2V0OiAoY29sbGVjdGlvbikgLT5cclxuXHRcdHJldHVybiBhamF4KGNvbGxlY3Rpb24sICdnZXQnKVxyXG5cclxuXHRwdXQ6IChjb2xsZWN0aW9uLCBwdXREYXRhKSAtPlxyXG5cdFx0cmV0dXJuIGFqYXgoY29sbGVjdGlvbiwgJ3B1dCcsIHB1dERhdGEpXHJcblxyXG5cdHBvc3Q6IChjb2xsZWN0aW9uLCBwb3N0RGF0YSkgLT5cclxuXHRcdHJldHVybiBhamF4KGNvbGxlY3Rpb24sICdwb3N0JywgcG9zdERhdGEpXHJcblxyXG5cdGRlbGV0ZTogKGNvbGxlY3Rpb24sIG9pZCkgLT5cclxuXHRcdGRlbERhdGEgPSB7IF9pZDogb2lkIH1cclxuXHRcdHJldHVybiBhamF4KGNvbGxlY3Rpb24sICdkZWxldGUnLCBkZWxEYXRhKVxyXG5cclxufVxyXG4iLCIjLS0tLS0tLS0tLSBUaGUgbW9kdWxlIG9iamVjdCAtLS0tLS0tLS0tXHJcbm5hdiA9XHJcblx0b2xkVmlld0lkOiAnJ1xyXG5cdG5hdkFyZWE6IG51bGxcclxuXHRoaXN0b3J5OiB7fVxyXG5cclxuXHRzZXROYXZpZ2F0aW9uQXJlYTogKGVsZW1lbnRJZCwgZGVmYXVsdFZpZXdJZCkgLT5cclxuXHRcdEBuYXZBcmVhID0geyBpZDogZWxlbWVudElkLCBkZWZhdWx0Vmlld0lkOiBkZWZhdWx0Vmlld0lkIH1cclxuXHJcblx0bG9hZERlZmF1bHRWaWV3OiAtPlxyXG5cdFx0QGxvYWRWaWV3KG5hdi5uYXZBcmVhLmRlZmF1bHRWaWV3SWQpXHJcblxyXG5cdGxvYWRWaWV3OiAodmlld0lkKSAtPlxyXG5cdFx0b2xkQ29udHJvbGxlciA9IEBjb250cm9sbGVyXHJcblx0XHRAY29udHJvbGxlciA9IEBnZXRDb250cm9sbGVyPyh2aWV3SWQpXHJcblx0XHRpZiAoIUBjb250cm9sbGVyKSB0aGVuIGNvbnNvbGUud2FybihcIk5vIGNvbnRyb2xsZXIgZm91bmQgZm9yIHZpZXcgJyN7dmlld0lkfSdcIilcclxuXHRcdG9sZENvbnRyb2xsZXI/LmJlZm9yZVVubG9hZD8oQG9sZFZpZXdJZClcclxuXHRcdEBjb250cm9sbGVyPy5iZWZvcmVMb2FkPyh2aWV3SWQpXHJcblx0XHR1cmwgPSB2aWV3SWQgKyAnLmh0bWwnXHJcblx0XHQkKCcjJyArIEBuYXZBcmVhLmlkKS5sb2FkKHVybCwgKHRleHQsIHN0YXR1cykgPT5cclxuXHRcdFx0Y29uc29sZS5sb2coJ0xvYWRlZCcsIHVybCwgJy0gc3RhdHVzOicsIHN0YXR1cylcclxuXHRcdFx0b2xkQ29udHJvbGxlcj8uYWZ0ZXJVbmxvYWQ/KEBvbGRWaWV3SWQpXHJcblx0XHRcdEBjb250cm9sbGVyPy5hZnRlckxvYWQ/KHZpZXdJZClcclxuXHRcdFx0QG9sZFZpZXdJZCA9IHZpZXdJZFxyXG5cdFx0KVxyXG5cclxuXHJcbiMtLS0tLS0tLS0tIFByaXZhdGUgY29kZSBhbmQgc2V0dXAgLS0tLS0tLS0tLVxyXG5cclxuaGFuZGxlSGlzdG9yeSA9IChsb2MpIC0+XHJcblx0bmF2QXJlYSA9IG5hdi5oaXN0b3J5W2xvY11cclxuXHRpZiBuYXZBcmVhIHRoZW4gbmF2Lm5hdkFyZWEgPSBuYXZBcmVhXHJcblx0ZWxzZSBuYXYuaGlzdG9yeVtsb2NdID0gbmF2Lm5hdkFyZWFcclxuXHJcbndpbmRvdy5vbmhhc2hjaGFuZ2UgPSAtPlxyXG5cdGNvbnNvbGUubG9nKCdIYXNoIGNoYW5nZWQgdG8gJyArIGxvY2F0aW9uLmhhc2gpXHJcblx0aWYgKCFuYXYubmF2QXJlYSkgdGhlbiBjb25zb2xlLmVycm9yKCdOYXZpZ2F0aW9uIG1vZHVsZSBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQnKVxyXG5cdGhhbmRsZUhpc3RvcnkobG9jYXRpb24uaGFzaClcclxuXHRpZiBsb2NhdGlvbi5oYXNoLmxlbmd0aCA8PSAwIHRoZW4gdmlld0lkID0gbmF2Lm5hdkFyZWEuZGVmYXVsdFZpZXdJZFxyXG5cdGVsc2Ugdmlld0lkID0gbG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSlcclxuXHRuYXYubG9hZFZpZXcodmlld0lkKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuYXZcclxuIiwiZGF0YSA9IHJlcXVpcmUoJy4vX3JlcV9kYXRhLmNvZmZlZScpXHJcblxyXG5jbGFzcyBFZGl0QWN0aW9uSGFuZGxlclxyXG5cdGFjdGlvbk1hc2s6ICckZWRpdCdcclxuXHRnZXRIVE1MOiAoY29sbGVjdGlvbikgLT4gJzxhIGNsYXNzPVwiZWRpdExpbmtcIiBocmVmPVwiIycgKyBjb2xsZWN0aW9uICsgJy9lZGl0XCI+RWRpdDwvYT4nXHJcblx0c3Vic2NyaWJlOiAoY29sbGVjdGlvbiwgZG9tTm9kZSwgaXRlbSkgLT5cclxuXHRcdCQoJ2EuZWRpdExpbmsnLCBkb21Ob2RlKS5jbGljayggLT5cclxuXHRcdFx0Z2xvYmFsLm5vYmouY29sbGVjdGlvbnNbY29sbGVjdGlvbl0uY3VycmVudCA9IGl0ZW1cclxuXHRcdClcclxuXHJcbmNsYXNzIERlbGV0ZUFjdGlvbkhhbmRsZXJcclxuXHRhY3Rpb25NYXNrOiAnJGRlbGV0ZSdcclxuXHRnZXRIVE1MOiAoY29sbGVjdGlvbikgLT4gJzxhIGNsYXNzPVwiZGVsTGlua1wiIGhyZWY9XCJcIj5EZWxldGU8L2E+J1xyXG5cdHN1YnNjcmliZTogKGNvbGxlY3Rpb24sIGRvbU5vZGUsIGl0ZW0pIC0+XHJcblx0XHQkKCdhLmRlbExpbmsnLCBkb21Ob2RlKS5jbGljayggLT5cclxuXHRcdFx0ZGF0YS5kZWxldGUoY29sbGVjdGlvbiwgaXRlbS5faWQpLmRvbmUoIChyZXN1bHQpIC0+XHJcblx0XHRcdFx0YWxlcnQoJ0l0ZW0gZGVsZXRlZDogJyArIHJlc3VsdC5yZXN1bHQpXHJcblx0XHRcdFx0JChnZXRQYXJlbnROb2RlKGRvbU5vZGUuZ2V0KDApLCAnVFInKSkucmVtb3ZlKClcclxuXHRcdFx0KS5mYWlsKCAoZXJyKSAtPlxyXG5cdFx0XHRcdGFsZXJ0KCdFcnJvcjogJyArIGVycilcclxuXHRcdFx0KVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdClcclxuXHJcblxyXG5nbG9iYWwgPSBAXHJcbmFjdGlvbkhhbmRsZXJzID0gW11cclxuXHJcbmdldFBhcmVudE5vZGUgPSAobm9kZSwgcGFyZW50Tm9kZU5hbWUpIC0+XHJcblx0d2hpbGUgbm9kZSAmJiBub2RlLm5vZGVOYW1lICE9IHBhcmVudE5vZGVOYW1lXHJcblx0XHRub2RlID0gbm9kZS5wYXJlbnRFbGVtZW50XHJcblx0cmV0dXJuIG5vZGVcclxuXHJcbmFkZEFjdGlvbkhhbmRsZXIgPSAoYWN0aW9uSGFuZGxlcikgLT5cclxuXHRhY3Rpb25IYW5kbGVycy5wdXNoKGFjdGlvbkhhbmRsZXIpXHJcblxyXG5hZGRBY3Rpb25IYW5kbGVyKG5ldyBFZGl0QWN0aW9uSGFuZGxlcigpKVxyXG5hZGRBY3Rpb25IYW5kbGVyKG5ldyBEZWxldGVBY3Rpb25IYW5kbGVyKCkpXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG5cdCMgUHJvY2Vzc2VzIHRhYmxlIGhlYWRlciBtZXRhZGF0YSwgcHJlc2VudCBpbiBkYXRhLW5vYmotKiBhdHRyaWJ1dGVzXHJcblx0cGFyc2VUYWJsZUhlYWRlcnM6IChjb2xsZWN0aW9uLCB0YWJsZSkgLT5cclxuXHRcdGhlYWRzID0gJCgndGhlYWQgdHIgdGgnLCB0YWJsZSlcclxuXHRcdGNvbEluZm9zID0gW11cclxuXHRcdGZvciBoZWFkLCBpIGluIGhlYWRzXHJcblx0XHRcdGhlYWROb2RlID0gJChoZWFkKVxyXG5cdFx0XHRmaWVsZCA9IGhlYWROb2RlLmF0dHIoJ2RhdGEtbm9iai1maWVsZCcpXHJcblx0XHRcdGlmIGZpZWxkXHJcblx0XHRcdFx0Y29sSW5mb3MucHVzaCh7IGZpZWxkOiBmaWVsZCB9KVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0bWFzayA9IGhlYWROb2RlLmF0dHIoJ2RhdGEtbm9iai1hY3Rpb25zJylcclxuXHRcdFx0XHRpZiBtYXNrXHJcblx0XHRcdFx0XHRbcmVwbGFjZWQsIGhhbmRsZXJzXSA9IEBwcm9jZXNzSGFuZGxlcnMoY29sbGVjdGlvbiwgbWFzaylcclxuXHRcdFx0XHRcdGNvbEluZm9zLnB1c2goeyBodG1sOiByZXBsYWNlZCwgaGFuZGxlcnM6IGhhbmRsZXJzIH0pXHJcblx0XHRcdFx0ZWxzZSBjb2xJbmZvcy5wdXNoKHt9KVxyXG5cdFx0cmV0dXJuIGNvbEluZm9zXHJcblxyXG5cdCMgQ3JlYXRlcyBhIHRhYmxlIHJvdyBub2RlIGJ5IGl0ZXJhdGluZyB0aGUgY29sdW1ucyBhbmQgcG9wdWxhdGluZyBkYXRhIGFuZCBhY3Rpb25zXHJcblx0YnVpbGRUYWJsZVJvdzogKGNvbGxlY3Rpb24sIGl0ZW0sIGNvbEluZm9zKSAtPlxyXG5cdFx0cm93Tm9kZSA9ICQoJzx0ci8+JylcclxuXHRcdGZvciBjb2xJbmZvIGluIGNvbEluZm9zXHJcblx0XHRcdGNlbGxOb2RlID0gJCgnPHRkLz4nKVxyXG5cdFx0XHQjVE9ETyBzaG91bGQgcGVyZm9ybSBIVE1MIGZpbHRlcmluZyBvZiBmaWVsZCBkYXRhIHRvIGF2b2lkIGF0dGFja3NcclxuXHRcdFx0aWYgY29sSW5mby5maWVsZFxyXG5cdFx0XHRcdGNlbGxOb2RlLmFwcGVuZChpdGVtW2NvbEluZm8uZmllbGRdIHx8ICcnKVxyXG5cdFx0XHRlbHNlIGlmIGNvbEluZm8uaGFuZGxlcnNcclxuXHRcdFx0XHRjZWxsTm9kZS5hcHBlbmQoY29sSW5mby5odG1sKVxyXG5cdFx0XHRcdGZvciBoYW5kbGVyIGluIGNvbEluZm8uaGFuZGxlcnNcclxuXHRcdFx0XHRcdGhhbmRsZXIuc3Vic2NyaWJlKGNvbGxlY3Rpb24sIGNlbGxOb2RlLCBpdGVtKVxyXG5cdFx0XHRyb3dOb2RlLmFwcGVuZChjZWxsTm9kZSlcclxuXHRcdHJldHVybiByb3dOb2RlXHJcblxyXG5cdGZpbGxUYWJsZTogKGNvbGxlY3Rpb24sIGl0ZW1zLCB0YWJsZSwgcm93Y2IpIC0+XHJcblx0XHRjb2xJbmZvcyA9IEBwYXJzZVRhYmxlSGVhZGVycyhjb2xsZWN0aW9uLCB0YWJsZSlcclxuXHRcdHJvd3MgPSAkKCd0Ym9keScsIHRhYmxlKVxyXG5cdFx0Zm9yIGl0ZW0gaW4gaXRlbXNcclxuXHRcdFx0cm93Tm9kZSA9IEBidWlsZFRhYmxlUm93KGNvbGxlY3Rpb24sIGl0ZW0sIGNvbEluZm9zKVxyXG5cdFx0XHRyb3djYj8oaXRlbSwgcm93Tm9kZSlcclxuXHRcdFx0cm93cy5hcHBlbmQocm93Tm9kZSlcclxuXHJcblxyXG5cdG9iajJmb3JtOiAob2JqLCBmb3JtKSAtPlxyXG5cdFx0Zm9yIGlucHV0IGluICQoJ1tuYW1lXScsIGZvcm0pXHJcblx0XHRcdGpxSW5wdXQgPSAkKGlucHV0KVxyXG5cdFx0XHR2YWx1ZSA9IG9ialtqcUlucHV0LmF0dHIoJ25hbWUnKV1cclxuXHRcdFx0aWYgdmFsdWUgdGhlbiBqcUlucHV0LnZhbCh2YWx1ZSlcclxuXHJcblx0cG9zdDogKGZvcm0sIGNvbGxlY3Rpb24pIC0+IGRhdGEucG9zdChjb2xsZWN0aW9uLCBmb3JtLnNlcmlhbGl6ZSgpKVxyXG5cclxuXHRwdXQ6IChmb3JtLCBjb2xsZWN0aW9uKSAtPiBkYXRhLnB1dChjb2xsZWN0aW9uLCBmb3JtLnNlcmlhbGl6ZSgpKVxyXG5cclxuXHRhZGRBY3Rpb25IYW5kbGVyOiBhZGRBY3Rpb25IYW5kbGVyXHJcblxyXG5cdGdldFBhcmVudE5vZGU6IGdldFBhcmVudE5vZGVcclxuXHJcblx0cHJvY2Vzc0hhbmRsZXJzOiAoY29sbGVjdGlvbiwgbWFzaykgLT5cclxuXHRcdGhhbmRsZXJzID0gW11cclxuXHRcdGZvciBoYW5kbGVyIGluIGFjdGlvbkhhbmRsZXJzXHJcblx0XHRcdGlmIG1hc2suaW5kZXhPZihoYW5kbGVyLmFjdGlvbk1hc2spID49IDBcclxuXHRcdFx0XHRtYXNrID0gbWFzay5yZXBsYWNlKGhhbmRsZXIuYWN0aW9uTWFzaywgaGFuZGxlci5nZXRIVE1MKGNvbGxlY3Rpb24pKVxyXG5cdFx0XHRcdGhhbmRsZXJzLnB1c2goaGFuZGxlcilcclxuXHRcdHJldHVybiBbbWFzaywgaGFuZGxlcnNdXHJcbn1cclxuIl19
;