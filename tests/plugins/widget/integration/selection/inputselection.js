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

					editor.widgets.add( 'testwidget', buildWidgetDefinition( {
						name: 'testwidget',
						elementName: 'textarea',
						innerHtml: '<textarea></textarea>'
					} ) );

					editor.widgets.add( 'testwidget2', buildWidgetDefinition( {
						name: 'testwidget2',
						elementName: 'input',
						innerHtml: '<input type="text">'
					} ) );
				}
			}
		}
	};

	// @param {bot} bot
	// @param {String} elementName name of used html element. Value should be equal: 'input' or 'textarea'
	// @param {Function} assertCallback funciton which returns a function to be executed on 'keydown' listener when assert for the tesr might be checked.
	function assertSelection( config ) {
		var bot = config.bot,
			elementName = config.elementName,
			assertCallback = config.assertCallback,
			widgetName = config.widgetName,
			editor = bot.editor,
			htmlElement = elementName === 'textarea' ? '<textarea></textarea>' : '<input type="text">';

		bot.setData( '<div class="' + widgetName + '">' + htmlElement + '</div>', function() {
			var editable = editor.editable(),
				widget = editor.widgets.getByElement( editable.findOne( 'div.' + widgetName ) ),
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
			assertSelection( {
				bot: this.editorBot,
				elementName: 'textarea',
				widgetName: 'testwidget',
				assertCallback: function( editor, el, widget ) {
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
				}
			} );
		},

		'test input inside widget should allow on typing': function() {
			assertSelection( {
				bot: this.editorBot,
				elementName: 'input',
				widgetName: 'testwidget2',
				assertCallback: function( editor, el ) {
					return function() {
						var selection = editor.getSelection();
						// Edge keeps selection on input element, IE11 moves it to wrapper, however there is still possibility to type in input field.
						if ( CKEDITOR.env.edge ) {
							assert.isTrue( selection.getStartElement().equals( el ) );
						} else {
							assert.isTrue( CKEDITOR.plugins.widget.isDomWidget( selection.getStartElement() ) );
						}
					};
				}
			} );
		}
	} );

	function buildWidgetDefinition( config ) {
		var name = config.name,
			elementName = config.elementName,
			innerHtml = config.innerHtml;

		return {
			requiredContent: 'div(' + name + ')',
			allowedContent: 'div(' + name + ')',
			template: '<div class="' + name + '">' +
				innerHtml +
				'</div>',
			button: 'Add ' + name + ' widget (' + elementName + ')',
			upcast: function( element ) {
				return element.name === 'div' && element.hasClass( name );
			},
			init: function() {
				this.on( 'focus', function() {
					this.element.findOne( elementName ).focus();
				} );
			}
		};
	}
} )();
