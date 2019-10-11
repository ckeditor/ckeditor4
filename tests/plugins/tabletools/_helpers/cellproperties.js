/* exported doTest, assertChildren, testColorChooser */

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

function testColorChooser( buttonName ) {
	return function() {
		bender.editorBot.create( {
			name: buttonName
		}, function( bot ) {
			var editor = bot.editor;

			editor.on( 'dialogShow', function( evt ) {
				var dialog = evt.data;

				dialog.getButton( 'ok' ).click();
			} );

			bot.setHtmlWithSelection( '<table><tr><td>[Test]</td></tr></table>' );

			editor.getColorFromDialog( function() {
				resume( function() {
					bot.dialog( 'cellProperties', function( dialog ) {
						dialog.getContentElement( 'info', buttonName ).click();
						assert.areEqual( 1, dialog.getElement().$.style.zIndex );
					} );
				} );
			} );
			wait();
		} );
	};
}
