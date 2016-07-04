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

			// Workaround for IE8 needed due to #13842.
			testGettingWordOffset( this.editor, '<p>Get <span style="font-weight: bold">th{}is word</span></p>',
				CKEDITOR.env.ie && CKEDITOR.env.version === 8 ? 'isth' : 'this' );

			testGettingWordOffset( this.editor, '<p>Get <span style="font-weight: bold">this w{}ord</span></p>', 'word' );
		},

		'test getSelectedWordOffset (word inside nested elements)': function() {
			testGettingWordOffset( this.editor, '<p>Get <u><span style="font-weight: bold">th{}is</span></u> word</p>',
				'this' );

			// Workaround for IE8 needed due to #13842.
			testGettingWordOffset( this.editor,
				'<p>Get <s><u><span style="font-weight: bold">th{}is word</span></u></s></p>',
				CKEDITOR.env.ie && CKEDITOR.env.version === 8 ? 'isth' : 'this' );

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

			// These elements should break enlarging.
			testGettingWordOffset( this.editor, '<table><tr><td>aa bb</td><td>c{}c dd</td></tr></table>', 'cc' );
			testGettingWordOffset( this.editor, '<table><tr><th>aa bb</th><th>c{}c dd</th></tr></table>', 'cc' );
			testGettingWordOffset( this.editor, '<ul><li>aa</li><li>b{}b</li><li>cc</li></ul>', 'bb' );
		},

		'test getSelectedWordOffset (comment nodes)': function() {
			testGettingWordOffset( this.editor, '<p><!--comment-->w{}ord</p>', 'word' );
			testGettingWordOffset( this.editor, '<p>w{}o<!--comment-->rd</p>', 'word' );
			testGettingWordOffset( this.editor, '<p><!--comment-->w{}ord<!--comment--></p>', 'word' );
			testGettingWordOffset( this.editor, '<p><!--comment--><span>w{}ord</span></p>', 'word' );
			testGettingWordOffset( this.editor, '<p><span>w{}ord</span><!--comment--></p>', 'word' );
			testGettingWordOffset( this.editor, '<p><span style="color: #0000FF;">w</span><!--comment-->{}ord</p>',
				'word' );
			testGettingWordOffset( this.editor, '<p><span style="color: #0000FF;">w{}</span><!--comment-->ord</p>',
				'word' );
			testGettingWordOffset( this.editor, '<p><span style="color: #0000FF;">w</span>o{}r<!--comment-->d</p>',
				'word' );
			testGettingWordOffset( this.editor, '<p>w{}o<!--comment--> <!--comment2-->rd</p>', 'wo' );
		},

		'test getSelectedWordOffset (space at the end of element)': function() {
			testGettingWordOffset( this.editor, '<p><span>Get </span>th{}is word</p>', 'this' );
			testGettingWordOffset( this.editor, '<p><span><span>Get </span></span>th{}is word</p>', 'this' );
		},

		'test getSelectedWordOffset (with <br>)': function() {
			testGettingWordOffset( this.editor, '<p>Get<br>th{}is word</p>', 'this' );
			testGettingWordOffset( this.editor, '<p>Ge th{}is<br>word</p>', 'this' );
		},

		'test getSelectedWordOffset (nested lists)': function() {
			testGettingWordOffset( this.editor, '<ol><li><span style="text-decoration: underline;">Te{}st</span><ol><li><b>dog</b></li></ol>', 'Test' );
		}
	} );
}() );
