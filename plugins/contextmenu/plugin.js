/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.add( 'contextmenu', {
	requires: 'menu',

	// jscs:disable maximumLineLength
	lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
	// jscs:enable maximumLineLength

	// Make sure the base class (CKEDITOR.menu) is loaded before it (https://dev.ckeditor.com/ticket/3318).
	onLoad: function() {
		/**
		 * Class replacing the non-configurable native context menu with a configurable CKEditor's equivalent.
		 *
		 * @class
		 * @extends CKEDITOR.menu
		 */
		CKEDITOR.plugins.contextMenu = CKEDITOR.tools.createClass( {
			base: CKEDITOR.menu,

			/**
			 * Creates the CKEDITOR.plugins.contextMenu class instance.
			 *
			 * @constructor
			 * @param {CKEDITOR.editor} editor
			 */
			$: function( editor ) {
				this.base.call( this, editor, {
					panel: {
						// Allow adding custom CSS (#2202).
						css: editor.config.contextmenu_contentsCss,
						className: 'cke_menu_panel',
						attributes: {
							'aria-label': editor.lang.contextmenu.options
						}
					}
				} );
			},

			proto: {
				/**
				 * Starts watching on native context menu triggers (<kbd>Option</kbd> key, right click) on the given element.
				 *
				 * @param {CKEDITOR.dom.element} element
				 * @param {Boolean} [nativeContextMenuOnCtrl] Whether to open native context menu if the
				 * <kbd>Ctrl</kbd> key is held on opening the context menu. See {@link CKEDITOR.config#browserContextMenuOnCtrl}.
				 */
				addTarget: function( element, nativeContextMenuOnCtrl ) {
					var holdCtrlKey,
						keystrokeActive;

					element.on( 'contextmenu', function( event ) {
						var domEvent = event.data,
							isCtrlKeyDown =
								// Safari on Windows always show 'ctrlKey' as true in 'contextmenu' event,
								// which make this property unreliable. (https://dev.ckeditor.com/ticket/4826)
								( CKEDITOR.env.webkit ? holdCtrlKey : ( CKEDITOR.env.mac ? domEvent.$.metaKey : domEvent.$.ctrlKey ) );

						if ( nativeContextMenuOnCtrl && isCtrlKeyDown )
							return;

						// Cancel the browser context menu.
						domEvent.preventDefault();

						// Do not react to this event, as it might open context menu in wrong position (#2548).
						if ( keystrokeActive ) {
							return;
						}

						// Fix selection when non-editable element in Webkit/Blink (Mac) (https://dev.ckeditor.com/ticket/11306).
						if ( CKEDITOR.env.mac && CKEDITOR.env.webkit ) {
							var editor = this.editor,
								contentEditableParent = new CKEDITOR.dom.elementPath( domEvent.getTarget(), editor.editable() ).contains( function( el ) {
									// Return when non-editable or nested editable element is found.
									return el.hasAttribute( 'contenteditable' );
								}, true ); // Exclude editor's editable.

							// Fake selection for non-editables only (to exclude nested editables).
							if ( contentEditableParent && contentEditableParent.getAttribute( 'contenteditable' ) == 'false' )
								editor.getSelection().fake( contentEditableParent );
						}

						var doc = domEvent.getTarget().getDocument(),
							offsetParent = domEvent.getTarget().getDocument().getDocumentElement(),
							fromFrame = !doc.equals( CKEDITOR.document ),
							scroll = doc.getWindow().getScrollPosition(),
							offsetX = fromFrame ? domEvent.$.clientX : domEvent.$.pageX || scroll.x + domEvent.$.clientX,
							offsetY = fromFrame ? domEvent.$.clientY : domEvent.$.pageY || scroll.y + domEvent.$.clientY;

						CKEDITOR.tools.setTimeout( function() {
							this.open( offsetParent, null, offsetX, offsetY );

							// IE needs a short while to allow selection change before opening menu. (https://dev.ckeditor.com/ticket/7908)
						}, CKEDITOR.env.ie ? 200 : 0, this );
					}, this );

					if ( CKEDITOR.env.webkit ) {
						var onKeyDown = function( event ) {
								holdCtrlKey = CKEDITOR.env.mac ? event.data.$.metaKey : event.data.$.ctrlKey;
							},
							resetOnKeyUp = function() {
								holdCtrlKey = 0;
							};

						element.on( 'keydown', onKeyDown );
						element.on( 'keyup', resetOnKeyUp );
						element.on( 'contextmenu', resetOnKeyUp );
					}

					// Block subsequent contextmenu event, when Shift + F10 is pressed (#2548).
					if ( CKEDITOR.env.gecko && !CKEDITOR.env.mac ) {
						element.on( 'keydown', function( evt ) {
							if ( evt.data.$.shiftKey && evt.data.$.keyCode === 121 ) {
								keystrokeActive = true;
							}
						}, null, null, 0 );

						element.on( 'keyup', resetKeystrokeState );
						element.on( 'contextmenu', resetKeystrokeState );
					}

					function resetKeystrokeState() {
						keystrokeActive = false;
					}
				},

				/**
				 * Opens the context menu in the given location. See the {@link CKEDITOR.menu#show} method.
				 *
				 * @param {CKEDITOR.dom.element} offsetParent
				 * @param {Number} [corner]
				 * @param {Number} [offsetX]
				 * @param {Number} [offsetY]
				 */
				open: function( offsetParent, corner, offsetX, offsetY ) {
					// Do not open context menu if it's disabled or there is no selection in the editor (#1181).
					if ( this.editor.config.enableContextMenu === false ||
						this.editor.getSelection().getType() === CKEDITOR.SELECTION_NONE ) {
						return;
					}

					this.editor.focus();
					offsetParent = offsetParent || CKEDITOR.document.getDocumentElement();

					// https://dev.ckeditor.com/ticket/9362: Force selection check to update commands' states in the new context.
					this.editor.selectionChange( 1 );

					this.show( offsetParent, corner, offsetX, offsetY );
				}
			}
		} );
	},

	beforeInit: function( editor ) {
		/**
		 * @readonly
		 * @property {CKEDITOR.plugins.contextMenu} contextMenu
		 * @member CKEDITOR.editor
		 */
		var contextMenu = editor.contextMenu = new CKEDITOR.plugins.contextMenu( editor );

		editor.on( 'contentDom', function() {
			contextMenu.addTarget( editor.editable(), editor.config.browserContextMenuOnCtrl !== false );
		} );

		editor.addCommand( 'contextMenu', {
			exec: function( editor ) {
				var offsetX = 0,
					offsetY = 0,
					ranges = editor.getSelection().getRanges(),
					rects,
					rect;

				// When opening context menu via keystroke there is no offsetX and Y passed (#1451).
				rects = ranges[ ranges.length - 1 ].getClientRects( editor.editable().isInline() );
				rect = rects[ rects.length - 1 ];

				if ( rect ) {
					offsetX = rect[ editor.lang.dir === 'rtl' ? 'left' : 'right' ];
					offsetY = rect.bottom;
				}

				editor.contextMenu.open( editor.document.getBody().getParent(), null, offsetX, offsetY );
			}
		} );

		editor.setKeystroke( CKEDITOR.SHIFT + 121 /*F10*/, 'contextMenu' );
		editor.setKeystroke( CKEDITOR.CTRL + CKEDITOR.SHIFT + 121 /*F10*/, 'contextMenu' );
	}
} );

