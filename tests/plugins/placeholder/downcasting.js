/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: placeholder */

( function() {
	'use strict';

	bender.editor = {
		config: {
			autoParagraph: false
		}
	};

	bender.test( {
		'test downcasting when no placeholder in text': function() {
			widgetTestsTools.assertDowncast( this.editorBot, 'w3', 0 );
		},
		'test downcasting from empty text': function() {
			widgetTestsTools.assertDowncast( this.editorBot, 'w4', 0 );
		},
		'test downcasting from typical text': function() {
			widgetTestsTools.assertDowncast( this.editorBot, 'w1', 2, 'placeholder' );
		},
		'test downcasting from multiple occurence of same placeholder': function() {
			widgetTestsTools.assertDowncast( this.editorBot, 'w2', 4, 'placeholder' );
		},
		'test downcasting from exact placeholder string': function() {
			widgetTestsTools.assertDowncast( this.editorBot, 'w5', 1, 'placeholder' );
		},
		'test downcasting with special chars': function() {
			widgetTestsTools.assertDowncast( this.editorBot, 'w6', 1, 'placeholder' );
		}
	} );
} )();