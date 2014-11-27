/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.dialog.add( 'anchor', function( editor ) {
	// Function called in onShow to load selected element.
	var loadElements = function( element ) {
			this._.selectedElement = element;

			var attributeValue = element.data( 'cke-saved-name' );
			this.setValueOf( 'info', 'txtName', attributeValue || '' );
		};

	function createFakeAnchor( editor, attributes ) {
		return editor.createFakeElement( editor.document.createElement( 'a', {
			attributes: attributes
		} ), 'cke_anchor', 'anchor' );
	}

	return {
		title: editor.lang.link.anchor.title,
		minWidth: 300,
		minHeight: 60,
		onOk: function() {
			var name = CKEDITOR.tools.trim( this.getValueOf( 'info', 'txtName' ) );
			var attributes = {
				id: name,
				name: name,
				'data-cke-saved-name': name
			};

			if ( this._.selectedElement ) {
				if ( this._.selectedElement.data( 'cke-realelement' ) ) {
					var newFake = createFakeAnchor( editor, attributes );
					newFake.replace( this._.selectedElement );

					// Selecting fake element for IE. (#11377)
					if ( CKEDITOR.env.ie )
						editor.getSelection().selectElement( newFake );
				} else {
					this._.selectedElement.setAttributes( attributes );
				}
			} else {
				var sel = editor.getSelection(),
					range = sel && sel.getRanges()[ 0 ];

				// Empty anchor
				if ( range.collapsed ) {
					var anchor = createFakeAnchor( editor, attributes );
					range.insertNode( anchor );
				} else {
					if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
						attributes[ 'class' ] = 'cke_anchor';

					// Apply style.
					var style = new CKEDITOR.style( { element: 'a', attributes: attributes } );
					style.type = CKEDITOR.STYLE_INLINE;
					editor.applyStyle( style );
				}
			}
		},

		onHide: function() {
			delete this._.selectedElement;
		},

		onShow: function() {
			var sel = editor.getSelection(),
				fullySelected = sel.getSelectedElement(),
				fakeSelected = fullySelected && fullySelected.data( 'cke-realelement' ),
				linkElement = fakeSelected ?
					CKEDITOR.plugins.link.tryRestoreFakeAnchor( editor, fullySelected ) :
					CKEDITOR.plugins.link.getSelectedLink( editor );

			if ( linkElement ) {
				loadElements.call( this, linkElement );
				!fakeSelected && sel.selectElement( linkElement );

				if ( fullySelected )
					this._.selectedElement = fullySelected;
			}

			this.getContentElement( 'info', 'txtName' ).focus();
		},
		contents: [ {
			id: 'info',
			label: editor.lang.link.anchor.title,
			accessKey: 'I',
			elements: [ {
				type: 'text',
				id: 'txtName',
				label: editor.lang.link.anchor.name,
				required: true,
				validate: function() {
					if ( !this.getValue() ) {
						alert( editor.lang.link.anchor.errorName ); // jshint ignore:line
						return false;
					}
					return true;
				}
			} ]
		} ]
	};
} );
