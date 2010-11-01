/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'contextmenu', {
	requires: [ 'menu' ],

	beforeInit: function( editor ) {
		editor.contextMenu = new CKEDITOR.plugins.contextMenu( editor );

		editor.addCommand( 'contextMenu', {
			exec: function() {
				editor.contextMenu.show( editor.document.getBody() );
			}
		});
	}
});

CKEDITOR.plugins.contextMenu = CKEDITOR.tools.createClass({
	$: function( editor ) {
		this.id = CKEDITOR.tools.getNextId();
		this.editor = editor;
		this._.listeners = [];
		this._.functionId = CKEDITOR.tools.addFunction( function( commandName ) {
			this._.panel.hide();
			editor.focus();
			editor.execCommand( commandName );
		}, this );

		this.definition = {
			panel: {
				className: editor.skinClass + ' cke_contextmenu',
				attributes: {
					'aria-label': editor.lang.contextmenu.options
				}
			}
		};
	},

	_: {
		onMenu: function( offsetParent, corner, offsetX, offsetY ) {
			var menu = this._.menu,
				editor = this.editor;

			if ( menu ) {
				menu.hide();
				menu.removeAll();
			} else {
				menu = this._.menu = new CKEDITOR.menu( editor, this.definition );
				menu.onClick = CKEDITOR.tools.bind( function( item ) {
					menu.hide();

					if ( item.onClick )
						item.onClick();
					else if ( item.command )
						editor.execCommand( item.command );

				}, this );

				menu.onEscape = function( keystroke ) {
					var parent = this.parent;
					// 1. If it's sub-menu, restore the last focused item
					// of upper level menu.
					// 2. In case of a top-menu, close it.
					if ( parent ) {
						parent._.panel.hideChild();
						// Restore parent block item focus.
						var parentBlock = parent._.panel._.panel._.currentBlock,
							parentFocusIndex = parentBlock._.focusIndex;
						parentBlock._.markItem( parentFocusIndex );
					} else if ( keystroke == 27 ) {
						this.hide();
						editor.focus();
					}
					return false;
				};
			}

			var listeners = this._.listeners,
				includedItems = [];

			var selection = this.editor.getSelection(),
				element = selection && selection.getStartElement();

			menu.onHide = CKEDITOR.tools.bind( function() {
				menu.onHide = null;

				if ( CKEDITOR.env.ie ) {
					var selection = editor.getSelection();
					selection && selection.unlock();
				}

				this.onHide && this.onHide();
			}, this );

			// Call all listeners, filling the list of items to be displayed.
			for ( var i = 0; i < listeners.length; i++ ) {
				var listenerItems = listeners[ i ]( element, selection );

				if ( listenerItems ) {
					for ( var itemName in listenerItems ) {
						var item = this.editor.getMenuItem( itemName );

						if ( item ) {
							item.state = listenerItems[ itemName ];
							menu.add( item );
						}
					}
				}
			}

			// Don't show context menu with zero items.
			menu.items.length && menu.show( offsetParent, corner || ( editor.lang.dir == 'rtl' ? 2 : 1 ), offsetX, offsetY );
		}
	},

	proto: {
		addTarget: function( element, nativeContextMenuOnCtrl ) {

			// For browsers (Opera <=10a) that doesn't  support 'contextmenu' event, we have duo approaches employed here:
			// 1. Inherit the 'button override' hack we introduced in v2 (#4530) (In Opera browser, this require the
			//  option 'Allow script to detect context menu/right click events' to be always turned on).
			// 2. Considering the fact that ctrl/meta key is not been occupied
			//  for multiple range selecting (like Gecko), we use this key
			//  combination as a fallback for triggering context-menu. (#4530)
			if ( CKEDITOR.env.opera && !( 'oncontextmenu' in document.body ) ) {
				var contextMenuOverrideButton;
				element.on( 'mousedown', function( evt ) {
					evt = evt.data;
					if ( evt.$.button != 2 ) {
						if ( evt.getKeystroke() == CKEDITOR.CTRL + 1 )
							element.fire( 'contextmenu', evt );
						return;
					}

					if ( nativeContextMenuOnCtrl && ( CKEDITOR.env.mac ? evt.$.metaKey : evt.$.ctrlKey ) )
						return;

					var target = evt.getTarget();

					if ( !contextMenuOverrideButton ) {
						var ownerDoc = target.getDocument();
						contextMenuOverrideButton = ownerDoc.createElement( 'input' );
						contextMenuOverrideButton.$.type = 'button';
						ownerDoc.getBody().append( contextMenuOverrideButton );
					}

					contextMenuOverrideButton.setAttribute( 'style', 'position:absolute;top:' + ( evt.$.clientY - 2 ) +
												'px;left:' + ( evt.$.clientX - 2 ) +
												'px;width:5px;height:5px;opacity:0.01' );

				});

				element.on( 'mouseup', function( evt ) {
					if ( contextMenuOverrideButton ) {
						contextMenuOverrideButton.remove();
						contextMenuOverrideButton = undefined;
						// Simulate 'contextmenu' event.
						element.fire( 'contextmenu', evt.data );
					}
				});
			}

			element.on( 'contextmenu', function( event ) {
				var domEvent = event.data;

				if ( nativeContextMenuOnCtrl &&
				// Safari on Windows always show 'ctrlKey' as true in 'contextmenu' event,
				// which make this property unreliable. (#4826)
				( CKEDITOR.env.webkit ? holdCtrlKey : ( CKEDITOR.env.mac ? domEvent.$.metaKey : domEvent.$.ctrlKey ) ) )
					return;


				// Cancel the browser context menu.
				domEvent.preventDefault();

				var offsetParent = domEvent.getTarget().getDocument().getDocumentElement(),
					offsetX = domEvent.$.clientX,
					offsetY = domEvent.$.clientY;

				CKEDITOR.tools.setTimeout( function() {
					this.show( offsetParent, null, offsetX, offsetY );
				}, 0, this );
			}, this );

			if ( CKEDITOR.env.opera ) {
				// 'contextmenu' event triggered by Windows menu key is unpreventable,
				// cancel the key event itself. (#6534)  
				element.on( 'keypress', function( evt ) {
					var domEvent = evt.data;

					if ( domEvent.$.keyCode == 0 )
						domEvent.preventDefault();
				});
			}

			if ( CKEDITOR.env.webkit ) {
				var holdCtrlKey,
					onKeyDown = function( event ) {
						holdCtrlKey = CKEDITOR.env.mac ? event.data.$.metaKey : event.data.$.ctrlKey;
					},
					resetOnKeyUp = function() {
						holdCtrlKey = 0;
					};

				element.on( 'keydown', onKeyDown );
				element.on( 'keyup', resetOnKeyUp );
				element.on( 'contextmenu', resetOnKeyUp );
			}
		},

		addListener: function( listenerFn ) {
			this._.listeners.push( listenerFn );
		},

		show: function( offsetParent, corner, offsetX, offsetY ) {
			this.editor.focus();

			// Selection will be unavailable after context menu shows up
			// in IE, lock it now.
			if ( CKEDITOR.env.ie ) {
				var selection = this.editor.getSelection();
				selection && selection.lock();
			}

			this._.onMenu( offsetParent || CKEDITOR.document.getDocumentElement(), corner, offsetX || 0, offsetY || 0 );
		}
	}
});

/**
 * Whether to show the browser native context menu when the CTRL or the
 * META (Mac) key is pressed while opening the context menu.
 * @name CKEDITOR.config.browserContextMenuOnCtrl
 * @since 3.0.2
 * @type Boolean
 * @default true
 * @example
 * config.browserContextMenuOnCtrl = false;
 */
