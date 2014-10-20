/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
'use strict';

( function() {
	CKEDITOR.plugins.add( 'uploadwidget', {
		requires: 'widget,clipboard,filetools',

		init: function( editor ) {
			editor.filter.allow( '*[!data-widget,!data-cke-upload-id]' );
		}
	} );

	function addUploadWidget( editor, name, def ) {
		var filetools = CKEDITOR.filetools,
			uploads = editor.uploadsRepository,
			// Plugins which support all file type has lower priority then plugins which support specific types.
			priority = def.supportedExtentions ? 10 : 20;

		if ( def.fileToElement ) {
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

					if ( filetools.isExtentionSupported( file, def.supportedExtentions ) ) {
						var el = def.fileToElement( file ),
							loader = uploads.create( file );

						if ( el ) {
							loader.loadAndUpload( def.uploadUrl );

							markElement( el, name, loader.id );

							data.dataValue += el.getOuterHtml();
						}
					}
				}
			}, null, null, priority );
		}

		CKEDITOR.tools.extend( def, {
			downcast: function() {
				return new CKEDITOR.htmlParser.text( '' );
			},

			init: function() {
				var widget = this,
					id = this.wrapper.findOne( '[data-cke-upload-id]' ).data( 'cke-upload-id' ),
					loader = uploads.get( id );

				loader.on( 'update', function( evt ) {
					if ( !widget.wrapper || !widget.wrapper.getParent() ) {
						if ( !editor.editable().find( '[data-cke-upload-id="' + id + '"]' ).count() ) {
							loader.abort();
						}
						evt.removeListener();
						return;
					}

					editor.fire( 'lockSnapshot' );

					console.log( loader.status );
					if ( typeof widget[ 'on' + loader.status ] === 'function' ) {
						if ( widget[ 'on' + loader.status ]( loader ) === false ) {
							return;
						}
					}

					if ( loader.status == 'error' || loader.status == 'abort' ) {
						console.log( loader.message );
						editor.widgets.del( widget );
					}

					editor.fire( 'unlockSnapshot' );
				} );

				loader.update();
			},

			replaceWith: function( html ) {
				var processedHtml = editor.dataProcessor.toHtml( html, { context: this.wrapper.getParent().getName() } ),
					el = CKEDITOR.dom.element.createFromHtml( processedHtml );

				el.replace( this.wrapper );

				editor.widgets.checkWidgets( { initOnlyNew: true } );

				// Ensure that old widgets instance will be removed.
				// If this init is because of paste then checkWidgets will not remove it.
				editor.widgets.destroy( this, true );
			}
		} );

		editor.widgets.add( name, def );
	}

	function markElement( element, widgetName, loaderId  ) {
		element.setAttributes( {
			'data-cke-upload-id': loaderId,
			'data-widget': widgetName
		} );
	}

	if ( !CKEDITOR.filetools ) {
		CKEDITOR.filetools = {};
	}

	CKEDITOR.tools.extend( CKEDITOR.filetools, {
		addUploadWidget: addUploadWidget,
		markElement: markElement
	} );
} )();