/* bender-tags: editor,unit,insertion */

( function() {
	'use strict';

	insertionDT.run( {
		autoParagraph: false,
		allowedContent: 'p'
	}, {
		'insertHtml to be completely stripped - single tag': function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<img>', 'html' );

			a( 'x^', 'x^', 'Nothing is inserted.' );
		},

		'insertHtml to be completely stripped - closing tag': function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<span></span>', 'html' );

			a( 'x^', 'x^', 'Nothing is inserted.' );
		},

		'insertHtml to be completely stripped - custom tag': function() {
			var a = this.createAssertInsertionFunction( 'body,div', '<customtag></customtag>', 'html' );

			a( 'x^', 'x^', 'Nothing is inserted.' );
		}
	} );
} )();