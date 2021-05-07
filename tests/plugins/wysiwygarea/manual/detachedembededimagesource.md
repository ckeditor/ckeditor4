@bender-tags: 4.17.0, feature, 4462
@bender-ui: collapsed
@bender-include: ../../embedbase/_helpers/tools.js
@bender-ckeditor-plugins: wysiwygarea,toolbar,sourcearea,elementspath,undo,embed

**Note:** Open dev console to track possible errors. If any occurs, test failed.

1. Use 'Insert Media Embed' and put there any image URL.
2. Change editor mode to `source mode` two times.

	**Expected:** The `wysiwyg mode` loads normally.

	**Unexpected:** The entire editor freeze without changing the mode.
