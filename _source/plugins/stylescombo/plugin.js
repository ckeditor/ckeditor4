/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	CKEDITOR.plugins.add( 'stylescombo', {
		requires: [ 'richcombo', 'styles' ],

		init: function( editor ) {
			var config = editor.config,
				lang = editor.lang.stylesCombo,
				pluginPath = this.path,
				styles, saveRanges;

			editor.ui.addRichCombo( 'Styles', {
				label: lang.label,
				title: lang.panelTitle,
				className: 'cke_styles',
				multiSelect: true,

				panel: {
					css: [ config.contentsCss, editor.skinPath + 'editor.css' ]
				},

				init: function() {
					var combo = this,
						stylesSet = config.stylesCombo_stylesSet.split( ':', 2 ),
						stylesSetPath = stylesSet[ 1 ] || CKEDITOR.getUrl( pluginPath + 'styles/' + stylesSet[ 0 ] + '.js' );

					stylesSet = stylesSet[ 0 ];

					CKEDITOR.loadStylesSet( stylesSet, stylesSetPath, function( stylesDefinitions ) {
						var style, styleName,
							stylesList = [];

						styles = {};

						// Put all styles into an Array.
						for ( var i = 0; i < stylesDefinitions.length; i++ ) {
							var styleDefinition = stylesDefinitions[ i ];

							styleName = styleDefinition.name;

							style = styles[ styleName ] = new CKEDITOR.style( styleDefinition );
							style._name = styleName;

							stylesList.push( style );
						}

						// Sorts the Array, so the styles get grouped
						// by type.
						stylesList.sort( sortStyles );

						// Loop over the Array, adding all items to the
						// combo.
						var lastType;
						for ( var i = 0; i < stylesList.length; i++ ) {
							style = stylesList[ i ];
							styleName = style._name;

							var type = style.type;

							if ( type != lastType ) {
								combo.startGroup( lang[ 'panelTitle' + String( type ) ] );
								lastType = type;
							}

							combo.add( styleName, style.type == CKEDITOR.STYLE_OBJECT ? styleName : buildPreview( style._.definition ), styleName );
						}

						combo.commit();

						combo.onOpen();
					});
				},

				onClick: function( value ) {
					editor.focus();

					var style = styles[ value ],
						selection = editor.getSelection();

					if ( saveRanges ) {
						selection.selectRanges( saveRanges );
						saveRanges = false;
					}

					if ( style.type == CKEDITOR.STYLE_OBJECT ) {
						var element = selection.getSelectedElement();
						if ( element )
							style.applyToObject( element );

						return;
					}

					var elementPath = new CKEDITOR.dom.elementPath( selection.getStartElement() );

					if ( style.type == CKEDITOR.STYLE_INLINE && style.checkActive( elementPath ) )
						style.remove( editor.document );
					else
						style.apply( editor.document );
				},

				onRender: function() {
					editor.on( 'selectionChange', function( ev ) {
						var currentTag = this.getValue();

						var elementPath = ev.data.path;

						for ( var tag in styles ) {
							if ( styles[ tag ].checkActive( elementPath ) ) {
								if ( tag != currentTag )
									this.setValue( tag );
								return;
							}
						}

						// If no styles match, just empty it.
						this.setValue( '' );
					}, this );
				},

				onOpen: function() {
					editor.focus();

					var selection = editor.getSelection();

					if ( CKEDITOR.env.ie && selection )
						saveRanges = selection.getRanges();

					var elementPath,
						element = selection.getSelectedElement(),
						elementName = element && element.getName(),
						isInline = elementName && !CKEDITOR.dtd.$block[ elementName ] && !CKEDITOR.dtd.$listItem[ elementName ] && !CKEDITOR.dtd.$tableContent[ elementName ];

					var counter = [ 0, 0, 0, 0 ];

					if ( !element || isInline )
						elementPath = new CKEDITOR.dom.elementPath( selection.getStartElement() );

					this.showAll();
					this.unmarkAll();

					for ( var name in styles ) {
						var style = styles[ name ]
						type = style.type;

						if ( type == CKEDITOR.STYLE_OBJECT ) {
							if ( element && style.element == elementName ) {
								if ( style.checkElementRemovable( element, true ) )
									this.mark( name );

								counter[ type ]++;
							} else
								this.hideItem( name );
						} else {
							if ( elementPath ) {
								if ( style.checkActive( elementPath ) )
									this.mark( name );

								counter[ type ]++;

							} else
								this.hideItem( name );
						}
					}

					if ( !counter[ CKEDITOR.STYLE_BLOCK ] )
						this.hideGroup( lang[ 'panelTitle' + String( CKEDITOR.STYLE_BLOCK ) ] );

					if ( !counter[ CKEDITOR.STYLE_INLINE ] )
						this.hideGroup( lang[ 'panelTitle' + String( CKEDITOR.STYLE_INLINE ) ] );

					if ( !counter[ CKEDITOR.STYLE_OBJECT ] )
						this.hideGroup( lang[ 'panelTitle' + String( CKEDITOR.STYLE_OBJECT ) ] );
				},

				onClose: function() {
					saveRanges = null;
				}
			});
		}
	});

	var stylesSets = {};

	CKEDITOR.addStylesSet = function( name, styles ) {
		stylesSets[ name ] = styles;
	};

	CKEDITOR.loadStylesSet = function( name, url, callback ) {
		var stylesSet = stylesSets[ name ];

		if ( stylesSet )
			return callback( stylesSets );

		CKEDITOR.scriptLoader.load( url, function() {
			callback( stylesSets[ name ] );
		});
	};

	function buildPreview( styleDefinition ) {
		var html = [];

		var elementName = styleDefinition.element;

		// Avoid <bdo> in the preview.
		if ( elementName == 'bdo' )
			elementName = 'span';

		html = [ '<', elementName ];

		// Assign all defined attributes.
		var attribs = styleDefinition.attributes;
		if ( attribs ) {
			for ( var att in attribs ) {
				html.push( ' ', att, '="', attribs[ att ], '"' );
			}
		}

		// Assign the style attribute.
		var cssStyle = CKEDITOR.style.getStyleText( styleDefinition );
		if ( cssStyle )
			html.push( ' style="', cssStyle, '"' );

		html.push( '>', styleDefinition.name, '</', elementName, '>' );

		return html.join( '' );
	}

	function sortStyles( styleA, styleB ) {
		var typeA = styleA.type,
			typeB = styleB.type;

		return typeA == typeB ? 0 : typeA == CKEDITOR.STYLE_OBJECT ? -1 : typeB == CKEDITOR.STYLE_OBJECT ? 1 : typeB == CKEDITOR.STYLE_BLOCK ? 1 : -1;
	}
})();

CKEDITOR.config.stylesCombo_stylesSet = 'default';
