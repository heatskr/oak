const {URL} = require ("url");
const path = require ("path");

class Request {
  constructor(_request) {
    var url;
    this._request = _request;
    this.type = this._request.headers ["content-type"];
    this.method = this._request.method;
    url = new URL (`http://${this._request.headers ["host"]}${this._request.url}`);
    this.href = url.href;
    this.origin = url.origin;
    this.protocol = url.protocol;
    this.username = url.username;
    this.password = url.password;
    this.host = url.host;
    this.hostname = url.hostname;
    this.port = url.port;
    this.pathname = url.pathname;
    this.search = url.search;
    this.hash = url.hash;
    this.path = decodeURI (path.join (url.pathname));
    this.params = {};
    this.query = {};
    url.searchParams.forEach ((value, key, list) => {
      if (this.query [key]) {
        if (Array.isArray(this.query [key])) {
          return this.query [key].push(value);
        } else {
          return this.query [key] = [this.query [key], value];
        }
      } else {
        return this.query [key] = value;
      }
    });
  }
};

Request.prototype.type = "text/plain";
Request.prototype.method = "GET";
Request.prototype.href = null;
Request.prototype.origin = null;
Request.prototype.protocol = null;
Request.prototype.username = null;
Request.prototype.password = null;
Request.prototype.host = null;
Request.prototype.hostname = null;
Request.prototype.port = null;
Request.prototype.pathname = null;
Request.prototype.search = null;
Request.prototype.hash = null;
Request.prototype.params = null;
Request.prototype.query = null;
Request.prototype.cookies = null;
Request.prototype.session = null;
Request.prototype.body = null;

module.exports = Request;
