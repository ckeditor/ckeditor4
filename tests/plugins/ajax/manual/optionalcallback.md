@bender-tags: tc, 4.6.1, 16639
@bender-ui: collapsed
@bender-ckeditor-plugins: ajax

## optional `callback` argument

1. Open developer console.
1. Click button "send  POST request".

**Expected:** No JavaScript exceptions are logged into the console.

**Unexpected:** Exception `Uncaught TypeError: callback is not a function` is reported.

**Note:** Still an error about 404 POST call `POST http://tests.ckeditor.dev:1030/tests/plugins/ajax/manual/post404.html 404 (Not Found)` will be reported, as Bender doesn't handle POST requests.