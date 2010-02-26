/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'menu', {
	beforeInit: function( editor ) {
		var groups = editor.config.menu_groups.split( ',' ),
			groupsOrder = editor._.menuGroups = {},
			menuItems = editor._.menuItems = {};

		for ( var i = 0; i < groups.length; i++ )
			groupsOrder[ groups[ i ] ] = i + 1;

		editor.addMenuGroup = function( name, order ) {
			groupsOrder[ name ] = order || 100;
		};

		editor.addMenuItem = function( name, definition ) {
			if ( groupsOrder[ definition.group ] )
				menuItems[ name ] = new CKEDITOR.menuItem( this, name, definition );
		};

		editor.addMenuItems = function( definitions ) {
			for ( var itemName in definitions ) {
				this.addMenuItem( itemName, definitions[ itemName ] );
			}
		};

		editor.getMenuItem = function( name ) {
			return menuItems[ name ];
		};
	},

	requires: [ 'floatpanel' ]
});

(function() {
	CKEDITOR.menu = CKEDITOR.tools.createClass({
		$: function( editor, definition ) {
			definition = this._.definition = definition || {};
			this.id = 'cke_' + CKEDITOR.tools.getNextNumber();

			this.editor = editor;
			this.items = [];

			this._.level = definition.level || 1;

			var panelDefinition = CKEDITOR.tools.extend( {}, definition.panel, {
				css: editor.skin.editor.css,
				level: this._.level - 1,
				block: {}
			});

			var attrs = panelDefinition.block.attributes = ( panelDefinition.attributes || {} );
			// Provide default role of 'menu'.
			!attrs.role && ( attrs.role = 'menu' );
			this._.panelDefinition = panelDefinition;
		},

		_: {
			showSubMenu: function( index ) {
				var menu = this._.subMenu,
					item = this.items[ index ],
					subItemDefs = item.getItems && item.getItems();

				// If this item has no subitems, we just hide the submenu, if
				// available, and return back.
				if ( !subItemDefs ) {
					this._.panel.hideChild();
					return;
				}

				// Record parent menu focused item first (#3389).
				var block = this._.panel.getBlock( this.id );
				block._.focusIndex = index;

				// Create the submenu, if not available, or clean the existing
				// one.
				if ( menu )
					menu.removeAll();
				else {
					menu = this._.subMenu = new CKEDITOR.menu( this.editor, CKEDITOR.tools.extend( {}, this._.definition, { level: this._.level + 1 }, true ) );
					menu.parent = this;
					menu.onClick = CKEDITOR.tools.bind( this.onClick, this );
					// Sub menu use their own scope for binding onEscape.
					menu.onEscape = this.onEscape;
				}

				// Add all submenu items to the menu.
				for ( var subItemName in subItemDefs ) {
					var subItem = this.editor.getMenuItem( subItemName );
					if ( subItem ) {
						subItem.state = subItemDefs[ subItemName ];
						menu.add( subItem );
					}
				}

				// Get the element representing the current item.
				var element = this._.panel.getBlock( this.id ).element.getDocument().getById( this.id + String( index ) );

				// Show the submenu.
				menu.show( element, 2 );
			}
		},

		proto: {
			add: function( item ) {
				// Later we may sort the items, but Array#sort is not stable in
				// some browsers, here we're forcing the original sequence with
				// 'order' attribute if it hasn't been assigned. (#3868)
				if ( !item.order )
					item.order = this.items.length;

				this.items.push( item );
			},

			removeAll: function() {
				this.items = [];
			},

			show: function( offsetParent, corner, offsetX, offsetY ) {
				var items = this.items,
					editor = this.editor,
					panel = this._.panel,
					element = this._.element;

				// Create the floating panel for this menu.
				if ( !panel ) {
					panel = this._.panel = new CKEDITOR.ui.floatPanel( this.editor, CKEDITOR.document.getBody(), this._.panelDefinition, this._.level );

					panel.onEscape = CKEDITOR.tools.bind( function( keystroke ) {
						if ( this.onEscape && this.onEscape( keystroke ) === false )
							return false;
					}, this );

					panel.onHide = CKEDITOR.tools.bind( function() {
						this.onHide && this.onHide();
					}, this );

					// Create an autosize block inside the panel.
					var block = panel.addBlock( this.id, this._.panelDefinition.block );
					block.autoSize = true;

					var keys = block.keys;
					keys[ 40 ] = 'next'; // ARROW-DOWN
					keys[ 9 ] = 'next'; // TAB
					keys[ 38 ] = 'prev'; // ARROW-UP
					keys[ CKEDITOR.SHIFT + 9 ] = 'prev'; // SHIFT + TAB
					keys[ 32 ] = 'click'; // SPACE
					keys[ ( editor.lang.dir == 'rtl' ? 37 : 39 ) ] = 'click'; // ARROW-RIGHT/ARROW-LEFT(rtl)

					element = this._.element = block.element;
					element.addClass( editor.skinClass );

					var elementDoc = element.getDocument();
					elementDoc.getBody().setStyle( 'overflow', 'hidden' );
					elementDoc.getElementsByTag( 'html' ).getItem( 0 ).setStyle( 'overflow', 'hidden' );

					this._.itemOverFn = CKEDITOR.tools.addFunction( function( index ) {
						clearTimeout( this._.showSubTimeout );
						this._.showSubTimeout = CKEDITOR.tools.setTimeout( this._.showSubMenu, editor.config.menu_subMenuDelay, this, [ index ] );
					}, this );

					this._.itemOutFn = CKEDITOR.tools.addFunction( function( index ) {
						clearTimeout( this._.showSubTimeout );
					}, this );

					this._.itemClickFn = CKEDITOR.tools.addFunction( function( index ) {
						var item = this.items[ index ];

						if ( item.state == CKEDITOR.TRISTATE_DISABLED ) {
							this.hide();
							return;
						}

						if ( item.getItems )
							this._.showSubMenu( index );
						else
							this.onClick && this.onClick( item );
					}, this );
				}

				// Put the items in the right order.
				sortItems( items );

				// Build the HTML that composes the menu and its items.
				var output = [ '<div class="cke_menu" role="presentation">' ];

				var length = items.length,
					lastGroup = length && items[ 0 ].group;

				for ( var i = 0; i < length; i++ ) {
					var item = items[ i ];
					if ( lastGroup != item.group ) {
						output.push( '<div class="cke_menuseparator" role="separator"></div>' );
						lastGroup = item.group;
					}

					item.render( this, i, output );
				}

				output.push( '</div>' );

				// Inject the HTML inside the panel.
				element.setHtml( output.join( '' ) );

				// Show the panel.
				if ( this.parent )
					this.parent._.panel.showAsChild( panel, this.id, offsetParent, corner, offsetX, offsetY );
				else
					panel.showBlock( this.id, offsetParent, corner, offsetX, offsetY );

				editor.fire( 'menuShow', [ panel ] );
			},

			hide: function() {
				this._.panel && this._.panel.hide();
			}
		}
	});

	function sortItems( items ) {
		items.sort( function( itemA, itemB ) {
			if ( itemA.group < itemB.group )
				return -1;
			else if ( itemA.group > itemB.group )
				return 1;

			return itemA.order < itemB.order ? -1 : itemA.order > itemB.order ? 1 : 0;
		});
	}
})();

