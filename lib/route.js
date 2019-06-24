const path = require ("path");

class Route {
  constructor (method, path1, handler1) {
    var paramPath;
    this.method = method;
    this.path = path1;
    this.handler = handler1;
    paramPath = path.join ("/", this.path, "/")
      .replace (/\./g, "\\.")
      .replace (/(\W)[:](\w+)/g, "$1(?<$2>\\w+)")
      .replace (/(\W)[+](\w+)/g, "$1(?<$2>\\d+)")
      .replace (/(\W)[*](\w+)/g, "$1(?<$2>.*)");
    this.pattern = new RegExp (`^${paramPath}{0,}$`);
  }
};

Route.ALL = /^.*$/i;
Route.GET = /^GET$/i;
Route.POST = /^POST$/i;
Route.PUT = /^PUT$/i;
Route.DELETE = /^DELETE$/i;

module.exports = Route;
