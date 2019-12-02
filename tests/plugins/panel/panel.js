/* bender-tags: editor */
/* bender-ckeditor-plugins: panel */

( function() {
	'use strict';

	bender.editor = {};

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
			var block = createBlock( '<a href="#" _cke_focus="1">link1</a><input _cke_focus="1"><a href="#" _cke_focus="1">Link 2</a>' );

			block.keys[ 9 ] = 'next'; // TAB

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
		},

		// (#3654)
		'test up': function() {
			var block = createGridBlock( 4 );

			block.keys[ 38 ] = 'up'; // ARROW-UP

			block._.markFirstDisplayed();

			block.onKeyDown( 38 );
			assert.areEqual( 12, block._.focusIndex );

			block.onKeyDown( 38 );
			assert.areEqual( 8, block._.focusIndex );

			block.onKeyDown( 38 );
			assert.areEqual( 4, block._.focusIndex );

			block.onKeyDown( 38 );
			assert.areEqual( 0, block._.focusIndex );
		},

		// (#3654)
		'test down': function() {
			var block = createGridBlock( 4 );

			block.keys[ 40 ] = 'down'; // ARROW-DOWN

			block._.markFirstDisplayed();

			block.onKeyDown( 40 );
			assert.areEqual( 4, block._.focusIndex );

			block.onKeyDown( 40 );
			assert.areEqual( 8, block._.focusIndex );

			block.onKeyDown( 40 );
			assert.areEqual( 12, block._.focusIndex );

			block.onKeyDown( 40 );
			assert.areEqual( 0, block._.focusIndex );
		},

		// (#3654)
		'test up with moved position': function() {
			var block = createGridBlock( 4 );

			block.keys[ 38 ] = 'up'; // ARROW-UP

			block._.markItem( 2 );

			block.onKeyDown( 38 );
			assert.areEqual( 14, block._.focusIndex );

			block.onKeyDown( 38 );
			assert.areEqual( 10, block._.focusIndex );

			block.onKeyDown( 38 );
			assert.areEqual( 6, block._.focusIndex );

			block.onKeyDown( 38 );
			assert.areEqual( 2, block._.focusIndex );
		},

		// (#3654)
		'test down with moved position': function() {
			var block = createGridBlock( 4 );

			block.keys[ 40 ] = 'down'; // ARROW-DOWN

			block._.markItem( 2 );

			block.onKeyDown( 40 );
			assert.areEqual( 6, block._.focusIndex );

			block.onKeyDown( 40 );
			assert.areEqual( 10, block._.focusIndex );

			block.onKeyDown( 40 );
			assert.areEqual( 14, block._.focusIndex );

			block.onKeyDown( 40 );
			assert.areEqual( 2, block._.focusIndex );
		}
	} );

	function createBlock( html ) {
		var parent = new CKEDITOR.dom.element( 'div' );
		CKEDITOR.document.getBody().append( parent );

		var block = new CKEDITOR.ui.panel.block( parent, { attributes: {} } );

		block.element.setHtml( html );

		block.show();

		return block;
	}

	function createGridBlock( size ) {
		var focusableHtml = '<a href="javascript: void(0);" _cke_focus="1">&nbsp;</a>',
			container = new CKEDITOR.dom.element( 'div' );

		for ( var i = 0; i < size; i++ ) {
			var row = new CKEDITOR.dom.element( 'div' );

			for ( var j = 0; j < size; j++ ) {
				row.append( CKEDITOR.dom.element.createFromHtml( focusableHtml ) );
			}

			container.append( row );
		}

		var block = createBlock( container.getHtml() );

		block.vNavOffset = size;

		return block;
	}

	function createClickableBlock() {
		var clickHandler = 'this.setAttribute(\'data-button\', CKEDITOR.tools.getMouseButton(event));return false;',
			block = createBlock( '<a href="#" _cke_focus="1" onmouseup="' + clickHandler + '" onclick="' + clickHandler + '">link1</a>' );

		block.keys[ 13 ] = CKEDITOR.env.ie ? 'mouseup' : 'click'; // Enter

		return block;
	}
} )();
