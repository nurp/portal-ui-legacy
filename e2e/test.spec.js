describe('DuckDuckGo search', function() {
    it('searches for WebdriverIO', function() {
        browser
          .url('http://localhost.com:8080/')
          .getTitle(function(err, title) {
            console.log(title);
          })
          .end();
        // outputs: "Title is: React Relay Example"
    });
});
