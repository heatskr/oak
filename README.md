# OAK

### Running static server

```sh
oak ./public 5000
```

### Creating the router

```js
const oak = require ("oak");

oak.Route ()
.folder ("/", "./public")
.get ("/", (req, res) => {
  res.sendFile ("./public/index.html");
})
.listen (5000);
```
