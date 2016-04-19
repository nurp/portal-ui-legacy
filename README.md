`Buzzwords: #redux #reactjs #webpack #es6 #babeljs #hyperscript #enzyme`

Technologies
=

- [React](http://facebook.github.io/react/) - A Javascript Library For Building User Interfaces
- [Redux](http://redux.js.org/) - Redux is a predictable state container for JavaScript apps.
- [Webpack](http://webpack.github.io/) - Module Bundler
- [Babel](https://babeljs.io/) - Babel will turn your ES6+ code into ES5 friendly code
- [Enzyme](http://airbnb.io/enzyme/) - makes it easier to assert, manipulate, and traverse your React Components.

Development
=

The development server is setup using Webpack

```
❯ npm start
...
TEST_ENV=watch karma start karma.config.js
⌛  Webpack bundling assets for the first time...
⚡  Server running at localhost:8080
   Proxying to API running at http://localhost:5000
webpack built f93ce65a51c93393a327 in 1759ms
Version: webpack 1.12.14
Time: 1759ms
    Asset     Size  Chunks             Chunk Names
bundle.js  2.86 MB       0  [emitted]  bundle
webpack: bundle is now VALID.
02 04 2016 01:58:39.968:WARN [karma]: No captured browser, open http://localhost:9876/
02 04 2016 01:58:39.975:INFO [karma]: Karma v0.13.22 server started at http://localhost:9876/
02 04 2016 01:58:39.979:INFO [launcher]: Starting browser PhantomJS
02 04 2016 01:58:40.471:INFO [PhantomJS 2.1.1 (Mac OS X 0.0.0)]: Connected on socket /#dNDHkKK04rMIhQEGAAAA with id 10265082
...
SUMMARY:
✔ 26 tests completed
```

Tests
=

Unit tests are run using Karma.

```
❯ npm test
...
02 04 2016 01:59:43.148:INFO [karma]: Karma v0.13.22 server started at http://localhost:9876/
02 04 2016 01:59:43.154:INFO [launcher]: Starting browser PhantomJS
02 04 2016 01:59:43.617:INFO [PhantomJS 2.1.1 (Mac OS X 0.0.0)]: Connected on socket /#OVwa16Xpcdld6HxyAAAA with id 84226691
PhantomJS 2.1.1 (Mac OS X 0.0.0): Executed 26 of 26 SUCCESS (0.037 secs / 0.02 secs)
```

Running Locally
=

Remote API & ElasticSearch, Local UI
==

Connect to VPN and run ui with
```
GDC_API=https://gdc-portal.nci.nih.gov/auth/api/v0 GDC_FAKE_AUTH=true npm start
```

Local API, Remote ElastiSearch and Local UI
==

Connect to VPN and run api with
```
GDC_ES_INDEX=gdc_from_graph GDC_ES_HOST=ip GDC_ES_USER=user GDC_ES_PASS=pw GDC_PORTAL_ENDPOINT=http://localhost:3000 GDC_FAKE_DOWNLOAD=True python run.py
```
ES creds can be found on any API machine in `/var/www/gdcapi/gdcapi.wsgi`

UI can simply be run as usual with
```
❯ npm start
```

Local API, ElasticSearch and UI
==

Not recommended, would require loading local ES with data.

Authentication
=

In order to properly run the UI and login to test the auth you will need to run the application
in a specific way. This includes `sudo` and running the app on port `80`. You will need to ensure
that you don't have something else using that port (like a local apache setup).

The following command should work:
`sudo GDC_API=http://portal.gdc.nci.nih.gov:5000 GDC_PORT=80 npm start`

Modifying /etc/hosts
==

In order to support local use of the login system we need to add the following
to your `/etc/hosts` file:

`127.0.0.1 gdc-portal.nci.nih.gov`

ElasticSearch
==

If you are connecting to a local ES, edit path-to-elastic-search/config/elasticsearch.yml, find the line with http.max_content_length, add
```
http.max_initial_line_length: 1000mb
```
to increase the max length of a HTTP URL

Contributing
=

Read how to contribute [here](https://github.com/NCI-GDC/gdcapi/blob/master/CONTRIBUTING.md)

Verifying Tags
=

```
❯ git show maintainer-pgp-pub | gpg --import
❯ git tag --verify [signed-tag-name]
```
