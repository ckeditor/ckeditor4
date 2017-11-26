@bender-ui: collapsed
@bender-tags: 4.8.0, feature, inlinetoolbar, 933
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, floatingspace, inlinetoolbar, sourcearea, list, elementspath

## Balloon Toolbar Context

Balloon Toolbar should be shown only for selections containing `strong` and `em` in its path.

Example test case:

1. Put selection in a "strong" element.

	### Expected

	Balloon Toolbar is shown.

1. Put selection in "underline" element.

	### Expected

	Balloon Toolbar is hidden.
