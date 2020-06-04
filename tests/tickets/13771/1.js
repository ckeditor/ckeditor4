/* bender-tags: 13771, config, font, format, stylescombo */
/* bender-ckeditor-plugins: font, format, stylescombo, toolbar */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				toolbar: [ [ 'Font', 'FontSize', 'Format', 'Styles' ] ]
			}
		},
		inline: {
			creator: 'inline',
			config: {
				toolbar: [ [ 'Font', 'FontSize', 'Format', 'Styles' ] ]
			}
		}
	};

	var tests = {
		'test if font combo loads proper stylesheet': function( editor, bot ) {
			bot.combo( 'Font', function( combo ) {
				assert.isTrue( searchForStylesheet( combo ), 'stylesheet is present in combo\'s iframe' );
			} );
		},

		'test if font size combo loads proper stylesheet': function( editor, bot ) {
			bot.combo( 'FontSize', function( combo ) {
				assert.isTrue( searchForStylesheet( combo ), 'stylesheet is present in combo\'s iframe' );
			} );
		},

		'test if format combo loads proper stylesheet': function( editor, bot ) {
			bot.combo( 'Format', function( combo ) {
				assert.isTrue( searchForStylesheet( combo ), 'stylesheet is present in combo\'s iframe' );
			} );
		},

		'test if styles combo loads proper stylesheet': function( editor, bot ) {
			bot.combo( 'Styles', function( combo ) {
				assert.isTrue( searchForStylesheet( combo ), 'stylesheet is present in combo\'s iframe' );
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );

	function searchForStylesheet( combo ) {
		var frameDoc = combo._.panel.element.getFirst().getFrameDocument();

		// Look for any stylesheet link elems that end with desired CSS file.
		return Boolean( frameDoc.findOne( 'link[rel="stylesheet"][href*="contents.css"]' ) );
	}
} )();
