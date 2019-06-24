const glob = require ("glob");
const path = require ("path");
const Middleware = require ("./middleware");

class MiddlewareFile extends Middleware {
  load (directory) {
    this.directory = directory;
    this.options = {
      mark: true,
      ignore: "node_modules/**",
      cwd: this.directory,
    };
  }

  _join (filename) {
    return path.resolve (path.join (this.directory, filename));
  }

  mount () {
    this.get ("/dir/*path", (req, res, next) => {
      let dir = req.params.path || ".";
      glob (`${dir}/*`, this.options, (error, files) => {
        if (error) {
          next (error);
        } else {
          res.type ("application/json").end (JSON.stringify (files, null, 2));
        }
      });
    });
    this.get ("/raw/*path", (req, res, next) => {
      res.sendFile (this._join (req.params.path));
    });
    this.post ("/raw/*path", (req, res, next) => {
      fs.writeFile (this._join (req.params.path), req.body.data, (error) => {
        if (error) {
          next (error);
        } else {
          res.status (204).end ();
        }
      });
    });
  }
};

module.exports = MiddlewareFile;
