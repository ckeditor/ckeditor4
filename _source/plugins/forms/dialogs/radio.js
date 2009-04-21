/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'radio', function( editor ) {
	return {
		title: editor.lang.checkboxAndRadio.radioTitle,
		minWidth: 350,
		minHeight: 130,
		onShow: function() {
			var element = this.getParentEditor().getSelection().getSelectedElement();
			if ( element && element.getName() == "input" && element.getAttribute( 'type' ) == "radio" ) {
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
				element.setAttribute( 'type', 'radio' );
			}

			if ( isInsertMode )
				editor.insertElement( element );
			this.commitContent({ element: element } );
		},
		contents: [
			{
			id: 'info',
			label: editor.lang.checkboxAndRadio.radioTitle,
			title: editor.lang.checkboxAndRadio.radioTitle,
			elements: [
				{
				id: 'name',
				type: 'text',
				label: editor.lang.common.name,
				'default': '',
				accessKey: 'N',
				setup: function( element ) {
					this.setValue( element.getAttribute( '_cke_saved_name' ) || '' );
				},
				commit: function( data ) {
					var element = data.element;

					if ( this.getValue() )
						element.setAttribute( '_cke_saved_name', this.getValue() );
					else {
						element.removeAttribute( '_cke_saved_name' );
						element.removeAttribute( 'name' );
					}
				}
			},
				{
				id: 'value',
				type: 'text',
				label: editor.lang.checkboxAndRadio.value,
				'default': '',
				accessKey: 'V',
				setup: function( element ) {
					this.setValue( element.getAttribute( 'value' ) || '' );
				},
				commit: function( data ) {
					var element = data.element;

					if ( this.getValue() )
						element.setAttribute( 'value', this.getValue() );
					else
						element.removeAttribute( 'value' );
				}
			},
				{
				id: 'checked',
				type: 'checkbox',
				label: editor.lang.checkboxAndRadio.selected,
				'default': '',
				accessKey: 'S',
				value: "checked",
				setup: function( element ) {
					this.setValue( element.getAttribute( 'checked' ) );
				},
				commit: function( data ) {
					var element = data.element;

					if ( !CKEDITOR.env.ie ) {
						if ( this.getValue() )
							element.setAttribute( 'checked', 'checked' );
						else
							element.removeAttribute( 'checked' );
					} else {
						var isElementChecked = element.getAttribute( 'checked' );
						var isChecked = !!this.getValue();

						if ( isElementChecked != isChecked ) {
							var replace = CKEDITOR.dom.element.createFromHtml( '<input type="radio"' + ( isChecked ? ' checked="checked"' : '' )
																			+ '></input>', editor.document );
							element.copyAttributes( replace, { type:1,checked:1 } );
							replace.replace( element );
							editor.getSelection().selectElement( replace );
							data.element = replace;
						}
					}
				}
			}
			]
		}
		]
	};
});
