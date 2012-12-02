vm = require 'vm'
coffee = require 'coffee-script'
sysPath = require 'path'

module.exports = class JsenvCompiler
  brunchPlugin: yes
  type: 'javascript'
  pattern: /\.(js|coffee)env$/

  constructor: (@config) ->
    null

  compile: (data, path, callback) ->
    sandbox =
      module:
        exports: undefined
      require: require

    try
      if sysPath.extname(path) == '.coffeeenv'
        data = coffee.compile(data, bare: yes)

      parsed = vm.runInNewContext "module.exports = #{data}", sandbox

      if typeof parsed == "function"
        envHash = parsed(process.env)
      else
        envHash = parsed
        for key of envHash when process.env[key]
          envHash[key] = process.env[key]

      result =  "module.exports = " + JSON.stringify(envHash)

    catch err
      error = err
    finally
      callback error, result
