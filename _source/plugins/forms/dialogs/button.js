/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'button', function( editor ) {
	return {
		title: editor.lang.button.title,
		minWidth: 400,
		minHeight: 230,
		onShow: function() {
			// IE BUG: Selection must be in the editor for getSelectedElement()
			// to work.
			this.restoreSelection();

			var element = this.getParentEditor().getSelection().getSelectedElement();
			if ( element && element.getName() == "input" ) {
				var type = element.getAttribute( 'type' );
				if ( type == "button" || type == "reset" || type == "submit" ) {
					this._element = element;
					this.setupContent( element );
				}
			}
		},
		onOk: function() {
			var editor,
				element = this._element,
				isInsertMode = !element;

			if ( isInsertMode ) {
				editor = this.getParentEditor();
				element = editor.document.createElement( 'input' );
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
			label: editor.lang.button.title,
			title: editor.lang.button.title,
			elements: [
				{
				id: 'txtName',
				type: 'text',
				label: editor.lang.common.name,
				'default': '',
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
				label: editor.lang.button.text,
				accessKey: 'V',
				'default': '',
				setup: function( element ) {
					this.setValue( element.getAttribute( 'value' ) );
				},
				commit: function( element ) {
					if ( this.getValue() != '' || this.isChanged() )
						element.setAttribute( 'value', this.getValue() );
				}
			},
				{
				id: 'txtType',
				type: 'select',
				label: editor.lang.button.type,
				'default': 'button',
				accessKey: 'T',
				items: [
					[ editor.lang.button.typeBtn, 'button' ],
					[ editor.lang.button.typeSbm, 'submit' ],
					[ editor.lang.button.typeRst, 'reset' ]
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
