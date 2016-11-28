@bender-tags: tc, 4.6.1, 16639
@bender-ui: collapsed
@bender-ckeditor-plugins: ajax

## optional `callback` argument

1. Open developer console.
1. Click button "send  POST request".

**Expected:** No JavaScript exceptions are logged into the console.

**Unexpected:** Exception `Uncaught TypeError: callback is not a function` is reported.