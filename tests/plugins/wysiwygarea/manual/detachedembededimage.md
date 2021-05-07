@bender-tags: 4.17.0, feature, 4462
@bender-ui: collapsed
@bender-include: ../../embedbase/_helpers/tools.js
@bender-ckeditor-plugins: wysiwygarea,toolbar,sourcearea,elementspath,undo,embed

**Note:** Open dev console to track possible errors. If any occurs, test failed.

**Note:** Expected behaviour is affected by the issue [#4644](https://github.com/ckeditor/ckeditor4/issues/4644).

1. Use 'Insert Media Embed' and put there any image URL.
2. Reattach editor with double click on "Toggle" button.

	**Expected:** There are exactly two undo steps.

	**Unexpected:** There is one undo step.
