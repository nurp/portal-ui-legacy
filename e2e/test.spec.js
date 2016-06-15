describe('Homepage', function() {
  it('should get the homepage title', function() {
    browser.url('http://localhost:8080');
    expect(browser.getTitle()).to.equal('React Relay Example');
  });
});
