/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget,dialog */
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

					evt.editor.widgets.add( 'test1', {
						template: '<div>foo</div>',
						dialog: 'widgettest1'
					} );

					evt.editor.widgets.add( 'test2', {
					} );

					CKEDITOR.dialog.add( 'widgettest1', function() {
						return {
							title: 'Test1',
							contents: [
								{
									id: 'info',
									elements: [
										{
											id: 'value1',
											type: 'text',
											label: 'Value 1',
											setup: function( widget ) {
												this.setValue( widget.data.value1 );
											},
											commit: function( widget ) {
												widget.setData( 'value1', this.getValue() );
											}
										},
										{
											id: 'value2',
											type: 'text',
											label: 'Value 2',
											setup: function( widget ) {
												this.setValue( widget.data.value2 );
											},
											commit: function( widget ) {
												widget.setData( 'value2', this.getValue() );
											}
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
		getWidgetById = widgetTestsTools.getWidgetById,
		replaceMethod = bender.tools.replaceMethod,
		DEL = 46,
		BACKSPACE = 8;

	bender.test( {
		triggerEvent : function(key,event,editor){
			editor.editable().fire( event, new CKEDITOR.dom.event( {
				keyCode: key
			}));
		},		
		'test deleting widget using shortcut deletes widgets': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p id="w1" data-widget="test1">X</p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				widget.focus();
				editor.config.readOnly = false;
								
				this.triggerEvent(DEL,"keydown",editor);
			
				widget = getWidgetById( editor, 'w1' );
				
				assert.isNull( widget );
			} );
		},
		
		'test deleting widget using shortcut editor readOnly does nothing': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p id="w1" data-widget="test1">X</p>', function() {
				var widget = getWidgetById( editor, 'w1' );

				widget.focus();
				editor.config.readOnly = true;
			
				this.triggerEvent(DEL,"keydown",editor);
				this.triggerEvent(BACKSPACE,"keydown",editor);
						
				var newWidget = getWidgetById( editor, 'w1' );
								
				assert.areSame( widget , newWidget);
			} );
		}
	} );
} )();
