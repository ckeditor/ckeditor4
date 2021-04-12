@bender-tags: 4.17.0, feature, 4462
@bender-ui: collapsed
@bender-include: ../../embedbase/_helpers/tools.js
@bender-ckeditor-plugins: wysiwygarea,toolbar,sourcearea,elementspath,undo,embed

**Note:** Open dev console to track possible errors. If any occurs, test failed.

1. Use 'Insert Media Embed' and put there any image address. For example google logo.
2. Reattach editor with double click on "Toggle" button.

	**Expected:** There is exactly one undo step.

	**Unexpected:** There are two undo steps. The first one doesn't change content.
