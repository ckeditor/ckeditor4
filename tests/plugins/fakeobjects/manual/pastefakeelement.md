@bender-tags: 4.8.0, bug, clipboard, 638
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, iframe, clipboard, sourcearea, link

**Scenario 1:**

1. Open this page in new tab.
2. Select all content and copy to clipboard.
3. Go back to the first tab, clear editor and paste content from clipboard.

**Expected result:**

All content has been pasted into editor.
The `Source` of the editor contains html:
`<p>Lorem ipsum</p><p><iframe frameborder="0" height="100" src="https://example.com" width="100"></iframe></p><p>cke-real-element-type</p><p><a id="anchorname" name="anchorname"></a></p>`


**Unexpected result for both scenarios:**

The iframe/anchor is not visible in the editor.
