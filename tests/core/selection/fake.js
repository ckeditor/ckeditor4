/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: basicstyles,undo,sourcearea,toolbar */

bender.editor = {
	config: {
		extraAllowedContent: 'p span em ul li[id,contenteditable]',
		// They make HTML comparison different in build and dev modes.
		removePlugins: 'htmlwriter,entities'
	}
};

function countHiddenContainers( doc ) {
	return doc.find( '*[data-cke-hidden-sel]' ).count();
}

function assertFakeSelection( editor, el, msg ) {
	var sel = editor.getSelection();
	assert.isTrue( !!sel.isFake,  msg + ' - sel.isFake' );
	assert.areSame( el, sel.getSelectedElement(), msg + ' - sel.getSelectedElement' );
}

function assertNoFakeSelection( editor, el, msg ) {
	var sel = editor.getSelection();
	assert.isFalse( !!sel.isFake,  msg + ' - sel.isFake' );
	assert.areNotSame( el, sel.getSelectedElement(), msg + ' - sel.getSelectedElement' );
}

function assertCollapsedSelectionIn( editor, htmlWithSel, msg ) {
	msg = msg ? msg + ' - ' : '';

	assert.isFalse( !!editor.getSelection().isFake, msg + 'sel.isFake' );
	assert.areSame( htmlWithSel, bender.tools.getHtmlWithSelection( editor ), msg + 'selection' );
}

function createTestKeyNavFn( editor, target ) {
	var keyCodes = {
		l: 37,
		r: 39,
		del: 46,
		bspc: 8
	};

	var prevented = false;

	return function( key, rangeOrEl, pos, msg ) {
		var range;

		if ( !( rangeOrEl instanceof CKEDITOR.dom.range ) ) {
			range = editor.createRange();
			range.moveToPosition( rangeOrEl, pos );
		} else {
			range = rangeOrEl;
		}

		editor.getSelection().selectRanges( [ range ] );

		prevented = false;
		editor.editable().fire( 'keydown', getKeyEvent( keyCodes[ key ], preventDefaultCallback ) );
		assert.areSame( target, editor.getSelection().getSelectedElement(), msg );
		assert[ target ? 'isTrue' : 'isFalse' ]( prevented, msg + ' - prevented' );
	};

	function preventDefaultCallback() {
		prevented = true;
	}
}

function getKeyEvent( keyCode, preventDefaultCallback ) {
	var evt = new CKEDITOR.dom.event( { keyCode: keyCode } );
	evt.preventDefault = function() {
		preventDefaultCallback && preventDefaultCallback();
	};
	return evt;
}

