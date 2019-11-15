/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget,undo */
/* bender-ckeditor-remove-plugins: tableselection */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true,
			on: {
				instanceReady: function( evt ) {
					var editor = evt.editor;

					editor.widgets.add( 'testwidget', {
						requiredContent: 'div(testwidget)',
						allowedContent: 'div(testwidget)',
						template: '<div class="testwidget">' +
							'<textarea></textarea>' +
							'</div>',
						button: 'Add textarea widget',
						upcast: function( element ) {
							return element.name === 'div' && element.hasClass( 'testwidget' );
						},
						init: function() {
							this.on( 'focus', function() {
								this.element.findOne( 'textarea' ).focus();
							} );
						}
					} );

					editor.widgets.add( 'testwidget2', {
						requiredContent: 'div(testwidget2)',
						allowedContent: 'div(testwidget2)',
						template: '<div class="testwidget2">' +
							'<input type="text">' +
							'</div>',
						button: 'Add input widget',
						upcast: function( element ) {
							return element.name === 'div' && element.hasClass( 'testwidget2' );
						},
						init: function() {
							this.on( 'focus', function() {
								this.element.findOne( 'input' ).focus();
							} );
						}
					} );
				}
			}
		}
	};

	bender.test( {
		'test textarea inside widget should allow on typing': function() {
			if ( !CKEDITOR.env.ie || CKEDITOR.env.version < 11 ) {
				assert.ignore();
			}

			var editor = this.editor;

			this.editorBot.setData( '<div class="testwidget"><textarea></textarea></div>', function() {
				var editable = editor.editable(),
					widget = editor.widgets.getByElement( editable.findOne( 'div.testwidget' ) ),
					range = editor.createRange(),
					textArea = widget.element.findOne( 'textarea' );

				textArea.focus();

				range.selectNodeContents( textArea );
				range.select();

				editable.once( 'keydown', function() {
					var selection = editor.getSelection();
					// Edge expands selection to inner div. IE keeps selction inside textArea.
					// Important is to not have focused widget's wrapper.
					if ( CKEDITOR.env.edge ) {
						assert.isTrue( selection.getStartElement().equals( widget.element ) );
					} else {
						assert.isTrue( selection.getStartElement().equals( textArea ) );
					}
				}, null, null, 100000 );

				editable.fire( 'keydown', new CKEDITOR.dom.event( {
					keyCode: 66 // B
				} ) );
			} );
		},

		'test input inside widget should allow on typing': function() {
			if ( !CKEDITOR.env.ie || CKEDITOR.env.version < 11 ) {
				assert.ignore();
			}

			var editor = this.editor;

			this.editorBot.setData( '<div class="testwidget2"><input type="text"></div>', function() {
				var editable = editor.editable(),
					widget = editor.widgets.getByElement( editable.findOne( 'div.testwidget2' ) ),
					range = editor.createRange(),
					inputElement = widget.element.findOne( 'input' );

				inputElement.focus();

				range.selectNodeContents( inputElement );
				range.select();

				editable.once( 'keydown', function() {
					var selection = editor.getSelection();
					// Edge keeps selection on input element, IE11 moves it to wrapper, however there is still possibility to type in input field.
					if ( CKEDITOR.env.edge ) {
						assert.isTrue( selection.getStartElement().equals( inputElement ) );
					} else {
						assert.isTrue( CKEDITOR.plugins.widget.isDomWidget( selection.getStartElement() ) );
					}
				}, null, null, 100000 );

				editable.fire( 'keydown', new CKEDITOR.dom.event( {
					keyCode: 66 // B
				} ) );
			} );
		}
	} );
} )();
