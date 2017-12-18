@bender-tags: 4.8.1, feature, tp3117
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, filebrowser, filetools, image, link, flash

----
1. Open image dialog
2. Go to upload tab
3. Select some image and send it to server
4. Close dialog (There might appear warning that image url is not set up)

Repeat those steps for Link and Flash plugin.

_Note:_ When new upload request is made, it should be visible as separate line below.

**Expected:** Below editor will appear green div with listed headers attempted to send. There are 2 headers in single line:
`hello: world, foo: bar`.

**Unexpected:** Headers are not listed below.
