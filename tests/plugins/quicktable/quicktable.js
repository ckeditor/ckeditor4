/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar, quicktable */

( function() {
	'use strict';

	var sandbox = sinon.sandbox.create();

	bender.editors = {
		simple: createEditorConfig( 'simple' )
	};

	bender.test( {
		tearDown: function() {
			sandbox.reset();
		},

		'test mouseover selection (0 x 0)': testMouseoverSelection( 'simple', 0, 0 ),
		'test mouseover selection (9 x 9)': testMouseoverSelection( 'simple', 9, 9 ),
		'test mouseover selection (3 x 5)': testMouseoverSelection( 'simple', 3, 5 ),
		'test mouseover selection (7 x 8)': testMouseoverSelection( 'simple', 7, 8 ),
		'test mouseover selection (6 x 3)': testMouseoverSelection( 'simple', 6, 3 ),

		'test insertion': function() {
			var editor = this.editors.simple,
				quicktable = editor._.quicktable;

			openPanel( editor, quicktable );

			var target = simulateMouseOver( quicktable, 3, 5 );

			quicktable.grid.once( 'click', function() {
				resume( function() {
					var spy = quicktable.definition.insert;

					// Note that the number of rows and cols should be +1 relative to coords.
					assert.isTrue( spy.calledWith( editor, 4, 6 ),
						'Insertion function should be called with correct arguments' );
				} );
			} );

			quicktable.grid.fire( 'click', new CKEDITOR.dom.event( {
				target: target.$
			} ) );

			wait();
		}
	} );

	function createEditorConfig( name ) {
		return {
			name: name,
			config: {
				on: {
					pluginsLoaded: function( evt ) {
						var editor = evt.editor;

						editor._.quicktable = new CKEDITOR.plugins.quicktable( editor, {
							name: 'test_' + name,
							title: 'title ' + name,
							label: 'label ' + name,
							insert: sandbox.spy()
						} ).attach();

						editor.addCommand( 'testcommand_' + name, {
							exec: sandbox.spy()
						} );
					}
				}
			}
		};
	}

	function testMouseoverSelection( editorName, x, y ) {
		return function() {
			var editor = this.editors[ editorName ],
				quicktable = editor._.quicktable;

			openPanel( editor, quicktable );

			quicktable.grid.once( 'mouseover', function() {
				resume( function() {
					assertSelection( quicktable, x, y );
				} );
			} );

			simulateMouseOver( quicktable, x, y );
			wait();
		};
	}

	function openPanel( editor, quicktable ) {
		editor.ui.get( quicktable.getPanelName() ).click( editor );
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
