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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXExsdWlzXFxnaXRcXG5vYmpcXGNvZmZlZV9zcmNcXGNsdFxcX3JlcV9tYWluLmNvZmZlZSIsIkM6XFxVc2Vyc1xcTGx1aXNcXGdpdFxcbm9ialxcY29mZmVlX3NyY1xcY2x0XFxfcmVxX3VzZXJzLmNvZmZlZSIsIkM6XFxVc2Vyc1xcTGx1aXNcXGdpdFxcbm9ialxcY29mZmVlX3NyY1xcY2x0XFxub2JqXFxfcmVxX2NvbnRyb2xsZXJzLmNvZmZlZSIsIkM6XFxVc2Vyc1xcTGx1aXNcXGdpdFxcbm9ialxcY29mZmVlX3NyY1xcY2x0XFxub2JqXFxfcmVxX2RhdGEuY29mZmVlIiwiQzpcXFVzZXJzXFxMbHVpc1xcZ2l0XFxub2JqXFxjb2ZmZWVfc3JjXFxjbHRcXG5vYmpcXF9yZXFfbmF2LmNvZmZlZSIsIkM6XFxVc2Vyc1xcTGx1aXNcXGdpdFxcbm9ialxcY29mZmVlX3NyY1xcY2x0XFxub2JqXFxfcmVxX25vYmouY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBLGtDQUFBOztBQUFBLENBQUEsRUFBQSxJQUFNLGlCQUFBOztBQUNOLENBREEsRUFDYyxJQUFBLElBQWQscUJBQWM7O0FBQ2QsQ0FGQSxFQUVRLEVBQVIsRUFBUSxjQUFBOztBQUdSLENBQUEsR0FBRyxFQUFPLENBQVY7Q0FDQyxDQUFBLENBQ0MsR0FESyxDQUFOO0NBQ0MsQ0FBSyxDQUFMLENBQUEsS0FBSztDQUFMLENBQ00sQ0FBQSxDQUFOLEtBQU07Q0FETixDQUVPLENBQUEsQ0FBUCxDQUFBLElBQU87Q0FKVCxHQUNDO0VBTkQ7O0FBWUEsQ0FaQSxNQVlBLElBQVcsRUFBWDs7QUFDQSxDQWJBLE1BYUEsSUFBVyxFQUFYOztBQUNBLENBZEEsQ0FnQkMsQ0FGbUIsQ0FBQSxDQUNWLE1BRHFCLENBRTlCLENBRkQsRUFBb0IsR0FDZjs7QUFHTCxDQWxCQSxDQWtCd0MsU0FBN0IsQ0FBWCxDQUFBOztBQUdBLENB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LENBQU8sRUFBQTtBQUNQLENBQUE7VUFBQSxrQ0FBQTt3QkFBQTtDQUNDLENBQXFDLENBQTNCLENBQUMsRUFBWCxDQUFBLENBQVUsRUFBQSxHQUFBOztDQUNILENBQU0sTUFBYjtRQURBO0NBQUEsR0FFSSxFQUFKLENBQUE7Q0FIRDtxQkFIVTtDQWxDSyxFQWtDTDtDQWxDSyxDQTJDaEIsQ0FBVSxDQUFBLElBQVYsQ0FBVztDQUNWLE9BQUEsdUNBQUE7Q0FBQTtDQUFBO1VBQUEsaUNBQUE7d0JBQUE7Q0FDQyxFQUFVLEVBQUEsQ0FBVixDQUFBO0NBQUEsRUFDUSxDQUFJLENBQVosQ0FBQSxDQUFtQjtDQUNuQixHQUFHLENBQUgsQ0FBQTtDQUFjLEVBQUEsRUFBQSxFQUFPO01BQXJCLEVBQUE7Q0FBQTtRQUhEO0NBQUE7cUJBRFM7Q0EzQ00sRUEyQ047Q0EzQ00sQ0FpRGhCLENBQU0sQ0FBTixLQUFPLENBQUQ7Q0FBMkIsQ0FBaUIsRUFBbEIsS0FBa0IsQ0FBdEIsQ0FBQTtDQWpEWixFQWlEVjtDQWpEVSxDQW1EaEIsQ0FBQSxDQUFLLEtBQUMsQ0FBRDtDQUEyQixDQUFnQixDQUFyQixDQUFJLEtBQWlCLENBQXJCLENBQUE7Q0FuRFgsRUFtRFg7Q0FuRFcsQ0FxRGhCLGNBQUE7Q0FyRGdCLENBdURoQixXQUFBO0NBdkRnQixDQXlEaEIsQ0FBaUIsQ0FBQSxLQUFDLENBQUQsS0FBakI7Q0FDQyxPQUFBLG1CQUFBO0NBQUEsQ0FBQSxDQUFXLENBQVgsSUFBQTtBQUNBLENBQUEsUUFBQSw0Q0FBQTtvQ0FBQTtDQUNDLEdBQUcsRUFBSCxDQUFHLEdBQUE7Q0FDRixDQUF3QyxDQUFqQyxDQUFQLEdBQU8sQ0FBUCxFQUFPO0NBQVAsR0FDQSxHQUFBLENBQUE7UUFIRjtDQUFBLElBREE7Q0FLQSxDQUFjLEVBQVAsSUFBQSxHQUFBO0NBL0RRLEVBeURDO0NBakdsQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsibmF2ID0gcmVxdWlyZSgnLi9ub2JqL19yZXFfbmF2LmNvZmZlZScpXG5jb250cm9sbGVycyA9IHJlcXVpcmUoJy4vbm9iai9fcmVxX2NvbnRyb2xsZXJzLmNvZmZlZScpXG51c2VycyA9IHJlcXVpcmUoJy4vX3JlcV91c2Vycy5jb2ZmZWUnKVxuXG4jIFRoaXMgaXMgdG8gYXZvaWQgc2lsbHkgZXJyb3JzIGluIElFIHdoZW4gY29tcGF0aWJpbGl0eSBtb2RlIGlzIGRpc2FibGVkXG5pZiAhd2luZG93LmNvbnNvbGVcblx0d2luZG93LmNvbnNvbGUgPVxuXHRcdGxvZzogLT5cblx0XHR3YXJuOiAtPlxuXHRcdGVycm9yOiAtPlxuXG4jICBSZWdpc3RlciBjb250cm9sbGVyc1xuY29udHJvbGxlcnMuYWRkQ29sbGVjdGlvbignYm9va3MnKVxuY29udHJvbGxlcnMuYWRkQ29sbGVjdGlvbigndXNlcnMnKVxudXNlckVkaXRDaGFpbiA9IG5ldyBjb250cm9sbGVycy5DaGFpbkNvbnRyb2xsZXIoW1xuXHRuZXcgdXNlcnMuVXNlckVkaXRDb250cm9sbGVyKClcblx0Y29udHJvbGxlcnMuZ2V0Q29udHJvbGxlcigndXNlcnMvZWRpdCcpXG5dKVxuY29udHJvbGxlcnMuc2V0Q29udHJvbGxlcigndXNlcnMvZWRpdCcsIHVzZXJFZGl0Q2hhaW4pXG5cbiMgU2V0IHJlZ2lzdGVyZWQgY29udHJvbGxlcnMgdG8gdGhlIG5hdmlnYXRpb24gY29udHJvbGxlclxubmF2LmdldENvbnRyb2xsZXIgPSBjb250cm9sbGVycy5nZXRDb250cm9sbGVyXG5cbiMgTmF2aWdhdGUgdG8gdGhlIGRlZmF1bHQgcGFnZVxubmF2LnNldE5hdmlnYXRpb25BcmVhKCduYXZBcmVhJywgJ2NvbGxlY3Rpb25zJylcblxuJCAtPiBuYXYubG9hZERlZmF1bHRWaWV3KClcbiIsIm5vYmogPSByZXF1aXJlKCcuL25vYmovX3JlcV9ub2JqLmNvZmZlZScpXG5kYXRhID0gcmVxdWlyZSgnLi9ub2JqL19yZXFfZGF0YS5jb2ZmZWUnKVxuXG5cbmdsb2JhbCA9IEBcbnJlc2VydmVkQ29sSW5mbyA9IG51bGxcbnVzZXIgPSBudWxsXG5yZXNlcnZlZFRib2R5ID0gbnVsbFxuXG5yZW1vdmVBcnJheUVsZW1lbnQgPSAoYSwgZSkgLT5cblx0cmV0ID0gW11cblx0Zm9yIGVsZW0gaW4gYVxuXHRcdGlmIGVsZW0gIT0gZSB0aGVuIHJldC5wdXNoKGVsZW0pXG5cdHJldHVybiByZXRcblxuYXJyYXlDb250YWluc0VsZW1lbnQgPSAoYSwgZSkgLT5cblx0Zm9yIGVsZW0gaW4gYVxuXHRcdGlmIGVsZW0gPT0gZSB0aGVuIHJldHVybiB0cnVlXG5cdHJldHVybiBmYWxzZVxuXG5cbmNsYXNzIEFkZEJvb2tBY3Rpb25IYW5kbGVyXG5cdGFjdGlvbk1hc2s6ICckYWRkLWJvb2snXG5cdGdldEhUTUw6IChjb2xsZWN0aW9uKSAtPiAnPGEgY2xhc3M9XCJhZGRMaW5rXCIgaHJlZj1cIiNcIj5SZXNlcnZlPC9hPidcblx0c3Vic2NyaWJlOiAoY29sbGVjdGlvbiwgZG9tTm9kZSwgaXRlbSkgLT5cblx0XHQkKCdhLmFkZExpbmsnLCBkb21Ob2RlKS5jbGljayggLT5cblx0XHRcdGlmIGFycmF5Q29udGFpbnNFbGVtZW50KHVzZXIuYm9va3MsIGl0ZW0uX2lkKSB0aGVuIHJldHVybiBmYWxzZVxuXHRcdFx0dXNlci5ib29rcy5wdXNoKGl0ZW0uX2lkKVxuXHRcdFx0cmVzZXJ2ZWRUYm9keS5hcHBlbmQobm9iai5idWlsZFRhYmxlUm93KGNvbGxlY3Rpb24sIGl0ZW0sIHJlc2VydmVkQ29sSW5mbykpXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHQpXG5cbmNsYXNzIERlbEJvb2tBY3Rpb25IYW5kbGVyXG5cdGFjdGlvbk1hc2s6ICckZGVsLWJvb2snXG5cdGdldEhUTUw6IChjb2xsZWN0aW9uKSAtPiAnPGEgY2xhc3M9XCJkZWxMaW5rXCIgaHJlZj1cIiNcIj5SZW1vdmU8L2E+J1xuXHRzdWJzY3JpYmU6IChjb2xsZWN0aW9uLCBkb21Ob2RlLCBpdGVtKSAtPlxuXHRcdCQoJ2EuZGVsTGluaycsIGRvbU5vZGUpLmNsaWNrKCAtPlxuXHRcdFx0dXNlci5ib29rcyA9IHJlbW92ZUFycmF5RWxlbWVudCh1c2VyLmJvb2tzLCBpdGVtLl9pZClcblx0XHRcdCQobm9iai5nZXRQYXJlbnROb2RlKGRvbU5vZGUuZ2V0KDApLCAnVFInKSkucmVtb3ZlKClcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdClcblxuY2xhc3MgVXNlckVkaXRDb250cm9sbGVyXG5cdGNvbnN0cnVjdG9yOiAoQGNvbGxlY3Rpb24sIEBxdWVyeSkgLT5cblx0YWZ0ZXJMb2FkOiAtPlxuXHRcdCMgUHJlcGFyZSB2YXJpYWJsZXMgdXNlZCBieSBBZGRCb29rQWN0aW9uSGFuZGxlclxuXHRcdHVzZXIgPSBnbG9iYWwubm9iai5jb2xsZWN0aW9ucy51c2Vycy5jdXJyZW50XG5cdFx0dXNlci5ib29rcyA9IHVzZXIuYm9va3MgfHwgW11cblx0XHRyZXNlcnZlZENvbEluZm8gPSBub2JqLnBhcnNlVGFibGVIZWFkZXJzKCdib29rcycsICQoJyNyZXNlcnZlZF9ib29rc19saXN0JykpXG5cdFx0cmVzZXJ2ZWRUYm9keSA9ICQoJyNyZXNlcnZlZF9ib29rc19saXN0IHRib2R5Jylcblx0XHQjIEZpbGwgYm9vayB0YWJsZVxuXHRcdGRhdGEuZ2V0KCdib29rcydcblx0XHQpLmRvbmUoIChyZXN1bHQpIC0+XG5cdFx0XHRub2JqLmZpbGxUYWJsZSgnYm9va3MnLCByZXN1bHQuaXRlbXMsICQoJyNib29rc19saXN0JykpXG5cdFx0KS5mYWlsKCAoZXJyKSAtPlxuXHRcdFx0YWxlcnQgJ0Vycm9yOiAnICsgZXJyXG5cdFx0KVxuXHRcdCMgQ2FwdHVyZSBmb3JtIHN1Ym1pdCBpbiBvcmRlciB0byBwb3B1bGF0ZSBib29rIGxpc3Rcblx0XHQkKCcjdXNlcnNfZWRpdCcpLnN1Ym1pdCggLT5cblx0XHRcdCNUT0RPIGFkZCBoaWRkZW4gZmllbGQgd2l0aCBKU09OIG9mIHVzZXIuYm9va3Ncblx0XHQpXG5cblxubm9iai5hZGRBY3Rpb25IYW5kbGVyKG5ldyBBZGRCb29rQWN0aW9uSGFuZGxlcigpKVxubm9iai5hZGRBY3Rpb25IYW5kbGVyKG5ldyBEZWxCb29rQWN0aW9uSGFuZGxlcigpKVxuXG5leHBvcnRzLlVzZXJFZGl0Q29udHJvbGxlciA9IFVzZXJFZGl0Q29udHJvbGxlclxuXG4iLCJub2JqID0gcmVxdWlyZSgnLi9fcmVxX25vYmouY29mZmVlJylcbmRhdGEgPSByZXF1aXJlKCcuL19yZXFfZGF0YS5jb2ZmZWUnKVxuXG5nbG9iYWwgPSBAXG5jb250cm9sbGVycyA9IHt9XG5cblxuIy0tLS0tIENSVUQgY29udHJvbGxlcnMgLS0tLS1cblxuY2xhc3MgQ3JlYXRpbmdDb250cm9sbGVyXG5cdGNvbnN0cnVjdG9yOiAoQGNvbGxlY3Rpb24sIEBxdWVyeSkgLT5cblx0YWZ0ZXJMb2FkOiAtPlxuXHRcdGZvcm0gPSAkKEBxdWVyeSlcblx0XHRmb3JtLnN1Ym1pdCggPT5cblx0XHRcdG5vYmoucG9zdChmb3JtLCBAY29sbGVjdGlvblxuXHRcdFx0KS5kb25lKCAtPlxuXHRcdFx0XHRhbGVydCgnTmV3IGl0ZW0gYWRkZWQnKVxuXHRcdFx0KS5mYWlsKCAtPlxuXHRcdFx0XHRhbGVydCgnRXJyb3Igd2hpbGUgYWRkaW5nIGl0ZW0nKVxuXHRcdFx0KVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0KVxuXG5jbGFzcyBVcGRhdGluZ0NvbnRyb2xsZXJcblx0Y29uc3RydWN0b3I6IChAY29sbGVjdGlvbiwgQHF1ZXJ5KSAtPlxuXHRhZnRlckxvYWQ6IC0+XG5cdFx0Zm9ybSA9ICQoQHF1ZXJ5KVxuXHRcdG5vYmoub2JqMmZvcm0oZ2xvYmFsLm5vYmouY29sbGVjdGlvbnNbQGNvbGxlY3Rpb25dLmN1cnJlbnQsIGZvcm0pXG5cdFx0Zm9ybS5zdWJtaXQoID0+XG5cdFx0XHRub2JqLnB1dChmb3JtLCBAY29sbGVjdGlvblxuXHRcdFx0KS5kb25lKCAtPlxuXHRcdFx0XHRhbGVydCgnSXRlbSBTYXZlZCcpXG5cdFx0XHQpLmZhaWwoLT5cblx0XHRcdFx0YWxlcnQoJ0Vycm9yIHdoaWxlIHVwZGF0aW5nIGl0ZW0nKVxuXHRcdFx0KVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0KVxuXG5jbGFzcyBMaXN0aW5nQ29udHJvbGxlclxuXHRjb25zdHJ1Y3RvcjogKEBjb2xsZWN0aW9uLCBAcXVlcnkpIC0+XG5cdGFmdGVyTG9hZDogLT5cblx0XHRkYXRhLmdldChAY29sbGVjdGlvblxuXHRcdCkuZG9uZSggKHJlc3VsdCkgPT5cblx0XHRcdG5vYmouZmlsbFRhYmxlKEBjb2xsZWN0aW9uLCByZXN1bHQuaXRlbXMsICQoQHF1ZXJ5KSlcblx0XHQpLmZhaWwoIChlcnIpIC0+XG5cdFx0XHRhbGVydCAnRXJyb3I6ICcgKyBlcnJcblx0XHQpXG5cbiMtLS0tLSBNaXNjIGNvbnRyb2xsZXJzIC0tLS0tXG5cbmNsYXNzIENoYWluQ29udHJvbGxlclxuXHRjb25zdHJ1Y3RvcjogKEBjb250cm9sbGVycykgLT5cblx0YmVmb3JlTG9hZDogLT4gZm9yIGNvbnRyb2xsZXIgaW4gQGNvbnRyb2xsZXJzXG5cdFx0Y29udHJvbGxlci5iZWZvcmVMb2FkPygpXG5cdGFmdGVyTG9hZDogLT4gZm9yIGNvbnRyb2xsZXIgaW4gQGNvbnRyb2xsZXJzXG5cdFx0Y29udHJvbGxlci5hZnRlckxvYWQ/KClcblx0YmVmb3JlVW5sb2FkOiAtPiBmb3IgY29udHJvbGxlciBpbiBAY29udHJvbGxlcnNcblx0XHRjb250cm9sbGVyLmJlZm9yZVVubGFkPygpXG5cdGFmdGVyVW5sb2FkOiAtPiBmb3IgY29udHJvbGxlciBpbiBAY29udHJvbGxlcnNcblx0XHRjb250cm9sbGVyLmFmdGVyVW5sb2FkPygpXG5cblxuIyBNYWluOiB0aGUgY3J1ZENvbnRyb2xsZXJzIG9iamVjdCBwcm92aWRlcyBhIHdheSB0byBhdXRvbWF0aWNhbGx5IHJlZ2lzdGVyIGFsbCBDUlVEIGNvbnRyb2xsZXJzXG4jXHRcdGZvciBhIGdpdmVuIGNvbGxlY3Rpb25cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRhZGRDb2xsZWN0aW9uOiAoY29sbGVjdGlvbikgLT5cblx0XHRnbG9iYWwubm9iaiA9IGdsb2JhbC5ub2JqIHx8IHt9XG5cdFx0Z2xvYmFsLm5vYmouY29sbGVjdGlvbnMgPSBnbG9iYWwubm9iai5jb2xsZWN0aW9ucyB8fCB7fVxuXHRcdGdsb2JhbC5ub2JqLmNvbGxlY3Rpb25zW2NvbGxlY3Rpb25dID0ge31cblx0XHRjb250cm9sbGVyc1tjb2xsZWN0aW9uICsgJy9saXN0J10gPSBuZXcgTGlzdGluZ0NvbnRyb2xsZXIoY29sbGVjdGlvbiwgXCIjI3tjb2xsZWN0aW9ufV9saXN0XCIpXG5cdFx0Y29udHJvbGxlcnNbY29sbGVjdGlvbiArICcvZWRpdCddID0gbmV3IFVwZGF0aW5nQ29udHJvbGxlcihjb2xsZWN0aW9uLCBcIiMje2NvbGxlY3Rpb259X2VkaXRcIilcblx0XHRjb250cm9sbGVyc1tjb2xsZWN0aW9uICsgJy9uZXcnXSA9IG5ldyBDcmVhdGluZ0NvbnRyb2xsZXIoY29sbGVjdGlvbiwgXCIjI3tjb2xsZWN0aW9ufV9uZXdcIilcblxuXHRnZXRDb250cm9sbGVyOiAodmlld0lkKSAtPiBjb250cm9sbGVyc1t2aWV3SWRdXG5cblx0c2V0Q29udHJvbGxlcjogKHZpZXdJZCwgY29udHJvbGxlcikgLT4gY29udHJvbGxlcnNbdmlld0lkXSA9IGNvbnRyb2xsZXJcblxuXHRMaXN0aW5nQ29udHJvbGxlcjogTGlzdGluZ0NvbnRyb2xsZXJcblx0VXBkYXRpbmdDb250cm9sbGVyOiBVcGRhdGluZ0NvbnRyb2xsZXJcblx0Q3JlYXRpbmdDb250cm9sbGVyOiBDcmVhdGluZ0NvbnRyb2xsZXJcblx0Q2hhaW5Db250cm9sbGVyOiBDaGFpbkNvbnRyb2xsZXJcbn1cblxuIiwiYWpheCA9IChjb2xsZWN0aW9uLCBtZXRob2QsIGRhdGEpIC0+XG5cdGRlZmVycmVkID0gJC5EZWZlcnJlZCgpXG5cdGRhdGEgPSBkYXRhIHx8IHt9XG5cdGlmIGRhdGEuY29uc3RydWN0b3IgPT0gU3RyaW5nIHRoZW4gZGF0YSArPSBcIiZfbWV0aG9kPSN7bWV0aG9kfVwiXG5cdGVsc2UgZGF0YS5fbWV0aG9kID0gbWV0aG9kXG5cdCQuYWpheChcblx0XHR0eXBlOiAnUE9TVCdcblx0XHR1cmw6IFwiL2RhdGEvI3tjb2xsZWN0aW9ufVwiXG5cdFx0ZGF0YTogZGF0YVxuXHQpLmRvbmUoIChyZXN1bHQpIC0+XG5cdFx0aWYgcmVzdWx0LmVyciB0aGVuIGRlZmVycmVkLnJlamVjdChyZXN1bHQuZXJyKVxuXHRcdGVsc2UgZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpXG5cdCkuZmFpbCggKHJlc3VsdCkgLT5cblx0XHRkZWZlcnJlZC5yZWplY3QocmVzdWx0KVxuXHQpXG5cdHJldHVybiBkZWZlcnJlZC5wcm9taXNlKClcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGdldDogKGNvbGxlY3Rpb24pIC0+XG5cdFx0cmV0dXJuIGFqYXgoY29sbGVjdGlvbiwgJ2dldCcpXG5cblx0cHV0OiAoY29sbGVjdGlvbiwgcHV0RGF0YSkgLT5cblx0XHRyZXR1cm4gYWpheChjb2xsZWN0aW9uLCAncHV0JywgcHV0RGF0YSlcblxuXHRwb3N0OiAoY29sbGVjdGlvbiwgcG9zdERhdGEpIC0+XG5cdFx0cmV0dXJuIGFqYXgoY29sbGVjdGlvbiwgJ3Bvc3QnLCBwb3N0RGF0YSlcblxuXHRkZWxldGU6IChjb2xsZWN0aW9uLCBvaWQpIC0+XG5cdFx0ZGVsRGF0YSA9IHsgX2lkOiBvaWQgfVxuXHRcdHJldHVybiBhamF4KGNvbGxlY3Rpb24sICdkZWxldGUnLCBkZWxEYXRhKVxuXG59XG4iLCIjLS0tLS0tLS0tLSBUaGUgbW9kdWxlIG9iamVjdCAtLS0tLS0tLS0tXG5uYXYgPVxuXHRvbGRWaWV3SWQ6ICcnXG5cdG5hdkFyZWE6IG51bGxcblx0aGlzdG9yeToge31cblxuXHRzZXROYXZpZ2F0aW9uQXJlYTogKGVsZW1lbnRJZCwgZGVmYXVsdFZpZXdJZCkgLT5cblx0XHRAbmF2QXJlYSA9IHsgaWQ6IGVsZW1lbnRJZCwgZGVmYXVsdFZpZXdJZDogZGVmYXVsdFZpZXdJZCB9XG5cblx0bG9hZERlZmF1bHRWaWV3OiAtPlxuXHRcdEBsb2FkVmlldyhuYXYubmF2QXJlYS5kZWZhdWx0Vmlld0lkKVxuXG5cdGxvYWRWaWV3OiAodmlld0lkKSAtPlxuXHRcdG9sZENvbnRyb2xsZXIgPSBAY29udHJvbGxlclxuXHRcdEBjb250cm9sbGVyID0gQGdldENvbnRyb2xsZXI/KHZpZXdJZClcblx0XHRpZiAoIUBjb250cm9sbGVyKSB0aGVuIGNvbnNvbGUud2FybihcIk5vIGNvbnRyb2xsZXIgZm91bmQgZm9yIHZpZXcgJyN7dmlld0lkfSdcIilcblx0XHRvbGRDb250cm9sbGVyPy5iZWZvcmVVbmxvYWQ/KEBvbGRWaWV3SWQpXG5cdFx0QGNvbnRyb2xsZXI/LmJlZm9yZUxvYWQ/KHZpZXdJZClcblx0XHR1cmwgPSB2aWV3SWQgKyAnLmh0bWwnXG5cdFx0JCgnIycgKyBAbmF2QXJlYS5pZCkubG9hZCh1cmwsICh0ZXh0LCBzdGF0dXMpID0+XG5cdFx0XHRjb25zb2xlLmxvZygnTG9hZGVkJywgdXJsLCAnLSBzdGF0dXM6Jywgc3RhdHVzKVxuXHRcdFx0b2xkQ29udHJvbGxlcj8uYWZ0ZXJVbmxvYWQ/KEBvbGRWaWV3SWQpXG5cdFx0XHRAY29udHJvbGxlcj8uYWZ0ZXJMb2FkPyh2aWV3SWQpXG5cdFx0XHRAb2xkVmlld0lkID0gdmlld0lkXG5cdFx0KVxuXG5cbiMtLS0tLS0tLS0tIFByaXZhdGUgY29kZSBhbmQgc2V0dXAgLS0tLS0tLS0tLVxuXG5oYW5kbGVIaXN0b3J5ID0gKGxvYykgLT5cblx0bmF2QXJlYSA9IG5hdi5oaXN0b3J5W2xvY11cblx0aWYgbmF2QXJlYSB0aGVuIG5hdi5uYXZBcmVhID0gbmF2QXJlYVxuXHRlbHNlIG5hdi5oaXN0b3J5W2xvY10gPSBuYXYubmF2QXJlYVxuXG53aW5kb3cub25oYXNoY2hhbmdlID0gLT5cblx0Y29uc29sZS5sb2coJ0hhc2ggY2hhbmdlZCB0byAnICsgbG9jYXRpb24uaGFzaClcblx0aWYgKCFuYXYubmF2QXJlYSkgdGhlbiBjb25zb2xlLmVycm9yKCdOYXZpZ2F0aW9uIG1vZHVsZSBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQnKVxuXHRoYW5kbGVIaXN0b3J5KGxvY2F0aW9uLmhhc2gpXG5cdGlmIGxvY2F0aW9uLmhhc2gubGVuZ3RoIDw9IDAgdGhlbiB2aWV3SWQgPSBuYXYubmF2QXJlYS5kZWZhdWx0Vmlld0lkXG5cdGVsc2Ugdmlld0lkID0gbG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSlcblx0bmF2LmxvYWRWaWV3KHZpZXdJZClcblxubW9kdWxlLmV4cG9ydHMgPSBuYXZcbiIsImRhdGEgPSByZXF1aXJlKCcuL19yZXFfZGF0YS5jb2ZmZWUnKVxuXG5jbGFzcyBFZGl0QWN0aW9uSGFuZGxlclxuXHRhY3Rpb25NYXNrOiAnJGVkaXQnXG5cdGdldEhUTUw6IChjb2xsZWN0aW9uKSAtPiAnPGEgY2xhc3M9XCJlZGl0TGlua1wiIGhyZWY9XCIjJyArIGNvbGxlY3Rpb24gKyAnL2VkaXRcIj5FZGl0PC9hPidcblx0c3Vic2NyaWJlOiAoY29sbGVjdGlvbiwgZG9tTm9kZSwgaXRlbSkgLT5cblx0XHQkKCdhLmVkaXRMaW5rJywgZG9tTm9kZSkuY2xpY2soIC0+XG5cdFx0XHRnbG9iYWwubm9iai5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uXS5jdXJyZW50ID0gaXRlbVxuXHRcdClcblxuY2xhc3MgRGVsZXRlQWN0aW9uSGFuZGxlclxuXHRhY3Rpb25NYXNrOiAnJGRlbGV0ZSdcblx0Z2V0SFRNTDogKGNvbGxlY3Rpb24pIC0+ICc8YSBjbGFzcz1cImRlbExpbmtcIiBocmVmPVwiXCI+RGVsZXRlPC9hPidcblx0c3Vic2NyaWJlOiAoY29sbGVjdGlvbiwgZG9tTm9kZSwgaXRlbSkgLT5cblx0XHQkKCdhLmRlbExpbmsnLCBkb21Ob2RlKS5jbGljayggLT5cblx0XHRcdGRhdGEuZGVsZXRlKGNvbGxlY3Rpb24sIGl0ZW0uX2lkKS5kb25lKCAocmVzdWx0KSAtPlxuXHRcdFx0XHRhbGVydCgnSXRlbSBkZWxldGVkOiAnICsgcmVzdWx0LnJlc3VsdClcblx0XHRcdFx0JChnZXRQYXJlbnROb2RlKGRvbU5vZGUuZ2V0KDApLCAnVFInKSkucmVtb3ZlKClcblx0XHRcdCkuZmFpbCggKGVycikgLT5cblx0XHRcdFx0YWxlcnQoJ0Vycm9yOiAnICsgZXJyKVxuXHRcdFx0KVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0KVxuXG5cbmdsb2JhbCA9IEBcbmFjdGlvbkhhbmRsZXJzID0gW11cblxuZ2V0UGFyZW50Tm9kZSA9IChub2RlLCBwYXJlbnROb2RlTmFtZSkgLT5cblx0d2hpbGUgbm9kZSAmJiBub2RlLm5vZGVOYW1lICE9IHBhcmVudE5vZGVOYW1lXG5cdFx0bm9kZSA9IG5vZGUucGFyZW50RWxlbWVudFxuXHRyZXR1cm4gbm9kZVxuXG5hZGRBY3Rpb25IYW5kbGVyID0gKGFjdGlvbkhhbmRsZXIpIC0+XG5cdGFjdGlvbkhhbmRsZXJzLnB1c2goYWN0aW9uSGFuZGxlcilcblxuYWRkQWN0aW9uSGFuZGxlcihuZXcgRWRpdEFjdGlvbkhhbmRsZXIoKSlcbmFkZEFjdGlvbkhhbmRsZXIobmV3IERlbGV0ZUFjdGlvbkhhbmRsZXIoKSlcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuXHQjIFByb2Nlc3NlcyB0YWJsZSBoZWFkZXIgbWV0YWRhdGEsIHByZXNlbnQgaW4gZGF0YS1ub2JqLSogYXR0cmlidXRlc1xuXHRwYXJzZVRhYmxlSGVhZGVyczogKGNvbGxlY3Rpb24sIHRhYmxlKSAtPlxuXHRcdGhlYWRzID0gJCgndGhlYWQgdHIgdGgnLCB0YWJsZSlcblx0XHRjb2xJbmZvcyA9IFtdXG5cdFx0Zm9yIGhlYWQsIGkgaW4gaGVhZHNcblx0XHRcdGhlYWROb2RlID0gJChoZWFkKVxuXHRcdFx0ZmllbGQgPSBoZWFkTm9kZS5hdHRyKCdkYXRhLW5vYmotZmllbGQnKVxuXHRcdFx0aWYgZmllbGRcblx0XHRcdFx0Y29sSW5mb3MucHVzaCh7IGZpZWxkOiBmaWVsZCB9KVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRtYXNrID0gaGVhZE5vZGUuYXR0cignZGF0YS1ub2JqLWFjdGlvbnMnKVxuXHRcdFx0XHRpZiBtYXNrXG5cdFx0XHRcdFx0W3JlcGxhY2VkLCBoYW5kbGVyc10gPSBAcHJvY2Vzc0hhbmRsZXJzKGNvbGxlY3Rpb24sIG1hc2spXG5cdFx0XHRcdFx0Y29sSW5mb3MucHVzaCh7IGh0bWw6IHJlcGxhY2VkLCBoYW5kbGVyczogaGFuZGxlcnMgfSlcblx0XHRcdFx0ZWxzZSBjb2xJbmZvcy5wdXNoKHt9KVxuXHRcdHJldHVybiBjb2xJbmZvc1xuXG5cdCMgQ3JlYXRlcyBhIHRhYmxlIHJvdyBub2RlIGJ5IGl0ZXJhdGluZyB0aGUgY29sdW1ucyBhbmQgcG9wdWxhdGluZyBkYXRhIGFuZCBhY3Rpb25zXG5cdGJ1aWxkVGFibGVSb3c6IChjb2xsZWN0aW9uLCBpdGVtLCBjb2xJbmZvcykgLT5cblx0XHRyb3dOb2RlID0gJCgnPHRyLz4nKVxuXHRcdGZvciBjb2xJbmZvIGluIGNvbEluZm9zXG5cdFx0XHRjZWxsTm9kZSA9ICQoJzx0ZC8+Jylcblx0XHRcdCNUT0RPIHNob3VsZCBwZXJmb3JtIEhUTUwgZmlsdGVyaW5nIG9mIGZpZWxkIGRhdGEgdG8gYXZvaWQgYXR0YWNrc1xuXHRcdFx0aWYgY29sSW5mby5maWVsZFxuXHRcdFx0XHRjZWxsTm9kZS5hcHBlbmQoaXRlbVtjb2xJbmZvLmZpZWxkXSB8fCAnJylcblx0XHRcdGVsc2UgaWYgY29sSW5mby5oYW5kbGVyc1xuXHRcdFx0XHRjZWxsTm9kZS5hcHBlbmQoY29sSW5mby5odG1sKVxuXHRcdFx0XHRmb3IgaGFuZGxlciBpbiBjb2xJbmZvLmhhbmRsZXJzXG5cdFx0XHRcdFx0aGFuZGxlci5zdWJzY3JpYmUoY29sbGVjdGlvbiwgY2VsbE5vZGUsIGl0ZW0pXG5cdFx0XHRyb3dOb2RlLmFwcGVuZChjZWxsTm9kZSlcblx0XHRyZXR1cm4gcm93Tm9kZVxuXG5cdGZpbGxUYWJsZTogKGNvbGxlY3Rpb24sIGl0ZW1zLCB0YWJsZSwgcm93Y2IpIC0+XG5cdFx0Y29sSW5mb3MgPSBAcGFyc2VUYWJsZUhlYWRlcnMoY29sbGVjdGlvbiwgdGFibGUpXG5cdFx0cm93cyA9ICQoJ3Rib2R5JywgdGFibGUpXG5cdFx0Zm9yIGl0ZW0gaW4gaXRlbXNcblx0XHRcdHJvd05vZGUgPSBAYnVpbGRUYWJsZVJvdyhjb2xsZWN0aW9uLCBpdGVtLCBjb2xJbmZvcylcblx0XHRcdHJvd2NiPyhpdGVtLCByb3dOb2RlKVxuXHRcdFx0cm93cy5hcHBlbmQocm93Tm9kZSlcblxuXG5cdG9iajJmb3JtOiAob2JqLCBmb3JtKSAtPlxuXHRcdGZvciBpbnB1dCBpbiAkKCdbbmFtZV0nLCBmb3JtKVxuXHRcdFx0anFJbnB1dCA9ICQoaW5wdXQpXG5cdFx0XHR2YWx1ZSA9IG9ialtqcUlucHV0LmF0dHIoJ25hbWUnKV1cblx0XHRcdGlmIHZhbHVlIHRoZW4ganFJbnB1dC52YWwodmFsdWUpXG5cblx0cG9zdDogKGZvcm0sIGNvbGxlY3Rpb24pIC0+IGRhdGEucG9zdChjb2xsZWN0aW9uLCBmb3JtLnNlcmlhbGl6ZSgpKVxuXG5cdHB1dDogKGZvcm0sIGNvbGxlY3Rpb24pIC0+IGRhdGEucHV0KGNvbGxlY3Rpb24sIGZvcm0uc2VyaWFsaXplKCkpXG5cblx0YWRkQWN0aW9uSGFuZGxlcjogYWRkQWN0aW9uSGFuZGxlclxuXG5cdGdldFBhcmVudE5vZGU6IGdldFBhcmVudE5vZGVcblxuXHRwcm9jZXNzSGFuZGxlcnM6IChjb2xsZWN0aW9uLCBtYXNrKSAtPlxuXHRcdGhhbmRsZXJzID0gW11cblx0XHRmb3IgaGFuZGxlciBpbiBhY3Rpb25IYW5kbGVyc1xuXHRcdFx0aWYgbWFzay5pbmRleE9mKGhhbmRsZXIuYWN0aW9uTWFzaykgPj0gMFxuXHRcdFx0XHRtYXNrID0gbWFzay5yZXBsYWNlKGhhbmRsZXIuYWN0aW9uTWFzaywgaGFuZGxlci5nZXRIVE1MKGNvbGxlY3Rpb24pKVxuXHRcdFx0XHRoYW5kbGVycy5wdXNoKGhhbmRsZXIpXG5cdFx0cmV0dXJuIFttYXNrLCBoYW5kbGVyc11cbn1cbiJdfQ==
;