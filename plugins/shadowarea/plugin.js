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
		addCss: function( paths ) {
			if ( typeof paths === 'string' ) {
				paths = [ paths ];
			}

			CKEDITOR.tools.array.forEach( paths, function( path ) {
				if ( this.$.querySelector( 'link[href="' + path + '"]' ) ) {
					return;
				}

				var link = document.createElement( 'link' );
				link.href = path;
				link.rel = 'stylesheet';

				this.$.appendChild( link );
			}, this );
		},

		getById: function( id ) {
			var element = this.$.querySelector( '#' + id );

			return new CKEDITOR.dom.element( element );
		},

		getByAddress: function( address, normalized ) {
			var $ = this.$;

			for ( var i = 0; $ && i < address.length; i++ ) {
				var target = address[ i ];

				if ( !normalized ) {
					$ = $.childNodes[ target ];
					continue;
				}

				var currentIndex = -1;

				for ( var j = 0; j < $.childNodes.length; j++ ) {
					var candidate = $.childNodes[ j ];

					if ( normalized === true && candidate.nodeType == 3 && candidate.previousSibling && candidate.previousSibling.nodeType == 3 )
						continue;

					currentIndex++;

					if ( currentIndex == target ) {
						$ = candidate;
						break;
					}
				}
			}

			return $ ? new CKEDITOR.dom.node( $ ) : null;
		}
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
		return new CKEDITOR.dom.shadowRoot( this.$.shadowRoot );
	}

	return new CKEDITOR.dom.shadowRoot( this.$.attachShadow( { mode: 'open' } ) );
};

CKEDITOR.editor.prototype.addContentsCss = function( cssPath ) {
	var cfg = this.config,
		curContentsCss = cfg.contentsCss;

	// Convert current value into array.
	if ( !CKEDITOR.tools.isArray( curContentsCss ) ) {
		cfg.contentsCss = curContentsCss ? [ curContentsCss ] : [];
	}

	cfg.contentsCss.push( cssPath );
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

			contentSpace.addCss( editor.config.contentsCss );
			contentSpace.$.appendChild( editingBlock.$ );

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
