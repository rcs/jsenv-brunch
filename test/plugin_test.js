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


  it('should compile and produce valid result', function(done) {
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
      vm.runInNewContext(data,sandbox);
      expect(error).not.to.be.ok;
      expect(sandbox.module.exports).to.eql(expected);
      done();
    });
  });

});
