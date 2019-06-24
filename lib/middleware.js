const oak = require ("./router");
const path = require ("path");
const fs = require ("fs");
const glob = require ("glob");

class Middleware {
  constructor () {
    this.load.apply (this, arguments);
  }

  load () {}

  mount (router, path) {}

  unmount (router) {}

  all (url, handler) {
    this.router.all (path.join ("/", this.prefix, url), handler);
    return this;
  }

  get (url, handler) {
    this.router.get (path.join ("/", this.prefix, url), handler);
    return this;
  }

  post (url, handler) {
    this.router.post (path.join ("/", this.prefix, url), handler);
    return this;
  }

  put (url, handler) {
    this.router.put (path.join ("/", this.prefix, url), handler);
    return this;
  }

  delete (url, handler) {
    this.router.delete (path.join ("/", this.prefix, url), handler);
    return this;
  }
};

module.exports = Middleware;
