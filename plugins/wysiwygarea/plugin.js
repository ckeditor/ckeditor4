/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview The "wysiwygarea" plugin. It registers the "wysiwyg" editing
 *		mode, which handles the main editing area space.
 */

(function() {
	CKEDITOR.plugins.add( 'wysiwygarea', {
		onLoad: function() {
			// IE>=8 stricts mode doesn't have 'contentEditable' in effect
			// on element unless it has layout. (#5562)
			if ( CKEDITOR.document.$.documentMode >= 8 ) {
				CKEDITOR.addCss( 'html.CSS1Compat [contenteditable=false]{min-height:0 !important}' );

				var selectors = [];

				for ( var tag in CKEDITOR.dtd.$removeEmpty )
					selectors.push( 'html.CSS1Compat ' + tag + '[contenteditable=false]' );

				CKEDITOR.addCss( selectors.join( ',' ) + '{display:inline-block}' );
			}
			// Set the HTML style to 100% to have the text cursor in affect (#6341)
			else if ( CKEDITOR.env.gecko ) {
				CKEDITOR.addCss( 'html{height:100% !important}' );
				CKEDITOR.addCss( 'img:-moz-broken{-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}' );
			}
			// Remove the margin to avoid mouse confusion. (#8835)
			else if ( CKEDITOR.env.ie && CKEDITOR.env.version < 8 )
				CKEDITOR.addCss( 'body.cke_contents_ltr{margin-right:0}' );

			/* #3658: [IE6] Editor document has horizontal scrollbar on long lines
			To prevent this misbehavior, we show the scrollbar always */
			/* #6341: The text cursor must be set on the editor area. */
			/* #6632: Avoid having "text" shape of cursor in IE7 scrollbars.*/
			CKEDITOR.addCss( 'html{_overflow-y:scroll;cursor:text;*cursor:auto}' );
			// Use correct cursor for these elements
			CKEDITOR.addCss( 'img,input,textarea{cursor:default}' );

		},
		init: function( editor ) {
			editor.addMode( 'wysiwyg', function( callback ) {
				var iframe = CKEDITOR.document.createElement( 'iframe' );
				iframe.setStyles({ width: '100%', height: '100%' } );
				iframe.addClass( 'cke_wysiwyg_frame cke_reset' );

				var contentSpace = editor.ui.space( 'contents' );
				contentSpace.append( iframe );

				var src = 'document.open();' +
					// The document domain must be set any time we
				// call document.open().
				( isCustomDomain ? ( 'document.domain="' + document.domain + '";' ) : '' ) +
					'document.close();';

				// With IE, the custom domain has to be taken care at first,
				// for other browers, the 'src' attribute should be left empty to
				// trigger iframe's 'load' event.
				src = CKEDITOR.env.air ? 'javascript:void(0)' : CKEDITOR.env.ie ? 'javascript:void(function(){' + encodeURIComponent( src ) + '}())'
					:
					'';

				// Asynchronous iframe loading is only required in IE>8 and Gecko (other reasons probably).
				// Do not use it on WebKit as it'll break the browser-back navigation.
				var useOnloadEvent = CKEDITOR.env.ie || CKEDITOR.env.gecko;
				if ( useOnloadEvent )
					iframe.on( 'load', onLoad );

				var frameLabel = [ editor.lang.editor, editor.name ].join( ',' ),
					frameDesc = editor.lang.common.editorHelp;

				if ( CKEDITOR.env.ie )
					frameLabel += ', ' + frameDesc;

				var labelId = CKEDITOR.tools.getNextId(),
					desc = CKEDITOR.dom.element.createFromHtml( '<span id="' + labelId + '" class="cke_voice_label">' + frameDesc + '</span>' );

				contentSpace.append( desc, 1 );

				// Remove the ARIA description.
				editor.on( 'beforeModeUnload', function( evt ) {
					evt.removeListener();
					desc.remove();
				});

				iframe.setAttributes({
					frameBorder: 0,
					'aria-describedby' : labelId,
					title: frameLabel,
					src: src,
					tabIndex: editor.tabIndex,
					allowTransparency: 'true'
				});

				// Execute onLoad manually for all non IE||Gecko browsers.
				!useOnloadEvent && onLoad();

				if ( CKEDITOR.env.webkit ) {
					// Webkit: iframe size doesn't auto fit well. (#7360)
					var onResize = function() {
						// Hide the iframe to get real size of the holder. (#8941)
						contentSpace.setStyle( 'width', '100%' );

						iframe.hide();
						iframe.setSize( 'width', contentSpace.getSize( 'width' ) );
						contentSpace.removeStyle( 'width' );
						iframe.show();
					};

					iframe.setCustomData( 'onResize', onResize );

					CKEDITOR.document.getWindow().on( 'resize', onResize );
				}

				editor.fire( 'ariaWidget', iframe );

				function onLoad( evt ) {
					evt && evt.removeListener();
					editor.editable( new framedWysiwyg( editor, iframe.$.contentWindow.document.body ) );
					editor.setData( editor.getData( 1 ), callback );
				}
			});
		}
	});

	// Matching an empty paragraph at the end of document.
	var emptyParagraphRegexp = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi;

	// Support for custom document.domain in IE.
	var isCustomDomain = CKEDITOR.env.isCustomDomain();

	function onDomReady( win ) {
		var editor = this.editor,
			doc = win.document,
			body = doc.body;

		// Remove this script from the DOM.
		var script = doc.getElementById( "cke_actscrpt" );
		script && script.parentNode.removeChild( script );

		body.spellcheck = !editor.config.disableNativeSpellChecker;

		if ( CKEDITOR.env.gecko ) {
			// Force Gecko to change contentEditable from false to true on domReady
			// (because it's previously set to true on iframe's body creation).
			// Otherwise del/backspace and some other editable features will be broken in Fx <4
			// See: #107 and https://bugzilla.mozilla.org/show_bug.cgi?id=440916
			body.contentEditable = false;

			// Remove any leading <br> which is between the <body> and the comment.
			// This one fixes Firefox 3.6 bug: the browser inserts a leading <br>
			// on document.write if the body has contenteditable="true".
			if ( CKEDITOR.env.version < 20000 ) {
				body.innerHTML = body.innerHTML.replace( /^.*<!-- cke-content-start -->/, '' );

				// The above hack messes up the selection in FF36.
				// To clean this up, manually select collapsed range that
				// starts within the body.
				setTimeout( function() {
					var range = new CKEDITOR.dom.range( new CKEDITOR.dom.document( doc ) );
					range.setStart( new CKEDITOR.dom.node( body ), 0 );
					editor.getSelection().selectRanges( [ range ] );
				}, 0 );
			}
		}

		body.contentEditable = true;

		if ( CKEDITOR.env.ie ) {
			// Don't display the focus border.
			body.hideFocus = true;

			// Disable and re-enable the body to avoid IE from
			// taking the editing focus at startup. (#141 / #523)
			body.disabled = true;
			body.removeAttribute( 'disabled' );
		}

		delete this._.isLoadingData;

		// Play the magic to alter element reference to the reloaded one.
		this.$ = body;

		doc = new CKEDITOR.dom.document( doc );

		this.setup();

		if ( CKEDITOR.env.ie ) {
			doc.getDocumentElement().addClass( doc.$.compatMode );

			// Prevent IE from leaving new paragraph after deleting all contents in body. (#6966)
			editor.config.enterMode != CKEDITOR.ENTER_P && doc.on( 'selectionchange', function() {
				var body = doc.getBody(),
					sel = editor.getSelection(),
					range = sel && sel.getRanges()[ 0 ];

				if ( range && body.getHtml().match( /^<p>&nbsp;<\/p>$/i ) && range.startContainer.equals( body ) ) {
					// Avoid the ambiguity from a real user cursor position.
					setTimeout( function() {
						range = editor.getSelection().getRanges()[ 0 ];
						if ( !range.startContainer.equals( 'body' ) ) {
							body.getFirst().remove( 1 );
							range.moveToElementEditEnd( body );
							range.select();
						}
					}, 0 );
				}
			});
		}

		// Gecko needs a key event to 'wake up' editing when the document is
		// empty. (#3864, #5781)
		CKEDITOR.env.gecko && CKEDITOR.tools.setTimeout( activateEditing, 0, this, editor );

		// ## START : disableNativeTableHandles and disableObjectResizing settings.

		// Enable dragging of position:absolute elements in IE.
		try {
			editor.document.$.execCommand( '2D-position', false, true );
		} catch ( e ) {}

		// IE, Opera and Safari may not support it and throw errors.
		try {
			editor.document.$.execCommand( 'enableInlineTableEditing', false, !editor.config.disableNativeTableHandles );
		} catch ( e ) {}

		if ( editor.config.disableObjectResizing ) {
			try {
				this.getDocument().$.execCommand( 'enableObjectResizing', false, false );
			} catch ( e ) {
				// For browsers in which the above method failed, we can cancel the resizing on the fly (#4208)
				this.attachListener( this, CKEDITOR.env.ie ? 'resizestart' : 'resize', function( evt ) {
					evt.data.preventDefault();
				});
			}
		}

		if ( CKEDITOR.env.gecko || CKEDITOR.env.ie && editor.document.$.compatMode == 'CSS1Compat' ) {
			this.attachListener( this, 'keydown', function( evt ) {
				var keyCode = evt.data.getKeystroke();

				// PageUp OR PageDown
				if ( keyCode == 33 || keyCode == 34 ) {
					// PageUp/PageDown scrolling is broken in document
					// with standard doctype, manually fix it. (#4736)
					if ( CKEDITOR.env.ie ) {
						setTimeout( function() {
							editor.getSelection().scrollIntoView();
						}, 0 );
					}
					// Page up/down cause editor selection to leak
					// outside of editable thus we try to intercept
					// the behavior, while it affects only happen
					// when editor contents are not overflowed. (#7955)
					else if ( editor.window.$.innerHeight > this.$.offsetHeight ) {
						var range = editor.createRange();
						range[ keyCode == 33 ? 'moveToElementEditStart' : 'moveToElementEditEnd' ]( this );
						range.select();
						evt.data.preventDefault();
					}
				}
			});
		}

		if ( CKEDITOR.env.ie ) {
			// [IE] Iframe will still keep the selection when blurred, if
			// focus is moved onto a non-editing host, e.g. link or button, but
			// it becomes a problem for the object type selection, since the resizer
			// handler attached on it will mark other part of the UI, especially
			// for the dialog. (#8157)
			// [IE<8 & Opera] Even worse For old IEs, the cursor will not vanish even if
			// the selection has been moved to another text input in some cases. (#4716)
			//
			// Now the range restore is disabled, so we simply force IE to clean
			// up the selection before blur.
			this.on( 'blur', function() {
				// Error proof when the editor is not visible. (#6375)
				try {
					doc.$.selection.empty();
				} catch ( er ) {}
			});
		}

		// ## END


		var title = editor.document.getElementsByTag( 'title' ).getItem( 0 );
		title.data( 'cke-title', editor.document.$.title );

		// [IE] JAWS will not recognize the aria label we used on the iframe
		// unless the frame window title string is used as the voice label,
		// backup the original one and restore it on output.
		if ( CKEDITOR.env.ie )
			editor.document.$.title = this._.docTitle;

		CKEDITOR.tools.setTimeout( function() {
			editor.fire( 'contentDom' );

			if ( this._.isPendingFocus ) {
				editor.focus();
				this._.isPendingFocus = false;
			}

			setTimeout( function() {
				editor.fire( 'dataReady' );
			}, 0 );

			/*
			 * IE BUG: IE might have rendered the iframe with invisible contents.
			 * (#3623). Push some inconsequential CSS style changes to force IE to
			 * refresh it.
			 *
			 * Also, for some unknown reasons, short timeouts (e.g. 100ms) do not
			 * fix the problem. :(
			 */
			if ( CKEDITOR.env.ie ) {
				setTimeout( function() {
					if ( editor.document ) {
						var $body = editor.document.$.body;
						$body.runtimeStyle.marginBottom = '0px';
						$body.runtimeStyle.marginBottom = '';
					}
				}, 1000 );
			}
		}, 0, this );
	}

	var framedWysiwyg = CKEDITOR.tools.createClass({
		$: function( editor ) {
			this.base.apply( this, arguments );

			this._.frameLoadedHandler = CKEDITOR.tools.addFunction( function( win ) {
				// Avoid opening design mode in a frame window thread,
				// which will cause host page scrolling.(#4397)
				CKEDITOR.tools.setTimeout( onDomReady, 0, this, win );
			}, this );

			this._.docTitle = this.getWindow().getFrame().getAttribute( 'title' );
		},

		base: CKEDITOR.editable,

		proto: {
			setData: function( data, isSnapshot ) {
				var editor = this.editor;

				if ( isSnapshot )
					this.setHtml( data );
				else {
					this._.isLoadingData = true;
					editor._.dataStore = { id:1 };

					var config = editor.config,
						fullPage = config.fullPage,
						docType = config.docType;

					// Build the additional stuff to be included into <head>.
					var headExtra = '';

					!fullPage && ( headExtra = CKEDITOR.tools.buildStyleHtml( editor.config.contentsCss ) + headExtra );

					var baseTag = config.baseHref ? '<base href="' + config.baseHref + '" data-cke-temp="1" />' : '';

					if ( fullPage ) {
						// Search and sweep out the doctype declaration.
						data = data.replace( /<!DOCTYPE[^>]*>/i, function( match ) {
							editor.docType = docType = match;
							return '';
						}).replace( /<\?xml\s[^\?]*\?>/i, function( match ) {
							editor.xmlDeclaration = match;
							return '';
						});
					}

					// Get the HTML version of the data.
					if ( editor.dataProcessor )
						data = editor.dataProcessor.toHtml( data );

					if ( fullPage ) {
						// Check if the <body> tag is available.
						if ( !( /<body[\s|>]/ ).test( data ) )
							data = '<body>' + data;

						// Check if the <html> tag is available.
						if ( !( /<html[\s|>]/ ).test( data ) )
							data = '<html>' + data + '</html>';

						// Check if the <head> tag is available.
						if ( !( /<head[\s|>]/ ).test( data ) )
							data = data.replace( /<html[^>]*>/, '$&<head><title></title></head>' );
						else if ( !( /<title[\s|>]/ ).test( data ) )
							data = data.replace( /<head[^>]*>/, '$&<title></title>' );

						// The base must be the first tag in the HEAD, e.g. to get relative
						// links on styles.
						baseTag && ( data = data.replace( /<head>/, '$&' + baseTag ) );

						// Inject the extra stuff into <head>.
						// Attention: do not change it before testing it well. (V2)
						// This is tricky... if the head ends with <meta ... content type>,
						// Firefox will break. But, it works if we place our extra stuff as
						// the last elements in the HEAD.
						data = data.replace( /<\/head\s*>/, headExtra + '$&' );

						// Add the DOCTYPE back to it.
						data = docType + data;
					} else {
						data = config.docType +
							'<html dir="' + config.contentsLangDirection + '"' +
								' lang="' + ( config.contentsLanguage || editor.langCode ) + '">' +
							'<head>' +
								'<title>' + this._.docTitle + '</title>' +
								baseTag +
								headExtra +
							'</head>' +
							'<body' + ( config.bodyId ? ' id="' + config.bodyId + '"' : '' ) +
								( config.bodyClass ? ' class="' + config.bodyClass + '"' : '' ) +
							'>' +
								data +
							'</body>' +
							'</html>';
					}

					if ( CKEDITOR.env.gecko ) {
						// Hack to make Fx put cursor at the start of doc on fresh focus.
						data = data.replace( /<body/, '<body contenteditable="true" ' );

						// Distinguish bogus to normal BR at the end of document for Mozilla. (#5293).
						data = data.replace( /<br \/>(?=\s*<\/(:?html|body)>)/, '$&<br type="_moz" />' );

						// Another hack which is used by onDomReady to remove a leading
						// <br> which is inserted by Firefox 3.6 when document.write is called.
						// This additional <br> is present because of contenteditable="true"
						if ( CKEDITOR.env.version < 20000 )
							data = data.replace( /<body[^>]*>/, '$&<!-- cke-content-start -->'  );
					}

					// The script that launches the bootstrap logic on 'domReady', so the document
					// is fully editable even before the editing iframe is fully loaded (#4455).

					var bootstrapCode =
						'<script id="cke_actscrpt" type="text/javascript"' + ( CKEDITOR.env.ie ? ' defer="defer" ' : '' ) + '>' +
							( isCustomDomain ? ( 'document.domain="' + document.domain + '";' ) : '' ) +
							'var wasLoaded=0;' +	// It must be always set to 0 as it remains as a window property.
							'function onload(){' +
								'if(!wasLoaded)' +	// FF3.6 calls onload twice when editor.setData. Stop that.
									'window.parent.CKEDITOR.tools.callFunction(' + this._.frameLoadedHandler + ',window);' +
								'wasLoaded=1;' +
							'}' +
							( CKEDITOR.env.ie ? 'onload();' : 'document.addEventListener("DOMContentLoaded", onload, false );' ) +
						'</script>';

					data = data.replace( /(?=\s*<\/(:?head)>)/, bootstrapCode );

					// Current DOM will be deconstructed by document.write, cleanup required.
					this.clearCustomData();
					this.clearListeners();

					editor.fire( 'contentDomUnload' );

					var doc = this.getDocument();
					doc.write( data );
				}
			},

			getData: function( isSnapshot ) {
				if ( isSnapshot )
					return this.getHtml();
				else {
					var editor = this.editor,
						config = editor.config,
						fullPage = config.fullPage,
						docType = fullPage && editor.docType,
						xmlDeclaration = fullPage && editor.xmlDeclaration,
						doc = this.getDocument();

					var data = fullPage ? doc.getDocumentElement().getOuterHtml() : doc.getBody().getHtml();

					// BR at the end of document is bogus node for Mozilla. (#5293).
					if ( CKEDITOR.env.gecko )
						data = data.replace( /<br>(?=\s*(:?$|<\/body>))/, '' );

					if ( editor.dataProcessor )
						data = editor.dataProcessor.toDataFormat( data );

					// Reset empty if the document contains only one empty paragraph.
					if ( config.ignoreEmptyParagraph )
						data = data.replace( emptyParagraphRegexp, function( match, lookback ) {
						return lookback;
					});

					if ( xmlDeclaration )
						data = xmlDeclaration + '\n' + data;
					if ( docType )
						data = docType + '\n' + data;

					return data;
				}
			},

			focus: function() {
				if ( this._.isLoadingData )
					this._.isPendingFocus = true;
				else
					framedWysiwyg.baseProto.focus.call( this );
			},

			detach: function() {
				var editor = this.editor,
					doc = editor.document,
					iframe = editor.window.getFrame();

				framedWysiwyg.baseProto.detach.call( this );

				// Memory leak proof.
				this.clearCustomData();
				doc.getDocumentElement().clearCustomData();
				iframe.clearCustomData();
				CKEDITOR.tools.removeFunction( this._.frameLoadedHandler );

				var onResize = iframe.removeCustomData( 'onResize' );
				onResize && onResize.removeListener();


				editor.fire( 'contentDomUnload' );

				/*
				 * IE BUG: When destroying editor DOM with the selection remains inside
				 * editing area would break IE7/8's selection system, we have to put the editing
				 * iframe offline first. (#3812 and #5441)
				 */
				iframe.remove();
			}
		}
	});

	// Fixing Firefox 'Back-Forward Cache' breaks design mode. (#4514)
	if ( CKEDITOR.env.gecko ) {
		(function() {
			var body = document.body;

			if ( !body )
				window.addEventListener( 'load', arguments.callee, false );
			else {
				var currentHandler = body.getAttribute( 'onpageshow' );
				body.setAttribute( 'onpageshow', ( currentHandler ? currentHandler + ';' : '' ) + 'event.persisted && (function(){' +
					'var allInstances = CKEDITOR.instances, editor, doc;' +
					'for ( var i in allInstances )' +
					'{' +
						'editor = allInstances[ i ];' +
						'doc = editor.document;' +
						'if ( doc )' +
						'{' +
							'doc.$.designMode = "off";' +
							'doc.$.designMode = "on";' +
						'}' +
					'}' +
					'})();' );
			}
		})();

	}

	// DOM modification here should not bother dirty flag.(#4385)
	function restoreDirty( editor ) {
		if ( !editor.checkDirty() )
			setTimeout( function() {
			editor.resetDirty();
		}, 0 );
	}

	function activateEditing( editor ) {
		if ( editor.readOnly )
			return;

		var win = editor.window,
			doc = editor.document,
			body = doc.getBody(),
			bodyFirstChild = body.getFirst(),
			bodyChildsNum = body.getChildren().count();

		if ( !bodyChildsNum || bodyChildsNum == 1 && bodyFirstChild.type == CKEDITOR.NODE_ELEMENT && bodyFirstChild.hasAttribute( '_moz_editor_bogus_node' ) ) {
			restoreDirty( editor );

			// Memorize scroll position to restore it later (#4472).
			var hostDocument = editor.element.getDocument();
			var hostDocumentElement = hostDocument.getDocumentElement();
			var scrollTop = hostDocumentElement.$.scrollTop;
			var scrollLeft = hostDocumentElement.$.scrollLeft;

			// Simulating keyboard character input by dispatching a keydown of white-space text.
			var keyEventSimulate = doc.$.createEvent( "KeyEvents" );
			keyEventSimulate.initKeyEvent( 'keypress', true, true, win.$, false, false, false, false, 0, 32 );
			doc.$.dispatchEvent( keyEventSimulate );

			if ( scrollTop != hostDocumentElement.$.scrollTop || scrollLeft != hostDocumentElement.$.scrollLeft )
				hostDocument.getWindow().$.scrollTo( scrollLeft, scrollTop );

			// Restore the original document status by placing the cursor before a bogus br created (#5021).
			bodyChildsNum && body.getFirst().remove();
			doc.getBody().appendBogus();
			var nativeRange = editor.createRange();
			nativeRange.setStartAt( body, CKEDITOR.POSITION_AFTER_START );
			nativeRange.select();
		}
	}

})();

