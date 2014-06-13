/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: flash,toolbar */

( function() {
	'use strict';

	var editorBots,
		FLASH_URL = '%BASE_PATH%_assets/sample.swf';

	bender.test( {
		'async:init': function() {
			var that = this;

			bender.tools.setUpEditors( {
				one: {
					name: 'one'
				}
			}, function( editors, bots ) {
				editorBots = bots;
				that.callback( editors );
			} );
		},

		tearDown: function() {
			var currentDialog = CKEDITOR.dialog.getCurrent();

			if ( currentDialog )
				currentDialog.hide();
		},

		// true is default value for allowFullScreen property
		'test param allowFullScreen present in code with true value': function() {
			var bot = editorBots.one;

			bot.setData( '', function() {
				bot.editor.focus();
				bot.dialog( 'flash', function( dialog ) {
					dialog.setValueOf( 'info', 'src', FLASH_URL );

					var allowFullScreenBtn = dialog.getContentElement( 'properties', 'allowFullScreen' );
					assert.areEqual( true, allowFullScreenBtn.getValue(), 'Default value should be set to true' );

					dialog.getButton( 'ok' ).click();

					var element = parseEditorDataToDOM( bot );

					var fullScreenParam = element.findOne( 'param[name="allowFullScreen"]' );
					assert.isNotNull( fullScreenParam, 'Parameter should be present.' );
					assert.areEqual( 'true', fullScreenParam.getAttribute( 'value' ), 'Value should be set to true.' );

					selectFirstFlashElementInEditor( bot );

					bot.dialog( 'flash', function( dialog ) {
						allowFullScreenBtn = dialog.getContentElement( 'properties', 'allowFullScreen' );

						assert.areEqual( true, allowFullScreenBtn.getValue(), 'Default value should be still set to true' );
					} );
				} );
			} );
		},

		'test param allowFullScreen present in code with false value': function() {
			var bot = editorBots.one;

			bot.setData( '', function() {
				bot.editor.focus();
				bot.dialog( 'flash', function( dialog ) {
					dialog.setValueOf( 'info', 'src', FLASH_URL );

					var allowFullScreenBtn = dialog.getContentElement( 'properties', 'allowFullScreen' );
					allowFullScreenBtn.setValue( false );

					dialog.getButton( 'ok' ).click();

					var element = parseEditorDataToDOM( bot );

					var fullScreenParam = element.findOne( 'param[name="allowFullScreen"]' );
					assert.isNotNull( fullScreenParam, 'Parameter should be present.' );
					assert.areEqual( 'false', fullScreenParam.getAttribute( 'value' ), 'Value should be set to false.' );

					selectFirstFlashElementInEditor( bot );

					bot.dialog( 'flash', function( dialog ) {
						allowFullScreenBtn = dialog.getContentElement( 'properties', 'allowFullScreen' );

						assert.areEqual( false, allowFullScreenBtn.getValue(), 'Default value should be still set to false' );
					} );
				} );
			} );
		}
	} );

	function selectFirstFlashElementInEditor( bot ) {
		var flashElement = bot.editor.document.findOne( 'img' );

		bot.editor.getSelection().selectElement( flashElement );
	}

	function parseEditorDataToDOM( bot ) {
		return CKEDITOR.dom.element.createFromHtml( '<div>' + bot.getData() + '</div>' );
	}
} )();