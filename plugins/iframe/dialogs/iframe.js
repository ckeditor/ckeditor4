/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	// Map 'true' and 'false' values to match W3C's specifications
	// http://www.w3.org/TR/REC-html40/present/frames.html#h-16.5
	var checkboxValues = {
		scrolling: { 'true': 'yes', 'false': 'no' },
		frameborder: { 'true': '1', 'false': '0' },
		tabindex: { 'true': '-1', 'false': false }
	};

	function loadValue( iframeNode ) {
		var isCheckbox = this instanceof CKEDITOR.ui.dialog.checkbox;
		if ( iframeNode.hasAttribute( this.id ) ) {
			var value = iframeNode.getAttribute( this.id );
			if ( isCheckbox )
				this.setValue( checkboxValues[ this.id ][ 'true' ] == value.toLowerCase() );
			else
				this.setValue( value );
		}
	}

	function commitValue( iframeNode ) {
		var value = this.getValue(),
			attributeName = this.att || this.id,
			isCheckbox = this instanceof CKEDITOR.ui.dialog.checkbox,
			attributeValue = isCheckbox ? checkboxValues[ this.id ][ value ] : value,
			isRemove = value === '' || ( attributeName === 'tabindex' && value === false );

		if ( isRemove ) {
			iframeNode.removeAttribute( attributeName );
		} else {
			iframeNode.setAttribute( attributeName, attributeValue );
		}
	}

	CKEDITOR.dialog.add( 'iframe', function( editor ) {
		var iframeLang = editor.lang.iframe,
			commonLang = editor.lang.common,
			dialogadvtab = editor.plugins.dialogadvtab;
		return {
			title: iframeLang.title,
			minWidth: 350,
			minHeight: 260,
			getModel: function( editor ) {
				var element = editor.getSelection().getSelectedElement();

				if ( element && element.data( 'cke-real-element-type' ) === 'iframe' ) {
					return element;
				}

				return null;
			},
			onShow: function() {
				// Clear previously saved elements.
				this.fakeImage = this.iframeNode = null;

				var fakeImage = this.getSelectedElement();
				if ( fakeImage && fakeImage.data( 'cke-real-element-type' ) && fakeImage.data( 'cke-real-element-type' ) == 'iframe' ) {
					this.fakeImage = fakeImage;

					var iframeNode = editor.restoreRealElement( fakeImage );
					this.iframeNode = iframeNode;

					this.setupContent( iframeNode );
				}
			},
			onOk: function() {
				var iframeNode;
				if ( !this.fakeImage )
					iframeNode = new CKEDITOR.dom.element( 'iframe' );
				else
					iframeNode = this.iframeNode;

				// A subset of the specified attributes/styles
				// should also be applied on the fake element to
				// have better visual effect. (https://dev.ckeditor.com/ticket/5240)
				var extraStyles = {},
					extraAttributes = {};
				this.commitContent( iframeNode, extraStyles, extraAttributes );

				var attributes = editor.plugins.iframe._.getIframeAttributes( editor, iframeNode );

				iframeNode.setAttributes( attributes );

				// Refresh the fake image.
				var newFakeImage = editor.createFakeElement( iframeNode, 'cke_iframe', 'iframe', true );
				newFakeImage.setAttributes( extraAttributes );
				newFakeImage.setStyles( extraStyles );
				if ( this.fakeImage ) {
					newFakeImage.replace( this.fakeImage );
					editor.getSelection().selectElement( newFakeImage );
				} else {
					editor.insertElement( newFakeImage );
				}
			},
			contents: [ {
				id: 'info',
				label: commonLang.generalTab,
				accessKey: 'I',
				elements: [ {
					type: 'vbox',
					padding: 0,
					children: [ {
						id: 'src',
						type: 'text',
						label: commonLang.url,
						required: true,
						validate: CKEDITOR.dialog.validate.notEmpty( iframeLang.noUrl ),
						setup: loadValue,
						commit: commitValue
					} ]
				},
				{
					type: 'hbox',
					children: [ {
						id: 'width',
						type: 'text',
						requiredContent: 'iframe[width]',
						style: 'width:100%',
						labelLayout: 'vertical',
						label: commonLang.width,
						validate: CKEDITOR.dialog.validate.htmlLength( commonLang.invalidHtmlLength.replace( '%1', commonLang.width ) ),
						setup: loadValue,
						commit: commitValue
					},
					{
						id: 'height',
						type: 'text',
						requiredContent: 'iframe[height]',
						style: 'width:100%',
						labelLayout: 'vertical',
						label: commonLang.height,
						validate: CKEDITOR.dialog.validate.htmlLength( commonLang.invalidHtmlLength.replace( '%1', commonLang.height ) ),
						setup: loadValue,
						commit: commitValue
					},
					{
						id: 'align',
						type: 'select',
						requiredContent: 'iframe[align]',
						'default': '',
						items: [
							[ commonLang.notSet, '' ],
							[ commonLang.left, 'left' ],
							[ commonLang.right, 'right' ],
							[ commonLang.alignTop, 'top' ],
							[ commonLang.alignMiddle, 'middle' ],
							[ commonLang.alignBottom, 'bottom' ]
						],
						style: 'width:100%',
						labelLayout: 'vertical',
						label: commonLang.align,
						setup: function( iframeNode, fakeImage ) {
							loadValue.apply( this, arguments );
							if ( fakeImage ) {
								var fakeImageAlign = fakeImage.getAttribute( 'align' );
								this.setValue( fakeImageAlign && fakeImageAlign.toLowerCase() || '' );
							}
						},
						commit: function( iframeNode, extraStyles, extraAttributes ) {
							commitValue.apply( this, arguments );
							if ( this.getValue() )
								extraAttributes.align = this.getValue();
						}
					} ]
				},
				{
					type: 'hbox',
					widths: [ '33%', '33%', '33%' ],
					children: [ {
						id: 'scrolling',
						type: 'checkbox',
						requiredContent: 'iframe[scrolling]',
						label: iframeLang.scrolling,
						setup: loadValue,
						commit: commitValue
					},
					{
						id: 'frameborder',
						type: 'checkbox',
						requiredContent: 'iframe[frameborder]',
						label: iframeLang.border,
						setup: loadValue,
						commit: commitValue
					},
					{
						id: 'tabindex',
						type: 'checkbox',
						requiredContent: 'iframe[tabindex]',
						label: iframeLang.tabindex,
						setup: loadValue,
						commit: commitValue
					} ]
				},
				{
					type: 'hbox',
					widths: [ '50%', '50%' ],
					children: [ {
						id: 'name',
						type: 'text',
						requiredContent: 'iframe[name]',
						label: commonLang.name,
						setup: loadValue,
						commit: commitValue
					},
					{
						id: 'title',
						type: 'text',
						requiredContent: 'iframe[title]',
						label: commonLang.advisoryTitle,
						setup: loadValue,
						commit: commitValue
					} ]
				},
				{
					id: 'longdesc',
					type: 'text',
					requiredContent: 'iframe[longdesc]',
					label: commonLang.longDescr,
					setup: loadValue,
					commit: commitValue
				} ]
			},
			dialogadvtab && dialogadvtab.createAdvancedTab( editor, { id: 1, classes: 1, styles: 1 }, 'iframe' )
		] };
	} );
} )();
