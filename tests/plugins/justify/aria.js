/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar,justify */
/* bender-include: ../button/_helpers/buttontools.js */
/* global buttonTools */

bender.editor = true;

// (#2444)
bender.test( buttonTools.createAriaPressedTests( 'test_editor', [
	'JustifyLeft',
	'JustifyCenter',
	'JustifyRight',
	'JustifyBlock'
] ) );
