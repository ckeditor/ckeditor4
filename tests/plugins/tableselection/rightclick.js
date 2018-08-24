/* bender-tags: tableselection */
/* bender-ckeditor-plugins: tableselection */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		inline: {
			creator: 'inline'
		}
	};

	var tests = {
		'test select inner cells right click unselected inner cell': test( {
			select: {
				inner: true,
				indexes: [ 1, 2, 3 ]
			},
			test: {
				inner: true,
				index: 0
			}
		} ),
		'test select inner cells right click selected inner cell': test( {
			select: {
				inner: true,
				indexes: [ 1, 2, 3 ]
			},
			test: {
				inner: true,
				index: 1
			}
		} ),
		'select outer cells right click unselected outer cell': test( {
			select: {
				inner: false,
				indexes: [ 1, 2, 3 ]
			},
			test: {
				inner: false,
				index: 0
			}
		} ),
		'test select outer cells right click selected outer cell': test( {
			select: {
				inner: false,
				indexes: [ 1, 2, 3 ]
			},
			test: {
				inner: false,
				index: 1
			}
		} ),
		'test select outer cells right click inner cell': test( {
			select: {
				inner: false,
				indexes: [ 1, 2, 3 ]
			},
			test: {
				inner: true,
				index: 0
			}
		} ),
		'test select inner cells right click outer cell': test( {
			select: {
				inner: true,
				indexes: [ 1, 2, 3 ]
			},
			test: {
				inner: false,
				index: 0
			}
		} )
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );

	function test( setup ) {
		return function( editor, bot ) {
			bot.setData( CKEDITOR.document.getById( 'test' ).getHtml(), function() {
				var editable = editor.editable(),
					innerTable = editable.findOne( 'table' ).findOne( 'table' ),
					outerCells = editable.find( 'td' ).toArray(),
					innerCells = innerTable.find( 'td' ).toArray(),
					selection = editor.getSelection(),
					mouseHost = editor.name === 'inline' ? editable : editor.document,
					ranges,
					target,
					shouldBeSame;

				outerCells = CKEDITOR.tools.array.filter( outerCells, function( item ) {
					return !item.getAscendant( 'table' ).equals( innerTable );
				} );

				ranges = CKEDITOR.tools.array.map( setup.select.indexes, function( index ) {
					var range = editor.createRange(),
						cell;

					cell = ( setup.select.inner ? innerCells : outerCells )[ index ];

					range.setStartBefore( cell );
					range.setEndAfter( cell );

					return range;
				} );

				selection.selectRanges( ranges );

				target = ( setup.test.inner ? innerCells : outerCells )[ setup.test.index ];

				mouseHost.fire( CKEDITOR.env.gecko ? 'mousedown' : 'mouseup', {
					editor: editor,
					getTarget: function() {
						return target;
					},
					$: {
						button: 2
					}
				} );

				shouldBeSame = setup.select.inner === setup.test.inner && setup.select.indexes.indexOf( setup.test.index ) !== -1;

				assert[ shouldBeSame ? 'areSame' : 'areNotSame' ]( ranges, editor.getSelection().getRanges() );
			} );
		};
	}
} )();
