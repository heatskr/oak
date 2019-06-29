const path = require ("path");
const fs = require ("fs");
const Route = require ("./route.js");
const Request = require ("./request.js");
const Response = require ("./response.js");

class Router {
  constructor () {
    this._routes = [];
  }

  all (path, handler) {
    this._routes.push (new Route (Route.ALL, path, handler));
    return this;
  }

  get (path, handler) {
    this._routes.push (new Route (Route.GET, path, handler));
    return this;
  }

  put (path, handler) {
    this._routes.push (new Route (Route.PUT, path, handler));
    return this;
  }

  post (path, handler) {
    this._routes.push (new Route (Route.POST, path, handler));
    return this;
  }

  delete (path, handler) {
    this._routes.push (new Route (Route.DELETE, path, handler));
    return this;
  }

  _error_handler (req, res, error) {
    console.error (error);
    let msg = (process.env.NODE_ENV === "production") ? "" : error.toString ();
    res.status (500).end (msg);
  }

  _dispatch (request, response) {
    let stop = false;
    const next = (error) => {
      if (error) {
        this._error_handler (req, res, error);
      } else {
        stop = false;
      }
    };
    let entry, it = this._routes.entries ();
    while (entry = it.next ()) {
      if (entry.done) {
        break;
      }
      let route = entry.value [1];
      if (
        route.method.test (request.method) &&
        route.pattern.test (request.path)
      ) {
        let matches = route.pattern.exec (request.path);
        request.params = matches.groups || {};
        stop = true;
        route.handler (request, response, next);
        if (stop) {
          break;
        }
      }
    }
  }

  _handler (request, response) {
    let req = new Request (request);
    let res = new Response (response);
    let data = [];
    request.on ("data", (chunk) => {
      data.push (chunk);
    });
    request.on ("end", () => {
      var error;
      try {
        if (data.length > 0) {
          data = Buffer.concat (data);
          if (req.type === "application/json") {
            data = JSON.parse (data.toString ());
          }
          req.body = data;
        }
        this._dispatch (req, res);
      } catch (error1) {
        error = error1;
        this._error_handler (req, res, error);
      }
    });
    response.on ("close", () => {
      // console.log ("#{req.method} #{response.statusCode} #{req.path} #{JSON.stringify(req.params, null, 2)}");
      console.log ("%s %i %s\n%s", req.method, response.statusCode, req.path,
        JSON.stringify(req.params, null, 2));
      // console.log ("%s %i %s\n%o\n", req.method, response.statusCode, req.path, req.params);
    });
  }

  _server () {
    const handler = this._handler.bind (this);
    return require ("http").createServer (handler);
  }

  listen (port) {
    if (this.server == null) {
      this.server = this._server();
    }
    this.port = port || process.env.PORT || 5000;
    this.server.listen (this.port, "127.0.0.1");
    return this;
  }

  folder (prefix = "", directory = "", index = "index.html") {
    this.get (path.join ("/", prefix, "*path"), (req, res, next) => {
      let filename = path.join (directory, req.params.path);
      fs.stat (filename, (error, stat) => {
        if (error) {
          res.status (404).end ("Not found");
          return;
        }
        if (index && stat.isDirectory ()) {
          filename = path.join (filename, "index.html");
        }
        res.sendFile (path.resolve (filename));
      });
    });
    return this;
  }

  use (prefix, plugin) {
    plugin.router = this;
    plugin.prefix = prefix;
    plugin.mount ();
    return this;
  }
};

Router.prototype.server = null;

module.exports = Router;
