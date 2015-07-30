@bender-tags: widget
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea, table, undo, indent, justify, clipboard, floatingspace, basicstyles, image2, codesnippet, link, elementspath, blockquote, format, htmlwriter, list, maximize

Add some widgets and nested widgets (use 'empty' icon for that).

## Test block widgets:

* create,
* edit,
* select,
* drag and drop,
* cut/copy and paste,
* editing in nested editable,
* remove,
* undo/redo,
* switch multiple times between source and wysiwyg mode.

## Edge cases:

* DnD inside its child:
  1. Create a doublecolumn widget containing another doublecolumn widget('empty' icon).
  1. Try to drag the outer widget into the inner widget. Should not be possible.
