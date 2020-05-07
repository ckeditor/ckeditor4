/* bender-tags: editor */
/* bender-ckeditor-plugins: colorbutton,toolbar,wysiwygarea */

( function() {
	'use strict';

	bender.editors = {
		normalizeBackground: {
			creator: 'inline',
			name: 'normalizeBackground',
			config: {
				colorButton_normalizeBackground: false,
				extraAllowedContent: 'span{background}'
			}
		},
		colorLabels: {
			creator: 'inline',
			name: 'colorLabels',
			config: {
				colorButton_colors: 'FontColor1/FF9900,FontColor2/0066CC,F00',
				language: 'en'
			}
		},
		colorAttributes: {
			creator: 'inline',
			name: 'colorAttributes',
			config: {
				colorButton_colors: 'text-red/F00,text-blue/00F',
				extraAllowedContent: 'span(*)',
				language: 'en',
				colorButton_foreStyle: {
					element: 'span',
					attributes: { 'class': '#(color)' },
					overrides: [ {
						element: 'span',
						attributes: {
							'class': /.text/
						}
					} ]
				}
			}
		},
		colorNameAttributes: {
			creator: 'inline',
			name: 'colorNameAttributes',
			config: {
				colorButton_colors: 'text-red/F00,text-blue/00F',
				extraAllowedContent: 'span(*)',
				language: 'en',
				colorButton_foreStyle: {
					element: 'span',
					attributes: { 'class': '#(colorName)' },
					overrides: [ {
						element: 'span',
						attributes: {
							'class': /.text/
						}
					} ]
				}
			}
		},
		colorNameAttributesBackground: {
			creator: 'inline',
			name: 'colorNameAttributesBackground',
			config: {
				colorButton_colors: 'bg-red/F00,bg-blue/00F',
				extraAllowedContent: 'span(*)',
				language: 'en',
				colorButton_backStyle: {
					element: 'span',
					attributes: { 'class': '#(colorName)' },
					overrides: [ {
						element: 'span',
						attributes: {
							'class': /.text/
						}
					} ]
				}
			}
		}
	};

	bender.test( {
		'test config.normalizeBackground': function() {
			var input = '<p><span style="background:#ff0000">foo</span><span style="background:yellow">bar</span></p>';

			assert.areSame( input, this.editors.normalizeBackground.dataProcessor.toHtml( input ) );
		},

		// (#2271)
		'test config.colorButton_colors labels': function() {
			var editor = this.editors.colorLabels,
				bgColorBtn = editor.ui.get( 'BGColor' ),
				expectedLabels = [ 'FontColor1', 'FontColor2', 'Red' ],
				colorOptions;

			// Editor needs a focus, otherwise IE/Edge throws permission error.
			editor.focus();
			bgColorBtn.click( editor );

			colorOptions = bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.find( 'a.cke_colorbox' );

			CKEDITOR.tools.array.map( colorOptions.toArray(), function( el, index ) {
				assert.areSame( expectedLabels[ index ], colorOptions.getItem( index ).getAttribute( 'title' ), 'Title for color at index ' + index );
			} );
		},

		// (#1478)
		'test config.colorButton_colors applies color': function() {
			var editor = this.editors.colorLabels,
				bgColorBtn = editor.ui.get( 'BGColor' ),
				filter = new CKEDITOR.htmlParser.filter( {
					text: function( value ) {
						return value.replace( '{', '[' ).replace( '}', ']' );
					},
					elements: {
						br: function() {
							return false;
						}
					}
				} ),
				colorSquare;

			bender.tools.selection.setWithHtml( editor, '<p>[foo]</p>' );

			editor.focus();
			bgColorBtn.click( editor );

			colorSquare = bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.findOne( 'a.cke_colorbox[data-value=FF9900]' );

			colorSquare.$.onclick();

			assert.beautified.html( bender.tools.selection.getWithHtml( editor ), '<p><span style="background-color:#ff9900;">[foo]</span></p>', {
				customFilters: [ filter ],
				fixStyles: true
			} );
		},

		// (#3490)
		'test config.colorButton_foreStyle with color attribute': function() {
			var editor = this.editors.colorAttributes,
				textColorBtn = editor.ui.get( 'TextColor' ),
				filter = new CKEDITOR.htmlParser.filter( {
					text: function( value ) {
						return value.replace( '{', '[' ).replace( '}', ']' );
					},
					elements: {
						br: function() {
							return false;
						}
					}
				} ),
				colorSquare;

			bender.tools.selection.setWithHtml( editor, '<p>foo [bar] baz</p>' );

			editor.focus();
			textColorBtn.click( editor );

			colorSquare = textColorBtn._.panel.getBlock( textColorBtn._.id ).element.findOne( 'a.cke_colorbox[data-value=F00]' );

			colorSquare.$.onclick();

			assert.beautified.html( bender.tools.selection.getWithHtml( editor ), '<p>foo <span class="#F00">[bar]</span> baz</p>', {
				customFilters: [ filter ],
				fixStyles: true
			} );
		},

		// (#3490)
		'test config.colorButton_foreStyle with colorName attribute': function() {
			var editor = this.editors.colorNameAttributes,
				textColorBtn = editor.ui.get( 'TextColor' ),
				filter = new CKEDITOR.htmlParser.filter( {
					text: function( value ) {
						return value.replace( '{', '[' ).replace( '}', ']' );
					},
					elements: {
						br: function() {
							return false;
						}
					}
				} ),
				colorSquare;

			bender.tools.selection.setWithHtml( editor, '<p>foo [bar] baz</p>' );

			editor.focus();
			textColorBtn.click( editor );

			colorSquare = textColorBtn._.panel.getBlock( textColorBtn._.id ).element.findOne( 'a.cke_colorbox[data-value=F00]' );

			colorSquare.$.onclick();

			assert.beautified.html( bender.tools.selection.getWithHtml( editor ), '<p>foo <span class="text-red">[bar]</span> baz</p>', {
				customFilters: [ filter ],
				fixStyles: true
			} );
		},

		// (#3490)
		'test config.colorButton_backStyle with colorName attribute': function() {
			var editor = this.editors.colorNameAttributesBackground,
				backColorBtn = editor.ui.get( 'BGColor' ),
				filter = new CKEDITOR.htmlParser.filter( {
					text: function( value ) {
						return value.replace( '{', '[' ).replace( '}', ']' );
					},
					elements: {
						br: function() {
							return false;
						}
					}
				} ),
				colorSquare;

			bender.tools.selection.setWithHtml( editor, '<p>foo [bar] baz</p>' );

			editor.focus();
			backColorBtn.click( editor );

			colorSquare = backColorBtn._.panel.getBlock( backColorBtn._.id ).element.findOne( 'a.cke_colorbox[data-value=F00]' );

			colorSquare.$.onclick();

			assert.beautified.html( bender.tools.selection.getWithHtml( editor ), '<p>foo <span class="bg-red">[bar]</span> baz</p>', {
				customFilters: [ filter ],
				fixStyles: true
			} );
		}
	} );
} )();
