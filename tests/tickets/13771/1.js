/* bender-tags: 13771, config, font, format, stylescombo */
/* bender-ckeditor-plugins: font, format, stylescombo, toolbar */


( function() {
	'use strict';

	bender.editor = {
		creator: 'inline',
		config: {
			toolbar: [ [ 'Font', 'FontSize', 'Format', 'Styles' ] ]
		}
	};

	bender.test( {
		'check if font combo loads proper stylesheet': function() {
			var bot = this.editorBot,
				name = 'Font';

			bot.combo( name, function( combo ) {
				var isPresent = searchForStylesheet( combo );

				assert.isTrue( isPresent, 'check if stylesheet is present in font combo\'s iframe' );
			} );
		},

		'check if font size combo loads proper stylesheet': function() {
			var bot = this.editorBot,
				name = 'FontSize';

			bot.combo( name, function( combo ) {
				var isPresent = searchForStylesheet( combo );

				assert.isTrue( isPresent, 'check if stylesheet is present in font size combo\'s iframe' );
			} );
		},

		'check if format combo loads proper stylesheet': function() {
			var bot = this.editorBot,
				name = 'Format';

			bot.combo( name, function( combo ) {
				var isPresent = searchForStylesheet( combo );

				assert.isTrue( isPresent, 'check if stylesheet is present in format combo\'s iframe' );
			} );
		},

		'check if styles combo loads proper stylesheet': function() {
			var bot = this.editorBot,
				name = 'Styles';

			bot.combo( name, function( combo ) {
				var isPresent = searchForStylesheet( combo );

				assert.isTrue( isPresent, 'check if stylesheet is present in styles combo\'s iframe' );
			} );
		}
	} );

	function searchForStylesheet( combo ) {
		var panel = combo._.panel,
			comboIframe = panel.element.$.firstChild,
			comboContent = comboIframe.contentWindow.document,
			stylesheets = comboContent.getElementsByTagName( 'link' );

		for ( var i = 0; i < stylesheets.length; ++i ) {
			var stylesheet = stylesheets[i],
				rel = stylesheet.rel,
				href = stylesheet.getAttribute( 'href' );

			if ( rel.toLowerCase() !== 'stylesheet' )
				continue;

			if ( href.indexOf( 'contents.css' ) !== -1 )
				return true;
		}

		return false;
	}
} )();
