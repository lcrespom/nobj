// Generated by CoffeeScript 1.6.3
(function() {
  define(['./nobj', './data'], function(nobj, data) {
    var CreatingController, ListingController, UpdatingController, controllers, global;
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

      ListingController.prototype.registerActions = function(row, item) {
        var _this = this;
        $('a.editLink', row).click(function() {
          return global.nobj.collections[_this.collection].current = item;
        });
        return $('a.delLink', row).click(function() {
          data["delete"](_this.collection, item._id).done(function(result) {
            alert('Item deleted: ' + result.result);
            return row.remove();
          }).fail(function(err) {
            return alert('Error: ' + err);
          });
          return false;
        });
      };

      ListingController.prototype.fillTable = function() {
        var _this = this;
        return data.get(this.collection).done(function(result) {
          return nobj.fillTable(_this.collection, result.items, $(_this.query), function(item, row) {
            var actions;
            actions = '<a class="editLink" href="#' + _this.collection + '/edit">Edit</a>';
            actions += ' / <a class="delLink" href="">Delete</a>';
            $('td:last', row).append(actions);
            return _this.registerActions(row, item);
          });
        }).fail(function(err) {
          return alert('Error: ' + err);
        });
      };

      ListingController.prototype.afterLoad = function() {
        return this.fillTable();
      };

      return ListingController;

    })();
    return {
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
      ListingController: ListingController,
      UpdatingController: UpdatingController,
      CreatingController: CreatingController
    };
  });

}).call(this);
