/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The "div" plugin. It wraps the selected block level elements with a 'div' element with specified styles and attributes.
 * 
 */

(function() {
	CKEDITOR.plugins.add( 'div', {
		requires: [ 'editingblock', 'domiterator' ],

		init: function( editor ) {
			var lang = editor.lang.div;

			editor.addCommand( 'creatediv', new CKEDITOR.dialogCommand( 'creatediv' ) );
			editor.addCommand( 'editdiv', new CKEDITOR.dialogCommand( 'editdiv' ) );
			editor.addCommand( 'removediv', {
				exec: function( editor ) {
					var selection = editor.getSelection(),
						ranges = selection && selection.getRanges(),
						range,
						bookmarks = selection.createBookmarks(),
						walker,
						toRemove = [];

					function findDiv( node ) {
						var path = new CKEDITOR.dom.elementPath( node ),
							blockLimit = path.blockLimit,
							div = blockLimit.is( 'div' ) && blockLimit;

						if ( div && !div.getAttribute( '_cke_div_added' ) ) {
							toRemove.push( div );
							div.setAttribute( '_cke_div_added' );
						}
					}

					for ( var i = 0; i < ranges.length; i++ ) {
						range = ranges[ i ];
						if ( range.collapsed )
							findDiv( selection.getStartElement() );
						else {
							walker = new CKEDITOR.dom.walker( range );
							walker.evaluator = findDiv;
							walker.lastForward();
						}
					}

					for ( var i = 0; i < toRemove.length; i++ )
						toRemove[ i ].remove( true );

					selection.selectBookmarks( bookmarks );
				}
			});

			editor.ui.addButton( 'CreateDiv', {
				label: lang.toolbar,
				command: 'creatediv'
			});

			if ( editor.addMenuItems ) {
				editor.addMenuItems({
					editdiv: {
						label: lang.edit,
						command: 'editdiv',
						group: 'div',
						order: 1
					},

					removediv: {
						label: lang.remove,
						command: 'removediv',
						group: 'div',
						order: 5
					}
				});

				if ( editor.contextMenu ) {
					editor.contextMenu.addListener( function( element, selection ) {
						if ( !element )
							return null;

						var elementPath = new CKEDITOR.dom.elementPath( element ),
							blockLimit = elementPath.blockLimit;

						if ( blockLimit && blockLimit.getAscendant( 'div', true ) ) {
							return {
								editdiv: CKEDITOR.TRISTATE_OFF,
								removediv: CKEDITOR.TRISTATE_OFF
							}
						}

						return null;
					});
				}
			}

			CKEDITOR.dialog.add( 'creatediv', this.path + 'dialogs/div.js' );
			CKEDITOR.dialog.add( 'editdiv', this.path + 'dialogs/div.js' );
		}
	});
})();
