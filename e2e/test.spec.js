describe('my awesome website', function() {
  it('should do some chai assertions', function() {
    browser.url('http://localhost:8080');
    expect(browser.getTitle()).to.equal('WebdriverIO');
  });
});
