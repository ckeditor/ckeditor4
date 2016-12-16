/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	var data = '<p id="p1">bar<b id="w1" data-widget="testwidget">foo</b></p>',
		getWidgetById = widgetTestsTools.getWidgetById;

	bender.editors = {
		editor: {
			name: 'editor1',
			creator: 'inline',
			config: {
				allowedContent: true,
				on: {
					pluginsLoaded: function( evt ) {
						evt.editor.widgets.add( 'testwidget', {} );
					}
				}
			}
		}
	};

	bender.test( {
		'test check dirty is false after widget focus': function() {
			var editor = this.editors.editor;

			this.editorBots.editor.setData( data, function() {
				var widget = getWidgetById( editor, 'w1' );

				editor.resetDirty();
				widget.focus();
				assert.isFalse( editor.checkDirty() );
			} );
		},

		'test check dirty is false after widget blur': function() {
			var editor = this.editors.editor;

			this.editorBots.editor.setData( data, function() {
				var widget = getWidgetById( editor, 'w1' );

				widget.focus();
				editor.resetDirty();

				var range = editor.createRange();
				range.moveToPosition( editor.document.getById( 'p1' ), CKEDITOR.POSITION_AFTER_START );
				editor.getSelection().selectRanges( [ range ] );

				assert.isFalse( editor.checkDirty() );
			} );
		},

		'test check dirty keeps to be true after widget focus': function() {
			var editor = this.editors.editor;

			this.editorBots.editor.setData( data, function() {
				var widget = getWidgetById( editor, 'w1' );

				// Make some changes in editor.
				widget.addClass( 'test' );
				assert.isTrue( editor.checkDirty(), 'before focus' );

				widget.focus();
				assert.isTrue( editor.checkDirty(), 'after focus' );
			} );
		},

		'test check dirty keeps to be false after widget blur': function() {
			var editor = this.editors.editor;

			this.editorBots.editor.setData( data, function() {
				var widget = getWidgetById( editor, 'w1' );

				widget.focus();
				// Make some changes in editor.
				widget.addClass( 'test' );
				assert.isTrue( editor.checkDirty(), 'before blur' );

				var range = editor.createRange();
				range.moveToPosition( editor.document.getById( 'p1' ), CKEDITOR.POSITION_AFTER_START );
				editor.getSelection().selectRanges( [ range ] );
				assert.isTrue( editor.checkDirty(), 'after blur' );
			} );
		}
	} );

} )();