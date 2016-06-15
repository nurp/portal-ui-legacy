describe('DuckDuckGo search', function() {
    it('searches for WebdriverIO', function() {
        browser.url('http://localhost.com:8080/');
        var title = browser.getTitle();
        console.log('Title is: ' + title);
        // outputs: "Title is: React Relay Example"
    });
});
