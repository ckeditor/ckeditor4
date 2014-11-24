/* bender-tags: editor,unit,insertion */
/* global insertionDT */

( function() {
	'use strict';

	insertionDT.run( {
		enterMode: CKEDITOR.MODE_BR,
		autoParagraph: false,
		allowedContent: true
	}, {
		'insert block between &lt;brs&gt;': function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<h1>abc</h1>', 'html' );

			a( 'x<br />^<br />x',				'x<h1>abc^</h1>x',							'case 1a' );
		}
	} );
} )();