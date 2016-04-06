/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget,undo,basicstyles,clipboard,dialog,link,toolbar,stylescombo,font,colorbutton,language,indentblock */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	function selectEditable( editor, widget, editableName ) {
		var editable = widget.editables[ editableName ],
			range = editor.createRange();

		range.setStart( editable, 0 );
		range.select();
	}

	function selectElement( editor, elementName ) {
		editor.getSelection().selectElement( editor.editable().findOne( elementName ) );
	}

	function getItemElements( stylesCombo ) {
		var list = stylesCombo._.list,
			doc = list.element.getDocument(),
			items = list._.items,
			elements = [];

		for ( var value in items )
			elements.push( doc.getById( items[ value ] ) );

		return elements;
	}

	var getWidgetById = widgetTestsTools.getWidgetById;

	bender.test( {
		'test basic styles': function() {
			var editor = this.editor,
				cItalic = editor.getCommand( 'italic' ),
				cUnderline = editor.getCommand( 'underline' ),
				activeFilterChanged = 0;

			editor.widgets.add( 'testBasicStyles', {
				editables: {
					foo: '.foo',
					bar: {
						selector: '.bar',
						allowedContent: 'em'
					},
					bom: {
						selector: '.bom',
						allowedContent: 'u'
					}
				}
			} );

			this.editorBot.setData(
				'<p id="x">X</p>' +
				'<div id="w1" data-widget="testBasicStyles"><p class="foo">A</p><p class="bar">B</p><p class="bom">C</p></div>' +
				'<div id="w2" data-widget="testBasicStyles"><p class="foo">A</p><p class="bar">B</p><p class="bom">C</p></div>',
				function() {
					var w1 = getWidgetById( editor, 'w1' ),
						w2 = getWidgetById( editor, 'w2' );

					editor.on( 'activeFilterChange', function() {
						activeFilterChanged += 1;
					} );

					assertStates( 0, true, true, 'start' );

					selectEditable( editor, w1, 'foo' );
					assertStates( 0, true, true, 'in w1.foo' );

					selectEditable( editor, w1, 'bar' );
					assertStates( 1, true, false, 'in w1.bar' );

					selectEditable( editor, w1, 'bom' );
					assertStates( 3, false, true, 'in w1.bom' );

					// No filter change because the same type of editable.
					selectEditable( editor, w2, 'bom' );
					assertStates( 5, false, true, 'in w2.bom' );

					selectEditable( editor, w1, 'foo' );
					assertStates( 6, true, true, 'in w1.foo' );

					selectEditable( editor, w2, 'bar' );
					assertStates( 7, true, false, 'in w2.bar' );

					selectElement( editor, '#x' );
					assertStates( 8, true, true, 'in #x' );
				}
			);

			function assertStates( expectedActiveFilterChanged, italicIsEnabled, underlineIsEnabled, msg ) {
				msg += ' - ';

				assert.areSame( expectedActiveFilterChanged, activeFilterChanged, msg + 'active filter changed' );
				assert.areSame( italicIsEnabled ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, cItalic.state, msg + 'italic' );
				assert.areSame( underlineIsEnabled ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, cUnderline.state, msg + 'underline' );
			}
		},

		'test dialog': function() {
			var editor = this.editor,
				bot = this.editorBot;

			editor.widgets.add( 'testDialog', {
				editables: {
					foo: {
						selector: '.foo',
						allowedContent: 'a[href]'
					},
					bar: {
						selector: '.bar',
						allowedContent: 'a[href,id]'
					}
				}
			} );

			bot.setData(
				'<p id="x">X</p>' +
				'<div id="w1" data-widget="testDialog"><p class="foo">Foo</p><p class="bar">bar</p></div>',
				function() {
					var w1 = getWidgetById( editor, 'w1' );

					selectElement( editor, '#x' );
					checkDialog( [ true, true, true ], [ true, true, true ], function() {

						selectEditable( editor, w1, 'foo' );
						checkDialog( [ true, false, false ], [ true, false, false ], function() {

							selectEditable( editor, w1, 'bar' );
							checkDialog( [ true, false, true ], [ true, true, false ], function() {

								selectElement( editor, '#x' );
								checkDialog( [ true, true, true ], [ true, true, true ] );
							} );
						} );
					} );

					function checkDialog( tabStates, fieldStates, callback ) {
						bot.dialog( 'link', function( dialog ) {
							var tabs = dialog.parts.tabs.getChildren();

							assert.areSame( tabStates[ 0 ], !tabs.getItem( 0 ).hasClass( 'cke_dialog_tab_disabled' ), 'Tab info' );
							assert.areSame( tabStates[ 1 ], !tabs.getItem( 1 ).hasClass( 'cke_dialog_tab_disabled' ), 'Tab target' );
							assert.areSame( tabStates[ 2 ], !tabs.getItem( 3 ).hasClass( 'cke_dialog_tab_disabled' ), 'Tab advanced' );

							dialog.selectPage( 'target' );
							assert.areSame( tabStates[ 1 ] ? 'target' : 'info', dialog._.currentTabId, 'Tab should change only if it is available.' );

							assert.areSame( fieldStates[ 0 ], dialog.getContentElement( 'info', 'url' ).isEnabled(), 'info url' );
							assert.areSame( fieldStates[ 1 ], dialog.getContentElement( 'advanced', 'advId' ).isEnabled(), 'advanced Id' );
							assert.areSame( fieldStates[ 2 ], dialog.getContentElement( 'advanced', 'advName' ).isEnabled(), 'advanced Name' );

							dialog.getButton( 'cancel' ).click();

							if ( callback )
								callback();
						} );
					}
				} );
		},

		'test style combo': function() {
			var editor = this.editor,
				bot = this.editorBot;

			editor.widgets.add( 'testStyleCombo', {
				editables: {
					foo: {
						selector: '.foo',
						allowedContent: 'big'
					},
					bar: {
						selector: '.bar',
						allowedContent: 'a[href]'
					}
				}
			} );

			bot.setData(
				'<p id="x">X</p>' +
				'<div id="w1" data-widget="testStyleCombo"><p class="foo">Foo</p><p class="bar">bar</p></div>',
				function() {
					var w1 = getWidgetById( editor, 'w1' ),
						stylesCombo = editor.ui.get( 'Styles' );

					stylesCombo.createPanel( editor );

					selectElement( editor, '#x' );
					checkStylesCombo( CKEDITOR.TRISTATE_OFF, 17, 'x (1)' );

					selectEditable( editor, w1, 'foo' );
					checkStylesCombo( CKEDITOR.TRISTATE_OFF, 1, 'foo' );

					selectEditable( editor, w1, 'bar' );
					checkStylesCombo( CKEDITOR.TRISTATE_DISABLED, 0, 'bar' );

					selectElement( editor, '#x' );
					checkStylesCombo( CKEDITOR.TRISTATE_OFF, 17, 'x (2)' );

					function checkStylesCombo( state, stylesCount, msg ) {
						stylesCombo.onOpen( editor );

						assert.areSame( state, stylesCombo.getState(), msg + ' state' );

						var elements = getItemElements( stylesCombo ),
							count = 0;

						for ( var i in elements ) {
							if ( elements[ i ].getStyle( 'display' ) != 'none' )
								count++;
						}

						assert.areSame( stylesCount, count, msg + ' count' );
					}
				} );
		},

		'test update state': function() {
			var editor = this.editor,
				bot = this.editorBot;

			editor.widgets.add( 'testFontCombo', {
				editables: {
					none: {
						selector: '.none',
						allowedContent: 'p'
					},
					font: {
						selector: '.font',
						allowedContent: 'span{font-family,font-size}'
					},
					color: {
						selector: '.color',
						allowedContent: 'span{color,background-color}'
					},
					language: {
						selector: '.language',
						allowedContent: 'span[lang,dir]'
					},
					indent: {
						selector: '.indent',
						allowedContent: 'p{margin-left,margin-right}'
					},
					all: {
						selector: '.all',
						allowedContent: 'span{font-family,font-size,color,background-color}[lang,dir];p{margin-left,margin-right}'
					}
				}
			} );

			bot.setData(
				'<p id="x">X</p>' +
				'<div id="w1" data-widget="testFontCombo">' +
					'<div class="none">none</div>' +
					'<div class="font">font</div>' +
					'<div class="color">color</div>' +
					'<div class="indent">indent</div>' +
					'<div class="all">all</div>' +
				'</div>', function() {
					var w1 = getWidgetById( editor, 'w1' ),
						fontFamilyCombo = editor.ui.get( 'Font' ),
						fontSizeCombo = editor.ui.get( 'FontSize' ),
						textColor = editor.ui.get( 'TextColor' ),
						bgColor = editor.ui.get( 'BGColor' ),
						indent = editor.ui.get( 'Indent' );

					selectElement( editor, '#x' );

					checkState( 'x(1)', { font: true, size: true, color: true, bg: true, indent: true } );

					selectEditable( editor, w1, 'none' );

					checkState( 'none', {} );

					selectEditable( editor, w1, 'font' );

					checkState( 'font', { font: true, size: true } );

					selectEditable( editor, w1, 'color' );

					checkState( 'color', { color: true, bg: true } );

					selectEditable( editor, w1, 'indent' );

					checkState( 'indent', { indent: true } );

					selectEditable( editor, w1, 'all' );

					checkState( 'all', { font: true, size: true, color: true, bg: true, indent: true } );

					selectElement( editor, '#x' );

					checkState( 'x(2)', { font: true, size: true, color: true, bg: true, indent: true } );

					function checkState( elementName, expexted ) {
						assert.areSame( expexted.font ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
							fontFamilyCombo.getState(), elementName + ' - family ' + expexted.font );

						assert.areSame( expexted.size ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
							fontSizeCombo.getState(), elementName + ' - size ' + expexted.size );

						assert.areSame( expexted.color ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
							textColor.getState(), elementName + ' - text ' + expexted.color );

						assert.areSame( expexted.bg ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
							bgColor.getState(), elementName + ' - background ' + expexted.bg );

						assert.areSame( expexted.indent ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
							indent.getState(), elementName + ' - indent ' + expexted.indent );
					}
				} );
		}
	} );
} )();