/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	function convertElementToStyle( element ) {
		var attributes = {},
			styles = CKEDITOR.tools.parseCssText( element.getAttribute( 'style' ) );

		// Create attributes dictionary
		var attrDefs = element.$.attributes;
		for ( var i = 0; i < attrDefs.length; i++ ) {
			attributes[ attrDefs[ i ].name ] = attrDefs[ i ].value;
		}

		return new CKEDITOR.style( {
			element: element.getName(),
			type: CKEDITOR.STYLE_INLINE,
			attributes: attributes,
			styles: styles
		} );
	}

	function extractStylesFromElement( element ) {
		var styles = [ convertElementToStyle( element ) ];

		while ( ( element = element.getParent() ) && element.type === CKEDITOR.NODE_ELEMENT ) {
			styles.push( convertElementToStyle( element ) );
		}

		return styles;
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

	function applyFormat( styles, editor ) {
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

		for ( var i = 0; i < styles.length; i++) {
			styles[ i ].apply( editor );
		}
	}

	var commandDefinition = {
		exec: function( editor ) {
			var	cmd = this;

			if ( cmd.state === CKEDITOR.TRISTATE_ON ) {
				return cmd.setState( CKEDITOR.TRISTATE_OFF );
			}

			cmd.styles = extractStylesFromElement( editor.elementPath().lastElement );
			cmd.setState( CKEDITOR.TRISTATE_ON );
		}
	},

	applyCommandDefinition = {
		exec: function( editor ) {
			var cmd = editor.getCommand( 'copyFormatting' );

			if ( cmd.state === CKEDITOR.TRISTATE_OFF ) {
				return;
			}

			applyFormat( cmd.styles, editor );

			cmd.setState( CKEDITOR.TRISTATE_OFF );
		}
	};

	CKEDITOR.plugins.add( 'copyformatting', {
		requires: 'contextmenu',
		lang: 'en',
		icons: 'copyformatting',
		hidpi: true,
		init: function( editor ) {
			editor.addCommand( 'copyFormatting', commandDefinition );
			editor.addCommand( 'applyFormatting', applyCommandDefinition );

			editor.ui.addButton( 'copyFormatting', {
				label: editor.lang.copyformatting.label,
				command: 'copyFormatting',
				toolbar: 'basicstyles,90'
			} );

			editor.addMenuGroup( 'basicstyles' );

			editor.addMenuItem( 'applyStyle', {
				label : editor.lang.copyformatting.menuLabel,
				command: 'applyFormatting',
				group : 'basicstyles',
				order : 1
			} );

			editor.contextMenu.addListener( function() {
				return editor.getCommand( 'copyFormatting').state === CKEDITOR.TRISTATE_ON ? {
					applyStyle : CKEDITOR.TRISTATE_ON
				} : null;
			} );

			editor.on( 'instanceReady', function() {
				editor.editable().on( 'click', function( evt ) {
					var editor = evt.editor || evt.sender.editor;
					editor.execCommand( 'applyFormatting' );
				} );
			} );
		}
	} );
} )();
