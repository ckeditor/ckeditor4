@bender-tags: 4.5.0, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, enterkey, htmlwriter, list, sourcearea

----

1. Put caret at the last nested item (empty one) in the first list.
4. Press `enter` key.

**Expected:** Last bullet should outdent.

----

1. Put caret at the most nested element in the second list.
2. Press enter few times.

**Expected:** Each `enter` key press should lead to outdent list one level.
