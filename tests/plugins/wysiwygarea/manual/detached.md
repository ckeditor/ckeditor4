@bender-tags: 4.17.0, bug, 4462
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,link,format,sourcearea,elementspath,undo

**Note:** Open dev console to track possible errors.

1. Reattach editor with double click on "Toggle" button.

	**Expected:** Editor shows with the same data.

	**Unexpected:** Editor data is lost.

2. Click inside the content editing area.

	**Expected:** Content is editable. Elementspath (bottom bar) updates.

	**Unexpected:** Content is not editable. Elemetspath (bottom bar) remains empty.

3. Write any text in editor.

4. Reattach editor with double click on "Toggle" button.

	**Expected:** Editor shows with the same data.

	**Unexpected:** Editor data is lost.

5. Click inside the content editing area.

	**Expected:** Content is editable. Elementspath (bottom bar) updates.

	**Unexpected:** Content is not editable. Elemetspath (bottom bar) remains empty.

6. Click "Set data" button.

7. Reattach editor with double click on "Toggle" button.

	**Expected:** Editor shows with the same data.

	**Unexpected:** Editor data is lost.

8. Click inside the content editing area.

	**Expected:** Content is editable. Elementspath (bottom bar) updates.

	**Unexpected:** Content is not editable. Elemetspath (bottom bar) remains empty.

9. Switch to "Source mode".

10. Write some additional text.

11. Switch back from "Source mode".

10. Reattach editor with double click on "Toggle" button.

	**Expected:** Editor shows with the same data.

	**Unexpected:** Editor data is lost.

11. Click inside the content editing area.

	**Expected:** Content is editable. Elementspath (bottom bar) updates.

	**Unexpected:** Content is not editable. Elemetspath (bottom bar) remains empty.
