@bender-tags: 4.9.0, feature, 643, tp3117
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, filebrowser, filetools, image, link, flash

----
1. Open image dialog
2. Go to upload tab
3. Select an image and send it to server

	**Expected:** An alert with 404 message is displayed.

5. Click "Send it to the Server" button again

	**Expected:** An alert is shown again.

	**Unexpected:** Second and further upload attempts won't trigger upload process, and alert is not shown.

Repeat those steps for Link and Flash plugin.
