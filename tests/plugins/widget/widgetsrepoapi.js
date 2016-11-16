/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';
	var Widget,
		parserEm = new CKEDITOR.htmlParser.element( 'em' ),
		parserEmDataWidgetTest = new CKEDITOR.htmlParser.element( 'em', { 'data-widget': 'test' } ),
		parserEmDataWidgetFalse = new CKEDITOR.htmlParser.element( 'em', { 'data-widget': false } ),
		parserElDataWidgetWrapperFalse = new CKEDITOR.htmlParser.element( 'em', { 'data-cke-widget-wrapper': 'false' } ),
		parserElDataWidgetWrapperTrue = new CKEDITOR.htmlParser.element( 'em', { 'data-cke-widget-wrapper': 'true' } ),

		domEm = CKEDITOR.dom.element.createFromHtml( '<em></em>' ),
		domEmDataWidgetTest = CKEDITOR.dom.element.createFromHtml( '<em data-widget="test" >foo</em>' ),
		domEmDataWidgetFalse = CKEDITOR.dom.element.createFromHtml( '<em data-widget="false" ></em>' ),
		domEmDataWidgetWrapperFalse = CKEDITOR.dom.element.createFromHtml( '<em data-cke-widget-wrapper="false" ></em>' ),
		domEmDataWidgetWrapperTrue = CKEDITOR.dom.element.createFromHtml( '<em data-cke-widget-wrapper="true" ></em>' ),
		domEmWidgetEditable = CKEDITOR.dom.element.createFromHtml( '<em data-cke-widget-editable ></em>' ),
		domEmWidgetDragHandler = CKEDITOR.dom.element.createFromHtml( '<em data-cke-widget-drag-handler></em>' ),
		domEmWidgetDragHandlerContainer = CKEDITOR.dom.element.createFromHtml( '<em class="cke_widget_drag_handler_container"></em>' );

	bender.editor = {
		config: {
			allowedContent: true,
			language: 'en',
			on: {
				loaded: function( evt ) {
					Widget = CKEDITOR.plugins.widget;
					evt.editor.widgets.add( 'test', {} );
					evt.editor.widgets.add( 'testblock', { inline: false } );
					evt.editor.widgets.add( 'testinline', { inline: true } );
					evt.editor.widgets.add( 'testnested', {
						editables: {
							foo: '.foo',
							bar: '.bar'
						}
					} );
				}
			}
		}
	};

	function writeFrag( frag ) {
		var writer = new CKEDITOR.htmlParser.basicWriter();
		writer.sortAttributes = true;

		frag.writeHtml( writer );
		return writer.getHtml();
	}

	function keysLength( obj ) {
		return CKEDITOR.tools.objectKeys( obj ).length;
	}

	var fixHtml = widgetTestsTools.fixHtml,
		data2Attr = widgetTestsTools.data2Attribute,
		getWidgetById = widgetTestsTools.getWidgetById,
		classes2Array = widgetTestsTools.classes2Array,
		widgetWrapperAttributes = widgetTestsTools.widgetWrapperAttributes,
		widgetInitedWrapperAttributes = widgetTestsTools.widgetInitedWrapperAttributes;

	bender.test( {
		'test initial state': function() {
			var editor = this.editor,
				widgets = editor.widgets;

			assert.isInstanceOf( CKEDITOR.plugins.widget.repository, widgets, 'widgets' );
			assert.areEqual( 0, keysLength( widgets.instances ), 'widgets.instances is empty' );
			assert.areEqual( 4, keysLength( widgets.registered ), 'widgets.registered contains 4 widgets' );
			assert.isNull( widgets.focused, 'widgets.focused' );
			assert.areEqual( 0, widgets.selected.length, 'widgets.selected' );
		},

		'test widgets.add and widgets.initOn': function() {
			var editor = this.editor,
				widgets = editor.widgets;

			var widgetDef = { foo: true },
				widgetDefinitionFired = false;

			editor.once( 'widgetDefinition', function( evt ) {
				widgetDefinitionFired = true;
				assert.isTrue( evt.data.foo, 'evt.data.foo' );
				assert.areSame( 'test1', evt.data.name, 'evt.data.name' );
			} );

			var regWidgetDef = widgets.add( 'test1', widgetDef );

			assert.isTrue( widgetDefinitionFired, 'editor#widgetDefinition was fired' );

			assert.areNotSame( widgetDef, widgets.registered.test1, 'registered.test1' );
			assert.areSame( 'test1', regWidgetDef.name, 'widget.name' );
			assert.isTrue( !!editor.commands.test1, 'widget\'s command was defined' );

			this.editorBot.setHtmlWithSelection( '<p>foo^bar</p>' );

			var el = CKEDITOR.dom.element.createFromHtml( '<span data-widget="test1">foo</span>', editor.document );
			editor.insertElement( el );

			var fired = 0;
			widgets.once( 'instanceCreated', function( evt ) {
				assert.isInstanceOf( CKEDITOR.plugins.widget, evt.data, 'evt.data' );
				assert.areSame( editor, evt.data.editor, 'evt.data.editor - event was fired after basic properties were set' );
				fired++;
			} );

			var widget = widgets.initOn( el );

			assert.areSame( 1, fired, 'widgets#instanceCreated was fired' );
			assert.isInstanceOf( CKEDITOR.plugins.widget, widget, 'widget is instance of widget class' );
			assert.areSame( widget, widgets.instances[ widget.id ], 'instances contains widget' );
			assert.isTrue( widget.isInited(), 'widget.isInited' );

			var wrapper = el.getParent();
			assert.areSame( 'span', wrapper.getName(), 'Wrapper is a span' );
			assert.areSame( '1', wrapper.data( 'cke-widget-wrapper' ), 'Wrapper has widget-wrapper attribute' );
			assert.areSame( widget.id, +wrapper.data( 'cke-widget-id' ), 'Wrapper has widget-id attribute' );
			assert.areSame( wrapper, widget.wrapper, 'Widget.wrapper' );
			assert.isFalse( wrapper.hasClass( 'cke_widget_new' ), 'Wrapper does not have cke_widget_new class any more' );

			assert.areSame( widget, widgets.getByElement( el ), 'getByElement el' );
			assert.areSame( widget, widgets.getByElement( wrapper ), 'getByElement wrapper' );
			assert.isNull( widgets.getByElement( wrapper.getParent() ), 'getByElement wrapper\'s parrent' );

			assert.areSame( widget, widgets.initOn( el ), 'Once initialized returns the same widget instance' );

			// Try to initialize widget on non-widget element.

			el = CKEDITOR.dom.element.createFromHtml( '<span>bar</span>', editor.document );
			editor.insertElement( el );

			assert.isNull( widgets.initOn( el ) );

			el = CKEDITOR.dom.element.createFromHtml( '<span data-widget="noSuchWidget">bar</span>', editor.document );
			editor.insertElement( el );

			assert.isNull( widgets.initOn( el ) );

			assert.areSame( 1, fired, 'widgets#instanceCreated was not fired again' );
		},

		'test widgets.initOn - startup data': function() {
			var editor = this.editor;

			editor.widgets.add( 'testiniton1', {} );

			this.editorBot.setData( '<p>X<b>bar</b>X</p>', function() {
				var widget = editor.widgets.initOn( editor.editable().findOne( 'b' ), 'testiniton1', { foo: 1 } );

				assert.areSame( 1, widget.data.foo );
			} );
		},

		'test widgets.add - dialog': function() {
			var editor = this.editor;

			var widgetDef = {
				dialog: {
					title: 'Test2 widget dialog',
					elements: [
						{
							type: 'text',
							id: 'value1',
							label: 'Value1',
							'default': 'testvalue1'
						}
					]
				}
			};

			editor.widgets.add( 'test2', widgetDef );

			assert.isTrue( true );
		},

		'test widgets.add - upcast priorities': function() {
			var editor = this.editor,
				bot = this.editorBot,
				upcastCalled = '';

			editor.widgets.add( 'prioritiesTest1', {
				upcast: function() {
					upcastCalled += '1';
				}
			} );

			editor.widgets.add( 'prioritiesTest2', {
				upcastPriority: 5,
				upcast: function() {
					upcastCalled += '2';
				}
			} );

			editor.widgets.add( 'prioritiesTest3', {
				upcastPriority: 5,
				upcast: function() {
					upcastCalled += '3';
				}
			} );

			editor.widgets.add( 'prioritiesTest4', {
				upcastPriority: 15,
				upcast: function() {
					upcastCalled += '4';
				}
			} );

			editor.widgets.add( 'prioritiesTest5', {
				upcast: function() {
					upcastCalled += '5';
				}
			} );

			bot.setData( '<p>foo</p>', function() {
				assert.areSame( '23154', upcastCalled );
			} );
		},

		'test widgets.wrapElement - inline': function() {
			var editor = this.editor;

			this.editorBot.setHtmlWithSelection( '<p>foo^bar</p>' );

			var el = CKEDITOR.dom.element.createFromHtml( '<em data-widget="test">foo</em>' );
			editor.insertElement( el );

			var wrapper = editor.widgets.wrapElement( el );

			assert.areSame( 'span', wrapper.getName(), 'inline wrapper name' );
			assert.areSame( el, wrapper.getFirst(), 'inline wrapper first child' );
			assert.isTrue( wrapper.hasClass( 'cke_widget_test' ), 'wrapper has css class based on widget name' );
			assert.isMatching(
				new RegExp( '^<p>foo<span ' + widgetWrapperAttributes + '><em data-cke-widget-keep-attr="1" data-widget="test">foo</em></span>bar(<br />)?</p>$' ),
				fixHtml( editor.editable().getHtml() )
			);
			assert.isTrue( wrapper.hasClass( 'cke_widget_inline' ), 'has cke_widget_inline class' );
		},

		'test widgets.wrapElement - block': function() {
			var editor = this.editor;

			this.editorBot.setHtmlWithSelection( '<p>foo^bar</p>' );

			var el = CKEDITOR.dom.element.createFromHtml( '<div data-widget="test">foo</div>' );
			editor.insertElement( el );

			var wrapper = editor.widgets.wrapElement( el );

			assert.areSame( 'div', wrapper.getName(), 'block wrapper name' );
			assert.areSame( el, wrapper.getFirst(), 'block wrapper first child' );
			assert.isTrue( wrapper.hasClass( 'cke_widget_test' ), 'wrapper has css class based on widget name' );
			assert.isMatching(
				new RegExp( '^<p>foo(<br />)?</p><div ' + widgetWrapperAttributes + '><div data-cke-widget-keep-attr="1" data-widget="test">foo</div></div><p>bar(<br />)?</p>$' ),
				fixHtml( editor.editable().getHtml() ), 'HTML after 1st wrapElement()'
			);
			assert.isTrue( wrapper.hasClass( 'cke_widget_block' ), 'has cke_widget_block class' );

			var wrapper2 = editor.widgets.wrapElement( el );

			assert.areSame( wrapper, wrapper2, 'Do not wrap already wrapped element' );
			assert.isMatching(
				new RegExp( '^<p>foo(<br />)?</p><div ' + widgetWrapperAttributes + '><div data-cke-widget-keep-attr="1" data-widget="test">foo</div></div><p>bar(<br />)?</p>$' ),
				fixHtml( editor.editable().getHtml() ), 'HTML after 2nd wrapElement()'
			);
		},

		'test widgets.wrapElement - custom widget name': function() {
			var editor = this.editor;

			this.editorBot.setHtmlWithSelection( '<p>foo^bar</p>' );

			var el = CKEDITOR.dom.element.createFromHtml( '<span>foo</span>' );
			editor.insertElement( el );

			var wrapper = editor.widgets.wrapElement( el, 'test' );

			assert.areSame( 'span', wrapper.getName(), 'inline wrapper name' );
			assert.areSame( el, wrapper.getFirst(), 'inline wrapper first child' );
			assert.isTrue( wrapper.hasClass( 'cke_widget_test' ), 'wrapper has css class based on widget name' );
			assert.isMatching(
				new RegExp( '^<p>foo<span ' + widgetWrapperAttributes + '><span data-cke-widget-keep-attr="0" data-widget="test">foo</span></span>bar(<br />)?</p>$' ),
				fixHtml( editor.editable().getHtml() )
			);
		},

		'test widgets.wrapElement - inline on htmlParser.element': function() {
			var frag = new CKEDITOR.htmlParser.fragment.fromHtml( '<p>foo<em data-widget="test">foo</em>bar</p>' ),
				el = frag.children[ 0 ].children[ 1 ];

			assert.areSame( 'em', el.name );

			var wrapper = this.editor.widgets.wrapElement( el );

			assert.areSame( 'span', wrapper.name, 'inline wrapper name' );
			assert.areSame( el, wrapper.children[ 0 ], 'inline wrapper first child' );
			assert.isMatching(
				new RegExp( '^<p>foo<span ' + widgetWrapperAttributes + '><em data-cke-widget-keep-attr="1" data-widget="test">foo</em></span>bar</p>$' ),
				writeFrag( frag )
			);
			assert.isTrue( wrapper.hasClass( 'cke_widget_inline' ), 'has cke_widget_inline class' );
		},

		'test widgets.wrapElement - block on htmlParser.element': function() {
			var frag = new CKEDITOR.htmlParser.fragment.fromHtml( '<p>foo</p><div data-widget="test">foo</div><p>bar</p>' ),
				el = frag.children[ 1 ];

			assert.areSame( 'div', el.name );

			var wrapper = this.editor.widgets.wrapElement( el );

			assert.areSame( 'div', wrapper.name, 'block wrapper name' );
			assert.areSame( el, wrapper.children[ 0 ], 'block wrapper first child' );
			assert.isMatching(
				new RegExp( '^<p>foo</p><div ' + widgetWrapperAttributes + '><div data-cke-widget-keep-attr="1" data-widget="test">foo</div></div><p>bar</p>$' ),
				writeFrag( frag ), 'HTML after 1st wrapElement()'
			);
			assert.isTrue( wrapper.hasClass( 'cke_widget_block' ), 'has cke_widget_block class' );

			var wrapper2 = this.editor.widgets.wrapElement( el );

			assert.areSame( wrapper, wrapper2, 'Do not wrap already wrapped element' );
			assert.isMatching(
				new RegExp( '^<p>foo</p><div ' + widgetWrapperAttributes + '><div data-cke-widget-keep-attr="1" data-widget="test">foo</div></div><p>bar</p>$' ),
				writeFrag( frag ), 'HTML after 2nd wrapElement()'
			);
		},

		'test widgets.wrapElement - custom widget name on htmlParser.element': function() {
			var frag = new CKEDITOR.htmlParser.fragment.fromHtml( '<p>foo<span>foo</span>bar</p>' ),
				el = frag.children[ 0 ].children[ 1 ];

			assert.areSame( 'span', el.name );

			var wrapper = this.editor.widgets.wrapElement( el, 'test' );

			assert.areSame( 'span', wrapper.name, 'inline wrapper name' );
			assert.isTrue( wrapper.hasClass( 'cke_widget_test' ), 'wrapper has css class based on widget name' );
			assert.areSame( el, wrapper.children[ 0 ], 'inline wrapper first child' );
			assert.isMatching( new RegExp( '^<p>foo<span ' + widgetWrapperAttributes + '><span data-cke-widget-keep-attr="0" data-widget="test">foo</span></span>bar</p>$' ), writeFrag( frag ) );
		},

		'test widgets.wrapElement - force block mode': function() {
			var el = CKEDITOR.dom.element.createFromHtml( '<span>foo</span>' );

			var wrapper = this.editor.widgets.wrapElement( el, 'testblock' );

			assert.areSame( 'div', wrapper.getName(), 'block wrapper name' );
			assert.areSame( el, wrapper.getFirst(), 'wrapper first child' );
			assert.isTrue( wrapper.hasClass( 'cke_widget_block' ), 'has cke_widget_block class' );
		},

		'test widgets.wrapElement - force block mode on htmlParser.element': function() {
			var frag = new CKEDITOR.htmlParser.fragment.fromHtml( '<span>foo</span>' ),
				el = frag.children[ 0 ];

			assert.areSame( 'span', el.name );

			var wrapper = this.editor.widgets.wrapElement( el, 'testblock' );

			assert.areSame( 'div', wrapper.name, 'block wrapper name' );
			assert.areSame( el, wrapper.children[ 0 ], 'wrapper first child' );
			assert.isTrue( wrapper.hasClass( 'cke_widget_block' ), 'has cke_widget_block class' );
		},

		'test widgets.wrapElement - fix DOM': function() {
			var dataP = this.editor.dataProcessor;

			assert.isMatching( new RegExp( '^<p>X</p><div ' + widgetWrapperAttributes + '><em data-cke-widget-keep-attr="1" data-widget="testblock">foo</em></div><p>Y</p>$' ),
				fixHtml( dataP.toHtml( '<p>X<em data-widget="testblock">foo</em>Y</p>' ) ), 'case 1' );

			assert.isMatching( new RegExp( '^<p>X</p><div ' + widgetWrapperAttributes + '><em data-cke-widget-keep-attr="1" data-widget="testblock">foo</em></div><p>Y</p>$' ),
				fixHtml( dataP.toHtml( '<p>X</p><p><em data-widget="testblock">foo</em>Y</p>' ) ), 'case 2' );

			assert.isMatching( new RegExp( '^<p>X</p><div ' + widgetWrapperAttributes + '><em data-cke-widget-keep-attr="1" data-widget="testblock">foo</em></div><p>Y</p>$' ),
				fixHtml( dataP.toHtml( '<p>X<em data-widget="testblock">foo</em></p><p>Y</p>' ) ), 'case 3' );

			assert.isMatching(
				new RegExp(
					'^<p><b class="red">X</b></p><div ' + widgetWrapperAttributes + '>' +
					'<em data-cke-widget-keep-attr="1" data-widget="testblock">foo</em></div><p><b class="red">Y</b></p>$'
				),
				fixHtml( dataP.toHtml( '<p><b class="red">X<em data-widget="testblock">foo</em>Y</b></p>' ) ), 'case 4' );

			// No fixing needed.

			assert.isMatching( new RegExp( '^<p>X<span ' + widgetWrapperAttributes + '><em data-cke-widget-keep-attr="1" data-widget="testinline">foo</em></span>Y</p>$' ),
				fixHtml( dataP.toHtml( '<p>X<em data-widget="testinline">foo</em>Y</p>' ) ), 'case 5' );

			assert.isMatching( new RegExp( '^<p>X</p><div ' + widgetWrapperAttributes + '><h1 data-cke-widget-keep-attr="1" data-widget="testblock">foo</h1></div><p>Y</p>$' ),
				fixHtml( dataP.toHtml( '<p>X</p><h1 data-widget="testblock">foo</h1><p>Y</p>' ) ), 'case 6' );
		},

		'test widgets.wrapElement - detached node': function() {
			var editor = this.editor;

			var el = CKEDITOR.dom.element.createFromHtml( '<b>foo</b>' );

			var wrapper = editor.widgets.wrapElement( el, 'test' );

			assert.areSame( 'span', wrapper.getName(), 'inline wrapper name' );
			assert.areSame( el, wrapper.getFirst(), 'inline wrapper first child' );
			assert.isMatching(
				new RegExp( '^<span ' + widgetWrapperAttributes + '><b data-cke-widget-keep-attr="0" data-widget="test">foo</b></span>$' ),
				fixHtml( wrapper.getOuterHtml() )
			);
		},

		'test widgets.wrapElement - online node in documentFragment': function() {
			var editor = this.editor;

			var el = CKEDITOR.dom.element.createFromHtml( '<b>foo</b>' ),
				frag = new CKEDITOR.dom.documentFragment( CKEDITOR.document );

			frag.append( el );

			var wrapper = editor.widgets.wrapElement( el, 'test' );

			assert.areSame( 'span', wrapper.getName(), 'inline wrapper name' );
			assert.areSame( el, wrapper.getFirst(), 'inline wrapper first child' );
			assert.areSame( wrapper, frag.getFirst(), 'fragment\'s first child' );
		},

		'test widgets.wrapElement - detached node - htmlParser.element': function() {
			var el = CKEDITOR.htmlParser.fragment.fromHtml( 'foo', 'b' );

			var wrapper = this.editor.widgets.wrapElement( el, 'test' );

			assert.areSame( 'span', wrapper.name, 'inline wrapper name' );
			assert.areSame( el, wrapper.children[ 0 ], 'inline wrapper first child' );
			assert.isMatching(
				new RegExp( '^<span ' + widgetWrapperAttributes + '><b data-cke-widget-keep-attr="0" data-widget="test">foo</b></span>$' ),
				fixHtml( wrapper.getOuterHtml() )
			);
		},

		'test widgets.wrapElement - adds widget-data attribute': function() {
			var el = CKEDITOR.dom.element.createFromHtml( '<b>foo</b>' );

			this.editor.widgets.wrapElement( el, 'test' );

			assert.areSame( 'test', el.getAttribute( 'data-widget' ) );
			assert.isTrue( el.hasAttribute( 'data-cke-widget-keep-attr' ) );
			assert.areSame( '0', el.getAttribute( 'data-cke-widget-keep-attr' ) );
		},

		'test widgets.wrapElement - adds widget-data attribute - htmlParser.element': function() {
			var el = CKEDITOR.htmlParser.fragment.fromHtml( 'foo', 'b' );

			this.editor.widgets.wrapElement( el, 'test' );

			assert.areSame( 'test', el.attributes[ 'data-widget' ] );
			assert.isTrue( 'data-cke-widget-keep-attr' in el.attributes );
			assert.areSame( '0', '' + el.attributes[ 'data-cke-widget-keep-attr' ] );
		},

		'test widgets.wrapElement - remembers that element had widget-data attribute': function() {
			var el = CKEDITOR.dom.element.createFromHtml( '<b data-widget="test">foo</b>' );

			this.editor.widgets.wrapElement( el, 'test' );

			assert.areSame( 'test', el.getAttribute( 'data-widget' ) );
			assert.isTrue( el.hasAttribute( 'data-cke-widget-keep-attr' ) );
			assert.areSame( '1', el.getAttribute( 'data-cke-widget-keep-attr' ) );
		},

		'test widgets.wrapElement - remembers that element had widget-data attribute - htmlParser.element': function() {
			var el = CKEDITOR.htmlParser.fragment.fromHtml( '<b data-widget="test">foo</b>' ).children[ 0 ];

			this.editor.widgets.wrapElement( el, 'test' );

			assert.areSame( 'test', el.attributes[ 'data-widget' ] );
			assert.isTrue( 'data-cke-widget-keep-attr' in el.attributes );
			assert.areSame( '1', '' + el.attributes[ 'data-cke-widget-keep-attr' ] );
		},

		'test widgets.wrapElement - does not override data-cke-widget-keep-attr': function() {
			var el = CKEDITOR.dom.element.createFromHtml( '<b data-cke-widget-keep-attr="0" data-widget="test">foo</b>' );

			this.editor.widgets.wrapElement( el, 'test' );

			assert.areSame( 'test', el.getAttribute( 'data-widget' ) );
			assert.isTrue( el.hasAttribute( 'data-cke-widget-keep-attr' ) );
			assert.areSame( '0', el.getAttribute( 'data-cke-widget-keep-attr' ) );
		},

		'test widgets.wrapElement - does not override data-cke-widget-keep-attr - htmlParser.element': function() {
			var el = CKEDITOR.htmlParser.fragment.fromHtml( '<b data-cke-widget-keep-attr="0" data-widget="test">foo</b>' ).children[ 0 ];

			this.editor.widgets.wrapElement( el, 'test' );

			assert.areSame( 'test', el.attributes[ 'data-widget' ] );
			assert.isTrue( 'data-cke-widget-keep-attr' in el.attributes );
			assert.areSame( '0', '' + el.attributes[ 'data-cke-widget-keep-attr' ] );
		},

		'test widgets.initOnAll': function() {
			var editor = this.editor;

			editor.widgets.destroyAll( true );

			assert.areEqual( 0, keysLength( editor.widgets.instances ), 'Widgets instances array is cleaned up on setData' );

			// Pass data through data processor so widgets are wrapped, but do not use editor#setData
			// to bypass automatic widgets initialization.
			editor.editable().setHtml( editor.dataProcessor.toHtml( '<p>foo<em data-widget="testinline">bar1</em>boo<em data-widget="testinline">bar2</em></p>' +
				'<div data-widget="testblock">bam</div><p>foo</p>' ) );

			assert.areEqual( 3, editor.widgets.initOnAll().length, '3 new instances returned from 1st initOnAll' );
			assert.areEqual( 3, keysLength( editor.widgets.instances ), '3 instances after 1st initOnAll' );

			assert.areEqual( 0, editor.widgets.initOnAll().length, '0 new instances returned from 2nd initOnAll' );
			assert.areEqual( 3, keysLength( editor.widgets.instances ), '3 instances after 2nd initOnAll' );

			var el = CKEDITOR.dom.element.createFromHtml( '<em data-widget="testinline">bar2</em>', editor.document );
			editor.insertElement( el );

			editor.widgets.wrapElement( el );

			assert.areEqual( 1, editor.widgets.initOnAll().length, '1 new instances returned from 3rd initOnAll' );
			assert.areEqual( 4, keysLength( editor.widgets.instances ), '4 instances after 3rd initOnAll' );

			var ids = [];

			for ( var id in editor.widgets.instances )
				ids.push( id );

			ids.sort();

			assert.isTrue( ids[ 0 ] != ids[ 1 ] && ids[ 1 ] != ids[ 2 ] && ids[ 2 ] != ids[ 3 ],
				'ids are unique' );
		},

		'test widgets.initOnAll visits nested widgets (by nestedEditable.setData)': function() {
			var editor = this.editor;

			editor.widgets.destroyAll( true );

			// Pass data through data processor so widgets are wrapped, but do not use editor#setData
			// to bypass automatic widgets initialization.
			editor.editable().setHtml(
				editor.dataProcessor.toHtml(
					'<div data-widget="testnested"><p class="foo">foo<em data-widget="testinline" id="w1">bar1</em></p></div>' ) );

			assert.areEqual( 1, editor.widgets.initOnAll().length, '1 new instance returned from 1st initOnAll (only outer widget)' );
			assert.areEqual( 2, keysLength( editor.widgets.instances ), '2 instances after 1st initOnAll' );

			assert.areEqual( 0, editor.widgets.initOnAll().length, '0 new instances returned from 2nd initOnAll' );
			assert.areEqual( 2, keysLength( editor.widgets.instances ), '2 instances after 2nd initOnAll' );

			assert.areSame( 'testinline', getWidgetById( editor, 'w1' ).name, 'nested widget has been initialized' );
		},

		'test widgets.destroy': function() {
			var editor = this.editor;

			this.editorBot.setData(
				'<p>foo<em data-widget="testinline" id="widget1">bar1</em>boo</p>' +
				'<div data-widget="testblock" id="widget2">bam</div>',
				function() {
					assert.areEqual( 2, keysLength( editor.widgets.instances ), '2 widgets have been initialized' );

					var widgetEl = editor.document.getById( 'widget1' ),
						widget = editor.widgets.getByElement( widgetEl ),
						firedInstanceDestroyed = false,
						firedDestroy = false;

					editor.widgets.once( 'instanceDestroyed', function( evt ) {
						assert.areSame( widget, evt.data, 'evt.data in instanceDestroyed' );
						firedInstanceDestroyed = true;
					} );
					widget.on( 'destroy', function() {
						assert.isFalse( firedInstanceDestroyed, 'widget#destroy is fired first' );
						firedDestroy = true;
					} );

					editor.widgets.destroy( widget, true );

					assert.areEqual( 1, keysLength( editor.widgets.instances ), '1 widget remained after destroying 1st' );
					assert.isFalse( !!editor.widgets.instances[ widget.id ], 'widget has been removed from instances' );
					assert.isTrue( editor.document.getBody().contains( widgetEl ), 'element is still present in DOM' );
					assert.isMatching(
						'<p>foo<span ' + widgetInitedWrapperAttributes + '>' +
							'<em class="cke_widget_element" data-cke-widget-data="' +
							data2Attr( { 'classes': null } ) +
							'" data-cke-widget-keep-attr="1" data-widget="testinline" id="widget1">bar1</em>' +
							widgetTestsTools.widgetDragHanlder +
						'</span>boo(<br />)?</p>' +
						'<div ' + widgetInitedWrapperAttributes + '>' +
							'<div class="cke_widget_element" data-cke-widget-data="' +
							data2Attr( { 'classes': null } ) + '" data-cke-widget-keep-attr="1" data-widget="testblock" id="widget2">bam</div>' +
							widgetTestsTools.widgetDragHanlder +
						'</div>',
						fixHtml( editor.editable().getHtml() ),
						'data after destroying 1st widget'
					);
					assert.isFalse( widget.isInited(), 'widget.isInited' );
					assert.isFalse( !!widget.wrapper, 'widget.wrapper' );
					assert.isTrue( firedInstanceDestroyed, 'widgets#instanceDestroyed' );
					assert.isTrue( firedDestroy, 'widget#destroy' );

					widgetEl = editor.document.getById( 'widget2' );
					widget = editor.widgets.getByElement( widgetEl );

					editor.widgets.destroy( widget );

					assert.areEqual( 0, keysLength( editor.widgets.instances ), '0 widgets remained after destroying 2nd' );
					assert.isTrue( editor.document.getBody().contains( widgetEl ), 'element2 is still present in DOM' );
					assert.isMatching(
						'<p>foo<span ' + widgetInitedWrapperAttributes + '>' +
							'<em class="cke_widget_element" data-cke-widget-data="' +
							data2Attr( { 'classes': null } ) + '" data-cke-widget-keep-attr="1" data-widget="testinline" id="widget1">bar1</em>' +
							widgetTestsTools.widgetDragHanlder +
						'</span>boo(<br />)?</p>' +
						'<div data-widget="testblock" id="widget2">bam</div>',
						fixHtml( editor.editable().getHtml() ), 'data after destroying 2nd widget' );
					assert.isFalse( widget.isInited(), 'widget2.isInited' );
					assert.isFalse( !!widget.wrapper, 'widget2.wrapper' );
				}
			);
		},

		'test widgets.destroy - nested widgets are destroyed together with main widget': function() {
			var editor = this.editor;

			this.editorBot.setData(
				'<div data-widget="testnested" id="wp1">' +
					'<p class="foo">foo<em data-widget="testinline" id="wn1">bar1</em><em data-widget="testinline" id="wn2">bar1</em></p>' +
					'<p class="bar">foo<em data-widget="testinline" id="wn3">bar1</em></p>' +
				'</div>' +
				'<div data-widget="testnested" id="wp2">' +
					'<p class="foo">foo<em data-widget="testinline" id="wn4">bar1</em></p>' +
				'</div>',
				function() {
					var w1 = getWidgetById( editor, 'wp1' ),
						wn1 = getWidgetById( editor, 'wn1' );

					var destroyedIds = [],
						listener = editor.widgets.on( 'instanceDestroyed', function( evt ) {
							destroyedIds.push( evt.data.element.$.id );
						} );

					editor.widgets.destroy( w1 );

					assert.areEqual( 2, keysLength( editor.widgets.instances ), '2 widgets reimained' );
					assert.areSame( 'wn1,wn2,wn3,wp1', destroyedIds.sort().join( ',' ), 'destroyedNames' );
					assert.isFalse( wn1.element.getParent().hasAttribute( 'data-cke-widget-wrapper' ), 'nested widgets were unwrapped too' );

					listener.removeListener();
				}
			);
		},

		'test widgets.destroy - nested widget is destroyed before main widget': function() {
			var editor = this.editor;

			this.editorBot.setData(
				'<div data-widget="testnested" id="w1">' +
					'<p class="foo">foo<em data-widget="testinline" id="w2">bar1</em></p>' +
				'</div>',
				function() {
					var w1 = getWidgetById( editor, 'w1' ),
						w2 = getWidgetById( editor, 'w2' ),
						w1Wrapper;

					w2.on( 'destroy', function() {
						w1Wrapper = !!w1.wrapper;
					} );

					editor.widgets.destroy( w1 );

					assert.areEqual( 0, keysLength( editor.widgets.instances ), '0 widgets reimained' );
					assert.isTrue( w1Wrapper, 'nested widget is destroyed before main one' );
				}
			);
		},

		'test widgets.destroy in offline mode - nested widget is not destroyed': function() {
			var editor = this.editor;

			this.editorBot.setData(
				'<div data-widget="testnested" id="w1">' +
					'<p class="foo">foo<em data-widget="testinline" id="w2">bar1</em></p>' +
				'</div>',
				function() {
					var w1 = getWidgetById( editor, 'w1' ),
						w2 = getWidgetById( editor, 'w2' );

					editor.widgets.destroy( w1, true );

					assert.areEqual( 1, keysLength( editor.widgets.instances ), '1 widget reimained' );
					assert.isNull( w1.wrapper, 'main widget\'s wrapper was reset' );
					assert.isNotNull( w2.wrapper, 'nested widgets wrapper was not reset' );
					assert.areSame( w2, getWidgetById( editor, 'w2' ), 'nested widget still exists' );
				}
			);
		},

		'test widgets.destroyAll': function() {
			var editor = this.editor;

			this.editorBot.setData(
				'<p>foo<em data-widget="testinline" id="widget1">bar1</em>boo</p>' +
				'<div data-widget="testblock" id="widget2">bam</div>',
				function() {
					assert.areEqual( 2, keysLength( editor.widgets.instances ), '2 widgets have been initialized' );

					var destroyedIds = [],
						listener = editor.widgets.on( 'instanceDestroyed', function( evt ) {
							destroyedIds.push( evt.data.id );
						} );

					editor.widgets.destroyAll();

					assert.areEqual( 0, keysLength( editor.widgets.instances ), '0 widgets reimained' );
					assert.isMatching(
						new RegExp( '^<p>foo<em data-widget="testinline" id="widget1">bar1</em>boo(<br />)?</p>' +
						'<div data-widget="testblock" id="widget2">bam</div>$' ),
						fixHtml( editor.editable().getHtml() ), 'data after destroying widgets' );
					assert.areSame( 2, destroyedIds.length, 'destroyedIds' );
					assert.areNotSame( destroyedIds[ 0 ] != destroyedIds[ 1 ], 'two different widgets have been destroyed' );
					listener.removeListener();
				}
			);
		},

		'test widgets.destroyAll in offline mode': function() {
			var editor = this.editor;

			this.editorBot.setData(
				'<p>foo<em data-widget="testinline" id="widget1">bar1</em>boo</p>' +
				'<div data-widget="testblock" id="widget2">bam</div>',
				function() {
					assert.areEqual( 2, keysLength( editor.widgets.instances ), '2 widgets have been initialized' );

					var html = editor.editable().getHtml(),
						destroyedIds = [],
						listener = editor.widgets.on( 'instanceDestroyed', function( evt ) {
							destroyedIds.push( evt.data.id );
						} );

					editor.widgets.destroyAll( true );

					assert.areEqual( 0, keysLength( editor.widgets.instances ), '0 widgets reimained' );
					assert.areSame( html, editor.editable().getHtml(), 'data after destroying widgets' );
					assert.areSame( 2, destroyedIds.length, 'destroyedIds' );
					assert.areNotSame( destroyedIds[ 0 ] != destroyedIds[ 1 ], 'two different widgets have been destroyed' );
					listener.removeListener();
				}
			);
		},

		'test widgets.destroyAll - nested widget': function() {
			var editor = this.editor;

			this.editorBot.setData(
				'<div data-widget="testnested"><p class="foo">foo<em data-widget="testinline">bar1</em></p></div>',
				function() {
					assert.areEqual( 2, keysLength( editor.widgets.instances ), '2 widgets have been initialized' );

					var destroyedNames = [],
						listener = editor.widgets.on( 'instanceDestroyed', function( evt ) {
							destroyedNames.push( evt.data.name );
						} );

					editor.widgets.destroyAll();

					assert.areEqual( 0, keysLength( editor.widgets.instances ), '0 widgets reimained' );
					assert.areSame( 'testinline,testnested', destroyedNames.sort().join( ',' ), 'destroyedNames' );
					listener.removeListener();
				}
			);
		},

		'test widgets.destroyAll within specified container': function() {
			var editor = this.editor;

			this.editorBot.setData(
				'<p data-widget="testblock" id="w1">bar1</p>' +
				'<div id="c1">' +
					'<p data-widget="testblock" id="w2">bar1</p>' +
					'<p><span data-widget="testinline" id="w3">bar1</em></p>' +
				'</div>',
				function() {
					assert.areEqual( 3, keysLength( editor.widgets.instances ), '3 widgets have been initialized' );

					editor.widgets.destroyAll( false, editor.document.getById( 'c1' ) );

					assert.areEqual( 1, keysLength( editor.widgets.instances ), '1 widget reimained' );
					assert.isNotNull( getWidgetById( editor, 'w1' ), 'widget outside specified container has not been destroyed' );
					assert.isNull( getWidgetById( editor, 'w2', true ), 'w2 inside specified container has been destroyed' );
					assert.isNull( getWidgetById( editor, 'w3', true ), 'w3 inside specified container has been destroyed' );
				}
			);
		},

		'test widgets.destroyAll within specified container destroys outer widget first': function() {
			var editor = this.editor;

			this.editorBot.setData(
				'<p>foo</p>' +
				'<p data-widget="testblock" id="w1">bar1</p>' +
				'<div id="c1">' +
					'<div data-widget="testnested" id="w2">' +
						'<p class="foo">foo<em data-widget="testinline" id="w3">bar1</em></p>' +
					'</div>' +
				'</div>',
				function() {
					assert.areEqual( 3, keysLength( editor.widgets.instances ), '3 widgets have been initialized' );

					var w2 = getWidgetById( editor, 'w2' ),
						w2Wrapper = null;

					getWidgetById( editor, 'w3', true ).on( 'destroy', function() {
						w2Wrapper = !!w2.wrapper;
					} );

					editor.widgets.destroyAll( false, editor.document.getById( 'c1' ) );

					assert.areEqual( 1, keysLength( editor.widgets.instances ), '1 widget reimained' );
					assert.isNotNull( getWidgetById( editor, 'w1' ), 'widget outside specified container has not been destroyed' );
					assert.isNull( getWidgetById( editor, 'w2', true ), 'w2 inside specified container has been destroyed' );
					assert.isNull( getWidgetById( editor, 'w3', true ), 'w3 inside specified container has been destroyed' );
					assert.isTrue( w2Wrapper, 'nested widget has been destroyed before its parent' );
				}
			);
		},

		'test widgets.destroyAll in offline mode ignores specified container': function() {
			var editor = this.editor;

			this.editorBot.setData(
				'<p data-widget="testblock" id="w1">bar1</p>' +
				'<div id="c1">' +
					'<p data-widget="testblock" id="w2">bar1</p>' +
					'<p><span data-widget="testinline" id="w3">bar1</em></p>' +
				'</div>',
				function() {
					assert.areEqual( 3, keysLength( editor.widgets.instances ), '3 widgets have been initialized' );

					var w1 = getWidgetById( editor, 'w1' ),
						w2 = getWidgetById( editor, 'w2' );

					editor.widgets.destroyAll( true, editor.document.getById( 'c1' ) );

					assert.areEqual( 0, keysLength( editor.widgets.instances ), '0 widget reimained' );
					assert.isTrue( w1.element.getParent().hasAttribute( 'data-cke-widget-wrapper' ), 'w1 has been destroyed in offline mode' );
					assert.isTrue( w2.element.getParent().hasAttribute( 'data-cke-widget-wrapper' ), 'w2 has been destroyed in offline mode' );
				}
			);
		},

		'test widgets.getByElement - simple widget': function() {
			var editor = this.editor;

			this.editorBot.setData(
				'<div data-widget="testblock" id="x">f<b id="y">o</b>o</div>' +
				'<p><em data-widget="testinline" id="z">bar</em></p>',
				function() {
					var el = editor.document.getById( 'x' ),
						widget = editor.widgets.getByElement( el ),
						widget2 = getWidgetById( editor, 'z' );

					assert.areSame( 'x', widget.element.$.id, 'widget element' ); // Basic test - check if we got correct widget.

					assert.areSame( widget, editor.widgets.getByElement( el.getParent() ), 'wrapper' );
					assert.areSame( widget, editor.widgets.getByElement( editor.document.getById( 'y' ) ), 'element inside widget' );

					assert.areSame( widget, editor.widgets.getByElement( el.getParent(), true ), 'wrapper in wrapperOnly' );

					assert.areSame( widget2, editor.widgets.getByElement( widget2.element ), 'second widget' );
					assert.areSame( widget2, editor.widgets.getByElement( widget2.wrapper, true ), 'second widget in wrapperOnly' );
				}
			);
		},

		'test widgets.getByElement - simple widget - false positive cases': function() {
			var editor = this.editor;

			this.editorBot.setData(
				'<div data-widget="testblock" id="x">f<b id="y">o</b>o</div>' +
				'<p><em data-widget="testinline">bar</em></p>',
				function() {
					var el = editor.document.getById( 'x' ),
						widget = editor.widgets.getByElement( el );

					assert.areSame( 'x', widget.element.$.id, 'widget element' ); // Basic test - check if we got correct widget.

					assert.isNull( editor.widgets.getByElement( editor.document.getBody().getLast() ), 'element outside widget' );
					assert.isNull( editor.widgets.getByElement( editor.document.getBody() ), 'body' );

					assert.isNull( editor.widgets.getByElement( el, true ), 'widget element in onlyWrapper mode' );
					assert.isNull( editor.widgets.getByElement( editor.document.getById( 'y' ), true ), 'element inside widget in onlyWrapper mode' );
				}
			);
		},

		'test widgets.getByElement - nested editable': function() {
			var editor = this.editor;

			this.editorBot.setData(
				'<div data-widget="testnested" id="x">' +
					'<p class="foo" id="y">f<b id="z">o</b></p>' +
				'</div>' +
				'<p><em data-widget="testinline">bar</em></p>',
				function() {
					var widget = getWidgetById( editor, 'x' );

					assert.areSame( widget, editor.widgets.getByElement( editor.document.getById( 'y' ) ), 'nested editable' );
					assert.areSame( widget, editor.widgets.getByElement( editor.document.getById( 'z' ) ), 'element inside nested editable widget' );

					assert.isNull( editor.widgets.getByElement( editor.document.getById( 'y' ), true ), 'nested editable in wrapperOnly mode' );
				}
			);
		},

		'test widgets.getByElement - nested widget': function() {
			var editor = this.editor;

			this.editorBot.setData(
				'<div data-widget="testnested" id="x">' +
					'<div class="foo">' +
						'<p data-widget="testblock" id="y">foo</p>' +
						'<p><em data-widget="testinline" id="z"><b id="zi">bar</b></em></p>' +
					'</div>' +
				'</div>' +
				'<p><em data-widget="testinline">bar</em></p>',
				function() {
					var widgetInnerBlock = editor.widgets.getByElement( editor.document.getById( 'y' ) ),
						widgetInnerInline = editor.widgets.getByElement( editor.document.getById( 'z' ) );

					assert.areSame( 'y', widgetInnerBlock.element.$.id, 'inner block widget' );
					assert.areSame( 'z', widgetInnerInline.element.$.id, 'inner inner widget' );
					assert.areSame( widgetInnerInline, editor.widgets.getByElement( editor.document.getById( 'zi' ) ),
						'element inside nested widget' );

					assert.areSame( widgetInnerBlock, editor.widgets.getByElement( widgetInnerBlock.wrapper, true ),
						'inner block widget in wrapperOnly mode' );
					assert.isNull( editor.widgets.getByElement( widgetInnerBlock.element, true ),
						'widget element in wrapperOnly mode' );
					assert.isNull( editor.widgets.getByElement( editor.document.getById( 'zi' ), true ),
						'element inside nested widget in wrapperOnly mode' );
				}
			);
		},

		'test widgets.getByElement - edge case - widget id == 0': function() {
			var editor = this.editor;

			editor.widgets._.nextId = 0;

			this.editorBot.setData(
				'<p><em data-widget="testinline" id="x">bar</em></p>' +
				'<p><em data-widget="testinline" id="z">bar</em></p>',
				function() {
					var widgetWrapper = editor.editable().findOne( '[data-cke-widget-id="0"]' ),
						widget = editor.widgets.getByElement( widgetWrapper );

					assert.areSame( 0, widget.id, 'widget id is really 0' );

					assert.areSame( widget, editor.widgets.getByElement( widget.element ), 'element' );
					assert.areSame( widget, editor.widgets.getByElement( widget.wrapper, true ), 'wrapper in wrapperOnly mode' );
				}
			);
		},

		'test widgets.getNestedEditable': function() {
			var el = CKEDITOR.dom.element.createFromHtml(
				'<div contenteditable="true" id="el1">' +
					'<div contenteditable="false" data-cke-widget-wrapper="1" id="el2">' +
						'<div contenteditable="true" data-cke-widget-editable="1" id="el3">' +
							'foo' +
							'<span id="el4">bar</span>' +
						'</div>' +
					'</div>' +
					'<span id="el5">bom</span>' +
				'</div>'
			);

			var editable = el.findOne( '#el3' ),
				f = CKEDITOR.plugins.widget.getNestedEditable;

			assert.isNull( f( el, el.findOne( '#el1' ) ), 'el1' );
			assert.isNull( f( el, el.findOne( '#el2' ) ), 'el2' );
			assert.isNull( f( el, el.findOne( '#el5' ) ), 'el5' );
			assert.isNull( f( el, el.findOne( '#el5' ).getFirst() ), 'el5 text child' );

			assert.areSame( editable, f( el, el.findOne( '#el3' ) ), 'el3' );
			assert.areSame( editable, f( el, el.findOne( '#el4' ) ), 'el4' );
			assert.areSame( editable, f( el, el.findOne( '#el3' ).getFirst() ), 'el3 text child' );
			assert.areSame( editable, f( el, el.findOne( '#el4' ).getFirst() ), 'el4 text child' );
		},

		'test widgets.createEditableFilter': function() {
			var widgets = this.editor.widgets;

			var f1 = widgets._tests_createEditableFilter( 'w1', 'e1', { allowedContent: 'b' } ),
				f2 = widgets._tests_createEditableFilter( 'w1', 'e1', { allowedContent: 'b' } ),
				f3 = widgets._tests_createEditableFilter( 'w1', 'e1', { allowedContent: 'i' } );

			assert.isTrue( f1.check( 'b' ) );
			assert.isFalse( f1.check( 'i' ) );

			assert.areSame( f1, f2 );
			assert.areSame( f1, f3 );

			var f4 = widgets._tests_createEditableFilter( 'w2', 'e2', { allowedContent: 'u' } );

			assert.isTrue( f4.check( 'u' ) );

			var f5 = widgets._tests_createEditableFilter( 'w1', 'e2', {} );

			assert.isNull( f5 );
		},

		'test widgets.finalizeCreation': function() {
			var editor = this.editor,
				editorBot = this.editorBot;

			editor.widgets.add( 'testfinalize1', {
				template: '<b>X</b>',
				init: function() {
					this.on( 'edit', function( evt ) {
						// Prevent automatic insertion, so code won't explode later.
						evt.cancel();

						assert.areSame( '<p>foo</p>', editor.getData() );

						var readyEventFired = false;
						this.on( 'ready', function() {
							readyEventFired = true;
						} );

						editor.widgets.finalizeCreation( this.wrapper.getParent( true ) );
						assert.areSame( '<p>foo<b>X</b></p>', editor.getData() );
						assert.isTrue( editor.widgets.getByElement( editor.editable().findOne( 'b' ) ).isReady(), 'widget was marked as ready' );
						assert.isTrue( readyEventFired );
						assert.areSame( this, editor.widgets.focused, 'widget was focused' );
					} );
				}
			} );

			editorBot.setData( '', function() {
				editorBot.setHtmlWithSelection( '<p>foo^</p>' );
				editor.execCommand( 'testfinalize1' );
			} );
		},

		'test widgets.finalizeCreation - no widget in the container': function() {
			var editor = this.editor,
				editorBot = this.editorBot;

			editor.widgets.add( 'testfinalize2', {
				template: '<b>X</b>',
				init: function() {
					this.on( 'edit', function( evt ) {
						// Prevent automatic insertion, so code won't explode later.
						evt.cancel();

						var container = this.wrapper.getParent( true ),
							readyEventFired = false;

						this.wrapper.remove();
						this.on( 'ready', function() {
							readyEventFired = true;
						} );

						editor.widgets.finalizeCreation( container );
						assert.areSame( '<p>foo</p>', editor.getData() );
						assert.isFalse( readyEventFired );
					} );
				}
			} );

			editorBot.setData( '', function() {
				editorBot.setHtmlWithSelection( '<p>foo^</p>' );
				editor.execCommand( 'testfinalize2' );
			} );
		},

		'test widgets.checkWidgets': function() {
			var editor = this.editor,
				editorBot = this.editorBot,
				data = '<p><span data-widget="test">A</span><span data-widget="test">B</span></p>';

			editorBot.setData( data, function() {
				var editable = editor.editable(),
					html = editable.getHtml();

				editable.setHtml( '' );

				editor.widgets.checkWidgets();

				assert.areSame( 0, CKEDITOR.tools.objectKeys( editor.widgets.instances ).length,
					'There should be no widgets in repo.' );

				editable.setHtml( html );

				editor.widgets.checkWidgets();

				var wrappers = editable.find( '.cke_widget_wrapper' );

				assert.areSame( 2, wrappers.count(), 'There should be 2 wrappers.' );
				assert.areSame( 2, CKEDITOR.tools.objectKeys( editor.widgets.instances ).length,
					'There should be 2 widgets in repo.' );

				for ( var i = 0, count = wrappers.count(); i < count; i++ ) {
					var wrapper = wrappers.getItem( i ),
						widget = editor.widgets.getByElement( wrapper );

					assert.isInstanceOf( CKEDITOR.plugins.widget, widget );
				}
			} );
		},

		'test widgets.checkWidgets - do not remove widgets before finalize creation': function() {
			var editor = this.editor,
				editorBot = this.editorBot;

			editor.widgets.add( 'testCheckWidgets1', {
				template: '<b>X</b>',
				init: function() {
					this.on( 'edit', function( evt ) {
						var id = this.id;

						// Prevent automatic insertion, so code won't explode later.
						evt.cancel();
						assert.areSame( '<p>foo</p>', editor.getData() );

						editor.widgets.checkWidgets();

						// Widget should not be removed before finalizeCreation call.
						assert.areSame( this, editor.widgets.instances[ id ], 'widget was not removed from repository' );

						// Call finalizeCreation and check if widget will be removed from repository when
						// no representation in DOM will be found.
						editor.widgets.finalizeCreation( this.wrapper.getParent( true ) );
						this.wrapper.remove();

						// We must do something with the selection, because code outside this test
						// do not expect the wrapper to vanish, what invalidates ranges, what causes errors on IEs (if e.g. the undo plugin is loaded).
						var range = editor.createRange();
						range.moveToPosition( editor.editable().findOne( 'p' ), CKEDITOR.POSITION_AFTER_START );
						editor.getSelection().selectRanges( [ range ] );

						editor.widgets.checkWidgets();
						objectAssert.ownsNoKeys( editor.widgets.instances, 'widget was removed from repository' );
					} );
				}
			} );

			editorBot.setData( '', function() {
				editorBot.setHtmlWithSelection( '<p>foo^</p>' );
				editor.execCommand( 'testCheckWidgets1' );
			} );
		},

		'test widgets.checkWidgets does not initialize widgets in temporary elements': function() {
			var editor = this.editor,
				editorBot = this.editorBot;

			editorBot.setData( '<p><span data-widget="test" id="w1">A</span></p>', function() {
				// Store widgets HTML.
				var widgetHtml = getWidgetById( editor, 'w1' ).wrapper.getOuterHtml();

				// Reset everything.
				editor.editable().setHtml( '' );
				editor.widgets.checkWidgets();

				assert.areSame( 0, CKEDITOR.tools.objectKeys( editor.widgets.instances ).length,
					'There should be no widgets in repo at the beginning.' );

				// Set HTML with two widgets - w1, w2, w3.
				editor.editable().setHtml(
					'<p>' + widgetHtml + '</p>' +
					'<p data-cke-temp="1"><i>' + widgetHtml.replace( /id="?w1"?/, 'id="w2"' ) + '</i></p>' + // Indirect descendant.
					'<p data-cke-temp="1">' + widgetHtml.replace( /id="?w1"?/, 'id="w3"' ) + '</p>' // Direct descendant.
				);

				editor.widgets.checkWidgets();

				assert.areSame( 1, CKEDITOR.tools.objectKeys( editor.widgets.instances ).length,
					'There should be one widget.' );

				assert.isNull( getWidgetById( editor, 'w2' ), 'There should be no widget on #w2' );
				assert.isNull( getWidgetById( editor, 'w3' ), 'There should be no widget on #w3' );
				assert.isNotNull( getWidgetById( editor, 'w1' ), 'There should be a widget on #w1' );
			} );
		},

		'test widgets.checkWidgets - nested widgets - destroying a whole tree': function() {
			var editor = this.editor,
				editorBot = this.editorBot,
				data =
					'<div data-widget="testnested" id="w1"><p class="foo">x</p></div><p>x</p>' +
					'<div data-widget="testblock" id="w2">foo</div>';

			editorBot.setData( data, function() {
				var w1 = getWidgetById( editor, 'w1' );

				// Initialize nested widgets to make sure that they'll have higher ids than parent.
				// That's in order to check if checkWidgets() iterating over instances object will not
				// fail on non existing ids (in online mode destory() destroys its child widgets).
				w1.editables.foo.setData( '<em data-widget="test">foo</em>foo<em data-widget="test">foo</em>' );

				assert.areSame( 4, keysLength( editor.widgets.instances ), 'There should be 4 widgets in repo after init.' );

				w1.wrapper.remove();
				editor.widgets.checkWidgets();

				assert.areSame( 1, keysLength( editor.widgets.instances ), 'There should be 1 widget in repo after checkWidgets.' );
				assert.areSame( 'testblock', getWidgetById( editor, 'w2' ).name );
			} );
		},

		'test widgets.checkWidgets - nested widgets - destroying nested widget': function() {
			var editor = this.editor,
				editorBot = this.editorBot,
				data =
					'<div data-widget="testnested" id="w1"><p class="foo">' +
						'<em data-widget="test" id="wn1">foo</em>foo<em data-widget="test">foo</em>' +
					'</p></div>' +
					'<p>x</p>' +
					'<div data-widget="testblock" id="w2">foo</div>';

			editorBot.setData( data, function() {
				assert.areSame( 4, keysLength( editor.widgets.instances ), 'There should be 4 widgets in repo after init.' );

				getWidgetById( editor, 'wn1', true ).wrapper.remove();
				editor.widgets.checkWidgets();

				assert.areSame( 3, keysLength( editor.widgets.instances ), 'There should be 3 widget in repo after checkWidgets.' );
				assert.isNull( getWidgetById( editor, 'wn1', true ), 'Widget wn1 was destroyed.' );
			} );
		},

		'test widgets.checkWidgets - nested widgets - initializing widget with nested widgets': function() {
			var editor = this.editor,
				editorBot = this.editorBot,
				data =
					'<div data-widget="testnested" id="w1"><p class="foo">' +
						'<em data-widget="test" id="wn1">foo</em>' +
					'</p></div>';

			editorBot.setData( data, function() {
				assert.areSame( 2, keysLength( editor.widgets.instances ), 'There should be 2 widgets in repo after init.' );

				var html = editor.editable().getHtml();
				editor.editable().setHtml( '' );
				editor.widgets.checkWidgets();
				assert.areSame( 0, keysLength( editor.widgets.instances ), 'There should be 0 widgets in repo after DOM is overriden.' );

				editor.editable().setHtml( html.replace( / data-cke-expando="?\d+"?/gi, '' ) );

				editor.widgets.checkWidgets();

				assert.areSame( 2, keysLength( editor.widgets.instances ), 'There should be 2 widgets in repo after checkWidgets.' );

				assert.areSame( 'testnested', getWidgetById( editor, 'w1' ).name, 'Widget w1 was reinitialized.' );
				assert.areSame( 'test', getWidgetById( editor, 'wn1', true ).name, 'Widget wn1 was reinitialized.' );
			} );
		},

		'test widgets.checkWidgets - nested widgets - initializing nested widgets': function() {
			var editor = this.editor,
				editorBot = this.editorBot,
				data =
					'<div data-widget="testnested" id="w1"><p class="foo">' +
						'<em data-widget="test" id="wn1">foo</em>' +
					'</p></div>';

			editorBot.setData( data, function() {
				var w1 = getWidgetById( editor, 'w1' );

				assert.areSame( 2, keysLength( editor.widgets.instances ), 'There should be 2 widgets in repo after init.' );

				var html = w1.editables.foo.getHtml();
				w1.editables.foo.setHtml( '' );
				editor.widgets.checkWidgets();

				assert.areSame( 1, keysLength( editor.widgets.instances ),
					'There should be 1 widget in repo after nested editable\'s DOM is overriden.' );

				w1.editables.foo.setHtml( html );
				editor.widgets.checkWidgets();

				assert.areSame( 2, keysLength( editor.widgets.instances ), 'There should be 2 widgets in repo after checkWidgets.' );
				assert.areSame( 'test', getWidgetById( editor, 'wn1', true ).name, 'Widget wn1 was reinitialized.' );
			} );
		},

		'test widgets.checkWidgets with initOnlyNew option': function() {
			var editor = this.editor,
				editorBot = this.editorBot;

			editorBot.setData( '<p><span data-widget="test" id="w1">A</span></p>', function() {
				// Store widgets HTML.
				var widgetHtml = getWidgetById( editor, 'w1' ).wrapper.getOuterHtml();

				// Set HTML with two widgets - w2 - old one (but invalidated) and w3 - new one.
				editor.editable().setHtml(
					'<p id="p1">' + widgetHtml.replace( /id="?w1"?/, 'id="w2"' ) + '</p>' +
					'<p id="p2">' +
						// Add cke_widget_new class and change id to w2.
						widgetHtml.replace( /cke_widget_wrapper/, 'cke_widget_wrapper cke_widget_new' ).replace( /id="?w1"?/, 'id="w3"' ) +
					'</p>'
				);

				editor.widgets.checkWidgets( { initOnlyNew: true } );

				assert.areSame( 1, CKEDITOR.tools.objectKeys( editor.widgets.instances ).length,
					'There should be one widget.' );

				assert.isNull( getWidgetById( editor, 'w2' ), 'There should be no widget on #w2' );
				assert.isNotNull( getWidgetById( editor, 'w3' ), 'There should be a widget on #w3' );
			} );
		},

		'test widgets.checkWidgets with focusInited option': function() {
			var editor = this.editor,
				editorBot = this.editorBot;

			editorBot.setData( '<p><span data-widget="test" id="w1">A</span></p>', function() {
				editor.editable().setHtml( editor.editable().getHtml() );

				editor.widgets.checkWidgets( { focusInited: true } );

				assert.areSame( 1, CKEDITOR.tools.objectKeys( editor.widgets.instances ).length,
					'There should be one widget.' );

				var sel = editor.getSelection();
				assert.isTrue( !!sel.isFake, 'Selection is fake' );
				assert.areSame( getWidgetById( editor, 'w1' ).wrapper, sel.getSelectedElement(), 'Correct widget is selected' );
			} );
		},

		'test widgets.checkWidgets with focusInited option - two widgets': function() {
			var editor = this.editor,
				editorBot = this.editorBot;

			editorBot.setData( '<p><span data-widget="test" id="w1">A</span><span data-widget="test" id="w2">B</span></p>', function() {
				editor.editable().setHtml( editor.editable().getHtml() );

				editor.widgets.checkWidgets( { focusInited: true } );

				assert.areSame( 2, CKEDITOR.tools.objectKeys( editor.widgets.instances ).length,
					'There should be two widgets.' );

				var sel = editor.getSelection();
				assert.isFalse( !!sel.isFake, 'Selection is not fake' );
			} );
		},

		'test widgets.checkWidgets with focusInited and initOnlyNew options': function() {
			var editor = this.editor,
				editorBot = this.editorBot;

			editorBot.setData( '<p><span data-widget="test" id="w1">A</span></p>', function() {
				var widgetHtml = editor.editable().getHtml();
				editor.editable().setHtml(
					widgetHtml +
					// Add the cke_widget_new class and change id.
					widgetHtml.replace( /cke_widget_wrapper/, 'cke_widget_wrapper cke_widget_new' ).replace( /id="?w1"?/, 'id="w2"' )
				);

				editor.widgets.checkWidgets( { focusInited: true, initOnlyNew: true } );

				assert.areSame( 1, CKEDITOR.tools.objectKeys( editor.widgets.instances ).length,
					'There should be one widget.' );

				var sel = editor.getSelection();
				assert.isTrue( !!sel.isFake, 'Selection is fake' );
				assert.areSame( getWidgetById( editor, 'w2' ).wrapper, sel.getSelectedElement(), 'Correct widget is selected' );
			} );
		},

		'test widgets.checkWidgets fires checkWidgets event': function() {
			var editor = this.editor,
				editorBot = this.editorBot;

			editorBot.setData( '<p><span data-widget="test" id="w1">A</span></p>', function() {
				var fired = 0,
					data;

				editor.editable().setHtml( '' );

				var listener = editor.widgets.on( 'checkWidgets', function( evt ) {
					fired += 1;
					data = evt.data;
				} );

				editor.widgets.checkWidgets( { focusInited: true } );

				listener.removeListener();

				assert.areSame( 1, fired, 'The checkWidgets event was fired once' );
				assert.isTrue( data.focusInited, 'Options are passed to event' );
			} );
		},

		'test widgets.checkWidgets can be canceled by canceling event': function() {
			var editor = this.editor,
				editorBot = this.editorBot;

			editorBot.setData( '<p><span data-widget="test" id="w1">A</span></p>', function() {
				editor.editable().setHtml( '' );

				var listener = editor.widgets.on( 'checkWidgets', function( evt ) {
					evt.cancel();
				}, null, null, 0 );

				editor.widgets.checkWidgets( { focusInited: true } );

				listener.removeListener();

				assert.areSame( 1, CKEDITOR.tools.objectKeys( editor.widgets.instances ).length,
					'There still should be one widget.' );
			} );
		},

		'test options of widgets.checkWidgets can be modified in event listener': function() {
			var editor = this.editor,
				editorBot = this.editorBot;

			editorBot.setData( '<p><span data-widget="test" id="w1">A</span></p>', function() {
				editor.editable().setHtml( editor.editable().getHtml() );

				var listener = editor.widgets.on( 'checkWidgets', function( evt ) {
					evt.data.focusInited = false;
				}, null, null, 0 );

				editor.widgets.checkWidgets( { focusInited: true } );

				listener.removeListener();

				assert.areSame( 1, CKEDITOR.tools.objectKeys( editor.widgets.instances ).length,
					'There should be one widget.' );

				assert.isFalse( !!editor.getSelection().isFake, 'Widget should not be focused' );
			} );
		},

		'test widgets.checkWidgets draghandler re usage': function() {
			var editor = this.editor,
				data = '<p><span data-widget="test">B</span></p>';

			this.editorBot.setData( data, function() {
				var editable = editor.editable();

				// We need to remove data-cke-expando to remove event listeners on IE8.
				editable.setHtml( editable.getHtml().replace( / data-cke-expando="?\d+"?/gi, '' ) );
				editor.widgets.checkWidgets();

				var dragHandlers = editor.editable().find( '.cke_widget_drag_handler_container' );

				assert.areEqual( 1, dragHandlers.count(), 'There should be still only one drag handler' );
			} );
		},

		'test widgets.checkWidgets draghandler re usage - nested widget': function() {
			var editor = this.editor,
				data =
				'<div data-widget="testdraghandler1" id="x">' +
					'<div class="foo">' +
						'<p><em data-widget="testinline" id="y">bar</em></p>' +
					'</div>' +
				'</div>';

			editor.widgets.add( 'testdraghandler1', {
				editables: {
					foo: '.foo'
				}
			} );

			this.editorBot.setData( data, function() {
				var editable = editor.editable();

				// We need to remove data-cke-expando to remove event listeners on IE8.
				editable.setHtml( editable.getHtml().replace( / data-cke-expando="?\d+"?/gi, '' ) );
				editor.widgets.checkWidgets();

				var dragHandlers = editor.editable().find( '.cke_widget_drag_handler_container' );
				assert.areEqual( 2, dragHandlers.count(), 'There should be two drag handlers' );

				var widget = getWidgetById( editor, 'x' );
				assert.areSame( widget.wrapper, widget.dragHandlerContainer.getParent(), 'Main widget\'s drag handler is directly in the wrapper' );
				widget = getWidgetById( editor, 'y' );
				assert.areSame( widget.wrapper, widget.dragHandlerContainer.getParent(), 'Nested widget\'s drag handler is directly in the wrapper' );
			} );
		},

		'test widgets.checkWidgets mask re usage': function() {
			var editor = this.editor,
				data = '<p><span data-widget="testmaskreusage">B</span></p>';

			editor.widgets.add( 'testmaskreusage', {
				mask: true
			} );

			this.editorBot.setData( data, function() {
				var editable = editor.editable();

				editable.setHtml( editable.getHtml() );
				editor.widgets.checkWidgets();

				var masks = editor.editable().find( '.cke_widget_mask' );

				assert.areEqual( 1, masks.count(), 'There should be still only one mask' );
			} );
		},

		'test widgets.parseElementClasses': function() {
			var editor = this.editor;
			function p( classesStr ) {
				return editor.widgets.parseElementClasses( classesStr );
			}

			assert.isNull( p( '' ), 'empty string' );
			assert.isNull( p( undefined ), 'undefined' );
			assert.isNull( p( 'cke_foo cke_bar' ), 'only cke_* classes' );

			assert.areSame( 'foo', classes2Array( p( 'foo' ) ).join( ',' ), 'foo' );
			assert.areSame( 'bar,foo', classes2Array( p( 'foo bar' ) ).join( ',' ), 'foo bar' );
			assert.areSame( 'bar,foo', classes2Array( p( ' foo   bar\t' ) ).join( ',' ), 'spacy foo bar' );
			assert.areSame( 'foo', classes2Array( p( 'cke_bar foo' ) ).join( ',' ), 'cke_* are ignored' );
		},

		'test widgets.addUpcastCallback': function() {
			bender.editorBot.create( {
				name: 'test_addupcastcallback1',
				creator: 'inline',
				config: {
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor,
					callback1 = [],
					callback2 = [];

				// Without upcasts callbacks won't be executed.
				editor.widgets.add( 'foo', {
					upcast: function() {}
				} );
				// Test whether upcast callback is not executed more than once for
				// each element if there are more than one upcast functions.
				editor.widgets.add( 'bar', {
					upcast: function() {}
				} );

				editor.widgets.addUpcastCallback( function( el ) {
					callback1.push( el.name );
				} );
				editor.widgets.addUpcastCallback( function( el ) {
					callback2.push( el.name );
				} );

				bot.setData( '<p>foo<span>x</span></p><p><b>y</b></p>', function() {
					assert.areSame( 'p,span,p,b', callback1.join( ',' ), 'First callback executed on all elements' );
					assert.areSame( 'p,span,p,b', callback2.join( ',' ), 'Second callback executed on all elements' );
				} );
			} );
		},

		'test widgets.addUpcastCallback - aborting': function() {
			bender.editorBot.create( {
				name: 'test_addupcastcallback2',
				creator: 'inline',
				config: {
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor,
					callback2 = [];

				editor.widgets.add( 'foo', {
					upcast: function( el ) {
						return el.name == 'b' || el.name == 'i';
					}
				} );

				editor.widgets.addUpcastCallback( function( el ) {
					return el.name != 'b';
				} );
				editor.widgets.addUpcastCallback( function( el ) {
					callback2.push( el.name );
				} );

				bot.setData( '<p>foo<b>x</b><i>y</i></p>', function() {
					assert.isNull( editor.widgets.getByElement( editor.editable().findOne( 'b' ) ), 'Element b was not upcasted' );
					assert.isNotNull( editor.widgets.getByElement( editor.editable().findOne( 'i' ) ), 'Element i was upcasted' );
					assert.areSame( 'p,i', callback2.join( ',' ), 'Second callback was not executed on b element' );
				} );
			} );
		},

		'test Widget.isDomNestedEditable - hello': function() {
			var node = CKEDITOR.dom.element.createFromHtml( 'hello' );
			assert.isFalse( Widget.isDomNestedEditable( node ) );
		},

		'test Widget.isDomNestedEditable - <p>hello</p>': function() {
			var node = CKEDITOR.dom.element.createFromHtml( '<p>hello</p>' );
			assert.isFalse( Widget.isDomNestedEditable( node ) );
		},

		'test Widget.isDomNestedEditable - <p data-cke-widget-editable>hello</p>': function() {
			var node = CKEDITOR.dom.element.createFromHtml( '<p data-cke-widget-editable>hello</p>' );
			assert.isTrue( Widget.isDomNestedEditable( node ) );
		},

		'test Widget.isDomNestedEditable - <em></em>': function() {
			assert.isFalse( Widget.isDomNestedEditable( domEm ) );
		},

		'test Widget.isDomNestedEditable - <em data-cke-widget-wrapper="false" ></em>': function() {
			assert.isFalse( Widget.isDomNestedEditable( domEmDataWidgetWrapperFalse ) );
		},

		'test Widget.isDomNestedEditable - <em data-cke-widget-editable ></em>': function() {
			assert.isTrue( Widget.isDomNestedEditable( domEmWidgetEditable ) );
		},

		'test Widget.getNestedEditable': function() {
			var node1 = CKEDITOR.dom.element.createFromHtml( [
					'<div data-cke-widget-editable data-id="1">',
						'<div>',
							'<div data-cke-widget-editable data-id="2">',
								'<div data-id="guard">',
									'<p data-id="3"></p>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				].join( '' ) ),
				guard = node1.findOne( '[data-id="guard"]' ),
				node2 = node1.findOne( '[data-id="2"]' ),
				node3 = node1.findOne( '[data-id="3"]' );

			assert.isNull( Widget.getNestedEditable( null, null ) );
			assert.isNull( Widget.getNestedEditable( guard, null ) );
			assert.isTrue( Widget.getNestedEditable( null, node3 ).equals( node2 ) );
			assert.isTrue( Widget.getNestedEditable( node1, node2 ).equals( node2 ) );
		},

		'test Widget.isParserWidgetElement - <em></em>': function() {
			assert.isFalse( Widget.isParserWidgetElement( parserEm ) );
		},

		'test Widget.isParserWidgetElement - <em data-widget="test"></em>': function() {
			assert.isTrue( Widget.isParserWidgetElement( parserEmDataWidgetTest ) );
		},

		'test Widget.isParserWidgetElement - <em data-widget="false"></em>': function() {
			assert.isFalse( Widget.isParserWidgetElement( parserEmDataWidgetFalse ) );
		},

		'test Widget.isDomWidgetElement - <em></em>': function() {
			assert.isFalse( Widget.isDomWidgetElement( domEm ) );
		},

		'test Widget.isDomWidgetElement - <em data-widget="test"></em>': function() {
			assert.isTrue( Widget.isDomWidgetElement( domEmDataWidgetTest ) );
		},

		'test Widget.isDomWidgetElement - <em data-widget="false"></em>': function() {
			assert.isTrue( Widget.isDomWidgetElement( domEmDataWidgetFalse ) );
		},

		'test Widget.isParserWidgetWrapper - <em></em>': function() {
			assert.isFalse( Widget.isParserWidgetWrapper( parserEm ) );
		},

		'test Widget.isParserWidgetWrapper - <em data-cke-widget-wrapper="false"></em>': function() {
			assert.isTrue( Widget.isParserWidgetWrapper( parserElDataWidgetWrapperFalse ) );
		},

		'test Widget.isParserWidgetWrapper - <em data-cke-widget-wrapper="true"></em>': function() {
			assert.isTrue( Widget.isParserWidgetWrapper( parserElDataWidgetWrapperTrue ) );
		},

		'test Widget.isDomWidgetWrapper - <em></em>': function() {
			assert.isFalse( Widget.isDomWidgetWrapper( domEm ) );
		},

		'test Widget.isDomWidgetWrapper - <em data-cke-widget-wrapper="true" ></em>': function() {
			assert.isTrue( Widget.isDomWidgetWrapper( domEmDataWidgetWrapperTrue ) );
		},

		'test Widget.isDomDragHandler - <em class="cke_widget_drag_handler_container"></em>': function() {
			assert.isFalse( Widget.isDomDragHandler( domEmWidgetDragHandlerContainer ) );
		},

		'test Widget.isDomDragHandler - <em data-cke-widget-drag-handler></em>': function() {
			assert.isTrue( Widget.isDomDragHandler( domEmWidgetDragHandler ) );
		},

		'test Widget.isDomDragHandlerContainer - <em data-cke-widget-drag-handler></em>': function() {
			assert.isFalse( Widget.isDomDragHandlerContainer( domEmWidgetDragHandler ) );
		},

		'test Widget.isDomDragHandlerContainer - <em class="cke_widget_drag_handler_container"></em>': function() {
			assert.isTrue( Widget.isDomDragHandlerContainer( domEmWidgetDragHandlerContainer ) );
		}
	} );
} )();
