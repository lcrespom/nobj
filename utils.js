(function() {

  exports.jsonStringifyNoCircular = function(obj) {
    var cache, str;
    cache = [];
    str = JSON.stringify(obj, function(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) return '[CIRCULAR]';
        cache.push(value);
      }
      return value;
    }, 4);
    cache = null;
    return str;
  };

}).call(this);
