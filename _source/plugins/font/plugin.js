/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	function addCombo( editor, comboName, styleType, lang, entries, defaultLabel, styleDefinition ) {
		var config = editor.config;

		// Gets the list of fonts from the settings.
		var names = entries.split( ';' ),
			values = [];

		// Create style objects for all fonts.
		var styles = {};
		for ( var i = 0; i < names.length; i++ ) {
			var vars = {};
			var parts = names[ i ].split( '/' );

			var name = names[ i ] = parts[ 0 ];
			vars[ styleType ] = values[ i ] = parts[ 1 ] || name;

			styles[ name ] = new CKEDITOR.style( styleDefinition, vars );
		}

		editor.ui.addRichCombo( comboName, {
			label: lang.label,
			title: lang.panelTitle,
			voiceLabel: lang.voiceLabel,
			className: 'cke_' + ( styleType == 'size' ? 'fontSize' : 'font' ),
			multiSelect: false,

			panel: {
				css: [ config.contentsCss, CKEDITOR.getUrl( editor.skinPath + 'editor.css' ) ],
				voiceLabel: lang.panelVoiceLabel
			},

			init: function() {
				this.startGroup( lang.panelTitle );

				for ( var i = 0; i < names.length; i++ ) {
					var name = names[ i ];

					// Add the tag entry to the panel list.
					this.add( name, '<span style="font-' + styleType + ':' + values[ i ] + '">' + name + '</span>', name );
				}
			},

			onClick: function( value ) {
				editor.focus();
				editor.fire( 'saveSnapshot' );

				var style = styles[ value ];

				if ( this.getValue() == value )
					style.remove( editor.document );
				else
					style.apply( editor.document );

				editor.fire( 'saveSnapshot' );
			},

			onRender: function() {
				editor.on( 'selectionChange', function( ev ) {
					var currentValue = this.getValue();

					var elementPath = ev.data.path,
						elements = elementPath.elements;

					// For each element into the elements path.
					for ( var i = 0, element; i < elements.length; i++ ) {
						element = elements[ i ];

						// Check if the element is removable by any of
						// the styles.
						for ( var value in styles ) {
							if ( styles[ value ].checkElementRemovable( element, true ) ) {
								if ( value != currentValue )
									this.setValue( value );
								return;
							}
						}
					}

					// If no styles match, just empty it.
					this.setValue( '', defaultLabel );
				}, this );
			}
		});
	}

	CKEDITOR.plugins.add( 'font', {
		requires: [ 'richcombo', 'styles' ],

		init: function( editor ) {
			var config = editor.config;

			addCombo( editor, 'Font', 'family', editor.lang.font, config.font_names, config.font_defaultLabel, config.font_style );
			addCombo( editor, 'FontSize', 'size', editor.lang.fontSize, config.fontSize_sizes, config.fontSize_defaultLabel, config.fontSize_style );
		}
	});
})();

// Font settings.

CKEDITOR.config.font_names = 'Arial/Arial, Helvetica, sans-serif;' +
	'Comic Sans MS/Comic Sans MS, cursive;' +
	'Courier New/Courier New, Courier, monospace;' +
	'Georgia/Georgia, serif;' +
	'Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;' +
	'Tahoma/Tahoma, Geneva, sans-serif;' +
	'Times New Roman/Times New Roman, Times, serif;' +
	'Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;' +
	'Verdana/Verdana, Geneva, sans-serif';

CKEDITOR.config.font_defaultLabel = '';
CKEDITOR.config.font_style = {
	element: 'span',
	styles: { 'font-family': '#(family)' },
	overrides: [ {
		element: 'font', attributes: { 'face': null }
	}]
};

// Font Size setting.

CKEDITOR.config.fontSize_sizes = '8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px';

CKEDITOR.config.fontSize_defaultLabel = '';
CKEDITOR.config.fontSize_style = {
	element: 'span',
	styles: { 'font-size': '#(size)' },
	overrides: [ {
		element: 'font', attributes: { 'face': null }
	}]
};
