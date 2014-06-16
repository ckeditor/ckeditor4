/* bender-tags: editor,unit,widgetcore */
/* bender-ckeditor-plugins: widget */

( function() {
	'use strict';

	var data = '<p><b id="w1" data-widget="testwidget">foo</b>bar</p>',
		getWidgetById = widgetTestsTools.getWidgetById;

	bender.test( {
		'async:init': function() {
			var tc = this;

			bender.tools.setUpEditors( {
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
			}, function( editors, bots ) {
				tc.editors = editors;
				tc.editorBots = bots;

				tc.callback();
			} );
		},

		'test check dirty is false after widget focus': function() {
			var editor = this.editors.editor;

			this.editorBots.editor.setData( data, function() {
				var widget = getWidgetById( editor, 'w1' );

				editor.resetDirty();
				widget.focus();
				assert.isFalse( editor.checkDirty() );
			} );
		},

		'test check dirty keeps to be true after widget focus': function() {
			var editor = this.editors.editor;

			this.editorBots.editor.setData( data, function() {
				var widget = getWidgetById( editor, 'w1' );

				editor.resetDirty();

				// Make some changes in editor.
				widget.addClass( 'test' );

				assert.isTrue( editor.checkDirty() );
				widget.focus();
				assert.isTrue( editor.checkDirty() );
			} );
		}
	} );

} )();