/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: embedbase,autoembed,enterkey,undo */
/* bender-include: ../embedbase/_helpers/tools.js, ../clipboard/_helpers/pasting.js */

/* global embedTools, assertPasteEvent */

'use strict';

function correctJsonpCallback( urlTemplate, urlParams, callback ) {
	callback( {
		'url': decodeURIComponent( urlParams.url ),
		'type': 'rich',
		'version': '1.0',
		'html': '<img src="' + decodeURIComponent( urlParams.url ) + '">'
	} );
}

var jsonpCallback;

embedTools.mockJsonp( function() {
	jsonpCallback.apply( this, arguments );
} );

bender.editor = {
	creator: 'inline',
	config: {
		allowedContent: true
	}
};

bender.test( {
	setUp: function() {
		jsonpCallback = correctJsonpCallback;
	},

	'test working example': function() {
		var bot = this.editorBot;

		this.editor.once( 'paste', function( evt ) {
			assert.isMatching( /^<a data-cke-autoembed="\d+" href="https:\/\/foo.bar\/g\/200\/300">https:\/\/foo.bar\/g\/200\/300<\/a>$/, evt.data.dataValue );
		}, null, null, 900 );

		bot.setData( '<p>This is an embed</p>', function() {
			bot.editor.focus();

			var range = this.editor.createRange();
			range.setStart( this.editor.editable().findOne( 'p' ).getFirst(), 10 );
			range.collapse( true );
			this.editor.getSelection().selectRanges( [ range ] );

			this.editor.execCommand( 'paste', 'https://foo.bar/g/200/300' );

			// Note: afterPaste is fired asynchronously, but we can test editor data immediately.
			assert.areSame( '<p>This is an<a href="https://foo.bar/g/200/300">https://foo.bar/g/200/300</a> embed</p>', bot.getData() );

			wait( function() {
				assert.areSame( '<p>This is an</p><div data-oembed-url="https://foo.bar/g/200/300"><img src="https://foo.bar/g/200/300" /></div><p>embed</p>', bot.getData() );
			}, 200 );
		} );
	},

	'test embedding when request failed': function() {
		var bot = this.editorBot;
		jsonpCallback = function( urlTemplate, urlParams, callback, errorCallback ) {
			errorCallback();
		};

		bot.setData( '', function() {
			bot.editor.focus();
			this.editor.execCommand( 'paste', 'https://foo.bar/g/200/302' );

			// Note: afterPaste is fired asynchronously, but we can test editor data immediately.
			assert.areSame(
				'<p><a href="https://foo.bar/g/200/302">https://foo.bar/g/200/302</a></p>',
				bot.getData( 1 ),
				'link was pasted correctly'
			);

			wait( function() {
				assert.areSame(
					'<p><a href="https://foo.bar/g/200/302">https://foo.bar/g/200/302</a></p>',
					bot.getData( 1 ),
					'link was not auto embedded'
				);
			}, 200 );
		} );
	},

	'test when user splits the link before the request is finished': function() {
		var bot = this.editorBot;

		bot.setData( '', function() {
			bot.editor.focus();
			this.editor.execCommand( 'paste', 'https://foo.bar/g/200/304' );

			// Note: afterPaste is fired asynchronously, but we can test editor data immediately.
			assert.areSame( '<p><a href="https://foo.bar/g/200/304">https://foo.bar/g/200/304</a></p>', bot.getData( 1 ) );

			var range = this.editor.createRange();
			range.setStart( this.editor.editable().findOne( 'a' ).getFirst(), 5 );
			range.setEnd( this.editor.editable().findOne( 'a' ).getFirst(), 8 );
			this.editor.getSelection().selectRanges( [ range ] );
			this.editor.execCommand( 'enter' );

			assert.areSame(
				'<p><a href="https://foo.bar/g/200/304">https</a></p><p><a href="https://foo.bar/g/200/304">foo.bar/g/200/304</a></p>',
				bot.getData(),
				'enter key worked'
			);

			// It is not clear what should happen when the link was split, so we decided to embed only the first part.
			wait( function() {
				assert.areSame(
					'<div data-oembed-url="https://foo.bar/g/200/304"><img src="https://foo.bar/g/200/304" /></div>' +
					'<p><a href="https://foo.bar/g/200/304">foo.bar/g/200/304</a></p>',
					bot.getData( 1 ),
					'the first part of the link was auto embedded'
				);
			}, 200 );
		} );
	},

	'test uppercase link is auto embedded': function() {
		var pastedText = '<A href="https://foo.bar/bom">https://foo.bar/bom</A>',
			expected = /^<a data-cke-autoembed="\d+" href="https:\/\/foo.bar\/bom">https:\/\/foo.bar\/bom<\/a>$/;

		assertPasteEvent( this.editor, { dataValue: pastedText }, function( data ) {
			// Use prepInnerHtml to make sure attr are sorted.
			assert.isMatching( expected, bender.tools.html.prepareInnerHtmlForComparison( data.dataValue ) );
		} );
	},

	'test link with attributes is auto embedded': function() {
		var pastedText = '<a id="kitty" name="colonelMeow" href="https://foo.bar/bom">https://foo.bar/bom</a>',
			expected = /^<a data-cke-autoembed="\d+" href="https:\/\/foo.bar\/bom" id="kitty" name="colonelMeow">https:\/\/foo.bar\/bom<\/a>$/;

		assertPasteEvent( this.editor, { dataValue: pastedText }, function( data ) {
			// Use prepInnerHtml to make sure attr are sorted.
			assert.isMatching( expected, bender.tools.html.prepareInnerHtmlForComparison( data.dataValue ) );
		} );
	},

	'test anchor is not auto embedded': function() {
		var pastedText = '<a id="foo">Not a link really.</a>';

		assertPasteEvent( this.editor, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
	},

	// Because it means that user copied a linked text, not a link.
	'test link with text different than its href is not auto embedded': function() {
		var pastedText = '<a href="https://foo.bar/g/300/300">Foo bar.</a>';

		assertPasteEvent( this.editor, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
	},

	// 'test undo': function() {
	// 	var bot = this.editorBot,
	// 		pastedText = 'https://foo.bar/g/200/382';

	// 	bot.setData( '', function() {
	// 		this.editor.execCommand( 'paste', pastedText );
	// 		assert.areSame( '<p><a href="' + pastedText + '">' + pastedText + '</a></p>', bot.getData() );

	// 		this.editor.execCommand( 'undo' );

	// 		wait( function() {
	// 			assert.areSame( '', bot.getData() );
	// 		}, 200 );
	// 	} );
	// },

	// 'test undo after embed': function() {
	// 	var bot = this.editorBot,
	// 		pastedText = 'https://foo.bar/g/200/382',
	// 		that = this;

	// 	bot.setData( '', function() {
	// 		this.editor.execCommand( 'paste', pastedText );
	// 		assert.areSame( '<p><a href="' + pastedText + '">' + pastedText + '</a></p>', bot.getData() );

	// 		wait( function() {
	// 			this.editor.execCommand( 'undo' );

	// 			// The "cke-auto-embed" attribute should not be present.
	// 			assert.isInnerHtmlMatching( '<p><a data-cke-saved-href="' + pastedText + '" href="' + pastedText + '">' +
	// 				pastedText + '[]</a><br /></p>', bender.tools.selection.getWithHtml( that.editor ) );
	// 		}, 200 );
	// 	} );
	// },

	// 'test double undo': function() {
	// 	var bot = this.editorBot,
	// 		pastedText = 'https://foo.bar/g/210/382';

	// 	bot.setData( '<p></p>', function() {
	// 		this.editor.execCommand( 'paste', pastedText );
	// 		assert.areSame( '<p><a href="' + pastedText + '">' + pastedText + '</a></p>', bot.getData() );

	// 		wait( function() {
	// 			assert.areSame( '<div data-oembed-url="' + pastedText + '"><img src="' + pastedText + '" /></div>', bot.getData() );

	// 			this.editor.execCommand( 'undo' );

	// 			assert.areSame( '<p><a href="' + pastedText + '">' + pastedText + '</a></p>', bot.getData() );

	// 			this.editor.execCommand( 'undo' );

	// 			assert.areSame( '', bot.getData() );
	// 		}, 200 );
	// 	} );
	// },

	// 'test undo and redo': function() {
	// 	var bot = this.editorBot,
	// 		pastedText = 'https://foo.bar/g/400/382',
	// 		that = this;

	// 	bot.setData( '<p></p>', function() {
	// 		this.editor.execCommand( 'paste', pastedText );
	// 		assert.areSame( '<p><a href="' + pastedText + '">' + pastedText + '</a></p>', bot.getData() );

	// 		wait( function() {
	// 			this.editor.execCommand( 'undo' );
	// 			assert.isInnerHtmlMatching( '<p>[]<br /></p>', bender.tools.selection.getWithHtml( that.editor ) );

	// 			this.editor.execCommand( 'redo' );
	// 			assert.isInnerHtmlMatching( [ '<p><a data-cke-saved-href="' + pastedText + '" href="' + pastedText + '">' +
	// 				pastedText + '[]</a><br /></p>' ], bender.tools.selection.getWithHtml( that.editor ) );

	// 			// Embedding never really happened, so an additional redo step should do nothing.
	// 			this.editor.execCommand( 'redo' );
	// 			assert.isInnerHtmlMatching( [ '<p><a data-cke-saved-href="' + pastedText + '" href="' + pastedText + '">' +
	// 				pastedText + '[]</a><br /></p>' ], bender.tools.selection.getWithHtml( that.editor ) );

	// 		}, 50 ); // User fired undo before the link was embedded.
	// 	} );
	// },

	'test internal paste is not auto embedded - text URL': function() {
		var	editor = this.editor,
			pastedText = 'https://foo.bar/g/185/310';

		this.editor.once( 'paste', function( evt ) {
			evt.data.dataTransfer.sourceEditor = editor;
		}, null, null, 1 );

		this.editor.once( 'paste', function( evt ) {
			evt.cancel();
			assert.areSame( pastedText, evt.data.dataValue );
		}, null, null, 900 );

		this.editor.execCommand( 'paste', pastedText );
	},

	'test internal paste is not auto embedded - link': function() {
		var	editor = this.editor,
			pastedText = '<a href="https://foo.bar/g/185/310">https://foo.bar/g/185/310</a>';

		this.editor.once( 'paste', function( evt ) {
			evt.data.dataTransfer.sourceEditor = editor;
		}, null, null, 1 );

		this.editor.once( 'paste', function( evt ) {
			evt.cancel();
			assert.areSame( pastedText, evt.data.dataValue );
		}, null, null, 900 );

		this.editor.execCommand( 'paste', pastedText );
	}
} );
