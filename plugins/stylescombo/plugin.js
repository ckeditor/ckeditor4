/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'stylescombo', {
		requires: 'richcombo',
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength

		init: function( editor ) {
			var config = editor.config,
				lang = editor.lang.stylescombo,
				styles = {},
				stylesList = [],
				combo,
				allowedContent = [];

			editor.on( 'stylesSet', function( evt ) {
				var stylesDefinitions = evt.data.styles;

				if ( !stylesDefinitions )
					return;

				var style, styleName, styleType;

				// Put all styles into an Array.
				for ( var i = 0, count = stylesDefinitions.length; i < count; i++ ) {
					var styleDefinition = stylesDefinitions[ i ];

					if ( editor.blockless && ( styleDefinition.element in CKEDITOR.dtd.$block ) ||
						( typeof styleDefinition.type == 'string' && !CKEDITOR.style.customHandlers[ styleDefinition.type ] ) ) {

						continue;
					}

					styleName = styleDefinition.name;
					style = new CKEDITOR.style( styleDefinition );

					if ( !editor.filter.customConfig || editor.filter.check( style ) ) {
						style._name = styleName;
						style._.enterMode = config.enterMode;
						// Get the type (which will be used to assign style to one of 3 groups) from assignedTo if it's defined.
						style._.type = styleType = style.assignedTo || style.type;

						// Weight is used to sort styles (https://dev.ckeditor.com/ticket/9029).
						style._.weight = i + ( styleType == CKEDITOR.STYLE_OBJECT ? 1 : styleType == CKEDITOR.STYLE_BLOCK ? 2 : 3 ) * 1000;

						styles[ styleName ] = style;
						stylesList.push( style );
						allowedContent.push( style );
					}
				}

				// Sorts the Array, so the styles get grouped by type in proper order (https://dev.ckeditor.com/ticket/9029).
				stylesList.sort( function( styleA, styleB ) {
					return styleA._.weight - styleB._.weight;
				} );
			} );

			// (#3649)
			editor.on( 'stylesRemove', function( evt ) {
				var type = evt.data && evt.data.type,
					allowAll = type === undefined;

				for ( var styleName in styles ) {
					var style = styles[ styleName ];

					if ( allowAll || style.type === type ) {
						editor.removeStyle( style );
					}
				}
			} );

			editor.ui.addRichCombo( 'Styles', {
				label: lang.label,
				title: lang.panelTitle,
				toolbar: 'styles,10',
				allowedContent: allowedContent,

				panel: {
					css: [ CKEDITOR.skin.getPath( 'editor' ) ].concat( config.contentsCss ),
					multiSelect: true,
					attributes: { 'aria-label': lang.panelTitle }
				},

				init: function() {
					var style, styleName, lastType, type, i, count;

					// Loop over the Array, adding all items to the
					// combo.
					for ( i = 0, count = stylesList.length; i < count; i++ ) {
						style = stylesList[ i ];
						styleName = style._name;
						type = style._.type;

						if ( type != lastType ) {
							this.startGroup( lang[ 'panelTitle' + String( type ) ] );
							lastType = type;
						}

						this.add( styleName, style.type == CKEDITOR.STYLE_OBJECT ? styleName : style.buildPreview(), styleName );
					}

					this.commit();
				},

				onClick: function( value ) {
					editor.focus();
					editor.fire( 'saveSnapshot' );

					var style = styles[ value ],
						elementPath = editor.elementPath();

					// When more then one style from the same group is active ( which is not ok ),
					// remove all other styles from this group and apply selected style.
					if ( style.group && style.removeStylesFromSameGroup( editor ) ) {
						editor.applyStyle( style );
					} else {
						editor[ style.checkActive( elementPath, editor ) ? 'removeStyle' : 'applyStyle' ]( style );
					}

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
								if ( styles[ value ].checkElementRemovable( element, true, editor ) ) {
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
						// When editor is focused but is returned `null` as selected element, then return editable (#646).
						// In case when selection dosen't cover whole element, we try to return element where selection starts (#862).
						element = selection.getSelectedElement() || selection.getStartElement() || editor.editable(),
						elementPath = editor.elementPath( element ),
						counter = [ 0, 0, 0, 0 ];

					this.showAll();
					this.unmarkAll();
					for ( var name in styles ) {
						var style = styles[ name ],
							type = style._.type;

						if ( style.checkApplicable( elementPath, editor, editor.activeFilter ) )
							counter[ type ]++;
						else
							this.hideItem( name );

						if ( style.checkActive( elementPath, editor ) )
							this.mark( name );
					}

					if ( !counter[ CKEDITOR.STYLE_BLOCK ] )
						this.hideGroup( lang[ 'panelTitle' + String( CKEDITOR.STYLE_BLOCK ) ] );

					if ( !counter[ CKEDITOR.STYLE_INLINE ] )
						this.hideGroup( lang[ 'panelTitle' + String( CKEDITOR.STYLE_INLINE ) ] );

					if ( !counter[ CKEDITOR.STYLE_OBJECT ] )
						this.hideGroup( lang[ 'panelTitle' + String( CKEDITOR.STYLE_OBJECT ) ] );
				},

				refresh: function() {
					var elementPath = editor.elementPath();

					if ( !elementPath )
						return;

					for ( var name in styles ) {
						var style = styles[ name ];

						if ( style.checkApplicable( elementPath, editor, editor.activeFilter ) )
							return;
					}
					this.setState( CKEDITOR.TRISTATE_DISABLED );
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
				}
			} );
		}
	} );
} )();

/**
 * Removes styles from the current editor selection.
 *
 * Note that you can pass the `type` option to limit removing styles to the given type.
 *
 * ```js
 * editor.fire( 'stylesRemove', { type: CKEDITOR.STYLE_BLOCK } );
 * ```
 *
 * @since 4.15.1
 * @event stylesRemove
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param data
 * @param {Number} [data.type] Style type, see {@link CKEDITOR#STYLE_INLINE INLINE}/{@link CKEDITOR#STYLE_BLOCK BLOCK}/{@link CKEDITOR#STYLE_OBJECT OBJECT} style options.
 */
