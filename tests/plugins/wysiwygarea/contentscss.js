/* bender-tags: editor,unit */

( function() {
	'use strict';

	var tools = bender.tools;

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
			bender.editorBot.create( {
				name: 'test_string',
				config: {
					contentsCss: '_assets/contents.css'
				}
			}, function( bot ) {
				var hrefs = getStylesheets( bot.editor.document );

				assert.areSame( '_assets/contents.css', hrefs.join() );
			} );
		},

		'test array value': function() {
			bender.editorBot.create( {
				name: 'test_array',
				config: {
					contentsCss: [ '_assets/contents.css', '_assets/contents2.css' ]
				}
			}, function( bot ) {
				var hrefs = getStylesheets( bot.editor.document );

				assert.areSame( '_assets/contents.css,_assets/contents2.css', hrefs.sort().join() );
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