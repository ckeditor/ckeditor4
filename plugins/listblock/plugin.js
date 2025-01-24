/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

CKEDITOR.plugins.add( 'listblock', {
	requires: 'panel',

	onLoad: function() {
		var list = CKEDITOR.addTemplate( 'panel-list', '<ul role="presentation" class="cke_panel_list">{items}</ul>' ),
			listItem = CKEDITOR.addTemplate( 'panel-list-item', '<li id="{id}" class="cke_panel_listItem" role=presentation>' +
				'<a id="{id}_option" _cke_focus=1 hidefocus=true' +
					' title="{title}"' +
					' draggable="false"' +
					' ondragstart="return false;"' + // Draggable attribute is buggy on Firefox.
					' href="javascript:void(\'{val}\')" ' +
					' {language}' +
					' onclick="{onclick}CKEDITOR.tools.callFunction({clickFn},\'{val}\'); return false;"' + // https://dev.ckeditor.com/ticket/188
						' role="option">' +
					'{text}' +
				'</a>' +
				'</li>' ),
			listGroup = CKEDITOR.addTemplate( 'panel-list-group', '<h1 id="{id}" draggable="false" ondragstart="return false;" class="cke_panel_grouptitle" role="presentation" >{label}</h1>' ),
			reSingleQuote = /\'/g,
			escapeSingleQuotes = function( str ) {
				return str.replace( reSingleQuote, '\\\'' );
			};

		CKEDITOR.ui.panel.prototype.addListBlock = function( name, definition ) {
			return this.addBlock( name, new CKEDITOR.ui.listBlock( this.getHolderElement(), definition ) );
		};

		CKEDITOR.ui.listBlock = CKEDITOR.tools.createClass( {
			base: CKEDITOR.ui.panel.block,

			$: function( blockHolder, blockDefinition ) {
				blockDefinition = blockDefinition || {};

				var attribs = blockDefinition.attributes || ( blockDefinition.attributes = {} );
				( this.multiSelect = !!blockDefinition.multiSelect ) && ( attribs[ 'aria-multiselectable' ] = true );
				// Provide default role of 'listbox'.
				!attribs.role && ( attribs.role = 'listbox' );

				// Call the base contructor.
				this.base.apply( this, arguments );

				// Set the proper a11y attributes.
				this.element.setAttribute( 'role', attribs.role );

				var keys = this.keys;
				keys[ 40 ] = 'next'; // ARROW-DOWN
				keys[ 9 ] = 'next'; // TAB
				keys[ 38 ] = 'prev'; // ARROW-UP
				keys[ CKEDITOR.SHIFT + 9 ] = 'prev'; // SHIFT + TAB
				keys[ 32 ] = CKEDITOR.env.ie ? 'mouseup' : 'click'; // SPACE
				CKEDITOR.env.ie && ( keys[ 13 ] = 'mouseup' ); // Manage ENTER, since onclick is blocked in IE (https://dev.ckeditor.com/ticket/8041).

				this._.pendingHtml = [];
				this._.pendingList = [];
				this._.items = {};
				this._.groups = {};
			},

			_: {
				close: function() {
					if ( this._.started ) {
						var output = list.output( { items: this._.pendingList.join( '' ) } );
						this._.pendingList = [];
						this._.pendingHtml.push( output );
						delete this._.started;
					}
				},

				getClick: function() {
					if ( !this._.click ) {
						this._.click = CKEDITOR.tools.addFunction( function( value ) {
							var marked = this.toggle( value );
							if ( this.onClick )
								this.onClick( value, marked );
						}, this );
					}
					return this._.click;
				}
			},

			proto: {
				add: function( value, html, title, language ) {
					var id = CKEDITOR.tools.getNextId();

					if ( !this._.started ) {
						this._.started = 1;
						this._.size = this._.size || 0;
					}

					this._.items[ value ] = id;

					var data = {
						id: id,
						val: escapeSingleQuotes( CKEDITOR.tools.htmlEncodeAttr( value ) ),
						// Add check for left mouse button (#2857).
						onclick: CKEDITOR.env.ie ?
							'return false;" onmouseup="CKEDITOR.tools.getMouseButton(event)===CKEDITOR.MOUSE_BUTTON_LEFT&&' : '',
						clickFn: this._.getClick(),
						title: CKEDITOR.tools.htmlEncodeAttr( title || value ),
						text: html || value,
						language: language ? 'lang="' + language + '"' : ''
					};

					this._.pendingList.push( listItem.output( data ) );
				},

				startGroup: function( title ) {
					this._.close();

					var id = CKEDITOR.tools.getNextId();

					this._.groups[ title ] = id;

					this._.pendingHtml.push( listGroup.output( { id: id, label: title } ) );
				},

				commit: function() {
					this._.close();
					this.element.appendHtml( this._.pendingHtml.join( '' ) );
					delete this._.size;

					this._.pendingHtml = [];
				},

				toggle: function( value ) {
					var isMarked = this.isMarked( value );

					if ( isMarked )
						this.unmark( value );
					else
						this.mark( value );

					return !isMarked;
				},

				hideGroup: function( groupTitle ) {
					var group = this.element.getDocument().getById( this._.groups[ groupTitle ] ),
						list = group && group.getNext();

					if ( group ) {
						group.setStyle( 'display', 'none' );

						if ( list && list.getName() == 'ul' )
							list.setStyle( 'display', 'none' );
					}
				},

				hideItem: function( value ) {
					this.element.getDocument().getById( this._.items[ value ] ).setStyle( 'display', 'none' );
				},

				showAll: function() {
					var items = this._.items,
						groups = this._.groups,
						doc = this.element.getDocument();

					for ( var value in items ) {
						doc.getById( items[ value ] ).setStyle( 'display', '' );
					}

					for ( var title in groups ) {
						var group = doc.getById( groups[ title ] ),
							list = group.getNext();

						group.setStyle( 'display', '' );

						if ( list && list.getName() == 'ul' )
							list.setStyle( 'display', '' );
					}
				},

				mark: function( value ) {
					if ( !this.multiSelect )
						this.unmarkAll();

					var itemId = this._.items[ value ],
						item = this.element.getDocument().getById( itemId );
					item.addClass( 'cke_selected' );

					this.element.getDocument().getById( itemId + '_option' ).setAttribute( 'aria-selected', true );
					this.onMark && this.onMark( item );
				},

				unmark: function( value ) {
					var doc = this.element.getDocument(),
						itemId = this._.items[ value ],
						item = doc.getById( itemId );

					item.removeClass( 'cke_selected' );
					doc.getById( itemId + '_option' ).removeAttribute( 'aria-selected' );

					this.onUnmark && this.onUnmark( item );
				},

				unmarkAll: function() {
					var items = this._.items,
						doc = this.element.getDocument();

					for ( var value in items ) {
						var itemId = items[ value ];

						doc.getById( itemId ).removeClass( 'cke_selected' );
						doc.getById( itemId + '_option' ).removeAttribute( 'aria-selected' );
					}

					this.onUnmark && this.onUnmark();
				},

				isMarked: function( value ) {
					return this.element.getDocument().getById( this._.items[ value ] ).hasClass( 'cke_selected' );
				},

				focus: function( value ) {
					this._.focusIndex = -1;

					var links = this.element.getElementsByTag( 'a' ),
						link,
						selected,
						i = -1;

					if ( value ) {
						selected = this.element.getDocument().getById( this._.items[ value ] ).getFirst();

						while ( ( link = links.getItem( ++i ) ) ) {
							if ( link.equals( selected ) ) {
								this._.focusIndex = i;
								break;
							}
						}
					}
					else {
						this.element.focus();
					}

					selected && setTimeout( function() {
						selected.focus();
					}, 0 );
				}
			}
		} );
	}
} );
