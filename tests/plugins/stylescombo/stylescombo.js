/* bender-tags: editor */
/* bender-ckeditor-plugins: richcombo,format,stylescombo,font,toolbar */

( function() {
	'use strict';

	bender.editor = {
		config: {
			stylesSet: 'tester'
		}
	};

	var testStyles = [],
		blockNames = [],
		inlineNames = [],
		isBlock, name, i;

	// Prepare some block and inline styles to be set.
	for ( i = 0 ; i < 100 ; i++ ) {
		name = 'style#' + i;
		isBlock = Math.random() > 0.5;

		testStyles.push( { name: name, element: isBlock ? 'h1' : 'span', styles: {
			'background-color': isBlock ? 'red' : 'green'
		} } );

		// Store style names in order for further check.
		( isBlock ? blockNames : inlineNames ).push( name );
	}

	// Set prepared stylesSet.
	CKEDITOR.stylesSet.add( 'tester', testStyles );

	bender.test( {
		'test display order of a custom styleSet': function() {
			var editor = this.editor,
				stylesCombo = editor.ui.get( 'Styles' );

			stylesCombo.createPanel( editor );

			var items = stylesCombo._.items,
				keys = [],
				i = 0;

			// Fetch keys only.
			for ( keys[ i++ ] in items ); // jshint ignore:line

			assert.areEqual( testStyles.length, keys.length, 'A number of styles matches.' );
			arrayAssert.itemsAreSame( blockNames.concat( inlineNames ), keys, 'Styles are in ascending order, grouped.' );
		},

		'test external styles are registerd in ACF': function() {
			bender.editorBot.create( {
				name: 'editor_external_styles',
				config: {
					// Reuse custom styles from core/editor/styleset.js TC.
					stylesSet: 'external:%BASE_PATH%_assets/custom_styles.js'
				}
			}, function( bot ) {
				assert.areSame( '<h2 style="font-style:italic">A</h2><p>X<big>Y</big>Z</p>',
					bot.editor.dataProcessor.toHtml( '<h2 style="font-style:italic">A</h2><p>X<big>Y</big>Z</p>' ) );
			} );
		},

		// #646
		'test for applying style without selection': function() {
			bender.editorBot.create( {
				name: 'style_error',
				config: {
					removePlugins: 'format,font'
				}
			}, function( bot ) {
				var editor = bot.editor;
				var selection = editor.getSelection();

				// During opening combo selection is modified, what force selection to be at the beginning of editable.
				// Stub resets native selection before every execution of `getNative`, to properly simulate error case.
				var stub = sinon.stub( CKEDITOR.dom.selection.prototype, 'getNative', function() {
					if ( typeof window.getSelection != 'function' ) {
						this.document.$.selection.empty();
						return this.document.$.selection;
					}
					this.document.getWindow().$.getSelection().removeAllRanges();
					return this.document.getWindow().$.getSelection();

				} );

				selection.removeAllRanges();
				selection.reset();
				try {
					bot.combo( 'Styles', function() {
						assert.pass();
					} );
				} finally {
					stub.restore();
				}

			} );
		},

		// #862
		'test visible object styles on list items': function() {
			bender.editorBot.create( {
				name: 'object_styles',
				config: {
					removePlugins: 'format,font',
					language: 'en'
				}
			}, function( bot ) {

				bot.setHtmlWithSelection( '<ul><li>o^ne</li><li>two</li></ul>' );

				bot.combo( 'Styles', function( combo ) {
					var list = combo._.list.element;
					var squareOptionId = combo._.list._.items[ 'Square Bulleted List' ] ;

					assert.isNotNull( list.findOne( '#' + squareOptionId ), 'Square Bulleted List should be avialable.' );
					assert.areNotSame( 'none', list.findOne( '#' + squareOptionId ).getStyle( 'display' ).toLowerCase(),
						'Element with ID: #' + squareOptionId + ', should be displayed.' );
				} );
			} );
		},

		// (#3649)
		'test removeStyles event': function() {
			testCombo( {
				html: '<p>[hello world!]</p>',
				combo: 'Styles',
				option: 'Marker',
				result: '<p>hello world!</p>',
				callback: function( editor ) {
					editor.fire( 'stylesRemove' );
				}
			} );
		},

		// (#3649)
		'test removeStyles event with specific type': function() {
			testCombo( {
				html: '<h1>[hello world!]</h1>',
				combo: 'Styles',
				option: 'Italic Title',
				result: '<p>hello world!</p>',
				callback: function( editor ) {
					editor.fire( 'stylesRemove', { type: CKEDITOR.STYLE_BLOCK } );
				}
			} );
		},

		// (#3649)
		'test removeStyles event with different type': function() {
			testCombo( {
				html: '<p>[hello world!]</p>',
				combo: 'Styles',
				option: 'Marker',
				result: '<p><span class="marker">hello world!</span></p>',
				callback: function( editor ) {
					editor.fire( 'stylesRemove', { type: CKEDITOR.STYLE_BLOCK } );
				}
			} );
		},

		// (#3649)
		'test inline styles are preserved when a format is picked': function() {
			testCombo( {
				html: '<h1><span style="font-family:Courier New,Courier,monospace;">[hello world!]</span></h1>',
				combo: 'Format',
				option: 'p',
				result: '<p><span style="font-family:courier new,courier,monospace;">hello world!</span></p>'
			} );
		},

		// (#3649)
		'test inline styles are preserved when a style is picked': function() {
			testCombo( {
				html: '<h1><span style="font-family:Courier New,Courier,monospace;">[hello world!]</span></h1>',
				combo: 'Styles',
				option: 'Italic Title',
				result: '<h2 style="font-style:italic;"><span style="font-family:courier new,courier,monospace;">hello world!</span></h2>'
			} );
		},

		// (#3649)
		'test applying the style from Styles dropdown replaces the current format': function() {
			testCombo( {
				html: '<h1>[hello world!]</h1>',
				combo: 'Styles',
				option: 'Italic Title',
				result: '<h2 style="font-style:italic;">hello world!</h2>'
			} );
		},

		// (#3649)
		'test style is removed when the current format is applied': function() {
			testCombo( {
				html: '<h2 style="font-style:italic;">[hello world!]</h2>',
				combo: 'Format',
				option: 'h2',
				result: '<h2>hello world!</h2>'
			} );
		},

		// (#3649)
		'test style is toggled when reapplied': function() {
			testCombo( {
				html: '<h2 style="font-style:italic;">[hello world!]</h2>',
				combo: 'Styles',
				option: 'Italic Title',
				result: '<p>hello world!</p>'
			} );
		},

		// (#3649)
		'test inline style is untouched when block style is toggled': function() {
			testCombo( {
				html: '<h2 style="font-style:italic;"><big>[hello world!]</big></h2>',
				combo: 'Styles',
				option: 'Italic Title',
				result: '<p><big>hello world!</big></p>'
			} );
		},

		// (#3649)
		'test custom attribute is not removed when style is applied': function() {
			testCombo( {
				html: '<h2 custom-attribute>[hello world!]</h2>',
				combo: 'Styles',
				option: 'Italic Title',
				result: '<h2 style="font-style:italic;" custom-attribute>hello world!</h2>'
			} );
		},

		// (#3649)
		'test custom attribute is not removed when format is applied': function() {
			testCombo( {
				html: '<h2 custom-attribute>[hello world!]</h2>',
				combo: 'Format',
				option: 'p',
				result: '<p custom-attribute>hello world!</p>'
			} );
		},

		// (#3649)
		'test removing block style with format combo': function() {
			testCombo( {
				html: '<h2 style="font-style:italic;">[hello world!]</h2>',
				combo: 'Format',
				option: 'p',
				result: '<p>hello world!</p>'
			} );
		},

		// (#3649)
		'test inline dropdown style is preserved when a format is picked': function() {
			testCombo( {
				html: '<h1><span class="marker">[hello world!]</span></h1>',
				combo: 'Format',
				option: 'p',
				result: '<p><span class="marker">hello world!</span></p>'
			} );
		},

		// (#3649)
		'test a new style overrides the previous one correctly': function() {
			// IE produces different HTML for colors.
			if ( CKEDITOR.env.ie ) {
				assert.ignore();
			}

			testCombo( {
				html: '<h2 style="font-style:italic;">[hello world!]</h2>',
				combo: 'Styles',
				option: 'Special Container',
				result: '<div style="background:#eeeeee;border:1px solid #cccccc;padding:5px 10px;">hello world!</div>'
			} );
		}
	} );

	function testCombo( options ) {
		bender.editorBot.create( {
			name: 'editor' + ( new Date() ).getTime()
		}, function( bot ) {
			bot.setHtmlWithSelection( options.html );

			bot.combo( options.combo, function( combo ) {
				combo.onClick( options.option );

				if ( options.callback ) {
					options.callback( bot.editor );
				}

				assert.beautified.html( options.result, bender.tools.fixHtml( bot.editor.getData() ), 'Editor content is incorrect.' );
			} );
		} );
	}
} )();
