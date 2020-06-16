/* exported tableSelectionHelpers, createPasteTestCase, doCommandTest, mockMouseEventForCell, mockMouseSelection */

( function() {
	'use strict';

	window.tableSelectionHelpers = {
		getRangesForCells: function( editor, cellsIndexes ) {
			var ranges = [],
				cells = editor.editable().find( 'td, th' ),
				range,
				cell,
				i;

			for ( i = 0; i < cellsIndexes.length; i++ ) {
				range = editor.createRange();
				cell = cells.getItem( cellsIndexes[ i ] );

				range.setStartBefore( cell );
				range.setEndAfter( cell );

				ranges.push( range );
			}

			return ranges;
		},

		/*
		 * Adds a class to selected cells in editable, so that it can be compared in assertions.
		 *
		 * @param {CKEDITOR.dom.range} ranges[] Ranges which cells should be marked.
		 * @param {boolean} [addSelected] Whether to apply `selected` class instead `cke_marked` to the selected cells.
		 */
		markCells: function( ranges, addSelected ) {
			var i;

			for ( i = 0; i < ranges.length; i++ ) {
				ranges[ i ]._getTableElement().addClass( addSelected ? 'selected' : 'cke_marked' );
			}
		}
	};

	function shrinkSelections( editor ) {
		// Shrinks each range into it's inner element, so that range markers are not outside `td` elem.
		var ranges = editor.getSelection().getRanges(),
			i;

		for ( i = 0; i < ranges.length; i++ ) {
			ranges[ i ].shrink( CKEDITOR.SHRINK_TEXT, false );
		}
	}

	/*
	 * Returns a function that will set editor's content to fixtureId, and will emulate paste
	 * of pasteFixtureId into it.
	 */
	window.createPasteTestCase = function( fixtureId, pasteFixtureId ) {
		return function( editor, bot ) {
			bender.tools.testInputOut( fixtureId, function( source, expected ) {
				editor.once( 'afterPaste', function() {
					resume( function() {
						shrinkSelections( editor );
						bender.assert.beautified.html( expected, bender.tools.getHtmlWithSelection( editor ) );
					} );
				}, null, null, 999 );

				bot.setHtmlWithSelection( source );

				// Use clone, so that pasted table does not have an ID.
				bender.tools.emulatePaste( editor, CKEDITOR.document.getById( pasteFixtureId ).clone( true ).getOuterHtml() );

				wait();
			} );
		};
	};

	/*
	 *
	 * @param {Object} bot Editor bot object.
	 * @param {String/Function} action If string: editor command name to be executed. If string simply a function to be
	 * called before the assertion.
	 * @param {Object} options
	 * @param {String} options.case **Required** - id of element provided to `bender.tools.testInputOut`.
	 * @param {Number[]} [options.cells] Indexes of cells to be selected before executing `action`.
	 * @param {Boolean} [options.markCells] Whether selected cells should get `'selected'` class in the output.
	 * @param {Function} [options.customCheck] Custom assertion. Gets editor as an argument.
	 * @param {Boolean} [options.skipCheckingSelection] If `true` no selection will be chekced.
	 */
	window.doCommandTest = function( bot, action, options ) {
		var editor = bot.editor,
			ranges = [],
			output,
			afterRanges,
			i;

		bender.tools.testInputOut( options[ 'case' ], function( source, expected ) {
			bot.setHtmlWithSelection( source );

			if ( options.cells ) {
				ranges = window.tableSelectionHelpers.getRangesForCells( editor, options.cells );
				editor.getSelection().selectRanges( ranges );
				window.tableSelectionHelpers.markCells( ranges );
			}

			if ( typeof action == 'string' ) {
				bot.execCommand( action );
			} else {
				action();
				ranges = editor.getSelection().getRanges();
			}

			if ( options.markCells ) {
				// Mark selected cells to be able later to check if new selection
				// is containing the appropriate cells.
				window.tableSelectionHelpers.markCells( ranges, options.markCells );
			}

			output = bot.getData( true );
			output = output.replace( /\u00a0/g, '&nbsp;' );
			assert.beautified.html( expected, output );

			if ( options.customCheck ) {
				options.customCheck( editor );
			} else if ( !options.skipCheckingSelection ) {
				afterRanges = editor.getSelection().getRanges();
				assert.isTrue( !!editor.getSelection().isFake, 'selection after is fake' );
				assert.isTrue( editor.getSelection().isInTable(), 'selection after is in table' );

				if ( typeof action != 'string' || action.toLowerCase().indexOf( 'merge' ) === -1 ) {
					assert.areSame( ranges.length, afterRanges.length, 'appropriate number of ranges is selected' );

					for ( i = 0; i < ranges.length; i++ ) {
						assert.isTrue( afterRanges[ i ]._getTableElement().hasClass( 'cke_marked' ),
							'appropriate ranges are selected' );
					}
				} else {
					assert.areSame( 1, afterRanges.length, 'appropriate number of ranges is selected' );
				}
			}
		} );
	};

	/*
	 * @param {CKEDITOR.editor} editor Editor's instance.
	 * @param {String} type Event's type.
	 * @param {CKEDITOR.dom.element} cell Cell that is a target of the event.
	 * @param {Function} callback
	 */
	window.mockMouseEventForCell = function( editor, type, cell, callback ) {

		var host = editor.editable().isInline() ? editor.editable() : editor.document,
			event = {
				getTarget: function() {
					return cell;
				},

				preventDefault: function() {
					// noop
				},

				$: {
					button: 0,

					// We need these because on build version magicline plugin
					// also listen on 'mousemove'.
					clientX: 0,
					clientY: 0
				}
			};

		host.once( type, function() {
			resume( callback );
		} );

		host.fire( type, event );
		wait();
	};

	/*
	 * @param {CKEDITOR.editor} editor Editor's instance.
	 * @param {Array} cells Cells that should be selected. The first one is used as mousedown target,
	 * the last as mousemove and mouseup target, others as mousemove targets.
	 * @param {Function} callback
	 */
	window.mockMouseSelection = function( editor, cells, callback ) {
		function handler() {
			var cell = cells.shift();

			if ( cells.length > 0 ) {
				window.mockMouseEventForCell( editor, 'mousemove', cell, handler );
			} else {
				window.mockMouseEventForCell( editor, 'mousemove', cell, function() {
					window.mockMouseEventForCell( editor, 'mouseup', cell, callback );
				} );
			}
		}

		window.mockMouseEventForCell( editor, 'mousedown', cells.shift(), handler );
	};
} )();
