#!/usr/bin/env node

const Router = require ("./lib/router.js");
const router = new Router ()
.folder ("/", process.argv [2] || process.cwd ())
.listen (process.argv [3]);
