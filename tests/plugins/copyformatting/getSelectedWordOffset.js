/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */
/* bender-include: _helpers/tools.js */
/* global testGettingWordOffset */
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
			testGettingWordOffset( this.editor, '<p>Get <span style="font-weight: bold">th{}is word</span></p>', 'this' );
			testGettingWordOffset( this.editor, '<p>Get <span style="font-weight: bold">this w{}ord</span></p>', 'word' );
		},

		'test getSelectedWordOffset (word inside nested elements)': function() {
			testGettingWordOffset( this.editor, '<p>Get <u><span style="font-weight: bold">th{}is</span></u> word</p>',
				'this' );
			testGettingWordOffset( this.editor,
				'<p>Get <s><u><span style="font-weight: bold">th{}is word</span></u></s></p>', 'this' );
			testGettingWordOffset( this.editor,
				'<p>Get <u><span style="font-weight: bold">this w{}ord</span></u></p>', 'word' );
		},

		'test getSelectedWordOffset (word splitted between element and text node)': function() {
			testGettingWordOffset( this.editor, '<p>Get <span style="font-weight: bold;">th</span>{}is word</p>', 'this' );
			testGettingWordOffset( this.editor, '<p>Get <span style="font-weight: bold;">th</span>is wo{}rd</p>', 'word' );
		},

		'test getSelectedWordOffset (word at the boundary of block)': function() {
			testGettingWordOffset( this.editor, '<p>G{}et this word</p>', 'Get' );
			testGettingWordOffset( this.editor, '<p>Get this wor{}d</p>', 'word' );
			testGettingWordOffset( this.editor, '<p>Get this wor{}d.</p>', 'word' );
		},

		'test getSelectedWordOffset (word splitted between elements)': function() {
			testGettingWordOffset( this.editor, '<p>Get <span style="font-weight: bold;">th{}</span><b>is</b> word</p>',
				'this' );
			testGettingWordOffset( this.editor, '<p>Get <span style="font-weight: bold;">th</span><b>{}is</b> word</p>',
				'this' );
		},

		'test getSelectedWordOffset (word splitted between element, text node, element)': function() {
			testGettingWordOffset( this.editor, '<p><span style="color: #0000FF;">bar{}</span>foo<span style="color: #0000FF;">baz</span></p>',
				'barfoobaz' );
			testGettingWordOffset( this.editor, '<p><span style="color: #0000FF;">bar</span>f{}oo<span style="color: #0000FF;">baz</span></p>',
				'barfoobaz' );
			testGettingWordOffset( this.editor, '<p><span style="color: #0000FF;">bar</span>foo<span style="color: #0000FF;">{}baz</span></p>',
				'barfoobaz' );
		}
	} );
}() );
