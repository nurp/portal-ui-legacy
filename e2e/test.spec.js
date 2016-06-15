describe('my awesome website', function() {
  it('should do some chai assertions', function() {
    browser.url('/');
    expect(browser.getTitle()).to.equal('WebdriverIO');
  });
});
