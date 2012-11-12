vm = require('vm');

describe('Plugin', function() {
  var plugin;

  beforeEach(function() {
    plugin = new Plugin({});
  });

  it('should be an object', function() {
    expect(plugin).to.be.ok;
  });

  it('should has #compile method', function() {
    expect(plugin.compile).to.be.an.instanceof(Function);
  });


  it('should compile and produce valid result for JSON strings', function(done) {
    var sandbox = {
      'module': {
        'exports': undefined
      }
    };

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

  describe("javascript files",function() {
    var sandbox, content;
    beforeEach(function() {
      sandbox = {
        'module': {
          'exports': undefined
        }
      };

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
});
