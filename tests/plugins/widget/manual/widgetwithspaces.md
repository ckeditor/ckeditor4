@bender-tags: 4.7.3, bug, 605
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea

**Scenario:**
1. Click `Source` button.
2. Paste `lorem<span> ipsum&nbsp;<strong>dolor sit </strong></span>amet` into source area.
3. Click `Source` button.

**Expected result:**

The displayed text is equal to: `lorem ipsum dolor sit amet` and `Source` data to `<p>lorem<span> ipsum&nbsp;<strong>dolor sit </strong></span>amet`.

**Unexpected result:**

The text displayed in the editor is equal to: `loremipsum dolor sitamet`.
