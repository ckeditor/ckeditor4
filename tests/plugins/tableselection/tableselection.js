/* bender-tags: tableselection */
/* bender-ckeditor-plugins: tableselection, clipboard */
/* bender-ckeditor-remove-plugins: undo */
/* bender-include: _helpers/tableselection.js */
/* global tableSelectionHelpers, mockMouseSelection */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		inline: {
			creator: 'inline'
		}
	};

	function prepareFocusFrame() {
		// prepare focus iframe
		var frame = CKEDITOR.document.findOne( '#focusIframe' );
		frame.getFrameDocument().write( '<div contenteditable="true">foo</div>' );
	}

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},
		// (#tp2247)
		'test overriding cell background': function( editor ) {
			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'cellBackground' ).getValue() );

			var cells = editor.editable().find( 'td' ),
				ranges = tableSelectionHelpers.getRangesForCells( editor, [ 0, 1 ] ),
				// Different browsers produce various formats.
				acceptableValues = [ 'rgb(0, 118, 203)', '#0076cb' ],
				acceptableBlurValues = [ 'rgb(169, 169, 169)', '#a9a9a9', 'darkgray' ],
				blurColor;

			editor.getSelection().selectRanges( ranges );

			arrayAssert.contains(
				cells.getItem( 1 ).getComputedStyle( 'background-color' ).toLowerCase(),
				acceptableValues,
				'Computed background is a known good color'
			);

			// Focus other textarea to blur the editor.
			CKEDITOR.document.getById( 'cellBackground' ).focus();

			blurColor = cells.getItem( 1 ).getComputedStyle( 'background-color' ).toLowerCase();

			// It's important to put focus back to the editor, in case if subsequent tests expect it.
			editor.focus();

			arrayAssert.contains(
				blurColor,
				acceptableBlurValues,
				'Computed blur background is a known color'
			);
		},

		'test refocusing the editor': function( editor ) {
			var ranges,
				contentCells;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			contentCells = editor.editable().find( 'td' );

			ranges = tableSelectionHelpers.getRangesForCells( editor, [ 1, 4 ] );
			editor.getSelection().selectRanges( ranges );

			// Now, the we want to move the focus into a nested iframe, so that we guarantee putting focus into another document. This will
			// force blur event inside of the editor.
			CKEDITOR.document.findOne( '#focusIframe' ).getFrameDocument().findOne( 'div' ).focus();

			editor.focus();
			// Make sure inline editable is focused.
			editor.editable().$.focus();

			// Now time to assert.
			ranges = editor.getSelection().getRanges();

			assert.areSame( 2, ranges.length, 'Range count' );
			assert.isTrue( ranges[ 0 ].getEnclosedNode().equals( contentCells.getItem( 1 ) ), 'Range[ 0 ] encloses correct element' );
			assert.isTrue( ranges[ 1 ].getEnclosedNode().equals( contentCells.getItem( 4 ) ), 'Range[ 1 ] encloses correct element' );
			assert.areSame( 1, editor.getSelection().isFake, 'Selection remains faked' );
		},

		'test simulating merge cells from context menu ': function( editor ) {
			// Ignores for Edge (#1944).
			if ( CKEDITOR.env.edge ) {
				assert.ignore();
			}

			var selection = editor.getSelection(),
				expected = '<table><tbody><tr><td>Cell 1.1</td><td rowspan="2">Cell 1.2<br />Cell 2.2</td>' +
					'<td>Cell 1.3</td></tr><tr><td>Cell 2.1</td><td>Cell 2.3</td></tr></tbody></table>',
				realSelection,
				ranges,
				range;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			ranges = tableSelectionHelpers.getRangesForCells( editor, [ 1, 4 ] );

			selection.selectRanges( ranges );

			// Stub reset method to prevent overwriting fake selection on selectRanges.
			sinon.stub( CKEDITOR.dom.selection.prototype, 'reset' );

			// We must restore this method before any other selectionchange listeners
			// to be sure that selectionchange works as intended.
			editor.editable().once( 'selectionchange', function() {
				CKEDITOR.dom.selection.prototype.reset.restore();
			}, null, null, -2 );

			realSelection = editor.getSelection( 1 );
			range = tableSelectionHelpers.getRangesForCells( editor, [ 2 ] ) [ 0 ];

			range.collapse();
			realSelection.selectRanges( [ range ] );

			editor.editable().fire( 'contextmenu', new CKEDITOR.dom.event( {
				target: editor.editable().find( 'table td' ).getItem( 2 ).$
			} ) );

			editor.once( 'menuShow', function( evt ) {
				resume( function() {
					evt.data[ 0 ].focus();

					editor.execCommand( 'cellMerge' );

					var selection = editor.getSelection(),
						rangesAfterCommand = selection.getRanges(),
						expectedSelectionHolder = editor.editable().find( 'td' ).getItem( 1 );

					assert.areSame( 1, rangesAfterCommand.length, 'Range count' );
					assert.isTrue( !!selection.isFake, 'Selection is fake' );
					assert.isTrue( selection.isInTable(), 'Selection is in table' );
					assert.areSame( rangesAfterCommand[ 0 ]._getTableElement(), expectedSelectionHolder, 'Correct cell is selected' );

					assert.areSame( expected, editor.getData(), 'Editor data' );
				} );
			} );

			wait();
		},

		// #493
		'test simulating mouse events while scrolling and selecting cells in nested table': function( editor ) {
			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'nestedScroll' ).getHtml() );
			var cells = editor.editable().find( 'td' );

			mockMouseSelection( editor, [ cells.getItem( 1 ), cells.getItem( 3 ), cells.getItem( 8 ) ], function() {
				assert.pass();
			} );
		},

		// (#2945)
		'test simulating mouse events while the table is ignored': function( editor ) {
			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			var table = editor.editable().findOne( 'table' ),
				cells = table.find( 'td' );

			table.data( 'cke-tableselection-ignored', 1 );

			mockMouseSelection( editor, [ cells.getItem( 1 ), cells.getItem( 2 ) ], function() {
				var selection = editor.getSelection();

				assert.isFalse( selection.isInTable(), 'Selection is not in table' );
				assert.isFalse( !!selection.isFake, 'Selection is not faked' );
			} );
		},

		// (#2003)
		'test right-click in cell with empty paragraph': function( editor, bot ) {
			if ( !CKEDITOR.env.gecko ) {
				assert.ignore();
			}
			bot.setData( CKEDITOR.document.getById( 'emptyParagraph' ).getHtml(), function() {
				var cells = editor.editable().find( 'td' ).toArray(),
					ranges = tableSelectionHelpers.getRangesForCells( editor, [ 0, 1, 2, 3 ] ),
					paragraph = cells[ 0 ].findOne( 'p' ),
					selection = editor.getSelection();

				selection.selectRanges( ranges );
				ranges = selection.getRanges();

				editor.editable().fire( 'mouseup', {
					getTarget: function() {
						return paragraph;
					},
					$: {
						button: 2
					}
				} );

				assert.areSame( ranges, editor.getSelection().getRanges(), 'Selected ranges should be unchanged' );
			} );
		},

		// (#1489)
		'test random keys are not removing readonly selection': function( editor ) {
			var selection = editor.getSelection(),
				editable = editor.editable(),
				table = CKEDITOR.document.getById( 'simpleTable' ).getHtml();

			editor.setReadOnly( true );

			bender.tools.setHtmlWithSelection( editor, table );

			var row = editor.editable().findOne( 'tr' );
			selection.selectElement( row );

			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 8 } ) ); // backspace
			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 46 } ) ); // delete

			editable.fire( 'keypress', new CKEDITOR.dom.event( { keyCode: 65, charCode: 65 } ) ); // `a`
			editable.fire( 'keypress', new CKEDITOR.dom.event( { keyCode: 93, charCode: 93 } ) ); // `t`

			editor.setReadOnly( false );

			assert.areSame( bender.tools.compatHtml( table ), editor.getData(), 'Editor data' );
		},

		// (#2945)
		'test drag handler event is not prevented for ignored element': function( editor ) {
			var editable = editor.editable(),
				preventDefaultCallCount = 0;

			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			var table = editable.findOne( 'table' ),
				evt = {
					getTarget: function() {
						return table.findOne( 'td' );
					},
					preventDefault: function() {
						preventDefaultCallCount++;
					}
				};

			table.data( 'cke-tableselection-ignored', 1 );

			var result = editable.fire( 'dragstart', evt );

			assert.areEqual( 0, preventDefaultCallCount, 'Event should not be prevented' );
			assert.isTrue( Boolean( result ), 'Event should not be canceled' );
		},

		// (#2945)
		'test handling copy&cut events for ignored element': function( editor ) {
			if ( CKEDITOR.plugins.clipboard.isCustomCopyCutSupported ) {
				assert.ignore();
			}

			testTableCopying( 'copy' );

			// Give some time `copy` event to finish to avoid concurrency issue.
			setTimeout( function() {
				resume( function() {
					testTableCopying( 'cut' );
				} );
			}, 100 );

			wait();

			function testTableCopying( eventName ) {
				var editable = editor.editable();

				bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

				var table = editable.findOne( 'table' ),
					cell = table.findOne( 'td' ),
					evt = {
						getTarget: function() {
							return cell;
						}
					};

				table.data( 'cke-tableselection-ignored', 1 );

				editor.getSelection().selectElement( cell );

				editable.fire( eventName, evt );
				assert.isNull( editable.findOne( '#cke_table_copybin' ), eventName + ' event should be ignored' );
			}
		},

		// (#2423)
		'test dialog model for table properties': function( editor, bot ) {
			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			var ranges = tableSelectionHelpers.getRangesForCells( editor, [ 1, 4 ] ),
				table = editor.editable().findOne( 'table' );

			editor.getSelection().selectRanges( ranges );

			bot.dialog( 'tableProperties', function( dialog ) {
				assert.areEqual( table, dialog.getModel( editor ) );
				assert.areEqual( CKEDITOR.dialog.EDITING_MODE, dialog.getMode( editor ) );

				dialog.hide();
			} );
		},

		// (#2423)
		'test dialog model for table': function( editor, bot ) {
			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			var ranges = tableSelectionHelpers.getRangesForCells( editor, [ 1, 4 ] );

			editor.getSelection().selectRanges( ranges );

			bot.dialog( 'table', function( dialog ) {
				assert.isNull( dialog.getModel( editor ) );
				assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode( editor ) );

				dialog.hide();
			} );
		},

		// (#2423)
		'test dialog model for cell properties': function( editor, bot ) {
			bender.tools.setHtmlWithSelection( editor, CKEDITOR.document.getById( 'simpleTable' ).getHtml() );

			var ranges = tableSelectionHelpers.getRangesForCells( editor, [ 1, 4 ] );

			editor.getSelection().selectRanges( ranges );

			bot.dialog( 'cellProperties', function( dialog ) {
				var cells = CKEDITOR.plugins.tabletools.getSelectedCells( editor.getSelection() ),
					model = dialog.getModel( editor );

				for ( var i = 0; i < cells.length; i++ ) {
					assert.areEqual( cells[ i ], model[ i ], 'Cells at index "' + i + '" should be equal' );
				}

				assert.areEqual( CKEDITOR.dialog.EDITING_MODE, dialog.getMode( editor ) );

				dialog.hide();
			} );
		},

	};

	// Prepare focus iframe before starting tests.
	prepareFocusFrame();

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();
