/* exported colorTools */

( function() {
	function assertColor( editor, inputColor, outputColor ) {
		editor.once( 'dialogShow', function( evt ) {
			var dialog = evt.data;

			setColorInDialog( dialog, inputColor );
			confirmDialog( dialog );
		} );

		assertGetColorFromDialog( editor, outputColor );
	}

	function assertGetColorFromDialog( editor, expectedColor ) {
		editor.getColorFromDialog( function( color ) {
			resume( function() {
				assert.areSame( expectedColor, color );
			} );
		} );
		wait();
	}

	function assertSettingAndGettingColor( editor, options ) {
		bender.tools.setHtmlWithSelection( editor, '<p>Whenever [something] happens.</p>' );

		editor.once( 'dialogShow', function( evt ) {
			resume( function() {
				var dialog = evt.data;

				setColorInDialog( dialog, options.inputColor );
				confirmDialog( dialog );

				assertValueFromDialog( editor, options );
			} );
		} );

		openColorPanel( editor, options );
		openColorDialog( editor, options );
	}

	function openDialogManually( editor, expectedColor, html, button ) {
		bender.tools.setHtmlWithSelection( editor, html );

		assertValueFromDialog( editor, {
			button: button,
			expectedColor: expectedColor
		} );
	}

	function assertValueFromDialog( editor, options ) {
		editor.once( 'dialogShow', function( evt ) {
			resume( function() {
				var dialog = evt.data,
					selectedColor = getColorFromDialog( dialog );

				confirmDialog( dialog );

				assert.areSame( options.expectedColor, selectedColor );
			} );
		} );

		openColorPanel( editor, options );
		openColorDialog( editor, options );
	}

	function openColorPanel( editor, options ) {
		var toolbarButton = editor.ui.get( options.button );

		toolbarButton.click( editor );
	}

	function openColorDialog( editor, options ) {
		var toolbarButton = editor.ui.get( options.button );

		setTimeout( function() {
			toolbarButton._.panel.getBlock( toolbarButton._.id ).element.findOne( '.cke_colormore' ).$.click();
		}, 0 );
		wait();
	}

	function getColorFromDialog( dialog ) {
		var selectedColor = dialog.getValueOf( 'picker', 'selectedColor' );

		return selectedColor;
	}

	function setColorInDialog( dialog, inputColor ) {
		dialog.setValueOf( 'picker', 'selectedColor', inputColor );
	}

	function confirmDialog( dialog ) {
		dialog.getButton( 'ok' ).click();
	}

	function cancelDialog( dialog ) {
		dialog.getButton( 'cancel' ).click();
	}

	window.colorTools = {
		assertColor: assertColor,
		assertSettingAndGettingColor: assertSettingAndGettingColor,
		assertValueFromDialog: assertValueFromDialog,
		assertGetColorFromDialog: assertGetColorFromDialog,
		openColorPanel: openColorPanel,
		openColorDialog: openColorDialog,
		openDialogManually: openDialogManually,
		confirmDialog: confirmDialog,
		cancelDialog: cancelDialog,
		getColorFromDialog: getColorFromDialog,
		setColorInDialog: setColorInDialog
	};
}() );

