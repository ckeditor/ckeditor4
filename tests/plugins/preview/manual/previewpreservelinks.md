@bender-tags: 4.22.0, bug, 5412
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, preview, link, sourcearea

1. Press `Set Content` button to create a `url` type link with id, name and add 150 new lines.
2. Create a link and select its type as `Link to anchor in the text` and select the anchor name or id of the link created in the previous step.
3. Click `Preview` button.
4. Click the newly created link located at the bottom of page.

**Expected:** Focus has been moved to link at the beginning of the page. The link has been updated with `#testName`.

**Unexpected:** Focus was moved and the page was reloaded.
