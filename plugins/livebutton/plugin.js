( function() {
	'use strict';

	CKEDITOR.plugins.add( 'livebutton', {
		requires: 'panelbutton',
		beforeInit: function( editor ) {
			CKEDITOR.document.appendStyleSheet( this.path + 'styles/livebutton.css' );

			// Note that liveButton needs to be loaded in beforeInit method, rather than onLoad, as it depends on the livebutton, which is inited in onLoad.
			// Since CKEditor does not guarantee a proper onLoad order, it has to be defined in beforeInit method (#1142).

			/**
			 * @class
			 * @extends CKEDITOR.ui.button
			 */
			CKEDITOR.ui.liveButton = CKEDITOR.tools.createClass( {
				base: CKEDITOR.ui.panelButton,

				/**
				 * Creates a liveButton class instance.
				 *
				 * @constructor
				 * @param Object definition
				 */
				$: function( definition ) {
					this.parts = {};

					this.base( definition );

					var colorPart = new CKEDITOR.dom.element( 'span' );
					colorPart.addClass( 'cke_toolbar_font_color' );
					colorPart.hide(); // By default start with a hidden indicator.

					this.parts.color = {
						colorStyle: definition.parts && definition.parts.color && definition.parts.color.colorStyle,
						element: colorPart,
						refresh: function( sel, path ) {
							var colorStyle = this.colorStyle || 'color',
								colorIndicator = this.element,
								matches = CKEDITOR.tools.array.filter( path.elements, function( el ) {
									var isCorrectElement = el && el.getName && el.getName() == 'span',
										color = isCorrectElement && el.getStyle( colorStyle );

									return isCorrectElement && color;
								} );

							if ( matches.length ) {
								colorIndicator.setStyle( 'background-color', matches[ 0 ].getStyle( colorStyle ) );
								colorIndicator.show();
							} else {
								colorIndicator.hide();
							}
						}
					};

					this.parts.icon = {
						selector: '.cke_button_icon',
						refresh: function( sel, path ) {
							var colorStyle = 'color',
								iconHolder = this.element,
								matches = CKEDITOR.tools.array.filter( path.elements, function( el ) {
									var isCorrectElement = el && el.getName && el.getName() == 'span',
										color = isCorrectElement && el.getStyle( colorStyle );

									return isCorrectElement && color;
								} );

							// Only green font color will trigger the function.
							if ( matches.length && matches[ 0 ].getStyle( 'color' ) == 'rgb(0, 255, 0)' ) {
								var buttonNameMatch = /^cke_button__(.+)_icon$/,
									iconName = Array.from( iconHolder.$.classList )
									.filter( function( className ) {
										return className.match( buttonNameMatch );
									} )
									.map( function( className ) {
										return className.match( buttonNameMatch )[ 1 ];
									} );

								iconName = iconName && iconName[ 0 ];

								iconHolder.data( 'initial-icon', iconName );

								iconHolder.setAttribute( 'style', CKEDITOR.skin.getIconStyle( 'numberedlist', false, this.icon, this.iconOffset ) );
							} else if ( iconHolder.data( 'initial-icon' ) ) {
								// Rollback the default icon.
								iconHolder.setAttribute( 'style', CKEDITOR.skin.getIconStyle( iconHolder.data( 'initial-icon' ), false, this.icon, this.iconOffset ) );
								iconHolder.data( 'initial-icon', false );
							}
						}
					};
				},

				proto: {

					/**
					 * Binds the button to the editor, so that it can attach it's runtime listeners.
					 */
					bind: function( editor ) {
						editor.on( 'selectionChange', function( evt ) {
							this.checkParts();

							for ( var i in this.parts ) {
								var curPart = this.parts[ i ];

								if ( curPart.refresh ) {
									curPart.refresh( evt.data.selection, evt.data.path );
								}
							}
						}, this );

						// It's safer to hide the color indicator during mode change (e.g. switching to source mode).
						editor.on( 'mode', function() {
							this.parts.color.element.hide();
						}, this );

						editor.on( 'contentDom', function() {
							this.checkParts();
						}, this );
					},

					/**
					 * Temp function to check whether button parts are appended to the button.
					 */
					checkParts: function() {
						var buttonRoot = this.document.getById( this._.id );

						if ( !buttonRoot ) {
							// Button is either not loaded yet, or simply removed.
							return;
						}

						for ( var i in this.parts ) {
							var curPart = this.parts[ i ],
								element = curPart.element;

							// Part element could be provided either as an element, or a selector that should match it from existing markup.
							if ( element && !element.getParent() ) {
								buttonRoot.append( element );
							} else if ( !element && curPart.selector ) {
								curPart.element = buttonRoot.findOne( curPart.selector );
							}
						}
					}
				},

				statics: {
					handler: {
						create: function( definition ) {
							return new CKEDITOR.ui.liveButton( definition );
						}
					}
				}
			} );

			editor.ui.addHandler( CKEDITOR.UI_LIVEBUTTON, CKEDITOR.ui.liveButton.handler );
		}
	} );

	/**
	 * Button UI element.
	 *
	 * @readonly
	 * @property {String} [='livebutton']
	 * @member CKEDITOR
	 */
	CKEDITOR.UI_LIVEBUTTON = 'livebutton';
} )();
