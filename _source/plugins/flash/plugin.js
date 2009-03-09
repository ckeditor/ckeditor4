/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'flash', {
	init: function( editor ) {
		var flash = CKEDITOR.plugins.flash,
			flashFilenameRegex = /\.swf(?:$|\?)/i,
			numberRegex = /^\d+(?:\.\d+)?$/;

		function cssifyLength( length ) {
			if ( numberRegex.test( length ) )
				return length + 'px';
			return length;
		}

		editor.addCommand( 'flash', new CKEDITOR.dialogCommand( 'flash' ) );
		editor.ui.addButton( 'Flash', {
			label: editor.lang.common.flash,
			command: 'flash'
		});
		CKEDITOR.dialog.add( 'flash', this.path + 'dialogs/flash.js' );

		editor.addCss( 'img.cke_flash' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/flashlogo.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 80px;' +
				'height: 80px;' +
			'}'
			);

		editor.on( 'contentDom', function() {
			var rawObjectNodes = editor.document.$.getElementsByTagName( CKEDITOR.env.ie ? 'object' : 'cke:object' );
			for ( var i = rawObjectNodes.length - 1, objectNode; i >= 0; i-- ) {
				objectNode = new CKEDITOR.dom.element( rawObjectNodes[ i ] );
				if ( String( objectNode.getAttribute( 'classid' ) ).toLowerCase() != 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' )
					continue;

				var fakeElement = editor.createFakeElement( objectNode, 'cke_flash', 'flash', true );
				if ( objectNode.getAttribute( 'width' ) != null )
					fakeElement.setStyle( 'width', cssifyLength( objectNode.getAttribute( 'width' ) ) );
				if ( objectNode.getAttribute( 'height' ) != null )
					fakeElement.setStyle( 'height', cssifyLength( objectNode.getAttribute( 'height' ) ) );
				fakeElement.replace( objectNode );
			}

			var rawEmbedNodes = editor.document.$.getElementsByTagName( CKEDITOR.env.ie ? 'embed' : 'cke:embed' );
			for ( var i = rawEmbedNodes.length - 1, embedNode; i >= 0; i-- ) {
				embedNode = new CKEDITOR.dom.element( rawEmbedNodes[ i ] );
				if ( embedNode.getAttribute( 'type' ) != 'application/x-shockwave-flash' && !flashFilenameRegex.test( embedNode.getAttribute( 'src' ) ) )
					continue;
				var fakeElement = editor.createFakeElement( embedNode, 'cke_flash', 'flash', true );
				if ( embedNode.getAttribute( 'width' ) != null )
					fakeElement.setStyle( 'width', cssifyLength( embedNode.getAttribute( 'width' ) ) );
				if ( embedNode.getAttribute( 'height' ) != null )
					fakeElement.setStyle( 'height', cssifyLength( embedNode.getAttribute( 'height' ) ) );
				fakeElement.replace( embedNode );
			}
		});

		// If the "menu" plugin is loaded, register the menu items.
		if ( editor.addMenuItems ) {
			editor.addMenuItems({
				flash: {
					label: editor.lang.flash.properties,
					command: 'flash',
					group: 'flash'
				}
			});
		}

		// If the "contextmenu" plugin is loaded, register the listeners.
		if ( editor.contextMenu ) {
			editor.contextMenu.addListener( function( element, selection ) {
				if ( element && element.is( 'img' ) && element.getAttribute( '_cke_real_element_type' ) == 'flash' )
					return { flash: CKEDITOR.TRISTATE_OFF };
			});
		}
	},

	requires: [ 'fakeobjects' ]
});

CKEDITOR.tools.extend( CKEDITOR.config, {
	flashUploadTab: true,
	flashUploadAction: 'nowhere.php',
	flashBrowseServer: true,

	/**
	 * Save as EMBED tag only. This tag is unrecommended.
	 * @type Boolean
	 * @default false
	 */
	flashEmbedTagOnly: false,

	/**
	 * Add EMBED tag as alternative: &lt;object&gt&lt;embed&gt&lt;/embed&gt&lt;/object&gt
	 * @type Boolean
	 * @default false
	 */
	flashAddEmbedTag: true,

	/**
	 * Use embedTagOnly and addEmbedTag values on edit.
	 * @type Boolean
	 * @default false
	 */
	flashConvertOnEdit: false
});
