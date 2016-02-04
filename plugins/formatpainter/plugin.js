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

	var commandDefinition = {
		exec: function( editor ) {
			var style = convertElementToStyle( editor.elementPath().lastElement ),
				cmd = this;

			cmd.setState( CKEDITOR.TRISTATE_ON );

			editor.editable().once( 'click', function( evt ) {
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
				cmd.setState( CKEDITOR.TRISTATE_OFF );
			} );
		}
	};

	CKEDITOR.plugins.add( 'formatpainter', {
		requires: 'contextmenu',
		lang: 'en',
		icons: 'formatpainter',
		hidpi: true,
		init: function( editor ) {
			var command = editor.addCommand( 'formatPainter', commandDefinition );

			editor.ui.addButton( 'formatPainter', {
				label: editor.lang.formatpainter.label,
				command: 'formatPainter',
				toolbar: 'basicstyles,90'
			} );
		}
	} );
} )();
