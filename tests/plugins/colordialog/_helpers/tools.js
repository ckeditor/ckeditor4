/* exported assertColor, openDialogManually, openDialogAutomatically */

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

function openDialogManually( editor, expectedColor, html, button ) {
	var toolbarButton = editor.ui.get( button );
	bender.tools.setHtmlWithSelection( editor, html );
	editor.once( 'dialogShow', function( evt ) {
		resume( function() {
			var dialog = evt.data,
				selectedColor = dialog.getValueOf( 'picker', 'selectedColor' );
			dialog.getButton( 'ok' ).click();

			assert.areSame( expectedColor, selectedColor );
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

function openDialogAutomatically( editor, expectedColor, html, type ) {
	bender.tools.setHtmlWithSelection( editor, html );
	var colorData = {
		selectionColor: expectedColor,
		type: type
	};

	editor.once( 'dialogShow', function( evt ) {
		var dialog = evt.data;
		dialog.getButton( 'ok' ).click();
	} );

	editor.getColorFromDialog( function( color ) {
		resume( function() {
			assert.areSame( expectedColor, color );
		} );
	}, null, colorData );
	wait();
}
