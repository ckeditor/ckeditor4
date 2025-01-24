/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */
CKEDITOR.dialog.add( 'textfield', function( editor ) {

	var acceptedTypes = { email: 1, password: 1, search: 1, tel: 1, text: 1, url: 1 };

	function autoCommit( data ) {
		var element = data.element;
		var value = this.getValue();

		value ? element.setAttribute( this.id, value ) : element.removeAttribute( this.id );
	}

	function autoSetup( element ) {
		var value = element.hasAttribute( this.id ) && element.getAttribute( this.id );
		this.setValue( value || '' );
	}

	return {
		title: editor.lang.forms.textfield.title,
		minWidth: 350,
		minHeight: 150,
		getModel: function( editor ) {
			var element = editor.getSelection().getSelectedElement();

			if ( element && element.getName() == 'input' &&
				( acceptedTypes[ element.getAttribute( 'type' ) ] || !element.getAttribute( 'type' ) ) ) {
				return element;
			}

			return null;
		},
		onShow: function() {
			var element = this.getModel( this.getParentEditor() );
			if ( element ) {
				this.setupContent( element );
			}
		},
		onOk: function() {
			var editor = this.getParentEditor(),
				element = this.getModel( editor ),
				isInsertMode = this.getMode( editor ) == CKEDITOR.dialog.CREATION_MODE;

			if ( isInsertMode ) {
				element = editor.document.createElement( 'input' );
				element.setAttribute( 'type', 'text' );
			}

			var data = { element: element };

			if ( isInsertMode ) {
				editor.insertElement( data.element );
			}

			this.commitContent( data );

			// Element might be replaced by commitment.
			if ( !isInsertMode )
				editor.getSelection().selectElement( data.element );
		},
		onLoad: function() {
			this.foreach( function( contentObj ) {
				if ( contentObj.getValue ) {
					if ( !contentObj.setup )
						contentObj.setup = autoSetup;
					if ( !contentObj.commit )
						contentObj.commit = autoCommit;
				}
			} );
		},
		contents: [ {
			id: 'info',
			label: editor.lang.forms.textfield.title,
			title: editor.lang.forms.textfield.title,
			elements: [ {
				type: 'hbox',
				widths: [ '50%', '50%' ],
				children: [ {
					id: '_cke_saved_name',
					type: 'text',
					label: editor.lang.forms.textfield.name,
					'default': '',
					accessKey: 'N',
					setup: function( element ) {
						this.setValue( element.data( 'cke-saved-name' ) || element.getAttribute( 'name' ) || '' );
					},
					commit: function( data ) {
						var element = data.element;

						if ( this.getValue() )
							element.data( 'cke-saved-name', this.getValue() );
						else {
							element.data( 'cke-saved-name', false );
							element.removeAttribute( 'name' );
						}
					}
				},
				{
					id: 'value',
					type: 'text',
					label: editor.lang.forms.textfield.value,
					'default': '',
					accessKey: 'V',
					commit: function( data ) {
						if ( CKEDITOR.env.ie && !this.getValue() ) {
							var element = data.element,
								fresh = new CKEDITOR.dom.element( 'input', editor.document );
							element.copyAttributes( fresh, { value: 1 } );
							fresh.replace( element );
							data.element = fresh;
						} else {
							autoCommit.call( this, data );
						}
					}
				} ]
			},
			{
				type: 'hbox',
				widths: [ '50%', '50%' ],
				children: [ {
					id: 'size',
					type: 'text',
					label: editor.lang.forms.textfield.charWidth,
					'default': '',
					accessKey: 'C',
					style: 'width:50px',
					validate: CKEDITOR.dialog.validate.integer( editor.lang.common.validateNumberFailed )
				},
				{
					id: 'maxLength',
					type: 'text',
					label: editor.lang.forms.textfield.maxChars,
					'default': '',
					accessKey: 'M',
					style: 'width:50px',
					validate: CKEDITOR.dialog.validate.integer( editor.lang.common.validateNumberFailed )
				} ],
				onLoad: function() {
					// Repaint the style for IE7 (https://dev.ckeditor.com/ticket/6068)
					if ( CKEDITOR.env.ie7Compat )
						this.getElement().setStyle( 'zoom', '100%' );
				}
			},
			{
				id: 'type',
				type: 'select',
				label: editor.lang.forms.textfield.type,
				'default': 'text',
				accessKey: 'M',
				items: [
					[ editor.lang.forms.textfield.typeEmail,	'email' ],
					[ editor.lang.forms.textfield.typePass,		'password' ],
					[ editor.lang.forms.textfield.typeSearch,	'search' ],
					[ editor.lang.forms.textfield.typeTel,		'tel' ],
					[ editor.lang.forms.textfield.typeText,		'text' ],
					[ editor.lang.forms.textfield.typeUrl,		'url' ]
				],
				setup: function( element ) {
					this.setValue( element.getAttribute( 'type' ) );
				},
				commit: function( data ) {
					var element = data.element;

					if ( CKEDITOR.env.ie ) {
						var elementType = element.getAttribute( 'type' );
						var myType = this.getValue();

						if ( elementType != myType ) {
							var replace = CKEDITOR.dom.element.createFromHtml( '<input type="' + myType + '"></input>', editor.document );
							element.copyAttributes( replace, { type: 1 } );
							replace.replace( element );
							data.element = replace;
						}
					} else {
						element.setAttribute( 'type', this.getValue() );
					}
				}
			},
			{
				id: 'required',
				type: 'checkbox',
				label: editor.lang.forms.textfield.required,
				'default': '',
				accessKey: 'Q',
				value: 'required',
				setup: CKEDITOR.plugins.forms._setupRequiredAttribute,
				commit: function( data ) {
					var element = data.element;
					if ( this.getValue() )
						element.setAttribute( 'required', 'required' );
					else
						element.removeAttribute( 'required' );
				}
			} ]
		} ]
	};
} );
