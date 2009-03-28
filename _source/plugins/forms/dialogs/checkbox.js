/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'checkbox', function( editor ) {
	return {
		title: editor.lang.checkboxAndRadio.checkboxTitle,
		minWidth: 350,
		minHeight: 140,
		onShow: function() {
			// IE BUG: Selection must be in the editor for getSelectedElement()
			// to work.
			this.restoreSelection();

			var element = this.getParentEditor().getSelection().getSelectedElement();

			if ( element && element.getAttribute( 'type' ) == "checkbox" ) {
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
				element.setAttribute( 'type', 'checkbox' );
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
			label: editor.lang.checkboxAndRadio.checkboxTitle,
			title: editor.lang.checkboxAndRadio.checkboxTitle,
			startupFocus: 'txtName',
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
					if ( this.getValue() || this.isChanged() )
						element.setAttribute( 'name', this.getValue() );
				}
			},
				{
				id: 'txtValue',
				type: 'text',
				label: editor.lang.checkboxAndRadio.value,
				'default': '',
				accessKey: 'V',
				setup: function( element ) {
					this.setValue( element.getAttribute( 'value' ) );
				},
				commit: function( element ) {
					if ( this.getValue() || this.isChanged() )
						element.setAttribute( 'value', this.getValue() );
				}
			},
				{
				id: 'cmbSelected',
				type: 'checkbox',
				label: editor.lang.checkboxAndRadio.selected,
				'default': '',
				accessKey: 'S',
				value: "checked",
				setup: function( element ) {
					this.setValue( element.getAttribute( 'checked' ) );
				},
				commit: function( element ) {
					if ( this.getValue() || this.isChanged() )
						element.setAttribute( 'checked', this.getValue() );
				}
			}
			]
		}
		]
	};
});
