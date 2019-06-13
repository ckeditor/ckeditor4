/* bender-tags: tableselection, selection */
/* bender-ckeditor-plugins: basicstyles,undo,tableselection,sourcearea,toolbar */
/* bender-include: ../../_helpers/tableselection.js */

( function() {
	'use strict';

	bender.editor = {
		config: {
			// They make HTML comparison different in build and dev modes.
			removePlugins: 'htmlwriter,entities'
		}
	};

	var selectedClass = 'cke_table-faked-selection',
		isQuirkyEnv = ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) || CKEDITOR.env.safari;

	function getKeyEvent( keyCode, preventDefaultCallback ) {
		var evt = new CKEDITOR.dom.event( typeof keyCode === 'object' ? keyCode : { keyCode: keyCode, charCode: keyCode } );
		evt.preventDefault = function() {
			preventDefaultCallback && preventDefaultCallback();
		};
		return evt;
	}

	function _getTableElementFromRange( range ) {
		var tableElements = {
				table: 1,
				tbody: 1,
				tr: 1,
				td: 1,
				th: 1
			},
			start = range.startContainer;

		if ( range.getEnclosedNode() ) {
			return range.getEnclosedNode().getAscendant( tableElements, true );
		}

		return start.getAscendant( tableElements, true );
	}

	function getRangesForCells( editor, table, indexes, skipClass ) {
		var ranges = [],
			range,
			cell,
			i;

		for ( i = 0; i < indexes.length; i++ ) {
			cell = table.find( 'td' ).getItem( indexes[ i ] );
			range = editor.createRange();

			if ( !skipClass ) {
				cell.addClass( selectedClass );
			}

			range.setStartBefore( cell );
			range.setEndAfter( cell );

			ranges.push( range );
		}

		return ranges;
	}

	function getTextNodeFromRange( range ) {
		var node = range.startContainer;

		while ( node.type !== CKEDITOR.NODE_TEXT ) {
			node = node.getChild( 0 );
		}

		return node;
	}

	function clearTableSelection( editable ) {
		var selected = editable.find( selectedClass ),
			i;

		for ( i = 0; i < selected.count(); i++ ) {
			selected.getItem( i ).removeClass( selectedClass );
		}
	}

	function createRange( editor, startElement, startOffset, endElement, endOffset ) {
		var range = editor.createRange();

		range.setStart( startElement, startOffset );
		range.setEnd( endElement, endOffset );

		return range;
	}

	var tests =  {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},
		tearDown: function() {
			if ( this._oldVerbosity !== undefined ) {
				// Some tests might override verbosity, restore it if requested.
				CKEDITOR.verbosity = this._oldVerbosity;
				delete this._oldVerbosity;
			}
		},

		'test check if selection is in table': function() {
			var editor = this.editor,
				editable = editor.editable(),
				selection = editor.getSelection(),
				table,
				range,
				ranges;

			bender.tools.setHtmlWithSelection( editor, '<p id="foo">Foo</p>' +
				CKEDITOR.document.getById( 'simpleTable' ).getHtml() +
				CKEDITOR.document.getById( 'simpleTable' ).getHtml() );
			table = editable.findOne( 'table' );

			selection.selectElement( table.findOne( 'td' ) );
			assert.isTrue( selection.isInTable(), 'Real table selection (one cell).' );

			selection.selectElement( table.findOne( 'tr' ) );
			assert.isTrue( selection.isInTable(), 'Real table selection (one row).' );

			selection.selectElement( table.findOne( 'tbody' ) );
			assert.isTrue( selection.isInTable(), 'Real table selection (tbody).' );

			selection.selectElement( table );
			assert.isTrue( selection.isInTable(), 'Table element selection.' );

			ranges = getRangesForCells( editor, table, [ 0, 3 ] );
			selection.selectRanges( ranges );
			assert.isTrue( selection.isInTable(), 'Fake table selection.' );
			clearTableSelection( editor.editable() );

			selection.selectElement( table.findOne( 'td' ).getChild( 0 ) );
			assert.isTrue( selection.isInTable(), 'Selecting only text node in table.' );

			selection.selectElement( editor.document.getById( 'foo' ) );
			assert.isFalse( selection.isInTable(), 'Selecting paragraph.' );

			range = createRange( editor, editor.document.getById( 'foo' ).getChild( 0 ), 2,
				table.findOne( 'td' ).getChild( 0 ), 2 );
			range.select();
			assert.isFalse( editor.getSelection().isInTable(), 'Selecting table and paragraph.' );

			range = createRange( editor, table.find( 'td' ).getItem( 5 ).getChild( 0 ), 2,
				editable.find( 'table' ).getItem( 1 ).findOne( 'td' ).getChild( 0 ), 2 );
			range.select();
			assert.isFalse( editor.getSelection().isInTable(), 'Selecting from two tables at once.' );

			range = createRange( editor, table.findOne( 'td' ).getChild( 0 ), 0,
				table.findOne( 'td' ).getChild( 0 ), 2 );
			range.select();
			assert.isFalse( editor.getSelection().isInTable(), 'Selecting fragment of text node inside table cell.' );

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'nestedTable' ).getHtml() );
			table = editable.findOne( 'table' );

			// Edge case in Safari: selecting last cell inside nested table.
			ranges = getRangesForCells( editor, table, [ 5 ] );
			selection.selectRanges( ranges );
			assert.isTrue( selection.isInTable(), 'Last cell selection.' );

			ranges = getRangesForCells( editor, table, [ 1 ] );
			selection.selectRanges( ranges );
			assert.isTrue( selection.isInTable(), 'Nested cell selection (1. cell).' );

			ranges = getRangesForCells( editor, table, [ 3 ] );
			selection.selectRanges( ranges );
			assert.isTrue( selection.isInTable(), 'Nested cell selection first cell.' );

			selection.selectElement( table.findOne( 'table tr' ) );
			assert.isTrue( selection.isInTable(), 'Nested table selection (one row).' );

			selection.selectElement( table.findOne( 'table tbody' ) );
			assert.isTrue( selection.isInTable(), 'Nested table selection (tbody).' );

			selection.selectElement( table.findOne( 'table' ) );
			assert.isTrue( selection.isInTable(), 'Nested table selection (table).' );
			assert.isTrue( table.findOne( 'table' ).equals( selection.getSelectedElement() ),
				'Proper selected element is returned for nested table selection (table).' );

			// Edge case in Safari: selecting one and only cell in the table.
			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'oneCell' ).getHtml() );
			table = editable.findOne( 'table' );

			ranges = getRangesForCells( editor, table, [ 0 ] );
			selection.selectRanges( ranges );
			assert.isTrue( selection.isInTable(), 'Only cell in the table.' );

			// Edge case in Safari: selecting one and only cell inside the nested table.
			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'nestedOneCell' ).getHtml() );
			table = editable.findOne( 'table table ' );

			ranges = getRangesForCells( editor, table, [ 0 ] );
			selection.selectRanges( ranges );
			assert.isTrue( selection.isInTable(), 'Only cell in the table.' );
		},

		'test make fake table selection': function() {
			// Ignores for Edge (#1944).
			if ( CKEDITOR.env.edge ) {
				assert.ignore();
			}

			var editor = this.editor,
				selection = editor.getSelection(),
				initialRev = selection.rev,
				realSelection,
				ranges,
				i;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );

			selection.selectRanges( ranges );

			assert.isTrue( !!selection.isFake, 'isFake is set' );
			assert.isTrue( selection.isInTable(), 'isInTable is true' );
			assert.isTrue( selection.rev > initialRev, 'Next rev' );
			assert.areSame( ranges.length, selection.getRanges().length, 'Multiple ranges are selected' );
			assert.isNull( selection.getNative(), 'getNative() should be null' );
			assert.isNotNull( selection.getSelectedText(), 'getSelectedText() should not be null' );

			assert.areSame( CKEDITOR.SELECTION_TEXT, selection.getType(), 'Text type selection' );
			assert.isTrue( _getTableElementFromRange( ranges[ 0 ] ).equals( selection.getSelectedElement() ),
				'Selected element equals to the first selected cell' );

			for ( i = 0; i < ranges.length; i++ ) {
				assert.isFalse( ranges[ i ].collapsed, 'Range #' + i + ' is not collapsed' );
			}

			realSelection = editor.getSelection( 1 );

			assert.areSame( 1, realSelection.getRanges().length, 'Real selection has only one range' );

			if ( !isQuirkyEnv ) {
				assert.isTrue( _getTableElementFromRange( ranges[ 0 ] ).equals( realSelection.getSelectedElement() ),
					'Real selected element equals to the first selected cell' );
			}

			clearTableSelection( editor.editable() );
		},

		'test reset fake-selection': function() {
			// Ignores for Edge (#1944).
			if ( CKEDITOR.env.edge ) {
				assert.ignore();
			}

			var editor = this.editor,
				selection = editor.getSelection(),
				ranges;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 0, 1 ] );
			selection.selectRanges( ranges );

			selection.reset();

			assert.isFalse( !!selection.isFake, 'isFake is not set' );

			assert.areSame( 1, selection.getRanges().length, 'Only first range remains selected' );

			if ( !isQuirkyEnv ) {
				assert.isTrue( ranges[ 0 ].getEnclosedNode().equals( selection.getSelectedElement() ),
					'getSelectedElement() equals to the first selected cell' );
			}

			assert.isNotNull( selection.getNative(), 'getNative() should not be null' );

			clearTableSelection( editor.editable() );
		},

		'test fire selectionchange event': function() {
			var editor = this.editor,
				selectionChange = 0,
				selection = editor.getSelection(),
				ranges,
				selectedElement;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			var listener = editor.on( 'selectionChange', function( evt ) {
				selectionChange++;
				selectedElement = evt.data.selection.getSelectedElement();
			} );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 0, 1 ] );
			selection.selectRanges( ranges );

			wait( function() {
				listener.removeListener();

				assert.areSame( 1, selectionChange, 'selectionChange was fired only once' );
				assert.isTrue( _getTableElementFromRange( ranges[ 0 ] ).equals( selectedElement ),
					'getSelectedElement() must be the first selected table cell' );

				clearTableSelection( editor.editable() );
			}, 50 );
		},

		'test isInTable allowPartially test (collapsed range)': function() {
			var editor = this.editor;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'allowPartiallyIssue' ).getHtml() );

			assert.isFalse( editor.getSelection().isInTable(), 'Selection is not in table' );

			clearTableSelection( editor.editable() );
		},

		// (#2945)
		'test selecting ignored element': function() {
			var editor = this.editor,
				selection = editor.getSelection();

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			var table = editor.editable().findOne( 'table' );

			table.data( 'cke-tableselection-ignored', 1 );

			selection.selectElement( table.findOne( 'td' ) );

			assert.areEqual( 0, selection.isFake, 'Selection is not fake' );
			assert.isTrue( selection.isInTable(), 'isInTable is true' );
			assert.isNotNull( selection.getNative(), 'getNative() should be available' );
			assert.isNotNull( selection.getSelectedText(), 'getSelectedText() should not be null' );
		},

		// (#2945)
		'test selecting ignored element (ranges)': function() {
			var editor = this.editor,
				selection = editor.getSelection();

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			var table = editor.editable().findOne( 'table' ),
				ranges = getRangesForCells( editor, table, [ 0, 1 ], true );

			table.data( 'cke-tableselection-ignored', 1 );

			selection.selectRanges( ranges );

			assert.areEqual( 0, selection.isFake, 'Selection is not fake' );
			assert.isTrue( selection.isInTable(), 'isInTable is true' );
			assert.isNotNull( selection.getNative(), 'getNative() should be available' );
			assert.isNotNull( selection.getSelectedText(), 'getSelectedText() should not be null' );
		},

		'test change selection': function() {
			var editor = this.editor,
				ranges;

			bender.tools.setHtmlWithSelection( editor, '<p id="foo">Foo</p>' +
				CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 0, 1 ] );
			editor.getSelection().selectRanges( ranges );

			wait( function() {
				var selectionChange = 0,
					selectedRanges,
					range;

				editor.on( 'selectionChange', function( evt ) {
					selectionChange++;
					selectedRanges = evt.data.selection.getRanges();
				} );

				range = editor.createRange();
				range.setStart( editor.document.getById( 'foo' ), 0 );
				editor.getSelection().selectRanges( [ range ] );

				wait( function() {
					var range = selectedRanges[ 0 ];

					assert.areSame( 1, selectionChange, 'selectionChange was fired only once' );

					range.optimize();
					assert.areSame( editor.document.getById( 'foo' ), range.startContainer );

					clearTableSelection( editor.editable() );
				}, 50 );
			}, 50 );
		},

		'test fake-selection bookmark': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				ranges,
				bookmarks;

			bender.tools.setHtmlWithSelection( editor, '<p id="foo">Foo</p>' +
				CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 0, 3 ] );
			selection.selectRanges( ranges );

			// Bookmark it.
			bookmarks = selection.createBookmarks();

			// Move the selection somewhere else.
			selection.selectElement( editor.document.getById( 'foo' ) );

			assert.isFalse( !!selection.isFake, 'Selection is no longer fake' );

			selection.selectBookmarks( bookmarks );

			// For the unknown reasons, selecting bookmarks modifies original ranges.
			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 0, 1 ] );

			assert.isTrue( !!selection.isFake, 'isFake is set' );

			assert.isTrue( _getTableElementFromRange( ranges[ 0 ] ).equals( selection.getSelectedElement() ),
				'getSelectedElement() must return the first selected table cell' );
			assert.areSame( ranges.length, selection.getRanges().length, 'All ranges selected' );

			clearTableSelection( editor.editable() );
		},

		'test fake-selection bookmark (serializable)': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				ranges,
				table,
				bookmarks;

			bender.tools.setHtmlWithSelection( editor, '<p id="foo">Foo</p>' +
				CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 0, 3 ] );
			selection.selectRanges( ranges );


			// Bookmark it.
			bookmarks = selection.createBookmarks( true );

			// Move the selection somewhere else.
			selection.selectElement( editor.document.getById( 'foo' ) );

			// Replace the table with its clone.
			table = editor.editable().findOne( 'table' );
			table.clone( true, true ).replace( table );

			selection.selectBookmarks( bookmarks );

			assert.isTrue( !!selection.isFake, 'isFake is set' );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 0, 3 ] );

			assert.isTrue( _getTableElementFromRange( ranges[ 0 ] ).equals( selection.getSelectedElement() ),
				'getSelectedElement() must return the first selected table cell' );
			assert.areSame( ranges.length, selection.getRanges().length, 'All ranges selected' );

			clearTableSelection( editor.editable() );
		},

		'test fake-selection bookmark 2': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				ranges,
				bookmarks;

			bender.tools.setHtmlWithSelection( editor, '<p id="foo">Foo</p>' +
				CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 0, 3 ] );
			selection.selectRanges( ranges );

			// Bookmark it.
			bookmarks = selection.createBookmarks2();

			// Move the selection somewhere else.
			selection.selectElement( editor.document.getById( 'foo' ) );

			selection.selectBookmarks( bookmarks );

			assert.isTrue( !!selection.isFake, 'isFake is set' );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 0, 3 ] );

			assert.isTrue( _getTableElementFromRange( ranges[ 0 ] ).equals( selection.getSelectedElement() ),
				'getSelectedElement() must return the first selected table cell' );
			assert.areSame( ranges.length, selection.getRanges().length, 'All ranges selected' );

			clearTableSelection( editor.editable() );
		},

		'test fake-selection bookmark 2 (normalized)': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				ranges,
				bookmarks;

			bender.tools.setHtmlWithSelection( editor, '<p id="foo">Foo</p>' +
				CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 0, 3 ] );
			selection.selectRanges( ranges );

			// Bookmark it.
			bookmarks = selection.createBookmarks2( true );

			// Move the selection somewhere else.
			selection.selectElement( editor.document.getById( 'foo' ) );

			// Replace the editor DOM.
			editor.editable().setHtml( editor.editable().getHtml() );

			selection.selectBookmarks( bookmarks );

			assert.isTrue( !!selection.isFake, 'isFake is set' );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 0, 3 ] );

			assert.isTrue( _getTableElementFromRange( ranges[ 0 ] ).equals( selection.getSelectedElement() ),
				'getSelectedElement() must return the first selected table cell' );
			assert.areSame( ranges.length, selection.getRanges().length, 'All ranges selected' );

			clearTableSelection( editor.editable() );
		},

		'test get text from fake table selection': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				ranges;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 0, 1, 2, 3, 4, 5 ] );

			selection.selectRanges( ranges );

			assert.areSame( 'Cell 1.1\tCell 1.2\tCell 1.3\nCell 2.1\tCell 2.2\tCell 2.3', selection.getSelectedText(),
				'getSelectedText should return text from all selected cells.' );

			clearTableSelection( editor.editable() );
		},

		'test table fake selection does not create undo snapshots': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				ranges;

			bender.tools.setHtmlWithSelection( editor, '<p id="foo">Foo</p>' +
				CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 0, 1 ] );

			editor.resetUndo();
			selection.selectRanges( ranges );

			editor.fire( 'saveSnapshot' );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'undo' ).state, 'Not undoable after making fake selection' );

			// Make a normal selection.
			editor.getSelection().selectElement( editor.document.getById( 'foo' ) );
			editor.fire( 'saveSnapshot' );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'undo' ).state, 'Not undoable after removing fake selection' );

			clearTableSelection( editor.editable() );
		},

		'test table fake selection undo': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				ranges;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 0 ] );

			editor.resetUndo();
			selection.selectRanges( ranges );

			// Execute bold, adding a undo step to the editor.
			editor.execCommand( 'bold' );

			assert.areSame( CKEDITOR.TRISTATE_OFF, editor.getCommand( 'undo' ).state, 'Undoable after bold' );

			// Undo bold, which must restore the fake-selection.
			editor.execCommand( 'undo' );

			// Retrieve the selection again.
			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 0 ] );
			selection = editor.getSelection();

			assert.isTrue( !!selection.isFake, 'isFake is set' );
			assert.isTrue( selection.isInTable(), 'isInTable is true' );
			assert.isTrue( _getTableElementFromRange( ranges[ 0 ] ).equals( selection.getSelectedElement() ),
				'Selected element equals to the first selected cell' );

			editor.fire( 'saveSnapshot' );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'undo' ).state, 'Not undoable after undo' );

			clearTableSelection( editor.editable() );
		},

		'test navigating left inside table fake selection': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				prevented = false,
				ranges,
				range;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );

			selection.selectRanges( ranges );

			// Left arrow.
			editor.editable().fire( 'keydown', getKeyEvent( 37, function() {
				prevented = true;
			} ) );

			assert.isTrue( prevented, 'Default keydown was prevented' );

			assert.isFalse( !!selection.isFake, 'isFake is not set' );
			assert.isFalse( selection.isInTable(), 'isInTable is false' );
			assert.areSame( 1, selection.getRanges().length, 'Only one range is selected' );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );
			range = selection.getRanges()[ 0 ];

			assert.isTrue( !!range.collapsed, 'Range is collapsed' );
			assert.isTrue( _getTableElementFromRange( range ).equals( ranges[ 0 ].getEnclosedNode() ),
				'Selection is in the first cell' );
			assert.areSame( 0, range.startOffset, 'Range is collapsed to the start' );

			clearTableSelection( editor.editable() );
		},

		'test navigating up inside table fake selection': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				prevented = false,
				ranges,
				range;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );

			selection.selectRanges( ranges );

			// Up arrow.
			editor.editable().fire( 'keydown', getKeyEvent( 38, function() {
				prevented = true;
			} ) );

			assert.isTrue( prevented, 'Default keydown was prevented' );

			assert.isFalse( !!selection.isFake, 'isFake is not set' );
			assert.isFalse( selection.isInTable(), 'isInTable is false' );
			assert.areSame( 1, selection.getRanges().length, 'Only one range is selected' );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );
			range = selection.getRanges()[ 0 ];

			assert.isTrue( !!range.collapsed, 'Range is collapsed' );
			assert.isTrue( _getTableElementFromRange( range ).equals( ranges[ 0 ].getEnclosedNode() ),
				'Selection is in the first cell' );
			assert.areSame( 0, range.startOffset, 'Range is collapsed to the start' );

			clearTableSelection( editor.editable() );
		},

		'test navigating right inside table fake selection': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				prevented = false,
				ranges,
				range;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );

			selection.selectRanges( ranges );

			// Right arrow.
			editor.editable().fire( 'keydown', getKeyEvent( 39, function() {
				prevented = true;
			} ) );

			assert.isTrue( prevented, 'Default keydown was prevented' );

			assert.isFalse( !!selection.isFake, 'isFake is not set' );
			assert.isFalse( selection.isInTable(), 'isInTable is false' );
			assert.areSame( 1, selection.getRanges().length, 'Only one range is selected' );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );
			range = selection.getRanges()[ 0 ];

			assert.isTrue( !!range.collapsed, 'Range is collapsed' );
			assert.isTrue( _getTableElementFromRange( range ).equals( ranges[ 1 ].getEnclosedNode() ),
				'Selection is in the last cell' );
			assert.isTrue( range.startOffset > 0, 'Range is collapsed to the end' );

			clearTableSelection( editor.editable() );
		},

		'test navigating down inside table fake selection': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				prevented = false,
				ranges,
				range;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );

			selection.selectRanges( ranges );

			// Down arrow.
			editor.editable().fire( 'keydown', getKeyEvent( 40, function() {
				prevented = true;
			} ) );

			assert.isTrue( prevented, 'Default keydown was prevented' );

			assert.isFalse( !!selection.isFake, 'isFake is not set' );
			assert.isFalse( selection.isInTable(), 'isInTable is false' );
			assert.areSame( 1, selection.getRanges().length, 'Only one range is selected' );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );
			range = selection.getRanges()[ 0 ];

			assert.isTrue( !!range.collapsed, 'Range is collapsed' );
			assert.isTrue( _getTableElementFromRange( range ).equals( ranges[ 1 ].getEnclosedNode() ),
				'Selection is in the last cell' );
			assert.isTrue( range.startOffset > 0, 'Range is collapsed to the end' );

			clearTableSelection( editor.editable() );
		},

		'test overwriting content in table fake selection via keypress': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				prevented = false,
				ranges;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );

			selection.selectRanges( ranges );

			// Random keypress.
			editor.editable().fire( 'keypress', getKeyEvent( 65, function() {
				prevented = true;
			} ) );

			assert.isFalse( prevented, 'Default keypress was not prevented' );

			assert.isFalse( !!selection.isFake, 'isFake is not set' );
			assert.isFalse( selection.isInTable(), 'isInTable is false' );
			assert.areSame( 1, selection.getRanges().length, 'Only one range is selected' );

			assert.beautified.html( CKEDITOR.document.getById( 'contentOverwritingExpected' ).getHtml(),
					this.editorBot.htmlWithSelection() );

			clearTableSelection( editor.editable() );
		},

		'test not overwriting content in table fake selection via keypress when no character is produced': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				prevented = false,
				ranges,
				i;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );

			selection.selectRanges( ranges );

			// Random keypress.
			editor.editable().fire( 'keypress', getKeyEvent( { keyCode: 113, charCode: 0 }, function() {
				prevented = true;
			} ) );

			assert.isFalse( prevented, 'Default keypress was not prevented' );

			assert.isTrue( !!selection.isFake, 'isFake is set' );
			assert.isTrue( selection.isInTable(), 'isInTable is true' );
			assert.areSame( 2, selection.getRanges().length, 'All ranges are selected' );

			// Check if the content is actually ovewritten.
			for ( i = 0; i < ranges.length; i++ ) {
				if ( bender.tools.compatHtml( _getTableElementFromRange( ranges[ i ] ).getHtml(), 0, 0, 1 ).length === 0 ) {
					assert.fail( 'Content was overwritten' );
				}
			}

			clearTableSelection( editor.editable() );
		},

		'test not overwriting content in table fake selection via keypress when Ctrl is pressed': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				prevented = false,
				ranges,
				i;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );

			selection.selectRanges( ranges );

			// Random keypress.
			editor.editable().fire( 'keypress', getKeyEvent( { keyCode: 65, charCode: 65, ctrlKey: true }, function() {
				prevented = true;
			} ) );

			assert.isFalse( prevented, 'Default keypress was not prevented' );

			assert.isTrue( !!selection.isFake, 'isFake is set' );
			assert.isTrue( selection.isInTable(), 'isInTable is true' );
			assert.areSame( 2, selection.getRanges().length, 'All ranges are selected' );

			// Check if the content is actually ovewritten.
			for ( i = 0; i < ranges.length; i++ ) {
				if ( bender.tools.compatHtml( _getTableElementFromRange( ranges[ i ] ).getHtml(), 0, 0, 1 ).length === 0 ) {
					assert.fail( 'Content was overwritten' );
				}
			}

			clearTableSelection( editor.editable() );
		},

		'test simulating opening context menu in the same table': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				realSelection,
				ranges,
				range;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );

			selection.selectRanges( ranges );

			// Switch off displaying errors as changing real selection generates couple of warnings.
			this.setVerbosity( CKEDITOR.VERBOSITY_ERROR );

			realSelection = editor.getSelection( 1 );
			range = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 2 ] )[ 0 ];

			range.collapse();
			realSelection.selectRanges( [ range ] );

			editor.editable().once( 'selectionchange', function() {
				resume( function() {
					assert.isTrue( !!selection.isFake, 'isFake is set' );
					assert.isTrue( selection.isInTable(), 'isInTable is true' );
					assert.areSame( ranges.length, selection.getRanges().length, 'Multiple ranges are selected' );
					assert.isNull( selection.getNative(), 'getNative() should be null' );
					assert.isNotNull( selection.getSelectedText(), 'getSelectedText() should not be null' );

					assert.areSame( CKEDITOR.SELECTION_TEXT, selection.getType(), 'Text type selection' );
					assert.isTrue( _getTableElementFromRange( ranges[ 0 ] ).equals( selection.getSelectedElement() ),
						'Selected element equals to the first selected cell' );

					clearTableSelection( editor.editable() );
				} );
			} );

			editor.editable().fire( 'selectionchange' );
			wait();
		},

		'test simulating opening context menu in the nested table': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				realSelection,
				ranges,
				range;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'nestedTable' ).getHtml() );

			// Puts the fake selection on a sixth cell (including both tables), so that's the last cell of outer table.
			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 5 ] );

			selection.selectRanges( ranges );

			// Switch off displaying errors as changing real selection generates couple of warnings.
			this.setVerbosity( CKEDITOR.VERBOSITY_ERROR );

			realSelection = editor.getSelection( 1 );
			range = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1 ] )[ 0 ];

			range.collapse();
			realSelection.selectRanges( [ range ] );

			editor.editable().once( 'selectionchange', function() {
				resume( function() {
					assert.isTrue( !!selection.isFake, 'isFake is set' );
					assert.isTrue( selection.isInTable(), 'isInTable is true' );
					assert.areSame( ranges.length, selection.getRanges().length, 'Multiple ranges are selected' );
					assert.isNull( selection.getNative(), 'getNative() should be null' );
					assert.isNotNull( selection.getSelectedText(), 'getSelectedText() should not be null' );

					assert.areSame( CKEDITOR.SELECTION_TEXT, selection.getType(), 'Text type selection' );
					assert.isTrue( _getTableElementFromRange( ranges[ 0 ] ).equals( selection.getSelectedElement() ),
						'Selected element equals to the first selected cell' );

					clearTableSelection( editor.editable() );
				} );
			} );

			editor.editable().fire( 'selectionchange' );
			wait();
		},

		'test simulating opening context menu in the different table': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				realSelection,
				ranges,
				range;

			bender.tools.setHtmlWithSelection( editor,
				CKEDITOR.tools.repeat( CKEDITOR.document.getById( 'simpleTable' ).getHtml(), 2 ) );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );

			selection.selectRanges( ranges );

			// Switch off displaying errors as changing real selection generates couple of warnings.
			this.setVerbosity( CKEDITOR.VERBOSITY_ERROR );

			realSelection = editor.getSelection( 1 );
			range = getRangesForCells( editor, editor.editable().find( 'table' ).getItem( 1 ), [ 2 ] )[ 0 ];

			range.collapse();
			realSelection.selectRanges( [ range ] );

			editor.editable().once( 'selectionchange', function() {
				resume( function() {
					assert.isFalse( !!selection.isFake, 'isFake is not set' );
					assert.isFalse( selection.isInTable(), 'isInTable is false' );
					assert.areSame( 1, selection.getRanges().length, 'One range are selected' );
					assert.isNotNull( selection.getNative(), 'getNative() should not be null' );

					assert.isTrue( !!selection.getRanges()[ 0 ].collapsed, 'Selection is collapsed' );

					clearTableSelection( editor.editable() );
				} );
			} );

			editor.editable().fire( 'selectionchange' );
			wait();
		},

		'test simulating opening context menu in the paragraph': function() {
			var editor = this.editor,
				selection = editor.getSelection(),
				realSelection,
				ranges,
				range;

			bender.tools.setHtmlWithSelection( editor, '<p>Foo</p>' + CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );

			selection.selectRanges( ranges );

			// Switch off displaying errors as changing real selection generates couple of warnings.
			this.setVerbosity( CKEDITOR.VERBOSITY_ERROR );

			realSelection = editor.getSelection( 1 );
			range = editor.createRange();

			range.selectNodeContents( editor.editable().findOne( 'p' ) );

			realSelection.selectRanges( [ range ] );

			editor.editable().once( 'selectionchange', function() {
				resume( function() {
					assert.isFalse( !!selection.isFake, 'isFake is not set' );
					assert.isFalse( selection.isInTable(), 'isInTable is false' );
					assert.areSame( 1, selection.getRanges().length, 'One range are selected' );
					assert.isNotNull( selection.getNative(), 'getNative() should not be null' );

					clearTableSelection( editor.editable() );
				} );
			} );

			editor.editable().fire( 'selectionchange' );
			wait();
		},

		'test simulating opening context menu in the same table (WebKit, macOS)': function() {
			// Webkits on macOS contrary to other browsers will collapse the selection and anchor it in a text node.
			if ( !CKEDITOR.env.webkit ) {
				assert.ignore();
			}

			var editor = this.editor,
				selection = editor.getSelection(),
				realSelection,
				ranges,
				range,
				txtNode;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			// First mark the selection in our original table.
			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );
			selection.selectRanges( ranges );

			// Now imitate context menu click, which essentially puts collapsed selection in text node.
			realSelection = editor.getSelection( 1 );
			range = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 2 ] )[ 0 ];
			txtNode = getTextNodeFromRange( range );


			// Switch off displaying errors as changing real selection generates couple of warnings.
			this.setVerbosity( CKEDITOR.VERBOSITY_ERROR );

			range.setStart( txtNode, 0 );
			range.setEnd( txtNode, 2 );
			realSelection.selectRanges( [ range ] );

			editor.editable().once( 'selectionchange', function() {
				resume( function() {
					assert.isTrue( !!selection.isFake, 'isFake is set' );
					assert.isTrue( selection.isInTable(), 'isInTable is true' );
					assert.areSame( ranges.length, selection.getRanges().length, 'Multiple ranges are selected' );
					assert.isNull( selection.getNative(), 'getNative() should be null' );
					assert.isNotNull( selection.getSelectedText(), 'getSelectedText() should not be null' );

					assert.areSame( CKEDITOR.SELECTION_TEXT, selection.getType(), 'Text type selection' );
					assert.isTrue( _getTableElementFromRange( ranges[ 0 ] ).equals( selection.getSelectedElement() ),
						'Selected element equals to the first selected cell' );

					clearTableSelection( editor.editable() );
				} );
			} );

			editor.editable().fire( 'selectionchange' );
			wait();
		},

		'test simulating opening context menu in the nested table (WebKit, macOS)': function() {
			// Webkits on macOS contrary to other browsers will collapse the selection and anchor it in a text node.
			if ( !CKEDITOR.env.webkit ) {
				assert.ignore();
			}

			var editor = this.editor,
				selection = editor.getSelection(),
				realSelection,
				ranges,
				range,
				txtNode;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'nestedTable' ).getHtml() );

			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 5 ] );
			selection.selectRanges( ranges );

			// Now imitate context menu click, which essentially puts collapsed selection in text node.
			realSelection = editor.getSelection( 1 );
			range = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1 ] )[ 0 ];
			txtNode = getTextNodeFromRange( range );


			// Switch off displaying errors as changing real selection generates couple of warnings.
			this.setVerbosity( CKEDITOR.VERBOSITY_ERROR );

			range.setStart( txtNode, 0 );
			range.setEnd( txtNode, 2 );
			realSelection.selectRanges( [ range ] );

			editor.editable().once( 'selectionchange', function() {
				resume( function() {
					assert.isTrue( !!selection.isFake, 'isFake is set' );
					assert.isTrue( selection.isInTable(), 'isInTable is true' );
					assert.areSame( ranges.length, selection.getRanges().length, 'Multiple ranges are selected' );
					assert.isNull( selection.getNative(), 'getNative() should be null' );
					assert.isNotNull( selection.getSelectedText(), 'getSelectedText() should not be null' );

					assert.areSame( CKEDITOR.SELECTION_TEXT, selection.getType(), 'Text type selection' );
					assert.isTrue( _getTableElementFromRange( ranges[ 0 ] ).equals( selection.getSelectedElement() ),
						'Selected element equals to the first selected cell' );

					clearTableSelection( editor.editable() );
				} );
			} );

			editor.editable().fire( 'selectionchange' );
			wait();
		},

		'test simulating opening context menu in the different table (WebKit, macOS)': function() {
			// Webkits on macOS contrary to other browsers will collapse the selection and anchor it in a text node.
			if ( !CKEDITOR.env.webkit ) {
				assert.ignore();
			}

			var editor = this.editor,
				selection = editor.getSelection(),
				realSelection,
				ranges,
				range,
				txtNode;

			bender.tools.setHtmlWithSelection( editor,
				CKEDITOR.tools.repeat( CKEDITOR.document.getById( 'simpleTable' ).getHtml(), 2 ) );

			// First mark the selection in our original table.
			ranges = getRangesForCells( editor, editor.editable().findOne( 'table' ), [ 1, 4 ] );
			selection.selectRanges( ranges );

			// Now imitate context menu click, which essentially puts collapsed selection in text node.
			realSelection = editor.getSelection( 1 );
			range = getRangesForCells( editor, editor.editable().find( 'table' ).getItem( 1 ), [ 2 ] )[ 0 ];
			txtNode = getTextNodeFromRange( range );

			// Switch off displaying errors as changing real selection generates couple of warnings.
			this.setVerbosity( CKEDITOR.VERBOSITY_ERROR );

			range.setStart( txtNode, 0 );
			range.setEnd( txtNode, 2 );
			realSelection.selectRanges( [ range ] );

			editor.editable().once( 'selectionchange', function() {
				resume( function() {
					assert.isFalse( !!selection.isFake, 'isFake is not set' );
					assert.isFalse( selection.isInTable(), 'isInTable is false' );
					assert.areSame( 1, selection.getRanges().length, 'One range are selected' );
					assert.isNotNull( selection.getNative(), 'getNative() should not be null' );

					clearTableSelection( editor.editable() );
				} );
			} );

			editor.editable().fire( 'selectionchange' );
			wait();
		},

		setVerbosity: function( newVerbosity ) {
			this._oldVerbosity = CKEDITOR.verbosity;
			CKEDITOR.verbosity = newVerbosity;
		}
	};

	bender.test( tests );
}() );
