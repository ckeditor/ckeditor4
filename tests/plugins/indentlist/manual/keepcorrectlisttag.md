@bender-tags: 4.7.3, 842, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, list, indentlist

----

1. Put caret in paragraph with `333`.
1. Use `Decrease indent` to move paragraph to the left.
1. Use `Increase indent` to move paragraph to the right.

**Expected:** List item with `333` has circle as a list tag.

**Unexpected:** List item with `333` has number as a list tag.

