/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The "wysiwygarea" plugin. It registers the "wysiwyg" editing
 *		mode, which handles the main editing area space.
 */

(function() {
	function onInsertHtml( evt ) {
		if ( this.mode == 'wysiwyg' ) {
			this.focus();

			var selection = this.getSelection(),
				data = evt.data;

			if ( this.dataProcessor )
				data = this.dataProcessor.toHtml( data );

			if ( CKEDITOR.env.ie ) {
				var selIsLocked = selection.isLocked;

				if ( selIsLocked )
					selection.unlock();

				var $sel = selection.getNative();
				if ( $sel.type == 'Control' )
					$sel.clear();
				$sel.createRange().pasteHTML( data );

				if ( selIsLocked )
					this.getSelection().lock();
			} else
				this.document.$.execCommand( 'inserthtml', false, data );
		}
	}

	function onInsertElement( evt ) {
		if ( this.mode == 'wysiwyg' ) {
			this.focus();

			var element = evt.data,
				elementName = element.getName(),
				isBlock = CKEDITOR.dtd.$block[ elementName ];

			var selection = this.getSelection(),
				ranges = selection.getRanges();

			var selIsLocked = selection.isLocked;

			if ( selIsLocked )
				selection.unlock();

			var range, clone, lastElement, bookmark;

			for ( var i = ranges.length - 1; i >= 0; i-- ) {
				range = ranges[ i ];

				// Remove the original contents.
				range.deleteContents();

				clone = !i && element || element.clone( true );

				var toSplit;

				// If the new node is a block element, split the current block (if any).
				if ( this.config.enterMode != CKEDITOR.ENTER_BR && isBlock ) {
					var startPath = new CKEDITOR.dom.elementPath( range.startContainer ),
						j = 0,
						parent;

					while ( ( parent = startPath.elements[ j++ ] ) && parent != startPath.blockLimit ) {
						var parentName = parent.getName(),
							parentDtd = CKEDITOR.dtd[ parentName ];

						if ( parentDtd && !parentDtd[ elementName ] )
							toSplit = parent;
					}
				}

				// Insert the new node.
				range.insertNode( clone );

				if ( toSplit )
					clone.breakParent( toSplit );

				// Save the last element reference so we can make the
				// selection later.
				if ( !lastElement )
					lastElement = clone;
			}

			range.moveToPosition( lastElement, CKEDITOR.POSITION_AFTER_END );

			var next = lastElement.getNextSourceNode( true );
			if ( next && next.type == CKEDITOR.NODE_ELEMENT )
				range.moveToElementEditStart( next );

			selection.selectRanges( [ range ] );

			if ( selIsLocked )
				this.getSelection().lock();
		}
	}

	CKEDITOR.plugins.add( 'wysiwygarea', {
		requires: [ 'editingblock' ],

		init: function( editor ) {
			editor.on( 'editingBlockReady', function() {
				var mainElement, iframe, isLoadingData, isPendingFocus, fireMode;

				// Support for custom document.domain in IE.
				var isCustomDomain = CKEDITOR.env.isCustomDomain();

				// Creates the iframe that holds the editable document.
				var createIFrame = function() {
						if ( iframe )
							iframe.remove();

						iframe = new CKEDITOR.dom.element( 'iframe' ).setAttributes({
							frameBorder: 0,
							tabIndex: -1,
							allowTransparency: true } ).setStyles({
							width: '100%',
							height: '100%' } );

						if ( CKEDITOR.env.ie ) {
							if ( CKEDITOR.env.version < 8 )
								iframe.setStyle( 'position', 'absolute' );

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

						var accTitle = editor.lang.editorTitle.replace( '%1', editor.name );

						if ( CKEDITOR.env.gecko ) {
							// Accessibility attributes for Firefox.
							mainElement.setAttributes({
								role: 'region',
								title: accTitle
							});
							iframe.setAttributes({
								role: 'region',
								title: ' '
							});
						} else if ( CKEDITOR.env.webkit ) {
							iframe.setAttribute( 'title', accTitle ); // Safari 4
							iframe.setAttribute( 'name', accTitle ); // Safari 3
						} else if ( CKEDITOR.env.ie ) {
							// Accessibility label for IE.
							var fieldset = CKEDITOR.dom.element.createFromHtml( '<fieldset style="height:100%' +
								( CKEDITOR.env.quirks ? ';position:relative' : '' ) +
								'">' +
								'<legend style="position:absolute;top:-1000px">' +
									CKEDITOR.tools.htmlEncode( accTitle ) +
								'</legend>' +
								'</fieldset>'
								, CKEDITOR.document );
							iframe.appendTo( fieldset );
							fieldset.appendTo( mainElement );
						}

						if ( !CKEDITOR.env.ie )
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

						// Gecko/Webkit need some help when selecting control type elements. (#3448) 
						if ( !( CKEDITOR.env.ie || CKEDITOR.env.opera ) ) {
							domDocument.on( 'mousedown', function( ev ) {
								var control = ev.data.getTarget();
								if ( control.is( 'img', 'hr', 'input', 'textarea', 'select' ) )
									editor.getSelection().selectElement( control );
							});
						}

						// Webkit: avoid from editing form control elements content.
						if ( CKEDITOR.env.webkit ) {
							// Prevent from tick checkbox/radiobox/select
							domDocument.on( 'click', function( ev ) {
								if ( ev.data.getTarget().is( 'input', 'select' ) )
									ev.data.preventDefault();
							});

							// Prevent from editig textfield/textarea value.
							domDocument.on( 'mouseup', function( ev ) {
								if ( ev.data.getTarget().is( 'input', 'textarea' ) )
									ev.data.preventDefault();
							});
						}

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

						// Adds the document body as a context menu target.
						if ( editor.contextMenu )
							editor.contextMenu.addTarget( domDocument );

						setTimeout( function() {
							editor.fire( 'contentDom' );

							if ( fireMode ) {
								editor.mode = 'wysiwyg';
								editor.fire( 'mode' );
								fireMode = false;
							}

							isLoadingData = false;

							if ( isPendingFocus ) {
								editor.focus();
								isPendingFocus = false;
							}
						}, 0 );
					};

				editor.addMode( 'wysiwyg', {
					load: function( holderElement, data, isSnapshot ) {
						mainElement = holderElement;

						if ( CKEDITOR.env.ie && ( CKEDITOR.env.quirks || CKEDITOR.env.version < 8 ) )
							holderElement.setStyle( 'position', 'relative' );

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
							data = editor.dataProcessor.toHtml( data, ( editor.config.enterMode != CKEDITOR.ENTER_BR ) );

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
						var data = iframe.getFrameDocument().getBody().getHtml();

						if ( editor.dataProcessor )
							data = editor.dataProcessor.toDataFormat( data, ( editor.config.enterMode != CKEDITOR.ENTER_BR ) );

						return data;
					},

					getSnapshotData: function() {
						return iframe.getFrameDocument().getBody().getHtml();
					},

					loadSnapshotData: function( data ) {
						iframe.getFrameDocument().getBody().setHtml( data );
					},

					unload: function( holderElement ) {
						editor.window = editor.document = iframe = mainElement = isPendingFocus = null;

						editor.fire( 'contentDomUnload' );
					},

					focus: function() {
						if ( isLoadingData )
							isPendingFocus = true;
						else if ( editor.window ) {
							editor.window.focus();
							editor.selectionChange();
						}
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
 * Even if word suggestions will not appear in the CKEditor context menu, this
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
