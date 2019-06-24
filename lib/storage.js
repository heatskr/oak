const Middleware = require ("./middleware");
const fs = require ("fs");
const path = require ("path");

class MiddlewareStorage extends Middleware {
  load (directory) {
    this.directory = directory;
  }

  mount () {
    this.get ("/", (req, res, next) => {
      fs.readdir (this.directory, (error, files) => {
        if (error) {
          res.status (500).end ();
          return;
        }
        return res.json (files);
      });
    });
    this.get ("/*path", (req, res, next) => {
      res.sendFile (path.join (this.directory, req.params.path));
    });
    this.post ("/*path", (req, res, next) => {
      const filename = path.resolve (path.join (this.directory, req.params.path));
      fs.writeFile (filename, req.body, (error) => {
        if (error) {
          next (error);
        } else {
          res.status (204).end ();
        }
      });
    });
    this.delete ("/*path", (req, res, next) => {
      const filename = path.resolve (path.join (this.directory, req.params.path));
      fs.unlink(filename, (error) => {
        if (error) {
          next (error);
        } else {
          res.status (204).end ();
        }
      });
    });
  }
};

module.exports = MiddlewareStorage;
