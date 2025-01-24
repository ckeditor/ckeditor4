/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

CKEDITOR.dialog.add( 'form', function( editor ) {
	var autoAttributes = { action: 1, id: 1, method: 1, enctype: 1, target: 1 };

	return {
		title: editor.lang.forms.form.title,
		minWidth: 350,
		minHeight: 200,
		getModel: function( editor ) {
			return editor.elementPath().contains( 'form', 1 ) || null;
		},
		onShow: function() {
			var form = this.getModel( this.getParentEditor() );

			if ( form ) {
				this.setupContent( form );
			}
		},
		onOk: function() {
			var editor = this.getParentEditor(),
				element = this.getModel( editor );

			if ( !element ) {
				element = editor.document.createElement( 'form' );
				element.appendBogus();
				editor.insertElement( element );
			}

			this.commitContent( element );
		},
		onLoad: function() {
			function autoSetup( element ) {
				this.setValue( element.getAttribute( this.id ) || '' );
			}

			function autoCommit( element ) {
				if ( this.getValue() )
					element.setAttribute( this.id, this.getValue() );
				else
					element.removeAttribute( this.id );
			}

			this.foreach( function( contentObj ) {
				if ( autoAttributes[ contentObj.id ] ) {
					contentObj.setup = autoSetup;
					contentObj.commit = autoCommit;
				}
			} );
		},
		contents: [ {
			id: 'info',
			label: editor.lang.forms.form.title,
			title: editor.lang.forms.form.title,
			elements: [ {
				id: 'txtName',
				bidi: true,
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
				id: 'action',
				type: 'text',
				label: editor.lang.forms.form.action,
				'default': '',
				accessKey: 'T'
			},
			{
				type: 'hbox',
				widths: [ '45%', '55%' ],
				children: [ {
					id: 'id',
					type: 'text',
					label: editor.lang.common.id,
					'default': '',
					accessKey: 'I'
				},
				{
					id: 'enctype',
					type: 'select',
					label: editor.lang.forms.form.encoding,
					style: 'width:100%',
					accessKey: 'E',
					'default': '',
					items: [
						[ '' ],
						[ 'text/plain' ],
						[ 'multipart/form-data' ],
						[ 'application/x-www-form-urlencoded' ]
					]
				} ]
			},
			{
				type: 'hbox',
				widths: [ '45%', '55%' ],
				children: [ {
					id: 'target',
					type: 'select',
					label: editor.lang.common.target,
					style: 'width:100%',
					accessKey: 'M',
					'default': '',
					items: [
						[ editor.lang.common.notSet, '' ],
						[ editor.lang.common.targetNew, '_blank' ],
						[ editor.lang.common.targetTop, '_top' ],
						[ editor.lang.common.targetSelf, '_self' ],
						[ editor.lang.common.targetParent, '_parent' ]
					]
				},
				{
					id: 'method',
					type: 'select',
					label: editor.lang.forms.form.method,
					accessKey: 'M',
					'default': 'GET',
					items: [
						[ 'GET', 'get' ],
						[ 'POST', 'post' ]
					]
				} ]
			} ]
		} ]
	};
} );
