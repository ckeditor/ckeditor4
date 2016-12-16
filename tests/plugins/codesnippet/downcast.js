/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: toolbar,codesnippet */
/* global widgetTestsTools */

( function() {
	'use strict';

	function assertDowncast( id, widgetCount, widgetName ) {
		return function() {
			widgetTestsTools.assertDowncast( this.editorBot, id, widgetCount, widgetName );
		};
	}

	bender.editor = true;

	bender.test( {
		'test lang php':		assertDowncast( 'downcast-php', 1, 'codeSnippet' ),
		'test lang html':		assertDowncast( 'downcast-html', 1, 'codeSnippet' ),
		'test lang unknown':	assertDowncast( 'downcast-unknown', 1, 'codeSnippet' ),
		// Pre should not be downcasted.
		'test pre only':		assertDowncast( 'downcast-pre-only', 0 ),
		// Code tag alone should not be downcasted.
		'test code only':		assertDowncast( 'downcast-code-only', 0 )
	} );
} )();