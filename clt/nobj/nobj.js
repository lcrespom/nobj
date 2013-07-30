// Generated by CoffeeScript 1.6.3
(function() {
  var DeleteActionHandler, EditActionHandler, actionHandlers, addActionHandler, data, getParentNode, global;

  data = require('./data');

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

}).call(this);