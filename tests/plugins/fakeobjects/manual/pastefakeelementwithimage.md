@bender-tags: 4.8.0, bug, clipboard, 638
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, iframe, clipboard, sourcearea, link, image2

**Scenario:**

1. Open this page in new tab.
2. Click `Source` in editor and paste:
`<p><img alt="" src="https://www.comandeer.pl/images/custom/comandeer.jpg" /></p><p><iframe frameborder="0" src="https://example.com" width="100" height="100"></iframe></p>`
3. Click `Source`.
4. Select all content and copy to clipboard.
5. Go back to the first tab and paste content into editor.

**Expected result:**

All content has been pasted into editor.
The `Source` of the editor contains the same html like in point 2.
