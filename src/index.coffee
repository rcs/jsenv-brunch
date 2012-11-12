vm = require 'vm'

module.exports = class JsenvCompiler
  brunchPlugin: yes
  type: 'javascript'
  extension: 'jsenv'

  constructor: (@config) ->
    null

  compile: (data, path, callback) ->
    try
      parsed = new Function("return #{data}")();

      if typeof parsed == "function"
        envHash = parsed(process.env)
      else
        envHash = JSON.parse(data)
        for key of envHash when process.env[key]
          envHash[key] = process.env[key]

      result =  "module.exports = " + JSON.stringify(envHash)

    catch err
      error = err
    finally
      callback error, result
