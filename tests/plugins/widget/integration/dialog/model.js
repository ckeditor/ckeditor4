/* bender-tags: editor,dialog */
/* bender-ckeditor-plugins: widget,wysiwygarea,dialog,toolbar */
/* bender-include: ../../_helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	var getWidgetById = widgetTestsTools.getWidgetById;

	bender.test( {
		init: function() {
			this.editor.widgets.add( 'test1', {
				template: '<div>foo</div>',
				dialog: 'dialog1'
			} );

			CKEDITOR.dialog.add( 'dialog1', function() {
				return {
					title: 'Test1',
					contents: [ {
						id: 'info',
						elements: [ {
							id: 'value1',
							type: 'text',
							label: 'Value 1',
							setup: function( widget ) {
								this.setValue( widget.data.value1 );
							},
							commit: function( widget ) {
								widget.setData( 'value1', this.getValue() );
							}
						} ]
					} ]
				};
			} );

			this.editor.addCommand( 'dialog1', new CKEDITOR.dialogCommand( 'dialog1' ) );

			this._disposableListeners = [];
		},

		tearDown: function() {
			var dialog = CKEDITOR.dialog.getCurrent();

			if ( dialog ) {
				dialog.hide();
			}

			CKEDITOR.tools.array.filter( this._disposableListeners, function( listener ) {
				listener.removeListener();
				return false;
			} );
		},

		// (#2423)
		'test getting model from dialog in edit mode': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.setData( '<p data-widget="test1" id="x">foo</p>', function() {
				var widget = getWidgetById( editor, 'x' );

				this._disposableListeners.push( editor.once( 'dialogShow', function( evt ) {
					resume( function() {
						var dialog = evt.data;

						assert.areSame( widget, dialog.getModel( editor ), 'Model returned by dialog.getModel().' );
					} );
				} ) );

				widget.focus();
				widget.edit();

				wait();
			} );
		},

		// (#2423)
		'test getting model from dialog in add mode': function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '<p>^</p>' );

			this._disposableListeners.push( this.editor.on( 'dialogShow', function( evt ) {
				var dialog = evt.data;

				if ( dialog.getName() === 'dialog1' ) {
					resume( function() {
						assert.isInstanceOf( CKEDITOR.plugins.widget, dialog.getModel( bot.editor ), 'Model type returned by dialog.getModel().' );
					} );
				}
			} ) );

			this.editor.execCommand( 'test1' );

			wait();
		},

		// (#2423)
		'test getMode return value when no widget is edited': function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '<p>^</p>' );

			this._disposableListeners.push( this.editor.on( 'dialogShow', function( evt ) {
				var dialog = evt.data;

				if ( dialog.getName() === 'dialog1' ) {
					resume( function() {
						assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode() );
					} );
				}
			} ) );

			this.editor.execCommand( 'test1' );

			wait();
		},

		// (#2423)
		'test getMode return value when a widget is edited': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.setData( '<p data-widget="test1" id="x">foo</p>', function() {
				var widget = getWidgetById( editor, 'x' );

				this._disposableListeners.push( this.editor.on( 'dialogShow', function( evt ) {
					var dialog = evt.data;

					if ( dialog.getName() === 'dialog1' ) {
						resume( function() {
							assert.areEqual( CKEDITOR.dialog.EDITING_MODE, dialog.getMode() );
						} );
					}
				} ) );

				widget.focus();
				widget.edit();

				wait();
			} );
		},

		// (#2423)
		'test getMode return value with offline widget': function() {
			var editor = this.editor,
				bot = this.editorBot,
				div = new CKEDITOR.dom.element( 'div' ),
				widgetElement = new CKEDITOR.dom.element( 'p' );

			div.append( widgetElement );

			bot.setData( '<p></p>', function() {
				var offlineWidget = new CKEDITOR.plugins.widget( editor.widgets,
					200, widgetElement, this.editor.widgets.registered.test1 );

				this._disposableListeners.push( this.editor.on( 'dialogShow', function( evt ) {
					var dialog = evt.data,
						getModelStub = sinon.stub( dialog, 'getModel' ).returns( offlineWidget );

					if ( dialog.getName() === 'dialog1' ) {
						resume( function() {
							getModelStub.restore();

							assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode() );
						} );
					}
				} ) );

				offlineWidget.edit();

				wait();
			} );
		}
	} );
} )();
