/* bender-tags: widgetcore, 13460 */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	var sampleWidget = '<figure data-widget="test" foo="Value1"><span>Value2</span></figure>',
		sampleWidget2 = '<h1 data-widget="test2">TEST2</h1>',
		sampleWidget3ClipboardHtml = '<div data-cke-test3-widget>test3</div>';

	var editorConfig = {
		plugins: 'wysiwygarea,sourcearea,widget,clipboard',
		allowedContent: true,
		language: 'en',
		on: {
			pluginsLoaded: function( evt ) {
				evt.editor.dataProcessor.writer.sortAttributes = 1;

				// Add new, "test" and "test2" widgets to this editor.
				evt.editor.widgets.add( 'test', {
					parts: {
						bar: 'span'
					}
				} );

				evt.editor.widgets.add( 'test2', {} );

				evt.editor.widgets.add( 'test3', {
					getClipboardHtml: function() {
						return sampleWidget3ClipboardHtml;
					},

					upcast: function( el ) {
						if ( el.attributes[ 'data-test3-widget' ] ) {
							return el.wrapWith( new CKEDITOR.htmlParser.element( 'div' ) );
						}

						return false;
					}
				} );
			}
		}
	};

	bender.editor = {
		config: editorConfig
	};

	var fixHtml = widgetTestsTools.fixHtml,
		objToArray = bender.tools.objToArray,
		data2Attr = widgetTestsTools.data2Attribute,
		getWidgetById = widgetTestsTools.getWidgetById,
		widgetWrapperAttributes = widgetTestsTools.widgetWrapperAttributes,
		widgetInitedWrapperAttributes = widgetTestsTools.widgetInitedWrapperAttributes;

	function assertCollapsedSelectionIn( editor, node, offset, msg ) {
		var sel = editor.getSelection(),
			range = sel.getRanges()[ 0 ];

		msg = msg ? msg + ' - ' : '';

		range.optimize();

		assert.isFalse( !!sel.isFake, msg + 'sel.isFake' );
		assert.isTrue( range.collapsed, msg + 'collapsed' );
		assert.areSame( node, range.startContainer, msg + 'startContainer' );
		assert.areSame( offset, range.startOffset, msg + 'startOffset' );
	}

	bender.test( {
		tearDown: function() {
			this.editor.setReadOnly( false );
		},

		// (#1901)
		'test modifier keystrokes upon widget focus': function() {
			var editor = this.editor;

			editor.widgets.add( 'testevent', {
				editables: {
					foo: '.foo'
				}
			} );

			this.editorBot.setData( '<p id="p1">foo</p><div data-widget="testevent" id="w1"><p class="foo">foo</p></div>', function() {
				var widget = getWidgetById( editor, 'w1' );

				widget.focus();
				assert.areNotEqual( false, widget.fire( 'key', { keyCode: CKEDITOR.SHIFT + 121 } ), 'Shift should not be canceled' ); // SHIFT + F10

				widget.focus();
				assert.areNotEqual( false, widget.fire( 'key', { keyCode: CKEDITOR.CTRL + 121 } ), 'Ctrl should not be canceled' ); // CTRL + F10

				widget.focus();
				assert.areNotEqual( false, widget.fire( 'key', { keyCode: CKEDITOR.ALT + 121 } ), 'Alt should not be canceled' ); // ALT + F10
			} );
		},

		'test initializing widgets': function() {
			var editor = this.editor;

			this.editorBot.setData( sampleWidget + '<p>foo</p>' + sampleWidget2 + '<p id="x">foo</p>' + sampleWidget2, function() {
				var editable = editor.editable(),
					instances = objToArray( editor.widgets.instances ),
					names = [ instances[ 0 ].name, instances[ 1 ].name, instances[ 2 ].name ].sort();

				assert.areEqual( 3, instances.length, 'Three widget instances are present.' );
				arrayAssert.itemsAreEqual( [ 'test', 'test2', 'test2' ], names, 'Widgets are correctly initialized' );

				var wrapper = instances[ 0 ].wrapper;
				assert.areSame( instances[ 0 ].element, wrapper.getFirst(), 'Wrapper contains widget element' );
				assert.areEqual( '1', wrapper.data( 'cke-widget-wrapper' ), 'Wrapper has data-cke-widget-wrapper attribute' );
				assert.isTrue( editable.contains( wrapper ), 'Editable contains wrapper' );
				assert.isTrue( instances[ 0 ].isInited(), 'Widget is initialized' );

				// Help IE making selection.
				editor.getSelection().selectElement( editor.document.getById( 'x' ) );

				var el = CKEDITOR.dom.element.createFromHtml( '<h2>YYY</h2>', editor.document );
				editor.insertElement( el );
				var widget = editor.widgets.initOn( el, editor.widgets.registered.test2 );

				instances = objToArray( editor.widgets.instances );

				assert.areEqual( 4, instances.length, 'Four widget instances are present.' );
				assert.areEqual( 'test2', instances[ 3 ].name, 'Widget4 is correctly initialized.' );
				assert.isInstanceOf( CKEDITOR.plugins.widget, widget, 'Widget4 is instance of widget' );
			} );
		},

		'test widgets processing on toHtml': function() {
			var editor = this.editor;

			this.editorBot.setData( '', function() {
				assert.isMatching( new RegExp(
					'^<div ' + widgetWrapperAttributes + '><h1 data-cke-widget-keep-attr="1" data-widget="test2">TEST2</h1></div>' +
					'<p>foo</p>' +
					'<div ' + widgetWrapperAttributes + '><h1 data-cke-widget-keep-attr="1" data-widget="test2">TEST2</h1></div>$'
					),
					fixHtml( editor.dataProcessor.toHtml( sampleWidget2 + '<p>foo</p>' + sampleWidget2 ) )
				);
			} );
		},

		'test internal widgets stuff cleaned up on toHtml': function() {
			var editor = this.editor;

			this.editorBot.setData( '', function() {
				assert.isMatching(
					new RegExp( '^<p>X</p><div ' + widgetWrapperAttributes + '><h1 data-cke-widget-keep-attr="1" data-widget="test2">TEST2</h1></div><p>X</p>$' ),
					fixHtml( editor.dataProcessor.toHtml(
						'<p>X</p><div class="cke_widget_wrapper" data-cke-widget-wrapper="1" data-cke-widget-id="66" id="oldWrapper" contenteditable="false">' + sampleWidget2 + '</div><p>X</p>'
					) )
				);
			} );
		},

		'test widget wrapper is skipped by data processor': function() {
			var editor = this.editor,
				dataProcessor = editor.dataProcessor,
				enableTest = false;

			dataProcessor.htmlFilter.addRules( {
				elements: {
					$: function( el ) {
						if ( !enableTest )
							return;

						el.attributes.foo += '2';
					}
				}
			} );

			dataProcessor.dataFilter.addRules( {
				elements: {
					$: function( el ) {
						if ( !enableTest )
							return;

						el.attributes.foo = '1';
					}
				}
			} );

			enableTest = true;

			this.editorBot.setData( '<p>X</p><div><p data-widget="test" id="w1"><span>foo</span></p></div>', function() {
				var data = editor.getData();

				// Avoid breaking following tests in case of failure in this.
				enableTest = false;

				assert.areSame( '<p foo="12">X</p><div foo="12"><p data-widget="test" id="w1"><span>foo</span></p></div>', data );
				assert.isFalse( getWidgetById( editor, 'w1' ).wrapper.hasAttribute( 'foo' ) );
			} );
		},

		'test widgets cleanup on setData': function() {
			var editor = this.editor,
				bot = this.editorBot;

			this.editorBot.setData( sampleWidget + '<p>foo</p>' + sampleWidget2 + '<p id="x">foo</p>' + sampleWidget2, function() {
				var widgets = editor.widgets,
					instances = objToArray( widgets.instances );

				assert.areEqual( 3, instances.length, 'Three widget instances are present at the beginning' );

				// Help IE making selection.
				editor.getSelection().selectElement( editor.document.getById( 'x' ) );

				var el = CKEDITOR.dom.element.createFromHtml( sampleWidget, editor.document );
				editor.insertElement( el );
				widgets.initOn( el );

				instances = objToArray( widgets.instances );

				assert.areEqual( 4, instances.length, 'Four widget instances are present after initializing new one' );

				var destroyedInstances = 0,
					createdInstances = 0,
					listener1 = widgets.on( 'instanceDestroyed', function() {
						destroyedInstances += 1;
					} ),
					listener2 = widgets.on( 'instanceCreated', function() {
						createdInstances += 1;
					} );

				bot.setData( sampleWidget2, function() {
					instances = objToArray( widgets.instances );
					assert.areEqual( 1, instances.length, 'After setData only one widget instance is registered' );
					assert.areSame( 'test2', instances[ 0 ].name );
					assert.areSame( 4, destroyedInstances, '4 instances were destroyed' );
					assert.areSame( 1, createdInstances, '1 instance was created' );

					// On IE this will fire 'permission denied', because this is old doc's node.
					if ( !CKEDITOR.env.ie )
						assert.isTrue( el.getParent().hasAttribute( 'data-cke-widget-id' ), 'Widgets were destroyed in offline mode' );

					listener1.removeListener();
					listener2.removeListener();
				} );
			} );
		},

		'test checkWidgets event on contentDomInvalidated': function() {
			var editor = this.editor,
				widgets = editor.widgets,
				checked = 0;

			var listener = widgets.on( 'checkWidgets', function() {
				checked += 1;
			} );

			editor.fire( 'contentDomInvalidated' );

			listener.removeListener();

			assert.areSame( 1, checked );
		},

		'test checkWidgets event on insertHtml': function() {
			var editor = this.editor,
				widgets = editor.widgets,
				checked = 0,
				eventData, editorData;

			this.editorBot.setData( '<p data-widget="test2" id="w1">A</p><p>x</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					html = widget.wrapper.getOuterHtml();

				editor.widgets.del( widget );

				editor.focus();
				var range = editor.createRange();
				range.moveToPosition( editor.editable().findOne( 'p' ), CKEDITOR.POSITION_AFTER_START );
				editor.getSelection().selectRanges( [ range ] );

				var listener = widgets.on( 'checkWidgets', function( evt ) {
					checked += 1;
					eventData = evt.data;
					editorData = editor.getData();
				} );

				editor.insertHtml( html );

				listener.removeListener();

				assert.areSame( 1, checked );
				assert.isTrue( eventData.initOnlyNew, 'data.initOnlyNew was passed' );
				assert.isTrue( !!eventData.focusInited, 'data.focusInited was passed' );
				assert.areSame( '<p data-widget="test2" id="w1">A</p><p>x</p>', editorData, 'event was fired after data was inserted' );
			} );
		},

		'test checkWidgets event on insertHtmlIntoRange': function() {
			var editor = this.editor,
				editable = editor.editable(),
				widgets = editor.widgets,
				checked = 0,
				eventData, editorData;

			this.editorBot.setData( '<p data-widget="test2" id="w1">A</p><p>xx</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					html = widget.wrapper.getOuterHtml();

				editor.widgets.del( widget );

				editor.focus();

				var listener = widgets.on( 'checkWidgets', function( evt ) {
					checked += 1;
					eventData = evt.data;
					editorData = editor.getData();
				} );

				var range = editor.createRange();
				range.setStart( editable.getChild( [ 0, 0 ] ), 1 );
				range.collapse();

				editable.insertHtmlIntoRange( html, range );

				listener.removeListener();

				assert.areSame( 1, checked, 'checkWidgets' );
				assert.isTrue( eventData.initOnlyNew, 'data.initOnlyNew was passed' );
				assert.isUndefined( eventData.focusInited, 'data.initOnlyNew was not passed' );
				assert.areSame( '<p>x</p><p data-widget="test2" id="w1">A</p><p>x</p>', editorData, 'event was fired after data was inserted' );
			} );
		},

		'test checkWidgets event on insertText': function() {
			var editor = this.editor,
				widgets = editor.widgets,
				checked = 0,
				eventData, editorData;

			var listener = widgets.on( 'checkWidgets', function( evt ) {
				checked += 1;
				eventData = evt.data;
				editorData = editor.getData();
			} );

			this.editorBot.setHtmlWithSelection( '<p>x^x</p>' );
			editor.insertText( 'foo' );

			listener.removeListener();

			assert.areSame( 1, checked );
			assert.isTrue( eventData.initOnlyNew, 'data.initOnlyNew was passed' );
			assert.areSame( '<p>xfoox</p>', editorData, 'event was fired after data was inserted' );
		},

		'test widgets are correctly destroyed/initialzed on mode switch': function() {
			var editor = this.editor;

			this.editorBot.setData( sampleWidget2 + '<p>foo</p>' + sampleWidget2, function() {
				var widgets = editor.widgets;

				assert.areEqual( 2, CKEDITOR.tools.object.keys( widgets.instances ).length, 'Two widgets instances are present at the beginning' );

				// Ensure async.
				wait( function() {
					editor.setMode( 'source', function() {
						var sourceWidgetsLength = CKEDITOR.tools.object.keys( widgets.instances ).length,
							sourceData = editor.getData();

						editor.setMode( 'wysiwyg', function() {
							resume( function() {
								assert.areEqual( 0, sourceWidgetsLength, 'There are no instances in source mode' );
								assert.areEqual( sampleWidget2 + '<p>foo</p>' + sampleWidget2, sourceData,
									'In source mode widgets are in output format' );

								assert.areEqual( 2, CKEDITOR.tools.object.keys( editor.widgets.instances ).length,
									'Two instances has been initialized after switching back to wysiwyg' );
								assert.areEqual( 2, editor.editable().find( '.cke_widget_wrapper' ).count(),
									'Two widget wrappers are present' );
							} );
						} );
					} );
				} );
			} );
		},

		'test widget cleanup on getData': function() {
			var editor = this.editor;

			this.editorBot.setData( '<div>Foo' + sampleWidget + 'Bar</div>', function() {
				var instances = objToArray( editor.widgets.instances ),
					instance = instances[ 0 ];

				assert.areEqual( '1',
					instance.wrapper.getAttribute( 'data-cke-widget-wrapper' ),
					'Widget wrapper is present.'
				);

				assert.areEqual(
					'<div>Foo<figure data-widget="test" foo="Value1"><span>Value2</span></figure>Bar</div>',
					fixHtml( editor.getData() ),
					'Data processor cleans widgets on getData.'
				);
			} );
		},

		'test automatic data-cke-widget removing if was not present when upcasting': function() {
			var editor = this.editor,
				bot = this.editorBot;

			this.editorBot.setData( '<p>foo</p>', function() {
				editor.widgets.add( 'autodata1', {
					upcast: function( el ) {
						return el.name == 'i' && el.hasClass( 'autodata' );
					}
				} );

				// Check also the variant with downcaster.
				editor.widgets.add( 'autodata2', {
					upcast: function( el ) {
						return el.name == 'b' && el.hasClass( 'autodata' );
					},

					downcast: function( el ) {
						el.attributes.foo = '1';
					}
				} );

				bot.setData(
					'<p><i class="autodata" data-widget="autodata1">A</i><i class="autodata">B</i>' +
					'<b class="autodata" data-widget="autodata2">C</b><b class="autodata">D</b></p>',
					function() {
						assert.areSame( 4, CKEDITOR.tools.object.keys( editor.widgets.instances ).length, '4 widgets are upcasted' );
						assert.areSame( '<p><i class="autodata" data-widget="autodata1">A</i><i class="autodata">B</i>' +
							'<b class="autodata" data-widget="autodata2" foo="1">C</b><b class="autodata" foo="1">D</b></p>', editor.getData() );
					}
				);
			} );
		},

		'test widgets instantiated on paste': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>X</p>' + sampleWidget + '<p>X</p>' + sampleWidget2 + '<p id="x">X</p>', function() {
				assert.areEqual( 2, CKEDITOR.tools.object.keys( editor.widgets.instances ).length, 'instances after setData' );

				// Set selection after last "X".
				var p = editor.document.getById( 'x' ),
					range = editor.createRange();

				range.setStartAt( p, CKEDITOR.POSITION_BEFORE_END );
				range.select();

				p.removeAttribute( 'id' );

				editor.once( 'afterPaste', function() {
					resume( function() {
						assert.areEqual( 4, CKEDITOR.tools.object.keys( editor.widgets.instances ).length, 'instances afterPaste' );

						assert.areEqual( 4, editor.document.find( '.cke_widget_wrapper' ).count(), 'wrappers afterPaste' );

						var ids = [];

						map2WidgetIds( ids, editor.document.find( 'figure' ) );
						map2WidgetIds( ids, editor.document.find( 'h1' ) );

						ids.sort();

						assert.isTrue( ids[ 0 ] != ids[ 1 ] && ids[ 1 ] != ids[ 2 ] && ids[ 2 ] != ids[ 3 ],
							'Each element has its own widget instance' );
					} );
				} );

				// Ensure async.
				wait( function() {
					// Paste exactly what can be copied from editable.
					editor.execCommand( 'paste', editor.editable().getHtml() );
				} );
			} );

			function map2WidgetIds( ids, collection ) {
				for ( var i = 0; i < collection.count(); ++i )
					ids.push( editor.widgets.getByElement( collection.getItem( i ) ).id );
			}
		},

		'test pasting upcasted widgets': function() {
			var pattern = new RegExp(
				'^<p><span ' + widgetInitedWrapperAttributes + '>' +
					'<span class="cke_widget_element" data-cke-widget-data="' +
					data2Attr( { 'classes': null } ) +
					'" data-cke-widget-keep-attr="0" data-cke-widget-upcasted="1" data-widget="test_upcasted_pasting"><i class="upcasted_pasting">foo</i></span>' +
					widgetTestsTools.widgetDragHanlder +
				'</span>X?(<br />)?</p>' +
				'(<div [^>]+>&nbsp;</div>)?$' // Hidden sel container.
			);

			var editor = this.editor,
				bot = this.editorBot;

			editor.widgets.add( 'test_upcasted_pasting', {
				upcast: function( el ) {
					if ( el.name == 'i' && el.hasClass( 'upcasted_pasting' ) )
						return el.wrapWith( new CKEDITOR.htmlParser.element( 'span' ) );
				}
			} );

			this.editorBot.setData( '<p><i class="upcasted_pasting">foo</i></p>', function() {
				editor.focus();
				var html = editor.editable().getHtml();

				assert.isMatching( pattern, fixHtml( html ), 'HTML after loading element to be upcasted' );
				assert.areSame( 1, CKEDITOR.tools.object.keys( editor.widgets.instances ).length, '1 widget instance after setData' );

				bot.setData( '<p>X</p>', function() {
					editor.once( 'afterPaste', function() {
						resume( function() {
							assert.isMatching( pattern, fixHtml( editor.editable().getHtml() ), 'HTML after pasting element' );
							assert.areSame( 1, CKEDITOR.tools.object.keys( editor.widgets.instances ).length, '1 widget instance after paste' );
						} );
					} );

					// Ensure async.
					wait( function() {
						editor.execCommand( 'paste', html );
					} );
				} );
			} );
		},

		'test widget\'s data is preserved after paste': function() {
			var editor = this.editor;

			this.editorBot.setData( sampleWidget + '<p>X</p>', function() {
				objToArray( editor.widgets.instances )[ 0 ].setData( 'foo', 'bar' );

				var html = editor.editable().getHtml();

				editor.once( 'afterPaste', function() {
					resume( function() {
						assert.areSame( 'bar', objToArray( editor.widgets.instances )[ 0 ].data.foo );
					} );
				} );

				wait( function() {
					editor.setData( '', function() {
						editor.execCommand( 'paste', html );
					} );
				} );
			} );
		},

		'test single pasted widget is focused': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p id="w1" data-widget="test2">X</p>', function() {
				var html = editor.editable().getHtml();

				// https://bugzilla.mozilla.org/show_bug.cgi?id=911201
				if ( CKEDITOR.env.gecko )
					html = html.replace( /^<br>/, '' );

				editor.once( 'afterPaste', function() {
					resume( function() {
						var instances = objToArray( editor.widgets.instances ),
							sel = editor.getSelection();

						assert.areSame( 1, instances.length, 'one widget initialized after paste' );
						assert.isTrue( !!sel.isFake, 'fake sel' );
						assert.areSame( instances[ 0 ].wrapper, sel.getSelectedElement(), 'wrapper is selected' );
					} );
				} );

				wait( function() {
					editor.setData( '<p id="x">foo</p><p>bar</p>', function() {
						var range = editor.createRange();
						range.setStartAt( editor.document.getById( 'x' ), CKEDITOR.POSITION_BEFORE_END );
						range.collapse( true );
						range.select();

						editor.execCommand( 'paste', html );
					} );
				} );
			} );
		},

		'test no focused widget after pasting few': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p id="w1" data-widget="test2">A</p><p>X</p><p id="w1" data-widget="test2">B</p>', function() {
				var html = editor.editable().getHtml();

				editor.once( 'afterPaste', function() {
					resume( function() {
						var instances = objToArray( editor.widgets.instances ),
							sel = editor.getSelection();

						assert.areSame( 2, instances.length, 'one widget initialized after paste' );
						assert.isFalse( !!sel.isFake, 'selection is not fake' );
					} );
				} );

				wait( function() {
					editor.setData( '<p id="x">foo</p><p>bar</p>', function() {
						var range = editor.createRange();
						range.setStartAt( editor.document.getById( 'x' ), CKEDITOR.POSITION_BEFORE_END );
						range.collapse( true );
						range.select();

						editor.execCommand( 'paste', html );
					} );
				} );
			} );
		},

		'test copying single focused widget': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>X</p><p id="w1" data-widget="test2">A</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					selectionChanged = 0;

				widget.focus();

				editor.on( 'selectionChange', function() {
					selectionChanged += 1;
				} );

				var evt = new CKEDITOR.dom.event( { keyCode: CKEDITOR.CTRL + 67 } ),
					prevented = 0;

				evt.preventDefault = function() {
					prevented += 1;
				};

				editor.editable().fire( 'keydown', evt );

				var copybin = editor.document.getById( 'cke_copybin' ),
					selContainer = editor.getSelection().getCommonAncestor();

				assert.isTrue( !!copybin, 'copybin was created' );
				assert.isTrue( copybin.contains( selContainer ) || copybin.equals( selContainer ), 'selection was moved to the copybin' );

				wait( function() {
					assert.areSame( 0, selectionChanged, 'selection has not been changed' );
					assert.areSame( widget, getWidgetById( editor, 'w1' ), 'widget is ok' );
					assert.isTrue( !!editor.getSelection().isFake, 'selection stayed faked' );
					assert.isFalse( !!editor.document.getById( 'cke_copybin' ), 'copybin was removed' );
					assert.areSame( 0, prevented, 'copy was not prevented' );
				}, 150 );
			} );
		},

		'test cutting single focused widget': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>X</p><p id="w1" data-widget="test2">A</p><p>X</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					selectionChanged = 0;

				widget.focus();

				editor.on( 'selectionChange', function() {
					selectionChanged += 1;
				} );

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: CKEDITOR.CTRL + 88 } ) );

				var copybin = editor.document.getById( 'cke_copybin' ),
					selContainer = editor.getSelection().getCommonAncestor();

				assert.isTrue( !!copybin, 'copybin was created' );
				assert.isTrue( copybin.contains( selContainer ) || copybin.equals( selContainer ), 'selection was moved to the copybin' );

				wait( function() {
					assert.isTrue( selectionChanged > 0, 'selection has been changed' );
					assert.isFalse( !!getWidgetById( editor, 'w1' ), 'widget was deleted' );
					assert.isFalse( !!editor.getSelection().isFake, 'selection is not faked' );
					assert.isFalse( !!editor.document.getById( 'cke_copybin' ), 'copybin was removed' );
				}, 150 );
			} );
		},

		// #1570
		'test cutting single focused widget with readonly mode': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>X</p><p id="w1" data-widget="test2">A</p><p>X</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					selectionChanged = 0;

				widget.focus();

				editor.on( 'selectionChange', function() {
					selectionChanged += 1;
				} );

				editor.setReadOnly( true );

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: CKEDITOR.CTRL + 88 } ) );

				var copybin = editor.document.getById( 'cke_copybin' ),
					selContainer = editor.getSelection().getCommonAncestor();

				assert.isTrue( !!copybin, 'copybin was created' );
				assert.isTrue( copybin.contains( selContainer ) || copybin.equals( selContainer ), 'selection was moved to the copybin' );

				wait( function() {
					assert.isTrue( selectionChanged == 0, 'selection has not been changed' );
					assert.isTrue( !!getWidgetById( editor, 'w1' ), 'widget has not been deleted' );
					assert.isFalse( !!editor.getSelection().isFake, 'selection is not faked' );
					assert.isFalse( !!editor.document.getById( 'cke_copybin' ), 'copybin was removed' );
				}, 150 );
			} );
		},

		'test pasting single focused widget': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p data-widget="test2" id="w1">A</p><p id="p1">X</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					html = widget.wrapper.getOuterHtml();

				editor.widgets.del( widget );

				editor.focus();

				var range = editor.createRange();
				range.setStartAt( editor.document.getById( 'p1' ), CKEDITOR.POSITION_BEFORE_END );
				range.collapse( true );
				range.select();

				editor.once( 'afterPaste', function() {
					resume( function() {
						var widget = getWidgetById( editor, 'w1' );

						assert.isTrue( !!widget, 'widget was pasted' );
						assert.areSame( '<p id="p1">X</p><p data-widget="test2" id="w1">A</p>', editor.getData() );
						assert.isTrue( !!editor.getSelection().isFake, 'widget is selected' );
						assert.areSame( widget.wrapper, editor.getSelection().getSelectedElement(), 'widget is selected - element' );
					} );
				} );

				// Ensure async.
				wait( function() {
					editor.execCommand( 'paste', '<span data-cke-copybin-start="1" foo="1">\u200b</span>' + html + '<span data-cke-copybin-end="1">\u200b</span>' );
				} );
			} );
		},

		// https://dev.ckeditor.com/ticket/13460
		'test pasting a widget with lots of extra markup and mixed HTML case': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p id="p1">A<span data-widget="test2" id="w1">A</span>B</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					html = widget.wrapper.getOuterHtml();

				editor.widgets.del( widget );

				editor.focus();

				var range = editor.createRange();
				range.setStartAt( editor.document.getById( 'p1' ), CKEDITOR.POSITION_BEFORE_END );
				range.collapse( true );
				range.select();

				editor.once( 'afterPaste', function() {
					resume( function() {
						var widget = getWidgetById( editor, 'w1' );

						assert.isTrue( !!widget, 'widget was pasted' );
						assert.areSame( '<p id="p1">AB<span data-widget="test2" id="w1">A</span></p>', editor.getData() );
						assert.areSame( widget, editor.widgets.focused, 'widget is selected' );
					} );
				} );

				// Ensure async.
				wait( function() {
					editor.execCommand( 'paste',
						'<SPAN style="POSITION: absolute; WIDTH: 1px; HEIGHT: 1px; OVERFLOW: hidden; LEFT: -5000px">' +
							'<SPAN data-cke-copybin-start="1" foo="1">\u200b</SPAN>' +
								html +
							'<SPAN data-cke-copybin-end="1">\u200b</SPAN>' +
						'</SPAN>'
					);
				} );
			} );
		},

		'test copying widget with context': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>X<b><span id="w1" data-widget="test2">A</span></b>X</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					evt = new CKEDITOR.dom.event( { keyCode: CKEDITOR.CTRL + 67 } );

				widget.focus();

				editor.editable().fire( 'keydown', evt );

				wait( function() {
					var range = editor.getSelection().getRanges()[ 0 ];
					assert.areSame( 'b', range.startContainer.getName(), 'startContainer' );
					assert.areSame( 'b', range.endContainer.getName(), 'endContainer' );
					assert.isTrue( range.startContainer.getChild( 0 ).hasClass( 'cke_widget_wrapper' ) );
				}, 150 );
			} );
		},

		// (#3138)
		'test widget clipboard html can be shadowed': function() {
			var editor = this.editor;

			this.editorBot.setData( '<div id="w1" data-widget="test3">test3</div>', function() {
				var widget = getWidgetById( editor, 'w1' );

				assert.areEqual( sampleWidget3ClipboardHtml, widget.getClipboardHtml() );
			} );
		},

		// (#3138)
		'test shadowed clipboard HTML is used for copying (single widget)': function() {
			var editor = this.editor;

			this.editorBot.setData( '<div id="w1" data-widget="test3">test3</div>', function() {
				var widget = getWidgetById( editor, 'w1' );

				widget.focus();

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: CKEDITOR.CTRL + 67 } ) ); // CTRL + C

				// At this point copybin is selected.
				var clipboardHtml = editor.getSelectedHtml( true );

				wait( function() {
					assert.isMatching( /.*data-cke-test3-widget.*/, clipboardHtml );
				}, 150 );
			} );
		},

		// (#3138)
		'test shadowed clipboard HTML is used for cutting (single widget)': function() {
			var editor = this.editor;

			this.editorBot.setData( '<div id="w1" data-widget="test3">test3</div>', function() {
				var widget = getWidgetById( editor, 'w1' );

				widget.focus();

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: CKEDITOR.CTRL + 88 } ) ); // CTRL + X

				// At this point copybin is selected.
				var clipboardHtml = editor.getSelectedHtml( true );

				wait( function() {
					assert.isMatching( /.*data-cke-test3-widget.*/, clipboardHtml );
				}, 150 );
			} );
		},

		// (#3138)
		'test shadowed clipboard HTML is used for copying (multiple widget)': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>Lorem</p><div id="w1" data-widget="test3">test3</div><div id="w2" data-widget="test3">test3</div><p>Ipsum</p>', function() {
				var range = editor.createRange(),
					editable = editor.editable(),
					startNode = editable.findOne( '#w1' ),
					endNode = editable.findOne( '#w2' ),
					clipboardHtml;

				range.setStartBefore( startNode );
				range.setEndAfter( endNode );
				range.select();

				editor.editable().once( 'copy', function() {
					clipboardHtml = editor.getSelectedHtml( true );
				} );

				editor.editable().fire( 'copy', new CKEDITOR.dom.event( {} ) );

				wait( function() {
					assert.isMatching( /(.*data-cke-test3-widget.*){2}/, clipboardHtml );
				}, 150 );
			} );
		},

		// (#3138)
		'test shadowed clipboard HTML is used for cutting (multiple widget)': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>Lorem</p><div id="w1" data-widget="test3">test3</div><div id="w2" data-widget="test3">test3</div><p>Ipsum</p>', function() {
				var range = editor.createRange(),
					editable = editor.editable(),
					startNode = editable.findOne( '#w1' ),
					endNode = editable.findOne( '#w2' ),
					clipboardHtml;

				range.setStartBefore( startNode );
				range.setEndAfter( endNode );
				range.select();

				editor.editable().once( 'cut', function() {
					clipboardHtml = editor.getSelectedHtml( true );
				} );

				editor.editable().fire( 'cut', new CKEDITOR.dom.event( {} ) );

				wait( function() {
					assert.isMatching( /(.*data-cke-test3-widget.*){2}/, clipboardHtml );
				}, 150 );
			} );
		},

		'test single inserted widget is focused': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<b data-widget="test2">x</b>' );

				var instances = objToArray( editor.widgets.instances ),
					sel = editor.getSelection();

				assert.areSame( 1, instances.length, 'one widget initialized after paste' );
				assert.isTrue( !!sel.isFake, 'fake sel' );
				assert.areSame( instances[ 0 ].wrapper, sel.getSelectedElement(), 'wrapper is selected' );
			} );
		},

		'test single widget inserted with some text is not focused': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.setData( '', function() {
				bot.setHtmlWithSelection( '<p>x^x</p>' );

				editor.insertHtml( '<b data-widget="test2">x</b>foo' );

				var instances = objToArray( editor.widgets.instances ),
					sel = editor.getSelection();

				assert.areSame( 1, instances.length, 'one widget initialized after paste' );
				assert.isFalse( !!sel.isFake, 'selection is not fake' );
			} );
		},

		'test widget blocking/passing keystrokes': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>foo</p><p id="w" data-widget="test2">X</p><p id="p2">bar</p>', function() {
				var widget = getWidgetById( editor, 'w' ),
					editable = editor.editable(),
					evt = new CKEDITOR.dom.event( {} ),
					prevented = 0;

				evt.preventDefault = function() {
					prevented += 1;
				};

				widget.focus();
				evt.$.keyCode = 37;
				editable.fire( 'keydown', evt ); // LEFT
				assert.areSame( 1, prevented, 'left was prevented' );

				widget.focus();
				evt.$.keyCode = CKEDITOR.CTRL + 1;
				editable.fire( 'keydown', evt );
				assert.areSame( 1, prevented, 'CTRL+sth was prevented' );

				widget.focus();
				evt.$.keyCode = 88;
				editable.fire( 'keydown', evt ); // X
				assert.areSame( 2, prevented, 'letter X was prevented' );
			} );
		},

		'leave focused widget by arrow keys': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p id="p1">foo</p><p id="w" data-widget="test2">X</p><p id="p2">bar</p>', function() {
				var editable = editor.editable(),
					p1 = editor.document.getById( 'p1' ),
					p2 = editor.document.getById( 'p2' ),
					widget = getWidgetById( editor, 'w' );

				widget.focus();
				var hasBogus = !!editable.getHtml().match( /foo<br><\/p>/ );

				editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 37 } ) ); // LEFT
				assertCollapsedSelectionIn( editor, p1, hasBogus ? 2 : 1, 'Move left' ); // <p>foo^</p>

				widget.focus();
				editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 39 } ) ); // RIGHT
				assertCollapsedSelectionIn( editor, p2, 0, 'Move right' ); // <p>^bar</p>
			} );
		},

		'do not leave focused widget by arrow keys if there is not editing place by its side': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p id="w" data-widget="test2">X</p>', function() {
				var editable = editor.editable(),
					widget = getWidgetById( editor, 'w' );

				widget.focus();
				editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 37 } ) ); // LEFT
				assert.areSame( widget.wrapper, editor.getSelection().getSelectedElement(), 'Move left - selectedElement' );
				assert.isTrue( !!editor.getSelection().isFake, 'Move left - isFake' );

				widget.focus();
				editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 39 } ) ); // RIGHT
				assert.areSame( widget.wrapper, editor.getSelection().getSelectedElement(), 'Move right - selectedElement' );
				assert.isTrue( !!editor.getSelection().isFake, 'Move right - isFake' );
			} );
		},

		'move to sibling widget by arrow keys': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>X</p><p id="w1" data-widget="test2">X</p><p id="w2" data-widget="test2">X</p>', function() {
				var editable = editor.editable(),
					widget1 = getWidgetById( editor, 'w1' ),
					widget2 = getWidgetById( editor, 'w2' );

				widget1.focus();
				editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 39 } ) ); // RIGHT
				assert.areSame( widget2.wrapper, editor.getSelection().getSelectedElement(), 'Move right 1 - selectedElement' );
				assert.isTrue( !!editor.getSelection().isFake, 'Move right 1 - isFake' );


				editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 37 } ) ); // LEFT
				assert.areSame( widget1.wrapper, editor.getSelection().getSelectedElement(), 'Move left 1 - selectedElement' );
				assert.isTrue( !!editor.getSelection().isFake, 'Move left 1 - isFake' );
			} );
		},

		'forwarding keys to focused widget': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p id="w1" data-widget="test2">X</p><p id="w2" data-widget="test2">X</p><p id="x">foo</p>', function() {
				var editable = editor.editable(),
					widget1 = getWidgetById( editor, 'w1' ),
					widget2 = getWidgetById( editor, 'w2' ),
					key1Caught = 0,
					key2Caught = 0;

				widget1.on( 'key', function( evt ) {
					assert.areSame( 77, evt.data.keyCode, 'keyCode' );
					key1Caught += 1;
				} );

				widget2.on( 'key', function( evt ) {
					assert.areSame( 77, evt.data.keyCode, 'keyCode' );
					key2Caught += 1;
				} );

				widget1.focus();
				editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 77 } ) );
				assert.areSame( 1, key1Caught, 'Keydown on widget 1 was caught' );
				assert.areSame( 0, key2Caught, 'Keydown on widget 2 was not caught' );

				editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 77 } ) );
				assert.areSame( 2, key1Caught, 'Keydown on widget 1 was caught 2' );
				assert.areSame( 0, key2Caught, 'Keydown on widget 2 was not caught 2' );

				widget2.focus();
				editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 77 } ) );
				assert.areSame( 2, key1Caught, 'Keydown on widget 1 was not caught' );
				assert.areSame( 1, key2Caught, 'Keydown on widget 2 was caught' );

				editor.getSelection().selectElement( editor.document.getById( 'x' ) );
				editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 77 } ) );
				assert.areSame( 2, key1Caught, 'Keydown on widget 1 was not caught 3' );
				assert.areSame( 1, key2Caught, 'Keydown on widget 2 was not caught 3' );
			} );
		},

		'blocking forwarded keys by widget listener': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p id="w1" data-widget="test2">X</p>', function() {
				var editable = editor.editable(),
					widget1 = getWidgetById( editor, 'w1' ),
					fired = false;

				widget1.on( 'key', function( evt ) {
					evt.cancel();
				} );

				var listener = editor.on( 'key', function() {
					fired = true;
				} );

				widget1.focus();
				var success = editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 77 } ) );
				listener.removeListener();

				assert.isFalse( fired, 'Editor#key listener was not fired' );
				assert.isFalse( success, 'Keydown was cancelled' );
			} );
		},

		'all not handled keys are blocked by default on focused widget': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p id="w1" data-widget="test2">X</p>', function() {
				var editable = editor.editable(),
					widget1 = getWidgetById( editor, 'w1' ),
					evt = new CKEDITOR.dom.event( {} ),
					prevented = 0;

				evt.preventDefault = function() {
					prevented += 1;
				};

				widget1.focus();

				evt.$.keyCode = 65; // A.
				editable.fire( 'keydown', evt );
				assert.areSame( 1, prevented );

				evt.$.keyCode = 49; // 1.
				editable.fire( 'keydown', evt );
				assert.areSame( 2, prevented );

				evt.$.keyCode = 32; // Space.
				editable.fire( 'keydown', evt );
				assert.areSame( 3, prevented );
			} );
		},

		'forwarding double click to widget': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p id="w1" data-widget="test2"><span id="i1">X</span></p>', function() {
				var widget1 = getWidgetById( editor, 'w1' ),
					fired = 0,
					clicked;

				widget1.on( 'doubleclick', function( evt ) {
					fired += 1;
					clicked = evt.data.element;
				}, null, null, 1 );
				// High priority to overtake widget's default double click handler.

				editor.fire( 'doubleclick', { element: editor.document.getById( 'w1' ) } );

				assert.areSame( 1, fired, 'Widget#doubleclick was fired' );
				assert.areSame( editor.document.getById( 'w1' ), clicked, 'Clicked element is w1' );

				editor.fire( 'doubleclick', { element: editor.document.getById( 'i1' ) } );

				assert.areSame( 2, fired, 'Widget#doubleclick was fired on dbclick on inner element' );
				assert.areSame( editor.document.getById( 'i1' ), clicked, 'Clicked element is i1' );
			} );
		},

		'blocking forwarded double click by widget listener': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p id="w1" data-widget="test2">X</p>', function() {
				var widget1 = getWidgetById( editor, 'w1' ),
					fired = false;

				widget1.on( 'doubleclick', function( evt ) {
					evt.cancel();
				} );

				var listener = editor.on( 'doubleclick', function() {
					fired = true;
				} );

				var success = editor.fire( 'doubleclick', { element: editor.document.getById( 'w1' ) } );

				listener.removeListener();

				assert.isFalse( fired, 'Editor#doubleclick listener was not fired' );
				assert.isFalse( success, 'Editor#doubleclick was cancelled' );
			} );
		}
	} );
} )();
