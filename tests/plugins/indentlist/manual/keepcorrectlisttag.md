@bender-tags: 4.8.0, 842, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, list, indentlist

----

1. Put caret in paragraph with `333`.
1. Use `Decrease indent` button to move list item to the left.
1. Use `Increase indent` button to move list item to the right.

**Expected:** List item with `333` has circle as a list bullet.

**Unexpected:** List item with `333` has number as a list bullet.

