const crypto = require ("crypto");

class Cookie {
  static parse(str) {
    var eq_idx, i, key, len, obj, pair, pairs, val;
    if (typeof str !== "string") {
      throw new TypeError("argument str must be a string");
    }
    obj = {};
    pairs = str.split(/; */);
    for (i = 0, len = pairs.length; i < len; i++) {
      pair = pairs[i];
      eq_idx = pair.indexOf("=");
      if (eq_idx < 0) {
        // skip things that don't look like key=value
        continue;
      }
      key = pair.substr(0, eq_idx).trim();
      val = pair.substr(++eq_idx, pair.length).trim();
      if ("\"" === val[0]) {
        // quoted values
        val = val.slice(1, -1);
      }
      if (void 0 === obj[key]) {
        // only assign once
        obj[key] = this._tryDecode(val);
      }
    }
    return obj;
  }

  static _tryDecode(str) {
    var e;
    try {
      return decodeURIComponent(str);
    } catch (error) {
      e = error;
      return str;
    }
  }

  static serialize(name, val, opt = {}) {
    var maxAge, sameSite, str, value;
    if (!this.fieldContentRegExp.test(name)) {
      throw new TypeError("argument name is invalid");
    }
    value = encodeURIComponent(val);
    if (value && !this.fieldContentRegExp.test(value)) {
      throw new TypeError("argument val is invalid");
    }
    str = `${name}=${value}`;
    if (opt.maxAge != null) {
      maxAge = opt.maxAge - 0;
      if (isNaN(maxAge)) {
        throw new Error("maxAge should be a Number");
      }
      str += `; Max-Age=${Math.floor(maxAge)}`;
    }
    if (opt.domain) {
      if (!this.fieldContentRegExp.test(opt.domain)) {
        throw new TypeError("option domain is invalid");
      }
      str += `; Domain=${opt.domain}`;
    }
    if (opt.path) {
      if (!this.fieldContentRegExp.test(opt.path)) {
        throw new TypeError("option path is invalid");
      }
      str += `; Path=${opt.path}`;
    }
    if (opt.expires) {
      if (typeof opt.expires.toUTCString !== "function") {
        throw new TypeError("option expires is invalid");
      }
      str += `; Expires=${opt.expires.toUTCString()}`;
    }
    if (opt.httpOnly) {
      str += "; HttpOnly";
    }
    if (opt.secure) {
      str += "; Secure";
    }
    if (opt.sameSite) {
      sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
      switch (sameSite) {
        case true:
          str += "; SameSite=Strict";
          break;
        case "lax":
          str += "; SameSite=Lax";
          break;
        case "strict":
          str += "; SameSite=Strict";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return str;
  }

  static sign(val, secret) {
    if ("string" !== typeof val) {
      throw new TypeError("Cookie value must be provided as a string.");
    }
    if ("string" !== typeof secret) {
      throw new TypeError("Secret string must be provided.");
    }
    return val + "." + crypto.createHmac("sha256", secret).update(val).digest("base64").replace(/\=+$/, "");
  }

  static unsign(val, secret) {
    var mac, macBuffer, str, valBuffer;
    if ("string" !== typeof val) {
      throw new TypeError("Signed cookie string must be provided.");
    }
    if ("string" !== typeof secret) {
      throw new TypeError("Secret string must be provided.");
    }
    str = val.slice(0, val.lastIndexOf('.'));
    mac = this.sign(str, secret);
    macBuffer = Buffer.from(mac);
    valBuffer = Buffer.alloc(macBuffer.length);
    valBuffer.write(val);
    if (crypto.timingSafeEqual(macBuffer, valBuffer)) {
      return str;
    } else {
      return false;
    }
  }

};

Cookie.fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

module.exports = Cookie;
