/* bender-tags: editor,unit,autoparagraphing */

'use strict';

function noSelectionOnBlur( editor ) {
	return editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE || CKEDITOR.env.ie;
}

bender.test( {
	'async:init': function() {
		var that = this;
		bender.tools.setUpEditors( {
			editor: {
				startupData: '<p>foo</p>',
				config: {
					autoParagraph: false,
					fillEmptyBlocks: false,
					allowedContent: true
				}
			},
			editor2: {
				creator: 'inline',
				name: 'test_editor2'
			},
		}, function( editors, bots ) {
			that.editorBot = bots.editor;
			that.editor = editors.editor;
			that.editorBot2 = bots.editor2;
			that.editor2 = editors.editor2;
			that.callback();
		} );
	},

	assertGetSelection : function( source, expected ) {
		var ed = this.editor;
		bender.tools.setHtmlWithSelection( ed, source );
		assert.areSame( expected || source, bender.tools.getHtmlWithSelection( ed ) );
	},

	'test editor selection with no focus' : function() {
		var ed = this.editor;

		// Make selection outside of editable.
		var docSel = doc.getSelection();
		docSel.selectElement( doc.getById( 'p1' ) );

		var sel = ed.getSelection();

		// Empty selection retrieved for :
		// 1. Inline instance where document selection is made outside of editable.
		// 2. IE when editable doesn't have focus.
		if ( noSelectionOnBlur( ed ) ) {
			assert.areSame( CKEDITOR.SELECTION_NONE, sel.getType(), 'selection type' );
			arrayAssert.isEmpty( sel.getRanges(), 'selection ranges' );
			assert.isNull( sel.getStartElement(), 'selection start element' );
			assert.isNull( sel.getSelectedElement(), 'selection selected element' );
			assert.areSame( '', sel.getSelectedText(), 'selection selected text ' );
		}
		// Text selection collapsed at the *start* of editable for theme instance.
		else
		{
			assert.areSame( CKEDITOR.SELECTION_TEXT, sel.getType(), 'selection type' );
			var ranges = sel.getRanges(), range = ranges[ 0 ];
			assert.areSame( ranges.length, 1 );
			assert.isTrue( range.collapsed );
			assert.isTrue( range.checkBoundaryOfElement( ed.editable().getFirst(), CKEDITOR.START ) );
		}

		ed.focus();
		// Test editor selection received.
		sel = ed.getSelection();
		var editable = ed.editable();
		assert.isTrue( sel instanceof CKEDITOR.dom.selection, 'get selection should return dom selection instance.' );
		assert.areSame( editable.getDocument().$, sel.document.$, 'selection.document is equivalent to editor\'s document' );
		assert.areSame( editable.$, sel.root.$, 'selection.boundary is equivalent to the editable element' );
	},

	'test selection on initial focus': function() {
		var ed = this.editor;
		ed.editable().focus();
		assert.areEqual( '<p>^foo</p>', bender.tools.getHtmlWithSelection( ed ), 'Selection goes into editable on focus (#9507).' );
	},

	'test selection on initial focus - ensure new doc': function() {
		var ed = this.editor;

		// Ensure async.
		setTimeout( function() {
			ed.setData( '<p>foo</p>', function() {
				resume( function() {
					ed.editable().focus();
					assert.areEqual( '<p>^foo</p>', bender.tools.getHtmlWithSelection( ed ), 'Selection goes into editable on focus (#10115).' );
				} );
			} );
		} );
		wait();
	},

	// Lock lock/unlock selection.
	'test editor selection lock on blur' : function() {
		var ed = this.editor, editable = ed.editable();

		if ( !noSelectionOnBlur( ed ) )
			assert.ignore();

		ed.focus();

		// Make editor selection (collapse at the end).
		var range = new CKEDITOR.dom.range( editable );
		range.moveToPosition( editable, CKEDITOR.POSITION_AFTER_START );
		range.select();

		this.wait( function() {
			   doc.getById( 'input1' ).focus();
			   var sel = ed.getSelection();
			   assert.isNotNull( sel, 'should be able to retrieve locked selection' );
			   assert.isTrue( !!sel.isLocked, 'selection should be locked' );

			   var savedRange = sel.getRanges()[ 0 ];
			   // Check saved range.
			   assert.isTrue( checkRangeEqual( range, savedRange ),
							  "saved range doesn't match original" );

			   ed.focus();
			   sel = ed.getSelection();
			   assert.isFalse( !!sel.isLocked, 'selection should be unlocked' );

			   var restoredRange = sel.getRanges()[ 0 ];
			   // Check range is restored.
			   assert.isTrue( checkRangeEqual( range, restoredRange ),
							  "restored range doesn't match original" );

		   }, 200 );		// 200ms delay for triggering selection change.
	},

	'test "selectionChange" fires properly' : function() {
		var ed = this.editor, editable = ed.editable(), firedTimes = 0;
		var onSelectionChange = function( evt ) {
			firedTimes ++;
			ed.forceNextSelectionCheck();

			// selection and path provided on the event obj
			// should matche current.
			var data = evt.data;
			var sel = ed.getSelection();
			var path = ed.elementPath();

			assertSelectionsAreEqual( sel, data.selection );
			assert.isTrue( path.compare( data.path ) );
		};

		// Avoid swallowing assertion errors inside event handler.
		ed.define( 'selectionChange', { errorProof : 0 } );
		ed.on( 'selectionChange', onSelectionChange );

		ed.forceNextSelectionCheck();

		editable.fire( 'selectionchange' );
		ed.selectionChange();

		// selection change has a 200ms delay.
		this.wait( function() {
			   ed.removeListener( 'selectionChange', onSelectionChange );
			   assert.areSame( 2, firedTimes, 'times of selectionChange fired doesn\'t match.' );
		   }, 200 );
	},

	'test "selectionChange" not fired when editor selection is locked' : function() {
		var ed = this.editor, editable = ed.editable();

		if ( !noSelectionOnBlur( ed ) )
			assert.ignore();

		ed.focus();

		var range = new CKEDITOR.dom.range( editable );
		range.moveToPosition( editable, CKEDITOR.POSITION_BEFORE_END );
		range.select();

		doc.getById( 'input1' ).focus();

		function shouldFail( evt ) {
			// No "selectionChange" when editor is blurred.
			assert.fail( 'selection change should\'t be fired.' );
		}

		ed.on( 'selectionChange', shouldFail );
		ed.selectionChange( true )
		ed.removeListener( 'selectionChange', shouldFail );

		assert.isTrue( true );
	},

	'test "selectionChange" fired on empty data loaded': function() {
		var bot = this.editorBot,
			editor = this.editor,
			selectionChange = 0,
			sel;

		editor.focus();

		bot.setData( '', function() {
			var listener = editor.on( 'selectionChange', function( evt ) {
				selectionChange++;
				sel = evt.data.selection;
			} );

			editor.forceNextSelectionCheck();
			bot.setData( '', function() {
				listener.removeListener();
				assert.areSame( 1, selectionChange, 'One selectionChange was fired' );
				assert.areNotSame( CKEDITOR.SELECTION_NONE, sel.getType(), 'sel.getType()' );
			} );
		} );
	},

	'test "selectionChange" fired on non-empty data loaded': function() {
		var bot = this.editorBot,
			editor = this.editor,
			selectionChange = 0,
			sel;

		editor.focus();

		bot.setData( '<p>foo</p>', function() {
			var listener = editor.on( 'selectionChange', function( evt ) {
				selectionChange++;
				sel = evt.data.selection;
			} );

			editor.forceNextSelectionCheck();
			assert.areSame( 0, selectionChange, 'Selection was up to date' );
			bot.setData( '<p>foo</p>', function() {
				listener.removeListener();
				assert.areSame( 1, selectionChange, 'One selectionChange was fired' );
				assert.areNotSame( CKEDITOR.SELECTION_NONE, sel.getType(), 'sel.getType()' );
			} );
		} );
	},

	// #7174
	'test "selectionChange" fired after the same selection set after data loaded': function() {
		var bot = this.editorBot,
			editor = this.editor,
			selectionChange = 0;

		bot.setData( '<p>foo<strong>bar</strong></p>', function() {
			var range = editor.createRange();

			editor.focus();
			range.setStart( editor.document.findOne( 'strong' ).getFirst(), 1 );
			range.collapse( true );
			range.select();

			assert.areSame( 0, selectionChange, 'Selection was up to date' );
			bot.setData( '<p>foo<strong>bar</strong></p>', function() {
				var listener = editor.on( 'selectionChange', function( evt ) {
					selectionChange++;
				} );

				range = editor.createRange();

				range.setStart( editor.document.findOne( 'strong' ).getFirst(), 1 );
				range.collapse( true );
				range.select();
				// Focus editor after making selection to make this case more tricky for editor.
				// If we focused editor before making selection, then editor would first check
				// selection on focus and that selection would differ the previous one (before setData),
				// because the default selection after setData is located in first editable spot. And then
				// editor would check selection again when we would select range.
				editor.focus();

				listener.removeListener();
				assert.isTrue( selectionChange > 0, 'At least one selectionChange was fired' );
			} );
		} );
	},

	'test "selectionChange" fired on editor focus': function() {
		 var ed = this.editor;
		 ed.on( 'selectionChange', function( evt ) {
			 evt.removeListener();
			 assert.isTrue( true );
		 } );

		 doc.getById( 'input1' ).focus();
		 ed.forceNextSelectionCheck();
		 ed.focus();
	 },

	'test collapsed text selection' : function() {
		this.assertGetSelection( '^' );
		this.assertGetSelection( '<p>^</p>' );
		this.assertGetSelection( '<h1>^</h1>' );
		this.assertGetSelection( '<p><i>foo</i>^</p>' );
		this.assertGetSelection( '<p><span>bar</span>^foo</p>' );
		this.assertGetSelection( '<p><span>bar<img /></span>^foo</p>' );
		this.assertGetSelection( '<p>foo^<span>bar</span></p>' );
		this.assertGetSelection( '<p><span>foo</span>^bar</p>' );
		this.assertGetSelection( '<p>foo^<span><img />bar</span></p>' );
		this.assertGetSelection( '<ul><li>^</li></ul>' );
		this.assertGetSelection( '<table><tbody><tr><td>^</td></tr></tbody></table><p>foo</p>' );
		this.assertGetSelection( '<p><img />^</p>' );
		this.assertGetSelection( '<p>^<img /></p>' );

		// IE selection doesn't support for the following range position.
		if ( !CKEDITOR.env.ie ) {
			this.assertGetSelection( '<p>^<br /></p>', '<p>^</p>' );
			this.assertGetSelection( '<div>^<p>foo</p></div><p>bar</p>' );
			this.assertGetSelection( '<div><p>foo</p>^</div><p>bar</p>' );

			this.assertGetSelection( '^<hr />' );
			this.assertGetSelection( '<hr />^' );
		}

		if ( CKEDITOR.env.webkit ) {
			this.assertGetSelection( '<p>^<span style="display:none">foo</span></p>' );
			this.assertGetSelection( '<p><span style="display:none">foo</span>^</p>' );
		}
	},

	'test selection after DOM unload' : function() {
		var bot = this.editorBot,
			editor = this.editor;

		editor.focus();
		bender.tools.setHtmlWithSelection( editor, '<p>foo^bar</p>' );

		doc.getById( 'input1' ).focus();
		setTimeout( function() {
			editor.setData( '<p>abc</p><p>abc</p>', function() {
				resume( function() {
					// Try inserting something se we can verify that it happened.
					// During insertion editor will be focused, selection restored
					// and used in insertion processing.
					editor.insertText( 'xyz' );

					assert.isMatching( /xyz/, editor.getData() );
				} );
			} );
		} );

		wait();
	},

	// #10115
	// Of course this test doesn't check if caret is visible.
	// It only verifies if fixDom works correctly and does not confilct
	// with browser or editor (#9507) fixing selection.
	'test selection after set data on autoparagraphing editor': function() {
		doc.getById( 'input1' ).focus();

		bender.editorBot.create( {
			name: 'test_editor_10115'
		}, function( bot ) {
			var editor = bot.editor;

			// Ensure async.
			setTimeout( function() {
				editor.setData( '', function() {
					resume( function() {
						var editable = editor.editable(),
							dataOnFocus;

						editable.once( 'focus', function() {
							dataOnFocus = editable.getHtml();
						} );
						editable.focus();
						assert.isMatching( /<p>\^.*<\/p>/, bender.tools.getHtmlWithSelection( editor ), 'Selection is in the right place.' );

						// Check if DOM was fixed before focus is fired.
						assert.isMatching( /<p>.*<\/p>/i, dataOnFocus, 'DOM is already fixed on focus.' );
					} );
				} );
			} );

			wait();
		} );
	},

	// #10315
	'test selection is invalidating filling char after editable is replaced by new one': function() {
		if ( !CKEDITOR.env.webkit )
			assert.ignore();

		bender.editorBot.create( {
			name: 'test_editor_10315',
			config: {
				allowedContent: true,
				plugins: 'undo,sourcearea'
			}
		}, function( bot ) {
			var editor = bot.editor;

			editor.setMode( 'source', function() {
				editor.setData( '<p id="p">foo<em>bar</em></p>' );
				editor.setMode( 'wysiwyg', function() {
					resume( function() {
						// TC1 - on keydown
						// <p>foo^<em>...
						var range = editor.createRange();
						range.setStart( editor.document.getById( 'p' ), 1 );
						editor.getSelection().selectRanges( [ range ] );

						assert.isMatching( /^<p id="p">foo\u200b<em>bar<\/em><\/p>$/, editor.editable().getHtml(), 'Filling char was inserted' );

						// Fire event imitating left arrow, what will trigger
						// removeFillingChar() on Webkit.
						editor.document.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 37 } ) );

						assert.isMatching( /^<p id="p">foo<em>bar<\/em><\/p>$/, editor.editable().getHtml(), 'Filling char was removed on keydown' );


						// TC2 - on getData
						// <p>foo^<em>...
						var range = editor.createRange();
						range.setStart( editor.document.getById( 'p' ), 1 );
						editor.getSelection().selectRanges( [ range ] );

						assert.isMatching( /^<p id="p">foo\u200b<em>bar<\/em><\/p>$/, editor.editable().getHtml(), 'Filling char was inserted 2' );

						editor.dataProcessor = {
							toHtml: function( html ) { return html },
							toDataFormat: function( html ) { return html }
						};

						assert.isMatching( /^<p id="p">foo<em>bar<\/em><\/p>$/, editor.getData(), 'Filling char was removed on getData' );


						// TC3 - on undo image
						// <p>foo^<em>...
						var range = editor.createRange();
						range.setStart( editor.document.getById( 'p' ), 1 );
						editor.getSelection().selectRanges( [ range ] );

						assert.isMatching( /^<p id="p">foo\u200b<em>bar<\/em><\/p>$/, editor.editable().getHtml(), 'Filling char was inserted 2' );

						assert.isMatching( /^<p id="p">foo<em>bar<\/em><\/p>$/, new CKEDITOR.plugins.undo.Image( editor ).contents, 'Filling char was removed on beforeUndoImage' );
					} );
				} );
			} );

			wait();
		} );
	},

	'test selection in source mode': function() {
		bender.editorBot.create( {
			name: 'test_editor_source',
			config: {
				plugins: 'sourcearea'
			}
		}, function( bot ) {
			var editor = bot.editor,
				selectionChange = 0;

			// Set selection not in first child to ensure triggering selectionChange if there's any kind of bug.
			bender.tools.setHtmlWithSelection( editor, '<p>foo</p><p>[bar]</p>' );

			var listener = editor.on( 'selectionChange', function() {
				selectionChange++;
			} );

			// Ensure async.
			setTimeout( function() {
				editor.setMode( 'source', function() {
					listener.removeListener();
					resume( function() {
						assert.areSame( 0, selectionChange, 'No selectionChange fired when switching to source mode' );
						assert.isNull( editor.getSelection(), 'getSelection() returns null for locked selection' );
						assert.isNull( editor.getSelection( 1 ), 'getSelection() returns null for real selection' );
					} );
				} );
			} );

			wait();
		} );
	},

	// #11500 & #5217#comment:32
	// This test doesn't make much sense on !IE, because only on IE
	// selection is locked when blurring framed editor.
	// But the more cases we test the better, so let's see.
	'test selection unlocked on setData in framed editor': function() {
		var editor = this.editor,
			bot = this.editorBot;

		editor.focus();
		bot.setHtmlWithSelection( '<p>foo[bar]bom</p>' );

		CKEDITOR.document.getById( 'input1' ).focus(); // Blur editor.

		bot.setData( '<p>x</p>', function() {
			var sel = editor.getSelection();
			assert.isFalse( !!sel.isLocked, 'selection is not locked' );
			assert.areNotSame( 'bar', sel.getSelectedText(), 'selection was reset' );
		} );
	},

	// #11500 & #5217#comment:32
	'test selection unlocked on setData in inline editor': function() {
		var editor = this.editor2,
			bot = this.editorBot2;

		editor.focus();
		bot.setHtmlWithSelection( '<p>foo[bar]bom</p>' );

		CKEDITOR.document.getById( 'input1' ).focus(); // Blur editor.

		bot.setData( '<p>x</p>', function() {
			var sel = editor.getSelection();
			assert.isFalse( !!sel.isLocked, 'selection is not locked' );
			assert.areNotSame( 'bar', sel.getSelectedText(), 'selection was reset' );
		} );
	}

} );