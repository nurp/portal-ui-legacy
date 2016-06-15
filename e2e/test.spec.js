describe('DuckDuckGo search', () => {
  it('searches for WebdriverIO', done => {
    browser
      .url('http://localhost.com:8080/')
      .getTitle((err, title) => {
        console.log(title);
      })
      .call(done);
    // outputs: "Title is: React Relay Example"
  });
});
