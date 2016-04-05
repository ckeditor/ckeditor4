@bender-ui: collapsed
@bender-tags: 4.5.1, tc, 13486, filetools
@bender-ckeditor-plugins: uploadimage, wysiwygarea, toolbar, basicstyles

Run this test with the console opened.

Expected:

* Editor should be fully functional except the `uploadimage` plugin.
* No errors on IE8-9, an error logged in the console that `upload URL` was not set on other browsers.