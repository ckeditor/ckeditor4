@bender-tags: feature, 4.17.0, 4592
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, sourcearea
@bender-ui: collapsed

Do following steps for both text color button and background color button in both editors.

1. Select some text in the editor.
2. Click button.

	**Expected:** Colors are rendered correctly.

	**Unexpected:** Colors are not rendered.
3. Hover any color until tooltip shows up.

	**Expected:** Correct label is displayed in the tooltip.

	**Unexpected:** `[object Object]` is displayed in the tooltip.
4. Click any color to apply it.

	**Expected:** Color is applied correctly.

	**Unexpected:** Color is not applied.
5. Click button.

	**Expected:** The applied color is rendered in the color history. The correct color box is selected.

	**Unexpected:** The applied color is not rendered in the color history. The correct color box is not selected.
