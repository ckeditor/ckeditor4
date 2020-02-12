/* bender-tags: editor, 3743 */
/* bender-ckeditor-plugins: colorbutton,toolbar,wysiwygarea */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		setUp: function() {
			var editor = this.editor;

			editor.ui.get( 'TextColor' ).createPanel( editor );
			editor.ui.get( 'BGColor' ).createPanel( editor );
		},

		'test select text color': function() {
			selectColor( this.editor, 'TextColor', 'DDD' );
			assertColor( this.editor, 'TextColor', 'DDD' );
		},

		'test deselect text color': function() {
			selectColor( this.editor, 'TextColor', 'DDD' );
			// Selecting non-existing color should fallback into automatic color.
			selectColor( this.editor, 'TextColor', 'auto' );
			assertColor( this.editor, 'TextColor', '' );
		},

		'test select background color': function() {
			selectColor( this.editor, 'BGColor', 'DDD' );
			assertColor( this.editor, 'BGColor', 'DDD' );
		},

		'test deselect background color': function() {
			selectColor( this.editor, 'BGColor', 'DDD' );
			// Selecting non-existing color should fallback into automatic color.
			selectColor( this.editor, 'BGColor', 'auto' );
			assertColor( this.editor, 'BGColor', '' );
		}
	} );

	function selectColor( editor, uiName, colorToSelect ) {
		var ui = editor.ui.get( uiName );

		ui.select( function( color ) {
			return color === colorToSelect;
		} );
	}

	function assertColor( editor, uiName, expectedColor ) {
		assert.areEqual( expectedColor, findColor( editor, uiName ) || '' );
	}

	function findColor( editor, uiName ) {
		var ui = editor.ui.get( uiName ),
			block = ui._.panel.getBlock( ui._.id ),
			items = block._.getItems().toArray(),
			selectedItem = findSelected( items );

		return selectedItem && selectedItem.getAttribute( 'data-value' );
	}

	function findSelected( items ) {
		return CKEDITOR.tools.array.find( items, function( item ) {
			return item.getAttribute( 'aria-selected' );
		} );
	}
} )();
