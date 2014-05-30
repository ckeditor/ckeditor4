/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities,clipboard,pastetext */

/*
 *
 * TOP TIP for all tests - DO NOT use editor.setData() or editor.editable().setHtml()
 *		without setting selection. This causes on some IEs exceptions in CKEDITOR.dom.range
 *		(stack trace starts from clipboard/plugin.js: sel.selectBookmarks( bms ))
 *
 */

( function() {
	'use strict';

	bender.editor =
	{
		config:
		{
			clipboard_defaultContentType: 'text',
			allowedContent: true
		}
	};

	function testEditor( tc, config, callback ) {
		var editor = new CKEDITOR.editor( config );

		editor.on( 'loaded', function() {
				tc.resume( function() {
						callback( editor );
					} );
			} );

		tc.wait();
	}

	function assertAfterPasteContent( tc, html ) {
		tc.editor.on( 'afterPaste', function( evt ) {
				evt.removeListener();
				tc.resume( function() {
					   assert.areSame( html, tc.editor.getData() );
				   } );
			} );
	}

	bender.test(
	{
		_should : {
			ignore: CKEDITOR.env.ie ?
				{
					// We cannot test them in IE because this tcs will open security alert which will stop tests.
					'editor.getClipboardData - successful' : true,
					'editor.getClipboardData - unsuccessful' : true,
					'editor.getClipboardData - canceled beforePaste' : true
				}
				: null
		},

		setUp : function() {
			// Force result data un-formatted.
			this.editor.dataProcessor.writer._.rules = {};
			this.editor.focus();
		},

		/**
		 * Remove all editor's paste listeners that were set by corresponding
		 * method tc.on()
		 */
		cleanUp : function() {
			var editor = this.editor,
				name;

			for ( name in { paste : 1, beforePaste : 1, afterPaste : 1 } )
				this[ name + 'Callback' ] && editor.removeListener( name, this[ name + 'Callback' ] );

			this.pasteCallback = this.beforePasteCallback = this.afterPasteCallback = null;
		},

		/**
		 * Add listener to the editor instance, so it'll be possible to remove it later
		 * by tc.cleanUp method.
		 */
		on : function( name, callback, priority ) {
			this.editor.on( name, callback, null, null, priority );
			this[ name + 'Callback' ] = callback;
		},

		'paste text' : function() {
			var tc = this,
				editor = this.editor;

			bender.tools.setHtmlWithSelection( editor, '<p>foo^bar</p>' );
			bender.tools.emulatePaste( this.editor, '<p>bam</p>' );

			assertAfterPasteContent( this, '<p>foobambar</p>' );
			this.wait();
		},

		'paste html' : function() {
			var tc = this,
				editor = this.editor;

			bender.tools.setHtmlWithSelection( editor, '<p>foo^bar</p>' );
			bender.tools.emulatePaste( editor, 'abc<b>def</b>' );

			assertAfterPasteContent( tc, '<p>fooabc<b>def</b>bar</p>' );
			tc.wait();
		},

		'paste into selection' : function() {
			var tc = this,
				editor = this.editor;

			bender.tools.setHtmlWithSelection( editor, '<p>fo[ob]ar</p>' );
			bender.tools.emulatePaste( editor, '<p>abc</p>' );

			assertAfterPasteContent( tc, '<p>foabcar</p>' );
			tc.wait();
		},

		'paste events' : function() {
			var tc = this,
				editor = this.editor,
				order = [];

			editor.on( 'beforePaste', function( evt ) {
					evt.removeListener();
					order.push( 'a-' + evt.data.type );
				} );

			editor.on( 'paste', function( evt ) {
					var data = evt.data;
					evt.removeListener();
					order.push( 'b-' + data.type + '-' + ( data.dataValue && data.dataValue.toLowerCase() ) );
				} );

			editor.on( 'afterPaste', function( evt ) {
					evt.removeListener();
					tc.resume( function() {
							assert.areEqual( 'a-auto', order[ 0 ], 'proper order and data for beforePaste' );
							assert.areEqual( 'b-html-<b>foo</b>', order[ 1 ], 'proper order and data for paste' );
						} );
				} );

			bender.tools.emulatePaste( editor, '<b>foo</b>' );
			this.wait();
		},

		'cancel beforePaste' : function() {
			var tc = this,
				editor = this.editor,
				flag = null;

			tc.on( 'beforePaste', function( evt ) {
					evt.cancel();
					flag = true;
				} );

			tc.on( 'paste', function( evt ) {
					flag = false;
				} );

			tc.on( 'afterPaste', function( evt ) {
					flag = false;
				} );

			bender.tools.setHtmlWithSelection( editor, '^' );
			bender.tools.emulatePaste( editor, 'foo' );

			// Let paste and afterPaste be fired (if there's a bug somewhere).
			tc.wait( function() {
					tc.cleanUp();
					assert.isTrue( flag, 'canceling beforePaste stops execution' );
					assert.areEqual( '', editor.getData() );
				}, 50 );
		},

		'cancel paste' : function() {
			var tc = this,
				editor = this.editor,
				flag = null;

			tc.on( 'paste', function( evt ) {
					evt.cancel();
					flag = true;
				} );

			tc.on( 'afterPaste', function( evt ) {
					flag = false;
				} );

			bender.tools.setHtmlWithSelection( editor, '^' );
			bender.tools.emulatePaste( editor, 'foo' );

			// Let afterPaste be fired (if there's a bug somewhere).
			tc.wait( function() {
					tc.cleanUp();
					assert.areEqual( '', editor.getData() );
					assert.isTrue( flag, 'canceling paste stops execution' );
				}, 50 );
		},

		'modify pasted content' : function() {
			var tc = this,
				editor = this.editor;

			editor.on( 'paste', function( evt ) {
					evt.removeListener();
					evt.data.dataValue = '<b>' + evt.data.dataValue + '</b>';
				} );

			bender.tools.setHtmlWithSelection( editor, '^' );
			bender.tools.emulatePaste( editor, '<u>f</u>oo' );

			assertAfterPasteContent( tc, '<p><b><u>f</u>oo</b></p>' );
			tc.wait();
		},

		'editor#paste command' : function() {
			var tc = this,
				editor = this.editor,
				order = [];

			editor.on( 'beforePaste', function( evt ) {
					evt.removeListener();
					order.push( 'a-' + evt.data.type );
				} );

			editor.on( 'paste', function( evt ) {
					evt.removeListener();
					order.push( 'b-' + evt.data.type + '-' + evt.data.dataValue );
				} );

			editor.on( 'afterPaste', function( evt ) {
					evt.removeListener();
					tc.resume( function() {
							assert.areEqual( 'a-auto', order[ 0 ], 'proper order and data for beforePaste' );
							assert.areEqual( 'b-html-<b>foo</b>bar', order[ 1 ], 'proper order and data for paste' );
						} );
				} );

			bender.tools.setHtmlWithSelection( editor, '<p>[abc]</p>' );
			setTimeout( function() {
				editor.execCommand( 'paste', '<b>foo</b>bar' );
			} );
			tc.wait();
		},

		'pasting empty string with editor#paste command' : function() {
			var tc = this,
				editor = this.editor,
				flag = false,
				callback = function( evt ) {
					evt.removeListener();
					flag = true;
				};

			tc.on( 'paste', callback );
			tc.on( 'afterPaste', callback );

			bender.tools.setHtmlWithSelection( editor, '<p>[abc]</p>' );
			editor.execCommand( 'paste', '' );
			tc.wait( function() {
					tc.cleanUp();
					assert.isFalse( flag, 'paste and afterPaste callback shouldn\'t be called' );
					assert.areEqual( editor.getData(), '<p>abc</p>' );
				}, 50 );
		},

		'pasting empty string (native version)' : function() {
			var tc = this,
				editor = this.editor,
				flag = false,
				callback = function( evt ) {
					evt.removeListener();
					flag = true;
				};

			tc.on( 'paste', callback );
			tc.on( 'afterPaste', callback );

			bender.tools.setHtmlWithSelection( editor, '<p>[abc]</p>' );
			// Firefox does not allow to paste empty string (''), so we're basing
			// on pasteDataFromClipboard which removes bookmarks.
			// Bookmark has to have body because Fx produces <br> if it's empty.
			bender.tools.emulatePaste( editor, '<span data-cke-bookmark="1">a</span>' );
			tc.wait( function() {
					tc.cleanUp();
					assert.isFalse( flag, 'paste and afterPaste callback shouldn\'t be called' );
					assert.areEqual( editor.getData(), '<p>abc</p>' );
				}, 50 );
		},

		'paste events - forcePasteAsPlainText' : function() {
			var beforeType,
				tc = this;

			testEditor( this, { forcePasteAsPlainText : true },
			function( editor ) {
					editor.on( 'beforePaste', function( evt ) {
							evt.removeListener();
							beforeType = evt.data.type;
						} );

					editor.on( 'paste', function( evt ) {
							evt.removeListener();
							assert.areEqual( 'text', beforeType, 'beforePaste.data.type' );
							assert.areEqual( 'text', evt.data.type, 'paste.data.type' );
							assert.areEqual( '<p>foo bar</p>', evt.data.dataValue, 'paste.data.data' );
						} );

					// We need to enable this command manually, because this listener is executed before event#mode
					// which refreshes commands automatically.
					editor.getCommand( 'paste' ).enable();
					editor.execCommand( 'paste', '<p><b>foo</b> bar</p>' );
				} );
		},

		'content type sniffing - text' : function() {
			assertPasteEvent( this.editor, { dataValue : 'abc' },
				{ type : 'text' }, 'text only' );

			assertPasteEvent( this.editor, { dataValue : 'aa bb> cc' },
				{ type : 'text' }, 'text only 2' );

			assertPasteEvent( this.editor, { dataValue : 'a&nbsp;bc' },
				{ type : 'text' }, 'text only 3' );
		},

		'content type sniffing - htmlified text - Firefox & Opera' : function() {
			if ( !CKEDITOR.env.gecko )
				assert.ignore();

			assertPasteEvent( this.editor, { dataValue : 'a<br>bc' },
				{ type : 'text' }, 'htmlified text' );

			assertPasteEvent( this.editor, { dataValue : '<br>' },
				{ type : 'text' }, 'htmlified text 2' );

			assertPasteEvent( this.editor, { dataValue : 'a<br />bc' },
				{ type : 'text' }, 'htmlified text 3' );

			assertPasteEvent( this.editor, { dataValue : 'a<br/>bc' },
				{ type : 'text' }, 'htmlified text 4' );

			assertPasteEvent( this.editor, { dataValue : '<p>a</p>' },
				{ type : 'html' }, 'html 1' );

			assertPasteEvent( this.editor, { dataValue : '<hr>' },
				{ type : 'html' }, 'html 2' );
		},

		'content type sniffing - htmlified text - Webkit' : function() {
			if ( !CKEDITOR.env.webkit )
				assert.ignore();

			assertPasteEvent( this.editor, { dataValue : '<div>a</div>' },
				{ type : 'text' }, 'htmlified text 1' );

			assertPasteEvent( this.editor, { dataValue : '<div>a</div><div><br></div><div><br></div><div>b</div>' },
				{ type : 'text' }, 'htmlified text 2' );

			assertPasteEvent( this.editor, { dataValue : '<div><br /></div>' },
				{ type : 'text' }, 'htmlified text 3' );

			assertPasteEvent( this.editor, { dataValue : '<p>a</p>' },
				{ type : 'html' }, 'html 1' );

			assertPasteEvent( this.editor, { dataValue : '<hr>' },
				{ type : 'html' }, 'html 2' );

			assertPasteEvent( this.editor, { dataValue : '<br>' },
				{ type : 'html' }, 'html 3' );

			assertPasteEvent( this.editor, { dataValue : '<div>a<br>b</div>' },
				{ type : 'html' }, 'html 4' );

			assertPasteEvent( this.editor, { dataValue : 'a<br />bc' },
				{ type : 'html' }, 'html 5' );

			assertPasteEvent( this.editor, { dataValue : '<div>a<div>b</div>c</div>' },
				{ type : 'html' }, 'html 6' );
		},

		'content type sniffing - htmlified text - IEs' : function() {
			if ( !CKEDITOR.env.ie )
				assert.ignore();

			assertPasteEvent( this.editor, { dataValue : '<p>a</p>' },
				{ type : 'text' }, 'htmlified text 1' );

			assertPasteEvent( this.editor, { dataValue : '<p>a<br></p><p><br>b<br>c</p><P>d<BR></P>' },
				{ type : 'text' }, 'htmlified text 2' );

			assertPasteEvent( this.editor, { dataValue : 'a<br>b' },
				{ type : 'text' }, 'htmlified text 3' );

			assertPasteEvent( this.editor, { dataValue : 'a<BR />b' },
				{ type : 'text' }, 'htmlified text 4' );

			assertPasteEvent( this.editor, { dataValue : '<p>a</p>\r\n<p>a</p><p>a</p>' },
				{ type : 'text' }, 'htmlified text 5' );

			assertPasteEvent( this.editor, { dataValue : '<div>a</div>' },
				{ type : 'html' }, 'html 1' );

			assertPasteEvent( this.editor, { dataValue : '<hr>' },
				{ type : 'html' }, 'html 2' );

			assertPasteEvent( this.editor, { dataValue : '<div>a<br>b</div>' },
				{ type : 'html' }, 'html 4' );

			assertPasteEvent( this.editor, { dataValue : '<p>a<p>b</p>c</p>' },
				{ type : 'html' }, 'html 5' );

			assertPasteEvent( this.editor, { dataValue : '<p>a</p>c' },
				{ type : 'html' }, 'html 6' );

			assertPasteEvent( this.editor, { dataValue : '<br><p>a</p>' },
				{ type : 'html' }, 'html 7' );
		},

		'content type sniffing - htmlified text - other' : function() {
			if ( CKEDITOR.env.gecko || CKEDITOR.env.webkit || CKEDITOR.env.ie )
				assert.ignore();

			assertPasteEvent( this.editor, { dataValue : 'abc', htmlified : true },
				{ type : 'html' }, 'for unrecognized browser always shout html' );
		},

		'content type sniffing - html' : function() {
			assertPasteEvent( this.editor, { dataValue : 'a<b>b</b>c<br>d' },
				{ type : 'html' }, 'simple html' );

			assertPasteEvent( this.editor, { dataValue : 'a<p style="color: red">b</p>c' },
				{ type : 'html' }, 'styled html' );

			assertPasteEvent( this.editor, { dataValue : '<br style="color: red">' },
				{ type : 'html' }, 'styled html 2' );

			assertPasteEvent( this.editor, { dataValue : 'a<div><p>b</p></div>c' },
				{ type : 'html' }, 'p & div only, but not created from plain text' );

			assertPasteEvent( this.editor, { dataValue : 'a<div><div>b</div>c</div>d' },
				{ type : 'html' }, 'divs only, but not created from plain text' );

			assertPasteEvent( this.editor, { dataValue : 'A<div>B<br>C</div>D' },
				{ type : 'html', dataValue : 'A<div>B<br>C</div>D' }, 'case 1b' );

			assertPasteEvent( this.editor, { dataValue : '<p>A<br>B</p><p>C</p><div>D</div>' },
				{ type : 'html', dataValue : '<p>A<br>B</p><p>C</p><div>D</div>' }, 'case 2a' );
			assertPasteEvent( this.editor, { dataValue : '<div>A</div><p>B<br>C</p><p>D</p>' },
				{ type : 'html', dataValue : '<div>A</div><p>B<br>C</p><p>D</p>' }, 'case 2b' );

			assertPasteEvent( this.editor, { dataValue : 'A<div>B</div>C<div>D</div>E' },
				{ type : 'html', dataValue : 'A<div>B</div>C<div>D</div>E' }, 'case 3a' );
		},

		'content type sniffing - don\'t change type' : function() {
			assertPasteEvent( this.editor, { dataValue : 'a<b>b</b>c<hr>d', type : 'text' },
				{ type : 'text' }, 'keep text' );

			assertPasteEvent( this.editor, { dataValue : 'abc', type : 'html' },
				{ type : 'html' }, 'keep html' );
		},

		'content type sniffing - default config.clipboard_defaultContentType' : function() {
			testEditor( this, {}, function( editor ) {
					// Use htmlified:true to prevent htmlification for plain text (which needs editor setup).
					assertPasteEvent( editor, { dataValue : 'abc', htmlified : true },
						{ type : 'html' }, 'case 1a' );

					if ( CKEDITOR.env.webkit ) {
						assertPasteEvent( editor, { dataValue : '<div>abc</div>' },
							{ type : 'html' }, 'case 2a' );
						assertPasteEvent( editor, { dataValue : '<div>abc</div>', type : 'text' },
							{ type : 'text' }, 'case 2b' );
					}
					else
					{
						assertPasteEvent( editor, { dataValue : 'ab<br>cd' },
							{ type : 'html' }, 'case 3a' );
						assertPasteEvent( editor, { dataValue : 'ab<br>cd', type : 'text' },
							{ type : 'text' }, 'case 3b' );
					}
				} );
		},

		'htmlified text unification' : function() {
			// TCs extracted from _docs/plaintext.txt.

			CKEDITOR.env.gecko && assertPasteEvent( this.editor,
				{ dataValue : '1aaa<br>2bbb&nbsp;&nbsp; &nbsp;ccc<br><br>&nbsp; 3ddd<br>&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;4eee<br>&nbsp;&nbsp; &nbsp;5fff<br><br><br>6ggg&nbsp; hhh<br><br>' },
				{ type : 'text', dataValue : '<p>1aaa<br>2bbb&nbsp;&nbsp; &nbsp;ccc</p><p>&nbsp; 3ddd<br>&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;4eee<br>&nbsp;&nbsp; &nbsp;5fff</p><p><br>6ggg&nbsp; hhh</p><p></p>' },
				'htmlified text - fx' );
			CKEDITOR.env.ie && assertPasteEvent( this.editor,
				{ dataValue : '<P>1aaa<BR>2bbb&nbsp;ccc</P>\r\n<P>&nbsp; 3ddd<BR>&nbsp;&nbsp;4eee<BR>&nbsp;5fff</P>\r\n<P><BR>6ggg&nbsp; hhh<BR></P>' },
				{ type : 'text', dataValue : '<p>1aaa<br>2bbb&nbsp;ccc</p><p>&nbsp; 3ddd<br>&nbsp;&nbsp;4eee<br>&nbsp;5fff</p><p><br>6ggg&nbsp; hhh<br></p>' },
				'htmlified text - ie' );
			CKEDITOR.env.webkit && assertPasteEvent( this.editor,
				{ dataValue : '<div>1aaa</div><div>2bbb<span class="Apple-tab-span" style="white-space:pre">	</span>ccc</div><div><br></div><div>&nbsp; 3ddd</div><div><span class="Apple-tab-span" style="white-space:pre">	 </span>4eee</div><div><span class="Apple-tab-span" style="white-space:pre"> </span>5fff</div><div><br></div><div><br></div><div>6ggg &nbsp;hhh</div><div><br></div>' },
				{ type : 'text', dataValue : '<p>1aaa<br>2bbb&nbsp;&nbsp; &nbsp;ccc</p><p>&nbsp; 3ddd<br>&nbsp;&nbsp; &nbsp; 4eee<br> 5fff</p><p><br>6ggg &nbsp;hhh</p><br data-cke-eol="1">' },
				'htmlified text - webkit' );
		},

		'htmlified text unification 2' : function() {
			// aa\s
			// \s\s\s
			//
			// \t
			// bbb
			CKEDITOR.env.gecko && assertPasteEvent( this.editor,
				{ dataValue : 'aa <br>&nbsp; &nbsp;<br><br>&nbsp;&nbsp; &nbsp;<br>bbb' },
				{ type : 'text', dataValue : '<p>aa <br>&nbsp; &nbsp;</p><p>&nbsp;&nbsp; &nbsp;<br>bbb</p>' },
				'htmlified text 2 - fx' );
			CKEDITOR.env.ie && assertPasteEvent( this.editor,
				{ dataValue : '<P>aa <BR>&nbsp;&nbsp; </P>\r\n<P>&nbsp;<BR>bbb</P>' },
				{ type : 'text', dataValue : '<p>aa <br>&nbsp;&nbsp; </p><p>&nbsp;<br>bbb</p>' },
				'htmlified text 2 - ie' );
			CKEDITOR.env.webkit && assertPasteEvent( this.editor,
				{ dataValue : '<div>aa&nbsp;</div><div>&nbsp; &nbsp;</div><div><br></div><div><span class="Apple-tab-span" style="white-space:pre">	</span></div><div>bbb</div>' },
				{ type : 'text', dataValue : '<p>aa&nbsp;<br>&nbsp; &nbsp;</p><p>&nbsp;&nbsp; &nbsp;<br>bbb</p>' },
				'htmlified text 2 - webkit' );
		},

		'htmlified text unification 3 - other cases': function() {
			var data = CKEDITOR.env.webkit ? '<div>a&nbsp;b</div>' : 'a&nbsp;b<br>c';
			var result = CKEDITOR.env.webkit ? 'a&nbsp;b' : 'a&nbsp;b<br>c';

			assertPasteEvent( this.editor, { dataValue : data },
				{ type : 'text', dataValue : result }, 'do not encode twice - treat as htmlifiedtext' );

			assertPasteEvent( this.editor, { dataValue : data, type : 'text' },
				{ type : 'text', dataValue : result }, 'do not encode twice - treat as htmlifiedtext 2' );

			if ( CKEDITOR.env.ie ) {
				assertPasteEvent( this.editor, { dataValue : '<p>B<br>C</p>' },
					{ type : 'text', dataValue : '<p>B<br>C</p>' }, 'ie 1' );
				assertPasteEvent( this.editor, { dataValue : '<p>A<br></p>' },
					{ type : 'text', dataValue : '<p>A<br></p>' }, 'ie 2' );
				assertPasteEvent( this.editor, { dataValue : '<p>A<br></p><p>B<br></p>' },
					{ type : 'text', dataValue : '<p>A<br></p><p>B<br></p>' }, 'ie 3' );
				assertPasteEvent( this.editor, { dataValue : '<p>&nbsp;</p><p>aa</p><p>bb</p>' },
					{ type : 'text', dataValue : '<p>&nbsp;</p><p>aa</p><p>bb</p>' }, 'ie 4' );
				assertPasteEvent( this.editor, { dataValue : '<br>' },
					{ type : 'text', dataValue : '<br>' }, 'ie 5a' );
				assertPasteEvent( this.editor, { dataValue : '<br>aa' },
					{ type : 'text', dataValue : '<br>aa' }, 'ie 5b' );

				// TODO IE produces weird content for cases with more new lines.
				// Dive into this some day.
			}

			else if ( CKEDITOR.env.webkit ) {
				assertPasteEvent( this.editor,
					{ dataValue : '<div>aa</div><div>bb</div>' },
					{ type : 'text', dataValue : 'aa<br>bb' },
					'htmlified text - webkit' );

				assertPasteEvent( this.editor,
					{ dataValue : '<div>aa</div><div>bb</div><div>cc</div>' },
					{ type : 'text', dataValue : 'aa<br>bb<br>cc' },
					'htmlified text 2 - webkit' );

				assertPasteEvent( this.editor,
					{ dataValue : '<div>aa</div><div><br></div><div>cc</div>' },
					{ type : 'text', dataValue : '<p>aa</p><p>cc</p>' },
					'htmlified text 3 - webkit' );

				assertPasteEvent( this.editor,
					{ dataValue : '<div>aa</div><div><br></div><div>cc</div><div>dd</div>' },
					{ type : 'text', dataValue : '<p>aa</p><p>cc<br>dd</p>' },
					'htmlified text 4 - webkit' );

				assertPasteEvent( this.editor,
					{ dataValue : '<div>A</div><div><br></div><div>B</div><div><br></div>' },
					{ type : 'text', dataValue : '<p>A</p><p>B</p><br data-cke-eol="1">' },
					'htmlified text 5 - webkit' );

				assertPasteEvent( this.editor,
					{ dataValue : '<div>A</div><div><br></div><div><br></div><div>B</div>' },
					{ type : 'text', dataValue : '<p>A</p><p><br>B</p>' },
					'htmlified text 6 - webkit' );

				assertPasteEvent( this.editor,
					{ dataValue : '<div>A</div><div><br></div><div><br></div><div><br></div><div>B</div>' },
					{ type : 'text', dataValue : '<p>A</p><p></p><p>B</p>' },
					'htmlified text 7 - webkit' );

				assertPasteEvent( this.editor,
					{ dataValue : '<div><br></div><div>A</div>' },
					{ type : 'text', dataValue : '<br>A' },
					'htmlified text 8 - webkit' );

				assertPasteEvent( this.editor,
					{ dataValue : '<div><br></div><div><br></div><div>A</div>' },
					{ type : 'text', dataValue : '<p></p><p>A</p>' },
					'htmlified text 9 - webkit' );

				assertPasteEvent( this.editor,
					{ dataValue : '<div><br></div><div><br></div><div><br></div><div>A</div>' },
					{ type : 'text', dataValue : '<p></p><p><br>A</p>' },
					'htmlified text 10 - webkit' );
/*
				assertPasteEvent( this.editor,
					{ dataValue : '<div><br></div>' },
					{ type : 'text', dataValue : '<br>' },
					'htmlified text 11 - webkit' );

				assertPasteEvent( this.editor,
					{ dataValue : '<div><br></div><div><br></div>' },
					{ type : 'text', dataValue : '<p></p>' },
					'htmlified text 12 - webkit' );

				assertPasteEvent( this.editor,
					{ dataValue : '<div><br></div><div><br></div><div><br></div>' },
					{ type : 'text', dataValue : '<p><br></p>' },
					'htmlified text 13 - webkit' );
*/
				assertPasteEvent( this.editor,
					{ dataValue : '<div><br></div><div>aa</div>' },
					{ type : 'text', dataValue : '<br>aa' },
					'htmlified text 14 - webkit' );

				assertPasteEvent( this.editor,
					{ dataValue : '<div><br></div><div><br></div><div>aa</div>' },
					{ type : 'text', dataValue : '<p></p><p>aa</p>' },
					'htmlified text 15 - webkit' );

				assertPasteEvent( this.editor,
					{ dataValue : '<div><br></div><div><br></div><div><br></div><div>aa</div>' },
					{ type : 'text', dataValue : '<p></p><p><br>aa</p>' },
					'htmlified text 16 - webkit' );
			}
			else if ( CKEDITOR.env.gecko ) {
				// Fx is stupid - for one plain text line break it generates two brs.
				// For two line breaks - two brs as well.
				assertPasteEvent( this.editor, { dataValue : '<br><br>' },
					{ type : 'text', dataValue : '<br>' }, 'fx 1a' );
				//assertPasteEvent( this.editor, { dataValue : '<br><br><br>' },
				//	{ type : 'text', dataValue : '<p><br></p>' }, 'fx 1b' );

				assertPasteEvent( this.editor, { dataValue : '<br>aa' },
					{ type : 'text', dataValue : '<br>aa' }, 'fx 2a' );
				assertPasteEvent( this.editor, { dataValue : '<br><br>aa' },
					{ type : 'text', dataValue : '<p></p><p>aa</p>' }, 'fx 2a' );
				assertPasteEvent( this.editor, { dataValue : '<br><br><br>aa' },
					{ type : 'text', dataValue : '<p></p><p><br>aa</p>' }, 'fx 2b' );
			}
		},

		'htmlified text unification 4 - XHTML syntax' : function() {
			if ( CKEDITOR.env.gecko )
				assertPasteEvent( this.editor,
					{ dataValue : 'aa<br /><br/>bb<br />cc' },
					{ type : 'text', dataValue : '<p>aa</p><p>bb<br>cc</p>' },
					'htmlified text - fx' );
			else if ( CKEDITOR.env.ie )
				assertPasteEvent( this.editor,
					{ dataValue : '<p>aa<br />bb<BR/>cc</p>' },
					{ type : 'text', dataValue : '<p>aa<br>bb<br>cc</p>' },
					'htmlified text - ie' );
			else if ( CKEDITOR.env.webkit )
				assertPasteEvent( this.editor,
					{ dataValue : '<div>aa</div><div><br /></div><div>bb</div>' },
					{ type : 'text', dataValue : '<p>aa</p><p>bb</p>' },
					'htmlified text - webkit' );
			else
				assert.isTrue( true );
		},

		'htmlified text unification 5 - enter mode br' : function() {
			testEditor( this, {
					enterMode : CKEDITOR.ENTER_BR,
					clipboard_defaultContentType : 'text'
				},
				function( editor ) {
					if ( CKEDITOR.env.gecko ) {
						assertPasteEvent( editor,
							{ dataValue : 'aa<br>bb' }, { type : 'text', dataValue : 'aa<br>bb' },
							'htmlified text 1 - fx' );
						assertPasteEvent( editor,
							{ dataValue : 'aa<br><br>bb' }, { type : 'text', dataValue : 'aa<br><br>bb' },
							'htmlified text 2 - fx' );
						assertPasteEvent( editor,
							{ dataValue : 'aa<br><br><br>bb' }, { type : 'text', dataValue : 'aa<br><br><br>bb' },
							'htmlified text 3 - fx' );
						assertPasteEvent( editor,
							{ dataValue : '<br>aa<br><br>bb<br>cc<br>' }, { type : 'text', dataValue : '<br>aa<br><br>bb<br>cc<br>' },
							'htmlified text 4 - fx' );
					}
					else if ( CKEDITOR.env.ie ) {
						assertPasteEvent( editor,
							{ dataValue : '<p>aa</p>' }, { type : 'text', dataValue : 'aa' },
							'htmlified text 1 - ie' );
						assertPasteEvent( editor,
							{ dataValue : '<p>aa</p><p>bb</p>' }, { type : 'text', dataValue : 'aa<br><br>bb' },
							'htmlified text 2 - ie' );
						assertPasteEvent( editor,
							{ dataValue : '<p>aa</p><p><br>bb</p>' }, { type : 'text', dataValue : 'aa<br><br><br>bb' },
							'htmlified text 3 - ie' );
						// TODO Since we are blindly removing spaces - we're failing in these cases.
						assertPasteEvent( editor,
							{ dataValue : '<p>aa</p><p>&nbsp;</p><p>bb</p>' },
							{ type : 'text', dataValue : 'aa<br><br>&nbsp;<br><br>bb' },
							'htmlified text 4 - ie' );
						assertPasteEvent( editor,
							{ dataValue : '<p>&nbsp;</p><p>aa</p><p>bb</p>' },
							{ type : 'text', dataValue : '&nbsp;<br><br>aa<br><br>bb' },
							'htmlified text 5 - ie' );
						assertPasteEvent( editor,
							{ dataValue : '<p><br>aa</p><p>bb</p>' },
							{ type : 'text', dataValue : '<br>aa<br><br>bb' },
							'htmlified text 6 - ie' );
					}
					else if ( CKEDITOR.env.webkit ) {
						assertPasteEvent( editor,
							{ dataValue : '<div>aa</div>' }, { type : 'text', dataValue : 'aa' },
							'htmlified text 1 - webkit' );
						assertPasteEvent( editor,
							{ dataValue : '<div>aa</div><div>bb</div>' }, { type : 'text', dataValue : 'aa<br>bb' },
							'htmlified text 2 - webkit' );
						assertPasteEvent( editor,
							{ dataValue : '<div>aa</div><div>bb</div><div>cc</div>' },
							{ type : 'text', dataValue : 'aa<br>bb<br>cc' },
							'htmlified text 3 - webkit' );
						assertPasteEvent( editor,
							{ dataValue : '<div>aa</div><div><br></div><div>bb</div>' },
							{ type : 'text', dataValue : 'aa<br><br>bb' },
							'htmlified text 4 - webkit' );
						assertPasteEvent( editor,
							{ dataValue : '<div>aa</div><div><br></div><div><br></div><div>bb</div>' },
							{ type : 'text', dataValue : 'aa<br><br><br>bb' },
							'htmlified text 5 - webkit' );
						assertPasteEvent( editor,
							{ dataValue : '<div>aa</div><div><br></div><div><br></div><div><br></div><div>bb</div>' },
							{ type : 'text', dataValue : 'aa<br><br><br><br>bb' },
							'htmlified text 6 - webkit' );
						assertPasteEvent( editor,
							{ dataValue : '<div><br></div><div>aa</div>' }, { type : 'text', dataValue : '<br>aa' },
							'htmlified text 7 - webkit' );
						assertPasteEvent( editor,
							{ dataValue : '<div><br></div><div>aa</div><div><br></div><div>bb</div>' },
							{ type : 'text', dataValue : '<br>aa<br><br>bb' },
							'htmlified text 8 - webkit' );
						assertPasteEvent( editor,
							{ dataValue : '<div><br></div><div><br></div><div>aa</div><div><br></div><div>bb</div>' },
							{ type : 'text', dataValue : '<br><br>aa<br><br>bb' },
							'htmlified text 9 - webkit' );
						assertPasteEvent( editor,
							{ dataValue : '<div>aa</div><div><br></div><div>bb</div><div><br></div>' },
							{ type : 'text', dataValue : 'aa<br><br>bb<br data-cke-eol="1">' },
							'htmlified text 10 - webkit' );
					}
				} );
		},

		'htmlified text unification 6 - enter mode div' : function() {
			testEditor( this, {
					enterMode : CKEDITOR.ENTER_DIV,
					clipboard_defaultContentType : 'text'
				},
				function( editor ) {
					if ( CKEDITOR.env.gecko ) {
						assertPasteEvent( editor,
							{ dataValue : 'aa<br>bb' }, { type : 'text', dataValue : 'aa<br>bb' },
							'htmlified text 1 - fx' );
						assertPasteEvent( editor,
							{ dataValue : 'aa<br>bb<br><br>cc' }, { type : 'text', dataValue : '<div>aa<br>bb</div><div>cc</div>' },
							'htmlified text 2 - fx' );
					}
					else if ( CKEDITOR.env.ie ) {
						assertPasteEvent( editor,
							{ dataValue : 'aa<br>bb' }, { type : 'text', dataValue : 'aa<br>bb' },
							'htmlified text 1 - ie' );
						assertPasteEvent( editor,
							{ dataValue : '<p>aa<br>bb</p><p>cc</p>' },
							{ type : 'text', dataValue : '<div>aa<br>bb</div><div>cc</div>' },
							'htmlified text 2 - ie' );
					}
					else if ( CKEDITOR.env.webkit ) {
						assertPasteEvent( editor,
							{ dataValue : '<div>aa</div><div>bb</div>' }, { type : 'text', dataValue : 'aa<br>bb' },
							'htmlified text 1 - webkit' );
						// TODO interesting... better to keep Webkit's original, or to transform like for the
						// other browsers.
						assertPasteEvent( editor,
							{ dataValue : '<div>aa</div><div>bb</div><div><br></div><div>cc</div>' },
							{ type : 'text', dataValue : '<div>aa<br>bb</div><div>cc</div>' },
							'htmlified text 2 - webkit' );
					}
				} );
		},

		'html textification' : function() {
			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '<p class="test" style="color:red">a<br style="display:none">b</p>' },
				{ type: 'text', dataValue : '<p>a<br>b</p>' },
				'strip styles' );

			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : 'a<i>b</i><p>c<b>d</b>e<br>f</p>g' },
				{ type: 'text', dataValue : 'ab<p>cde<br>f</p>g' },
				'strip inline elements' );

			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '<ul> <li>A1</li> <li>A2 <ol> <li>B1</li> <li>B2</li> </ol></li> </ul> <ol> <li>C1</li> </ol>' },
				{ type: 'text', dataValue : '<p>A1<br>A2</p><p>B1<br>B2</p><p>C1</p>' },
				'lists' );

			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '<dl> <dt>AT</dt> <dd>AD <dl> <dt>BT</dt> <dd>BD1</dd><dd>BD2</dd> </dl></dd> </dl>' },
				{ type: 'text', dataValue : '<p>AT<br>AD</p><p>BT<br>BD1<br>BD2</p>' },
				'def lists' );

			// Without attrib this will be handled as normal htmlified text.
			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : 'a <div>b</div> <div title="1">c</div> d <div>e</div>' },
				{ type: 'text', dataValue : 'a<br>b<br>c<br>d<br>e<br>' },
				'divs' );

			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '<div> <p>a</p> b</div> <div>c <ul> <li>d</li> <li>e</li> </ul></div>' },
				{ type: 'text', dataValue : '<p>a</p>b<br>c<p>d<br>e</p>' },
				'divs 2' );

			// TODO we should correct tbody,thead,tfoot,caption order if not done by parser.
			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : 'X<table> <caption>C</caption> <tr><th>A1</th><td>A2</td></tr> <tr><td>B1</td><th>B2</th></tr> </table>X' },
				{ type: 'text', dataValue : 'X<p>C<br>A1 A2<br>B1 B2</p>X' },
				'tables' );

			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '<table> <tr><td>A1</td> <td><table><tr><td>B1</td><td>B2</td></table></td></tr> <tr><td>C1</td></tr> </table>' },
				{ type: 'text', dataValue : '<p>A1</p><p>B1 B2</p><p>C1</p>' },
				'tables 2' );
		},

		'html textification 2' : function() {
			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '<p title="1">a<br><br><br></p><p>b</p>' },
				{ type: 'text', dataValue : '<p>a<br><br><br></p><p>b</p>' },
				'preserve original new lines' );

			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '<div title="1"><br><br></div><p>a</p>' },
				{ type: 'text', dataValue : '<br><br><p>a</p>' },
				'preserve original new lines 2' );

			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : 'A<br>B<br><div title="1">C</div>D<br>E' },
				{ type: 'text', dataValue : 'A<br>B<br>C<br>D<br>E' },
				'correct order and new line after div' );

			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : 'A<br>B<div title="1">C</div><br>D<br>E' },
				{ type: 'text', dataValue : 'A<br>B<br>C<br>D<br>E' },
				'correct order and new line before div' );

			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : 'A<div><div><p>B</p>C<ul><li>D</li></ul></div> <p>E</p></div>F' },
				{ type: 'text', dataValue : 'A<p>B</p>C<p>D</p><p>E</p>F' },
				'transparent divs' );
		},

		'html textification 3 - ticket #8834' : function() {
			// Mso classes will be stripped by pastefromword filters, and we need some styling element,
			// because otherwise this will be handled as htmlified text.
			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '<p><strong>Line</strong> 1<br>Line 2</p><p>Line 3</p><p>Line 4</p>' },
				{ type: 'text', dataValue : '<p>Line 1<br>Line 2</p><p>Line 3</p><p>Line 4</p>' },
				'tt #8834' );

			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '<p><strong>Line</strong> 1<br>Line 2</p><p>Line 3</p><p>Line 4</p>' },
				{ type: 'text', dataValue : '<p>Line 1<br>Line 2</p><p>Line 3</p><p>Line 4</p>' },
				'tt #8834' );
		},

		'html textification 4' : function() {
			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : 'x<object>y</object>z <p>a<iframe src=".">b</iframe>c</p>' },
				{ type: 'text', dataValue : 'xz<p>ac</p>' },
				'remove elements' );

			// input -> value? select -> current value?
			// possible problems: applet, area, fieldset, hgroup (-> h1<br>h2), select, audio, video,
		},

		'html textification 5 - complex cases' : function() {
			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '<section><h1>HH</h1><p>1AAAA</p><p>2AAAA</p><p>3AAAA</p></section><table><tbody><tr><td><p>1AAAA</p><p>2AAAA</p><p>3AAAA</p></td></tr></tbody></table>' },
				{ type: 'text', dataValue : '<p>HH</p><p>1AAAA</p><p>2AAAA</p><p>3AAAA</p><p>1AAAA</p><p>2AAAA</p><p>3AAAA</p>' },
				'complex case 1' );

			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '<section><div><p>1AAAA</p><p>2AAAA</p><p>3AAAA</p><aside><table><tr><td><p>4AAAA</p><ul><li>BBB</li><li>BBB</li></ul><p>5AAAA</p></td><td><p>6AAAA</p><p>7AAAA</p></td></tr></table></aside></div></section>' },
				{ type: 'text', dataValue : '<p>1AAAA</p><p>2AAAA</p><p>3AAAA</p><p>4AAAA</p><p>BBB<br>BBB</p><p>5AAAA</p><p>6AAAA</p><p>7AAAA</p>' },
				'complex case 2' );

			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '' },
				{ type: 'text', dataValue : '' },
				'extremely complex case' );
		},

		'html textification 6 - tricks' : function() {
			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '<p>A<img src="sth.jpg" alt="This is a title">B</p>' },
				{ type: 'text', dataValue : '<p>A [This is a title] B</p>' },
				'img alt to text' );

			// Quite popular case in the Internet.
			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '<p>A<img src="sth.jpg" alt="sth.jpg?1=2">B</p>' },
				{ type: 'text', dataValue : '<p>A B</p>' },
				'dumb alt' );

			// Popular too.
			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '<p>A<img src="sth.jpg" alt="">B</p>' },
				{ type: 'text', dataValue : '<p>A B</p>' },
				'dumb alt' );

			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '<p>A</p><p> </p><p>B</p><p> \t\n\n</p><p>C</p><ul></ul><p>D</p>' },
				{ type: 'text', dataValue : '<p>A</p><p>B</p><p>C</p><p>D</p>' },
				'remove empty blocks' );

			assertPasteEvent( this.editor,
				{ type: 'text', dataValue : '<p>A</p> <h1>T1</h1> <h2>T2</h2> <h3>T3</h3> <p>C</p> <h4>T4</h4> D <h5>T5</h5>' },
				{ type: 'text', dataValue : '<p>A</p><p>T1<br>T2<br>T3</p><p>C</p><p>T4</p>D<p>T5</p>' },
				'squash adjacent headers' );
		},

		'html textification 7 - enter mode br' : function() {
			testEditor( this, { enterMode : CKEDITOR.ENTER_BR },
				function( editor ) {
					assertPasteEvent( editor,
						{ type: 'text', dataValue : '<dl> <dt>AT</dt> <dd>AD <dl> <dt>BT</dt> <dd>BD1</dd><dd>BD2</dd> </dl></dd> </dl>' },
						{ type: 'text', dataValue : 'AT<br>AD<br><br>BT<br>BD1<br>BD2' },
						'def lists' );
				} );
		},

		'html textification 8 - enter mode div' : function() {
			testEditor( this, { enterMode : CKEDITOR.ENTER_DIV },
				function( editor ) {
					assertPasteEvent( editor,
						{ type: 'text', dataValue : '<dl> <dt>AT</dt> <dd>AD <dl> <dt>BT</dt> <dd>BD1</dd><dd>BD2</dd> </dl></dd> </dl>' },
						{ type: 'text', dataValue : '<div>AT<br>AD</div><div>BT<br>BD1<br>BD2</div>' },
						'def lists' );
				} );
		},

		'filtering browser\'s crap' : function() {
			assertPasteEvent( this.editor, { dataValue : 'a<span class="Apple-some-class" style="white-space:pre"> </span>b' },
				{ dataValue : 'a<span style="white-space:pre"> </span>b' }, 'tab-span' );

			assertPasteEvent( this.editor, { dataValue : 'a<span class="Apple-converted-space">&nbsp;</span>b' },
				{ dataValue : 'a b' }, 'space' );

			CKEDITOR.env.webkit && assertPasteEvent( this.editor,
				{ dataValue : 'a<span class="Apple-tab-span" style="white-space:pre">		</span>b' },
				{ priority : 4, dataValue : 'a&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;b' }, 'tab-span' );

			if ( CKEDITOR.env.gecko ) {
				// Firefox adds it when user pasted 'a '.
				assertPasteEvent( this.editor, { dataValue : 'a <br>', htmlified: true },
					{ dataValue : 'a ' }, 'gecko\'s bogus <br>' );
			}
		},

		// See dt/core/editable/_docs/blockselections.txt
		'fixing block content' : function() {
			if ( CKEDITOR.env.ie ) {
				assertPasteEvent( this.editor, { dataValue : '&nbsp; <p>ABC</p>' },
					{ type : 'html', dataValue : '<p>ABC</p>' }, 'eol 1a' );
				assertPasteEvent( this.editor, { dataValue : '&nbsp;<p>ABC</p>' },
					{ type : 'html', dataValue : '<p>ABC</p>' }, 'eol 1b' );
				assertPasteEvent( this.editor, { dataValue : '&nbsp;\r\n<p>ABC</p>' },
					{ type : 'html', dataValue : '<p>ABC</p>' }, 'eol 1c' );
				assertPasteEvent( this.editor, { dataValue : '&nbsp; <b>ABC</b>' },
					{ type : 'html', dataValue : '&nbsp; <b>ABC</b>' }, 'eol 2' );
			}
			else if ( CKEDITOR.env.webkit ) {
				assertPasteEvent( this.editor, { dataValue : '<br class="Apple-interchange-newline">ABC' },
					{ type : 'html', dataValue : '<br data-cke-eol="1">ABC' }, 'eol 1' );

				assertPasteEvent( this.editor, { dataValue : '<br class="Apple-interchange-newline"><p>A<b>B</b>C</p>', type : 'text' },
					{ type : 'text', dataValue : '<br data-cke-eol="1"><p>ABC</p>' }, 'eol 1 - keep for forced text' );

				assertPasteEvent( this.editor, { dataValue : '<p>A<b>B</b>C</p><div><br></div>' },
					{ type : 'html', dataValue : '<p>A<b>B</b>C</p><br data-cke-eol="1">' }, 'eol 2' );

				assertPasteEvent( this.editor, { dataValue : '<p>A<b>B</b>C</p><div><br></div>', type : 'text' },
					{ type : 'text', dataValue : '<p>ABC</p><br data-cke-eol="1">' }, 'eol 2 - keep for forced text' );

				assertPasteEvent( this.editor, { dataValue : 'A<b>BC</b><div><br></div>' },
					{ type : 'html', dataValue : 'A<b>BC</b><div><br></div>' }, 'eol 3' );

				assertPasteEvent( this.editor, { dataValue : '<p><br class="Apple-interchange-newline">A</p><p>B</p><p>C</p>', type : 'text' },
					{ type : 'text', dataValue : '<br data-cke-eol="1"><p>A</p><p>B</p><p>C</p>' }, 'eol 4 - produced multiple blocks selected' );
			}
			else
				assert.isTrue( true );
		},

		'forcing html type' : function() {
			var tc = this,
				editor = this.editor;

			tc.on( 'beforePaste', function( evt ) {
					evt.data.type = 'html';
				} );

			tc.on( 'paste', function( evt ) {
					assert.areEqual( 'html', evt.data.type );
				}, null, null, 900 );

			editor.execCommand( 'paste', 'abc' );
			tc.cleanUp();
		},

		'editor.getClipboardData - successful' : function() {
			var tc = this,
				editor = this.editor,
				beforePasteFired = false;

			editor.once( 'beforePaste', function( evt ) {
					assert.areEqual( 'auto', evt.data.type );
					beforePasteFired = true;
					evt.data.type = 'test';
				} );

			editor.once( 'dialogShow', function( evt ) {
					var dialog = editor._.storedDialogs.paste;
					assert.isTrue( !!dialog );

					// Fx is sooo buggy - don't try to get frameDoc in scope above,
					// because it will return different object than here.
					var frameDoc = dialog.getContentElement( 'general', 'editing_area' )
						.getInputElement().getFrameDocument();

					frameDoc.getBody().setHtml( 'abc<b>def</b>' );
					dialog.fire( 'ok' );
					dialog.hide();
				} );

			editor.getClipboardData( function( data ) {
				tc.resume( function() {
						assert.isTrue( beforePasteFired );
						assert.areEqual( 'test', data.type );
						assert.areEqual( 'abc<b>def</b>', data.dataValue );
					} );
			} );

			tc.wait();
		},

		'editor.getClipboardData - unsuccessful' : function() {
			var tc = this,
				editor = this.editor,
				dialogOpened = false;

			editor.on( 'dialogShow', function( evt ) {
					evt.removeListener();

					tc.resume( function() {
							var dialog = editor._.storedDialogs.paste;
							assert.isTrue( !!dialog );

							dialogOpened = true;

							// Make sure it's async.
							setTimeout( function() {
									dialog.fire( 'cancel' );
									dialog.hide();
								} );

							tc.wait();
						} );
				} );

			// It's easier to have this asynchronous, becasuse then we don't have to think
			// if tc.wait() & tc.resume() will execute properly.
			setTimeout( function() {
					editor.getClipboardData( function( data ) {
						tc.resume( function() {
								assert.isNull( data );
								assert.isTrue( dialogOpened );
							} );
					} );
				} );

			tc.wait();
		},

		'editor.getClipboardData - canceled beforePaste' : function() {
			var tc = this,
				editor = this.editor,
				dialogOpened = false,
				pasteFired = false;

			function onDialogShow() {
				dialogOpened = true;
			}

			function onPaste() {
				pasteFired = true;
			}

			editor.on( 'beforePaste', function( evt ) {
					evt.removeListener();
					evt.cancel();
				} );

			editor.on( 'dialogShow', onDialogShow );
			editor.on( 'paste', onPaste );

			// It's easier to have this asynchronous, becasuse then we don't have to think
			// if tc.wait() & tc.resume() will execute properly.
			setTimeout( function() {
					editor.getClipboardData( function( data ) {
						tc.resume( function() {
								assert.isNull( data );
								assert.isFalse( dialogOpened );
								assert.isFalse( pasteFired );

								editor.removeListener( 'dialogShow', onDialogShow );
								editor.removeListener( 'paste', onPaste );
							} );
					} );
				} );

			tc.wait();
		},

		'#131 - trailing spaces' : function() {
			assertPasteEvent( this.editor,
				{ dataValue : '&nbsp; BBB&nbsp;' },
				{ type: 'text', dataValue : '&nbsp; BBB&nbsp;' },
				'preserve trailing spaces' );
		},

		'#131 - trailing spaces - default config.clipboard_defaultContentType' : function() {
			// Test for default content - type.
			testEditor( this, {},
				function( editor ) {
					assertPasteEvent( editor,
						{ dataValue : '&nbsp; BBB&nbsp;' },
						{ type: 'html', dataValue : '&nbsp; BBB&nbsp;' },
						'preserve trailing spaces' );
				} );
		},

		// #9675 and #9534.
		'strip editable when about to paste the entire inline editor' : function() {
			// #9534: FF and Webkits in inline editor based on header element.
			assertPasteEvent( this.editor, { dataValue : '<h1 class="cke_editable">Foo<br>Bar</h1>' },
				{ dataValue : 'Foo<br>Bar' }, 'stripped .cke_editable' );

			assertPasteEvent( this.editor, { dataValue : '<div class="cke_contents">Bar<br></div>' },
				{ dataValue : 'Bar' }, 'stripped .cke_contents & bogus br removed' );

			// #9675: FF36 copies divarea.
			assertPasteEvent( this.editor,
				{ dataValue : '<div id="cke_1_contents" class="cke_contents"><div class="cke_editable" contenteditable="true"><p>aaa</p></div></div>' },
				{ dataValue: '<p>aaa</p>' }, 'stripped .cke_editable > .cke_contents' );
		}
	} );

} )();