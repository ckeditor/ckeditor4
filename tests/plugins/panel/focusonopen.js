/* bender-tags: editor,unit,panel */
/* bender-ckeditor-plugins: pagebreak,toolbar,clipboard,panel */

( function() {
	'use strict';

	bender.editor = {
		creator: 'replace'
	};

	function createBlock() {
		var parent = new CKEDITOR.dom.element( 'div' );
		CKEDITOR.document.getBody().append( parent );

		var block = new CKEDITOR.ui.panel.block( parent, { attributes: {} } );

		for ( var i = 0; i < 4; i++ ) {
			var item = new CKEDITOR.dom.element( 'p' );
			var link = new CKEDITOR.dom.element( 'a' );
			item.append( link );
			block.element.append( item );
		}
		block.show();

		return block;
	}

	bender.test( {
		'test mark first panel block item': function() {
			var block = createBlock(),
				timeout = CKEDITOR.tools.setTimeout;

			block.onMark = sinon.spy();

			CKEDITOR.tools.setTimeout = function( callback ) {
				callback();
			};

			block._.markFirstDisplayed();

			CKEDITOR.tools.setTimeout = timeout;

			assert.isTrue( block.onMark.calledWith( block.element.getElementsByTag( 'a' ).getItem( 0 ) ) );
		},

		'test mark first displayed panel block item': function() {
			var block = createBlock(),
				timeout = CKEDITOR.tools.setTimeout;

			block.onMark = sinon.spy();
			block.element.getElementsByTag( 'p' ).getItem( 0 ).setStyle( 'display', 'none' );

			CKEDITOR.tools.setTimeout = function( callback ) {
				callback();
			};

			block._.markFirstDisplayed();

			CKEDITOR.tools.setTimeout = timeout;

			assert.isTrue( block.onMark.calledWith( block.element.getElementsByTag( 'a' ).getItem( 1 ) ) );
		},

		'test mark first displayed item with aria-selected': function() {
			var block = createBlock(),
				itemIndex = 2,
				timeout = CKEDITOR.tools.setTimeout;

			block.onMark = sinon.spy();
			block.element.getElementsByTag( 'a' ).getItem( itemIndex ).setAttribute( 'aria-selected', true );

			CKEDITOR.tools.setTimeout = function( callback ) {
				callback();
			};

			block._.markFirstDisplayed();

			CKEDITOR.tools.setTimeout = timeout;

			assert.isTrue( block.onMark.calledWith( block.element.getElementsByTag( 'a' ).getItem( itemIndex ) ) );
		}
	} );
} )();
