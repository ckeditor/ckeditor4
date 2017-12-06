/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview The "divarea" plugin. It registers the "wysiwyg" editing
 *		mode using a DIV element.
 */

CKEDITOR.dom.shadowRoot = CKEDITOR.tools.createClass( {
	$: function( $shadowRoot ) {
		this.$ = $shadowRoot;
	},

	proto: {
	}
} );

// Adapted from https://stackoverflow.com/a/27478691
CKEDITOR.dom.node.prototype.getShadowRoot = function() {
	var parent = this.$.parentNode;

	while ( parent ) {
		if ( parent.toString() === '[object ShadowRoot]' ) {
			return new CKEDITOR.dom.shadowRoot( parent );
		}

		parent = parent.parentNode;
	}

	return null;
};

CKEDITOR.dom.element.prototype.createShadowRoot = function() {
	if ( this.$.shadowRoot ) {
		return this.$.shadowRoot;
	}

	return this.$.attachShadow( { mode: 'open' } );
};

CKEDITOR.plugins.add( 'shadowarea', {
	afterInit: function( editor ) {
		// Add the "wysiwyg" mode.
		// Do that in the afterInit function, so it'll eventually overwrite
		// the mode defined by the wysiwygarea plugin.
		editor.addMode( 'wysiwyg', function( callback ) {
			var contentSpace = editor.ui.space( 'contents' ).createShadowRoot(),
				editingBlock = CKEDITOR.dom.element.createFromHtml(
					'<div class="cke_wysiwyg_div cke_reset cke_enable_context_menu" hidefocus="true"></div>'
				);

			contentSpace.appendChild( editingBlock.$ );

			editingBlock = editor.editable( editingBlock );

			editingBlock.detach = CKEDITOR.tools.override( editingBlock.detach,
				function( org ) {
					return function() {
						org.apply( this, arguments );
						this.remove();
					};
				} );

			editor.setData( editor.getData( 1 ), callback );
			editor.fire( 'contentDom' );
		} );
	}
} );
