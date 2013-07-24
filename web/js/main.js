// Generated by CoffeeScript 1.6.3
(function() {
  require(['nobj/nav', 'nobj/crudControllers'], function(nav, crudControllers) {
    if (!window.console) {
      window.console = {
        log: function() {}
      };
    }
    window.nobj = {
      collections: {
        books: {}
      }
    };
    nav.getController = function(viewId) {
      var controllers;
      controllers = {
        list: {
          afterLoad: crudControllers.afterListLoad('books', '#books')
        },
        edit: {
          afterLoad: crudControllers.afterEditLoad('books', '#book_edit')
        },
        "new": {
          afterLoad: crudControllers.afterNewLoad('books', '#book_new')
        }
      };
      return controllers[viewId];
    };
    nav.defaultViewId = 'list';
    return nav.loadView(nav.defaultViewId);
  });

}).call(this);
