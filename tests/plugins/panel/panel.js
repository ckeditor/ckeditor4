/* bender-tags: editor */
/* bender-ckeditor-plugins: panel */

( function() {
	'use strict';

	bender.editor = {};

	function createBlock() {
		var parent = new CKEDITOR.dom.element( 'div' );
		CKEDITOR.document.getBody().append( parent );

		var block = new CKEDITOR.ui.panel.block( parent, { attributes: {} } );

		block.element.setHtml( '<a href="#" _cke_focus="1">link1</a><input _cke_focus="1"><a href="#" _cke_focus="1">Link 2</a>' );

		block.keys[ 9 ] = 'next'; // TAB

		block.show();

		return block;
	}

	bender.test( {
		// (#2035)
		'test panel src is empty': function() {
			if ( !CKEDITOR.env.edge ) {
				assert.ignore();
			}

			var editor = this.editor,
				panel = new CKEDITOR.ui.panel( CKEDITOR.document, {
					forceIFrame: true
				} ),
				html = panel.render( editor ),
				src = html.match( /src="([^"]*)"/i )[ 1 ];

			src = src.substring( 5, src.length - 1 );

			assert.areSame( '', src, 'Frame source should be empty.' );
		},

		// (#2453)
		'test panel detects input elements': function() {
			var block = createBlock();

			block._.markFirstDisplayed();

			var items = block._.getItems();
			assert.areSame( 3, items.count() );

			block.onKeyDown( 9 );
			assert.areSame( 'input', items.getItem( block._.focusIndex ).getName() );
		},

		// (#2857)
		'test keydown passes info about click': function() {
			var block = createClickableBlock(),
				items = block._.getItems();

			block._.markFirstDisplayed();

			block.onKeyDown( 13 ); // Enter
			assert.areSame( '0', items.getItem( block._.focusIndex ).getAttribute( 'data-button' ) );
		}
	} );

	function createClickableBlock() {
		var parent = new CKEDITOR.dom.element( 'div' ),
			clickHandler = 'this.setAttribute(\'data-button\', CKEDITOR.tools.getMouseButton(event));return false;';
		CKEDITOR.document.getBody().append( parent );

		var block = new CKEDITOR.ui.panel.block( parent, { attributes: {} } );

		block.element.setHtml( '<a href="#" _cke_focus="1" onmouseup="' + clickHandler + '" onclick="' + clickHandler + '">link1</a>' );

		block.keys[ 13 ] = CKEDITOR.env.ie ? 'mouseup' : 'click'; // Enter

		block.show();

		return block;
	}
} )();
