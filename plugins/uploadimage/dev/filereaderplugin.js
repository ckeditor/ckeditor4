/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
'use strict';

( function() {
	CKEDITOR.plugins.add( 'filereader', {
		requires: 'uploadwidget',
		init: function( editor ) {
			var filetools = CKEDITOR.filetools;

			filetools.addUploadWidget( editor, 'filereader', {
				onloaded: function( upload ) {
					var data = upload.data;
					if ( data && data.indexOf( ',' ) >= 0 && data.indexOf( ',' ) < data.length - 1 ) {
						this.replaceWith( atob( upload.data.split( ',' )[ 1 ] ) );
					} else {
						editor.widgets.del( this );
					}
				},
			} );

			editor.on( 'paste', function( evt ) {
				var data = evt.data,
					dataTransfer = data.dataTransfer,
					filesCount = dataTransfer.getFilesCount(),
					file, i;

				if ( data.dataValue || !filesCount ) {
					return;
				}

				for ( i = 0; i < filesCount; i++ ) {
					file = dataTransfer.getFile( i );

					if ( filetools.isExtentionSupported( file, 'txt,html,htm' ) ) {
						var el = new CKEDITOR.dom.element( 'span' ),
							loader = editor.uploadsRepository.create( file );

						el.setText( '...' );

						loader.load();

						filetools.markElement( el, 'filereader', loader.id );

						data.dataValue += el.getOuterHtml();
					}
				}
			} );
		}
	} );
} )();
