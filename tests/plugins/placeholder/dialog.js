/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: placeholder */
/* global widgetTestsTools */

( function() {
	'use strict';

	// (#3768)
	if ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) {
		bender.ignore();
	}

	var assertWidgetDialog = widgetTestsTools.assertWidgetDialog;

	bender.editor = {
		config: {
			autoParagraph: false
		}
	};

	bender.test( {
		'test dialog': function() {
			var initialEditorHtml = 'This is sample text [[language]], having around [[count_of]] placeholders.',
				dialogAssertConfig = {
					'name': 'language'
				};

			assertWidgetDialog( this.editorBot, 'placeholder', initialEditorHtml, 0, dialogAssertConfig );
			// Note, execution flow will not return here.
		},

		'test multiple items dialog value': function() {
			var initialEditorHtml = 'This is sample text [[language]], [[yet]] having around [[count_of]] placeholders [[foo]] bar.',
				dialogAssertConfig = {
					'name': 'count_of'
				};

			assertWidgetDialog( this.editorBot, 'placeholder', initialEditorHtml, 2, dialogAssertConfig );
			// Note, execution flow will not return here.
		},

		'test default dialog value (without focused widget)': function() {
			// When no widget is focuse (adding mode) dialog name should be empty.
			var initialEditorHtml = 'foo [[bar]] baz.',
				dialogAssertConfig = {
					'name': ''
				};

			assertWidgetDialog( this.editorBot, 'placeholder', initialEditorHtml, null, dialogAssertConfig );
			// Note, execution flow will not return here.
		},

		'test widget name change with dialog': function() {
			// When no widget is focuse (adding mode) dialog name should be empty.
			var initialEditorHtml = 'foo [[bar]] baz.',
				editorBot = this.editorBot,
				dialogAssertConfig = {},
				editedWidgetOffset = 0,
				onResume = function( dialog ) {
					var widget = bender.tools.objToArray( editorBot.editor.widgets.instances )[ editedWidgetOffset ];
					assert.areSame( 'bar', widget.data.name, 'Invalid name' );
					// Changes value of input in dialog, and clicks ok.
					dialog.setValueOf( 'info', 'name', 'boo_faa' );
					dialog.getButton( 'ok' ).click();
					assert.areSame( 'boo_faa', widget.data.name, 'After accepting dialog, name was not changed.' );
				};

			assertWidgetDialog( this.editorBot, 'placeholder', initialEditorHtml, editedWidgetOffset, dialogAssertConfig, null, onResume );
			// Note, execution flow will not return here.
		}

	} );
} )();
