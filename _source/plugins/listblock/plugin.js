/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'listblock', {
	requires: [ 'panel' ],

	onLoad: function() {
		CKEDITOR.ui.panel.prototype.addListBlock = function( name, multiSelect ) {
			return this.addBlock( name, new CKEDITOR.ui.listBlock( this.getHolderElement(), multiSelect ) );
		};

		CKEDITOR.ui.listBlock = CKEDITOR.tools.createClass({
			base: CKEDITOR.ui.panel.block,

			$: function( blockHolder, multiSelect ) {
				// Call the base contructor.
				this.base( blockHolder );

				this.multiSelect = !!multiSelect;

				this._.pendingHtml = [];
				this._.items = {};
				this._.groups = {};
			},

			_: {
				close: function() {
					if ( this._.started ) {
						this._.pendingHtml.push( '</ul>' );
						delete this._.started;
					}
				},

				getClick: function() {
					if ( !this._.click ) {
						this._.click = CKEDITOR.tools.addFunction( function( value ) {
							var marked = true;

							if ( this.multiSelect )
								marked = this.toggle( value );
							else
								this.mark( value );

							if ( this.onClick )
								this.onClick( value, marked );
						}, this );
					}
					return this._.click;
				}
			},

			proto: {
				add: function( value, html ) {
					var pendingHtml = this._.pendingHtml,
						id = CKEDITOR.tools.getNextNumber();

					if ( !this._.started ) {
						pendingHtml.push( '<ul class=cke_panel_list>' );
						this._.started = 1;
					}

					this._.items[ value ] = id;

					pendingHtml.push( '<li id=cke_', id, ' class=cke_panel_listItem><a hidefocus=true href="javascript:void(\'', value, '\')" onclick="CKEDITOR.tools.callFunction(', this._.getClick(), ',\'', value, '\');">', html || value, '</a></li>' );
				},

				startGroup: function( title ) {
					this._.close();

					var id = CKEDITOR.tools.getNextNumber();

					this._.groups[ title ] = id;

					this._.pendingHtml.push( '<h1 id=cke_', id, ' class=cke_panel_grouptitle>', title, '</h1>' );
				},

				commit: function() {
					this._.close();
					this.element.appendHtml( this._.pendingHtml.join( '' ) );
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
					var group = this.element.getDocument().getById( 'cke_' + this._.groups[ groupTitle ] ),
						list = group && group.getNext();

					if ( group ) {
						group.setStyle( 'display', 'none' );

						if ( list && list.getName() == 'ul' )
							list.setStyle( 'display', 'none' );
					}
				},

				hideItem: function( value ) {
					this.element.getDocument().getById( 'cke_' + this._.items[ value ] ).setStyle( 'display', 'none' );
				},

				showAll: function() {
					var items = this._.items,
						groups = this._.groups,
						doc = this.element.getDocument();

					for ( var value in items ) {
						doc.getById( 'cke_' + items[ value ] ).setStyle( 'display', '' );
					}

					for ( title in groups ) {
						var group = doc.getById( 'cke_' + groups[ title ] ),
							list = group.getNext();

						group.setStyle( 'display', '' );

						if ( list && list.getName() == 'ul' )
							list.setStyle( 'display', '' );
					}
				},

				mark: function( value ) {
					if ( !this.multiSelect )
						this.unmarkAll();

					this.element.getDocument().getById( 'cke_' + this._.items[ value ] ).addClass( 'cke_selected' );
				},

				unmark: function( value ) {
					this.element.getDocument().getById( 'cke_' + this._.items[ value ] ).removeClass( 'cke_selected' );
				},

				unmarkAll: function() {
					var items = this._.items,
						doc = this.element.getDocument();

					for ( var value in items ) {
						doc.getById( 'cke_' + items[ value ] ).removeClass( 'cke_selected' );
					}
				},

				isMarked: function( value ) {
					return this.element.getDocument().getById( 'cke_' + this._.items[ value ] ).hasClass( 'cke_selected' );
				}
			}
		});
	}
});
