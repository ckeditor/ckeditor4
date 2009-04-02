/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.dialog.add( 'form', function( editor ) {
	return {
		title: editor.lang.form.title,
		minWidth: 350,
		minHeight: 190,
		onShow: function() {
			var element = this.getParentEditor().getSelection().getSelectedElement();
			if ( element && element.getName() == "form" ) {
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
				element = editor.document.createElement( 'form' );
				element.append( editor.document.createElement( 'br' ) );
			}
			this.commitContent( element );

			if ( isInsertMode )
				editor.insertElement( element );
		},
		contents: [
			{
			id: 'info',
			label: editor.lang.form.title,
			title: editor.lang.form.title,
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
				id: 'txtAction',
				type: 'text',
				label: editor.lang.form.action,
				'default': '',
				accessKey: 'A',
				setup: function( element ) {
					this.setValue( element.getAttribute( 'action' ) );
				},
				commit: function( element ) {
					if ( this.getValue() || this.isChanged() )
						element.setAttribute( 'action', this.getValue() );
				}
			},
				{
				type: 'hbox',
				widths: [ '45%', '55%' ],
				children: [
					{
					id: 'txtId',
					type: 'text',
					label: editor.lang.common.id,
					'default': '',
					accessKey: 'I',
					setup: function( element ) {
						this.setValue( element.getAttribute( 'id' ) );
					},
					commit: function( element ) {
						if ( this.getValue() || this.isChanged() )
							element.setAttribute( 'id', this.getValue() );
					}
				},
					{
					id: 'cmbEncoding',
					type: 'select',
					label: editor.lang.form.encoding,
					style: 'width:100%',
					accessKey: 'E',
					'default': '',
					items: [
						[ '' ],
						[ 'text/plain' ],
						[ 'multipart/form-data' ],
						[ 'application/x-www-form-urlencoded' ]
						],
					setup: function( element ) {
						this.setValue( element.getAttribute( 'encoding' ) );
					},
					commit: function( element ) {
						if ( this.getValue() || this.isChanged() )
							element.setAttribute( 'encoding', this.getValue() );
					}
				}
				]
			},
				{
				type: 'hbox',
				widths: [ '45%', '55%' ],
				children: [
					{
					id: 'cmbTarget',
					type: 'select',
					label: editor.lang.form.target,
					style: 'width:100%',
					accessKey: 'M',
					'default': '',
					items: [
						[ editor.lang.form.targetNotSet, '' ],
						[ editor.lang.form.targetNew, '_blank' ],
						[ editor.lang.form.targetTop, '_top' ],
						[ editor.lang.form.targetSelf, '_self' ],
						[ editor.lang.form.targetParent, '_parent' ]
						],
					setup: function( element ) {
						this.setValue( element.getAttribute( 'target' ) );
					},
					commit: function( element ) {
						if ( this.getValue() || this.isChanged() )
							element.setAttribute( 'target', this.getValue() );
					}
				},
					{
					id: 'cmbMethod',
					type: 'select',
					label: editor.lang.form.method,
					accessKey: 'M',
					'default': 'GET',
					items: [
						[ 'GET', 'get' ],
						[ 'POST', 'post' ]
						],
					setup: function( element ) {
						this.setValue( element.getAttribute( 'method' ) );
					},
					commit: function( element ) {
						element.setAttribute( 'method', this.getValue() );
					}
				}
				]
			}
			]
		}
		]
	};
});
