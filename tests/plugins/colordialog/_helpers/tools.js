/* exported assertColor, openDialogManually */

function assertColor( editor, inputColor, outputColor ) {
	editor.once( 'dialogShow', function( evt ) {
		var dialog = evt.data;
		dialog.setValueOf( 'picker', 'selectedColor', inputColor );
		dialog.getButton( 'ok' ).click();
	} );

	editor.getColorFromDialog( function( color ) {
		resume( function() {
			assert.areSame( outputColor, color );
		} );
	} );
	wait();
}

function assertSettingAndGettingColor( editor, options ) {
	var toolbarButton = editor.ui.get( options.button );

	bender.tools.setHtmlWithSelection( editor, '<p>Whenever [something] happens.</p>' );

	editor.once( 'dialogShow', function( evt ) {
		resume( function() {
			var dialog = evt.data;

			dialog.setValueOf( 'picker', 'selectedColor', options.inputColor );
			dialog.getButton( 'ok' ).click();

			assertValueFromDialog( editor, options );
		} );
	} );

	toolbarButton.click( editor );
	openColorDialog( toolbarButton );
}

function openDialogManually( editor, expectedColor, html, button ) {
	bender.tools.setHtmlWithSelection( editor, html );
	assertValueFromDialog( editor, {
		button: button,
		expectedColor: expectedColor
	} );
}

function assertValueFromDialog( editor, options ) {
	var toolbarButton = editor.ui.get( options.button );

	editor.once( 'dialogShow', function( evt ) {
		resume( function() {
			var dialog = evt.data,
				selectedColor = dialog.getValueOf( 'picker', 'selectedColor' );

			dialog.getButton( 'ok' ).click();
			assert.areSame( options.expectedColor, selectedColor );
		} );
	} );

	toolbarButton.click( editor );
	openColorDialog( toolbarButton );
}

function openColorDialog( button ) {
	setTimeout( function() {
		button._.panel.getBlock( button._.id ).element.findOne( '.cke_colormore' ).$.click();
	}, 0 );
	wait();
}

