/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'panel', {
	beforeInit: function( editor ) {
		editor.ui.addHandler( CKEDITOR.UI_PANEL, CKEDITOR.ui.panel.handler );
	}
});

/**
 * Panel UI element.
 * @constant
 * @example
 */
CKEDITOR.UI_PANEL = 2;

CKEDITOR.ui.panel = function( document, definition ) {
	// Copy all definition properties to this object.
	if ( definition )
		CKEDITOR.tools.extend( this, definition );

	// Set defaults.
	CKEDITOR.tools.extend( this, {
		className: '',
		css: []
	});

	this.id = CKEDITOR.tools.getNextNumber();
	this.document = document;

	this._ = {
		blocks: {}
	};
};

/**
 * Transforms a rich combo definition in a {@link CKEDITOR.ui.richCombo}
 * instance.
 * @type Object
 * @example
 */
CKEDITOR.ui.panel.handler = {
	create: function( definition ) {
		return new CKEDITOR.ui.panel( definition );
	}
};

CKEDITOR.ui.panel.prototype = {
	renderHtml: function( editor ) {
		var output = [];
		this.render( editor, output );
		return output.join( '' );
	},

	/**
	 * Renders the combo.
	 * @param {CKEDITOR.editor} editor The editor instance which this button is
	 *		to be used by.
	 * @param {Array} output The output array to which append the HTML relative
	 *		to this button.
	 * @example
	 */
	render: function( editor, output ) {
		var id = 'cke_' + this.id;

		output.push( '<div class="', editor.skinClass, '">' +
			'<div id=', id, ' class="cke_panel' );

		if ( this.className )
			output.push( ' ', this.className );

		output.push( '">' );

		if ( this.forceIFrame || this.css.length ) {
			output.push( '<iframe id="', id, '_frame"' +
				' frameborder="0"' +
				' src="javascript:void(0)"' +
				'></iframe>' );
		}

		output.push( '</div>' +
			'</div>' );

		return id;
	},

	getHolderElement: function() {
		var holder = this._.holder;

		if ( !holder ) {
			if ( this.forceIFrame || this.css.length ) {
				var iframe = this.document.getById( 'cke_' + this.id + '_frame' );
				var doc = new CKEDITOR.dom.document( iframe.$.contentWindow.document );

				// Initialize the IFRAME document body.
				doc.$.open();
				doc.$.write( '<!DOCTYPE html>' +
					'<html>' +
						'<head>' +
							'<link type="text/css" rel=stylesheet href="' + this.css.join( '"><link type="text/css" rel="stylesheet" href="' ) + '">' +
						'</head>' +
						'<body class="cke_panel_frame" style="margin:0;padding:0">' +
						'</body>' +
					'<\/html>' );
				doc.$.close();

				var win = doc.getWindow();

				// Register the CKEDITOR global.
				win.$.CKEDITOR = CKEDITOR;

				win.on( 'load', function( ev ) {
					this.isLoaded = true;
					if ( this.onLoad )
						this.onLoad();
				}, this );

				holder = doc.getBody();
			} else
				holder = this.document.getById( 'cke_' + this.id );

			this._.holder = holder;
		}

		return holder;
	},

	addBlock: function( name, block ) {
		block = this._.blocks[ name ] = block || new CKEDITOR.ui.panel.block( this.getHolderElement() );

		if ( !this._.currentBlock )
			this.showBlock( name );

		return block;
	},

	getBlock: function( name ) {
		return this._.blocks[ name ];
	},

	showBlock: function( name ) {
		var blocks = this._.blocks,
			block = blocks[ name ],
			current = this._.currentBlock;

		if ( current )
			current.hide();

		this._.currentBlock = block;

		block.show();

		return block;
	}
};

CKEDITOR.ui.panel.block = function( blockHolder ) {
	this.element = blockHolder.append( blockHolder.getDocument().createElement( 'div', {
		attributes: {
			'class': 'cke_panel_block'
		},
		styles: {
			display: 'none'
		}
	}));
};

CKEDITOR.ui.panel.block.prototype = {
	show: function() {
		this.element.setStyle( 'display', '' );
	},

	hide: function() {
		this.element.setStyle( 'display', 'none' );
	}
};
