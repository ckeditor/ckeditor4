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
				htmlElement: '<textarea></textarea>',
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
				htmlElement: '<input type="text">',
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

	// @param {bot} config.bot
	// @param {String} config.elementName name of used html element. Value should be equal: 'input' or 'textarea'
	// @param {String} config.htmlElement string representation of an html element which is used to embed widget inside editor
	// @param {Function} config.assertCallback funciton which returns a function to be executed on 'keydown' listener when assert for the tesr might be checked.
	function assertSelection( config ) {
		var bot = config.bot,
			elementName = config.elementName,
			htmlElement = config.htmlElement,
			assertCallback = config.assertCallback,
			widgetName = config.widgetName,
			editor = bot.editor;

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

	// @param {String} cofig.name name of the widget. This name will be used also as a className for a widget
	// @param {String} config.elementName name of html elements, which is editable and is located inside the widget. Expected valeus are 'input' or 'textarea'
	// @param {String} config.innerHtml string representation of html element used to be emebedded inside widget
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
