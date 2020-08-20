@bender-tags: bug, 4.14.1, 3000
@bender-ui: collapsed
@bender-include: ../../embedbase/_helpers/tools.js
@bender-ckeditor-plugins: wysiwygarea,sourcearea,htmlwriter,entities,toolbar,elementspath,undo,clipboard,autolink,autoembed,link

1. Open browser developer console.
1. Paste one of embeddable links.
1. Wait until notification shows up.

**Expected:**

* URL has been correctly embedded.
* No console errors.

**Unexpected:**

* Notification is unable to finish image embedding.
* URL has not been embedded.
* Browser developer console reports errors.
