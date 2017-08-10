@bender-tags: 4.7.2, bug, 605
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea

**Scenario:**
1. Click `Source` button.
2. Paste `lorem<span> ipsum&nbsp;dolor sit </span>amet` into source area.
3. Click `Source` button.

**Expected result:**

The text displayed should equal: `lorem ipsum dolor sit amet` and `Source` data should be `<p>lorem<span> ipsum&nbsp;dolor sit </span>amet</p>`.

**Unexpected result:**

The text displayed in editor equal: `loremipsum dolor sitamet`.
