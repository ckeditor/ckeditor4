/* bender-tags: editor,unit,autoparagraphing */
/* global doc, checkRangeEqual, assertSelectionsAreEqual */

'use strict';

var fillingCharSequence = CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE,
	fillingCharSequenceLength = fillingCharSequence.length;

function noSelectionOnBlur( editor ) {
	return editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE || CKEDITOR.env.ie;
}

var htmlMatchingOpts = {
	compareSelection: true,
	normalizeSelection: true
};

bender.editors = {
	editor: {
		startupData: '<p>foo</p>',
		config: {
			autoParagraph: false,
			fillEmptyBlocks: false,
			allowedContent: true,
			plugins: 'undo'
		}
	},
	editorInline: {
		creator: 'inline',
		name: 'test_editor_inline'
	},
	editorFramed: {
		name: 'test_editor_framed'
	}
};

bender.test( {
	assertGetSelection: function( source, expected ) {
		var ed = this.editors.editor;
		bender.tools.setHtmlWithSelection( ed, source );
		assert.areSame( expected || source, bender.tools.getHtmlWithSelection( ed ) );
	},

	setSelectionInEmptyInlineElement: function( editor ) {
		var editable = editor.editable(),
			range = editor.createRange();

		editable.setHtml( '<p>x<u></u>x</p>' );

		var uEl = editable.findOne( 'u' );

		range.moveToPosition( uEl, CKEDITOR.POSITION_AFTER_START );
		editor.getSelection().selectRanges( [ range ] );
	},

	assertFillingChar: function( editable, parent, contents, msg ) {
		var fillingChar = editable.getCustomData( 'cke-fillingChar' );
		assert.isTrue( !!fillingChar, 'Filling char exists - ' + msg );
		assert.areSame( parent, fillingChar.getParent(), 'Filling char parent - ' + msg );
		assert.areSame( fillingCharSequence + contents, fillingChar.getText(), 'Filling char contents - ' + msg );

		return fillingChar;
	},

	'test selection on initial focus': function() {
		var ed = this.editors.editor;
		ed.editable().focus();
		assert.areEqual( '<p>^foo</p>', bender.tools.getHtmlWithSelection( ed ), 'Selection goes into editable on focus (#9507).' );
	},

	'test selection on initial focus - ensure new doc': function() {
		var ed = this.editors.editor;

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
	'test editor selection lock on blur': function() {
		var ed = this.editors.editor, editable = ed.editable();

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
			assert.isTrue( checkRangeEqual( range, savedRange ), 'saved range does not match original' );

			ed.focus();
			sel = ed.getSelection();
			assert.isFalse( !!sel.isLocked, 'selection should be unlocked' );

			var restoredRange = sel.getRanges()[ 0 ];
			// Check range is restored.
			assert.isTrue( checkRangeEqual( range, restoredRange ), 'restored range does not match original' );
		}, 200 ); // 200ms delay for triggering selection change.
	},

	'test "selectionChange" fires properly': function() {
		var ed = this.editors.editor, editable = ed.editable(), firedTimes = 0;
		var onSelectionChange = function( evt ) {
			firedTimes += 1;
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
		ed.define( 'selectionChange', { errorProof: 0 } );
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

	'test "selectionChange" not fired when editor selection is locked': function() {
		var ed = this.editors.editor, editable = ed.editable();

		if ( !noSelectionOnBlur( ed ) )
			assert.ignore();

		ed.focus();

		var range = new CKEDITOR.dom.range( editable );
		range.moveToPosition( editable, CKEDITOR.POSITION_BEFORE_END );
		range.select();

		doc.getById( 'input1' ).focus();

		function shouldFail() {
			// No "selectionChange" when editor is blurred.
			assert.fail( 'selection change should\'t be fired.' );
		}

		ed.on( 'selectionChange', shouldFail );
		ed.selectionChange( true );
		ed.removeListener( 'selectionChange', shouldFail );

		assert.isTrue( true );
	},

	'test "selectionChange" fired on empty data loaded': function() {
		var bot = this.editorBots.editor,
			editor = this.editors.editor,
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
		var bot = this.editorBots.editor,
			editor = this.editors.editor,
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
		var bot = this.editorBots.editor,
			editor = this.editors.editor,
			selectionChange = 0;

		bot.setData( '<p>foo<strong>bar</strong></p>', function() {
			var range = editor.createRange();

			editor.focus();
			range.setStart( editor.document.findOne( 'strong' ).getFirst(), 1 );
			range.collapse( true );
			range.select();

			assert.areSame( 0, selectionChange, 'Selection was up to date' );
			bot.setData( '<p>foo<strong>bar</strong></p>', function() {
				var listener = editor.on( 'selectionChange', function() {
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
		var ed = this.editors.editor;
		ed.on( 'selectionChange', function( evt ) {
			evt.removeListener();
			assert.isTrue( true );
		} );

		doc.getById( 'input1' ).focus();
		ed.forceNextSelectionCheck();
		ed.focus();
	},

	'test collapsed text selection': function() {
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

	'test selection after DOM unload': function() {
		var editor = this.editors.editor;

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
	// It only verifies if fixInitialSelection works correctly and does not confilct
	// with browser or editor (#9507) fixing selection.
	'test initial selection after set data in autoparagraphing editor': function() {
		doc.getById( 'input1' ).focus();

		var editor = this.editors.editorFramed;

		// Ensure async.
		setTimeout( function() {
			editor.setData( '', function() {
				resume( function() {
					var editable = editor.editable();

					editable.focus();
					assert.isInnerHtmlMatching( '<p>^@</p>', bender.tools.selection.getWithHtml( editor ),
						htmlMatchingOpts, 'Selection is in the right place.' );

					editor.insertText( 'foo' );
					assert.isInnerHtmlMatching( '<p>foo^@</p>', bender.tools.selection.getWithHtml( editor ),
						htmlMatchingOpts, 'Text was inserted in the right place.' );
				} );
			} );
		} );

		wait();
	},

	'test initial selection after set data in autoparagraphing inline editor': function() {
		// #13154
		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 11 ) {
			assert.ignore();
		}

		doc.getById( 'input1' ).focus();

		var editor = this.editors.editorInline;

		// Ensure async.
		setTimeout( function() {
			editor.setData( '', function() {
				resume( function() {
					var editable = editor.editable();

					editable.focus();
					assert.isInnerHtmlMatching( '<p>^@</p>', bender.tools.selection.getWithHtml( editor ),
						htmlMatchingOpts, 'Selection is in the right place.' );

					editor.insertText( 'foo' );
					assert.isInnerHtmlMatching( '<p>foo^@</p>', bender.tools.selection.getWithHtml( editor ),
						htmlMatchingOpts, 'Text was inserted in the right place.' );
				} );
			} );
		} );

		wait();
	},

	// #13816
	'test remove filling character from snapshots and data': function() {
		if ( !CKEDITOR.env.webkit )
			assert.ignore();

		var editor = this.editors.editor,
			bot = this.editorBots.editor;

		bot.setData( '<p>foo</p>', function() {
			var fc = new CKEDITOR.dom.text( fillingCharSequence );

			fc.appendTo( editor.document.findOne( 'p' ), 1 );

			assert.areSame( '<p>' + fillingCharSequence + 'foo</p>', editor.editable().getHtml(), 'FC in DOM.' );
			assert.areSame( '<p>foo</p>', new CKEDITOR.plugins.undo.Image( editor ).contents, 'No FC in snapshots.' );
			assert.areSame( '<p>foo</p>', editor.getData(), 'No FC in data.' );
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
						// Editor needs to have focus to remove FC on keydown. (#14714)
						editor.focus();
						// TC1 - on keydown
						// <p>foo^<em>...
						var range = editor.createRange();
						range.setStart( editor.document.getById( 'p' ), 1 );
						editor.getSelection().selectRanges( [ range ] );

						assert.isMatching( '^<p id="p">foo' + fillingCharSequence + '<em>bar<\/em><\/p>$', editor.editable().getHtml(), 'Filling char was inserted' );

						// Fire event imitating left arrow, what will trigger
						// removeFillingChar() on Webkit.
						editor.document.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 37 } ) );

						assert.isMatching( /^<p id="p">foo<em>bar<\/em><\/p>$/, editor.editable().getHtml(), 'Filling char was removed on keydown' );


						// TC2 - on getData
						// <p>foo^<em>...
						range = editor.createRange();
						range.setStart( editor.document.getById( 'p' ), 1 );
						editor.getSelection().selectRanges( [ range ] );

						assert.isMatching( '^<p id="p">foo' + fillingCharSequence + '<em>bar<\/em><\/p>$', editor.editable().getHtml(), 'Filling char was inserted 2' );
						assert.isMatching( /^<p id="p">foo<em>bar<\/em><\/p>$/, editor.getData(), 'Filling char was removed on getData' );

						// TC3 - on undo image
						// <p>foo^<em>...
						range = editor.createRange();
						range.setStart( editor.document.getById( 'p' ), 1 );
						editor.getSelection().selectRanges( [ range ] );

						assert.isMatching( '^<p id="p">foo' + fillingCharSequence + '<em>bar<\/em><\/p>$', editor.editable().getHtml(), 'Filling char was inserted 2' );

						assert.isMatching( /^<p id="p">foo<em>bar<\/em><\/p>$/, new CKEDITOR.plugins.undo.Image( editor ).contents, 'Filling char was removed on beforeUndoImage' );
					} );
				} );
			} );

			wait();
		} );
	},

	'test filling char remains untouched when taking snapshot': function() {
		if ( !CKEDITOR.env.webkit )
			assert.ignore();

		var editor = this.editors.editor,
			editable = editor.editable(),
			range;

		this.setSelectionInEmptyInlineElement( editor );

		var uEl = editable.findOne( 'u' ),
			fillingChar = this.assertFillingChar( editable, uEl, '', 'after set selection' );

		editor.fire( 'beforeUndoImage' );
		this.assertFillingChar( editable, uEl, '', 'after beforeUndoImage' );

		editor.fire( 'afterUndoImage' );
		fillingChar = this.assertFillingChar( editable, uEl, '', 'after afterUndoImage' );

		range = editor.getSelection().getRanges()[ 0 ];
		range.optimize();
		assert.areSame( fillingChar.getParent(), range.startContainer, 'Selection remains - container' );
		assert.areSame( 1, range.startOffset, 'Selection remains - offset after FC' );
	},

	// #12489
	'test filling char remains when taking snapshot if selection is not right after the filling char': function() {
		if ( !CKEDITOR.env.webkit )
			assert.ignore();

		var editor = this.editors.editor,
			editable = editor.editable(),
			range = editor.createRange();

		this.setSelectionInEmptyInlineElement( editor );

		var uEl = editable.findOne( 'u' ),
			fillingChar = this.assertFillingChar( editable, uEl, '', 'after set selection' );

		// Happens when typing and navigating...
		// Setting selection using native API to avoid losing the filling char on selection.setRanges().
		fillingChar.setText( fillingChar.getText() + 'abcd' );
		editor.document.$.getSelection().setPosition( fillingChar.$, fillingChar.$.nodeValue.length - 2 ); // FCab^cd

		this.assertFillingChar( editable, uEl, 'abcd', 'after type' );

		editor.fire( 'beforeUndoImage' );
		this.assertFillingChar( editable, uEl, 'abcd', 'after beforeUndoImage' );

		editor.fire( 'afterUndoImage' );
		fillingChar = this.assertFillingChar( editable, uEl, 'abcd', 'after afterUndoImage' );

		range = editor.getSelection().getRanges()[ 0 ];
		assert.areSame( fillingChar, range.startContainer, 'Selection remains - container' );
		assert.areSame( fillingCharSequenceLength + 2, range.startOffset, 'Selection remains - offset in FCab^cd' );
	},

	// #8617
	'test selection is preserved when removing filling char on left-arrow': function() {
		if ( !CKEDITOR.env.webkit )
			assert.ignore();

		var editor = this.editors.editor,
			editable = editor.editable(),
			range = editor.createRange();

		this.setSelectionInEmptyInlineElement( editor );

		var uEl = editable.findOne( 'u' ),
			fillingChar = this.assertFillingChar( editable, uEl, '', 'after setting selection' );

		// Happens when typing and navigating...
		// Setting selection using native API to avoid losing the filling char on selection.setRanges().
		fillingChar.setText( fillingChar.getText() + 'abc' );
		editor.document.$.getSelection().setPosition( fillingChar.$, fillingChar.$.nodeValue.length ); // FCabc^

		this.assertFillingChar( editable, uEl, 'abc', 'after typing' );

		// Editor needs to have focus to remove FC on keydown. (#14714)
		editor.focus();

		// Mock LEFT arrow.
		editor.document.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 37 } ) );

		assert.areSame( 'abc', uEl.getHtml(), 'Filling char is removed on left-arrow press' );

		range = editor.getSelection().getRanges()[ 0 ];
		assert.areSame( uEl.getFirst(), range.startContainer, 'Selection was restored - container' );
		assert.areSame( 3, range.startOffset, 'Selection was restored - offset in abc^' );
	},

	// #12419
	'test selection is preserved when removing filling char on select all': function() {
		if ( !CKEDITOR.env.webkit )
			assert.ignore();

		var editor = this.editors.editor,
			editable = editor.editable(),
			range = editor.createRange();

		this.setSelectionInEmptyInlineElement( editor );

		var uEl = editable.findOne( 'u' ),
			fillingChar = this.assertFillingChar( editable, uEl, '', 'after setting selection' );

		// Happens when typing and navigating...
		// Setting selection using native API to avoid losing the filling char on selection.setRanges().
		fillingChar.setText( fillingChar.getText() + 'abc' );
		editor.document.$.getSelection().setPosition( fillingChar.$, fillingChar.$.nodeValue.length ); // FCabc^

		this.assertFillingChar( editable, uEl, 'abc', 'after typing' );

		// Select all contents.
		range.selectNodeContents( editable.findOne( 'p' ) );
		editor.getSelection().selectRanges( [ range ] );

		assert.areSame( 'abc', uEl.getHtml(), 'Filling char is removed on selection change' );
		assert.isInnerHtmlMatching( '<p>[x<u>abc</u>x]</p>', bender.tools.selection.getWithHtml( editor ),
			htmlMatchingOpts, 'Selection is correctly set' );
	},

	'test direction of selection is preserved when removing filling char': function() {
		if ( !CKEDITOR.env.webkit )
			assert.ignore();

		var editor = this.editors.editor,
			editable = editor.editable(),
			range = editor.createRange();

		this.setSelectionInEmptyInlineElement( editor );

		var uEl = editable.findOne( 'u' ),
			fillingChar = this.assertFillingChar( editable, uEl, '', 'after setting selection' );

		// Happens when typing and making selection from right to left...
		// Setting selection using native API to avoid losing the filling char on selection.setRanges().
		fillingChar.setText( fillingChar.getText() + 'abc' );
		range = editor.document.$.createRange();
		// FCabc]
		range.setStart( fillingChar.$, fillingChar.$.nodeValue.length );
		var nativeSel = editor.document.$.getSelection();
		nativeSel.removeAllRanges();
		nativeSel.addRange( range );
		// FCa[bc
		nativeSel.extend( fillingChar.$, fillingChar.$.nodeValue.length - 2 );

		this.assertFillingChar( editable, uEl, 'abc', 'after typing' );

		// Mock LEFT arrow.
		editor.document.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 37 } ) );

		assert.areSame( 'abc', uEl.getHtml(), 'Filling char is removed on left-arrow press' );

		nativeSel = editor.document.$.getSelection();
		assert.areSame( 3, nativeSel.anchorOffset, 'sel.anchorOffset' );
		assert.areSame( 1, nativeSel.focusOffset, 'sel.focusOffset' );
	},

	// This particular scenario is reproducible when after typing in an empty inline element
	// user tries to select text by mouse from right to left in that element - selection is lost.
	// #12491 comment:3
	'test direction of selection is preserved when taking snapshot': function() {
		if ( !CKEDITOR.env.webkit )
			assert.ignore();

		var editor = this.editors.editor,
			editable = editor.editable(),
			range = editor.createRange();

		this.setSelectionInEmptyInlineElement( editor );

		var uEl = editable.findOne( 'u' ),
			fillingChar = this.assertFillingChar( editable, uEl, '', 'after set selection' );

		// Happens when typing and making selection from right to left...
		// Setting selection using native API to avoid losing the filling char on selection.setRanges().
		fillingChar.setText( fillingChar.getText() + 'abc' );
		range = editor.document.$.createRange();
		// FCabc]
		range.setStart( fillingChar.$, fillingChar.$.nodeValue.length );
		var nativeSel = editor.document.$.getSelection();
		nativeSel.removeAllRanges();
		nativeSel.addRange( range );
		// FCa[bc
		nativeSel.extend( fillingChar.$, fillingChar.$.nodeValue.length - 2 );

		this.assertFillingChar( editable, uEl, 'abc', 'after type' );

		editor.fire( 'beforeUndoImage' );
		this.assertFillingChar( editable, uEl, 'abc', 'after beforeUndoImage' );

		editor.fire( 'afterUndoImage' );
		this.assertFillingChar( editable, uEl, 'abc', 'after afterUndoImage' );

		nativeSel = editor.document.$.getSelection();
		assert.areSame( fillingCharSequenceLength + 3, nativeSel.anchorOffset, 'sel.anchorOffset' );
		assert.areSame( fillingCharSequenceLength + 1, nativeSel.focusOffset, 'sel.focusOffset' );
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
		var editor = this.editors.editor,
			bot = this.editorBots.editor;

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
		var editor = this.editors.editorInline,
			bot = this.editorBots.editorInline;

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
