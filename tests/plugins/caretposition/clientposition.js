/* bender-tags: editor */
/* bender-ckeditor-plugins: caretposition, image2 */

( function() {

	bender.editor = {
		config: {
			extraAllowedContent: 'span[id]; p[id]'
		}
	}

	bender.test( {
		'test move client position horizontally': function() {
			var editor = this.editor, bot = this.editorBot;

			bot.setData( '<span id="x">x</span><span id="y">x</span>', function() {
					var editable = editor.editable(),
						selection = editor.getSelection(),
						xPosition = changeClientPosition( editor, editable.findOne( '#x' ) ),
						yPosition = changeClientPosition( editor, editable.findOne( '#y' ) );

					assertMovedPosition( xPosition, yPosition, 4, 8, 'left' );
					assertPositions( xPosition, yPosition, 'top' );
					assertPositions( xPosition, yPosition, 'height' );
				} );
		},

		'test move client position veritically': function() {
			var editor = this.editor, bot = this.editorBot;

			bot.setData( '<p id="x">x</p><p id="y">x</p>', function() {
					var editable = editor.editable(),
						selection = editor.getSelection(),
						xPosition = changeClientPosition( editor, editable.findOne( '#x' ) ),
						yPosition = changeClientPosition( editor, editable.findOne( '#y' ) );

					assertMovedPosition( xPosition, yPosition, 28, 38, 'top' );
					assertPositions( xPosition, yPosition, 'left' );
					assertPositions( xPosition, yPosition, 'height' );
				} );
		},

		'test get client height': function() {
			var editor = this.editor, bot = this.editorBot;

			bot.setData( '<span>x</span><img src="' + bender.basePath + '/_assets/lena.jpg">', function() {
					var editable = editor.editable(),
						selection = editor.getSelection(),
						imgPosition = changeClientPosition( editor, editable.findOne( 'img' ) );

					assertPositions( { height: 200 }, imgPosition, 'height' );
				} );
		}
	} );

	function changeClientPosition( editor, element ) {
		var selection = editor.getSelection();
		selection.selectElement( element );

		var range = selection.getRanges()[ 0 ];
		range.collapse();

		return range.getClientPosition();
	}

	function assertMovedPosition( x, y, min, max, attr ) {
		bender.assert.isNumberInRange( Math.round( y[attr] ) - Math.round( x[attr] ), min, max, 'Moved position exceeded expected pixels range.' );
	}

	function assertPositions( x, y, attr ) {
		assert.areEqual( Math.round( x[attr] ), Math.round( y[attr] ) );
	}

} )();
