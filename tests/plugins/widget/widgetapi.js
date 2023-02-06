/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget,undo */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	function st( styleDefinition ) {
		return new CKEDITOR.style( styleDefinition );
	}

	function getClasses( widget ) {
		return classes2Array( widget.data.classes || {} );
	}

	var fixHtml = widgetTestsTools.fixHtml,
		data2Attr = widgetTestsTools.data2Attribute,
		getAttrData = widgetTestsTools.getAttributeData,
		getWidgetById = widgetTestsTools.getWidgetById,
		objToArray = bender.tools.objToArray,
		classes2Array = widgetTestsTools.classes2Array,
		prefix;

	bender.test( {

		setUp: function() {
			// Class prefix for widget wrapper classes (https://dev.ckeditor.com/ticket/13828).
			prefix = CKEDITOR.plugins.widget.WRAPPER_CLASS_PREFIX;
		},

		'test initialization - init method and data event': function() {
			var editor = this.editor,
				order = [],
				widget;

			var widgetDef = {
				init: function() {
					order.push( 'init:' + this.data.foo );
					this.setData( 'foo', 2 );
					order.push( 'initEnd' ); // setData should not fire data event yet.
				},

				defaults: {
					foo: 1
				}
			};

			editor.widgets.add( 'testinit1', widgetDef );

			editor.widgets.on( 'instanceCreated', function( evt ) {
				if ( evt.data.name != 'testinit1' )
					return;

				order.push( 'instanceCreated' );

				evt.data.on( 'data', function( evt ) {
					order.push( 'data:' + evt.data.foo );
				} );

				evt.data.on( 'ready', function() {
					order.push( 'ready' );
				} );

				widget = evt.data;
			} );

			this.editorBot.setData( '<p>X<b data-widget="testinit1">bar</b>X</p>', function() {
				assert.areSame( 'instanceCreated,init:1,initEnd,data:2,ready', order.join( ',' ) );

				widget.setData( 'foo', 4 );
				assert.areSame( 'instanceCreated,init:1,initEnd,data:2,ready,data:4', order.join( ',' ) );
			} );
		},

		'test initialization - element data': function() {
			var editor = this.editor,
				order = [],
				widget;

			var widgetDef = {
				init: function() {
					order.push( 'init:' + this.data.foo );
					this.setData( 'foo', 2 );
					order.push( 'initEnd' ); // setData should not fire data event yet.
				},

				defaults: {
					foo: 1
				}
			};

			editor.widgets.add( 'testinit2', widgetDef );

			editor.widgets.on( 'instanceCreated', function( evt ) {
				if ( evt.data.name != 'testinit2' )
					return;

				order.push( 'instanceCreated' );

				evt.data.on( 'data', function( evt ) {
					order.push( 'data:' + evt.data.foo );
				} );

				widget = evt.data;
			} );

			this.editorBot.setData( '<p>X<b data-widget="testinit2" data-cke-widget-data="' + data2Attr( { foo: 3 } ) + '">bar</b>X</p>', function() {
				assert.areSame( 'instanceCreated,init:1,initEnd,data:3', order.join( ',' ) );
				// data:3 because data attribute has the highest priority.
				// data should be fired after init, but before ready.

				widget.setData( 'foo', 4 );
				assert.areSame( 'instanceCreated,init:1,initEnd,data:3,data:4', order.join( ',' ) );
			} );
		},

		'test initialization - defaults is a function': function() {
			var editor = this.editor,
				foo = 0;

			var widgetDef = {
				template: '<p id="w3">{foo},{bar}</p>',

				init: function() {
					this.setData( 'bar', 'y' );
				},

				defaults: function() {
					return {
						foo: foo++,
						bar: 'x'
					};
				}
			};

			editor.widgets.add( 'testinit3', widgetDef );

			this.editorBot.setData( '<p data-widget="testinit3" id="w1">a</p><p data-widget="testinit3" id="w2">b</p>', function() {
				var widget1 = getWidgetById( editor, 'w1' ),
					widget2 = getWidgetById( editor, 'w2' );

				assert.areSame( '0,1', [ widget1.data.foo, widget2.data.foo ].sort().join( ',' ), 'data.foo' );
				assert.areSame( 'y', widget1.data.bar, 'widget1.data.bar' );
				assert.areSame( 'y', widget2.data.bar, 'widget2.data.bar' );

				this.editorBot.setData( '<p>foo</p>', function() {
					editor.execCommand( 'testinit3' );

					var widget3 = getWidgetById( editor, 'w3' );

					assert.areSame( '2,x', widget3.element.getText(), 'created widget' );
				} );
			} );
		},

		'test initialization - startup data': function() {
			var editor = this.editor,
				order = [];

			var widgetDef = {
				init: function() {
					order.push( 'init:' + this.data.foo );
					this.setData( 'foo', 2 );
					order.push( 'initEnd' ); // setData should not fire data event yet.
				},

				defaults: {
					foo: 1
				}
			};

			editor.widgets.add( 'testinit4', widgetDef );

			editor.widgets.on( 'instanceCreated', function( evt ) {
				if ( evt.data.name != 'testinit4' )
					return;

				order.push( 'instanceCreated' );

				evt.data.on( 'data', function( evt ) {
					order.push( 'data:' + evt.data.foo );
				} );
			} );

			this.editorBot.setData( '', function() {
				var el = CKEDITOR.dom.element.createFromHtml( '<p>X<b data-widget="testinit4" data-cke-widget-data="' + data2Attr( { foo: 3 } ) + '">bar</b>X</p>', editor.document );

				editor.editable().append( el );

				var widget = editor.widgets.initOn( el.findOne( 'b' ), null, { foo: 4, bar: 5 } );

				assert.areSame( 'instanceCreated,init:1,initEnd,data:4', order.join( ',' ), 'data during initialization' );
				assert.areSame( 5, widget.data.bar, 'bar' );
			} );
		},

		'test initialization - basic properties': function() {
			var editor = this.editor,
				regWidgetDef = editor.widgets.add( 'testinit5', {} ),
				widgetRepository, widgetDefinition;

			// https://dev.ckeditor.com/ticket/10864 - at some point we were setting these properties on registered widget definition.
			assert.isUndefined( regWidgetDef.repository, 'no repository set in definition' );
			assert.isUndefined( regWidgetDef.definiotion, 'no definition set in definition' );

			// Check those values as early as possible.
			editor.widgets.on( 'instanceCreated', function( evt ) {
				widgetRepository = evt.data.repository;
				widgetDefinition = evt.data.definition;
			} );

			this.editorBot.setData( '<p>X<b data-widget="testinit5" id="w1">bar</b>X</p>', function() {
				assert.areSame( editor.widgets, widgetRepository, 'repository' );
				assert.areSame( regWidgetDef, widgetDefinition, 'definition' );
			} );
		},

		'test destroy during initialization': function() {
			var editor = this.editor;

			editor.widgets.add( 'testinitdestroy', {
				data: function() {
					editor.widgets.destroy( this );
				}
			} );

			this.editorBot.setData( '', function() {
				editor.editable().append( CKEDITOR.dom.element.createFromHtml( '<p>X<b data-widget="testinitdestroy">bar</b>X</p>', editor.document ) );

				var el = editor.editable().findOne( 'b' ),
					widget = editor.widgets.initOn( el );

				assert.isNull( widget, 'widget was not created' );
				assert.areSame( 'p', el.getParent().getName(), 'widget element is not wrapped' );
				assert.areSame( 0, objToArray( editor.widgets.instances ).length, 'no instances' );
			} );
		},

		'test set data': function() {
			var editor = this.editor,
				onDataFired = 0;

			var widgetDef = {
				defaults: {
					foo: 1,
					bar: 'a'
				},

				init: function() {
					var widget = this;
					this.on( 'data', function( evt ) {
						onDataFired++;
						assert.areSame( widget.data, evt.data, 'evt.data' );
					} );
				}
			};

			editor.widgets.add( 'testdata1', widgetDef );

			this.editorBot.setData( '<p>X<b data-widget="testdata1" id="x">bar</b>X</p>', function() {
				var widget = editor.widgets.getByElement( editor.document.getById( 'x' ) );

				var widgetData = getAttrData( widget );
				assert.areSame( 1, widgetData.foo, 'widgetData.foo' );
				assert.areSame( 'a', widgetData.bar, 'widgetData.bar' );
				assert.isTrue( CKEDITOR.tools.objectCompare( widgetData, widget.data ), 'widgetData vs widget.data 1' );
				assert.areSame( 1, onDataFired, 'onDataFired 1' );

				widget.setData( 'bom', 2 );
				widgetData = getAttrData( widget );
				assert.areSame( 2, widgetData.bom, 'widgetData.bom' );
				assert.isTrue( CKEDITOR.tools.objectCompare( widgetData, widget.data ), 'widgetData vs widget.data 2' );
				assert.areSame( 2, onDataFired, 'onDataFired 2' );

				widget.setData( 'foo', false );
				widgetData = getAttrData( widget );
				assert.isFalse( widgetData.foo, 'widgetData.foo' );
				assert.isTrue( CKEDITOR.tools.objectCompare( widgetData, widget.data ), 'widgetData vs widget.data 3' );
				assert.areSame( 3, onDataFired, 'onDataFired 3' );

				widget.setData( { bar: 'b', buu: true } );
				widgetData = widgetData = getAttrData( widget );
				assert.isFalse( widgetData.foo, 'widgetData.foo' );
				assert.areSame( 'b', widgetData.bar, 'widgetData.bar' );
				assert.isTrue( widgetData.buu, 'widgetData.buu' );
				assert.isTrue( CKEDITOR.tools.objectCompare( widgetData, widget.data ), 'widgetData vs widget.data 4' );
				assert.areSame( 4, onDataFired, 'onDataFired 4' );
			} );
		},

		'test data loading': function() {
			var editor = this.editor,
				evtDataFoo;

			var widgetDef = {
				defaults: {
					foo: 2,
					bar: 3
				},

				init: function() {
					this.on( 'data', function( evt ) {
						this.element.setAttribute( 'foo', evt.data.foo );
						evtDataFoo = evt.data.foo;
					} );
				}
			};

			editor.widgets.add( 'testdata2', widgetDef );

			this.editorBot.setData( '<p>X<b data-widget="testdata2" data-cke-widget-data="' + data2Attr( { foo: 1 } ) + '" id="x">bar</b>X</p>', function() {
				var widget = editor.widgets.getByElement( editor.document.getById( 'x' ) );

				assert.areSame( 1, widget.data.foo, 'widget.data.foo' );
				assert.areSame( 3, widget.data.bar, 'widget.data.bar' );
				assert.areSame( 1, evtDataFoo, 'evt.data.foo' );

				assert.isMatching( /^<b class="cke_widget_element" data-cke-widget-data="[^"]+" data-cke-widget-keep-attr="1" data-widget="testdata2" foo="1" id="x">bar<\/b>$/,
					fixHtml( widget.element.getOuterHtml() ), 'widget.getOutput()' );

				var widgetData = getAttrData( widget );
				assert.areSame( 1, widgetData.foo, 'widgetData.foo' );
				assert.areSame( 3, widgetData.bar, 'widgetData.bar' );

				widget.setData( { foo: 4, bom: 'y' } );

				var widgetData2 = getAttrData( widget );
				assert.areSame( 4, widgetData2.foo, 'widgetData2.foo' );
				assert.areSame( 'y', widgetData2.bom, 'widgetData2.bom' );
			} );
		},

		'test classes loading': function() {
			var editor = this.editor,
				onDataFired = 0;

			editor.widgets.add( 'testclassesloading1', {
				data: function() {
					onDataFired += 1;
				}
			} );

			this.editorBot.setData( '<p data-widget="testclassesloading1" id="w1" class="foo bar">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					wrapper = widget.wrapper;

				assert.areSame( 1, onDataFired, 'data event fired once' );
				assert.areSame( 'bar,foo', getClasses( widget ).join( ',' ), 'widget.data.classes is loaded' );
				assert.isTrue( widget.hasClass( 'foo' ) );
				assert.isTrue( widget.hasClass( 'bar' ) );
				assert.isTrue( wrapper.hasClass( prefix + 'foo' ), 'Prefixed class should be applied on wrapper.' );
				assert.isTrue( wrapper.hasClass( prefix + 'bar' ), 'Prefixed class should be applied on wrapper.' );
			} );
		},

		'test classes loading - existing data.classes is chosen': function() {
			var editor = this.editor,
				onDataFired = 0,
				addClassCalled = 0;

			editor.widgets.add( 'testclassesloading2', {
				data: function() {
					onDataFired += 1;
				},

				addClass: function( className ) {
					addClassCalled += 1;
					CKEDITOR.plugins.widget.prototype.addClass.call( this, className );
				}
			} );

			this.editorBot.setData( '<p data-widget="testclassesloading2" data-cke-widget-data="' + data2Attr( { classes: { foo: 1, bar: 1 } } ) + '" id="w1">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					wrapper = widget.wrapper;

				assert.areSame( 1, onDataFired, 'data event fired once' );
				assert.areSame( 2, addClassCalled, 'addClass was used to add classes' );
				assert.areSame( 'bar,foo', getClasses( widget ).join( ',' ), 'widget.data.classes is loaded' );
				assert.isTrue( widget.hasClass( 'foo' ) );
				assert.isTrue( widget.hasClass( 'bar' ) );
				assert.isTrue( wrapper.hasClass( prefix + 'foo' ), 'Prefixed class should be applied on wrapper.' );
				assert.isTrue( wrapper.hasClass( prefix + 'bar' ), 'Prefixed class should be applied on wrapper.' );
			} );
		},

		'test addClass, removeClass': function() {
			var editor = this.editor;

			editor.widgets.add( 'testaddremoveclass1', {} );

			this.editorBot.setData( '<p data-widget="testaddremoveclass1" id="w1">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					element = widget.element,
					wrapper = widget.wrapper;

				widget.addClass( 'foo' );
				assert.isTrue( element.hasClass( 'foo' ), 'element has class foo' );
				assert.isTrue( wrapper.hasClass( prefix + 'foo' ), 'wrapper has class ' + prefix + 'foo' );

				widget.addClass( 'bar' );
				assert.isTrue( element.hasClass( 'bar' ), 'element has class bar' );
				assert.isTrue( wrapper.hasClass( prefix + 'bar' ), 'wrapper has class ' + prefix + 'bar' );
				assert.isTrue( element.hasClass( 'foo' ), 'element still has class foo' );
				assert.isTrue( wrapper.hasClass( prefix + 'foo' ), 'wrapper has class ' + prefix + 'foo' );

				widget.removeClass( 'foo' );
				assert.isFalse( element.hasClass( 'foo' ), 'element does not have class foo' );
				assert.isFalse( wrapper.hasClass( prefix + 'foo' ), 'wrapper does not have class ' + prefix + 'foo' );
				assert.isTrue( element.hasClass( 'bar' ), 'element still has class bar' );
				assert.isTrue( wrapper.hasClass( prefix + 'bar' ), 'wrapper does not have class ' + prefix + 'bar' );
			} );
		},

		'test hasClass': function() {
			var editor = this.editor;

			editor.widgets.add( 'testhasclass1', {} );

			this.editorBot.setData( '<p data-widget="testhasclass1" id="w1" class="foo bar">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				assert.isTrue( widget.hasClass( 'foo' ), 'widget has class foo' );
				assert.isFalse( widget.hasClass( 'bom' ), 'widget does not have class bom' );
			} );
		},

		'test getClasses': function() {
			var editor = this.editor;

			editor.widgets.add( 'testgetclasses1', {} );

			this.editorBot.setData( '<p data-widget="testgetclasses1" id="w1">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				widget.element.addClass( 'foo' );
				assert.areSame( 'foo', classes2Array( widget.getClasses() ).join( ',' ) );

				widget.element.addClass( 'bar' );
				assert.areSame( 'bar,foo', classes2Array( widget.getClasses() ).join( ',' ) );

				widget.element.addClass( 'cke_foofoo' );
				assert.areSame( 'bar,foo', classes2Array( widget.getClasses() ).join( ',' ), 'cke_* classes are skipped' );

				widget.element.removeClass( 'foo' );
				widget.element.removeClass( 'bar' );
				assert.isNull( widget.getClasses() );
			} );
		},

		'test applyStyle, removeStyle - integration test': function() {
			var editor = this.editor,
				widgetName = 'testapplyremovestyle1';

			editor.widgets.add( widgetName, {} );

			this.editorBot.setData( '<p data-widget="testapplyremovestyle1" id="w1">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					wrapper = widget.wrapper,
					style1 = st( { type: 'widget', widget: widgetName, attributes: { 'class': 'foo' } } ),
					style2 = st( { type: 'widget', widget: widgetName, attributes: { 'class': 'bar' } } );

				widget.applyStyle( style1 );
				assert.isTrue( widget.hasClass( 'foo' ), 'style 1 has been applied' );
				assert.isTrue( wrapper.hasClass( prefix + 'foo' ), 'style 1 has been applied to the wrapper too' );

				widget.applyStyle( style2 );
				assert.isTrue( widget.hasClass( 'foo' ), 'style 1 is still applied' );
				assert.isTrue( wrapper.hasClass( prefix + 'foo' ), 'style 1 is still applied to the wrapper' );
				assert.isTrue( widget.hasClass( 'bar' ), 'style 2 has been applied' );
				assert.isTrue( wrapper.hasClass( prefix + 'bar' ), 'style 2 has been applied to the wrapper too' );

				widget.removeStyle( style1 );
				assert.isFalse( widget.hasClass( 'foo' ), 'style 1 has been removed' );
				assert.isFalse( wrapper.hasClass( prefix + 'foo' ), 'style 1 has been removed from the wrapper' );
				assert.isTrue( widget.hasClass( 'bar' ), 'style 2 is sitll applied' );
				assert.isTrue( wrapper.hasClass( prefix + 'bar' ), 'style 2 is still applied to the wrapper' );

				widget.removeStyle( style2 );
				assert.isFalse( widget.hasClass( 'bar' ), 'style 2 has been removed' );
				assert.isFalse( wrapper.hasClass( prefix + 'bar' ), 'style 2 has been removed from the wrapper' );
			} );
		},

		'test applyStyle, removeStyle - multiple classes - integration test': function() {
			var editor = this.editor,
				widgetName = 'testapplyremovestyle2';

			editor.widgets.add( widgetName, {} );

			this.editorBot.setData( '<p data-widget="testapplyremovestyle2" id="w1">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					wrapper = widget.wrapper;

				var style = st( { type: 'widget', widget: widgetName, attributes: { 'class': 'foo bar' } } );

				widget.applyStyle( style );
				assert.isTrue( widget.hasClass( 'foo' ), '1st class has been applied' );
				assert.isTrue( wrapper.hasClass( prefix + 'foo' ), '1st class has been applied to the wrapper' );
				assert.isTrue( widget.hasClass( 'bar' ), '2nd class has been applied' );
				assert.isTrue( wrapper.hasClass( prefix + 'bar' ), '2nd class has been applied to the wrapper' );

				widget.addClass( 'bom' );
				widget.removeStyle( style );

				assert.isFalse( widget.hasClass( 'foo' ), '1st class has been removed' );
				assert.isFalse( wrapper.hasClass( prefix + 'foo' ), '1st class has been removed from the wrapper' );
				assert.isFalse( widget.hasClass( 'bar' ), '2nd class has been removed' );
				assert.isFalse( wrapper.hasClass( prefix + 'bar' ), '2nd class has been removed from the wrapper' );

				assert.isTrue( widget.hasClass( 'bom' ), 'unrelated class remains untouched' );
				assert.isTrue( wrapper.hasClass( prefix + 'bom' ), 'unrelated class remains untouched on the wrapper' );
			} );
		},

		'test applyStyle - data.classes': function() {
			var editor = this.editor,
				widgetName = 'testapplystyledata1';

			editor.widgets.add( widgetName, {} );

			this.editorBot.setData( '<p data-widget="testapplystyledata1" id="w1">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					dataFired = 0;

				var styleFoo = st( { type: 'widget', widget: widgetName, attributes: { 'class': 'foo' } } ),
					styleFooBar = st( { type: 'widget', widget: widgetName, attributes: { 'class': 'foo bar' } } ),
					styleBom = st( { type: 'widget', widget: widgetName, attributes: { 'class': 'bom' } } );

				widget.on( 'data', function() {
					dataFired += 1;
				} );

				var oldClasses = widget.data.classes;

				widget.applyStyle( styleFoo );
				assert.areNotSame( oldClasses, widget.data.classes, 'reference was broken - foo' );
				assert.areSame( 1, dataFired, '1st applyStyle fired data event' );
				assert.areSame( 'foo', getClasses( widget ).join( ',' ), '1st applyStyle added foo class' );

				oldClasses = widget.data.classes;

				widget.applyStyle( styleFooBar );
				assert.areNotSame( oldClasses, widget.data.classes, 'reference was broken - foo bar' );
				assert.areSame( 2, dataFired, '2nd applyStyle fired data event' );
				assert.areSame( 'bar,foo', getClasses( widget ).join( ',' ), '2nd applyStyle added bar class' );

				oldClasses = widget.data.classes;

				widget.applyStyle( styleBom );
				assert.areNotSame( oldClasses, widget.data.classes, 'reference was broken - bom' );
				assert.areSame( 3, dataFired, '3rd applyStyle fired data event' );
				assert.areSame( 'bar,bom,foo', getClasses( widget ).join( ',' ), '3rd applyStyle added bom class' );

				widget.applyStyle( styleFoo );
				widget.applyStyle( styleFooBar );
				assert.areSame( 3, dataFired, 'applying already applied styles does not fire data event' );
			} );
		},

		'test removeStyle - data.classes': function() {
			var editor = this.editor,
				widgetName = 'testremovestyledata1';

			editor.widgets.add( widgetName, {} );

			this.editorBot.setData( '<p data-widget="testremovestyledata1" id="w1">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					dataFired = 0;

				var styleFoo = st( { type: 'widget', widget: widgetName, attributes: { 'class': 'foo' } } ),
					styleFooBar = st( { type: 'widget', widget: widgetName, attributes: { 'class': 'foo bar' } } ),
					styleBom = st( { type: 'widget', widget: widgetName, attributes: { 'class': 'bom' } } );

				widget.applyStyle( styleFoo );
				widget.applyStyle( styleFooBar );
				widget.applyStyle( styleBom );

				widget.on( 'data', function() {
					dataFired += 1;
				} );

				var oldClasses = widget.data.classes;

				widget.removeStyle( styleFoo );
				assert.areNotSame( oldClasses, widget.data.classes, 'reference was broken - foo' );
				assert.areSame( 1, dataFired, '1st removeStyle fired data event' );
				assert.areSame( 'bar,bom', getClasses( widget ).join( ',' ), '1st removeStyle added foo class' );

				oldClasses = widget.data.classes;

				widget.removeStyle( styleFooBar );
				assert.areNotSame( oldClasses, widget.data.classes, 'reference was broken - foo bar' );
				assert.areSame( 2, dataFired, '2nd removeStyle fired data event' );
				assert.areSame( 'bom', getClasses( widget ).join( ',' ), '2nd removeStyle added bar class' );

				oldClasses = widget.data.classes;

				widget.removeStyle( styleBom );
				assert.areNotSame( oldClasses, widget.data.classes, 'reference was broken - bom' );
				assert.areSame( 3, dataFired, '3rd removeStyle fired data event' );
				assert.areSame( '', getClasses( widget ).join( ',' ), '3rd removeStyle added bom class' );

				widget.removeStyle( styleFoo );
				widget.removeStyle( styleFooBar );
				assert.areSame( 3, dataFired, 'removing already removed styles does not fire data event' );
			} );
		},

		'test classes updated on setData': function() {
			var editor = this.editor,
				widgetName = 'testsetdataclasses1';

			editor.widgets.add( widgetName, {} );

			this.editorBot.setData( '<p data-widget="testsetdataclasses1" id="w1">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					wrapper = widget.wrapper;

				widget.setData( 'classes', { foo: 1, bar: 1 } );

				assert.isTrue( widget.hasClass( 'foo' ), '1 - foo' );
				assert.isTrue( wrapper.hasClass( prefix + 'foo' ), 'wrapper: 1 - ' + prefix + 'foo' );
				assert.isTrue( widget.hasClass( 'bar' ), '1 - bar' );
				assert.isTrue( wrapper.hasClass( prefix + 'bar' ), 'wrapper: 1 - ' + prefix + 'foo' );

				widget.setData( 'classes', { foo: 1, bom: 1 } );

				assert.isTrue( widget.hasClass( 'foo' ), '2 - foo' );
				assert.isTrue( wrapper.hasClass( prefix + 'foo' ), 'wrapper: 2 - ' + prefix + 'foo' );
				assert.isTrue( widget.hasClass( 'bom' ), '2 - bom' );
				assert.isTrue( wrapper.hasClass( prefix + 'bom' ), 'wrapper: 2 - ' + prefix + 'bom' );
				assert.isFalse( widget.hasClass( 'bar' ), '2 - bar' );
				assert.isFalse( wrapper.hasClass( prefix + 'bar' ), 'wrapper: 2 - ' + prefix + 'bar' );

				widget.setData( 'classes', {} );

				assert.isFalse( widget.hasClass( 'foo' ), '3 - foo' );
				assert.isFalse( wrapper.hasClass( prefix + 'foo' ), 'wrapper: 3 - ' + prefix + 'foo' );
				assert.isFalse( widget.hasClass( 'bom' ), '3 - bom' );
				assert.isFalse( wrapper.hasClass( prefix + 'bom' ), 'wrapper: 3 - ' + prefix + 'bom' );

				widget.setData( 'classes', { foo: 1 } );
				widget.setData( 'classes', null );

				assert.isFalse( widget.hasClass( 'foo' ), '4 - foo' );
				assert.isFalse( wrapper.hasClass( prefix + 'foo' ), 'wrapper: 4 - ' + prefix + 'foo' );
			} );
		},

		'test checkStyleActive': function() {
			var editor = this.editor,
				widgetName = 'testcheckstyleactive1';

			editor.widgets.add( widgetName, {} );

			this.editorBot.setData( '<p data-widget="testcheckstyleactive1" id="w1" class="foo bar">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				var style1 = st( { type: 'widget', widget: widgetName, attributes: { 'class': 'foo' } } ),
					style2 = st( { type: 'widget', widget: widgetName, attributes: { 'class': 'foo bar' } } ),
					style3 = st( { type: 'widget', widget: widgetName, attributes: { 'class': 'foo bom' } } ),
					style4 = st( { type: 'widget', widget: widgetName, attributes: { 'class': 'bom' } } );

				assert.isTrue( widget.checkStyleActive( style1 ), 'style 1 is active' );
				assert.isTrue( widget.checkStyleActive( style2 ), 'style 2 is active' );
				assert.isFalse( widget.checkStyleActive( style3 ), 'style 3 is not active' );
				assert.isFalse( widget.checkStyleActive( style4 ), 'style 4 is not active' );

				widget.removeStyle( style1 );
				assert.isFalse( widget.checkStyleActive( style1 ), 'style 1 is not active' );
				assert.isFalse( widget.checkStyleActive( style2 ), 'style 2 is not active' );
			} );
		},

		'test checkStyleActive, applyStyle and removeStyle do not fail on style not defining any classes': function() {
			var editor = this.editor,
				widgetName = 'teststylenoclasses1';

			editor.widgets.add( widgetName, {} );

			this.editorBot.setData( '<p data-widget="teststylenoclasses1" id="w1">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				var style = st( { type: 'widget', widget: widgetName, attributes: { foo: 'bar' } } );

				// By having only one assertion we verify that previous calls do not throw.
				widget.applyStyle( style );
				widget.removeStyle( style );
				assert.isFalse( widget.checkStyleActive( style ) );
			} );
		},

		'test checkStyleActive, applyStyle and removeStyle use widget methods': function() {
			var editor = this.editor,
				widgetName = 'teststylemethodsused1';

			editor.widgets.add( widgetName, {} );

			this.editorBot.setData( '<p data-widget="teststylemethodsused1" id="w1">foo</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					called = [];

				var style = st( { type: 'widget', widget: widgetName, attributes: { 'class': 'foo' } } );

				widget.addClass = function() {
					called.push( 'add' );
				};
				widget.removeClass = function() {
					called.push( 'remove' );
				};
				widget.hasClass = function() {
					called.push( 'has' );
				};

				widget.applyStyle( style );
				assert.areSame( 'add', called.join( ',' ), 'addClass called' );

				widget.removeStyle( style );
				assert.areSame( 'add,remove', called.join( ',' ), 'removeClass called' );

				widget.checkStyleActive( style );
				assert.areSame( 'add,remove,has', called.join( ',' ), 'hasClass called' );
			} );
		},

		// https://dev.ckeditor.com/ticket/11811
		'test paste widget with special characters in data': function() {
			var editor = this.editor;

			editor.widgets.add( 'pastingencoding', {
				upcast: function( el ) {
					return el.name == 'b' && el.hasClass( 'pastingencoding' );
				}
			} );

			this.editorBot.setData( '<p><b class="pastingencoding" id="w">Foo</b></p>', function() {
				var widget = getWidgetById( editor, 'w' );

				widget.setData( 'amp', '&' );
				widget.setData( 'ampamp', '&amp;' );
				widget.setData( 'comment', '<!--Foo-->' );
				widget.setData( 'nbsp', '&nbsp;' );
				widget.setData( 'nbspu', '\u00a0' );

				var html = editor.editable().getHtml();

				editor.once( 'afterPaste', function() {
					resume( function() {
						widget = getWidgetById( editor, 'w' );

						assert.areSame( '&', widget.data.amp );
						assert.areSame( '&amp;', widget.data.ampamp );
						assert.areSame( '<!--Foo-->', widget.data.comment );
						assert.areSame( '&nbsp;', widget.data.nbsp );
						assert.areSame( '\u00a0', widget.data.nbspu );
					} );
				} );

				editor.setData( '', function() {
					editor.execCommand( 'paste', html );
				} );

				wait();
			} );
		},

		// https://dev.ckeditor.com/ticket/11811
		'test special characters set in data during upcast': function() {
			var editor = this.editor;

			editor.widgets.add( 'upcastingencoding', {
				upcast: function( el, data ) {
					data.amp = '&';
					data.ampamp = '&amp;';
					data.comment = '<!--Foo-->';
					data.nbsp = '&nbsp;';
					data.nbspu = '\u00a0';
					return el.name == 'b' && el.hasClass( 'upcastingencoding' );
				}
			} );

			this.editorBot.setData( '<p><b class="upcastingencoding" id="w">Foo</b></p>', function() {
				var widget = getWidgetById( editor, 'w' );

				assert.areSame( '&', widget.data.amp );
				assert.areSame( '&amp;', widget.data.ampamp );
				assert.areSame( '<!--Foo-->', widget.data.comment );
				assert.areSame( '&nbsp;', widget.data.nbsp );
				assert.areSame( '\u00a0', widget.data.nbspu );
			} );
		},

		// #1094
		'test upcasts methods are invoked only for specified elements': function() {
			var editor = this.editor,
				spy = sinon.spy();

			editor.widgets.add( 'upcastelement', {
				upcasts: {
					del: spy
				},
				upcast: 'del'
			} );

			this.editorBot.setData( '<p><b>Foo</b><del>Bar</del></p>', function() {
				assert.areSame( 1, spy.callCount, 'Upcast was called only once' );
				assert.areSame( 'del', spy.getCall( 0 ).args[ 0 ].name, 'Upcast was called on del element' );
			} );
		},

		// #1097
		'test scope of upcast': function() {
			var editor = this.editor,
				widget,
				scope;

			editor.widgets.add( 'upcastscope', {
				upcast: function( element ) {
					if ( element.name === 'b' && element.hasClass( 'upcastscope' ) ) {
						scope = this;

						return true;
					}

					return false;
				}
			} );
			widget = editor.widgets.registered.upcastscope;

			this.editorBot.setData( '<p><b class="upcastscope">Foo</b></p>', function() {
				assert.areSame( widget, scope, 'Upcast is called in the context of widget' );
			} );
		},

		// #1097
		'test scope of upcasts': function() {
			var editor = this.editor,
				widget,
				scope;

			editor.widgets.add( 'upcastscope2', {
				upcasts:  {
					b: function( element ) {
						if ( element.name === 'b' && element.hasClass( 'upcastscope2' ) ) {
							scope = this;

							return true;
						}

						return false;
					}
				},
				upcast: 'b'
			} );
			widget = editor.widgets.registered.upcastscope2;

			this.editorBot.setData( '<p><b class="upcastscope2">Foo</b></p>', function() {
				assert.areSame( widget, scope, 'Upcasts are called in the context of widget' );
			} );
		},

		// (#3540)
		'test initialization - startup data is used to populate the widget template': function() {
			bender.editorBot.create( {
				name: 'test_editor_startupdata',
				config: {
					allowedContent: 'div(test)'
				}
			}, function( bot ) {
				var editor = bot.editor,
					widgetDef = {
						requiredContent: 'div(test)',
						template: '<div class="test">{content}</div>',

						upcast: function( element ) {
							return element.name == 'div' && element.hasClass( 'test' );
						},

						defaults: {
							content: 'default content'
						}
					},
					expectedContent = 'hublabubla';

				editor.widgets.add( 'teststartupdata', widgetDef );

				editor.once( 'afterCommandExec', function() {
					resume( function() {
						var widget = editor.widgets.instances[ 0 ],
							widgetContent = widget.element.getHtml();

						assert.areSame( expectedContent, widgetContent );
					} );
				} );

				editor.focus();
				editor.execCommand( 'teststartupdata', {
					startupData: {
						content: expectedContent
					}
				} );

				wait();
			} );
		}
	} );
} )();
