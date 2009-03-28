/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'hiddenfield', function( editor ) {
	return {
		title: editor.lang.hidden.title,
		minWidth: 350,
		minHeight: 110,
		onShow: function() {
			// IE BUG: Selection must be in the editor for getSelectedElement()
			// to work.
			this.restoreSelection();

			var element = this.getParentEditor().getSelection().getSelectedElement();
			if ( element && element.getName() == "input" && element.getAttribute( 'type' ) == "checkbox" ) {
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
				element.setAttribute( 'type', 'hidden' );
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
			label: editor.lang.hidden.title,
			title: editor.lang.hidden.title,
			elements: [
				{
				id: 'txtName',
				type: 'text',
				label: editor.lang.hidden.name,
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
				label: editor.lang.hidden.value,
				'default': '',
				accessKey: 'V',
				setup: function( element ) {
					this.setValue( element.getAttribute( 'value' ) );
				},
				commit: function( element ) {
					if ( this.getValue() || this.isChanged() )
						element.setAttribute( 'value', this.getValue() );
				}
			}
			]
		}
		]
	};
});
