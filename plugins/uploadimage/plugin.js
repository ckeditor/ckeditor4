/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
'use strict';

( function() {
	CKEDITOR.plugins.add( 'uploadimage', {
		requires: 'widget,clipboard,uploadmanager',
		lang: 'en', // %REMOVE_LINE_CORE%
		init: function( editor ) {
			var manager = new CKEDITOR.plugins.uploadmanager.manager();
			manager.url = editor.config.filebrowserImageUploadUrl;

			editor.filter.allow( 'img[data-widget]' );

			editor.widgets.add( 'uploadimage', {
				parts: {
					img: 'img'
				},

				downcast: function() {
					return new CKEDITOR.htmlParser.text( '' );
				},

				init: function() {
					console.log( 'init' );
					var upload = manager.getUpload( this.parts.img.data( 'cke-upload-id' ) );

					upload.on( 'updateStatus', function() {
						console.log( upload.data );
					} );
				}
			} );

			editor.on( 'paste', function( evt ) {
				var data = evt.data,
					dataTransfer = data.dataTransfer,
					filesCount = dataTransfer.getFilesCount(),
					file, i;

				if ( data.dataValue || !filesCount ) {
					return;
				}

				dataTransfer.cacheData();

				for ( i = 0; i < filesCount; i++ ) {
					file = dataTransfer.getFile( i );

					var upload = manager.startUpload( file ),
						img = new CKEDITOR.dom.element( 'img' );

					img.setAttributes( {
						'src': 'foo', //data:black rectangle,
						'data-cke-upload-id': upload.id,
						'data-widget': 'uploadimage'
					} );
					data.dataValue += img.getOuterHtml();
				}
			} );

			editor.on( 'paste', function( evt ) {
				var data = evt.data;

				var temp = new CKEDITOR.dom.element( 'div' ),
					imgs, img, i;
				temp.appendHtml( data.dataValue );
				imgs = temp.find( 'img' );

				for ( i = 0; i < imgs.count(); i++ ) {
					img = imgs.getItem( i );

					var isDataInSrc = img.getAttribute( 'src' ) && img.getAttribute( 'src' ).substring( 0, 5 ) == 'data:';
					if ( !img.data( 'cke-upload-id' ) && !inEditableBlock( img ) && isDataInSrc ) {
						var upload = manager.startUpload( img.getAttribute( 'src' ) );

						img.setAttributes( {
							'data-cke-upload-id': upload.id
						} );
					}
				}

				data.dataValue = temp.getHtml();

				function inEditableBlock( element ) {
					while ( element ) {
						if ( element.data( 'cke-editable' ) )
							return true;
						if ( element.getAttribute( 'contentEditable' ) == 'false' )
							return false;
						if ( element.getAttribute( 'contentEditable' ) == 'true' )
							return true;

						element = element.getParent();
					}

					return true;
				}
			} );
		}
	} );
} )();