// config.js
angular.module("ngApp.config", [])
  .constant("config", {
    "version": "__VERSION__",
    "commitLink": "https://github.com/NCI-GDC/portal-ui-legacy/commit/__COMMIT__",
    "commitHash": "__COMMIT__",
    "api": "__API__",
    "auth":"__AUTH__",
    "auth_api": "__AUTH__/api/legacy",
    "base": "__BASE__",
    "supportedAPI": "1",
    "tag": "https://github.com/NCI-GDC/portal-ui-legacy/releases/tag/__VERSION__",
    "production": __PRODUCTION__,
    "fake_auth": __FAKE_AUTH__,
  });
