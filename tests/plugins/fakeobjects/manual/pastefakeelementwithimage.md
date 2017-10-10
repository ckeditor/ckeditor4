@bender-tags: 4.8.0, bug, clipboard, 638
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, iframe, clipboard, sourcearea, link, image2

**Scenario:**

1. Open this page in new tab.
2. Select all content and copy to clipboard.
3. Go back to the first tab, clear editor and paste content from clipboard.

**Expected result:**

All content has been pasted into editor.
The `Source` of the editor contains the html:
`<p><img alt="" src="https://www.comandeer.pl/images/custom/comandeer.jpg" /></p><p><iframe frameborder="0" src="https://example.com" width="100" height="100"></iframe></p>`
