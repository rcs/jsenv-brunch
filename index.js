'use strict'

const vm = require('vm')
const coffee = require('coffee-script')
const sysPath = require('path')
const keys = require('lodash').keys
const pick = require('lodash').pick

class JsenvCompiler {
  constructor(config) {
    if(config == null) config = {}
    const plugin = config.plugins && config.plugins.jsenv || {}
  }

  compile(params) {
    const data = params.data
    const path = params.path

    let sandbox = {
      module: {
        exports: undefined
      },
      require: require
    }

    let compiled
    let result
    try {
      if(sysPath.extname(path) == '.coffeeenv') {
        compiled = coffee.compile(data,{ bare: true })
      } else {
        compiled = data
      }

      let context = new vm.createContext(sandbox)
      let script = new vm.Script("module.exports = "+compiled)
      script.runInContext(context)

      let envHash
      let mappedEnv
      if(typeof sandbox.module.exports == "function") {
        mappedEnv = sandbox.module.exports(process.env)
      } else {
        envHash = sandbox.module.exports
        let matchingEnvVars = pick(process.env,keys(sandbox.module.exports))
        mappedEnv = Object.assign({},envHash,matchingEnvVars)
      }
      result = "module.exports = " + JSON.stringify(mappedEnv)
    } catch(e) {
      console.log(e)
      return Promise.reject(e)
    } finally {
      return Promise.resolve(result)
    }
  }
}

JsenvCompiler.prototype.brunchPlugin = true
JsenvCompiler.prototype.type = 'javascript'
JsenvCompiler.prototype.extension = /(coffeeenv|jsenv)/
JsenvCompiler.prototype.pattern = /.(coffeeenv|jsenv)$/
JsenvCompiler.prototype.defaultEnv = "*"

module.exports = JsenvCompiler
