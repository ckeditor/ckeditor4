/* bender-tags: editor */
/* bender-ckeditor-remove-plugins: copyformatting,tableselection */

( function() {
	'use strict';

	bender.test( {
		'test default value': function() {
			bender.editorBot.create( {
				name: 'test_default'
			}, function( bot ) {
				var hrefs = getStylesheets( bot.editor.document ),
					query = CKEDITOR.timestamp ? '?t=' + CKEDITOR.timestamp : '';

				assert.areSame( CKEDITOR.getUrl( 'contents.css' ), hrefs.join() + query );
			} );
		},

		'test string value': function() {
			var assetName = '%TEST_DIR%/_assets/contents.css';

			bender.editorBot.create( {
				name: 'test_string',
				config: {
					contentsCss: assetName
				}
			}, function( bot ) {
				var hrefs = getStylesheets( bot.editor.document );

				assert.areSame( assetName, hrefs.join() );
			} );
		},

		'test array value': function() {
			var additionalCssFiles = [ '%TEST_DIR%/_assets/contents.css', '%TEST_DIR%/_assets/contents2.css' ];

			bender.editorBot.create( {
				name: 'test_array',
				config: {
					contentsCss: additionalCssFiles
				}
			}, function( bot ) {
				var hrefs = getStylesheets( bot.editor.document );

				assert.areSame( additionalCssFiles.join( ',' ), hrefs.sort().join() );
			} );
		},

		'test editor.addContentsCss': function() {
			var botCfg = {
				name: 'test_addContentsCss',
				config: {
					contentsCss: null
				}
			};

			bender.editorBot.create( botCfg, function( bot ) {
				var editor = bot.editor,
					cfg = editor.config;

				editor.config.contentsCss = undefined;
				editor.addContentsCss( '_assets/contents.css' );
				arrayAssert.itemsAreSame( [ '_assets/contents.css' ], cfg.contentsCss );

				// Reset value, lets start with string val.
				editor.config.contentsCss = '_assets/contents2.css';
				editor.addContentsCss( '_assets/contents.css' );
				assert.isArray( cfg.contentsCss, 'contentsCss should be converted to an Array' );
				arrayAssert.itemsAreSame( [ '_assets/contents2.css', '_assets/contents.css' ], cfg.contentsCss );

				// Reset value, lets start with null.
				editor.config.contentsCss = null;
				editor.addContentsCss( '_assets/contents.css' );
				assert.isArray( cfg.contentsCss, 'contentsCss should be converted to an Array' );
				arrayAssert.itemsAreSame( [ '_assets/contents.css' ], cfg.contentsCss );

				// Reset value, lets start with array.
				editor.config.contentsCss = [ '_assets/contents2.css' ];
				editor.addContentsCss( '_assets/contents.css' );
				assert.isArray( cfg.contentsCss, 'contentsCss should be converted to an Array' );
				arrayAssert.itemsAreSame( [ '_assets/contents2.css', '_assets/contents.css' ], cfg.contentsCss );
			} );
		}
	} );

	function getStylesheets( doc ) {
		var hrefs = [],
			links = doc.getElementsByTag( 'link' ),
			link;

		for ( var i = 0; i < links.count(); ++i ) {
			link = links.getItem( i );
			if ( link.getAttribute( 'rel' ) == 'stylesheet' )
				hrefs.push( link.getAttribute( 'href' ).replace( /\?t=[a-z0-9]+$/i, '' ) );
		}

		return hrefs;
	}

} )();
