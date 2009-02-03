/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The "wysiwygarea" plugin. It registers the "wysiwyg" editing
 *		mode, which handles the main editing area space.
 */

(function() {
	// Matches all self-closing tags that are not defined as empty elements in
	// the DTD (like &lt;span/&gt;).
	var invalidSelfCloseTagsRegex = /(<(?!br|hr|base|meta|link|param|img|area|input|col)([a-zA-Z0-9:]+)[^>]*)\/>/gi;

	// #### protectEvents - START

	// Matches all tags that have event attributes (onXYZ).
	var tagsWithEventRegex = /<[^\>]+ on\w+\s*=[\s\S]+?\>/g;

	// Matches all event attributes.
	var eventAttributesRegex = /\s(on\w+)(?=\s*=\s*?('|")[\s\S]*?\2)/g;

	// Matches the protected attribute prefix.
	var protectedEventsRegex = /_cke_pa_/g;

	var protectEvents = function( html ) {
			return html.replace( tagsWithEventRegex, protectEvents_ReplaceTags );
		};

	var protectEvents_ReplaceTags = function( tagMatch ) {
			// Appends the "_cke_pa_" prefix to the event name.
			return tagMatch.replace( eventAttributesRegex, ' _cke_pa_$1' );
		};

	var protectEventsRestore = function( html ) {
			return html.replace( protectedEventsRegex, '' );
		};

	// #### protectEvents - END

	// #### protectAttributes - START

	// TODO: Clean and simplify these regexes.
	var protectUrlTagRegex = /<(?:a|area|img)(?=\s).*?\s(?:href|src)=((?:(?:\s*)("|').*?\2)|(?:[^"'][^ >]+))/gi,
		protectUrlAttributeRegex = /\s(href|src)(\s*=\s*?('|")[\s\S]*?\3)/gi;

	var protectUrls = function( html ) {
			return html.replace( protectUrlTagRegex, protectUrls_ReplaceTags );
		};

	var protectUrls_ReplaceTags = function( tagMatch ) {
			return tagMatch.replace( protectUrlAttributeRegex, '$& _cke_saved_$1$2' );
		};

	// #### protectAttributes - END

	var onInsertHtml = function( evt ) {
			if ( this.mode == 'wysiwyg' ) {
				var $doc = this.document.$;

				if ( CKEDITOR.env.ie )
					$doc.selection.createRange().pasteHTML( evt.data );
				else
					$doc.execCommand( 'inserthtml', false, evt.data );
			}
		};

	var onInsertElement = function( evt ) {
			if ( this.mode == 'wysiwyg' ) {
				var element = evt.data,
					isBlock = CKEDITOR.dtd.$block[ element.getName() ];

				var selection = this.getSelection(),
					ranges = selection.getRanges();

				var range, clone, lastElement, bookmark;

				for ( var i = ranges.length - 1; i >= 0; i-- ) {
					range = ranges[ i ];

					// Remove the original contents.
					range.deleteContents();

					clone = element.clone( true );

					// If the new node is a block element, split the current block.
					if ( this.config.enterMode != 'br' && isBlock )
						range.splitBlock();

					// Insert the new node.
					range.insertNode( clone );

					// Save the last element reference so we can make the
					// selection later.
					if ( !lastElement )
						lastElement = clone;
				}

				range.moveToPosition( lastElement, CKEDITOR.POSITION_AFTER_END );
				selection.selectRanges( [ range ] );
			}
		};

	CKEDITOR.plugins.add( 'wysiwygarea', {
		requires: [ 'editingblock' ],

		init: function( editor, pluginPath ) {
			editor.on( 'editingBlockReady', function() {
				var mainElement, iframe, isLoadingData, isPendingFocus, fireMode;

				// The following information is needed for IE only.
				var isCustomDomain = CKEDITOR.env.ie && document.domain != window.location.hostname;

				// Creates the iframe that holds the editable document.
				var createIFrame = function() {
						if ( iframe )
							iframe.remove();

						iframe = new CKEDITOR.dom.element( 'iframe' ).setAttributes({
							frameBorder: 0,
							allowTransparency: true } ).setStyles({
							width: '100%',
							height: '100%' } );

						if ( CKEDITOR.env.ie ) {
							if ( isCustomDomain ) {
								// The document domain must be set within the src
								// attribute.
								iframe.setAttribute( 'src', 'javascript:void( (function(){' +
									'document.open();' +
									'document.domain="' + document.domain + '";' +
									'document.write( window.parent._cke_htmlToLoad_' + editor.name + ' );' +
									'document.close();' +
									'window.parent._cke_htmlToLoad_' + editor.name + ' = null;' +
									'})() )' );
							} else
								// To avoid HTTPS warnings.
								iframe.setAttribute( 'src', 'javascript:void(0)' );
						}

						// Append the new IFRAME to the main element. For IE, it
						// must be done after setting the "src", to avoid the
						// "secure/unsecure" message under HTTPS.
						mainElement.append( iframe );
					};

				// The script that is appended to the data being loaded. It
				// enables editing, and makes some
				var activationScript = '<script id="cke_actscrpt" type="text/javascript">' +
					'window.onload = function()' +
					'{' +
						// Remove this script from the DOM.
										'var s = document.getElementById( "cke_actscrpt" );' +
						's.parentNode.removeChild( s );' +

						// Call the temporary function for the editing
				// boostrap.
										'window.parent.CKEDITOR._.contentDomReady' + editor.name + '( window );' +
					'}' +
					'</script>';

				// Editing area bootstrap code.
				var contentDomReady = function( domWindow ) {
						delete CKEDITOR._[ 'contentDomReady' + editor.name ];

						var domDocument = domWindow.document,
							body = domDocument.body;

						body.spellcheck = !editor.config.disableNativeSpellChecker;

						if ( CKEDITOR.env.ie ) {
							// Don't display the focus border.
							body.hideFocus = true;

							// Disable and re-enable the body to avoid IE from
							// taking the editing focus at startup. (#141 / #523)
							body.disabled = true;
							body.contentEditable = true;
							body.removeAttribute( 'disabled' );
						} else
							domDocument.designMode = 'on';

						// IE, Opera and Safari may not support it and throw
						// errors.
						try {
							domDocument.execCommand( 'enableObjectResizing', false, !editor.config.disableObjectResizing );
						} catch ( e ) {}
						try {
							domDocument.execCommand( 'enableInlineTableEditing', false, !editor.config.disableNativeTableHandles );
						} catch ( e ) {}

						domWindow = editor.window = new CKEDITOR.dom.window( domWindow );
						domDocument = editor.document = new CKEDITOR.dom.document( domDocument );

						var focusTarget = ( CKEDITOR.env.ie || CKEDITOR.env.safari ) ? domWindow : domDocument;

						focusTarget.on( 'blur', function() {
							editor.focusManager.blur();
						});

						focusTarget.on( 'focus', function() {
							editor.focusManager.focus();
						});

						var keystrokeHandler = editor.keystrokeHandler;
						if ( keystrokeHandler )
							keystrokeHandler.attach( domDocument );

						editor.fire( 'contentDom' );

						if ( fireMode ) {
							editor.mode = 'wysiwyg';
							editor.fire( 'mode' );
							fireMode = false;
						}

						isLoadingData = false;

						if ( isPendingFocus )
							editor.focus();
					};

				editor.addMode( 'wysiwyg', {
					load: function( holderElement, data, isSnapshot ) {
						mainElement = holderElement;

						// Create the iframe at load for all browsers
						// except FF and IE with custom domain.
						if ( !isCustomDomain || !CKEDITOR.env.gecko )
							createIFrame();

						// The editor data "may be dirty" after this
						// point.
						editor.mayBeDirty = true;

						fireMode = true;

						if ( isSnapshot )
							this.loadSnapshotData( data );
						else
							this.loadData( data );
					},

					loadData: function( data ) {
						isLoadingData = true;

						// Get the HTML version of the data.
						if ( editor.dataProcessor )
							data = editor.dataProcessor.toHtml( data );

						// Fix for invalid self-closing tags (see #152).
						// TODO: Check if this fix is really needed as
						// soon as we have the XHTML generator.
						if ( CKEDITOR.env.ie )
							data = data.replace( invalidSelfCloseTagsRegex, '$1></$2>' );

						// Prevent event attributes (like "onclick") to
						// execute while editing.
						if ( CKEDITOR.env.ie || CKEDITOR.env.webkit )
							data = protectEvents( data );

						// Protect src or href attributes.
						data = protectUrls( data );

						data = editor.config.docType + '<html dir="' + editor.config.contentsLangDirection + '">' +
																'<head>' +
																	'<link href="' + editor.config.contentsCss + '" type="text/css" rel="stylesheet" _fcktemp="true"/>' +
																	'<style type="text/css" _fcktemp="true">' +
																		editor._.styles.join( '\n' ) +
																	'</style>' +
																'</head>' +
																'<body>' +
																	data +
																'</body>' +
																'</html>' +
																activationScript;

						// For custom domain in IE, set the global variable
						// that will temporarily hold the editor data. This
						// reference will be used in the ifram src.
						if ( isCustomDomain )
							window[ '_cke_htmlToLoad_' + editor.name ] = data;

						CKEDITOR._[ 'contentDomReady' + editor.name ] = contentDomReady;

						// We need to recreate the iframe in FF for every
						// data load, otherwise the following spellcheck
						// and execCommand features will be active only for
						// the first time.
						// The same is valid for IE with custom domain,
						// because the iframe src must be reset every time.
						if ( isCustomDomain || CKEDITOR.env.gecko )
							createIFrame();

						// For custom domain in IE, the data loading is
						// done through the src attribute of the iframe.
						if ( !isCustomDomain ) {
							var doc = iframe.$.contentWindow.document;
							doc.open();
							doc.write( data );
							doc.close();
						}
					},

					getData: function() {
						var data = iframe.$.contentWindow.document.body;

						if ( editor.dataProcessor )
							data = editor.dataProcessor.toDataFormat( new CKEDITOR.dom.element( data ) );
						else
							data = data.innerHTML;

						// Restore protected attributes.
						data = protectEventsRestore( data );

						return data;
					},

					getSnapshotData: function() {
						return iframe.$.contentWindow.document.body.innerHTML;
					},

					loadSnapshotData: function( data ) {
						iframe.$.contentWindow.document.body.innerHTML = data;
					},

					unload: function( holderElement ) {
						editor.window = editor.document = iframe = mainElement = isPendingFocus = null;

						editor.fire( 'contentDomUnload' );
					},

					focus: function() {
						if ( isLoadingData )
							isPendingFocus = true;
						else if ( editor.window )
							editor.window.focus();
					}
				});

				editor.on( 'insertHtml', onInsertHtml, null, null, 20 );
				editor.on( 'insertElement', onInsertElement, null, null, 20 );
			});
		}
	});
})();

/**
 * Disables the ability of resize objects (image and tables) in the editing
 * area
 * @type Boolean
 * @default false
 * @example
 * config.disableObjectResizing = true;
 */
CKEDITOR.config.disableObjectResizing = false;

/**
 * Disables the "table tools" offered natively by the browser (currently
 * Firefox only) to make quick table editing operations, like adding or
 * deleting rows and columns.
 * @type Boolean
 * @default true
 * @example
 * config.disableNativeTableHandles = false;
 */
CKEDITOR.config.disableNativeTableHandles = true;

/**
 * Disables the built-in spell checker while typing natively available in the
 * browser (currently Firefox and Safari only).<br /><br />
 *
 * Even if word suggestions will not appear in the FCKeditor context menu, this
 * feature is useful to help quickly identifying misspelled words.<br /><br />
 *
 * This setting is currently compatible with Firefox only due to limitations in
 * other browsers.
 * @type Boolean
 * @default true
 * @example
 * config.disableNativeSpellChecker = false;
 */
CKEDITOR.config.disableNativeSpellChecker = true;
