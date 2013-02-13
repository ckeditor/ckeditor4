/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

(function() {
	CKEDITOR.plugins.add( 'stylescombo', {
		requires: 'richcombo',
		lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en-au,en-ca,en-gb,en,eo,es,et,eu,fa,fi,fo,fr-ca,fr,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt-br,pt,ro,ru,sk,sl,sr-latn,sr,sv,th,tr,ug,uk,vi,zh-cn,zh', // %REMOVE_LINE_CORE%

		init: function( editor ) {
			var config = editor.config,
				lang = editor.lang.stylescombo,
				styles = {},
				stylesList = [],
				combo;

			function loadStylesSet( callback ) {
				editor.getStylesSet( function( stylesDefinitions ) {
					if ( !stylesList.length ) {
						var style, styleName;

						// Put all styles into an Array.
						for ( var i = 0, count = stylesDefinitions.length; i < count; i++ ) {
							var styleDefinition = stylesDefinitions[ i ];

							if ( editor.blockless && ( styleDefinition.element in CKEDITOR.dtd.$block ) )
								continue;

							styleName = styleDefinition.name;

							style = styles[ styleName ] = new CKEDITOR.style( styleDefinition );
							style._name = styleName;
							style._.enterMode = config.enterMode;

							// Weight is used to sort styles (#9029).
							style._.weight = i + ( style.type == CKEDITOR.STYLE_OBJECT ? 1 : style.type == CKEDITOR.STYLE_BLOCK ? 2 : 3 ) * 1000;

							stylesList.push( style );
						}

						// Sorts the Array, so the styles get grouped by type in proper order (#9029).
						stylesList.sort( function( styleA, styleB ) { return styleA._.weight - styleB._.weight; } );
					}

					callback && callback();
				});
			}

			editor.ui.addRichCombo( 'Styles', {
				label: lang.label,
				title: lang.panelTitle,
				toolbar: 'styles,10',

				panel: {
					css: [ CKEDITOR.skin.getPath( 'editor' ) ].concat( config.contentsCss ),
					multiSelect: true,
					attributes: { 'aria-label': lang.panelTitle }
				},

				init: function() {
					combo = this;

					loadStylesSet( function() {
						var style, styleName, lastType, type, i, count;

						// Loop over the Array, adding all items to the
						// combo.
						for ( i = 0, count = stylesList.length; i < count; i++ ) {
							style = stylesList[ i ];
							styleName = style._name;
							type = style.type;

							if ( type != lastType ) {
								combo.startGroup( lang[ 'panelTitle' + String( type ) ] );
								lastType = type;
							}

							combo.add( styleName, style.type == CKEDITOR.STYLE_OBJECT ? styleName : style.buildPreview(), styleName );
						}

						combo.commit();

					});
				},

				onClick: function( value ) {
					editor.focus();
					editor.fire( 'saveSnapshot' );

					var style = styles[ value ],
						elementPath = editor.elementPath();

					editor[ style.checkActive( elementPath ) ? 'removeStyle' : 'applyStyle' ]( style );
					editor.fire( 'saveSnapshot' );
				},

				onRender: function() {
					editor.on( 'selectionChange', function( ev ) {
						var currentValue = this.getValue(),
							elementPath = ev.data.path,
							elements = elementPath.elements;

						// For each element into the elements path.
						for ( var i = 0, count = elements.length, element; i < count; i++ ) {
							element = elements[ i ];

							// Check if the element is removable by any of
							// the styles.
							for ( var value in styles ) {
								if ( styles[ value ].checkElementRemovable( element, true ) ) {
									if ( value != currentValue )
										this.setValue( value );
									return;
								}
							}
						}

						// If no styles match, just empty it.
						this.setValue( '' );
					}, this );
				},

				onOpen: function() {
					var selection = editor.getSelection(),
						element = selection.getSelectedElement(),
						elementPath = editor.elementPath( element ),
						counter = [ 0, 0, 0, 0 ];

					this.showAll();
					this.unmarkAll();
					for ( var name in styles ) {
						var style = styles[ name ],
							type = style.type;

						// Check if block styles are applicable.
						if ( type == CKEDITOR.STYLE_BLOCK && !elementPath.isContextFor( style.element ) ) {
							this.hideItem( name );
							continue;
						}

						if ( style.checkActive( elementPath ) )
							this.mark( name );
						else if ( type == CKEDITOR.STYLE_OBJECT && !style.checkApplicable( elementPath ) ) {
							this.hideItem( name );
							counter[ type ]--;
						}

						counter[ type ]++;
					}

					if ( !counter[ CKEDITOR.STYLE_BLOCK ] )
						this.hideGroup( lang[ 'panelTitle' + String( CKEDITOR.STYLE_BLOCK ) ] );

					if ( !counter[ CKEDITOR.STYLE_INLINE ] )
						this.hideGroup( lang[ 'panelTitle' + String( CKEDITOR.STYLE_INLINE ) ] );

					if ( !counter[ CKEDITOR.STYLE_OBJECT ] )
						this.hideGroup( lang[ 'panelTitle' + String( CKEDITOR.STYLE_OBJECT ) ] );
				},

				// Force a reload of the data
				reset: function() {
					if ( combo ) {
						delete combo._.panel;
						delete combo._.list;
						combo._.committed = 0;
						combo._.items = {};
						combo._.state = CKEDITOR.TRISTATE_OFF;
					}
					styles = {};
					stylesList = [];
					loadStylesSet();
				}
			});

			editor.on( 'instanceReady', function() {
				loadStylesSet();
			});
		}
	});
})();
