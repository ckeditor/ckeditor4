/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	function convertElementToStyle( element ) {
		return new CKEDITOR.style( { element: element.getName() } );
	}

	function getSelectedWordOffset( range ) {
		var node = range.startContainer,
			regex = /\b\w+\b/ig,
			contents = node.getText(),
			match;

		while( ( match = regex.exec( contents ) ) != null ) {
			if ( match.index + match[ 0 ].length >= range.startOffset ) {
				return {
					start: match.index,
					end: match.index + match[ 0 ].length
				}
			}
		}

		return null;
	}

	function applyFormat( style, editor ) {
		var range = editor.getSelection().getRanges()[ 0 ];

		if ( !range ) {
			return;
		}

		if ( range.collapsed ) {
			var newRange = editor.createRange(),
				word = getSelectedWordOffset( range );

			if ( !word ) {
				return;
			}

			newRange.setStart( range.startContainer, word.start );
			newRange.setEnd( range.startContainer, word.end );
			newRange.select();
		}

		style.apply( editor );
	}

	var commandDefinition = {
		exec: function( editor ) {
			var style = convertElementToStyle( editor.elementPath().lastElement ),
				cmd = this,
				handler = function() {
					applyFormat( style, editor );

					cleanUp();
				},
				cleanUp = function() {
					editor.removeMenuItem( 'applyStyle' );
					editor.editable().removeListener( 'click', handler );
					cmd.setState( CKEDITOR.TRISTATE_OFF );
				};

			if ( cmd.state === CKEDITOR.TRISTATE_ON ) {
				return cleanUp();
			}

			cmd.setState( CKEDITOR.TRISTATE_ON );

			editor.contextMenu.addListener( function() {
				return {
					applyStyle : CKEDITOR.TRISTATE_ON
				};
			} );

			editor.editable().on( 'click', handler );

			editor.addMenuItem( 'applyStyle', {
				label : editor.lang.copyformatting.menuLabel,
				onClick : handler,
				group : 'basicstyles',
				order : 1
			} );
		}
	};

	CKEDITOR.plugins.add( 'copyformatting', {
		requires: 'contextmenu',
		lang: 'en',
		icons: 'copyformatting',
		hidpi: true,
		init: function( editor ) {
			var command = editor.addCommand( 'copyFormatting', commandDefinition );

			editor.ui.addButton( 'copyFormatting', {
				label: editor.lang.copyformatting.label,
				command: 'copyFormatting',
				toolbar: 'basicstyles,90'
			} );

			editor.addMenuGroup( 'basicstyles' );
		}
	} );
} )();
