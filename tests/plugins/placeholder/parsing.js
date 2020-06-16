/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: placeholder */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			autoParagraph: false
		}
	};

	var assertWidget = widgetTestsTools.assertWidget;


	function assertWidgetDataName( expectedName, widget, failMessage ) {
		assert.areSame( expectedName, widget.data.name, failMessage || 'Invalid value assigned to widgets data.name.' );
	}

	bender.test( {
		'test from html': function() {
			assertWidget( {
				html: '<p>This is <u>Random [[test-placeholder]]</u> in some text.</p>',
				bot: this.editorBot,
				assertCreated: function( widget ) {
					assertWidgetDataName( 'test-placeholder', widget );
				},
				widgetOffset: 0,
				count: 1,
				nameCreated: 'placeholder'
			} );
		},

		'test from exact placeholder': function() {
			assertWidget( {
				html: '[[myPlaceholder]]',
				bot: this.editorBot,
				assertCreated: function( widget ) {
					assertWidgetDataName( 'myPlaceholder', widget );
				},
				widgetOffset: 0,
				count: 1,
				nameCreated: 'placeholder'
			} );
		},

		'test short name': function() {
			assertWidget( {
				html: '[[y]]',
				bot: this.editorBot,
				assertCreated: function( widget ) {
					assertWidgetDataName( 'y', widget );
				},
				widgetOffset: 0,
				count: 1,
				nameCreated: 'placeholder'
			} );
		},

		'test empty name': function() {
			// Widget without name should not be transformed.
			assertWidget( {
				html: '<div> test [[]] string</div>',
				bot: this.editorBot,
				count: 0
			} );
		},

		'test attempt to use closing token as name': function() {
			assertWidget( {
				html: '<div> test [[]]] string</div>',
				bot: this.editorBot,
				count: 0
			} );
		},

		'test delimiters in diffrent paragraphs': function() {
			// in this case delimiters are in diffrent nodes, so no placeholders should be found
			assertWidget( {
				html: '<p>[[myPlaceholder</p><p>close]]</p>',
				bot: this.editorBot,
				count: 0
			} );
		},

		'test delimit in sibling nodes': function() {
			assertWidget( {
				html: '<p> this is <span> sample [[te </span> <span>xt]] </span>.</p>',
				bot: this.editorBot,
				count: 0
			} );
		},

		'test delimiter overflow': function() {
			assertWidget( {
				html: '<p> test [[[[[foobar]] test fofofo</p>',
				bot: this.editorBot,
				widgetOffset: 0,
				count: 1,
				assertCreated: function( widget ) {
					assertWidgetDataName( 'foobar', widget );
				},
				nameCreated: 'placeholder'
			} );
		},

		'test "nested" placeholder': function() {
			assertWidget( {
				html: '<p> test [[ [[[nested]] fofofof ]] fofofo</p>',
				bot: this.editorBot,
				widgetOffset: 0,
				count: 1,
				assertCreated: function( widget ) {
					assertWidgetDataName( 'nested', widget );
				},
				nameCreated: 'placeholder'
			} );
		},

		'test "nested" placeholder no spaces': function() {
			assertWidget( {
				html: '<p> test[[[[[nested]]fofofof]]fofofo</p>',
				bot: this.editorBot,
				widgetOffset: 0,
				count: 1,
				assertCreated: function( widget ) {
					assertWidgetDataName( 'nested', widget );
				},
				nameCreated: 'placeholder'
			} );
		},

		// https://dev.ckeditor.com/ticket/14701
		'test label': function() {
			assertWidget( {
				html: '<p>[[just example]]</p>',
				bot: this.editorBot,
				widgetOffset: 0,
				count: 1,
				assertCreated: function( widget ) {
					var expectedLabel = widget.editor.lang.widget.label.replace( /%1/, 'just example' + ' ' + widget.pathName );

					assert.areSame( expectedLabel, widget.getLabel(), 'getLabel() return value' );
					assert.areSame( expectedLabel, widget.wrapper.getAttribute( 'aria-label' ), 'widget aria-label value' );
				},
				nameCreated: 'placeholder'
			} );
		}
	} );
} )();
