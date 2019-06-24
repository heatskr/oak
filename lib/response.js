const mime = require ("mime");
const fs = require ("fs");

class Response {
  constructor (_response) {
    this._response = _response;
  }

  status (code) {
    this._response.statusCode = code;
    return this;
  }

  set (name, value) {
    this._response.setHeader (name, value);
    return this;
  }

  json (data) {
    this._response.setHeader ("Content-Type", "application/json");
    this._response.end (JSON.stringify (data));
    return this;
  }

  end () {
    this._response.end.apply (this._response, arguments);
    return this;
  }

  sendFile (filename) {
    fs.readFile (filename,  (error, chunk) => {
      if  (error) {
        this.status (404).end ();
      } else {
        this._response.setHeader ("Content-Type", mime.lookup (filename));
        this._response.end (chunk);
      }
    });
    return this;
  }

  type (contentType) {
    this._response.setHeader ("Content-Type", contentType);
    return this;
  }
};

module.exports = Response;
