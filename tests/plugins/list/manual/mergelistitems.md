@bender-tags: 12729, tc, 4.5.2
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, htmlwriter, list, link, basicstyles, sourcearea, undo, elementspath

----

Test merging lists items and blocks around lists using <kbd>backspace</kbd>/<kbd>delete</kbd> in both editors.

Notes:

* Contents of one block should not be inserted into inline elements in the second block, but next to them. For example:
  * place caret at the end of the first list item,
  * press <kbd>delete</kbd>,
  * **expected:** `<li><a>foo</a><em>foo</em></li>`.
  * **bad:** `<li><a>foo<em>foo</em></a></li>`.
* When trying to merge the first list item with a block outside it, it's:
  * expected that selection moves, but structure does not change (that's due to the nested list).
  * [BR mode] known that on FF and IE11 caret is rendered inside list even though it's in the previous line.
  * [BR mode] known that on IE8-? strange things happen.
