/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Forms Plugin
 */

CKEDITOR.plugins.add( 'forms', {
	requires: 'dialog,fakeobjects',
	// jscs:disable maximumLineLength
	lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
	// jscs:enable maximumLineLength
	icons: 'button,checkbox,form,hiddenfield,imagebutton,radio,select,select-rtl,textarea,textarea-rtl,textfield', // %REMOVE_LINE_CORE%
	hidpi: true, // %REMOVE_LINE_CORE%
	onLoad: function() {
		CKEDITOR.addCss( '.cke_editable form' +
			'{' +
				'border: 1px dotted #FF0000;' +
				'padding: 2px;' +
			'}\n' );

		CKEDITOR.addCss( 'img.cke_hidden' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/hiddenfield.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 16px !important;' +
				'height: 16px !important;' +
			'}' );

		// Mark <select>s and <option>s elements as unstylable (#4141).
		CKEDITOR.style.unstylableElements.push( 'select', 'option' );
	},
	init: function( editor ) {
		var lang = editor.lang,
			order = 0,
			textfieldTypes = { email: 1, password: 1, search: 1, tel: 1, text: 1, url: 1 },
			allowedContent = {
				checkbox: 'input[type,name,checked,required]',
				radio: 'input[type,name,checked,required]',
				textfield: 'input[type,name,value,size,maxlength,required]',
				textarea: 'textarea[cols,rows,name,required]',
				select: 'select[name,size,multiple,required]; option[value,selected]',
				button: 'input[type,name,value]',
				form: 'form[action,name,id,enctype,target,method]',
				hiddenfield: 'input[type,name,value]',
				imagebutton: 'input[type,alt,src]{width,height,border,border-width,border-style,margin,float}'
			},
			requiredContent = {
				checkbox: 'input',
				radio: 'input',
				textfield: 'input',
				textarea: 'textarea',
				select: 'select',
				button: 'input',
				form: 'form',
				hiddenfield: 'input',
				imagebutton: 'input'
			};

		// All buttons use the same code to register. So, to avoid
		// duplications, let's use this tool function.
		var addButtonCommand = function( buttonName, commandName, dialogFile ) {
				var def = {
					allowedContent: allowedContent[ commandName ],
					requiredContent: requiredContent[ commandName ]
				};
				commandName == 'form' && ( def.context = 'form' );

				editor.addCommand( commandName, new CKEDITOR.dialogCommand( commandName, def ) );

				editor.ui.addButton && editor.ui.addButton( buttonName, {
					label: lang.common[ buttonName.charAt( 0 ).toLowerCase() + buttonName.slice( 1 ) ],
					command: commandName,
					toolbar: 'forms,' + ( order += 10 )
				} );
				CKEDITOR.dialog.add( commandName, dialogFile );
			};

		var dialogPath = this.path + 'dialogs/';
		!editor.blockless && addButtonCommand( 'Form', 'form', dialogPath + 'form.js' );
		addButtonCommand( 'Checkbox', 'checkbox', dialogPath + 'checkbox.js' );
		addButtonCommand( 'Radio', 'radio', dialogPath + 'radio.js' );
		addButtonCommand( 'TextField', 'textfield', dialogPath + 'textfield.js' );
		addButtonCommand( 'Textarea', 'textarea', dialogPath + 'textarea.js' );
		addButtonCommand( 'Select', 'select', dialogPath + 'select.js' );
		addButtonCommand( 'Button', 'button', dialogPath + 'button.js' );

		var imagePlugin = editor.plugins.image;

		// Since Image plugin is disabled when Image2 is to be loaded,
		// ImageButton also got to be off (https://dev.ckeditor.com/ticket/11222).
		if ( imagePlugin && !editor.plugins.image2 )
			addButtonCommand( 'ImageButton', 'imagebutton', CKEDITOR.plugins.getPath( 'image' ) + 'dialogs/image.js' );

		addButtonCommand( 'HiddenField', 'hiddenfield', dialogPath + 'hiddenfield.js' );

		// If the "menu" plugin is loaded, register the menu items.
		if ( editor.addMenuItems ) {
			var items = {
				checkbox: {
					label: lang.forms.checkboxAndRadio.checkboxTitle,
					command: 'checkbox',
					group: 'checkbox'
				},

				radio: {
					label: lang.forms.checkboxAndRadio.radioTitle,
					command: 'radio',
					group: 'radio'
				},

				textfield: {
					label: lang.forms.textfield.title,
					command: 'textfield',
					group: 'textfield'
				},

				hiddenfield: {
					label: lang.forms.hidden.title,
					command: 'hiddenfield',
					group: 'hiddenfield'
				},

				button: {
					label: lang.forms.button.title,
					command: 'button',
					group: 'button'
				},

				select: {
					label: lang.forms.select.title,
					command: 'select',
					group: 'select'
				},

				textarea: {
					label: lang.forms.textarea.title,
					command: 'textarea',
					group: 'textarea'
				}
			};

			if ( imagePlugin ) {
				items.imagebutton = {
					label: lang.image.titleButton,
					command: 'imagebutton',
					group: 'imagebutton'
				};
			}

			!editor.blockless && ( items.form = {
				label: lang.forms.form.menu,
				command: 'form',
				group: 'form'
			} );

			editor.addMenuItems( items );

		}

		// If the "contextmenu" plugin is loaded, register the listeners.
		if ( editor.contextMenu ) {
			!editor.blockless && editor.contextMenu.addListener( function( element, selection, path ) {
				var form = path.contains( 'form', 1 );
				if ( form && !form.isReadOnly() )
					return { form: CKEDITOR.TRISTATE_OFF };
			} );

			editor.contextMenu.addListener( function( element ) {
				if ( element && !element.isReadOnly() ) {
					var name = element.getName();

					if ( name == 'select' )
						return { select: CKEDITOR.TRISTATE_OFF };

					if ( name == 'textarea' )
						return { textarea: CKEDITOR.TRISTATE_OFF };

					if ( name == 'input' ) {
						var type = element.getAttribute( 'type' ) || 'text';
						switch ( type ) {
							case 'button':
							case 'submit':
							case 'reset':
								return { button: CKEDITOR.TRISTATE_OFF };

							case 'checkbox':
								return { checkbox: CKEDITOR.TRISTATE_OFF };

							case 'radio':
								return { radio: CKEDITOR.TRISTATE_OFF };

							case 'image':
								return imagePlugin ? { imagebutton: CKEDITOR.TRISTATE_OFF } : null;
						}

						if ( textfieldTypes[ type ] )
							return { textfield: CKEDITOR.TRISTATE_OFF };
					}

					if ( name == 'img' && element.data( 'cke-real-element-type' ) == 'hiddenfield' )
						return { hiddenfield: CKEDITOR.TRISTATE_OFF };
				}
			} );
		}

		editor.on( 'doubleclick', function( evt ) {
			var element = evt.data.element;

			if ( !editor.blockless && element.is( 'form' ) )
				evt.data.dialog = 'form';
			else if ( element.is( 'select' ) )
				evt.data.dialog = 'select';
			else if ( element.is( 'textarea' ) )
				evt.data.dialog = 'textarea';
			else if ( element.is( 'img' ) && element.data( 'cke-real-element-type' ) == 'hiddenfield' )
				evt.data.dialog = 'hiddenfield';
			else if ( element.is( 'input' ) ) {
				var type = element.getAttribute( 'type' ) || 'text';
				switch ( type ) {
					case 'button':
					case 'submit':
					case 'reset':
						evt.data.dialog = 'button';
						break;
					case 'checkbox':
						evt.data.dialog = 'checkbox';
						break;
					case 'radio':
						evt.data.dialog = 'radio';
						break;
					case 'image':
						evt.data.dialog = 'imagebutton';
						break;
				}
				if ( textfieldTypes[ type ] )
					evt.data.dialog = 'textfield';
			}
		} );
	},

	afterInit: function( editor ) {
		var dataProcessor = editor.dataProcessor,
			htmlFilter = dataProcessor && dataProcessor.htmlFilter,
			dataFilter = dataProcessor && dataProcessor.dataFilter;

		// Cleanup certain IE form elements default values.
		// Note: Inputs are marked with contenteditable=false flags, so filters for them
		// need to be applied to non-editable content as well.
		if ( CKEDITOR.env.ie ) {
			htmlFilter && htmlFilter.addRules( {
				elements: {
					input: function( input ) {
						var attrs = input.attributes,
							type = attrs.type;
						// Old IEs don't provide type for Text inputs https://dev.ckeditor.com/ticket/5522
						if ( !type )
							attrs.type = 'text';
						if ( type == 'checkbox' || type == 'radio' )
							attrs.value == 'on' && delete attrs.value;
					}
				}
			}, { applyToAll: true } );
		}

		if ( dataFilter ) {
			dataFilter.addRules( {
				elements: {
					input: function( element ) {
						if ( element.attributes.type == 'hidden' )
							return editor.createFakeParserElement( element, 'cke_hidden', 'hiddenfield' );
					}
				}
			}, { applyToAll: true } );
		}
	}
} );

/**
 * Namespace containing helper functions for the Forms plugin.
 *
 * @since 4.11.0
 * @singleton
 * @class CKEDITOR.plugins.forms
 */
CKEDITOR.plugins.forms = {
	/**
	* Sets the dialog's `required` value to match the presence of the `required` attribute on an element.
	* Based on the [algorithm described in the HTML specification](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute).
	*
	* @since 4.11.0
	* @private
	* @param {CKEDITOR.dom.element} element An element whose `required` attribute is checked.
	*/
	_setupRequiredAttribute: function( element ) {
		this.setValue( element.hasAttribute( 'required' ) );
	}
};
