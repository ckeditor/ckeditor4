﻿/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview The Image plugin.
 */

( function() {

	CKEDITOR.plugins.add( 'image', {
		requires: 'dialog',
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'image', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {
			var pluginName = 'image';

			// Abort when Easyimage or Image2 are to be loaded since this plugins
			// share the same functionality (#1791).
			if ( editor.plugins.detectConflict( pluginName, [ 'easyimage', 'image2' ] ) ) {
				return;
			}

			// Register the dialog.
			CKEDITOR.dialog.add( pluginName, this.path + 'dialogs/image.js' );

			var allowed = 'img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}',
				required = 'img[alt,src]';

			if ( CKEDITOR.dialog.isTabEnabled( editor, pluginName, 'advanced' ) )
				allowed = 'img[alt,dir,id,lang,longdesc,!src,title]{*}(*)';

			// Register the command.
			editor.addCommand( pluginName, new CKEDITOR.dialogCommand( pluginName, {
				allowedContent: allowed,
				requiredContent: required,
				contentTransformations: [
					[ 'img{width}: sizeToStyle', 'img[width]: sizeToAttribute' ],
					[ 'img{float}: alignmentToStyle', 'img[align]: alignmentToAttribute' ]
				]
			} ) );

			// Register the toolbar button.
			editor.ui.addButton && editor.ui.addButton( 'Image', {
				label: editor.lang.common.image,
				command: pluginName,
				toolbar: 'insert,10'
			} );

			editor.on( 'doubleclick', function( evt ) {
				var element = evt.data.element;

				if ( element.is( 'img' ) && !element.data( 'cke-realelement' ) && !element.isReadOnly() )
					evt.data.dialog = 'image';
			} );

			// If the "menu" plugin is loaded, register the menu items.
			if ( editor.addMenuItems ) {
				editor.addMenuItems( {
					image: {
						label: editor.lang.image.menu,
						command: 'image',
						group: 'image'
					}
				} );
			}

			// If the "contextmenu" plugin is loaded, register the listeners.
			if ( editor.contextMenu ) {
				editor.contextMenu.addListener( function( element ) {
					if ( getSelectedImage( editor, element ) )
						return { image: CKEDITOR.TRISTATE_OFF };
				} );
			}
		},
		afterInit: function( editor ) {
			// Abort when Image2 is to be loaded since both plugins
			// share the same button, command, etc. names (https://dev.ckeditor.com/ticket/11222).
			if ( editor.plugins.image2 )
				return;

			// Customize the behavior of the alignment commands. (https://dev.ckeditor.com/ticket/7430)
			setupAlignCommand( 'left' );
			setupAlignCommand( 'right' );
			setupAlignCommand( 'center' );
			setupAlignCommand( 'block' );

			function setupAlignCommand( value ) {
				var command = editor.getCommand( 'justify' + value );
				if ( command ) {
					if ( value == 'left' || value == 'right' ) {
						command.on( 'exec', function( evt ) {
							var img = getSelectedImage( editor ),
								align;
							if ( img ) {
								align = getImageAlignment( img );
								if ( align == value ) {
									img.removeStyle( 'float' );

									// Remove "align" attribute when necessary.
									if ( value == getImageAlignment( img ) )
										img.removeAttribute( 'align' );
								} else {
									img.setStyle( 'float', value );
								}

								evt.cancel();
							}
						} );
					}

					command.on( 'refresh', function( evt ) {
						var img = getSelectedImage( editor ),
							align;
						if ( img ) {
							align = getImageAlignment( img );

							this.setState(
							( align == value ) ? CKEDITOR.TRISTATE_ON : ( value == 'right' || value == 'left' ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED );

							evt.cancel();
						}
					} );
				}
			}
		}
	} );

	function getSelectedImage( editor, element ) {
		if ( !element ) {
			var sel = editor.getSelection();
			element = sel.getSelectedElement();
		}

		if ( element && element.is( 'img' ) && !element.data( 'cke-realelement' ) && !element.isReadOnly() )
			return element;
	}

	function getImageAlignment( element ) {
		var align = element.getStyle( 'float' );

		if ( align == 'inherit' || align == 'none' )
			align = 0;

		if ( !align )
			align = element.getAttribute( 'align' );

		return align;
	}

} )();

/**
 * Determines whether dimension inputs should be automatically filled when the image URL changes in the Image plugin dialog window.
 *
 *		config.image_prefillDimensions = false;
 *
 * @since 4.5.0
 * @cfg {Boolean} [image_prefillDimensions=true]
 * @member CKEDITOR.config
 */

/**
 * Whether to remove links when emptying the link URL field in the Image dialog window.
 *
 *		config.image_removeLinkByEmptyURL = false;
 *
 * @cfg {Boolean} [image_removeLinkByEmptyURL=true]
 * @member CKEDITOR.config
 */
CKEDITOR.config.image_removeLinkByEmptyURL = true;

/**
 * Padding text to set off the image in the preview area.
 *
 *		config.image_previewText = CKEDITOR.tools.repeat( '___ ', 100 );
 *
 * @cfg {String} [image_previewText='Lorem ipsum dolor...' (placeholder text)]
 * @member CKEDITOR.config
 */
