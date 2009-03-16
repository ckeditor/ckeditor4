/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'format', {
	requires: [ 'richcombo', 'styles' ],

	init: function( editor ) {
		var config = editor.config,
			lang = editor.lang.format;

		var saveRanges;

		// Gets the list of tags from the settings.
		var tags = config.format_tags.split( ';' );

		// Create style objects for all defined styles.
		var styles = {};
		for ( var i = 0; i < tags.length; i++ ) {
			var tag = tags[ i ];
			styles[ tag ] = new CKEDITOR.style( config[ 'format_' + tag ] );
		}

		editor.ui.addRichCombo( 'Format', {
			label: lang.label,
			title: lang.panelTitle,
			className: 'cke_format',
			multiSelect: false,

			panel: {
				css: [ config.contentsCss, CKEDITOR.getUrl( editor.skinPath + 'editor.css' ) ]
			},

			init: function() {
				this.startGroup( lang.panelTitle );

				for ( var tag in styles ) {
					var label = lang[ 'tag_' + tag ];

					// Add the tag entry to the panel list.
					this.add( tag, '<' + tag + '>' + label + '</' + tag + '>', label );
				}
			},

			onClick: function( value ) {
				editor.focus();

				if ( saveRanges ) {
					editor.getSelection().selectRanges( saveRanges );
					saveRanges = false;
				}

				styles[ value ].apply( editor.document );
			},

			onRender: function() {
				editor.on( 'selectionChange', function( ev ) {
					var currentTag = this.getValue();

					var elementPath = ev.data.path;

					for ( var tag in styles ) {
						if ( styles[ tag ].checkActive( elementPath ) ) {
							if ( tag != currentTag )
								this.setValue( tag, editor.lang.format[ 'tag_' + tag ] );
							return;
						}
					}

					// If no styles match, just empty it.
					this.setValue( '' );
				}, this );
			},

			onOpen: function() {
				if ( CKEDITOR.env.ie ) {
					editor.focus();
					saveRanges = editor.getSelection().getRanges();
				}
			},

			onClose: function() {
				saveRanges = null;
			}
		});
	}
});

CKEDITOR.config.format_tags = 'p;h1;h2;h3;h4;h5;h6;pre;address;div';

CKEDITOR.config.format_p = { element: 'p' };
CKEDITOR.config.format_div = { element: 'div' };
CKEDITOR.config.format_pre = { element: 'pre' };
CKEDITOR.config.format_address = { element: 'address' };
CKEDITOR.config.format_h1 = { element: 'h1' };
CKEDITOR.config.format_h2 = { element: 'h2' };
CKEDITOR.config.format_h3 = { element: 'h3' };
CKEDITOR.config.format_h4 = { element: 'h4' };
CKEDITOR.config.format_h5 = { element: 'h5' };
CKEDITOR.config.format_h6 = { element: 'h6' };
