@bender-tags: 4.8.1, feature, tp3117
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, filebrowser, filetools, image, link, flash

----
1. Open image dialog
2. Go to upload tab
3. Select some image and send it to server
4. **Alert** should be displayed
5. Try to upload file again

Repeat those steps for Link and Flash plugin.

**Expected:** After first upload attempt, send button is enabled. Which means that every next click trigger new uploading process and generate new alert message.

**Unexpected:** After first upload send button is disabled. Second and further upload attempts don't trigger upload process, and alert is not shown.
