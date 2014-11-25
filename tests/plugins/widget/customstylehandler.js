/* bender-tags: editor,unit,widgetcore */
/* bender-ckeditor-plugins: widget */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	function st( styleDefinition ) {
		return new CKEDITOR.style( styleDefinition );
	}

	// Returns dom.elementPath starting from widget wrapper.
	function widgetPath( startId, editor ) {
		return new CKEDITOR.dom.elementPath( getWidgetById( editor, startId ).wrapper, editor.editable() );
	}

	var getWidgetById = widgetTestsTools.getWidgetById;

	bender.test( {
		'async:init': function() {
			var that = this;

			CKEDITOR.plugins.add( 'testWidget', {
				init: function( editor ) {
					editor.widgets.add( 'testWidget', {
						editables: {
							foo: '.editable'
						}
					} );
				}
			} );

			bender.tools.setUpEditors( {
				editor: {
					name: 'editor1',
					creator: 'inline', // For faster setData.
					config: {
						extraPlugins: 'testWidget',
						allowedContent: true
					}
				}
			}, function( editors, bots ) {
				that.editorBots = bots;
				that.editors = editors;
				that.callback();
			} );
		},

		// Make sure that custom widget styles will gracefully work with pre-4.4 way of
		// calling style's methods.
		'test custom style methods return false when editor not specified': function() {
			var editor = this.editors.editor,
				style = st( { type: 'widget', widget: 'someOtherWidget' } );

			this.editorBots.editor.setData( '<p data-widget="testWidget" id="w1">x</p>', function() {
				var wrapper = getWidgetById( editor, 'w1' ).wrapper;

				assert.isFalse( style.checkApplicable( style.checkApplicable( widgetPath( 'w1', editor ) ) ), 'checkApplicable' );
				assert.isFalse( style.checkApplicable( style.checkApplicable( widgetPath( 'w1', editor ), editor.filter ) ),
					'checkApplicable with filter as 2nd argument' );
				assert.isFalse( style.checkActive( widgetPath( 'w1', editor ) ), 'checkActive' );
				assert.isFalse( style.checkElementMatch( wrapper ), 'checkElementMatch' );
				assert.isFalse( style.checkElementRemovable( wrapper ), 'checkElementRemovable' );

				// Following should not throw exceptions.
				getWidgetById( editor, 'w1' ).focus();
				style.apply( editor.document );
				style.remove( editor.document );
			} );
		},

		'test checkApplicable on matching widget': function() {
			var editor = this.editors.editor,
				style = st( { type: 'widget', widget: 'testWidget' } );

			this.editorBots.editor.setData( '<p data-widget="testWidget" id="w1">x</p><p>foo<b data-widget="testWidget" id="w2">x</b></p>', function() {
				assert.isTrue( style.checkApplicable( widgetPath( 'w1', editor ), editor ), 'block widget' );
				assert.isTrue( style.checkApplicable( widgetPath( 'w2', editor ), editor ), 'inline widget' );
			} );
		},

		'test checkApplicable on not matching widget': function() {
			var editor = this.editors.editor,
				style = st( { type: 'widget', widget: 'someOtherWidget' } );

			this.editorBots.editor.setData( '<p data-widget="testWidget" id="w1">x</p>', function() {
				assert.isFalse( style.checkApplicable( widgetPath( 'w1', editor ), editor ) );
			} );
		},

		'test checkApplicable on non-widget elements': function() {
			var editor = this.editors.editor,
				style = st( { type: 'widget', widget: 'testWidget' } ),
				path;

			this.editorBots.editor.setData( '<p id="p1">x</p><div data-widget="testWidget" id="w1"><p class="editable"><b>x</b></p></div>', function() {
				var widget = getWidgetById( editor, 'w1' );
				path = new CKEDITOR.dom.elementPath( editor.document.getById( 'p1' ), editor.editable() );
				assert.isFalse( style.checkApplicable( path, editor ), 'some other element' );

				path = new CKEDITOR.dom.elementPath( widget.element, editor.editable() );
				assert.isFalse( style.checkApplicable( path, editor ), 'widget element' );

				path = new CKEDITOR.dom.elementPath( widget.editables.foo, editor.editable() );
				assert.isFalse( style.checkApplicable( path, editor ), 'nested editable' );

				path = new CKEDITOR.dom.elementPath( widget.editables.foo.findOne( 'b' ), editor.editable() );
				assert.isFalse( style.checkApplicable( path, editor ), 'element inside nested editable' );
			} );
		},

		'test checkElementMatch equals checkElementRemovable': function() {
			var style = st( { type: 'widget', widget: 'someOtherWidget' } );

			assert.areSame( style.checkElementRemovable, style.checkElementMatch );
		},

		'test checkElementMatch returns result of widget.checkStyleActive': function() {
			var editor = this.editors.editor,
				style = st( { type: 'widget', widget: 'testWidget' } );

			this.editorBots.editor.setData( '<p data-widget="testWidget" id="w1">x</p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				widget.checkStyleActive = function() {
					return true;
				};
				assert.isTrue( style.checkElementMatch( widget.wrapper, 0, editor ) );

				widget.checkStyleActive = function() {
					return false;
				};
				assert.isFalse( style.checkElementMatch( widget.wrapper, 0, editor ) );
			} );
		},

		'test checkElementMatch and checkActive pass style instance to widget.checkStyleActive': function() {
			var editor = this.editors.editor,
				style = st( { type: 'widget', widget: 'testWidget' } );

			this.editorBots.editor.setData( '<p data-widget="testWidget" id="w1">x</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					passedArgument;

				widget.checkStyleActive = function( arg ) {
					passedArgument = arg;
				};

				style.checkElementMatch( widget.wrapper, 0, editor );
				assert.areSame( style, passedArgument, 'checkElementMatch' );

				passedArgument = null;
				style.checkActive( widgetPath( 'w1', editor ), editor );
				assert.areSame( style, passedArgument, 'checkActive' );
			} );
		},

		'test checkElementMatch returns false on non-widget element': function() {
			var editor = this.editors.editor,
				style = st( { type: 'widget', widget: 'testWidget' } );

			this.editorBots.editor.setData( '<p id="p1">x</p>', function() {
				assert.isFalse( style.checkElementMatch( editor.document.getById( 'p1' ), 0, editor ) );
				// No need to test more because internally we use the same verification
				// as in checkApplicable.
			} );
		},

		'test apply/remove calls applyStyle/removeStyle on focused widget': function() {
			var editor = this.editors.editor,
				style = st( { type: 'widget', widget: 'testWidget' } );

			this.editorBots.editor.setData( '<p data-widget="testWidget" id="w1">x</p><p data-widget="testWidget" id="w2">x</p>', function() {
				var widget1 = getWidgetById( editor, 'w1' ),
					widget2 = getWidgetById( editor, 'w2' ),
					applied1 = 0,
					applied2 = 0,
					removed1 = 0,
					removed2 = 0;

				widget1.applyStyle = function() {
					applied1 += 1;
				};
				widget2.applyStyle = function() {
					applied2 += 1;
				};
				widget1.removeStyle = function() {
					removed1 += 1;
				};
				widget2.removeStyle = function() {
					removed2 += 1;
				};

				widget1.focus();
				style.apply( editor );
				assert.areSame( 1, applied1, 'applied to the first widget' );
				assert.areSame( 0, applied2, 'not applied to the second widget' );

				style.remove( editor );
				assert.areSame( 1, removed1, 'removed from the first widget' );
				assert.areSame( 0, applied2, 'not removed from the second widget' );

				widget2.focus();
				style.apply( editor );
				assert.areSame( 1, applied1, 'not applied to the first widget' );
				assert.areSame( 1, applied2, 'applied to the second widget' );

				style.remove( editor );
				assert.areSame( 1, removed1, 'not removed from the first widget' );
				assert.areSame( 1, removed2, 'removed from the second widget' );
			} );
		},

		'test apply/remove passes style instance to the applyStyle/removeStyle method': function() {
			var editor = this.editors.editor,
				style = st( { type: 'widget', widget: 'testWidget' } );

			this.editorBots.editor.setData( '<p data-widget="testWidget" id="w1">x</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					passedArgument;

				widget.focus();

				widget.applyStyle = function( arg ) {
					passedArgument = arg;
				};
				widget.removeStyle = function( arg ) {
					passedArgument = arg;
				};

				style.apply( editor );
				assert.areSame( style, passedArgument, 'apply passes style' );

				passedArgument = null;

				style.remove( editor );
				assert.areSame( style, passedArgument, 'remove passes style' );
			} );
		},

		'test apply/remove does not proceed if checkApplicable returns false': function() {
			var editor = this.editors.editor,
				style = st( { type: 'widget', widget: 'testWidget' } );

			this.editorBots.editor.setData( '<p data-widget="testWidget" id="w1">x</p>', function() {
				var widget = getWidgetById( editor, 'w1' ),
					executed = false;

				// Focus so in normal conditions applyStyle/removeStyle would be exececuted.
				widget.focus();

				style.checkApplicable = function() {
					return false;
				};
				widget.applyStyle = function() {
					executed = true;
				};
				widget.removeStyle = function() {
					executed = true;
				};

				style.apply( editor );
				assert.isFalse( executed, 'applyStyle was not executed' );

				style.remove( editor );
				assert.isFalse( executed, 'removeStyle was not executed' );
			} );
		},

		'test buildPreview': function() {
			var style = st( { name: 'Foo', type: 'widget', widget: 'testWidget' } );

			assert.areSame( 'Foo', style.buildPreview(), 'buildPreview returns style\'s name' );
			assert.areSame( 'Bar', style.buildPreview( 'Bar' ), 'buildPreview returns provided label if defined' );
		},

		'test toAllowedContentRules - no styleableElements, no styleToAllowedContentRules': function() {
			var editor = this.editors.editor,
				style = st( { name: 'Foo', type: 'widget', widget: 'test2ACRs1a', attributes: { 'class': 'foo bar' } } );

			editor.widgets.add( 'test2ACRs1a', {} );
			assert.isNull( style.toAllowedContentRules( editor ) );
		},

		'test toAllowedContentRules - no editor': function() {
			var style = st( { name: 'Foo', type: 'widget', widget: 'foo', attributes: { 'class': 'foo bar' } } );

			assert.isNull( style.toAllowedContentRules() );
		},

		'test toAllowedContentRules - no widget definition': function() {
			var editor = this.editors.editor,
				style = st( { name: 'Foo', type: 'widget', widget: 'notExistingWidget', attributes: { 'class': 'foo bar' } } );

			assert.isNull( style.toAllowedContentRules( editor ) );
		},

		'test toAllowedContentRules - styleableElements': function() {
			var editor = this.editors.editor,
				style = st( { name: 'Foo', type: 'widget', widget: 'test2ACRs2', attributes: { 'class': 'foo bar' } } );

			editor.widgets.add( 'test2ACRs2', {
				styleableElements: 'p div'
			} );
			var rules = style.toAllowedContentRules( editor ),
				rule = rules[ 'p div' ];

			assert.isTrue( 'p div' in rules );
			assert.areSame( 'foo,bar', rule.classes.join( ',' ) );
			assert.isTrue( rule.propertiesOnly );
		},

		'test toAllowedContentRules - styleToAllowedContentRules': function() {
			var editor = this.editors.editor,
				style = st( { name: 'Foo', type: 'widget', widget: 'test2ACRs3', attributes: { 'class': 'foo bar' } } );

			editor.widgets.add( 'test2ACRs3', {
				styleToAllowedContentRules: function( arg ) {
					assert.areSame( style, arg, 'style instance was passed to the method' );
					return 'foo';
				}
			} );
			assert.areSame( 'foo', style.toAllowedContentRules( editor ) );
		},

		'test getClassesArray': function() {
			var style1 = st( { name: 'Foo', type: 'widget', widget: 'foo', attributes: { 'class': 'foo' } } ),
				style2 = st( { name: 'Foo', type: 'widget', widget: 'foo', attributes: { 'class': 'foo bar ' } } ),
				style3 = st( { name: 'Foo', type: 'widget', widget: 'foo', attributes: {} } ),
				style4 = st( { name: 'Foo', type: 'widget', widget: 'foo' } );

			assert.areSame( 'foo', style1.getClassesArray().join( ',' ) );
			assert.areSame( 'foo,bar', style2.getClassesArray().join( ',' ) );
			assert.isNull( style3.getClassesArray() );
			assert.isNull( style4.getClassesArray() );
		}
	} );
} )();