@bender-tags: 4.16.1, bug, 4509, widget
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea, table, undo, indent, justify, clipboard, floatingspace, basicstyles, codesnippet, link, elementspath, blockquote, format, htmlwriter, list, maximize, image

1. Try to drag and drop the most outer widget into `[drop here]` area.

	## Expected result

	Nothing happens.

	## Unexpected result

	Widget drag handler is inserted into the inner widget.

2. Switch to source mode.

	## Expected result

	There is no `img` element in the source.

	## Unexpected result

	There is an `img` element in the source.

3. Repeat the procedure for every editor.