bender.test( {
	'Make fake-selection': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<p>[foo <span id="bar">bar</span>]</p>' );

		var span = editor.document.getById( 'bar' ),
			sel = editor.getSelection(),
			initialRev = sel.rev;

		sel.fake( span );

		assert.isTrue( !!sel.isFake, 'isFake is set' );

		assert.isTrue( sel.rev > initialRev, 'Next rev' );

		assert.areSame( span, sel.getStartElement(), 'getStartElement() must return the fake-selected element' );
		assert.areSame( span, sel.getSelectedElement(), 'getSelectedElement() must return the fake-selected element' );
		assert.areSame( CKEDITOR.SELECTION_ELEMENT, sel.getType(), 'getType() must be SELECTION_ELEMENT' );
		assert.isNull( sel.getNative(), 'getNative() should be null' );
		assert.isNull( sel.getSelectedText(), 'getSelectedText() should be null' );

		var range = sel.getRanges()[ 0 ];
		assert.isTrue( editor.editable() === range.root, 'range.root is set to editable (the same class, not only DOM element)' );
		assert.areSame( span, range.getEnclosedNode(), 'range.getEnclosedNode() returns the fake-selected element' );

		assert.areSame( span.getParent(), sel.getCommonAncestor(), 'getCommonAncestor() must return the parent <p>' );

		// Final check on getSelectedElement to be sure that the above tests
		// didn't touch the selection cache.
		assert.areSame( span, sel.getSelectedElement(), 'getSelectedElement() must return the fake-selected element' );
	},

	'Reset fake-selection': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<p>[foo <span id="bar">bar</span>]</p>' );

		var span = editor.document.getById( 'bar' ),
			sel = editor.getSelection();

		sel.fake( span );

		sel.reset();

		assert.isFalse( !!sel.isFake, 'isFake is not set' );

		assert.isFalse( !!span.equals( sel.getStartElement() ), 'getStartElement() must not be the fake-selected' );
		assert.isFalse( !!span.equals( sel.getSelectedElement() ), 'getSelectedElement() must not be the fake-selected' );
		assert.isNotNull( sel.getNative(), 'getNative() should not be null' );
	},

	'Fire selectionchange event': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<p>[foo <span id="bar">bar</span>]</p>' );

		var span = editor.document.getById( 'bar' ),
			sel = editor.getSelection(),
			selectionChange = 0,
			selectedElement;

		var listener = editor.on( 'selectionChange', function( evt ) {
			selectionChange++;
			selectedElement = evt.data.selection.getSelectedElement();
		} );

		sel.fake( span );

		wait( function() {
			listener.removeListener();

			assert.areSame( 1, selectionChange, 'selectionChange was fired only once' );
			assert.areSame( span, selectedElement, 'getSelectedElement() must be the fake-selected' );
		}, 50 );
	},

	'Change selection': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<p>[foo <span id="bar">bar</span></p><p id="bom">bom]</p>' );

		var span = editor.document.getById( 'bar' );

		editor.getSelection().fake( span );

		wait( function() {
			var selectionChange = 0,
				selectedRanges;

			editor.on( 'selectionChange', function( evt ) {
				selectionChange++;
				selectedRanges = evt.data.selection.getRanges();
			} );

			var range = editor.createRange();
			range.setStart( editor.document.getById( 'bom' ), 0 );
			editor.getSelection().selectRanges( [ range ] );

			wait( function() {
				assert.areSame( 1, selectionChange, 'selectionChange was fired only once' );
				var range = selectedRanges[ 0 ];
				range.optimize();
				assert.areSame( editor.document.getById( 'bom' ), range.startContainer );
			}, 50 );
		}, 50 );
	},

	'Hiding selection': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<p>[foo <span id="bar">bar</span> <span id="bom">bom</span>]</p>' );

		editor.getSelection().fake( editor.document.getById( 'bar' ) );
		assert.isTrue( editor.getSelection( 1 ).isHidden(), 'Real selection is placed in hidden element' );

		// Fake selection again on different element.
		editor.getSelection().fake( editor.document.getById( 'bom' ) );
		assert.areSame( 1, countHiddenContainers( editor.document ), 'There is only one hidden selection container' );

		// Unfake selection.
		editor.getSelection().selectElement( editor.document.getById( 'bar' ) );
		assert.isFalse( editor.getSelection( 1 ).isHidden(), 'Real selection is not placed in hidden element' );
		assert.isFalse( !!countHiddenContainers( editor.document ), 'There sould be no hidden selection container' );
	},

	'Clean up on setData in framed editor': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<p>[foo <span id="bar">bar</span>]</p>' );

		editor.getSelection().fake( editor.document.getById( 'bar' ) );

		assert.areSame( '<p>foo <span id="bar">bar</span></p>', editor.getData() );

		this.editorBot.setData( '<p>foo!</p>', function() {
			assert.isMatching( /^<p>foo!(<br>)?<\/p>$/i, editor.editable().getHtml(), 'data' );
			assert.isFalse( !!editor._.hiddenSelectionContainer, 'hiddenSelectionContainer' );
			assert.isFalse( !!editor.getSelection().isFake, 'isFake' );
			assert.isTrue( !!editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 37 } ) ), 'Key 37 should not be blocked' );
		} );
	},

	'Clean up on setData in inline editor': function() {
		bender.editorBot.create( {
			name: 'test_editor_inline2',
			creator: 'inline',
			config: {
				allowedContent: 'p span[id]'
			}
		}, function( bot ) {
			var editor = bot.editor;

			bender.tools.setHtmlWithSelection( editor, '<p>[foo <span id="bar">bar</span>]</p>' );

			editor.getSelection().fake( editor.document.getById( 'bar' ) );

			bot.setData( '<p>foo!</p>', function() {
				assert.isMatching( /^<p>foo!(<br>)?<\/p>$/i, editor.editable().getHtml(), 'data' );
				assert.isFalse( !!editor._.hiddenSelectionContainer, 'hiddenSelectionContainer' );
				assert.isFalse( !!editor.getSelection().isFake, 'isFake' );
				assert.isTrue( !!editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 37 } ) ), 'Key 37 should not be blocked' );
			} );
		} );
	},

	'Fake-selection bookmark': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<p>[foo <span id="bar">bar</span> <span id="bom">bom</span>]</p>' );

		var span = editor.document.getById( 'bar' ),
			sel = editor.getSelection();

		// Make the fake-selection.
		sel.fake( span );

		// Bookmark it.
		var bookmarks = sel.createBookmarks();

		// Move the selection somewhere else.
		sel.selectElement( editor.document.getById( 'bom' ) );

		assert.isFalse( !!countHiddenContainers( editor.document ), 'No hidden containers' );

		sel.selectBookmarks( bookmarks );

		assert.isTrue( !!sel.isFake, 'isFake is set' );
		assert.areSame( span, sel.getSelectedElement(), 'getSelectedElement() must return the fake-selected element' );
		assert.areSame( 1, countHiddenContainers( editor.document ), 'One hidden container' );
		assert.isTrue( editor.getSelection( 1 ).isHidden(), 'Real selection is placed in hidden element' );
	},

	'Fake-selection bookmark (serializable)': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<p>[foo <span id="bar">bar</span> <span id="bom">bom</span>]</p>' );

		var span = editor.document.getById( 'bar' ),
			sel = editor.getSelection();

		// Make the fake-selection.
		sel.fake( span );

		// Bookmark it.
		var bookmarks = sel.createBookmarks( true );

		// Move the selection somewhere else.
		sel.selectElement( editor.document.getById( 'bom' ) );

		// Replace the editor DOM.
		editor.editable().setHtml( editor.editable().getHtml() );

		sel.selectBookmarks( bookmarks );

		assert.isTrue( !!sel.isFake, 'isFake is set' );
		assert.areSame( 'bar', sel.getSelectedElement().getId(), 'getSelectedElement() must return the fake-selected element' );
		assert.areSame( 1, countHiddenContainers( editor.document ), 'One hidden container' );
		assert.isTrue( editor.getSelection( 1 ).isHidden(), 'Real selection is placed in hidden element' );
	},

	'Fake-selection bookmark 2': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<p>[foo <span id="bar">bar</span> <span id="bom">bom</span>]</p>' );

		var span = editor.document.getById( 'bar' ),
			sel = editor.getSelection();

		// Make the fake-selection.
		sel.fake( span );

		// Bookmark it.
		var bookmarks = sel.createBookmarks2();

		// Move the selection somewhere else.
		sel.selectElement( editor.document.getById( 'bom' ) );

		sel.selectBookmarks( bookmarks );

		assert.isTrue( !!sel.isFake, 'isFake is set' );
		assert.areSame( span, sel.getSelectedElement(), 'getSelectedElement() must return the fake-selected element' );
		assert.areSame( 1, countHiddenContainers( editor.document ), 'One hidden container' );
		assert.isTrue( editor.getSelection( 1 ).isHidden(), 'Real selection is placed in hidden element' );
	},

	'Fake-selection bookmark 2 (normalized)': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<p>[foo <span id="bar">bar</span> <span id="bom">bom</span>]</p>' );

		var span = editor.document.getById( 'bar' ),
			sel = editor.getSelection();

		// Make the fake-selection.
		sel.fake( span );

		// Bookmark it.
		var bookmarks = sel.createBookmarks2( true );

		// Move the selection somewhere else.
		sel.selectElement( editor.document.getById( 'bom' ) );

		// Replace the editor DOM.
		editor.editable().setHtml( editor.editable().getHtml() );

		sel.selectBookmarks( bookmarks );

		assert.isTrue( !!sel.isFake, 'isFake is set' );
		assert.areSame( 'bar', sel.getSelectedElement().getId(), 'getSelectedElement() must return the fake-selected element' );
		assert.areSame( 1, countHiddenContainers( editor.document ), 'One hidden container' );
		assert.isTrue( editor.getSelection( 1 ).isHidden(), 'Real selection is placed in hidden element' );
	},

	'Fake-selection does not create undo snapshots': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<p>[foo <span id="bar">bar</span> <span id="bom">bom</span>]</p>' );

		editor.resetUndo();

		// Make the fake-selection.
		editor.getSelection().fake( editor.document.getById( 'bar' ) );
		editor.fire( 'saveSnapshot' );
		assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'undo' ).state, 'Not undoable after making fake selection' );
		assert.areSame( 1, countHiddenContainers( editor.document ), 'One hidden container' );

		// Make a normal selection.
		editor.getSelection().selectElement( editor.document.getById( 'bom' ) );
		editor.fire( 'saveSnapshot' );
		assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'undo' ).state, 'Not undoable after removing fake selection' );
		assert.areSame( 0, countHiddenContainers( editor.document ), 'No hidden containers' );
	},

	'Fake-selection undo': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<p>[foo <span id="bar">bar</span> bom]</p>' );

		editor.resetUndo();

		var sel = editor.getSelection();

		// Make the fake-selection.
		sel.fake( editor.document.getById( 'bar' ) );

		// Execute bold, adding a undo step to the editor.
		editor.execCommand( 'bold' );

		assert.areSame( CKEDITOR.TRISTATE_OFF, editor.getCommand( 'undo' ).state, 'Undoable after bold' );

		// Undo bold, which must restore the fake-selection.
		editor.execCommand( 'undo' );

		// Retrieve the selection again.
		sel = editor.getSelection();

		assert.isTrue( !!sel.isFake, 'isFake is set' );
		assert.areSame( editor.document.getById( 'bar' ), sel.getSelectedElement(), 'getSelectedElement() must return the fake-selected element' );
		assert.areSame( 1, countHiddenContainers( editor.document ), 'One hidden container' );
		assert.isTrue( editor.getSelection( 1 ).isHidden(), 'Real selection is placed in hidden element' );

		editor.fire( 'saveSnapshot' );
		assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'undo' ).state, 'Not undoable after undo' );
	},

	'Fake-selection restore on focus': function() {
		var editor = this.editor;

		editor.focus();

		bender.tools.setHtmlWithSelection( editor, '<p>[foo <span id="bar">bar</span>]</p>' );

		var sel = editor.getSelection();

		// Make the fake-selection.
		sel.fake( editor.document.getById( 'bar' ) );

		// Move focus out of the editor.
		document.getElementById( 'some-input' ).focus();

		// Wait for focusManager.
		wait( function() {
			assert.isFalse( editor.focusManager.hasFocus, 'Editor is blurred' );

			// Get the focus back.
			editor.focus();

			// Retrieve the selection again.
			sel = editor.getSelection();

			assert.areSame( editor.document.getById( 'bar' ).$, sel.getStartElement().$, 'getSelectedElement() must return the fake-selected element' );
			assert.areSame( 1, countHiddenContainers( editor.document ), 'One hidden container' );
			assert.isTrue( editor.getSelection( 1 ).isHidden(), 'Real selection is placed in hidden element' );
		}, 210 );
	},

	'Fake-selection restore on focus in inline editor': function() {
		bender.editorBot.create( {
			name: 'test_editor_inline1',
			creator: 'inline',
			config: {
				extraAllowedContent: 'span[id]'
			}
		}, function( bot ) {
			var editor = bot.editor;

			editor.focus();

			bender.tools.setHtmlWithSelection( editor, '<p>[foo <span id="bar">bar</span>]</p>' );

			var sel = editor.getSelection();

			// Make the fake-selection.
			sel.fake( editor.document.getById( 'bar' ) );

			// Move focus out of the editor.
			document.getElementById( 'some-input' ).focus();

			// Wait for focusManager.
			wait( function() {
				assert.isFalse( editor.focusManager.hasFocus, 'Editor is blurred' );

				// Get the focus back.
				editor.focus();

				// Retrieve the selection again.
				sel = editor.getSelection();

				assert.areSame( editor.document.getById( 'bar' ).$, sel.getStartElement().$, 'getSelectedElement() must return the fake-selected element' );
				assert.areSame( 1, countHiddenContainers( editor.document ), 'One hidden container' );
				assert.isTrue( editor.getSelection( 1 ).isHidden(), 'Real selection is placed in hidden element' );
			}, 210 );
		} );
	},

	'Fake-selection automatically resets on selectionChange': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<p>[foo] <span id="bar">bar</span> <span id="bom">bom</span></p>' );

		// Make the fake-selection.
		editor.getSelection().fake( editor.document.getById( 'bar' ) );

		var selectionChange = 0,
			sel;

		var listener = editor.on( 'selectionChange', function( evt ) {
			selectionChange++;
			sel = evt.data.selection;
		} );

		// Move the selection to another element.
		editor.getSelection().selectElement( editor.document.getById( 'bom' ) );

		listener.removeListener();

		assert.areSame( 1, selectionChange );
		assert.isFalse( !!sel.isFake );
		assert.areNotSame( editor.document.getById( 'bar' ), sel.getSelectedElement() );
	},

	'Fake-selection moved between elements': function() {
		var editor = this.editor;

		bender.tools.setHtmlWithSelection( editor, '<p>[foo] <span id="bar">bar</span> <span id="bom">bom</span></p>' );

		// Make the fake-selection.
		editor.getSelection().fake( editor.document.getById( 'bar' ) );

		var selectionChange = 0,
			sel;

		var listener = editor.on( 'selectionChange', function( evt ) {
			selectionChange++;
			sel = evt.data.selection;
		} );

		// Make another fake-selection.
		editor.getSelection().fake( editor.document.getById( 'bom' ) );

		listener.removeListener();

		assert.areSame( 1, selectionChange );
		assert.isTrue( !!sel.isFake );
		assert.areSame( editor.document.getById( 'bom' ), sel.getSelectedElement() );
		assert.isTrue( !!editor.getSelection().isFake, 'check whether editor returns faked selection too' );
	},

	'Fake-selection does not blow up when switching mode': function() {
		var editor = this.editor,
			selectionChange = 0;

		bender.tools.setHtmlWithSelection( editor, '<p>[foo] <span id="bar">bar</span> <span id="bom">bom</span></p>' );

		// Make the fake-selection.
		editor.getSelection().fake( editor.document.getById( 'bar' ) );

		var listener = editor.on( 'selectionChange', function() {
			selectionChange++;
		} );

		// Ensure async.
		setTimeout( function() {
			editor.setMode( 'source', function() {
				resume( function() {
					listener.removeListener();
					assert.areSame( 0, selectionChange, 'no selectionChange when switching to source mode' );

					// Ensure async.
					setTimeout( function() {
						editor.setMode( 'wysiwyg', function() {
							resume( function() {
								var sel = editor.getSelection();

								assert.isFalse( !!sel.isFake, 'sel.isFake' );
								assert.areNotSame( editor.document.getById( 'bar' ), sel.getSelectedElement(), 'sel.getSelectedElement()' );
							} );
						} );
					} );

					wait();
				} );
			} );
		} );

		wait();
	},

	'Test auto fake selection': function() {
		bender.editorBot.create( {
			name: 'test_editor_auto_fake_1',
			startupData: '<p>foo<span contenteditable="false" id="el1">bar</span></p><div contenteditable="false" id="el2">bom</div>',
			config: {
				allowedContent: 'span div p[id,contenteditable]'
			}
		}, function( bot ) {
			var editor = bot.editor,
				el1 = editor.document.getById( 'el1' ),
				el2 = editor.document.getById( 'el2' ),
				range = editor.createRange(),
				range2 = editor.createRange();

			editor.focus();

			editor.getSelection().selectElement( el1 );
			assertFakeSelection( editor, el1, 'selectElement el1' );

			editor.getSelection().selectElement( el2 );
			assertFakeSelection( editor, el2, 'selectElement el2' );

			range.setStartBefore( el1 );
			range.setEndAfter( el1 );
			editor.getSelection().selectRanges( [ range ] );
			assertFakeSelection( editor, el1, 'selectRanges el1' );

			range.setStartBefore( el2 );
			range.setEndAfter( el2 );
			editor.getSelection().selectRanges( [ range ] );
			assertFakeSelection( editor, el2, 'selectRanges el2' );

			// Opt out cases.

			editor.getSelection().selectElement( el1.getParent() );
			assertNoFakeSelection( editor, el1, 'selectElement p' );

			range.selectNodeContents( editor.editable() );
			editor.getSelection().selectRanges( [ range ] );
			assertNoFakeSelection( editor, el2, 'selectElement editable\'s content' );

			range.selectNodeContents( el1 );
			editor.getSelection().selectRanges( [ range ] );
			assertNoFakeSelection( editor, el2, 'selectRanges el1 contents' );

			range.setStartBefore( el1 );
			range.setEndAfter( el1 );
			range2.setStartBefore( el2 );
			range2.setEndAfter( el2 );
			editor.getSelection().selectRanges( [ range, range2 ] );
			assertNoFakeSelection( editor, el2, 'selectRanges el1 & el2' );

			range.setStartBefore( el1 );
			range.setEndAfter( el2 );
			editor.getSelection().selectRanges( [ range ] );
			assertNoFakeSelection( editor, el2, 'selectRanges el1 to el2' );

			range.setStartAt( el1, CKEDITOR.POSITION_BEFORE_START );
			range.setEndAt( el1, CKEDITOR.POSITION_BEFORE_END );
			editor.getSelection().selectRanges( [ range ] );
			assertNoFakeSelection( editor, el2, 'selectRanges el1 (partial)' );
		} );
	},

	'Test leaving fake selection by arrow keys': function() {
		var editor = this.editor,
			prevented = 0;

		this.editorBot.setData( '<p>foo</p><p id="start">X</p><p>bar</p>', function() {
			var ps = editor.document.getById( 'start' ),
				editable = editor.editable();

			editor.getSelection().fake( ps );
			editable.fire( 'keydown', getKeyEvent( 37, preventCallback ) ); // LEFT
			assertCollapsedSelectionIn( editor, '<p>foo^</p><p id="start">X</p><p>bar</p>', 'Move left' );
			assert.areSame( 1, prevented, 'Move left - prevented' );

			editor.getSelection().fake( ps );
			editable.fire( 'keydown', getKeyEvent( 39, preventCallback ) ); // RIGHT
			assertCollapsedSelectionIn( editor, '<p>foo</p><p id="start">X</p><p>^bar</p>', 'Move right' );
			assert.areSame( 2, prevented, 'Move right - prevented' );

			editor.getSelection().fake( ps );
			editable.fire( 'keydown', getKeyEvent( 38, preventCallback ) ); // UP
			assertCollapsedSelectionIn( editor, '<p>foo^</p><p id="start">X</p><p>bar</p>', 'Move up' );
			assert.areSame( 3, prevented, 'Move up - prevented' );

			editor.getSelection().fake( ps );
			editable.fire( 'keydown', getKeyEvent( 40, preventCallback ) ); // DOWN
			assertCollapsedSelectionIn( editor, '<p>foo</p><p id="start">X</p><p>^bar</p>', 'Move down' );
			assert.areSame( 4, prevented, 'Move down - prevented' );
		} );

		function preventCallback() {
			prevented += 1;
		}
	},

	'Test staying in selected non-editable element by arrow keys if there is not editing place by its side': function() {
		var editor = this.editor,
			prevented = 0;

		this.editorBot.setData( '<p id="start" contenteditable="false">foo</p>', function() {
			var ps = editor.document.getById( 'start' ),
				editable = editor.editable();

			editor.getSelection().fake( ps );
			editable.fire( 'keydown', getKeyEvent( 37, preventCallback ) ); // LEFT
			assert.areSame( ps, editor.getSelection().getSelectedElement(), 'Move left - selectedElement' );
			assert.isTrue( !!editor.getSelection().isFake, 'Move left - isFake' );
			assert.areSame( 1, prevented, 'Move left - prevented' );

			editor.getSelection().fake( ps );
			editable.fire( 'keydown', getKeyEvent( 39, preventCallback ) ); // RIGHT
			assert.areSame( ps, editor.getSelection().getSelectedElement(), 'Move right - selectedElement' );
			assert.isTrue( !!editor.getSelection().isFake, 'Move right - isFake' );
			assert.areSame( 2, prevented, 'Move right - prevented' );

			editor.getSelection().fake( ps );
			editable.fire( 'keydown', getKeyEvent( 38, preventCallback ) ); // UP
			assert.areSame( ps, editor.getSelection().getSelectedElement(), 'Move up - selectedElement' );
			assert.isTrue( !!editor.getSelection().isFake, 'Move up - isFake' );
			assert.areSame( 3, prevented, 'Move up - prevented' );

			editor.getSelection().fake( ps );
			editable.fire( 'keydown', getKeyEvent( 40, preventCallback ) ); // DOWN
			assert.areSame( ps, editor.getSelection().getSelectedElement(), 'Move down - selectedElement' );
			assert.isTrue( !!editor.getSelection().isFake, 'Move down - isFake' );
			assert.areSame( 4, prevented, 'Move down - prevented' );
		} );

		function preventCallback() {
			prevented += 1;
		}
	},

	'Test moving to sibling non-editable blocks by arrow keys': function() {
		var editor = this.editor;

		this.editorBot.setData( '<p>X</p><p id="p1" contenteditable="false">X</p><p id="p2" contenteditable="false">X</p><p id="p3" contenteditable="false">X</p>', function() {
			var p1 = editor.document.getById( 'p1' ),
				p2 = editor.document.getById( 'p2' ),
				p3 = editor.document.getById( 'p3' ),
				editable = editor.editable();

			editor.getSelection().fake( p1 );
			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 39 } ) ); // RIGHT
			assert.areSame( p2, editor.getSelection().getSelectedElement(), 'Move right 1 - selectedElement' );
			assert.isTrue( !!editor.getSelection().isFake, 'Move right 1 - isFake' );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 39 } ) ); // RIGHT
			assert.areSame( p3, editor.getSelection().getSelectedElement(), 'Move right 2 - selectedElement' );
			assert.isTrue( !!editor.getSelection().isFake, 'Move right 2 - isFake' );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 39 } ) ); // RIGHT
			assert.areSame( p3, editor.getSelection().getSelectedElement(), 'Move right 3 - selectedElement' );
			assert.isTrue( !!editor.getSelection().isFake, 'Move right 3 - isFake' );


			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 37 } ) ); // LEFT
			assert.areSame( p2, editor.getSelection().getSelectedElement(), 'Move left 1 - selectedElement' );
			assert.isTrue( !!editor.getSelection().isFake, 'Move left 1 - isFake' );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 37 } ) ); // LEFT
			assert.areSame( p1, editor.getSelection().getSelectedElement(), 'Move left 2 - selectedElement' );
			assert.isTrue( !!editor.getSelection().isFake, 'Move left 2 - isFake' );
		} );
	},

	'Test deleting selected element (del)': function() {
		var editor = this.editor;

		this.editorBot.setData( '<p>X</p><p id="start" contenteditable="false">foo</p><p>bar</p>', function() {
			var ps = editor.document.getById( 'start' ),
				editable = editor.editable(),
				prevented;

			editor.getSelection().fake( ps );
			editor.resetUndo();

			editable.fire( 'keydown', getKeyEvent( 46, function() {
				prevented = true;
			} ) );
			assertCollapsedSelectionIn( editor, '<p>X</p><p>^bar</p>', 'Caret' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, editor.getCommand( 'undo' ).state, 'Undo is available' );
			assert.isTrue( prevented, 'Was prevented' );
		} );
	},

	'Test deleting selected element (backspace)': function() {
		var editor = this.editor;

		this.editorBot.setData( '<p>bar</p><p id="start" contenteditable="false">foo</p><p>X</p>', function() {
			var ps = editor.document.getById( 'start' ),
				editable = editor.editable(),
				prevented;

			editor.getSelection().fake( ps );
			editor.resetUndo();

			editable.fire( 'keydown', getKeyEvent( 8, function() {
				prevented = true;
			} ) );
			assertCollapsedSelectionIn( editor, '<p>bar^</p><p>X</p>', 'Caret' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, editor.getCommand( 'undo' ).state, 'Undo is available' );
			assert.isTrue( prevented, 'Was prevented' );
		} );
	},

	'Test deleting selected inline element (del)': function() {
		var editor = this.editor;

		this.editorBot.setData( '<p>bar<span id="start">foo</span>bom</p>', function() {
			var ps = editor.document.getById( 'start' ),
				editable = editor.editable(),
				prevented;

			editor.getSelection().fake( ps );
			editor.resetUndo();

			editable.fire( 'keydown', getKeyEvent( 46, function() {
				prevented = true;
			} ) );
			assertCollapsedSelectionIn( editor, '<p>bar^bom</p>', 'Caret' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, editor.getCommand( 'undo' ).state, 'Undo is available' );
			assert.isTrue( prevented, 'Was prevented' );
		} );
	},

	'Test deleting selected inline element (backspace)': function() {
		var editor = this.editor;

		this.editorBot.setData( '<p>bar<span id="start">foo</span>bom</p>', function() {
			var ps = editor.document.getById( 'start' ),
				editable = editor.editable(),
				prevented;

			editor.getSelection().fake( ps );
			editor.resetUndo();

			editable.fire( 'keydown', getKeyEvent( 8, function() {
				prevented = true;
			} ) );
			assertCollapsedSelectionIn( editor, '<p>bar^bom</p>', 'Caret' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, editor.getCommand( 'undo' ).state, 'Undo is available' );
			assert.isTrue( prevented, 'Was prevented' );
		} );
	},

	'Test deleting selected element - no editable space after element (del)': function() {
		var editor = this.editor;

		this.editorBot.setData( '<p>bar</p><p id="start" contenteditable="false">foo</p>', function() {
			var ps = editor.document.getById( 'start' ),
				editable = editor.editable(),
				prevented;

			editor.getSelection().fake( ps );
			editor.resetUndo();

			editable.fire( 'keydown', getKeyEvent( 46, function() {
				prevented = true;
			} ) );
			assertCollapsedSelectionIn( editor, '<p>bar^</p>', 'Caret' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, editor.getCommand( 'undo' ).state, 'Undo is available' );
			assert.isTrue( prevented, 'Was prevented' );
		} );
	},

	'Test deleting selected element - no editable space before element (backspace)': function() {
		var editor = this.editor;

		this.editorBot.setData( '<p id="start" contenteditable="false">foo</p><p>bar</p>', function() {
			var ps = editor.document.getById( 'start' ),
				editable = editor.editable(),
				prevented;

			editor.getSelection().fake( ps );
			editor.resetUndo();

			editable.fire( 'keydown', getKeyEvent( 8, function() {
				prevented = true;
			} ) );
			assertCollapsedSelectionIn( editor, '<p>^bar</p>', 'Caret' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, editor.getCommand( 'undo' ).state, 'Undo is available' );
			assert.isTrue( prevented, 'Was prevented' );
		} );
	},

	'Test deleting selected element - no space at all': function() {
		var editor = this.editor;

		this.editorBot.setData( '<p id="start" contenteditable="false">foo</p>', function() {
			var ps = editor.document.getById( 'start' ),
				editable = editor.editable(),
				prevented;

			editor.getSelection().fake( ps );
			editor.resetUndo();

			editable.fire( 'keydown', getKeyEvent( 46, function() {
				prevented = true;
			} ) );
			assertCollapsedSelectionIn( editor, '<p>^\xa0</p>', 'Caret' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, editor.getCommand( 'undo' ).state, 'Undo is available' );
			assert.isTrue( prevented, 'Was prevented' );
		} );
	},

	'Test selecting non-editable element by keys - inline': function() {
		var editor = this.editor;

		this.editorBot.setData( '<p id="el1">foo<span id="target" contenteditable="false">bar</span><em id="el2">bom</em></p>', function() {
			var el1 = editor.document.getById( 'el1' ),
				el2 = editor.document.getById( 'el2' ),
				target = editor.document.getById( 'target' ),
				testKeyNav = createTestKeyNavFn( editor, target );

			testKeyNav( 'r',	target,		CKEDITOR.POSITION_BEFORE_START,		'<p>foo^ - el' );
			testKeyNav( 'del',	el1.getFirst(), CKEDITOR.POSITION_BEFORE_END,	'<p>foo^ - txt node' );
			testKeyNav( 'l',	el2,		CKEDITOR.POSITION_BEFORE_START,		'^<em>bom - l' );
			testKeyNav( 'bspc',	el2,		CKEDITOR.POSITION_BEFORE_START,		'^<em>bom - bspc' );
			testKeyNav( 'l',	el2,		CKEDITOR.POSITION_AFTER_START,		'<em>^bom - el' );
			testKeyNav( 'bspc',	el2.getFirst(), CKEDITOR.POSITION_AFTER_START,	'<em>^bom - txt node' );
		} );
	},

	'Test selecting non-editable element by keys - block': function() {
		var editor = this.editor;

		this.editorBot.setData( '<p id="el1">foo</p><p id="target" contenteditable="false">bar</p><ul><li id="el2">bom</li></ul>', function() {
			var el1 = editor.document.getById( 'el1' ),
				el2 = editor.document.getById( 'el2' ),
				target = editor.document.getById( 'target' ),
				testKeyNav = createTestKeyNavFn( editor, target );

			testKeyNav( 'r',	el1,		CKEDITOR.POSITION_BEFORE_END,		'<p>foo^</p> - el' );
			testKeyNav( 'del',	el1.getFirst(), CKEDITOR.POSITION_BEFORE_END,	'<p>foo^</p> - txt node' );
			testKeyNav( 'l',	el2,		CKEDITOR.POSITION_AFTER_START,		'<li>^bom</li> - el' );
			testKeyNav( 'bspc',	el2.getFirst(), CKEDITOR.POSITION_AFTER_START,	'<li>^bom</li> - txt node' );
		} );
	},

	'Test selecting non-editable element by keys - opt out': function() {
		var editor = this.editor;

		this.editorBot.setData( '<p id="el1">foo</p><p id="target" contenteditable="false">bar</p><p></p><p id="el2">bom</p>', function() {
			var el1 = editor.document.getById( 'el1' ),
				el2 = editor.document.getById( 'el2' ),
				range = editor.createRange(),
				testKeyNav = createTestKeyNavFn( editor, null );

			range.setStart( el1.getFirst(), 2 );
			range.collapse( true );
			testKeyNav( 'r',	range,			null,							'<p>fo^o</p>' );

			testKeyNav( 'l',	el2.getFirst(), CKEDITOR.POSITION_AFTER_START,	'<p>^bom</p>' );

			range.setStart( el1, 0 );
			range.setEnd( el1, 1 );
			editor.getSelection().selectRanges( [ range ] );
			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 39 } ) ); // RIGHT
			assert.isNull( editor.getSelection().getSelectedElement(), '<p>[foo]</p>' );
		} );
	},

	'Test auto fake selection for inline element containing nested non-editable': function() {
		var bot = this.editorBot;

		bot.setData( bender.tools.getValueAsHtml( 'editor_content' ), function() {
			var editor = bot.editor,
				sel = editor.getSelection(),
				element = editor.document.findOne( 'strong' );

			sel.selectElement( element );

			assert.isTrue( !!sel.isFake, 'Produced selection should be fake' );
			assert.areSame( editor.document.findOne( '#fake' ), sel.getSelectedElement() );
		} );
	},

	'Test auto fake selection for inline element containing only non-editable': function() {
		var bot = this.editorBot;

		bot.setData( bender.tools.getValueAsHtml( 'editor_content2' ), function() {
			var editor = bot.editor,
				sel = editor.getSelection(),
				element = editor.document.findOne( 'strong' );

			sel.selectElement( element );

			assert.isTrue( !!sel.isFake, 'Produced selection should be fake' );
			assert.areSame( editor.document.findOne( '#fake' ), sel.getSelectedElement() );
		} );
	},

	'Test no auto fake selection if non-editable element is not the only child of enclosed element': function() {
		var bot = this.editorBot;

		bot.setData( bender.tools.getValueAsHtml( 'editor_content3' ), function() {
			var editor = bot.editor,
				sel = editor.getSelection(),
				element = editor.document.findOne( 'strong' );

			sel.selectElement( element );

			assert.isFalse( !!sel.isFake, 'Produced selection should not be fake' );
		} );
	},

	'Test select editable contents when fake selection is on': function() {
		var editor = this.editor;

		this.editorBot.setData( '<p>a<em id="b">b</em>c</p>', function() {
			var editable = editor.editable(),
				doc = editor.document,
				range;

			editor.getSelection().fake( doc.getById( 'b' ) );

			range = editor.createRange();
			range.selectNodeContents( editable );
			range.select();

			// Remove nbsp which breaks comparison on FF.
			var html = bender.tools.getHtmlWithSelection( editor ).replace( /\xa0/g, '' );

			assert.isMatching(
				// getHtmlWithRanges processes selections anchored on blocks incorrectly.
				/(^<p>\[a<em id="b">b<\/em>c\]<\/p>$)|(^<p>\[<\/p><p>a<em id="b">b<\/em>c<\/p><p>\]<\/p>$)/i,
				html,
				'Selection contains entire editable contents'
			);

			// Be sure the selection is really there - regexp doesn't check it.
			assert.isTrue( !!html.match( /\[/ ) && !!html.match( /\]/ ), 'Selection exists' );
		} );
	},

	// #11393.
	'Test select editable contents when fake selection was on and DOM has been overwritten': function() {
		var editor = this.editor;

		this.editorBot.setData( '<p id="a">a<em id="b">b</em>c</p>', function() {
			var editable = editor.editable(),
				doc = editor.document,
				range;

			editor.getSelection().fake( doc.getById( 'b' ) );

			// Silently overwrite DOM and remove from it hiddenSelectionContainer.
			editor.editable().setHtml( '<p>abc</p>' );

			range = editor.createRange();
			range.selectNodeContents( editable );
			range.select();

			// Remove nbsp which breaks comparison on FF.
			var html = bender.tools.getHtmlWithSelection( editor ).replace( /\xa0/g, '' );

			assert.isMatching(
				// getHtmlWithRanges processes selections anchored on blocks incorrectly.
				/(^<p>\[abc\]<\/p>$)|(^<p>\[<\/p><p>abc<\/p><p>\]<\/p>$)/i,
				html,
				'Selection contains entire editable contents'
			);

			// Be sure the selection is really there - regexp doesn't check it.
			assert.isTrue( !!html.match( /\[/ ) && !!html.match( /\]/ ), 'Selection exists' );
		} );
	}
} );