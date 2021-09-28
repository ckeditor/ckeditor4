@bender-tags: 4.9.0, feature, 643, tp3117
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, filebrowser, filetools, image, link

----
1. Open image dialog
2. Go to upload tab
3. Select some image and send it to server
4. Close dialog (There might appear warning that image url is not set up)

**Expected:** Below editor will appear green div with listed headers attempted to send. You should see following headers for each case:

```
{
    "hello": "world",
    "foo": "bar"
}
```

**Unexpected:** Headers are not listed below.

Repeat those steps for Link and Flash plugin.

_Note:_ When a new upload request is made, it should be visible as a separate line below.
