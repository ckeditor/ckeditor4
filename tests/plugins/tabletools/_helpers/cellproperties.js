/* exported doTest, assertChildren */

function doTest( name, dialogCallback ) {
	return function() {
		var bot = this.editorBot;

		bender.tools.testInputOut( name, function( source, expected ) {
			bot.setHtmlWithSelection( source );

			bot.dialog( 'cellProperties', function( dialog ) {
				try {
					if ( dialogCallback ) {
						dialogCallback( dialog );
					}

					dialog.getButton( 'ok' ).click();
				} catch ( e ) {
					throw e;
				} finally {
					dialog.hide();
				}

				assert.areSame( bender.tools.compatHtml( expected ), bot.getData( true ) );
			} );
		} );
	};
}

function assertChildren( children ) {
	CKEDITOR.tools.array.forEach( children, function( item ) {
		if ( item && item.children ) {
			assertChildren( item.children );
		} else {
			assert.isObject( item );
		}
	} );
}
