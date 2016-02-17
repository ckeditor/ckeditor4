/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */
/* bender-include: _helpers/tools.js */
( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	bender.test( {
		'test getSelectedWordOffset (word inside text node)': function() {
			testGettingWordOffset( this.editor, '<p>Get th{}is word</p>', 'this' );
		},

		'test getSelectedWordOffset (word inside element)': function() {
			testGettingWordOffset( this.editor, '<p>Get <span style="font-weight: bold">th{}is</span> word</p>', 'this' );
		},

		'test getSelectedWordOffset (word splitted between element and text node)': function() {
			testGettingWordOffset( this.editor, '<p>Get <span style="font-weight: bold;">th</span>{}is word</p>', 'this' );
		},

		'test getSelectedWordOffset (word splitted between elements)': function() {
			testGettingWordOffset( this.editor, '<p>Get <span style="font-weight: bold;">th{</span><b>}is</b> word</p>',
				'this' );
		}
	} );
}() );
