/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget,undo */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true,
			on: {
				instanceReady: function( evt ) {
					evt.editor.dataProcessor.writer.sortAttributes = 1;
				}
			}
		}
	};

	var fixHtml = widgetTestsTools.fixHtml,
		getWidgetById = widgetTestsTools.getWidgetById;

	bender.test( {
		// (#3240)
		// This test needs to be the first because it uses 'elementFromPoint()' method
		// which on IE breaks if there is any message about earlier tests displayed.
		'test partial mask': function() {
			var editor = this.editor;

			var widgetDef = {
				mask: 'bar',

				parts: {
					foo: '#foo',
					bar: '#bar',
					cksource: '#cksource'
				},

				editables: {
					editable1: '#foo',
					editable2: '#bar',
					editable3: '#cksource'
				}
			};

			editor.widgets.add( 'testPartialMask', widgetDef );

			this.editorBot.setData( '<div data-widget="testPartialMask" id="widget">' +
				'<p id="foo">foo</p><p id="bar">bar</p><p id="cksource">cksource</p></div>',
				function() {
					var element = editor.document.getById( 'widget' ),
						widget = editor.widgets.getByElement( element ),
						firstEditable = editor.document.$.elementFromPoint( 40, 45 ),
						secondEditable = editor.document.$.elementFromPoint( 40, 60 ),
						thirdEditable = editor.document.$.elementFromPoint( 40, 80 );

					assert.isNull( widget.wrapper.findOne( '.cke_widget_mask' ), 'Complete mask was created instead of partial.' );
					assert.isInstanceOf( CKEDITOR.dom.element, widget.wrapper.findOne( '.cke_widget_partial_mask' ), 'Mask element was not found.' );

					if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 8 ) {
						assert.areSame( 'foobarcksource', firstEditable.innerText, 'Mask covers the first editable instead of the second.' );
						assert.areSame( '', secondEditable.innerText, 'Mask doesn\'t cover the second editable.' );
						assert.areSame( 'foobarcksource', thirdEditable.innerText, 'Mask covers the third editable instead of the second.' );
					} else {
						assert.areSame( 'div', firstEditable.localName, 'Mask covers the first editable instead of the second.' );
						assert.areSame( 'img', secondEditable.localName, 'Mask doesn\'t cover the second editable.' );
						assert.areSame( 'div', thirdEditable.localName, 'Mask covers the third editable instead of the second.' );
					}
				}
			);
		},

		'test mask': function() {
			var editor = this.editor;

			editor.widgets.add( 'testmask1', {
				mask: true
			} );

			this.editorBot.setData( '<p>foo</p><p data-widget="testmask1" id="w1">bar</p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				assert.isTrue( !!widget.mask, 'mask is set' );
				assert.areSame( widget.wrapper, widget.mask.getParent(), 'mask is a wrapper\'s child' );
			} );
		},

		'test basics': function() {
			var editor = this.editor;

			var widgetDef = {
				foo: 1
			};

			var regWidgetDef = editor.widgets.add( 'testbasics1', widgetDef );

			assert.areNotSame( regWidgetDef, widgetDef, 'registered widget def and passed widget def are not the same object' );
			assert.areSame( regWidgetDef, editor.widgets.registered.testbasics1, 'registered and returned' );
			assert.areSame( 1, regWidgetDef.foo, 'foo' );
			assert.areSame( 'testbasics1', regWidgetDef.name, 'name' );
		},

		'test references are broken': function() {
			var editor = this.editor;

			var widgetDef = {
				foo: 1,
				defaults: { foo: 1 }
			};

			editor.widgets.add( 'testrefs1', widgetDef );

			this.editorBot.setData( '<p>X<b data-widget="testrefs1" id="x">foo</b><b data-widget="testrefs1" id="y">bar</b>X</p>', function() {
				var widget1 = editor.widgets.getByElement( editor.document.getById( 'x' ) ),
					widget2 = editor.widgets.getByElement( editor.document.getById( 'y' ) ),
					def = editor.widgets.registered.testrefs1;

				assert.areNotSame( widget1, def, 'widget & def' );
				assert.areNotSame( widget1._, def._, 'priv objects' );
				assert.areNotSame( widget1.data, def.defaults, 'widget.data & def.defaults' );

				assert.areNotSame( widget1, widget2, 'widget & widget2' );
				assert.areNotSame( widget1._, widget2._, 'widget._ & widget2._' );
				assert.areNotSame( widget1.data, widget2.defaults, 'widget.data & widget2.defaults' );
			} );
		},

		'test upcasting': function() {
			bender.editorBot.create( {
				name: 'editor_up1',
				config: { allowedContent: true }
			}, function( bot ) {
				var editor = bot.editor,
					dataP = editor.dataProcessor;

				var widgetDef = {
					upcasts: {
						b: function( el ) {
							return el.name == 'b';
						},
						i: function( el ) {
							return el.name == 'i';
						},
						u: function( el ) {
							return el.name == 'u';
						}
					}
				};

				editor.once( 'widgetDefinition', function( evt ) {
					evt.data.upcast = 'b,i';
				} );

				editor.widgets.add( 'testup1', widgetDef );

				// jscs:disable maximumLineLength
				assert.isMatching( /^<p>foo<span .*data-cke-widget-wrapper="1".*><b data-cke-widget-data="%7B%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="testup1">bar<\/b><\/span><\/p>$/,
					fixHtml( dataP.toHtml( '<p>foo<b>bar</b></p>' ) ),										'upcast b' );

				assert.isMatching( /^<p>foo<span .*data-cke-widget-wrapper="1".*><b data-cke-widget-keep-attr="1" data-widget="testup1" foo="1">bar<\/b><\/span><\/p>$/,
					fixHtml( dataP.toHtml( '<p>foo<b data-widget="testup1" foo="1">bar</b></p>' ) ),		'b was already upcasted' );

				assert.isMatching( /^<p>foo<span .*data-cke-widget-wrapper="1".*><i data-cke-widget-data="%7B%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="testup1" foo="1">bar<\/i><\/span><\/p>$/,
					fixHtml( dataP.toHtml( '<p>foo<i foo="1">bar</i></p>' ) ),								'upcast i' );

				assert.isMatching( /^<p>foo<u foo="1">bar<\/u><\/p>$/,
					fixHtml( dataP.toHtml( '<p>foo<u foo="1">bar</u></p>' ) ),								'do not upcast u' );

				assert.isMatching( /^<p>foo<span .*data-cke-widget-wrapper="1".*><u data-cke-widget-keep-attr="1" data-widget="testup1">bar<\/u><\/span><\/p>$/,
					fixHtml( dataP.toHtml( '<p>foo<u data-widget="testup1">bar</u></p>' ) ),				'do not block upcasted u' );

				assert.isMatching( /^<p>foo<span .*data-cke-widget-wrapper="1".*><u data-cke-widget-keep-attr="1" data-widget="testup1">b<i><b>a<\/b>r<\/i><\/u><\/span><\/p>$/,
					fixHtml( dataP.toHtml( '<p>foo<u data-widget="testup1">b<i><b>a</b>r</i></u></p>' ) ),	'do upcast b&i in widget' );

				assert.isMatching( /^<p>foo<span .*data-cke-widget-wrapper="1".*><b data-cke-widget-data="%7B%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="testup1"><i>bar<\/i><\/b><\/span><\/p>$/,
					fixHtml( dataP.toHtml( '<p>foo<b><i>bar</i></b></p>' ) ),								'do upcast twice' );
				// jscs:enable maximumLineLength
			} );
		},

		'test upcasting with single rule': function() {
			bender.editorBot.create( {
				name: 'editor_up2',
				config: { allowedContent: true }
			}, function( bot ) {
				var editor = bot.editor,
					dataP = editor.dataProcessor;

				var widgetDef = {
					upcast: function( el ) {
						return el.name == 'b';
					}
				};

				editor.widgets.add( 'testup2', widgetDef );

				// jscs:disable maximumLineLength
				assert.isMatching( /^<p>foo<span .*data-cke-widget-wrapper="1".*><b data-cke-widget-data="%7B%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="testup2">bar<\/b><\/span><\/p>$/,
					fixHtml( dataP.toHtml( '<p>foo<b>bar</b></p>' ) ),										'upcast b' );

				assert.isMatching( /^<p>foo<span .*data-cke-widget-wrapper="1".*><u data-cke-widget-keep-attr="1" data-widget="testup2">bar<\/u><\/span><\/p>$/,
					fixHtml( dataP.toHtml( '<p>foo<u data-widget="testup2">bar</u></p>' ) ),				'pass upcasted u' );

				assert.isMatching( /^<p>foo<u foo="1">bar<\/u><\/p>$/,
					fixHtml( dataP.toHtml( '<p>foo<u foo="1">bar</u></p>' ) ),								'do not upcast u' );
				// jscs:enable maximumLineLength
			} );
		},

		'test upcasting with DOM change': function() {
			bender.editorBot.create( {
				name: 'editor_up3',
				config: { allowedContent: true }
			}, function( bot ) {
				var editor = bot.editor,
					dataP = editor.dataProcessor;

				var widgetDef = {
					upcast: function( el ) {
						if ( el.name == 'b' )
							return el.wrapWith( new CKEDITOR.htmlParser.element( 'i' ) );
					}
				};

				editor.widgets.add( 'testup3', widgetDef );

				// jscs:disable maximumLineLength
				assert.isMatching( /^<p>foo<span .*data-cke-widget-wrapper="1".*><i data-cke-widget-data="%7B%7D" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="testup3"><b>bar<\/b><\/i><\/span><\/p>$/,
					fixHtml( dataP.toHtml( '<p>foo<b>bar</b></p>' ) ),										'upcast b' );
				// jscs:enable maximumLineLength
			} );
		},

		'test setting data while upcasting': function() {
			bender.editorBot.create( {
				name: 'editor_up4',
				config: { allowedContent: true }
			}, function( bot ) {
				var editor = bot.editor,
					i = 0,
					dataValues = [],
					dataValues2 = [];

				var widgetDef = {
					defaults: {
						value: 'foo',
						value2: 1
					},
					data: function() {
						dataValues.push( this.data.value );
						dataValues2.push( this.data.value2 );
					},
					upcast: function( el, data ) {
						if ( el.name == 'b' ) {
							data.value = 'bar' + ( ++i );
							return true;
						}
					}
				};

				editor.widgets.add( 'testup4', widgetDef );

				bot.setData( '<p><b>A</b>X<b>B</b></p>', function() {
					assert.areSame( 'bar1,bar2', dataValues.sort().join( ',' ), 'data.value were set' );
					assert.areSame( '1,1', dataValues2.sort().join( ',' ), 'data.value2 were used from defaults' );
				} );
			} );
		},

		'test which element are tested by upcast methods': function() {
			var editor = this.editor,
				elNames = [];

			editor.widgets.add( 'test_up5', {
				upcast: function( el ) {
					elNames.push( el.name );
				}
			} );

			this.editorBot.setData( '<p>x<b>y</b></p><div>z</div>', function() {
				assert.areSame( 'p,b,div', elNames.join( ',' ), 'all editable\'s element ancestor' );
			} );
		},

		'test no downcasts': function() {
			var editor = this.editor;

			var widgetDef = {};

			editor.widgets.add( 'testtpl2', widgetDef );

			this.editorBot.setData( '<p>X<b data-widget="testtpl2" foo="1">bar</b>X</p>', function() {
				assert.areSame( '<p>X<b data-widget="testtpl2" foo="1">bar</b>X</p>', editor.getData() );
			} );
		},

		'test downcasting': function() {
			bender.editorBot.create( {
				name: 'editor_down1',
				config: { allowedContent: true }
			}, function( bot ) {
				var editor = bot.editor;

				var widgetDef = {
					downcasts: {
						down1: function() {
							return CKEDITOR.htmlParser.fragment.fromHtml( 'foo', 'b' );
						},
						down2: function( el ) {
							assert.areSame( 'testdown2', el.attributes[ 'data-widget' ], 'element passed as 1st arg' );

							assert.areSame( 'u', this.element.getName(), 'widget instance is a context' );

							return CKEDITOR.htmlParser.fragment.fromHtml( 'bar', 'i' );
						},
						down3: function( el ) {
							el.attributes.foo = '1';
							el.name = 'b';
						}
					}
				};

				// No downcasting
				editor.widgets.add( 'testdown1', widgetDef );

				// Downcast to <i>bar</i>
				editor.once( 'widgetDefinition', function( evt ) {
					evt.data.downcast = 'down2';
				} );
				editor.widgets.add( 'testdown2', widgetDef );

				// Downcast with no return
				editor.once( 'widgetDefinition', function( evt ) {
					evt.data.downcast = evt.data.downcasts.down3;
				} );
				editor.widgets.add( 'testdown3', widgetDef );

				bot.setData( '<p>X<u data-widget="testdown1">A</u>B<u data-widget="testdown2">C</u>D<u data-widget="testdown3">E</u>X</p>', function() {
					assert.areSame( '<p>X<u data-widget="testdown1">A</u>B<i>bar</i>D<b data-widget="testdown3" foo="1">E</b>X</p>', editor.getData() );
				} );
			} );
		},

		'test downcasting with single rule': function() {
			bender.editorBot.create( {
				name: 'editor_down5',
				config: { allowedContent: true }
			}, function( bot ) {
				var editor = bot.editor;

				var widgetDef = {
					downcast: function( el ) {
						el.attributes.foo = '1';
					}
				};

				editor.widgets.add( 'testdown5', widgetDef );

				bot.setData( '<p>X<u data-widget="testdown5">A</u>X</p>', function() {
					assert.areSame( '<p>X<u data-widget="testdown5" foo="1">A</u>X</p>', editor.getData() );
				} );
			} );
		},

		'test correct cleanup when downcasting with element replace': function() {
			bender.editorBot.create( {
				name: 'editor_down6',
				config: { allowedContent: true }
			}, function( bot ) {
				var editor = bot.editor;

				var widgetDef = {
					upcast: function( el ) {
						return el.name == 'u';
					},
					downcast: function( el ) {
						return el.wrapWith( new CKEDITOR.htmlParser.element( 'i' ) );
					}
				};

				editor.widgets.add( 'testdown6', widgetDef );

				bot.setData( '<p>X<u foo="1">A</u>X</p>', function() {
					assert.areSame( '<p>X<i><u foo="1">A</u></i>X</p>', editor.getData() );
				} );
			} );
		},

		'test parts': function() {
			var editor = this.editor,
				fooInInit;

			var widgetDef = {
				init: function() {
					fooInInit = this.parts.foo;
				},

				parts: {
					foo: 'b',
					bar: '#eli',
					xxx: '#xxx',
					p: 'p'
				}
			};

			editor.widgets.add( 'testparts1', widgetDef );

			this.editorBot.setData( '<p data-widget="testparts1" id="x"><b>foo</b><i id="eli">bar</i></p>', function() {
				var elP = editor.document.getById( 'x' ),
					widget = editor.widgets.getByElement( elP );

				assert.areSame( elP.getElementsByTag( 'b' ).getItem( 0 ), widget.parts.foo, 'foo' );
				assert.areSame( elP.getElementsByTag( 'i' ).getItem( 0 ), widget.parts.bar, 'bar' );
				assert.isNull( widget.parts.xxx, 'xxx' );
				assert.areSame( elP, widget.parts.p, 'p' );
				assert.areSame( elP.getElementsByTag( 'b' ).getItem( 0 ), fooInInit, 'parts are already ready when init method is executed' );
			} );
		},

		// (#3775)
		'test parts refresh': function() {
			var editor = this.editor,
				bot = this.editorBot;

			var widgetDef = {
				parts: {
					first: '.first',
					second: '.second',
					third: '.third'
				}
			};

			editor.widgets.add( 'testparts2', widgetDef );

			bot.setData( '<div data-widget="testparts2" id="w"><p class="first">Hello</p><p class="third">!</p></div>', function() {
				var missingPart = CKEDITOR.dom.element.createFromHtml( '<p class="second">World</p>' ),
					widget = getWidgetById( editor, 'w' );

				assert.areEqual( 2, widget.element.getChildCount(), 'Middle part of widget should be missing.' );
				assert.areEqual( widget.parts.second, null, 'Middle part of widget should be missing.' );

				missingPart.insertAfter( widget.wrapper.findOne( '.first' ) );

				widget.refreshParts();

				assert.areEqual( 3, widget.element.getChildCount(), 'Middle part of widget should be inserted.' );
				assert.areEqual( widget.parts.second, missingPart, 'Middle part of widget should be inserted.' );
			} );
		},

		// (#3775)
		'test parts refresh flag': function() {
			var editor = this.editor,
				bot = this.editorBot;

			var widgetDef = {
				parts: {
					first: '.first',
					second: '.second'
				}
			};

			editor.widgets.add( 'testparts2', widgetDef );

			bot.setData( '<div data-widget="testparts2" id="w"><p class="first">Hello</p><p class="second">World!</p></div>', function() {
				var widget = getWidgetById( editor, 'w' ),
					partToRefresh = CKEDITOR.dom.element.createFromHtml( '<p class="second">World!</p>' );

				widget.wrapper.findOne( '.second' ).remove();
				partToRefresh.insertAfter( widget.element.findOne( '.first' ) );

				widget.refreshParts( false );

				assert.areEqual( widget.parts.second.getParent(), null, 'Deleted widget part should not be reinitialized.' );

				widget.refreshParts();

				assert.areEqual( widget.parts.second.getParent(), widget.element, 'Deleted widget part should be reinitialized.' );
			} );
		},

		'test defined dialog name': function() {
			var editor = this.editor;

			var widgetDef = {
				dialog: 'foo'
			};

			editor.widgets.add( 'testdialog1', widgetDef );

			this.editorBot.setData( '<p data-widget="testdialog1" id="x">foo</p>', function() {
				var widget = getWidgetById( editor, 'x' ),
					dialogName;

				widget.on( 'edit', function( evt ) {
					dialogName = evt.data.dialog;
					evt.cancel();
				} );

				widget.edit();

				assert.areSame( 'foo', dialogName );
			} );
		},

		'test no dialogName': function() {
			var editor = this.editor;

			var widgetDef = {};

			editor.widgets.add( 'testdialog2', widgetDef );

			this.editorBot.setData( '<p data-widget="testdialog2" id="x">foo</p>', function() {
				var widget = getWidgetById( editor, 'x' ),
					dialogName;

				widget.on( 'edit', function( evt ) {
					dialogName = !!evt.data.dialogName;
					evt.cancel();
				} );

				widget.edit();

				assert.isFalse( dialogName );
			} );
		},

		'test command': function() {
			var editor = this.editor,
				executed = 0;

			var widgetDef = {
				defaults: {
					foo: 1
				}
			};

			editor.widgets.add( 'testcommand1', widgetDef );

			// Mock template instance.
			editor.widgets.registered.testcommand1.template = {
				output: function( data ) {
					assert.areSame( 1, data.foo, 'data.foo' );
					executed += 1;
					return '<span>foo</span>';
				}
			};

			this.editorBot.setData( '<p>foo</p>', function() {
				editor.execCommand( 'testcommand1' );
				assert.areSame( 1, executed, 'Template was used once' );
			} );
		},

		'test command with startup data': function() {
			var editor = this.editor,
				executed = 0;

			var widgetDef = {
				data: function( evt ) {
					executed += 1;
					assert.areSame( 2, evt.data.bar, 'startup data was passed' );
				},
				template: '<span>data</span>'
			};

			editor.widgets.add( 'testcommanddata', widgetDef );

			this.editorBot.setData( '<p>foo</p>', function() {
				// Force selection in Chrome (#5385).
				if ( CKEDITOR.env.chrome && editor.getSelection().getType() === CKEDITOR.SELECTION_NONE ) {
					var range = editor.createRange();

					range.selectNodeContents( editor.editable() );
					range.select();
				}

				editor.execCommand( 'testcommanddata', { startupData: { bar: 2 } } );
				assert.areSame( 1, executed, 'data listener was executed once' );
			} );
		},

		'test insert method': function() {
			var editor = this.editor,
				editExecuted = 0,
				widgetDef = {
					insert: sinon.stub()
				},
				commandData = {
					foo: 'bar'
				};

			editor.widgets.add( 'testcommand2', widgetDef );

			this.editorBot.setData( '<p>foo</p>', function() {
				editor.execCommand( 'testcommand2', commandData );
				assert.areSame( 1, widgetDef.insert.callCount, 'Insert was called once' );
				sinon.assert.calledWithExactly( widgetDef.insert, {
					editor: editor,
					commandData: commandData
				} );

				this.editorBot.setData( '<p>X</p><p data-widget="testcommand2" id="w1">foo</p>', function() {
					var widget = getWidgetById( editor, 'w1' );

					widget.on( 'edit', function( evt ) {
						evt.cancel();
						editExecuted += 1;
					} );

					widget.focus();

					editor.execCommand( 'testcommand2' );

					assert.areSame( 1, widgetDef.insert.callCount, 'Insert was not called this time' );
					assert.areSame( 1, editExecuted, 'Edit was executed' );
				} );
			} );
		},

		'test automatic data listener': function() {
			var editor = this.editor,
				dataFired = 0;

			var widgetDef = {
				defaults: {
					foo: 1
				},

				data: function() {
					dataFired += 1;
				}
			};

			editor.widgets.add( 'testautodata', widgetDef );

			this.editorBot.setData( '<p data-widget="testautodata" id="w">foo</p>', function() {
				var widget = getWidgetById( editor, 'w' );

				assert.areSame( 1, dataFired, 'data listener was attached during initialization' );
				assert.isTypeOf( 'object', widget.data, 'data method has not been overriden' );
				assert.areSame( 1, widget.data.foo );

				widget.setData( 'foo', 2 );

				assert.areSame( 2, dataFired, 'data listener was executed on setData' );
			} );
		},

		'test automatic edit listener': function() {
			var editor = this.editor,
				editFired = 0,
				editFn = function( evt ) {
					assert.areSame( 'foo', evt.data.dialog, 'evt' );
					editFired += 1;
					evt.cancel();
				};

			var widgetDef = {
				dialog: 'foo',
				edit: editFn
			};

			editor.widgets.add( 'testautoedit', widgetDef );

			this.editorBot.setData( '<p data-widget="testautoedit" id="w">foo</p>', function() {
				var widget = getWidgetById( editor, 'w' );

				assert.areSame( widget.edit, CKEDITOR.plugins.widget.prototype.edit, 'edit method was not overriden' );
				assert.areSame( editFn, widgetDef.edit, 'widget definition was not modified' );

				widget.edit();

				assert.areSame( 1, editFired, 'edit listener was attached during initialization' );
			} );
		},

		'test overriding template in widgetDefinition event': function() {
			var editor = this.editor;

			editor.once( 'widgetDefinition', function( evt ) {
				evt.data.template = '<b>{foo}</b>';
			} );

			editor.widgets.add( 'testtemplateoverriding', {
				defaults: {
					foo: 'abc'
				}
			} );

			this.editorBot.setData( '<p></p>', function() {
				editor.execCommand( 'testtemplateoverriding' );

				assert.areSame( '<p><b>abc</b></p>', editor.getData() );
			} );
		},

		'test button': function() {
			CKEDITOR.plugins.add( 'widgetbutton', {
				requires: 'widget,button',
				init: function( editor ) {
					editor.widgets.add( 'testButton', {
						button: 'Foo'
					} );
				}
			} );

			bender.editorBot.create( {
				name: 'editor_button',
				config: {
					extraPlugins: 'widgetbutton'
				}
			}, function( bot ) {
				var editor = bot.editor,
					button = editor.ui.items.TestButton;

				assert.isTrue( !!button, 'button was registered' );
				assert.areSame( 'Foo', button.label );
				assert.areSame( 'testButton', button.command );
			} );
		},

		'test editables': function() {
			var editor = this.editor,
				editorBot = this.editorBot,
				editables = {
					el1: '#foo',
					el2: {
						selector: '#bar'
					},
					el3: '.bom',
					el4: 'div.editable',
					el5: 'span'
				};

			editor.widgets.add( 'testeditables1', {
				editables: editables
			} );

			editorBot.setData(
				'<div data-widget="testeditables1" id="w1">' +
				'<p id="foo">A</p><p id="bar">B</p><span>C</span></div><p class="bom">D</p>',
				function() {
					var widget = getWidgetById( editor, 'w1' );

					assert.areSame( 'A', widget.editables.el1.getText(), 'el1 was found' );
					assert.areSame( 'B', widget.editables.el2.getText(), 'el2 was found' );
					assert.isFalse( !!widget.editables.el3, 'el3 was not found' );
					assert.isFalse( !!widget.editables.el5, 'el5 was not found because it is not allowed editable element (span)' );

					assert.areSame( '#foo', editables.el1, 'original object was not modified' );

					assert.isTrue( widget.element.contains( widget.editables.el1 ), 'widget contains editable el1' );

					editorBot.setData( '<div data-widget="testeditables1" id="w1" class="editable">X</div><div class="editable">Y</div>', function() {
						var widget = getWidgetById( editor, 'w1' );
						assert.areSame( editor.document.getById( 'w1' ), widget.editables.el4, 'el4 was found' );
					} );
				}
			);
		},

		'test inline property - block case': function() {
			var editor = this.editor;

			editor.widgets.add( 'testautoinline1', {} );

			this.editorBot.setData( '<p>foo</p><p data-widget="testautoinline1" id="w1">bar</p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				assert.isFalse( widget.inline, 'block widget' );
				assert.areSame( 'div', widget.wrapper.getName(), 'wrapper\'s name' );
			} );
		},

		'test inline property - inline case': function() {
			var editor = this.editor;

			editor.widgets.add( 'testautoinline2', {} );

			this.editorBot.setData( '<p>foo</p><p><em data-widget="testautoinline2" id="w1">bar</em></p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				assert.isTrue( widget.inline, 'inline widget' );
				assert.areSame( 'span', widget.wrapper.getName(), 'wrapper\'s name' );
			} );
		},

		'test inline property - forced block case': function() {
			var editor = this.editor;

			editor.widgets.add( 'testforcedinline1', {
				inline: false
			} );

			this.editorBot.setData( '<p>foo</p><p><em data-widget="testforcedinline1" id="w1">bar</em></p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				assert.isFalse( widget.inline, 'block widget' );
				assert.areSame( 'div', widget.wrapper.getName(), 'wrapper\'s name' );
			} );
		},

		'test draggable false': function() {
			var editor = this.editor;

			editor.widgets.add( 'testdraggable1', {
				draggable: false
			} );

			this.editorBot.setData( '<p>foo</p><p><em data-widget="testdraggable1" id="w1">bar</em></p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				assert.isNull( widget.wrapper.findOne( '.cke_widget_drag_handler_container' ), 'no drag handler' );
				assert.isFalse( widget.draggable, 'widget.draggable' );
			} );
		},

		'test draggable - default value': function() {
			var editor = this.editor;

			editor.widgets.add( 'testdraggable2', {} );

			this.editorBot.setData( '<p>foo</p><p data-widget="testdraggable2" id="w1">bar</p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				assert.isInstanceOf( CKEDITOR.dom.element, widget.wrapper.findOne( '.cke_widget_drag_handler_container' ), 'drag handler found' );
				assert.isTrue( widget.draggable, 'widget.draggable' );
			} );
		},

		// https://dev.ckeditor.com/ticket/11533
		'test upcasting with DOM modification (split before upcasted element)': function() {
			var editor = this.editor,
				visited = 0;

			editor.widgets.add( 'testsplit', {
				upcast: function( el ) {
					if ( visited )
						assert.fail( 'Recurrent upcasting!' );

					// Upcast <b>b</b> to <div><b>b</b></div>.
					if ( el.name == 'b' ) {
						// Split <p>a<b>b</b></p> => <p>a</p><p><b>b</b></p>
						el.parent.split( el.getIndex() );

						// Replace <p>a</p><p><b>b</b></p> => <p>a</p><b>b</b>
						el.parent.replaceWith( el );

						var div = new CKEDITOR.htmlParser.element( 'div' );

						// Replace <p>a</p><b>b</b> => <p>a</p><div><b>b</b></div>
						el.replaceWith( div );
						div.add( el );

						++visited;

						return div;
					}

					// Also upcast <div>s. This is to check if previously upcasted
					// <div><b>b</b></div> is not upcasted again and again.
					else if ( el.name == 'div' ) {
						++visited;

						return el;
					}
				}
			} );

			this.editorBot.setData( '<p>a<b>b</b></p>', function() {
				assert.areSame( 1, visited, 'The element upcasted only once.' );
				assert.areSame( '<p>a</p><div><b>b</b></div>', editor.getData() );
			} );
		}
	} );
} )();
