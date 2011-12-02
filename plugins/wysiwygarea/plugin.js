/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The "wysiwygarea" plugin. It registers the "wysiwyg" editing
 *		mode, which handles the main editing area space.
 */

(function() {
	CKEDITOR.plugins.add( 'wysiwygarea', {
		init: function( editor ) {
			editor.addMode( 'wysiwyg', function( callback ) {
				var iframe = CKEDITOR.document.createElement( 'iframe' );
				iframe.setStyles({ width: '100%', height: '100%' } );
				editor.getUISpace( 'contents' ).append( iframe );

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

				// Asynchronous iframe loading is only required in IE>8, but
				// it's not a problem to use it for other browsers as well.
				iframe.on( 'load', function( evt ) {
					evt.removeListener();
					editor.editable( new framedWysiwyg( editor, iframe.$.contentWindow.document.body ) );
					editor.setData( editor.getData( 1 ), callback );
				});

				var frameLabel = editor.lang.editorTitle.replace( '%1', editor.name );
				iframe.setAttributes({
					frameBorder: 0,
					title: frameLabel,
					src: src,
					tabIndex: CKEDITOR.env.webkit ? -1 : editor.tabIndex,
					allowTransparency: 'true'
				});

				editor.fire( 'ariaWidget', iframe );
			});

			editor.on( 'readOnly', function() {
				if ( editor.mode == 'wysiwyg' ) {
					// Simply reload the wysiwyg area. It'll take care of read-only.
					editor.loadData( editor.getData() );
				}
			});

			// IE>=8 stricts mode doesn't have 'contentEditable' in effect
			// on element unless it has layout. (#5562)
			if ( CKEDITOR.document.$.documentMode >= 8 ) {
				editor.addCss( 'html.CSS1Compat [contenteditable=false]{ min-height:0 !important;}' );

				var selectors = [];

				for ( var tag in CKEDITOR.dtd.$removeEmpty )
					selectors.push( 'html.CSS1Compat ' + tag + '[contenteditable=false]' );

				editor.addCss( selectors.join( ',' ) + '{ display:inline-block;}' );
			}
			// Set the HTML style to 100% to have the text cursor in affect (#6341)
			else if ( CKEDITOR.env.gecko ) {
				editor.addCss( 'html { height: 100% !important; }' );
				editor.addCss( 'img:-moz-broken { -moz-force-broken-image-icon : 1;	width : 24px; height : 24px; }' );
			}

			/* #3658: [IE6] Editor document has horizontal scrollbar on long lines
			To prevent this misbehavior, we show the scrollbar always */
			/* #6341: The text cursor must be set on the editor area. */
			/* #6632: Avoid having "text" shape of cursor in IE7 scrollbars.*/
			editor.addCss( 'html {	_overflow-y: scroll; cursor: text;	*cursor:auto;}' );
			// Use correct cursor for these elements
			editor.addCss( 'img, input, textarea { cursor: default;}' );

			// Create an invisible element to grab focus.
			if ( CKEDITOR.env.gecko || CKEDITOR.env.ie || CKEDITOR.env.opera ) {
				var focusGrabber;
				editor.on( 'uiReady', function() {
					focusGrabber = editor.container.append( CKEDITOR.dom.element.createFromHtml(
					// Use 'span' instead of anything else to fly under the screen-reader radar. (#5049)
					'<span tabindex="-1" style="position:absolute;" role="presentation"></span>' ) );

					focusGrabber.on( 'focus', function() {
						editor.focus();
					});

					editor.focusGrabber = focusGrabber;
				});

				editor.on( 'destroy', function() {
					if ( focusGrabber ) {
						focusGrabber.clearCustomData();
						delete editor.focusGrabber;
					}
				});
			}
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

		var editable = !editor.readOnly;

		if ( CKEDITOR.env.ie ) {
			// Don't display the focus border.
			body.hideFocus = true;

			// Disable and re-enable the body to avoid IE from
			// taking the editing focus at startup. (#141 / #523)
			body.disabled = true;
			body.contentEditable = editable;
			body.removeAttribute( 'disabled' );
		} else {
			// Avoid opening design mode in a frame window thread,
			// which will cause host page scrolling.(#4397)
			setTimeout( function() {
				// Prefer 'contentEditable' instead of 'designMode'. (#3593)
				if ( CKEDITOR.env.gecko && CKEDITOR.env.version >= 10900 || CKEDITOR.env.opera )
					doc.$.body.contentEditable = editable;
				else if ( CKEDITOR.env.webkit )
					doc.$.body.parentNode.contentEditable = editable;
				else
					doc.$.designMode = editable ? 'off' : 'on';
			}, 0 );
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
					range = editor.getSelection().getRanges()[ 0 ];

				if ( body.getHtml().match( /^<p>&nbsp;<\/p>$/i ) && range.startContainer.equals( body ) ) {
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
		!editor.readOnly && CKEDITOR.env.gecko && CKEDITOR.tools.setTimeout( activateEditing, 0, this, editor );

		// ## START : disableNativeTableHandles and disableObjectResizing settings.

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

		// ## END

		// IE standard compliant in editing frame doesn't focus the editor when
		// clicking outside actual content, manually apply the focus. (#1659)
		if ( !editor.readOnly && (
		( CKEDITOR.env.ie && doc.$.compatMode == 'CSS1Compat' ) || CKEDITOR.env.gecko || CKEDITOR.env.opera ) ) {
			var htmlElement = doc.getDocumentElement();
			this.attachListener( htmlElement, 'mousedown', function( evt ) {
				// Setting focus directly on editor doesn't work, we
				// have to use here a temporary element to 'redirect'
				// the focus.
				if ( evt.data.getTarget().equals( htmlElement ) ) {
					editor.focus();
				}
			});
		}

		// Setting voice label as window title, backup the original one
		// and restore it before running into use.
		var title = editor.document.getElementsByTag( 'title' ).getItem( 0 );
		title.data( 'cke-title', editor.document.$.title );
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

			var config = editor.config;

			this._.fixForBody = ( config.enterMode != CKEDITOR.ENTER_BR && config.autoParagraph !== false ) ? config.enterMode == CKEDITOR.ENTER_DIV ? 'div' : 'p' : false;
			this._.frameLoadedHandler = CKEDITOR.tools.addFunction( onDomReady, this );
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
					var headExtra = '<style type="text/css" data-cke-temp="1">' +
						editor._.styles.join( '\n' ) +
						'</style>';

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
						data = editor.dataProcessor.toHtml( data, this._.fixForBody );

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
						data = config.docType + '<html dir="' + config.contentsLangDirection + '"' +
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
														'</html>';
					}

					// Distinguish bogus to normal BR at the end of document for Mozilla. (#5293).
					if ( CKEDITOR.env.gecko )
						data = data.replace( /<br \/>(?=\s*<\/(:?html|body)>)/, '$&<br type="_moz" />' );

					// The script that launches the bootstrap logic on 'domReady', so the document
					// is fully editable even before the editing iframe is fully loaded (#4455).

					var deferedSupport = CKEDITOR.env.ie || CKEDITOR.env.opera;
					var bootstrapCode = '<script id="cke_actscrpt" type="text/javascript"' + ( deferedSupport ? ' defer="defer" ' : '' ) + '>' +
						( isCustomDomain ? ( 'document.domain="' + document.domain + '";' ) : '' ) +
						'function onload(){window.parent.CKEDITOR.tools.callFunction( ' + this._.frameLoadedHandler + ', window );}' +
						( deferedSupport ? 'onload();' : 'document.addEventListener("DOMContentLoaded", onload );' ) +
						'</script>';

					data = data.replace( /(?=\s*<\/(:?head)>)/, bootstrapCode );

					this.clearCustomData();
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
						data = editor.dataProcessor.toDataFormat( data, this._.fixForBody );

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
				doc.getDocumentElement().clearCustomData();
				iframe.clearCustomData();
				CKEDITOR.tools.removeFunction( this._.frameLoadedHandler );

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
		var editable = editor.editable();

		// TODO: Check whether this is needed on inline mode.
		// Needed for full page only.
		if ( !editable.is( 'body' ) )
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
			var nativeRange = new CKEDITOR.dom.range( doc );
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
 * The writting direction of the language used to write the editor
 * contents. Allowed values are:
 * <ul>
 *     <li>'ui' - which indicate content direction will be the same with the user interface language direction;</li>
 *     <li>'ltr' - for Left-To-Right language (like English);</li>
 *     <li>'rtl' - for Right-To-Left languages (like Arabic).</li>
 * </ul>
 * @default 'ui'
 * @type String
 * @example
 * config.contentsLangDirection = 'rtl';
 */
CKEDITOR.config.contentsLangDirection = 'ui';

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
