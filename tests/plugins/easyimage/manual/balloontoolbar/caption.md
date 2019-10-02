@bender-tags: 4.9.0, bug, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, undo, easyimage
@bender-include: ../../_helpers/tools.js
## Balloon positioning

1. Focus Easy Image widget in the first editor.
	### Expected

	A balloon panel shows, pointing at middle bottom edge of the widget.
1. Put a collapsed selection inside of the caption.
	### Expected

	Balloon is hidden.
1. Move focus back to widget (by clicking anywhere on the image).
	### Expected

	Balloon panel shows, again in the same position.

	### Unexpected

	Balloon panel points to the bottom edge **of an image**, overlapping the caption.

---

Repeat above steps for all other editors.

## Note

On Edge you could be affected by [#1458](https://github.com/ckeditor/ckeditor4/issues/1458) and have to double click widget to focus it.
