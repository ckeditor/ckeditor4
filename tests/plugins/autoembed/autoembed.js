/* bender-tags: editor */
/* bender-ckeditor-plugins: embed,autoembed,enterkey,undo,link */
/* bender-include: ../embedbase/_helpers/tools.js, ../clipboard/_helpers/pasting.js */
/* global embedTools, assertPasteEvent */

'use strict';

var objToArray = bender.tools.objToArray;

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
	creator: 'inline'
};

bender.test( {
	setUp: function() {
		jsonpCallback = correctJsonpCallback;
	},

	'test working example': function() {
		// Autolink plugin is disabled in IE to avoid feature duplication,
		// which causes the test to fail (#4500).
		if ( CKEDITOR.env.ie ) {
			assert.ignore();
		}

		var bot = this.editorBot;

		this.editor.once( 'paste', function( evt ) {
			assert.isMatching( /^<a data-cke-autoembed="\d+" href="https:\/\/foo.bar\/g\/200\/300">https:\/\/foo.bar\/g\/200\/300<\/a>$/i, evt.data.dataValue );
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
			}, 400 );
		} );
	},

	'test embedding when request failed': function() {
		// Autolink plugin is disabled in IE to avoid feature duplication,
		// which causes the test to fail (#4500).
		if ( CKEDITOR.env.ie ) {
			assert.ignore();
		}

		var bot = this.editorBot,
			instanceDestroyedSpy = sinon.spy();

		jsonpCallback = function( urlTemplate, urlParams, callback, errorCallback ) {
			resume( function() {
				errorCallback();

				assert.areSame( '<p><a href="https://foo.bar/g/200/302">https://foo.bar/g/200/302</a></p>', bot.getData( 1 ), 'link was not auto embedded' );
				assert.isTrue( instanceDestroyedSpy.called, 'Widget instance destroyed.' );
			} );
		};

		bot.setData( '', function() {
			bot.editor.focus();
			this.editor.execCommand( 'paste', 'https://foo.bar/g/200/302' );

			// Check if errorCallback was called - it should destroy widget instance.
			this.editor.widgets.once( 'instanceDestroyed', instanceDestroyedSpy );

			// Note: afterPaste is fired asynchronously, but we can test editor data immediately.
			assert.areSame( '<p><a href="https://foo.bar/g/200/302">https://foo.bar/g/200/302</a></p>', bot.getData( 1 ), 'link was pasted correctly' );

			wait();
		} );
	},

	'test when user splits the link before the request is finished': function() {
		// Autolink plugin is disabled in IE to avoid feature duplication,
		// which causes the test to fail (#4500).
		if ( CKEDITOR.env.ie ) {
			assert.ignore();
		}

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
			}, 700 );
		} );
	},

	// https://dev.ckeditor.com/ticket/13420.
	'test link with encodable characters': function() {
		// Autolink plugin is disabled in IE to avoid feature duplication,
		// which causes the test to fail (#4500).
		if ( CKEDITOR.env.ie ) {
			assert.ignore();
		}

		var links = [
			// Mind that links differ in a part g/200/3xx so it is easier and faster
			// to check which link failed the test.

			// Pasting a link alone:
			// No encoding:
			'https://foo.bar/g/200/301?foo="æåãĂĄ"',

			// Partially encoded:
			'https://foo.bar/g/200/302?foo=%22%20æåãĂĄ%22',

			// Fully encoded:
			'https://foo.bar/g/200/303?foo=%22%20%C3%A6%C3%A5%C3%A3%C4%82%C4%84%22',

			// Encoded twice:
			'https://foo.bar/g/200/304?foo=%2522%2520%25C3%25A6%25C3%25A5%25C3%25A3%25C4%2582%25C4%2584%2522',

			// &amp; not encoded:
			'https://foo.bar/g/200/305?foo="æåãĂĄ"&bar=bar',

			// &amp; encoded:
			'https://foo.bar/g/200/306?foo="æåãĂĄ"&amp;bar=bar',

			// Pasting <a> element:
			// &amp;:
			'<a href="https://foo.bar/g/200/307?foo=%20æåãĂĄ%20&amp;bar=bar">https://foo.bar/g/200/307?foo=%20æåãĂĄ%20&amp;bar=bar</a>',

			// Quote sign:
			'<a href="https://foo.bar/g/200/310?foo=&quot;æåãĂĄ&quot;">https://foo.bar/g/200/310?foo=&quot;æåãĂĄ&quot;</a>',
			'<a href="https://foo.bar/g/200/310?foo=%22æåãĂĄ%22">https://foo.bar/g/200/310?foo="æåãĂĄ"</a>',
			'<a href="https://foo.bar/g/200/311?foo=%22æåãĂĄ%22">https://foo.bar/g/200/311?foo=%22æåãĂĄ%22</a>',

			// Mixed encoding:
			'<a href="https://foo.bar/g/200/312?foo=%22%20%C3%A6%C3%A5%C3%A3%C4%82%C4%84%22">https://foo.bar/g/200/312?foo=%22%20æåãĂĄ%22</a>'
		];

		var autoEmbedRegExp = /data-cke-autoembed="\d+"/;

		for ( var i = links.length; i--; ) {
			assertPasteEvent( this.editor, { dataValue: links[ i ] }, function( data ) {
				// Use prepareInnerHtmlForComparison to make sure attributes are sorted.
				assert.isMatching( autoEmbedRegExp, bender.tools.html.prepareInnerHtmlForComparison( data.dataValue ) );
			} );
		}
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

	'test 2 step undo': function() {
		// Autolink plugin is disabled in IE to avoid feature duplication,
		// which causes the test to fail (#4500).
		if ( CKEDITOR.env.ie ) {
			assert.ignore();
		}

		var bot = this.editorBot,
			editor = bot.editor,
			pastedText = 'https://foo.bar/g/200/382',
			finalData = '<p>foo</p><div data-oembed-url="' + pastedText + '"><img src="' + pastedText + '" /></div><p>bar</p>',
			linkData = '<p>foo<a href="' + pastedText + '">' + pastedText + '</a>bar</p>',
			initialData = '<p>foobar</p>';

		bot.setData( '', function() {
			editor.focus();
			bender.tools.selection.setWithHtml( editor, '<p>foo{}bar</p>' );
			editor.resetUndo();

			editor.execCommand( 'paste', pastedText );

			wait( function() {
				assert.areSame( finalData, editor.getData(), 'start' );

				editor.execCommand( 'undo' );
				assert.areSame( linkData, editor.getData(), 'after 1st undo' );

				editor.execCommand( 'undo' );
				assert.areSame( initialData, editor.getData(), 'after 2nd undo' );

				assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'undo' ).state, 'undo is disabled' );

				editor.execCommand( 'redo' );
				assert.areSame( linkData, editor.getData(), 'after 1st redo' );

				editor.execCommand( 'redo' );
				assert.areSame( finalData, editor.getData(), 'after 2nd redo' );

				assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'redo' ).state, 'redo is disabled' );
			}, 1507 );
		} );
	},

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
	},

	// https://dev.ckeditor.com/ticket/13532
	'test re–embeddable url': function() {
		var bot = this.editorBot,
			editor = bot.editor;

		jsonpCallback = function( urlTemplate, urlParams, callback ) {
			resume( function() {
				// Make the URL a nice widget.
				callback( {
					type: 'rich',
					html: '<p>url:' + urlParams.url + '</p>'
				} );

				// Undo embedding. There's no widget, the link is in the content instead.
				editor.execCommand( 'undo' );

				// Will be pasting something after the link. Prepare a nice range.
				var range = editor.createRange();
				range.moveToPosition( editor.editable().findOne( 'a' ), CKEDITOR.POSITION_AFTER_END );
				range.select();

				// Make sure transfer type for the next paste is CKEDITOR.DATA_TRANSFER_INTERNAL to
				// avoid processing of pasted data.
				editor.once( 'paste', function( evt ) {
					evt.data.dataTransfer.sourceEditor = editor;
				}, null, null, 1 );

				// Paste anything to check if the embeddable link, which used to
				// be a widget before 'undo' was called is re–embedded. It shouldn't be.
				editor.execCommand( 'paste', 'y' );

				wait( function() {
					assert.areEqual( 0, objToArray( editor.widgets.instances ).length, 'Link should not be re–embedded.' );
				}, 400 );
			} );
		};

		bot.setData( '', function() {
			// Paste any embeddable URL.
			this.editor.execCommand( 'paste', '<a href="x">x</a>' );
			wait();
		} );
	},

	'test when user press undo before embedding process finishes': function() {
		var bot = this.editorBot,
			editor = bot.editor,
			pastedText = 'https://foo.bar/g/200/382',
			finalizeCreationSpy = sinon.spy( CKEDITOR.plugins.widget.repository.prototype, 'finalizeCreation' );

		editor.once( 'afterPaste', function() {
			editor.execCommand( 'undo' );

		}, null, null, 900 );

		bot.setData( '', function() {
			editor.focus();
			editor.resetUndo();
			editor.execCommand( 'paste', pastedText );

			wait( function() {
				CKEDITOR.plugins.widget.repository.prototype.finalizeCreation.restore();
				assert.areSame( finalizeCreationSpy.called, false, 'finalize creation was not called' );
			}, 400 );
		} );
	},

	'check if notifications are showed after unsuccessful embedding': function() {
		// Autolink plugin is disabled in IE to avoid feature duplication,
		// which causes the test to fail (#4500).
		if ( CKEDITOR.env.ie ) {
			assert.ignore();
		}

		var bot = this.editorBot,
			editor = bot.editor,
			firstRequest = true,
			notificationShowSpy = sinon.spy( CKEDITOR.plugins.notification.prototype, 'show' );

		// JSONP callback for embed request.
		jsonpCallback = function( urlTemplate, urlParams, callback, errorCallback ) {

			// First request will return error - so two notifications should be showed.
			// First informing about embedding process, second about embedding error.
			if ( firstRequest ) {
				errorCallback();
				firstRequest = false;
				editor.execCommand( 'paste', 'https://foo.bar/g/notification/test/2' );
			} else {
				resume( function() {

					// Second request returns success - one notification should be showed.
					callback( {
						'url': decodeURIComponent( urlParams.url ),
						'type': 'rich',
						'version': '1.0',
						'html': '<img src="' + decodeURIComponent( urlParams.url ) + '">'
					} );

					notificationShowSpy.restore();

					// Check if notification was showed three times.
					assert.isTrue( notificationShowSpy.calledThrice, 'Notification should be showed three times.' );
				} );
			}
		};

		bot.setData( '', function() {
			editor.focus();
			editor.execCommand( 'paste', 'https://foo.bar/g/notification/test/1' );
			wait();
		} );
	},

	// https://dev.ckeditor.com/ticket/13429.
	'test selection after auto embedding - empty editor': function() {
		// Autolink plugin is disabled in IE to avoid feature duplication,
		// which causes the test to fail (#4500).
		if ( CKEDITOR.env.ie ) {
			assert.ignore();
		}

		var bot = this.editorBot,
			editor = bot.editor,
			pastedText = 'https://foo.bar/g/200/382';

		bot.setData( '', function() {
			editor.focus();
			editor.execCommand( 'paste', pastedText );

			wait( function() {
				// Check if there is exactly one additional <p> created after the widget.
				assert.isInnerHtmlMatching( '<div data-oembed-url="' + pastedText + '"><img src="' + pastedText + '" /></div><p>&nbsp;</p>', editor.getData(), 'right editor data after paste' );
				var p = editor.editable().findOne( 'p' );

				// Check if caret is inside newly created <p>.
				var range = editor.getSelection().getRanges()[ 0 ];
				assert.isTrue( range.collapsed, 'selection after paste is collapsed' );
				assert.areSame( 0, range.startOffset, 'selection at the beginning of the paragraph' );
				assert.isTrue( range.startContainer.equals( p ), 'selection inside correct p element' );
			}, 400 );
		} );
	},

	// https://dev.ckeditor.com/ticket/13429.
	'test selection after auto embedding - inside content': function() {
		// Autolink plugin is disabled in IE to avoid feature duplication,
		// which causes the test to fail (#4500).
		if ( CKEDITOR.env.ie ) {
			assert.ignore();
		}

		var bot = this.editorBot,
			editor = bot.editor,
			pastedText = 'https://foo.bar/g/200/382';

		bot.setData( '<p>foo</p><p>bar</p>', function() {
			editor.focus();

			// Set caret at the end of the first <p>.
			var range = editor.createRange();
			range.setStart( this.editor.editable().find( 'p' ).getItem( 0 ).getFirst(), 3 );
			range.collapse();
			// '<p>foo^</p><p>bar</p>'
			editor.getSelection().selectRanges( [ range ] );

			editor.execCommand( 'paste', pastedText );

			wait( function() {
				// Get the second <p>.
				var p = editor.editable().find( 'p' ).getItem( 1 );
				var range = editor.getSelection().getRanges()[ 0 ];
				var container = range.startContainer;

				// Check if caret is inside second <p>.
				// Different browsers set startContainer differently,
				// so we check if it is in <p> or in a text node inside that <p>.
				assert.isTrue( range.collapsed, 'selection after paste is collapsed' );
				assert.areSame( 0, range.startOffset, 'selection anchored at the beginning of the paragraph' );
				assert.isTrue( !!new CKEDITOR.dom.elementPath( container ).contains( p ), 'selection inside correct p element' );
				assert.isInnerHtmlMatching( 'bar@', ( container.type == CKEDITOR.NODE_TEXT ? container.getParent() : container ).getHtml(), 'selection inside correct p element' );
			}, 400 );
		} );
	},

	// https://dev.ckeditor.com/ticket/13429.
	'test selection after auto embedding - content and selection change before insert': function() {
		// Autolink plugin is disabled in IE to avoid feature duplication,
		// which causes the test to fail (#4500).
		if ( CKEDITOR.env.ie ) {
			assert.ignore();
		}

		var bot = this.editorBot,
			editor = bot.editor,
			editable = editor.editable(),
			pastedText = 'https://foo.bar/g/200/382';

		bot.setData( '', function() {
			editor.focus();
			editor.execCommand( 'paste', pastedText );

			var pastedAnchor = editable.findOne( 'a' );

			// After link has been pasted, "type" some text...
			var text = new CKEDITOR.dom.text( 'foo' );
			text.insertAfter( pastedAnchor );

			// ..and make a selection on that text.
			// "[foo]"
			var range = editor.createRange();
			range.setStartBefore( text );
			range.setEndAfter( text );
			range.select();

			wait( function() {
				assert.areSame( '<div data-oembed-url="' + pastedText + '"><img src="' + pastedText + '" /></div><p>foo</p>', editor.getData(), 'right editor data after paste' );
				assert.isMatching( /[{\[](\u200b+)?foo[}\]]/, bender.tools.selection.getWithHtml( editor ), 'selection anchored at the right position' );
			}, 400 );
		} );
	}
} );
