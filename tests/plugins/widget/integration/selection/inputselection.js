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

	// @param {bot} bot
	// @param {String} elementName name of used html element. Value should be equal: 'input' or 'textarea'
	// @param {Function} assertCallback funciton which returns a function to be executed on 'keydown' listener when assert for the tesr might be checked.
	function prepareEditor( bot, elementName, assertCallback ) {
		var editor = bot.editor;
		var htmlElement = elementName === 'textarea' ? '<textarea></textarea>' : '<input type="text">';

		bot.setData( '<div class="testwidget">' + htmlElement + '</div>', function() {
			var editable = editor.editable(),
				widget = editor.widgets.getByElement( editable.findOne( 'div.testwidget' ) ),
				range = editor.createRange(),
				el = widget.element.findOne( elementName );

			el.focus();

			range.selectNodeContents( el );
			range.select();

			editable.once( 'keydown', assertCallback( editor, el, widget ), null, null, 100000 );

			editable.fire( 'keydown', new CKEDITOR.dom.event( {
				keyCode: 66 // B
			} ) );
		} );

	}

	bender.test( {
		setUp: function() {
			if ( !CKEDITOR.env.ie || CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}
		},

		'test textarea inside widget should allow on typing': function() {
			prepareEditor( this.editorBot, 'textarea', function( editor, el, widget ) {
				return function() {
					var selection = editor.getSelection();
					// Edge expands selection to inner div. IE keeps selction inside textArea.
					// Important is to not have focused widget's wrapper.
					if ( CKEDITOR.env.edge ) {
						assert.isTrue( selection.getStartElement().equals( widget.element ) );
					} else {
						assert.isTrue( selection.getStartElement().equals( el ) );
					}
				};
			} );
		},

		'test input inside widget should allow on typing': function() {
			prepareEditor( this.editorBot, 'input', function( editor, el ) {
				return function() {
					var selection = editor.getSelection();
					// Edge keeps selection on input element, IE11 moves it to wrapper, however there is still possibility to type in input field.
					if ( CKEDITOR.env.edge ) {
						assert.isTrue( selection.getStartElement().equals( el ) );
					} else {
						assert.isTrue( CKEDITOR.plugins.widget.isDomWidget( selection.getStartElement() ) );
					}
				};
			} );
		}
	} );
} )();
