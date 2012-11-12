## jsenv-brunch
Adds .jsenv support to [brunch](http://brunch.io).

.jsenv files are simple files with JSON structure that will have any matching keys replaced from environment variables.

## Example

config.jsenv:
```javascript
{
  API_HOST: "https://api.apihost.com"
}
```

when run with

```sh
API_HOST="https://dev.apihost.com" brunch compile
```

will compile to

```javascript
exports.module = {
  "API_HOST": "https://dev.apihost.com"
}
```


## Usage
Add `"jsenv-brunch": "x.y.z"` to `package.json` of your brunch app.

Pick a plugin version that corresponds to your minor (y) brunch version.

If you want to use git version of plugin, add
`"jsenv-brunch": "git+https://github.com/rcs/jsenv-brunch.git"`.
