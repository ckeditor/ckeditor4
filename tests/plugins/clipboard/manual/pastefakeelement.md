@bender-tags: 4.7.2, bug, clipboard, 638
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, iframe, clipboard, sourcearea, link

**Scenario 1:**

1. Open this page in new tab.
2. Click `Source` in editor and paste:
`<iframe frameborder="0" src="https://example.com" width="100" height="100"></iframe>`
3. Click `Source`.
4. Select iframe and copy to clipboard.
5. Go back to the first tab and paste iframe into editor.

**Expected result:**

The iframe is visible in editor.
The `Source` of the editor contains: `<p><iframe frameborder="0" src="https://example.com" width="100" height="100"></iframe></p>`.

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