/**
 * Disables the ability of resize objects (image and tables) in the editing
 * area.
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
 * Disables the built-in words spell checker if browser provides one.<br /><br />
 *
 * <strong>Note:</strong> Although word suggestions provided by browsers (natively) will not appear in CKEditor's default context menu,
 * users can always reach the native context menu by holding the <em>Ctrl</em> key when right-clicking if {@link CKEDITOR.config.browserContextMenuOnCtrl}
 * is enabled or you're simply not using the context menu plugin.
 *
 * @type Boolean
 * @default true
 * @example
 * config.disableNativeSpellChecker = false;
 */
CKEDITOR.config.disableNativeSpellChecker = true;

/**
 * Whether the editor must output an empty value ("") if it's contents is made
 * by an empty paragraph only.
 * @type Boolean
 * @default true
 * @example
 * config.ignoreEmptyParagraph = false;
 */
CKEDITOR.config.ignoreEmptyParagraph = true;

/**
 * The CSS file(s) to be used to apply style to the contents. It should
 * reflect the CSS used in the final pages where the contents are to be
 * used.
 * @type String|Array
 * @default '&lt;CKEditor folder&gt;/contents.css'
 * @example
 * config.contentsCss = '/css/mysitestyles.css';
 * config.contentsCss = ['/css/mysitestyles.css', '/css/anotherfile.css'];
 */
CKEDITOR.config.contentsCss = CKEDITOR.basePath + 'contents.css';

/**
 * Language code of  the writting language which is used to author the editor
 * contents.
 * @name CKEDITOR.config.contentsLanguage
 * @default Same value with editor's UI language.
 * @type String
 * @example
 * config.contentsLanguage = 'fr';
 */

/**
 * The base href URL used to resolve relative and absolute URLs in the
 * editor content.
 * @name CKEDITOR.config.baseHref
 * @type String
 * @default '' (empty)
 * @example
 * config.baseHref = 'http://www.example.com/path/';
 */

/**
 * Fired when data is loaded and ready for retrieval in an editor instance.
 * @name CKEDITOR.editor#dataReady
 * @event
 */

/**
 * Whether automatically create wrapping blocks around inline contents inside document body,
 * this helps to ensure the integrality of the block enter mode.
 * <strong>Note:</strong> Changing the default value might introduce unpredictable usability issues.
 * @name CKEDITOR.config.autoParagraph
 * @since 3.6
 * @type Boolean
 * @default true
 * @example
 * config.autoParagraph = false;
 */

/**
 * Fired when some elements are added to the document
 * @name CKEDITOR.editor#ariaWidget
 * @event
 * @param {Object} element The element being added
 */
