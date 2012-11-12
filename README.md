## jsenv-brunch
Adds .jsenv support to [brunch](http://brunch.io).

.jsenv files are simple files with JSON structure that will have any matching keys replaced from environment variables.

.jsenv files are either JSON formatted data or files specifying a javascript function that will take an env object as an argument and return an object.


## Example

### JSON
config.jsenv:
```javascript
{
  API_HOST: "https://api.apihost.com"
}
```

when run with

```sh
API_HOST="https://dev.apihost.com" brunch build
```

will compile to

```javascript
exports.module = {
  "API_HOST": "https://dev.apihost.com"
}
```

### Javascript
config.jsenv:
```javascript
function(env) {
  if( parseInt(env.EVILNESS) > 5 ) {
    return { "Evil": "very evil" };
  }
  else {
    return { "Evil": "only slightly evil" }
  }
}
```

```sh
EVILNESS=9001 brunch b
```

gives us

```javascript
exports.module = {"Evil": "very evil"}
```

while

```sh
EVILNESS=5 brunch b
```

gives us

```javascript
  module.exports = {"Evil":"only slightly evil"}
```

Any of which can now be used in "require('config')"


## Usage
Add `"jsenv-brunch": "x.y.z"` to `package.json` of your brunch app.

Pick a plugin version that corresponds to your minor (y) brunch version.

If you want to use git version of plugin, add
`"jsenv-brunch": "git+https://github.com/rcs/jsenv-brunch.git"`.
