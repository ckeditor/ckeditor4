@bender-tags: 4.17.0, bug, 4462, divarea
@bender-ui: collapsed
@bender-ckeditor-plugins: divarea,toolbar,basicstyles,link,format,sourcearea,elementspath,undo

**Note:** Open dev console to track eventual errors.

1. Click "Toggle" button twice. To hide and show editor.

	**Expected:**

	* Editor shows with same data.
	* Content is editable.
	* Elementspath (at the bottom is updated).

	**Unexpected:** Editor data is lost, content area is not editable.

2. Write some text in editor.

3. Repeat step 2.

	**Expected:**

	* Editor shows with same data.
	* Content is editable.
	* Elementspath (at the bottom is updated).

	**Unexpected:** Editor data is lost, content area is not editable.

4. Click "Set data" button.

5. Repeat step 2.

	**Expected:**

	* Editor shows with same data.
	* Content is editable.
	* Elementspath (at the bottom is updated).

	**Unexpected:** Editor data is lost, content area is not editable.

6. Switch to "Source mode".

7. Write some additional text.

8. Switch back from "Source mode".

9. Repeat step 2.

	**Expected:**

	* Editor shows with same data.
	* Content is editable.
	* Elementspath (at the bottom is updated).

	**Unexpected:** Editor data is lost, content area is not editable.
