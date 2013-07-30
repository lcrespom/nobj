// Generated by CoffeeScript 1.6.3
(function() {
  $(function() {
    var controllers, nav, userEditChain, users;
    nav = require('./nobj/nav');
    controllers = require('./nobj/controllers');
    users = require('./users');
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
    return nav.loadDefaultView();
  });

}).call(this);