/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar, quicktable */

( function() {
	'use strict';

	var sandbox = sinon.sandbox.create(),
		commandSpy = sandbox.spy(),
		insertSpy = sandbox.spy();

	bender.editor = {
		name: name,
		config: {
			on: {
				pluginsLoaded: function( evt ) {
					var editor = evt.editor;

					editor._.quicktable = new CKEDITOR.plugins.quicktable( editor );

					editor._.quicktable.addButton( 'Test', {
						title: 'test title',
						label: 'test label',
						insert: insertSpy,
						command: 'testcommand'
					} );

					editor.addCommand( 'testcommand', {
						exec: commandSpy
					} );
				}
			}
		}
	};

	bender.test( {
		tearDown: function() {
			sandbox.reset();
		},

		'test mouseover selection (0 x 0)': testMouseoverSelection( 0, 0 ),
		'test mouseover selection (9 x 9)': testMouseoverSelection( 9, 9 ),
		'test mouseover selection (3 x 5)': testMouseoverSelection( 3, 5 ),
		'test mouseover selection (7 x 8)': testMouseoverSelection( 7, 8 ),
		'test mouseover selection (6 x 3)': testMouseoverSelection( 6, 3 ),

		'test insertion': function() {
			var editor = this.editor,
				quicktable = editor._.quicktable;

			openPanel( editor );

			var target = simulateMouseOver( quicktable, 3, 5 );

			quicktable.grid.once( 'click', function() {
				resume( function() {
					// Note that the number of rows and cols should be +1 relative to coords.
					assert.isTrue( insertSpy.calledWith( editor, 4, 6 ),
						'Insertion function should be called with correct arguments' );
				} );
			} );

			quicktable.grid.fire( 'click', new CKEDITOR.dom.event( {
				target: target.$
			} ) );

			wait();
		},

		'test command button': function() {
			var editor = this.editor,
				quicktable = editor._.quicktable;

			openPanel( editor );

			quicktable.block.element.findOne( '.cke_quicktable_button' ).fire( 'click' );

			assert.isTrue( commandSpy.calledOnce );
		}
	} );

	function testMouseoverSelection( x, y ) {
		return function() {
			var editor = this.editor,
				quicktable = editor._.quicktable;

			openPanel( editor );

			quicktable.grid.once( 'mouseover', function() {
				resume( function() {
					assertSelection( quicktable, x, y );
				} );
			} );

			simulateMouseOver( quicktable, x, y );
			wait();
		};
	}

	function openPanel( editor ) {
		editor.ui.get( 'Test' ).click( editor );
	}

	function simulateMouseOver( quicktable, x, y ) {
		var cells = getCellsMatrix( quicktable ),
			target = cells[ x ][ y ];

		quicktable.grid.fire( 'mouseover', new CKEDITOR.dom.event( {
			target: target.$
		} ) );

		return target;
	}

	function assertSelection( quickTable, x, y ) {
		var cells = getCellsMatrix( quickTable );

		for ( var i = 0; i <= x; i++ ) {
			for ( var j = 0; j <= y; j++ ) {
				assert.isTrue( cells[ i ][ j ].hasClass( 'cke_quicktable_selected' ),
				'Cell at ' + i + ' x ' + j + ' should be selected' );
			}
		}
	}

	function getCellsMatrix( quicktable ) {
		var cells = quicktable.block.element.find( '.cke_quicktable_cell' ).toArray();

		return CKEDITOR.tools.array.reduce( cells, function( acc, cell, index ) {
			var row = acc[ acc.length - 1 ];

			if ( ( index % quicktable.gridSize ) == 0 ) {
				row = [];
				acc.push( row );
			}

			row.push( cell );
			return acc;
		}, [] );
	}
} )();
