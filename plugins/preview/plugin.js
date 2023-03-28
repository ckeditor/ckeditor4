/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Preview plugin.
 */

( function() {
	'use strict';

	var pluginName = 'preview';

	// Register a plugin named "preview".
	CKEDITOR.plugins.add( pluginName, {
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'preview,preview-rtl', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {
			editor.addCommand( pluginName, {
				modes: { wysiwyg: 1 },
				canUndo: false,
				readOnly: 1,
				exec: function() {
					CKEDITOR.plugins.preview.createPreview( editor );
				}
			} );
			editor.ui.addButton && editor.ui.addButton( 'Preview', {
				label: editor.lang.preview.preview,
				command: pluginName,
				toolbar: 'document,40'
			} );
		}
	} );

	/**
	 * Namespace providing a set of helper functions for working with the editor content preview, exposed by the
	 * [Preview](https://ckeditor.com/cke4/addon/preview) plugin.
	 *
	 * @since 4.14.0
	 * @singleton
	 * @class CKEDITOR.plugins.preview
	 */
	CKEDITOR.plugins.preview = {
		/**
		 * Generates the print preview for the given editor.
		 *
		 * **Note**: This function will open a new browser window with the editor's content HTML.
		 *
		 * @param {CKEDITOR.editor} editor The editor instance.
		 * @param {Function} [callback] The function that will be fired after preview window is loaded.
		 * @returns {CKEDITOR.dom.window} A newly created window that contains the preview HTML.
		 */
		createPreview: function( editor, callback ) {
			var previewHtml = createPreviewHtml( editor, callback ),
				eventData = { dataValue: previewHtml },
				windowDimensions = getWindowDimensions(),
				// For IE we should use window.location rather than setting url in window.open (https://dev.ckeditor.com/ticket/11146).
				previewLocation = getPreviewLocation(),
				nativePreviewWindow,
				previewWindow,
				doc;

			// (https://dev.ckeditor.com/ticket/9907) Allow data manipulation before preview is displayed.
			// Also don't open the preview window when event cancelled.
			if ( editor.fire( 'contentPreview', eventData ) === false ) {
				return false;
			}

			// In cases where we force reloading the location or setting concrete URL to open,
			// we need a way to pass content to the opened window. We do it by hack with
			// passing it through window's parent property.
			if ( previewLocation ) {
				window._cke_htmlToLoad = eventData.dataValue;
			}

			nativePreviewWindow = window.open( '', null, generateWindowOptions( windowDimensions ) );
			previewWindow = new CKEDITOR.dom.window( nativePreviewWindow );

			// For IE we want to assign whole js stored in previewLocation, but in case of
			// popup blocker activation oWindow variable will be null (https://dev.ckeditor.com/ticket/11597).
			if ( previewLocation && nativePreviewWindow ) {
				nativePreviewWindow.location = previewLocation;
			}

			if ( !window._cke_htmlToLoad ) {
				doc = nativePreviewWindow.document;

				doc.open();
				doc.write( eventData.dataValue );
				doc.close();
			}

			if ( callback ) {
				nativePreviewWindow.previewCallback = function() {
					// In several browsers (e.g. Safari or Chrome on Linux) print command
					// seems to be blocking loading of the preview page. Because of that
					// print must be performed after the document is complete.
					if ( nativePreviewWindow.document.readyState === 'complete' ) {
						callback( previewWindow );
					}
				};

				nativePreviewWindow.previewCallback();
			}

			return previewWindow;
		}
	};

	function createPreviewHtml( editor, callback ) {
		var pluginPath = CKEDITOR.plugins.getPath( 'preview' ),
			config = editor.config,
			title = editor.title,
			baseTag = generateBaseTag();

		if ( config.fullPage ) {
			return editor.getData().replace( /<head>/, '$&' + baseTag )
				.replace( /[^>]*(?=<\/title>)/, '$& &mdash; ' + title );
		}

		return config.docType + '<html dir="' + config.contentsLangDirection + '">' +
			'<head>' +
				baseTag +
				'<title>' + title + '</title>' +
				CKEDITOR.tools.buildStyleHtml( config.contentsCss ) +
				'<link rel="stylesheet" media="screen" href="' + pluginPath + 'styles/screen.css">' +
			'</head>' + createBodyHtml() +
				editor.getData() +
				setPrieviewCallback( callback ) +
			'</body></html>';

		function generateBaseTag() {
			if ( !config.baseHref ) {
				return '';
			}

			return '<base href="' + config.baseHref + '">';
		}

		function createBodyHtml() {
			var html = '<body>',
				body = editor.document && editor.document.getBody();

			if ( !body ) {
				return html;
			}

			if ( body.getAttribute( 'id' ) ) {
				html = html.replace( '>', ' id="' + body.getAttribute( 'id' ) + '">' );
			}

			if ( body.getAttribute( 'class' ) ) {
				html = html.replace( '>', ' class="' + body.getAttribute( 'class' ) + '">' );
			}

			return html;
		}

		function setPrieviewCallback( callback ) {
			if ( !callback ) {
				return '';
			}

			// On IE onreadystatechange does not change document.readyState to complete if there are any images in the content.
			// So we need introduce a two flows. One for IE and second for all other browsers. (#4790)
			var event = CKEDITOR.env.ie ? 'window.onload' : 'document.onreadystatechange';
			return '<script>' + event + ' = function() { previewCallback(); } </script>';
		}
	}

	function getWindowDimensions() {
		var screen = window.screen;

		return {
			width: Math.round( screen.width * 0.8 ),
			height: Math.round( screen.height * 0.7 ),
			left: Math.round( screen.width * 0.1 )
		};
	}

	function generateWindowOptions( dimensions ) {
		return [
			'toolbar=yes',
			'location=no',
			'status=yes',
			'menubar=yes',
			'scrollbars=yes',
			'resizable=yes',
			'width=' + dimensions.width,
			'height=' + dimensions.height,
			'left=' + dimensions.left
		].join( ',' );
	}

	function getPreviewLocation() {
		if ( !CKEDITOR.env.ie ) {
			return null;
		}

		return 'javascript:void( (function(){' + // jshint ignore:line
			'document.open();' +
			// Support for custom document.domain.
			// Strip comments and replace parent with window.opener in the function body.
			( '(' + CKEDITOR.tools.fixDomain + ')();' ).replace( /\/\/.*?\n/g, '' ).replace( /parent\./g, 'window.opener.' ) +
			'document.write( window.opener._cke_htmlToLoad );' +
			'document.close();' +
			'window.opener._cke_htmlToLoad = null;' +
		'})() )';
	}
} )();

/**
 * Event fired when executing the `preview` command that allows for additional data manipulation.
 * With this event, the raw HTML content of the preview window to be displayed can be altered
 * or modified.
 *
 * **Note** This event **should** also be used to sanitize HTML to mitigate possible XSS attacks. Refer to the
 * {@glink guide/dev_best_practices#validate-preview-content Validate preview content} section of the Best Practices
 * article to learn more.
 *
 * @event contentPreview
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param data
 * @param {String} data.dataValue The data that will go to the preview.
 */
