/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';
	var style;
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
			var	cmd = this;

			if ( cmd.state === CKEDITOR.TRISTATE_ON ) {
				return cmd.setState( CKEDITOR.TRISTATE_OFF );
			}

			cmd.style = convertElementToStyle( editor.elementPath().lastElement );
			cmd.setState( CKEDITOR.TRISTATE_ON );
		}
	},

	applyCommandDefinition = {
		exec: function( editor ) {
			var cmd = editor.getCommand( 'copyFormatting' );

			if ( cmd.state === CKEDITOR.TRISTATE_OFF ) {
				return;
			}

			applyFormat( cmd.style, editor );

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
