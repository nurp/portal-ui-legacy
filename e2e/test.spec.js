describe('my awesome website', function() {
  it('should do some chai assertions', function() {
    browser.url('http://localhost:4445');
    expect(browser.getTitle()).to.equal('WebdriverIO');
  });
});
