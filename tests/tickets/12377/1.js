/* bender-tags: editor,image */
/* bender-ckeditor-plugins: image,toolbar */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		'test image dialog with removed preview and basic panel - image loaded': function() {
			var bot = this.editorBot,
				src = '%BASE_PATH%_assets/img.gif',
				src2 = '%BASE_PATH%_assets/logo.png';

			bot.setHtmlWithSelection( '<p>[<img alt="foo" src="' + src + '" />]</p>' );

			CKEDITOR.on( 'dialogDefinition', function( evt ) {
				var dialogName = evt.data.name;
				var dialogDefinition = evt.data.definition;

				if ( dialogName == 'image' ) {
					var infoTab = dialogDefinition.getContents( 'info' );
					infoTab.remove( 'basic' );
					infoTab.remove( 'htmlPreview' );
				}
			} );

			bot.dialog( 'image', function( dialog ) {
				assert.areSame( src, dialog.getValueOf( 'info', 'txtUrl' ) );

				dialog.setValueOf( 'info', 'txtUrl', src2 );
				dialog.getContentElement( 'info', 'txtAlt' ).focus();

				// Focus will be moved asynchronously. IE8 might complain too.
				wait( function() {
					dialog.getButton( 'ok' ).click();
					assert.areSame( '<p><img alt="foo" src="' + src2 + '" /></p>', bot.getData() );
				}, 50 );
			} );
		},

		'test image dialog with removed preview and basic panel - image load error': function() {
			var bot = this.editorBot,
				src = 'img404.gif',
				src2 = 'anotherimg404.gif';

			bot.setHtmlWithSelection( '<p>[<img alt="foo" src="' + src + '" />]</p>' );

			CKEDITOR.on( 'dialogDefinition', function( evt ) {
				var dialogName = evt.data.name;
				var dialogDefinition = evt.data.definition;

				if ( dialogName == 'image' ) {
					var infoTab = dialogDefinition.getContents( 'info' );
					infoTab.remove( 'basic' );
					infoTab.remove( 'htmlPreview' );
				}
			} );

			bot.dialog( 'image', function( dialog ) {
				assert.areSame( src, dialog.getValueOf( 'info', 'txtUrl' ) );

				dialog.setValueOf( 'info', 'txtUrl', src2 );
				dialog.getContentElement( 'info', 'txtAlt' ).focus();

				// Focus will be moved asynchronously. IE8 might complain too.
				wait( function() {
					dialog.getButton( 'ok' ).click();
					assert.areSame( '<p><img alt="foo" src="' + src2 + '" /></p>', bot.getData() );
				}, 50 );
			} );
		}
	} );
} )();
