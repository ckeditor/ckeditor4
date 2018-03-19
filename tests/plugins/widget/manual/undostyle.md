@bender-tags: 4.10, feature, 1566
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image, sourcearea, undo

Testing undo and redo with apply/remove style.

1. Focus widget and press first button without icon on toolbar
1. Press undo button
	### Expected:
	All styles added by apply style button are removed

1. Open and close source
	### Expected
	Widget styling remains the same

1. Press redo button
	### Expected: removed styles should be reapplied

1. Focus widget again
1. Press second button, then press undo
	### Expected
	Styles are removed and undo reverts removal

1. Open source and close again
	### Expected
	Widget styling remains the same
