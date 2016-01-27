/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	function convertElementToStyle( element ) {
		return new CKEDITOR.style( { element: element.getName() } );
	}

	var commandDefinition = {
		startDisabled: true,
		contextSensitive: true,
		exec: function( editor ) {
			var style = convertElementToStyle( editor.elementPath().lastElement );

			this.setState( CKEDITOR.TRISTATE_ON );

			editor.editable().once( 'click', function( evt ) {
				var range = editor.getSelection().getRanges()[ 0 ];

				if ( !range ) {
					return;
				}

				style.apply( editor );
			} );
		},

		refresh: function( editor, path ) {
			var element = path.lastElement;
			if (  element && element.getName() !== 'p' && element.getName() !== 'body' )
				this.setState( CKEDITOR.TRISTATE_OFF );
			else
				this.setState( CKEDITOR.TRISTATE_DISABLED );
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