CKEDITOR.menuItem = CKEDITOR.tools.createClass({
	$: function( editor, name, definition ) {
		CKEDITOR.tools.extend( this, definition,
		// Defaults
		{
			order: 0,
			className: 'cke_button_' + name
		});

		// Transform the group name into its order number.
		this.group = editor._.menuGroups[ this.group ];

		this.editor = editor;
		this.name = name;
	},

	proto: {
		render: function( menu, index, output ) {
			var id = menu.id + String( index ),
				state = ( typeof this.state == 'undefined' ) ? CKEDITOR.TRISTATE_OFF : this.state;

			var classes = ' cke_' + ( state == CKEDITOR.TRISTATE_ON ? 'on' : state == CKEDITOR.TRISTATE_DISABLED ? 'disabled' : 'off' );

			var htmlLabel = this.label;

			if ( this.className )
				classes += ' ' + this.className;

			var hasSubMenu = this.getItems;

			output.push( '<span class="cke_menuitem">' +
				'<a id="', id, '"' +
					' class="', classes, '" href="javascript:void(\'', ( this.label || '' ).replace( "'", '' ), '\')"' +
					' title="', this.label, '"' +
					' tabindex="-1"' +
					'_cke_focus=1' +
					' hidefocus="true"' +
					' role="menuitem"' +
					( hasSubMenu ? 'aria-haspopup="true"' : '' ) +
					( state == CKEDITOR.TRISTATE_DISABLED ? 'aria-disabled="true"' : '' ) +
					( state == CKEDITOR.TRISTATE_ON ? 'aria-pressed="true"' : '' ) );

			// Some browsers don't cancel key events in the keydown but in the
			// keypress.
			// TODO: Check if really needed for Gecko+Mac.
			if ( CKEDITOR.env.opera || ( CKEDITOR.env.gecko && CKEDITOR.env.mac ) ) {
				output.push( ' onkeypress="return false;"' );
			}

			// With Firefox, we need to force the button to redraw, otherwise it
			// will remain in the focus state.
			if ( CKEDITOR.env.gecko ) {
				output.push( ' onblur="this.style.cssText = this.style.cssText;"' );
			}

			var offset = ( this.iconOffset || 0 ) * -16;
			output.push(
			//					' onkeydown="return CKEDITOR.ui.button._.keydown(', index, ', event);"' +
			' onmouseover="CKEDITOR.tools.callFunction(', menu._.itemOverFn, ',', index, ');"' +
				' onmouseout="CKEDITOR.tools.callFunction(', menu._.itemOutFn, ',', index, ');"' +
				' onclick="CKEDITOR.tools.callFunction(', menu._.itemClickFn, ',', index, '); return false;"' +
				'>' +
					'<span class="cke_icon_wrapper"><span class="cke_icon"' +
						( this.icon ? ' style="background-image:url(' + CKEDITOR.getUrl( this.icon ) + ');background-position:0 ' + offset + 'px;"'
											: '' ) +
						'></span></span>' +
					'<span class="cke_label">' );

			if ( hasSubMenu ) {
				output.push( '<span class="cke_menuarrow">', '<span>&#', ( this.editor.lang.dir == 'rtl' ? '9668' : // BLACK LEFT-POINTING POINTER
				'9658' ), // BLACK RIGHT-POINTING POINTER
				';</span>', '</span>' );
			}

			output.push( htmlLabel, '</span>' +
				'</a>' +
				'</span>' );
		}
	}
});

/**
 * The amount of time, in milliseconds, the editor waits before showing submenu
 * options when moving the mouse over options that contains submenus, like the
 * "Cell Properties" entry for tables.
 * @type Number
 * @default 400
 * @example
 * // Remove the submenu delay.
 * config.menu_subMenuDelay = 0;
 */
CKEDITOR.config.menu_subMenuDelay = 400;

/**
 * A comma separated list of items group names to be displayed in the context
 * menu. The items order will reflect the order in this list if no priority
 * has been definted in the groups.
 * @type String
 * @default 'clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea'
 * @example
 * config.menu_groups = 'clipboard,table,anchor,link,image';
 */
CKEDITOR.config.menu_groups = 'clipboard,' +
	'form,' +
	'tablecell,tablecellproperties,tablerow,tablecolumn,table,' +
	'anchor,link,image,flash,' +
	'checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div';