/**
 * Whether to show the browser native context menu when the <kbd>Ctrl</kbd> or
 * <kbd>Meta</kbd> (Mac) key is pressed on opening the context menu with the
 * right mouse button click or the <kbd>Menu</kbd> key.
 *
 * ```javascript
 * config.browserContextMenuOnCtrl = false;
 * ```
 *
 * @since 3.0.2
 * @cfg {Boolean} [browserContextMenuOnCtrl=true]
 * @member CKEDITOR.config
 */

/**
 * Whether to enable the context menu. Regardless of the setting the [Context Menu](https://ckeditor.com/cke4/addon/contextmenu)
 * plugin is still loaded.
 *
 * ```javascript
 * config.enableContextMenu = false;
 * ```
 *
 * @since 4.7.0
 * @cfg {Boolean} [enableContextMenu=true]
 * @member CKEDITOR.config
 */

/**
 * The CSS file(s) to be used to apply the style to the context menu content.
 *
 * ```javascript
 * config.contextmenu_contentsCss = '/css/myfile.css';
 * config.contextmenu_contentsCss = [ '/css/myfile.css', '/css/anotherfile.css' ];
 * ```
 *
 * @since 4.11.0
 * @cfg {String/String[]} [contextmenu_contentsCss=CKEDITOR.skin.getPath( 'editor' )]
 * @member CKEDITOR.config
 */
