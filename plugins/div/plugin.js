﻿
/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The "div" plugin. It wraps the selected block level elements with a 'div' element with specified styles and attributes.
 *
 */

(function() {
	CKEDITOR.plugins.add( 'div', {
		requires: [ 'dialog' ],
		init: function( editor ) {
			if ( editor.blockless )
				return;

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
						var div = CKEDITOR.plugins.div.getSurroundDiv( editor, node )
						if ( div && !div.data( 'cke-div-added' ) ) {
							toRemove.push( div );
							div.data( 'cke-div-added' );
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

					for ( i = 0; i < toRemove.length; i++ )
						toRemove[ i ].remove( true );

					selection.selectBookmarks( bookmarks );
				}
			});

			editor.ui.addButton && editor.ui.addButton( 'CreateDiv', {
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
					editor.contextMenu.addListener( function( element ) {
						if ( !element || element.isReadOnly() )
							return null;


						if ( CKEDITOR.plugins.div.getSurroundDiv( editor ) ) {
							return {
								editdiv: CKEDITOR.TRISTATE_OFF,
								removediv: CKEDITOR.TRISTATE_OFF
							};
						}

						return null;
					});
				}
			}

			CKEDITOR.dialog.add( 'creatediv', this.path + 'dialogs/div.js' );
			CKEDITOR.dialog.add( 'editdiv', this.path + 'dialogs/div.js' );
		}
	});

	CKEDITOR.plugins.div = {
		getSurroundDiv: function( editor, start ) {
			var path = editor.elementPath( start );
			return editor.elementPath( path.blockLimit ).contains( 'div' );
		}
	};
})();
