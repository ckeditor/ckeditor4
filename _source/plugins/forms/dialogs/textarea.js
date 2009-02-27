/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'textarea', function( editor ) {
	return {
		title: editor.lang.textarea.title,
		minWidth: 400,
		minHeight: 230,
		onShow: function() {
			// IE BUG: Selection must be in the editor for getSelectedElement()
			// to work.
			this.restoreSelection();

			var element = this.getParentEditor().getSelection().getSelectedElement();
			if ( element && element.getName() == "textarea" ) {
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
				element = editor.document.createElement( 'textarea' );
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
			label: editor.lang.textarea.title,
			title: editor.lang.textarea.title,
			elements: [
				{
				id: 'txtName',
				type: 'text',
				label: editor.lang.common.name,
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
				id: 'txtColumns',
				type: 'text',
				label: editor.lang.textarea.cols,
				'default': '',
				accessKey: 'C',
				style: 'width:50px',
				validate: function() {
					var func = CKEDITOR.dialog.validate.integer( editor.lang.common.validateNumberFailed );
					return func.apply( this );
				},
				setup: function( element ) {
					this.setValue( element.getAttribute( 'cols' ) );
				},
				commit: function( element ) {
					if ( this.getValue() != '' || this.isChanged() )
						element.setAttribute( 'cols', this.getValue() );
				}
			},
				{
				id: 'txtRows',
				type: 'text',
				label: editor.lang.textarea.rows,
				'default': '',
				accessKey: 'R',
				style: 'width:50px',
				validate: function() {
					var func = CKEDITOR.dialog.validate.integer( editor.lang.common.validateNumberFailed );
					return func.apply( this );
				},
				setup: function( element ) {
					this.setValue( element.getAttribute( 'rows' ) );
				},
				commit: function( element ) {
					if ( this.getValue() != '' || this.isChanged() )
						element.setAttribute( 'rows', this.getValue() );
				}
			}
			]
		}
		]
	};
});
