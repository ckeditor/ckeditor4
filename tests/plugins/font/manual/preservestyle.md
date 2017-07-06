@bender-tags: 4.8.0, feature, tc
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, font, elementspath, sourcearea

1. Select text
1. Change `font size`
1. Select this same text, be sure that floating panel has selected previously chosen option
1. Select this same option once again
1. Repeat those steps for the `font name`.

**Expected:** Font size/name will remain this same. It still will be marked on dropdown menu and applied to selected text.

**Unexpected:** Font size/name will be deselct and style dissapear from the text.
