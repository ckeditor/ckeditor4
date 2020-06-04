@bender-ui: collapsed
@bender-tags: bug, trac16755, 4.7.0, tp1905
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, clipboard, sourcearea, undo, elementspath

**Procedure:**

1. Start selection in nested table, starting from `^aaa`.
1. Continue your selection all the way up to `bbb2^` (other nested table).
1. Release mouse button.

**Expected result:**

Selection should be limited to [<td>aaa</td><td>bbb</td>].

**Unexpected result:**

Once the mouse is released the selection becomes a "regular selection".
