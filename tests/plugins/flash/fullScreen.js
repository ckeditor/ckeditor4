/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: flash,toolbar */

( function() {
	'use strict';

	var FLASH_URL = '%BASE_PATH%_assets/sample.swf';

	bender.editors = {
		one: {
			name: 'one'
		}
	};

	bender.test( {
		tearDown: function() {
			var currentDialog = CKEDITOR.dialog.getCurrent();

			if ( currentDialog )
				currentDialog.hide();
		},

		// true is default value for allowFullScreen property
		'test param allowFullScreen present in code with true value': function() {
			var bot = this.editorBots.one;

			bot.setData( '', function() {
				bot.dialog( 'flash', function( dialog ) {
					dialog.setValueOf( 'info', 'src', FLASH_URL );

					var allowFullScreenBtn = dialog.getContentElement( 'properties', 'allowFullScreen' );
					assert.areEqual( true, allowFullScreenBtn.getValue(), 'Default value should be set to true' );

					dialog.getButton( 'ok' ).click();

					var fullScreenParam = getFullScreenParam( bot );
					assert.areEqual( 'true', fullScreenParam.attributes.value, 'Value should be set to true.' );

					var embed = getEmbed( bot );
					assert.areSame( 'true', embed.attributes.allowfullscreen, 'allowfullscreen set for embed' );

					selectFirstFlashElementInEditor( bot );

					bot.dialog( 'flash', function( dialog ) {
						allowFullScreenBtn = dialog.getContentElement( 'properties', 'allowFullScreen' );

						assert.areEqual( true, allowFullScreenBtn.getValue(), 'Default value should be still set to true' );
					} );
				} );
			} );
		},

		'test param allowFullScreen present in code with false value': function() {
			var bot = this.editorBots.one;

			bot.setData( '', function() {
				bot.dialog( 'flash', function( dialog ) {
					dialog.setValueOf( 'info', 'src', FLASH_URL );

					var allowFullScreenBtn = dialog.getContentElement( 'properties', 'allowFullScreen' );
					allowFullScreenBtn.setValue( false );

					dialog.getButton( 'ok' ).click();

					var fullScreenParam = getFullScreenParam( bot );
					assert.areEqual( 'false', fullScreenParam.attributes.value, 'Value should be set to false.' );

					var embed = getEmbed( bot );
					assert.areSame( 'false', embed.attributes.allowfullscreen, 'allowfullscreen set for embed' );

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

	function getObjectChildElement( bot, lookupFn ) {
		var fragment = CKEDITOR.htmlParser.fragment.fromHtml( bot.getData() ),
			found = null;

		fragment.forEach( function( element ) {
			if ( lookupFn( element ) ) {
				found = element;
			}
		} );

		return found;
	}

	function getFullScreenParam( bot ) {
		return getObjectChildElement( bot, function( element ) {
			return element.name == 'param' && element.attributes.name == 'allowFullScreen';
		} );
	}

	function getEmbed( bot ) {
		return getObjectChildElement( bot, function( element ) {
			return element.name == 'embed';
		} );
	}
} )();