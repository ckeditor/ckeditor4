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

	bender.test( {
		'check if font combo loads proper stylesheet': function() {
			checkCombo( 'Font' );
		},

		'check if font size combo loads proper stylesheet': function() {
			checkCombo( 'FontSize' );
		},

		'check if format combo loads proper stylesheet': function() {
			checkCombo( 'Format' );
		},

		'check if styles combo loads proper stylesheet': function() {
			checkCombo( 'Styles' );
		}
	} );

	function searchForStylesheet( combo ) {
		var frameDoc = combo._.panel.element.getFirst().getFrameDocument();

		// Look for any stylesheet link elems that end with desired CSS file.
		return Boolean( frameDoc.findOne( 'link[rel="stylesheet"][href$="contents.css"]' ) );
	}

	function checkCombo( name ) {
		var bots = bender.editorBots,
			message = 'check if stylesheet is present in ' + name + ' combo\'s iframe';

		// Checks combo with given name in all editorBots available.
		for ( var bot in bots ) {
			bots[ bot ].combo( name, function( combo ) {
				var isPresent = searchForStylesheet( combo );

				assert.isTrue( isPresent, message );
			} );
		}
	}
} )();
