/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview This plugin allows to register new paste handlers.
 */

( function() {
	var PasteTools = CKEDITOR.tools.createClass( {
		$: function() {
			this.handlers = [];
		},

		proto: {
			register: function( definition ) {
				this.handlers.push( definition );
			},

			addPasteListener: function( editor ) {
				editor.on( 'paste', function( evt ) {
					var handler = CKEDITOR.tools.array.find( this.handlers, function( handler ) {
						return handler.canHandle( evt );
					} );

					if ( handler ) {
						handler.handle( evt );
					}
				}, this, null, 3 );
			}
		}
	} );

	CKEDITOR.plugins.add( 'pastetools', {
		requires: 'clipboard',
		init: function( editor ) {
			editor.pasteTools = new PasteTools();

			editor.pasteTools.addPasteListener( editor );
		}
	} );
} )();
