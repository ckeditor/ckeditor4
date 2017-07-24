@bender-tags: 4.7.2, bug, 605
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea

**Scenario:**
1. Click `Source` button.
2. Input `<span>lorem </span>ipsum` into source area.
3. Click `Source` button.

**Expected result:**

The text displayed should equal: `lorem ipsum`.

**Unexpected result:**

There is a missing space in a text: `loremipsum`.
