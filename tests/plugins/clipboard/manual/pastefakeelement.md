@bender-tags: 4.7.2, bug, clipboard, 638
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, iframe, clipboard, sourcearea, link

**Scenario 1:**

1. Open this page in new tab.
2. Click `Source` in editor and paste:
`<p>Lorem ipsum</p><p><iframe frameborder="0" height="100" src="https://example.com" width="100"></iframe></p><p>cke-real-element-type</p>`
3. Click `Source`.
4. Select all content and copy to clipboard.
5. Go back to the first tab and paste content into editor.

**Expected result:**

All content has been pasted into editor.
The `Source` of the editor contains the same html like in point 2.

**Scenario 2:**

1. Open this page in new tab.
2. Click `anchor` button, input anchor name `anchorname` and click `OK`.
3. Select anchor and copy to clipboard.
4. Go back to the first tab and paste anchor into editor.

**Expected result:**

The anchor is visible in editor.
The `Source` of the editor contains: `<p><a id="anchorname" name="anchorname"></a></p>`.

**Unexpected result for both scenarios:**

The iframe/anchor is not visible in the editor.
