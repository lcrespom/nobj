// Generated by CoffeeScript 1.6.3
(function() {
  define(['nobj/nobj', 'nobj/data'], function(nobj, data) {
    var AddBookActionHandler, BookListController, DelBookActionHandler, arrayContainsElement, global, removeArrayElement, reservedColInfo, reservedTbody, user;
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
    BookListController = (function() {
      function BookListController(collection, query) {
        this.collection = collection;
        this.query = query;
      }

      BookListController.prototype.afterLoad = function() {
        user = global.nobj.collections.users.current;
        user.books = user.books || [];
        reservedColInfo = nobj.parseTableHeaders('books', $('#reserved_books_list'));
        reservedTbody = $('#reserved_books_list tbody');
        return data.get('books').done(function(result) {
          return nobj.fillTable('books', result.items, $('#books_list'));
        }).fail(function(err) {
          return alert('Error: ' + err);
        });
      };

      return BookListController;

    })();
    nobj.addActionHandler(new AddBookActionHandler());
    nobj.addActionHandler(new DelBookActionHandler());
    return {
      BookListController: BookListController
    };
  });

}).call(this);
