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

  it('should has #compile method', function() {
    expect(plugin.compile).to.be.an.instanceof(Function);
  });

  it('should compile and produce valid result for JSON strings when .jsenv file given', function(done) {
    var content = '{"SHIRT_COLOR":"blue","SHIRT_SIZE":"large"}';

    process.env.SHIRT_COLOR = "red";

    var expected = {
      "SHIRT_COLOR": "red",
      "SHIRT_SIZE": "large"
    };

    plugin.compile(content, 'env.jsenv', function(error, data) {
      var thing = vm.runInNewContext(data,sandbox);
      expect(error).not.to.be.ok;
      expect(sandbox.module.exports).to.eql(expected);
      done();
    });
  });

  it('should compile and produce valid result for JSON strings when .coffeeenv file given', function(done) {
    var content = [
      '"SHIRT_COLOR": "blue"',
      '"SHIRT_SIZE": "large"'
    ].join('\n');

    process.env.SHIRT_COLOR = "red";

    var expected = {
      "SHIRT_COLOR": "red",
      "SHIRT_SIZE": "large"
    };

    plugin.compile(content, 'env.coffeeenv', function(error, data) {
      vm.runInNewContext(data,sandbox);
      expect(error).not.to.be.ok;
      expect(sandbox.module.exports).to.eql(expected);
      done();
    });
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

    it('should compile and produce valid result for javascript files down one branch', function(done) {
      process.env.EVILNESS = "9001";

      var expected = {
        "Evil": "very evil"
      };

      plugin.compile(content, 'env.jsenv', function(error, data) {
        vm.runInNewContext(data,sandbox);
        expect(error).not.to.be.ok;
        expect(sandbox.module.exports).to.eql(expected);
        done();
      });
    });

    it('should compile and produce valid result for javascript files down the other branch', function(done) {
      process.env.EVILNESS = "5";

      var expected = {
        "Evil": "only slightly evil"
      };

      plugin.compile(content, 'env.jsenv', function(error, data) {
        vm.runInNewContext(data,sandbox);
        expect(error).not.to.be.ok;
        expect(sandbox.module.exports).to.eql(expected);
        done();
      });
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

    it('should compile and produce valid result for coffeescript files down one branch', function(done) {
      process.env.EVILNESS = "9001";

      var expected = {
        "Evil": "very evil"
      };

      plugin.compile(content, 'env.coffeeenv', function(error, data) {
        vm.runInNewContext(data,sandbox);
        expect(error).not.to.be.ok;
        expect(sandbox.module.exports).to.eql(expected);
        done();
      });
    });

    it('should compile and produce valid result for coffeescript files down the other branch', function(done) {
      process.env.EVILNESS = "5";

      var expected = {
        "Evil": "only slightly evil"
      };

      plugin.compile(content, 'env.coffeeenv', function(error, data) {
        vm.runInNewContext(data,sandbox);
        expect(error).not.to.be.ok;
        expect(sandbox.module.exports).to.eql(expected);
        done();
      });
    });
  });

  it("should enable the require function in the jsenv context", function(done) {
    var content = '{requireType: typeof require}';

    var expected = {
      "requireType": "function"
    };

    plugin.compile(content, 'env.jsenv', function(error, data) {
      vm.runInNewContext(data,sandbox);
      expect(error).not.to.be.ok;
      expect(sandbox.module.exports).to.eql(expected);
      done();
    });
  });
});
