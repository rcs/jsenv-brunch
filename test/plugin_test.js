vm = require('vm');

describe('Plugin', function() {
  var plugin, sandbox;

  beforeEach(function() {
    plugin = new Plugin({});
    sandbox = {
      'module': {
        'exports': undefined
      }
    };
  });

  it('should be an object', function() {
    expect(plugin).to.be.ok;
  });

  it('should have a #compile method', function() {
    expect(plugin.compile).to.be.an.instanceof(Function);
  });

  it('should compile and produce valid result for JSON strings when .jsenv file given', function() {
    var content = '{"SHIRT_COLOR":"blue","SHIRT_SIZE":"large"}';

    process.env.SHIRT_COLOR = "red";

    var expected = {
      "SHIRT_COLOR": "red",
      "SHIRT_SIZE": "large"
    };

    return plugin.compile({ data: content, path: 'env.jsenv' }).then(function(result) {
      var thing = vm.runInNewContext(result,sandbox);
      return expect(sandbox.module.exports).to.eql(expected);
    },function(err) { expect(err).not.to.be.ok });
  });

  it('should compile and produce valid result for JSON strings when .coffeeenv file given', function() {
    var content = [
      '"SHIRT_COLOR": "blue"',
      '"SHIRT_SIZE": "large"'
    ].join('\n');

    process.env.SHIRT_COLOR = "red";

    var expected = {
      "SHIRT_COLOR": "red",
      "SHIRT_SIZE": "large"
    };

    plugin.compile({ data: content, path: 'env.coffeeenv' }).then(function(result) {
      vm.runInNewContext(result,sandbox);
      return expect(sandbox.module.exports).to.eql(expected);
    },function(err) { expect(err).not.to.be.ok });
  });

  describe("javascript files",function() {
    var content;

    beforeEach(function() {
      content =  ''
        + 'function(env) {'
        + '  if( parseInt(env.EVILNESS) > 5 ) {'
        + '    return { "Evil": "very evil" };'
        + '  }'
        + '  else {'
        + '    return { "Evil": "only slightly evil" }'
        + '  }'
        + '}';
    });

    it('should compile and produce valid result for javascript files down one branch', function() {
      process.env.EVILNESS = "9001";

      var expected = {
        "Evil": "very evil"
      };

      return plugin.compile({ data: content, path: 'env.jsenv' }).then(function(result) {
        vm.runInNewContext(result,sandbox);
        return expect(sandbox.module.exports).to.eql(expected);
      },function(err) { expect(err).not.to.be.ok });
    });

    it('should compile and produce valid result for javascript files down the other branch', function() {
      process.env.EVILNESS = "5";

      var expected = {
        "Evil": "only slightly evil"
      };

      return plugin.compile({ data: content, path: 'env.jsenv' }).then(function(result) {
        vm.runInNewContext(result,sandbox);
        return expect(sandbox.module.exports).to.eql(expected);
      },function(err) { expect(err).not.to.be.ok });
    });
  });

  describe("coffeescript files", function() {
    var content;

    beforeEach(function() {
      content = [
        '(env) ->',
        '  if parseInt(env.EVILNESS) > 5',
        '    { Evil: "very evil" }',
        '  else',
        '    { Evil: "only slightly evil" }'
      ].join('\n');
    });

    it('should compile and produce valid result for coffeescript files down one branch', function() {
      process.env.EVILNESS = "9001";

      var expected = {
        "Evil": "very evil"
      };

      return plugin.compile({ data: content, path: 'env.coffeeenv' }).then(function(result) {
        vm.runInNewContext(result,sandbox);
        return expect(sandbox.module.exports).to.eql(expected);
      },function(err) { expect(err).not.to.be.ok });
    });

    it('should compile and produce valid result for coffeescript files down the other branch', function() {
      process.env.EVILNESS = "5";

      var expected = {
        "Evil": "only slightly evil"
      };

      return plugin.compile({ data: content, path: 'env.coffeeenv' }).then(function(result) {
        vm.runInNewContext(result,sandbox);
        expect(sandbox.module.exports).to.eql(expected);
      },function(err) { expect(err).not.to.be.ok });
    });
  });

  it("should enable the require function in the jsenv context", function() {
    var content = '{requireType: typeof require}';

    var expected = {
      "requireType": "function"
    };

    return plugin.compile({ data: content, path: 'env.jsenv' }).then(function(result) {
      vm.runInNewContext(result,sandbox);
      expect(sandbox.module.exports).to.eql(expected);
    },function(err) { expect(err).not.to.be.ok });
  });
});
