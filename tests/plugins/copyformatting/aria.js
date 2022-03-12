/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar,copyformatting */
/* bender-include: ../button/_helpers/buttontools.js */
/* global buttonTools */

bender.editor = true;

// (#2444)
bender.test( buttonTools.createAriaPressedTests( 'test_editor', [
	'CopyFormatting'
] ) );
