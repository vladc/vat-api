var chai = require('chai'),
    expect = chai.expect,
    Browser = require('zombie');

describe("index page", function () {
  before(function(done) {
    this.browser = new Browser({ site: 'http://localhost:3000' });
    this.browser.visit('/', done);
  });

  it("should load the page correctly", function (done) {
    expect(this.browser.success).to.equal(true);
    done();
  });

  it('should have a certain title', function(done){
    expect(this.browser.text('title')).to.equal('Dwelly VAT RATE');
    done();
  });

});
