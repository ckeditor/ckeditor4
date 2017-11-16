@bender-ui: collapsed
@bender-tags: 4.8.0, feature, inlinetoolbar
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, floatingspace, inlinetoolbar, sourcearea, list, link, elementspath, language, stylescombo

## Inline Toolbar Context

Inline toolbar should be shown only selections containing `strong` and `em` in its path.

Example test case:

1. Put selection in a "strong" element.

	### Expected

	Inline toolbar is shown.

1. Put selection in "underline" element.

	### Expected

	Inline toolbar is hidden.
