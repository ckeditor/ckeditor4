/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget,undo,basicstyles,clipboard,dialog */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true,

			// (https://dev.ckeditor.com/ticket/13186)
			pasteFilter: null,

			on: {
				instanceReady: function( evt ) {
					evt.editor.dataProcessor.writer.sortAttributes = 1;

					CKEDITOR.dialog.add( 'test1', function() {
						return {
							title: 'Test1',
							contents: [
								{
									id: 'info',
									elements: [
										{
											id: 'value1',
											type: 'text',
											label: 'Value 1'
										}
									]
								}
							]
						};
					} );
				}
			}
		}
	};

	var fixHtml = widgetTestsTools.fixHtml,
		getWidgetById = widgetTestsTools.getWidgetById;

	function keysLength( obj ) {
		return CKEDITOR.tools.object.keys( obj ).length;
	}

	function testDelKey( editor, keyName, range, shouldBeBlocked, msg ) {
		range.select();

		var fullMsg = keyName + ' ' + ( shouldBeBlocked ? 'was blocked' : 'was not blocked' ) + ' at ' + msg,
			keyCodes = {
				del: 46,
				bspc: 8
			},
			evt = new CKEDITOR.dom.event( { keyCode: keyCodes[ keyName ] } ),
			wasBlocked = false;

		evt.preventDefault = function() {
			wasBlocked = true;
		};

		editor.editable().fire( 'keydown', evt );

		assert[ shouldBeBlocked ? 'isTrue' : 'isFalse' ]( wasBlocked, fullMsg );
	}

	function appendEditable( widget, editableName, editableElementName, options ) {
		var el = new CKEDITOR.dom.element.createFromHtml( '<' + editableElementName + ' class="' + editableName + '"></' + editableElementName + '>' );
		widget.element.append( el );
		widget.initEditable( editableName, CKEDITOR.tools.extend( { selector: '.' + editableName }, options ) );
		return widget.editables[ editableName ];
	}

	function assertEnterModes( enterMode, shiftEnterMode, editable, msg ) {
		msg += ' - ';
		assert.areSame( String( enterMode ), editable.getAttribute( 'data-cke-enter-mode' ), msg + 'data-cke-enter-mode attr' );
		assert.areSame( enterMode, editable.enterMode, msg + 'enterMode' );
		assert.areSame( shiftEnterMode, editable.shiftEnterMode, msg + 'shiftEnterMode' );
	}

	bender.test( {
		'test basics': function() {
			var editor = this.editor,
				data = '<p>Foo</p><div data-widget="testbasic1" id="w1"><p>A</p><div id="foo"><p>B</p></div></div>';

			editor.widgets.add( 'testbasic1', {
				editables: {
					foo: '#foo'
				}
			} );

			this.editorBot.setData( data, function() {
				var widget = getWidgetById( editor, 'w1' ),
					editable = widget.editables.foo;

				assert.isInstanceOf( CKEDITOR.plugins.widget.nestedEditable, editable, 'editable is an instance of CKEDITOR.plugins.widget.nestedEditable class' );
				assert.isInstanceOf( CKEDITOR.dom.element, editable, 'editable is an instance of CKEDITOR.dom.element class' );
				assert.areSame( 'true', editable.getAttribute( 'contenteditable' ), 'is editable' );
				assert.areSame( 'foo', editable.getAttribute( 'data-cke-widget-editable' ), 'has data-cke-widget-editable attribute' );
				assert.areSame( String( CKEDITOR.ENTER_P ), editable.getAttribute( 'data-cke-enter-mode' ), 'has data-cke-enter-mode attribute' );
				assert.isTrue( editable.hasClass( 'cke_widget_editable' ), 'has cke_widget_editable class' );

				assert.areSame( data, editor.getData(), 'editor cleans up data' );
			} );
		},

		'test #initEditable and #destroyEditable': function() {
			var editor = this.editor;

			editor.widgets.add( 'testmethods1', {
				editables: {
					foo: '#foo'
				}
			} );

			this.editorBot.setData( '<div data-widget="testmethods1" id="w1"><p>A</p><p id="foo">B</p><div id="bar">C</div></div>', function() {
				var widget = getWidgetById( editor, 'w1' );

				assert.isTrue( widget.initEditable( 'bar', { selector: '#bar', allowedContent: 'p br' } ), 'return value' );

				var eBar = widget.editables.bar;

				assert.areSame( editor.document.getById( 'bar' ), eBar, 'editable was added' );
				assert.areSame( 'true', eBar.getAttribute( 'contenteditable' ), 'has contenteditable attr' );
				assert.areSame( 'bar', eBar.getAttribute( 'data-cke-widget-editable' ), 'has data-cke-widget-editable attribute' );
				assert.areSame( String( CKEDITOR.ENTER_P ), eBar.getAttribute( 'data-cke-enter-mode' ), 'has data-cke-enter-mode attribute' );
				assert.areSame( CKEDITOR.ENTER_P, eBar.enterMode, 'editable.enterMode' );
				assert.areSame( CKEDITOR.ENTER_BR, eBar.shiftEnterMode, 'editable.shiftEnterMode' );
				assert.isNumber( parseInt( eBar.getAttribute( 'data-cke-filter' ), 10 ), 'has data-cke-filter attribute' );
				assert.isInstanceOf( CKEDITOR.filter, eBar.filter, 'editable.filter is instance of CKEDITOR.filter' );
				assert.areSame( eBar.filter, CKEDITOR.filter.instances[ eBar.getAttribute( 'data-cke-filter' ) ],
					'data-cke-filter points to an existing filter instance' );
				assert.isTrue( eBar.hasClass( 'cke_widget_editable' ), 'has cke_widget_editable class' );

				var removedListeners = [];
				eBar.removeListener = function( evtName ) {
					removedListeners.push( evtName );
				};

				widget.destroyEditable( 'bar' );

				assert.isFalse( !!widget.editables.bar, 'editable was removed' );
				assert.areNotSame( 'true', eBar.getAttribute( 'contenteditable' ), 'does not have contenteditable attr' );
				assert.isFalse( eBar.hasAttribute( 'data-cke-widget-editable' ), 'does not have data-cke-widget-editable attribute' );
				assert.isFalse( eBar.hasAttribute( 'data-cke-enter-mode' ), 'does not have data-cke-enter-mode attribute' );
				assert.isFalse( eBar.hasClass( 'cke_widget_editable' ), 'does not have cke_widget_editable class' );

				// Focus manager also uses removeListener, so events are doubled.
				assert.areSame( 'blur,blur,focus,focus', removedListeners.sort().join( ',' ), 'listeners were removed' );


				var eFoo = widget.editables.foo;

				widget.destroyEditable( 'foo', true );

				assert.isFalse( !!widget.editables.foo, 'editable was removed - foo' );
				assert.areSame( 'true', eFoo.getAttribute( 'contenteditable' ), 'has contenteditable attr - foo' );
			} );
		},

		'test initEditable ignores not allowed editable elements': function() {
			var editor = this.editor;

			editor.widgets.add( 'testmethods2', {} );

			this.editorBot.setData( '<div data-widget="testmethods2" id="w1"><span id="bar">B</span></div>', function() {
				var widget = getWidgetById( editor, 'w1' );

				assert.isFalse( widget.initEditable( 'bar', { selector: '#bar' } ), 'return value' );
				assert.isFalse( !!widget.editables.bar, 'editable was not initialized' );
			} );
		},

		'test #destroyEditable destroys nested widgets': function() {
			var editor = this.editor;

			editor.widgets.add( 'testmethods3', {
				editables: {
					foo: '#foo'
				}
			} );

			this.editorBot.setData( '<div data-widget="testmethods3" id="w1"><p id="foo"><span data-widget="testmethods3" id="w2">x</span></p></div>', function() {
				var w1 = getWidgetById( editor, 'w1' ),
					w2 = getWidgetById( editor, 'w2' );

				assert.areEqual( 2, keysLength( editor.widgets.instances ), '2 widgets were initialized' );

				w1.destroyEditable( 'foo' );

				assert.areEqual( 1, keysLength( editor.widgets.instances ), '1 widget reimained' );
				assert.isNull( getWidgetById( editor, 'w2', true ), 'nested widget was destroyed' );
				assert.isFalse( w2.element.getParent().hasAttribute( 'data-cke-widget-wrapper' ), 'widget was unwrapped' );
			} );
		},

		// More precise tests can be found in widgetsrepoapi because this
		// methods uses repo#destroyAll with specified container.
		'test #destroyEditable in offline mode does not destroy nested widgets': function() {
			var editor = this.editor;

			editor.widgets.add( 'testmethods4', {
				editables: {
					foo: '#foo'
				}
			} );

			this.editorBot.setData( '<div data-widget="testmethods4" id="w1"><p id="foo"><span data-widget="testmethods4" id="w2">x</span></p></div>', function() {
				var w1 = getWidgetById( editor, 'w1' );

				assert.areEqual( 2, keysLength( editor.widgets.instances ), '2 widgets were initialized' );

				w1.destroyEditable( 'foo', true );

				assert.areEqual( 2, keysLength( editor.widgets.instances ), '2 widgets reimained' );
				assert.isNotNull( getWidgetById( editor, 'w2', true ), 'nested widget was not destroyed' );
			} );
		},

		// (#1722)
		'test #destroyEditable destroys unused editable filters': function() {
			var editor = this.editor;

			editor.widgets.add( 'testmethod5', {
				editables: {
					foo: '#foo'
				}
			} );

			var widget1Html = '<div data-widget="testmethod5" id="w1"><p>A</p><p class="foo">B</p></div>',
				widget2Html = '<div data-widget="testmethod5" id="w2"><p>A</p><p class="foo">B</p></div>';

			this.editorBot.setData( widget1Html + widget2Html, function() {
				var widget1 = getWidgetById( editor, 'w1' ),
					widget2 = getWidgetById( editor, 'w2' );

				widget1.initEditable( 'foo', { selector: '.foo', allowedContent: 'p br' } );
				widget2.initEditable( 'foo', { selector: '.foo', allowedContent: 'p br' } );

				var removedListeners = [],
					filters = editor.widgets._.filters.testmethod5,
					filterSpy = sinon.spy( filters.foo, 'destroy' );

				widget1.editables.foo.removeListener = function( evtName ) {
					removedListeners.push( evtName );
				};

				widget2.editables.foo.removeListener = function( evtName ) {
					removedListeners.push( evtName );
				};

				widget1.destroyEditable( 'foo' );

				assert.isNotUndefined( filters.foo );

				widget2.destroyEditable( 'foo' );

				assert.isUndefined( filters.foo );

				assert.isTrue( filterSpy.calledOnce );

				filterSpy.restore();
			} );
		},

		'test nestedEditable enter modes are limited by ACF': function() {
			var editor = this.editor;

			editor.widgets.add( 'testentermode1', {} );

			this.editorBot.setData( '<div data-widget="testentermode1" id="w1"></div>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					editable;

				editable = appendEditable( widget, 'e1', 'div' );
				assertEnterModes( CKEDITOR.ENTER_P, CKEDITOR.ENTER_BR, editable, 'e1' );

				editable = appendEditable( widget, 'e2', 'div', { allowedContent: 'br' } );
				assertEnterModes( CKEDITOR.ENTER_BR, CKEDITOR.ENTER_BR, editable, 'e2' );

				editable = appendEditable( widget, 'e3', 'div', { allowedContent: 'div br' } );
				assertEnterModes( CKEDITOR.ENTER_DIV, CKEDITOR.ENTER_BR, editable, 'e3' );

				editable = appendEditable( widget, 'e4', 'div', { allowedContent: 'p' } );
				assertEnterModes( CKEDITOR.ENTER_P, CKEDITOR.ENTER_P, editable, 'e4' );
			} );
		},

		'test nestedEditable enter modes are limited by blockless editable': function() {
			var editor = this.editor;

			editor.widgets.add( 'testentermode2', {} );

			this.editorBot.setData( '<div data-widget="testentermode2" id="w1"></div>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					editable;

				editable = appendEditable( widget, 'e1', 'p' );
				assertEnterModes( CKEDITOR.ENTER_BR, CKEDITOR.ENTER_BR, editable, 'e1' );

				// Make sure that element has higher priority, even over incorrectly configured ACF.
				editable = appendEditable( widget, 'e2', 'p', { allowedContent: 'div br' } );
				assertEnterModes( CKEDITOR.ENTER_BR, CKEDITOR.ENTER_BR, editable, 'e2' );
			} );
		},

		'test nestedEditable enter modes are inherited from editor': function() {
			bender.editorBot.create( {
				name: 'testentermodeinheritedfromeditor',
				creator: 'inline',
				config: {
					enterMode: CKEDITOR.ENTER_BR,
					shiftEnterMode: CKEDITOR.ENTER_DIV,
					extraPlugins: 'widget',
					on: {
						pluginsLoaded: function( evt ) {
							this.widgets.add( 'testentermode' );
							evt.editor.filter.allow( 'div[data-widget,id]' );
						}
					}
				}
			}, function( bot ) {
				var editor = bot.editor,
					widget = getWidgetById( editor, 'w1' ),
					editable;

				editable = appendEditable( widget, 'e1', 'div' );
				assertEnterModes( CKEDITOR.ENTER_BR, CKEDITOR.ENTER_DIV, editable, 'e1' );

				editable = appendEditable( widget, 'e2', 'p' );
				assertEnterModes( CKEDITOR.ENTER_BR, CKEDITOR.ENTER_BR, editable, 'e2' );

				editable = appendEditable( widget, 'e3', 'div', { allowedContent: 'p' } );
				assertEnterModes( CKEDITOR.ENTER_P, CKEDITOR.ENTER_P, editable, 'e3' );
			} );
		},

		'test nestedEditable auto paragraphing (limited by widgetDef.allowedContent)': function() {
			var editor = this.editor;

			editor.widgets.add( 'autoparagraphtest', {
				allowedContent: 'div',
				editables: {
					foo: {
						selector: '#foo',
						allowedContent: 'br'
					}
				}
			} );

			this.editorBot.setData( '<p>x</p><div data-widget="autoparagraphtest" id="w1"><div id="foo">foo</div></div>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					editable = widget.editables.foo,
					range;

				// Move focus to the editable and place selection at the end of its contents.
				// This should fire 'selectionChange' event and execute editable.fixDom() method.
				editable.focus();
				range = editor.createRange();
				range.moveToPosition( editable, CKEDITOR.POSITION_BEFORE_END );
				range.select();

				// Since allowedContent is 'br' auto paragraphing should not be performed.
				assert.areEqual( CKEDITOR.ENTER_BR, editable.enterMode, 'Enter mode should be CKEDTIOR.ENTER_BR.' );
				assert.areEqual( 'foo', editable.getData(), 'Test data should not be changed.' );
			} );
		},

		'test nestedEditable auto paragraphing (limited by config.enterMode)': function() {
			bender.editorBot.create( {
				name: 'testautoparagraphingconfigentermode',
				creator: 'inline',
				config: {
					enterMode: CKEDITOR.ENTER_BR,
					on: {
						pluginsLoaded: function( evt ) {
							evt.editor.widgets.add( 'autoparagraphtest', {
								editables: {
									foo: {
										selector: '#foo'
									}
								}
							} );

							evt.editor.filter.allow( 'div[data-widget,id]' );
						}
					}
				}
			}, function( bot ) {
				var editor = bot.editor;

				bot.setData( '<p>x</p><div data-widget="autoparagraphtest" id="w1"><div id="foo">foo</div></div>', function() {
					var widget = getWidgetById( editor, 'w1' ),
						editable = widget.editables.foo,
						range;

					// Move focus to the editable and place selection at the end of its contents.
					// This should fire 'selectionChange' event and execute editable.fixDom() method.
					editable.focus();
					range = editor.createRange();
					range.moveToPosition( editable.getFirst(), CKEDITOR.POSITION_BEFORE_END );
					range.select();

					// Since allowedContent is 'br' auto paragraphing should not be performed.
					assert.areEqual( CKEDITOR.ENTER_BR, editable.enterMode, 'Enter mode should be CKEDTIOR.ENTER_BR.' );
					assert.areEqual( 'foo', editable.getData(), 'Test data should not be changed.' );
				} );
			} );
		},

		'test nestedEditable auto paragraphing (limited by config.autoParagraph)': function() {
			bender.editorBot.create( {
				name: 'testautoparagraphingconfigautoparagraph',
				creator: 'inline',
				config: {
					autoParagraph: false,
					on: {
						pluginsLoaded: function( evt ) {
							evt.editor.widgets.add( 'autoparagraphtest', {
								editables: {
									foo: {
										selector: '#foo'
									}
								}
							} );

							evt.editor.filter.allow( 'div[data-widget,id]' );
						}
					}
				}
			}, function( bot ) {
				var editor = bot.editor;

				bot.setData( '<p>x</p><div data-widget="autoparagraphtest" id="w1"><div id="foo">foo</div></div>', function() {
					var widget = getWidgetById( editor, 'w1' ),
						editable = widget.editables.foo,
						range;

					// Move focus to the editable and place selection at the end of its contents.
					// This should fire 'selectionChange' event and execute editable.fixDom() method.
					editable.focus();
					range = editor.createRange();
					range.moveToPosition( editable.getFirst(), CKEDITOR.POSITION_BEFORE_END );
					range.select();

					// Since allowedContent is 'br' auto paragraphing should not be performed.
					assert.areEqual( CKEDITOR.ENTER_P, editable.enterMode, 'Enter mode should be CKEDTIOR.ENTER_P.' );
					assert.areEqual( 'foo', editable.getData(), 'Test data should not be changed.' );
				} );
			} );
		},

		'test nestedEditable.setData - data processor integration': function() {
			var editor = this.editor,
				data = '<p>Foo</p><div data-widget="testsetdata1" id="w1"><p>A</p><p id="foo">B</p></div>';

			editor.widgets.add( 'testsetdata1', {
				editables: {
					foo: '#foo'
				}
			} );

			editor.dataProcessor.dataFilter.addRules( {
				elements: {
					i: function( el ) {
						if ( el.attributes.testsetdata1 )
							el.attributes.testsetdata1 = '2';
					}
				}
			} );

			this.editorBot.setData( data, function() {
				var widget = getWidgetById( editor, 'w1' ),
					editable = widget.editables.foo;

				editable.setData( '<i testsetdata1="1">B</i>' );
				assert.areSame( '<i testsetdata1="2">B</i>', fixHtml( editable.getHtml() ),
					'data processor\'s rule for editable elements only was applied' );

				editable.setData( 'B<img alt="foo" src="../../_assets/img.gif">B' );
				assert.isMatching( /^B<img alt="foo" data-cke-saved-src="..\/..\/_assets\/img\.gif" src="[^"]+" \/>B$/, fixHtml( editable.getHtml() ),
					'data processor\'s preprocessor rule was applied' );
			} );
		},

		'test nestedEditable.setData - ACF integration': function() {
			var editor = this.editor,
				data = '<p>Foo</p><div data-widget="testsetdata2" id="w1"><p>A</p><p id="foo">B</p></div>';

			editor.widgets.add( 'testsetdata2', {
				editables: {
					foo: {
						selector: '#foo',
						allowedContent: 'i(red)'
					}
				}
			} );

			editor.filter.allow( 'b(!testsetdata2)' );

			this.editorBot.setData( data, function() {
				var widget = getWidgetById( editor, 'w1' ),
					editable = widget.editables.foo;

				editable.setData( '<i class="red blue">B</i><b class="testsetdata2">B</b>' );
				assert.areSame( '<i class="red">B</i>B', fixHtml( editable.getHtml() ) );
			} );
		},

		// For performance reasons.
		'test nestedEditable.setData - destroyAll(false,editable) is not called on first nestedEditable.setData': function() {
			var editor = this.editor;

			editor.widgets.add( 'testsetdata3', {} );

			this.editorBot.setData(
				'<div data-widget="testsetdata3" id="w1">' +
					'<p id="foo"></p>' +
				'</div>',
				function() {
					var w1 = getWidgetById( editor, 'w1' ),
						ed = editor.document.getById( 'foo' );

					ed.setHtml( '<span data-widget="testsetdata3" id="w2">x</span><span data-widget="testsetdata3" id="w3">x</span>' );

					assert.areEqual( 1, keysLength( editor.widgets.instances ), '1 widget was initialized' );

					var original = editor.widgets.destroyAll,
						destroyAllCalls = 0,
						revert = bender.tools.replaceMethod( editor.widgets, 'destroyAll', function( offline, container ) {
							destroyAllCalls += 1;
							original.call( this, offline, container );
						} );

					w1.initEditable( 'foo', { selector: '#foo' } );
					assert.areSame( 0, destroyAllCalls, 'destroyAll is not called on initial nestedEditable.setData' );
					assert.areEqual( 3, keysLength( editor.widgets.instances ), '3 widgets were initialized' );

					w1.editables.foo.setData( '<span data-widget="testsetdata3" id="w2">x</span>' );

					assert.areSame( 1, destroyAllCalls, 'destroyAll is called on 2nd+ nestedEditable.setData' );
					assert.areEqual( 2, keysLength( editor.widgets.instances ), '2 widgets reimained' );
					revert();
				}
			);
		},

		'test nestedEditable.getData - data processor integration': function() {
			var editor = this.editor,
				data = '<p>Foo</p><div data-widget="testgetdata1" id="w1"><p>A</p><p id="foo">B</p></div>';

			editor.widgets.add( 'testgetdata1', {
				editables: {
					foo: '#foo'
				}
			} );

			editor.dataProcessor.htmlFilter.addRules( {
				elements: {
					i: function( el ) {
						if ( el.attributes.testgetdata1 )
							el.attributes.testgetdata1 = '2';
					}
				}
			} );

			this.editorBot.setData( data, function() {
				var widget = getWidgetById( editor, 'w1' ),
					editable = widget.editables.foo;

				editable.setHtml( '<i testgetdata1="1">B</i>' );
				assert.areSame( '<i testgetdata1="2">B</i>', editable.getData(),
					'data processor\'s rule for editable elements only was applied' );

				editable.setData( 'B<img alt="foo" src="../../_assets/img.gif">B' );
				assert.isMatching( 'B<img alt="foo" src="../../_assets/img.gif" />B', editable.getData(),
					'data processor\'s preprocessor rule was applied' );
			} );
		},

		'test nestedEditable.getData - ACF integration': function() {
			var editor = this.editor,
				data = '<p>Foo</p><div data-widget="testgetdata2" id="w1"><p>A</p><p id="foo">B</p></div>';

			editor.widgets.add( 'testgetdata2', {
				editables: {
					foo: {
						selector: '#foo',
						allowedContent: 'i'
					}
				}
			} );

			this.editorBot.setData( data, function() {
				var widget = getWidgetById( editor, 'w1' ),
					editable = widget.editables.foo;

				editable.filter.addContentForms( [ 'u', 'i' ] );

				editable.setHtml( '<i>B</i><u>B</u>' );
				assert.areSame( '<i>B</i><i>B</i>', editable.getData() );
			} );
		},

		'test nested editable content is processed and filtered when setting/getting editor\'s data': function() {
			var editor = this.editor,
				data =
					'<p>Foo</p><div data-widget="testprocessing1" id="w1">' +
						'<p id="foo"><i class="testprocessing1">A</i><img alt="a" src="../../_assets/img.gif" /><b>B</b></p>' +
					'</div>';

			editor.widgets.add( 'testprocessing1', {
				editables: {
					foo: {
						selector: '#foo',
						allowedContent: 'i(testprocessing1); img[src,alt]'
					}
				}
			} );

			this.editorBot.setData( data, function() {
				var widget = getWidgetById( editor, 'w1' ),
					editable = widget.editables.foo;

				assert.isMatching(
					/^<i class="testprocessing1">A<\/i><img alt="a" data-cke-saved-src="..\/..\/_assets\/img\.gif" src="[^"]+" \/>B$/,
					fixHtml( editable.getHtml() ), 'nested editable data was processed' );

				data =
					'<p>Foo</p><div data-widget="testprocessing1" id="w1">' +
						'<p id="foo"><i class="testprocessing1">A</i><img alt="a" src="../../_assets/img.gif" />B</p>' +
					'</div>';
				assert.areSame( data, editor.getData() );
			} );
		},

		'test nested editable content is processed with its filter when getting data': function() {
			var editor = this.editor,
				data = '<p>Foo</p><div data-widget="testprocessing2" id="w1"><p id="foo">B</p></div>';

			editor.widgets.add( 'testprocessing2', {
				editables: {
					foo: {
						selector: '#foo',
						allowedContent: 'i'
					}
				}
			} );

			this.editorBot.setData( data, function() {
				var editable = getWidgetById( editor, 'w1' ).editables.foo;

				editable.filter.addContentForms( [ 'u', 'i' ] );

				editable.setHtml( '<i>A</i><u>B</u>' );
				assert.areSame(
					'<p>Foo</p><div data-widget="testprocessing2" id="w1"><p id="foo"><i>A</i><i>B</i></p></div>',
					editor.getData(), 'nested editable\'s data was filtered on output' );

				// Add a rule which isn't applied to non-editable elements.
				editor.dataProcessor.htmlFilter.addRules( {
					elements: {
						i: function( el ) {
							if ( el.attributes.testprocessing2 )
								el.attributes.testprocessing2 = '2';
						}
					}
				} );

				editable.setHtml( '<i testprocessing2="1">A</i>' );
				assert.areSame(
					'<p>Foo</p><div data-widget="testprocessing2" id="w1"><p id="foo"><i testprocessing2="2">A</i></p></div>',
					editor.getData(), 'nested editable\'s data was processed as an editable content on output' );
			} );
		},

		// #568
		'test nested editable editableDef.disallowedContent filter works with editableDef.allowedContent': function() {
			var editor = this.editor,
				data = '<p>Foo</p><div data-widget="testprocessing3" id="w1"><p id="foo">B</p></div>';

			editor.widgets.add( 'testprocessing3', {
				editables: {
					disallowedWithAllowedContent: {
						selector: '#foo',
						allowedContent: 'u i p',
						disallowedContent: 'i'
					}
				}
			} );

			this.editorBot.setData( data, function() {
				var editable = getWidgetById( editor, 'w1' ).editables.disallowedWithAllowedContent;

				assert.isTrue( editable.filter.check( 'u' ), 'filter.check( \'u\' )' );
				assert.isTrue( editable.filter.check( 'p' ), 'filter.check( \'p\' )' );
				assert.isFalse( editable.filter.check( 'i' ), 'filter.check( \'i\' )' );
			} );
		},

		// #568
		'test nested editable editableDef.disallowedContent filter works based on editor.filter': function() {
			var editor = this.editor,
				data = '<p>Foo</p><div data-widget="testprocessing4" id="w1"><p id="foo">B</p></div>',
				originalFilter = this.editor.filter;

			// Since this test suite's editor have filter disabled, we need to temporary filter replace.
			editor.filter = new CKEDITOR.filter( 'em strong sub; div[*](*); p[id]' );

			editor.widgets.add( 'testprocessing4', {
				editables: {
					disallowedInheritingFromEditor: {
						selector: '#foo',
						// Since there's no allowedContent in the definition, disallowedContent will work based on
						// current CKEDITOR.editor.filter clone. Since this test suite has ACF disabled it will allow everything.
						// Here disallowedContent rules will be added on top of
						disallowedContent: 'em strong'
					}
				}
			} );

			this.editorBot.setData( data, function() {
				var editable = getWidgetById( editor, 'w1' ).editables.disallowedInheritingFromEditor;

				// Restore the original filter.
				editor.filter = originalFilter;

				assert.isTrue( editable.filter.check( 'sub' ), 'filter.check( \'sub\' )' );
				assert.isFalse( editable.filter.check( 'strong' ), 'filter.check( \'strong\' )' );
				assert.isFalse( editable.filter.check( 'em' ), 'filter.check( \'em\' )' );
				// And ensure that any other rule not allowed by the editor will fail.
				assert.isFalse( editable.filter.check( 'audio' ), 'filter.check( \'audio\' )' );
				assert.isFalse( editable.filter.check( 'sup' ), 'filter.check( \'sup\' )' );
			} );
		},

		'test nested editables processed with their enter modes': function() {
			var editor = this.editor;

			editor.widgets.add( 'testprocessing3', {
				editables: {
					foo: {
						selector: '.foo',
						allowedContent: 'br'
					},

					bar: {
						selector: '.bar',
						allowedContent: 'div'
					}
				}
			} );

			this.editorBot.setData( '<p>Foo</p><div data-widget="testprocessing3" id="w1"><div class="foo">B</div></div>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					editable = widget.editables.foo;

				assert.areSame( 'B', editable.getHtml(), 'content of nested editable was not auto paragraphed on setData' );
				assert.areSame( 'B', editable.getData(), 'content of nested editable was not auto paragraphed on getData' );

				this.editorBot.setData( '<p>Foo</p><div data-widget="testprocessing3" id="w1"><div class="bar">C</div></div>', function() {
					var widget = getWidgetById( editor, 'w1' ),
						editable = widget.editables.bar;

					// Lower cased because of IE8.
					assert.areSame( '<div>c</div>', editable.getHtml().toLowerCase(), 'content of nested editable was auto paragraphed with div on setData' );

					editable.setHtml( 'D' );
					assert.areSame( '<div>D</div>', editable.getData(), 'content of nested editable was auto paragraphed with div on getData' );
				} );
			} );
		},

		'test downcasting nested editable to attribute': function() {
			var editor = this.editor,
				data = '<p>Foo</p><div data-widget="testdowncasting1" id="w1"><p id="foo">B</p></div>';

			editor.widgets.add( 'testdowncasting1', {
				editables: {
					foo: {
						selector: '#foo',
						allowedContent: 'i'
					}
				},
				downcast: function( element ) {
					element.attributes[ 'data-editable' ] = this.editables.foo.getData();
					element.setHtml( 'X' );
				}
			} );

			this.editorBot.setData( data, function() {
				var widget = getWidgetById( editor, 'w1' ),
					editable = widget.editables.foo;

				editable.filter.addContentForms( [ 'u', 'i' ] );

				editable.setHtml( '<i>A</i><u>B</u>' );

				assert.areSame(
					'<p>Foo</p><div data-editable="' + CKEDITOR.tools.htmlEncode( '<i>A</i><i>B</i>' ) + '" data-widget="testdowncasting1" id="w1">X</div>',
					editor.getData(), 'nested editable\'s data was correctly copied to attribute' );
			} );
		},

		// Based on real bug discovered during works on Widgets System.
		// Error was thrown because of conflict when htmlDP#toDF is called when second one is running.
		'test downcasting widget with two nested editables': function() {
			var editor = this.editor,
				data = '<p>Foo</p><div data-widget="testdowncasting2" id="w1"><div id="foo">X</div><div id="bar">X</div></div>';

			editor.widgets.add( 'testdowncasting2', {
				editables: {
					foo: '#foo',
					bar: '#bar'
				}
			} );

			this.editorBot.setData( data, function() {
				var widget = getWidgetById( editor, 'w1' );

				// Set to text nodes, to check if they will really be processed (autoP) on getData().
				widget.editables.foo.setHtml( 'X1' );
				widget.editables.bar.setHtml( 'X2' );

				assert.areSame(
					'<p>Foo</p><div data-widget="testdowncasting2" id="w1"><div id="foo"><p>X1</p></div><div id="bar"><p>X2</p></div></div>',
					editor.getData() );
			} );
		},

		// Also based on real issue. NestedEditable#getData triggers editor#toDataFormat during
		// original editor#toDataFormat fired for editor#getData.
		'test downcasting widget with nestedEditable#getData executed in downcast function': function() {
			var editor = this.editor,
				data = '<p>Foo</p>' +
					'<div data-widget="testdowncasting3" id="w1"><p class="foo">X</p></div>' +
					'<div data-widget="testdowncasting3" id="w2"><p class="foo">X</p></div>' +
					'<div data-widget="testdowncasting3" id="w3"><p class="foo">X</p></div>',
				downcasted = [];

			editor.widgets.add( 'testdowncasting3', {
				editables: {
					foo: '.foo'
				},
				downcast: function( element ) {
					downcasted.push( element.attributes.id + '-in' );
					this.editables.foo.getData();
					downcasted.push( element.attributes.id + '-out' );
				}
			} );

			this.editorBot.setData( data, function() {
				assert.areSame( data, editor.getData() );
				assert.areSame( 'w1-in,w1-out,w2-in,w2-out,w3-in,w3-out', downcasted.join( ',' ) );
			} );
		},

		'test selection in nested editable': function() {
			var editor = this.editor;

			editor.widgets.add( 'testsel1', {
				editables: {
					foo: '#foo',
					bar: '#bar'
				}
			} );

			this.editorBot.setData(
				'<p id="x">X</p><div data-widget="testsel1" id="w1"><p id="foo">B</p><p>C</p><p id="bar">D</p></div>' +
				'<div data-widget="testsel1" id="w2"><p id="foo"><span>B</span></p></div>',
				function() {
					var widget1 = getWidgetById( editor, 'w1' ),
						widget2 = getWidgetById( editor, 'w2' ),
						eFoo1 = widget1.editables.foo,
						eBar1 = widget1.editables.bar,
						eFoo2 = widget2.editables.foo,
						selectionChanged = 0;

					editor.getSelection().selectElement( editor.document.getById( 'x' ) );

					editor.on( 'selectionChange', function() {
						selectionChanged += 1;
					} );

					assertEditables( 0, null, null, 'start' );

					var range = editor.createRange();
					range.setStart( eFoo1, 0 );
					range.collapse( 1 );
					range.select();

					assertEditables( 1, eFoo1, widget1, '#foo 1' );

					range.setStart( eBar1, CKEDITOR.POSITION_AFTER_START );
					range.setEndAt( eBar1, CKEDITOR.POSITION_BEFORE_END );
					range.select();

					assertEditables( 2, eBar1, widget1, '#bar 1' );

					range.setStart( eFoo2.getFirst(), CKEDITOR.POSITION_AFTER_START );
					range.setEndAt( eFoo2.getFirst(), CKEDITOR.POSITION_BEFORE_END );
					range.select();

					assertEditables( 3, eFoo2, widget2, '#foo 2' );

					editor.getSelection().selectElement( editor.document.getById( 'x' ) );

					assertEditables( 4, null, null, 'end' );

					function assertEditables( selC, focusedEditable, widgetHoldingFocusedEditable, msg ) {
						msg = ' - ' + msg;

						assert.areSame( selC, selectionChanged, 'selectionChange fired' + msg );

						if ( widgetHoldingFocusedEditable )
							assert.areSame( widgetHoldingFocusedEditable, editor.widgets.widgetHoldingFocusedEditable, 'widget holds focused editable' + msg );
						else
							assert.isFalse( !!editor.widgets.widgetHoldingFocusedEditable, 'none widget holds focused editable' + msg );

						var allWidgets = [ widget1, widget2 ],
							widget;

						while ( ( widget = allWidgets.shift() ) ) {
							if ( widgetHoldingFocusedEditable === widget ) {
								assert.areSame( focusedEditable, widget.focusedEditable, 'widget has focused editable' + msg );
								assert.isInstanceOf( CKEDITOR.plugins.widget.nestedEditable, widget.focusedEditable,
									'widget.focusedEditable is instance of widget.nestedEditable' + msg );
							} else {
								assert.isFalse( !!widget.focusedEditable, 'widget does not have focued editable' + msg );
							}
						}

						var allEditables = [ eFoo1, eBar1, eFoo2 ],
							editable;

						while ( ( editable = allEditables.shift() ) ) {
							if ( focusedEditable === editable ) {
								assert.isTrue( editable.hasClass( 'cke_widget_editable_focused' ), '#' + editable.$.id + ' has focused class' + msg );
								assert.areSame( editable.enterMode, editor.activeEnterMode, '#' + editable.$.id + '\'s enter mode propagated to editor' );
								assert.areSame( editable.shiftEnterMode, editor.activeShiftEnterMode, '#' + editable.$.id + '\'s shift enter mode propagated to editor' );
							} else {
								assert.isFalse( editable.hasClass( 'cke_widget_editable_focused' ), '#' + editable.$.id + ' does not have focused class' + msg );
							}
						}

						if ( CKEDITOR.env.gecko && focusedEditable )
							assert.isTrue( !!focusedEditable.getBogus(), 'bogus was appended to editable' + msg );
					}
				}
			);
		},

		'test editables\' enter modes propagated to editor': function() {
			var editor = this.editor;

			editor.widgets.add( 'testsel1', {
				editables: {
					foo: {
						selector: '#foo',
						allowedContent: 'div'
					},
					bar: {
						selector: '#bar',
						allowedContent: 'p'
					}
				}
			} );

			this.editorBot.setData( '<p id="x">X</p><div data-widget="testsel1" id="w1"><div id="foo">B</div><p>C</p><div id="bar">D</div></div>', function() {
				var widget1 = getWidgetById( editor, 'w1' ),
					eFoo1 = widget1.editables.foo,
					eBar1 = widget1.editables.bar;

				var range = editor.createRange();
				range.setStart( eFoo1, 0 );
				range.collapse( 1 );
				range.select();

				assert.areSame( CKEDITOR.ENTER_DIV, editor.activeEnterMode, '#foo - enterMode' );
				assert.areSame( CKEDITOR.ENTER_DIV, editor.activeShiftEnterMode, '#foo - shiftEnterMode' );

				range = editor.createRange();
				range.setStart( eBar1, 0 );
				range.collapse( 1 );
				range.select();

				assert.areSame( CKEDITOR.ENTER_P, editor.activeEnterMode, '#bar - enterMode' );
				assert.areSame( CKEDITOR.ENTER_P, editor.activeShiftEnterMode, '#bar - shiftEnterMode' );

				range = editor.createRange();
				range.setStart( editor.document.getById( 'x' ), 0 );
				range.collapse( 1 );
				range.select();

				assert.areSame( CKEDITOR.ENTER_P, editor.activeEnterMode, 'editor - enterMode' );
				assert.areSame( CKEDITOR.ENTER_BR, editor.activeShiftEnterMode, 'editor - shiftEnterMode' );
			} );
		},

		'test blurring nested editable when editor is blurred': function() {
			var editor = this.editor;

			editor.widgets.add( 'testblur1', {
				editables: {
					foo: '#foo'
				}
			} );

			this.editorBot.setData( '<p id="x">X</p><div data-widget="testblur1" id="w1"><p id="foo">B</p></div>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					eFoo = widget.editables.foo;

				editor.focus();

				var range = editor.createRange();
				range.setStart( eFoo, 0 );
				range.collapse( 1 );
				range.select();

				assert.areSame( eFoo, widget.focusedEditable, 'editable is focused' );
				assert.isTrue( editor.focusManager.hasFocus, 'editor has focus' );

				CKEDITOR.document.getById( 'some_input' ).focus();

				wait( function() {
					assert.isFalse( editor.focusManager.hasFocus, 'editor lost focus' );
					assert.isFalse( !!widget.focusedEditable, 'editable is not focused' );

					editor.focus();
					assert.isTrue( editor.focusManager.hasFocus, 'editor has focus again' );
					assert.areSame( eFoo, widget.focusedEditable, 'editable is focused again' );
				}, 210 );
			} );
		},

		'test focusing editor when focusing nested editable': function() {
			if ( CKEDITOR.env.ie ) {
				assert.ignore();
			}

			var editor = this.editor;

			editor.widgets.add( 'testfocus1', {
				editables: {
					foo: '#foo'
				}
			} );

			CKEDITOR.document.getById( 'some_input' ).focus();

			this.editorBot.setData( '<p id="x">X</p><div data-widget="testfocus1" id="w1"><p id="foo">B</p></div>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					eFoo = widget.editables.foo;

				wait( function() {
					assert.isFalse( editor.focusManager.hasFocus, 'editor lost focus' );
					assert.isFalse( !!widget.focusedEditable, 'editable is not focused' );

					eFoo.focus();

					var range = editor.createRange();
					range.setStart( eFoo, 0 );
					range.collapse( 1 );
					range.select();

					assert.areSame( eFoo, widget.focusedEditable, 'editable is focused' );
					assert.isTrue( editor.focusManager.hasFocus, 'editor has focus' );
				}, 210 );
			} );
		},

		'test destroying widget with nested editables': function() {
			var editor = this.editor;

			editor.widgets.add( 'testdestroy1', {
				editables: {
					foo: '#foo'
				}
			} );

			wait( function() {
				this.editorBot.setData( '<p id="x">X</p><div data-widget="testdestroy1" id="w1"><p id="foo">B</p></div>', function() {
					var widget = getWidgetById( editor, 'w1' );

					// Destroy in offline mode.
					editor.widgets.destroy( widget, true );

					assert.isFalse( !!editor.widgets.widgetHoldingFocusedEditable, 'widgets repo does not point to nested editable' );
				} );
			}, 210 );
		},

		'test focused editable is resetted on setData': function() {
			var editor = this.editor,
				editorBot = this.editorBot;

			editor.widgets.add( 'testreset1', {
				editables: {
					foo: '#foo'
				}
			} );

			editorBot.setData( '<p id="x">X</p><div data-widget="testreset1" id="w1"><p id="foo">B</p></div>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					eFoo = widget.editables.foo;

				var range = editor.createRange();
				range.setStart( eFoo, 0 );
				range.collapse( 1 );
				range.select();

				assert.areSame( widget, editor.widgets.widgetHoldingFocusedEditable, 'widget holds focused editable' );
				assert.isTrue( editor.focusManager.hasFocus, 'editor has focus' );

				editorBot.setData( '', function() {
					assert.isFalse( !!editor.widgets.widgetHoldingFocusedEditable, 'none widget holds focused editable after setData' );
					assert.isTrue( editor.focusManager.hasFocus, 'editor has focus 2' );
				} );
			} );
		},

		'test subsequent nested editable focus causes selectionChange': function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version === 11 ) {
				assert.ignore();
			}

			var editor = this.editor,
				editorBot = this.editorBot;

			editor.widgets.add( 'testreset1', {
				editables: {
					foo: '#foo'
				}
			} );

			editorBot.setData( '<p id="x">X</p><div data-widget="testreset1" id="w1"><p id="foo">B</p></div>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					eFoo = widget.editables.foo;

				var selectionChanged = 0;

				editor.on( 'selectionChange', function() {
					selectionChanged += 1;
				} );

				eFoo.focus();
				var range = editor.createRange();
				range.setStart( eFoo, 0 );
				range.collapse( 1 );
				range.select();

				assert.isTrue( !!selectionChanged, 'selectionChange fired once' );

				CKEDITOR.document.getById( 'some_input' ).focus();

				wait( function() {
					assert.isFalse( editor.focusManager.hasFocus, 'editor lost focus' );

					selectionChanged = 0;

					eFoo.focus();

					assert.isTrue( !!selectionChanged, 'selectionChange fired second time on next focus' );
				}, 210 );
			} );
		},

		'test CTRL+A in nested editable': function() {
			var editor = this.editor,
				editorBot = this.editorBot;

			editor.widgets.add( 'testselectall1', {
				editables: {
					foo: '#foo'
				}
			} );

			editorBot.setData( '<p id="x">X</p><div data-widget="testselectall1" id="w1"><p>Y</p><p id="foo">BA<i>R</i></p><p>Y</p></div>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					eFoo = widget.editables.foo;

				eFoo.focus();
				var range = editor.createRange();
				range.setStart( eFoo, 0 );
				range.collapse( 1 );
				range.select();

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 65, ctrlKey: true } ) ); // CTRL+A

				var sel = editor.getSelection();

				assert.areSame( eFoo, sel.getStartElement(), 'selection is anchored in nested editable' );
				assert.areSame( 'BAR', sel.getSelectedText(), 'entire nested editable\'s content is selected' );

				// Check whether bogus wasn't included in the selection.
				var walker = new CKEDITOR.dom.walker( sel.getRanges()[ 0 ] ),
					isBogus = CKEDITOR.dom.walker.bogus(),
					node;

				while ( ( node = walker.next() ) )
					assert.isFalse( isBogus( node ), 'bogus is not selected' );

				editor.widgets.destroy( widget, true );

				editor.getSelection().selectElement( editor.document.getById( 'x' ) );

				var keyEvent = new CKEDITOR.dom.event( { keyCode: 65, ctrlKey: true } ),
					prevented = 0;

				keyEvent.preventDefault = function() {
					prevented += 1;
				};

				editor.editable().fire( 'keydown', keyEvent );
				assert.areSame( 0, prevented, 'listener was removed' );
			} );
		},

		'test blocking del/backspace at editable boundary': function() {
			var editor = this.editor;

			editor.widgets.add( 'testdel1', {
				editables: {
					foo: '.foo'
				}
			} );

			this.editorBot.setData(
				'<p>foo</p>' +
				'<div data-widget="testdel1"><p class="foo" id="e1">a<br />b</p></div>' +
				'<div data-widget="testdel1"><div class="foo" id="e2"><p class="p1">foo</p><p class="p2">bar</p></div></div>' +
				'<div data-widget="testdel1"><div class="foo" id="e3"><img src="../../_assets/img.gif" />foo</div></div>',
				function() {
					var e1 = editor.document.getById( 'e1' ),
						e2 = editor.document.getById( 'e2' ),
						e3 = editor.document.getById( 'e3' ),
						range = editor.createRange();

					e1.focus();

					range.moveToPosition( e1, CKEDITOR.POSITION_AFTER_START );
					testDelKey( editor,	'del',	range,	false,	'e1 - ^a' );
					testDelKey( editor,	'bspc',	range,	true,	'e1 - ^a' );

					range.setStartAt( e1, CKEDITOR.POSITION_AFTER_START );
					range.setEndAt( e1, CKEDITOR.POSITION_BEFORE_END );
					testDelKey( editor,	'del',	range,	false,	'e1 - [a<br>b]' );
					testDelKey( editor,	'bspc',	range,	false,	'e1 - [a<br>b]' );

					range.moveToPosition( e1.findOne( 'br' ), CKEDITOR.POSITION_BEFORE_START );
					testDelKey( editor,	'del',	range,	false,	'e1 - a^<br>b' );
					testDelKey( editor,	'bspc',	range,	false,	'e1 - a^<br>b' );

					e2.focus();

					range.moveToPosition( e2.findOne( '.p1' ), CKEDITOR.POSITION_AFTER_START );
					testDelKey( editor,	'del',	range,	false,	'e2 - ^foo' );
					testDelKey( editor,	'bspc',	range,	true,	'e2 - ^foo' );

					range.moveToPosition( e2.findOne( '.p2' ), CKEDITOR.POSITION_AFTER_START );
					testDelKey( editor,	'del',	range,	false,	'e2 - ^bar' );
					// This case is handled on Webkits and Gecko because of https://dev.ckeditor.com/ticket/11861, https://dev.ckeditor.com/ticket/13798.
					if ( CKEDITOR.env.ie )
						testDelKey( editor,	'bspc',	range,	false,	'e2 - ^bar' );

					range.moveToPosition( e2.findOne( '.p2' ), CKEDITOR.POSITION_BEFORE_END );
					testDelKey( editor,	'del',	range,	true,	'e2 - bar^' );
					testDelKey( editor,	'bspc',	range,	false,	'e2 - bar^' );

					e3.focus();

					range.moveToPosition( e3, CKEDITOR.POSITION_AFTER_START );
					testDelKey( editor,	'del',	range,	false,	'e3 - ^<img>' );
					testDelKey( editor,	'bspc',	range,	true,	'e3 - ^<img>' );

					range.moveToPosition( e3.findOne( 'img' ), CKEDITOR.POSITION_AFTER_END );
					testDelKey( editor,	'del',	range,	false,	'e3 - <img>^foo' );
					testDelKey( editor,	'bspc',	range,	false,	'e3 - <img>^foo' );
				}
			);
		},

		'double click in nested editable is not forwarded to widget': function() {
			var editor = this.editor;

			editor.widgets.add( 'testdbclick1', {
				editables: {
					foo: '.foo'
				}
			} );

			this.editorBot.setData( '<div id="w1" data-widget="testdbclick1"><p class="foo">X<i>Y</i></p></div>', function() {
				var widget1 = getWidgetById( editor, 'w1' ),
					fired = 0;

				widget1.on( 'doubleclick', function() {
					fired += 1;
				}, null, null, 1 );
				// High priority to overtake widget's default double click handler.

				editor.fire( 'doubleclick', { element: widget1.editables.foo } );
				assert.areSame( 0, fired, 'widget#doubleclick was not fired when nested editable was clicked' );

				editor.fire( 'doubleclick', { element: widget1.editables.foo.findOne( 'i' ) } );
				assert.areSame( 0, fired, 'widget#doubleclick was not fired when element child of nested editable was clicked' );
			} );
		},

		'test moving focus from nested editable to widget': function() {
			var editor = this.editor;

			editor.widgets.add( 'testfocustowidget1', {
				editables: {
					foo: '.foo'
				}
			} );

			this.editorBot.setData( '<p>foo</p><div id="w1" data-widget="testfocustowidget1"><p class="foo">X<i>Y</i></p></div>', function() {
				var widget1 = getWidgetById( editor, 'w1' ),
					eFoo = widget1.editables.foo,
					range = editor.createRange();

				eFoo.focus();

				range.setStart( eFoo, 0 );
				range.collapse( true );
				range.select();

				assert.areSame( widget1, editor.widgets.widgetHoldingFocusedEditable, 'foo holds focus' );
				assert.isTrue( editor.focusManager.hasFocus, 'editor is focused' );

				wait( function() {
					widget1.focus();

					wait( function() {
						assert.isTrue( editor.focusManager.hasFocus, 'editor is still focused' );
						assert.isTrue( !!editor.getSelection().isFake, 'selection is fake' );
					}, 210 );
				}, 10 );
			} );
		},

		'test pasting widget which was copied (d&d) when its nested editable was focused': function() {
			// https://dev.ckeditor.com/ticket/11055
			if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
				assert.ignore();
			}

			var editor = this.editor,
				bot = this.editorBot;

			editor.widgets.add( 'testpasting1', {
				editables: {
					foo: '.foo'
				}
			} );

			bot.setData( '<p>foo</p><div id="w1" data-widget="testpasting1"><p class="foo">X</p></div>', function() {
				var widget1 = getWidgetById( editor, 'w1' ),
					eFoo = widget1.editables.foo,
					range = editor.createRange();

				eFoo.focus();

				range.setStart( eFoo, 0 );
				range.collapse( true );
				range.select();

				var html = widget1.wrapper.getOuterHtml();

				bot.setData( '<p>foo</p>', function() {
					editor.once( 'afterPaste', function() {
						resume( function() {
							widget1 = getWidgetById( editor, 'w1' );
							eFoo = widget1.editables.foo;

							assert.isFalse( eFoo.hasClass( 'cke_widget_editable_focused' ), 'editable\'s class was cleaned up' );
						} );
					} );

					// Ensure async.
					wait( function() {
						editor.execCommand( 'paste', html );
					} );
				} );
			} );
		},

		// (https://dev.ckeditor.com/ticket/13186)
		'test pasting into widget nested editable when range in paste data (drop)': function() {
			var editor = this.editor,
				bot = this.editorBot;

			editor.widgets.add( 'widget1', {
				editables: {
					nested: {
						selector: '#widget1-nested',
						allowedContent: 'i(a,c){color}'
					}
				}
			} );

			bot.setData( '<p>foo</p><div id="w1" data-widget="widget1"><p id="widget1-nested">xx</p></div>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					nested = widget.editables.nested,
					range = editor.createRange();

				range.setStart( nested.getFirst(), 1 );
				range.collapse( 1 );

				editor.once( 'afterPaste', function() {
					resume( function() {
						assert.isInnerHtmlMatching( 'xy<i class="a c" style="color:green">z</i>yx@', nested.getHtml(), {
							fixStyles: true
						}, 'Nested editable filter in use.' );
					} );
				} );

				editor.fire( 'paste', {
					type: 'auto',
					dataValue: 'y<i class="a b c d" style="margin-left:20px; color:green">z</i>y',
					method: 'drop',
					range: range
				} );

				wait();
			} );
		},

		// #1469
		'test pasting widget into widget nested editable with selectionChange callback': function() {
			var editor = this.editor,
				bot = this.editorBot;

			editor.widgets.add( 'widget-pastenested', {
				parts: {
					label: 'p'
				},

				editables: {
					nested: {
						selector: '.widget-nested'
					}
				}
			} );

			bot.setData( '<div id="w1" data-widget="widget-pastenested"><p>Widget</p><div class="widget-nested">xx</div></div>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					nested = widget.editables.nested,
					range = editor.createRange();

				range.setStart( nested.getFirst(), 1 );
				range.collapse( 1 );
				range.select();
				nested.focus();

				editor.once( 'afterPaste', function() {
					resume( function() {
						try {
							nested.getData();
						} catch ( e ) {
							assert.fail( 'Error was thrown: ' + e );
						}

						assert.pass( 'Everything worked' );
					} );
				} );

				// Simulate pasting copied, upcasted widget.
				bender.tools.emulatePaste( editor, '<div data-cke-widget-wrapper="1"><div data-cke-widget-upcasted="1" data-widget="pastenested"><div data-cke-widget-editable="nested">Test</div></div></div>' );

				wait();
			} );
		},

		// Behaviour has been changed in 4.5.0 (https://dev.ckeditor.com/ticket/12112), so we're leaving this
		// test as a validation of this change.
		'test widgets\' commands are enabled in nested editable': function() {
			var editor = this.editor,
				bot = this.editorBot;

			editor.widgets.add( 'testcommand1', {
				editables: {
					foo: '.foo'
				}
			} );

			bot.setData( '<p>foo</p><div id="w1" data-widget="testcommand1"><div class="foo">X</div></div>', function() {
				var widget1 = getWidgetById( editor, 'w1' ),
					eFoo = widget1.editables.foo,
					range = editor.createRange();

				editor.focus();

				assert.areSame( CKEDITOR.TRISTATE_OFF, editor.commands.testcommand1.state, 'command is enabled in main editable' );

				eFoo.focus();

				range.setStart( eFoo, 0 );
				range.collapse( true );
				range.select();

				assert.areSame( CKEDITOR.TRISTATE_OFF, editor.commands.testcommand1.state, 'command is enabled in nested editable' );
			} );
		},

		'test selection in nested editable is preserved after opening and closing dialog': function() {
			var editor = this.editor,
				bot = this.editorBot;

			editor.widgets.add( 'testselection1', {
				editables: {
					foo: '.foo'
				}
			} );

			bot.setData( '<p>foo</p><div id="w1" data-widget="testselection1"><p class="foo">X</p></div><p>foo</p>', function() {
				var widget1 = getWidgetById( editor, 'w1' ),
					eFoo = widget1.editables.foo,
					range = editor.createRange(),
					insertedElement = new CKEDITOR.dom.element( 'span', editor.document ),
					dialogSelStartEl;

				eFoo.focus();

				range.setStart( eFoo, 0 );
				range.collapse( true );
				range.select();

				this.editor.openDialog( 'test1', function( dialog ) {
					dialog.once( 'show', function() {
						dialogSelStartEl = editor.getSelection().getStartElement();

						setTimeout( function() {
							dialog.getButton( 'ok' ).click();
						}, 50 );
					} );

					dialog.once( 'ok', function() {
						editor.insertElement( insertedElement );
					} );

					dialog.once( 'hide', function() {
						// Wait some time, so we're sure, that we're checking final state.
						setTimeout( function() {
							resume( function() {
								assert.isTrue( dialogSelStartEl && ( eFoo.contains( dialogSelStartEl ) || eFoo.equals( dialogSelStartEl ) ),
									'selection retrieved on dialog show is placed in nested editable' );

								assert.isTrue( eFoo.contains( insertedElement ), 'element has been inserted into nested editable' );

								var selStartEl = editor.getSelection().getStartElement();

								assert.isTrue( selStartEl && ( eFoo.contains( selStartEl ) || eFoo.equals( selStartEl ) ),
									'selection retrieved after dialog is hidden is placed in nested editable' );
							} );
						}, 10 );
					} );
				} );

				wait();
			} );
		},

		'test selection in nested editable is preserved after opening and closing dialog - inline editor': function() {
			// https://dev.ckeditor.com/ticket/11399
			if ( CKEDITOR.env.gecko ) {
				assert.ignore();
			}

			bender.editorBot.create( {
				name: 'testselection2',
				creator: 'inline',
				config: {
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor;

				editor.widgets.add( 'testselection2', {
					editables: {
						foo: '.foo'
					}
				} );

				bot.setData( '<p>foo</p><div id="testselection2-w1" data-widget="testselection2"><p class="foo">X</p></div><p>foo</p>', function() {
					var widget1 = getWidgetById( editor, 'testselection2-w1' ),
						eFoo = widget1.editables.foo,
						range = editor.createRange(),
						insertedElement = new CKEDITOR.dom.element( 'span', editor.document ),
						dialogSelStartEl;

					eFoo.focus();

					range.setStart( eFoo, 0 );
					range.collapse( true );
					range.select();

					this.editor.openDialog( 'test1', function( dialog ) {
						dialog.once( 'show', function() {
							dialogSelStartEl = editor.getSelection().getStartElement();

							setTimeout( function() {
								dialog.getButton( 'ok' ).click();
							}, 50 );
						} );

						dialog.once( 'ok', function() {
							editor.insertElement( insertedElement );
						} );

						dialog.once( 'hide', function() {
							// Wait some time, so we're sure, that we're checking final state.
							setTimeout( function() {
								resume( function() {
									assert.isTrue( dialogSelStartEl && ( eFoo.contains( dialogSelStartEl ) || eFoo.equals( dialogSelStartEl ) ),
										'selection retrieved on dialog show is placed in nested editable' );

									assert.isTrue( eFoo.contains( insertedElement ), 'element has been inserted into nested editable' );

									var selStartEl = editor.getSelection().getStartElement();

									assert.isTrue( selStartEl && ( eFoo.contains( selStartEl ) || eFoo.equals( selStartEl ) ),
										'selection retrieved after dialog is hidden is placed in nested editable' );
								} );
							}, 10 );
						} );
					} );

					wait();
				} );
			} );
		},

		'test nested editables\' ACF integration with styles system': function() {
			var editor = this.editor,
				bot = this.editorBot;

			editor.widgets.add( 'testacfstyles1', {
				editables: {
					foo: {
						selector: '.foo',
						allowedContent: 'b'
					},

					bar: {
						selector: '.bar',
						allowedContent: 'b i'
					}
				}
			} );

			bot.setData( '<p>foo</p><div data-widget="testacfstyles1"><p class="foo">X</p><p class="bar">X</p></div><p>foo</p>', function() {
				editor.focus();

				var range = editor.createRange();
				range.selectNodeContents( editor.editable() );
				range.select();

				var style = new CKEDITOR.style( { element: 'i' } );

				editor.applyStyle( style );

				assert.areSame( '<p><i>foo</i></p><div data-widget="testacfstyles1"><p class="foo">X</p><p class="bar"><i>X</i></p></div><p><i>foo</i></p>', editor.getData() );
			} );
		},

		// Nested editable with preexisting numeric id. (https://dev.ckeditor.com/ticket/14451)
		'test nested editable with preexisting numeric id': function() {
			var editor = this.editor,
				bot = this.editorBot;

			editor.widgets.add( 'testpreexistingnumericid', {
				editables: {
					foo: {
						selector: 'p',
						allowedContent: true
					}
				}
			} );

			bot.setData( '<p>foo</p><div data-widget="testpreexistingnumericid"><p id="123">X</p></div><p>foo</p>',
				function() {
				// If that code is being executed, it means that everything is OK.
				assert.pass( 'Editables with numeric ids are handled correctly.' );
			} );
		},

		// (#4060)
		'test nested editables\' content is correctly unescaped': function() {
			// IE 8 returns wrong editor's data in this test, even if it works correctly in manual one.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}

			var editor = this.editor,
				bot = this.editorBot,
				// String must be concatenated to avoid prematurely closing <script> element.
				html = '<div data-widget="testprotected"><div class="content"><script>\'use strict\';</' +
					'script></div></div>';

			editor.widgets.add( 'testprotected', {
				editables: {
					foo: {
						selector: '.content',
						allowedContent: 'script'
					}
				}
			} );

			bot.setData( html, function() {
				var editableContent = editor.editable().getHtml(),
					protectedRegex = /<!--{cke_protected}.+?-->/;

				assert.isTrue( protectedRegex.test( editableContent ), 'Source is protected' );
				assert.areSame( html, editor.getData(), 'Data is correctly unescaped' );
			} );
		},

		// (#4509)
		'test filtering out widget UI elements': function() {
			bender.editorBot.create( {
				name: 'testdatafilter',
				creator: 'replace',
				config: {
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor;

				editor.widgets.add( 'testdatafilter', {
					editables: {
						foo: '.foo'
					}
				} );

				bot.setData( '<div id="w1" data-widget="testdatafilter"><div class="foo"></div></div>', function() {
					var widget1 = getWidgetById( editor, 'w1' ),
						nestedEditable = widget1.editables.foo,
						widgetHtml = '<div tabindex="-1" contenteditable="false" data-cke-widget-wrapper="1" data-cke-filter="off" class="cke_widget_wrapper cke_widget_block' +
							'cke_widget_testdatafilter" data-cke-display-name="div" data-cke-widget-id="1" role="region" aria-label="Widget div">' +
							'<div id="w2" data-widget="testdatafilter" data-cke-widget-keep-attr="1" class="cke_widget_element" data-cke-widget-data="%7B%22classes%22%3Anull%7D">' +
								'<div class="foo cke_widget_editable" contenteditable="true" data-cke-widget-editable="foo" data-cke-enter-mode="1">' +
									'<p>Foo</p>' +
								'</div>' +
							'</div>' +
							'<span class="cke_reset cke_widget_drag_handler_container" style="background:rgba(220,220,220,0.5);background-image:url(img);display:none;">' +
								'<img class="cke_reset cke_widget_drag_handler" data-cke-widget-drag-handler="1" src="img" width="15" title="title" height="15" role="presentation">' +
							'</span>' +
						'</div>',
						expectedHtml = '<div data-widget="testdatafilter" id="w2"><div class="foo"><p>Foo</p></div></div>';

					nestedEditable.setData( widgetHtml );

					bender.assert.isInnerHtmlMatching( expectedHtml, nestedEditable.getData(), null, 'Widget UI elements are filtered out' );
				} );
			} );
		}
	} );
} )();
