/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar,bidi*/
/* bender-include: ../button/_helpers/buttontools.js */
/* global buttonTools */

bender.editor = true;

// (#2444)
bender.test( buttonTools.createAriaPressedTests( 'test_editor', [
	'BidiLtr',
	'BidiRtl'
] ) );
