@bender-tags: 4.17.0, feature, 4462
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,link,format,sourcearea,elementspath,undo

**Note:** This test contains a lot of steps, but it is important to check them together.

**Note:** Open dev console to track possible errors. If any occurs, test failed.

1. Reattach editor with double click on "Toggle" button.

	**Expected:** Editor shows with the same data.

	**Unexpected:** Editor data is lost.

2. Click inside the content editing area.

	**Expected:** Content is editable. Elementspath (bottom bar) is filled after focusing the editor.

	**Unexpected:** Content is not editable. Elementspath (bottom bar) remains empty after focusing the editor.

3. Write any text in editor.

4. Reattach editor with double click on "Toggle" button.

	**Expected:** Editor shows with the same data.

	**Unexpected:** Editor data is lost.

5. Click inside the content editing area.

	**Expected:** Content is editable. Elementspath (bottom bar) is filled after focusing the editor.

	**Unexpected:** Content is not editable. Elementspath (bottom bar) remains empty after focusing the editor.

6. Click "Set data" button.

7. Reattach editor with double click on "Toggle" button.

	**Expected:** Editor shows with the same data.

	**Unexpected:** Editor data is lost.

8. Click inside the content editing area.

	**Expected:** Content is editable. Elementspath (bottom bar) is filled after focusing the editor.

	**Unexpected:** Content is not editable. Elementspath (bottom bar) remains empty after focusing the editor.

9. Switch to "Source mode".

10. Write some additional text.

11. Reattach editor with double click on "Toggle" button.

	**Expected:** Editor shows with the same data.

	**Unexpected:** Editor data is lost.

12. Click inside the source area.

	**Expected:** Source code is editable.

	**Unexpected:** Source code is not editable.

13. Switch back from "Source mode".

14. Reattach editor with double click on "Toggle" button.

	**Expected:** Editor shows with the same data.

	**Unexpected:** Editor data is lost.

15. Click inside the content editing area.

	**Expected:** Content is editable. Elementspath (bottom bar) is filled after focusing the editor.

	**Unexpected:** Content is not editable. Elementspath (bottom bar) remains empty after focusing the editor.
