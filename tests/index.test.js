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

  it('should diplay a sample URL', function(done){
    expect(this.browser.text('p.url-example')).to.equal('http://dwelly.me/api/vat/54.154.87.28');
    done();
  });

  it('should have a certain title', function(done){
    expect(this.browser.text('title')).to.equal('Dwelly VAT RATE');
    done();
  });

  it('should display a sample json respone', function(done){
    expect(this.browser.text('p.json-example')).to.equal(
      '{"successful":true,"rates":{"super_reduced":4.8,"reduced1":9,"reduced2":13.5,"standard":23,"parking":13.5},"countryCode":"IE","country":"Ireland"}');
    done();
  });
});
