/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'textfield', function( editor ) {
	return {
		title: editor.lang.textfield.title,
		minWidth: 350,
		minHeight: 140,
		onShow: function() {
			// IE BUG: Selection must be in the editor for getSelectedElement()
			// to work.
			this.restoreSelection();

			var element = this.getParentEditor().getSelection().getSelectedElement();
			if ( element && element.getName() == "input" && ( element.getAttribute( 'type' ) == "text" || !element.getAttribute( 'type' ) ) ) {
				this._element = element;
				this.setupContent( element );
			}
		},
		onOk: function() {
			var editor,
				element = this._element,
				isInsertMode = !element;

			if ( isInsertMode ) {
				editor = this.getParentEditor();
				element = editor.document.createElement( 'input' );
				element.setAttribute( 'type', 'text' );
			}
			this.commitContent( element );

			if ( isInsertMode ) {
				this.restoreSelection();
				this.clearSavedSelection();
				editor.insertElement( element );
			}
		},
		contents: [
			{
			id: 'info',
			label: editor.lang.textfield.title,
			title: editor.lang.textfield.title,
			elements: [
				{
				type: 'hbox',
				widths: [ '50%', '50%' ],
				children: [
					{
					id: 'txtName',
					type: 'text',
					label: editor.lang.textfield.name,
					'default': '',
					accessKey: 'N',
					setup: function( element ) {
						this.setValue( element.getAttribute( 'name' ) );
						this.focus();
					},
					commit: function( element ) {
						if ( this.getValue() != '' || this.isChanged() )
							element.setAttribute( 'name', this.getValue() );
					}
				},
					{
					id: 'txtValue',
					type: 'text',
					label: editor.lang.textfield.value,
					'default': '',
					accessKey: 'V',
					setup: function( element ) {
						this.setValue( element.getAttribute( 'value' ) );
					},
					commit: function( element ) {
						if ( this.getValue() != '' || this.isChanged() )
							element.setAttribute( 'value', this.getValue() );
					}
				}
				]
			},
				{
				type: 'hbox',
				widths: [ '50%', '50%' ],
				children: [
					{
					id: 'txtTextCharWidth',
					type: 'text',
					label: editor.lang.textfield.charWidth,
					'default': '',
					accessKey: 'C',
					style: 'width:50px',
					validate: function() {
						var func = CKEDITOR.dialog.validate.integer( editor.lang.common.validateNumberFailed );
						return isValid = func.apply( this );
					},
					setup: function( element ) {
						this.setValue( element.getAttribute( 'size' ) );
					},
					commit: function( element ) {
						if ( this.getValue() != '' || this.isChanged() )
							element.setAttribute( 'size', this.getValue() );
					}
				},
					{
					id: 'txtMaxChars',
					type: 'text',
					label: editor.lang.textfield.maxChars,
					'default': '',
					accessKey: 'M',
					style: 'width:50px',
					validate: function() {
						var func = CKEDITOR.dialog.validate.integer( editor.lang.common.validateNumberFailed );
						return isValid = func.apply( this );
					},
					setup: function( element ) {
						this.setValue( element.getAttribute( 'maxlength' ) );
					},
					commit: function( element ) {
						if ( this.getValue() != '' || this.isChanged() )
							element.setAttribute( 'maxlength', this.getValue() );
					}
				}
				]
			},
				{
				id: 'cmbType',
				type: 'select',
				label: editor.lang.textfield.type,
				'default': 'text',
				accessKey: 'M',
				items: [
					[ editor.lang.textfield.typeText, 'text' ],
					[ editor.lang.textfield.typePass, 'pass' ],
					],
				setup: function( element ) {
					this.setValue( element.getAttribute( 'type' ) );
				},
				commit: function( element ) {
					element.setAttribute( 'type', this.getValue() );
				}
			}
			]
		}
		]
	};
});
