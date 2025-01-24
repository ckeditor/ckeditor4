/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */
CKEDITOR.dialog.add( 'textarea', function( editor ) {
	return {
		title: editor.lang.forms.textarea.title,
		minWidth: 350,
		minHeight: 220,
		getModel: function( editor ) {
			var element = editor.getSelection().getSelectedElement();

			if ( element && element.getName() == 'textarea' ) {
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
				element = editor.document.createElement( 'textarea' );
			}

			this.commitContent( element );

			if ( isInsertMode )
				editor.insertElement( element );
		},
		contents: [ {
			id: 'info',
			label: editor.lang.forms.textarea.title,
			title: editor.lang.forms.textarea.title,
			elements: [ {
				id: '_cke_saved_name',
				type: 'text',
				label: editor.lang.common.name,
				'default': '',
				accessKey: 'N',
				setup: function( element ) {
					this.setValue( element.data( 'cke-saved-name' ) || element.getAttribute( 'name' ) || '' );
				},
				commit: function( element ) {
					if ( this.getValue() )
						element.data( 'cke-saved-name', this.getValue() );
					else {
						element.data( 'cke-saved-name', false );
						element.removeAttribute( 'name' );
					}
				}
			},
			{
				type: 'hbox',
				widths: [ '50%', '50%' ],
				children: [ {
					id: 'cols',
					type: 'text',
					label: editor.lang.forms.textarea.cols,
					'default': '',
					accessKey: 'C',
					style: 'width:50px',
					validate: CKEDITOR.dialog.validate.integer( editor.lang.common.validateNumberFailed ),
					setup: function( element ) {
						var value = element.hasAttribute( 'cols' ) && element.getAttribute( 'cols' );
						this.setValue( value || '' );
					},
					commit: function( element ) {
						if ( this.getValue() )
							element.setAttribute( 'cols', this.getValue() );
						else
							element.removeAttribute( 'cols' );
					}
				},
				{
					id: 'rows',
					type: 'text',
					label: editor.lang.forms.textarea.rows,
					'default': '',
					accessKey: 'R',
					style: 'width:50px',
					validate: CKEDITOR.dialog.validate.integer( editor.lang.common.validateNumberFailed ),
					setup: function( element ) {
						var value = element.hasAttribute( 'rows' ) && element.getAttribute( 'rows' );
						this.setValue( value || '' );
					},
					commit: function( element ) {
						if ( this.getValue() )
							element.setAttribute( 'rows', this.getValue() );
						else
							element.removeAttribute( 'rows' );
					}
				} ]
			},
			{
				id: 'value',
				type: 'textarea',
				label: editor.lang.forms.textfield.value,
				'default': '',
				setup: function( element ) {
					this.setValue( element.$.defaultValue );
				},
				commit: function( element ) {
					element.$.value = element.$.defaultValue = this.getValue();
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
				commit: function( element ) {
					if ( this.getValue() )
						element.setAttribute( 'required', 'required' );
					else
						element.removeAttribute( 'required' );
				}
			} ]
		} ]
	};
} );
