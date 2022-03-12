/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar,list */
/* bender-include: ../button/_helpers/buttontools.js */
/* global buttonTools */

bender.editor = true;

// (#2444)
bender.test( buttonTools.createAriaPressedTests( 'test_editor', [
	'NumberedList',
	'BulletedList'
] ) );
