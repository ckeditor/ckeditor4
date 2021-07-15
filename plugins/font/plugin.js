/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	var StyleData = CKEDITOR.tools.createClass( {
		// @param {Object} options
		// @param {String} options.entries Values from the configuration used to build a rich combo.
		// The values should be obtained from ( CKEDITOR.config#fontSize_sizes | CKEDITOR.config#font_names )
		// @param {String} options.styleVariable A variable name used in the style definition to build proper CKEDITOR.style.
		// By default it should be: ( 'size' | 'family' )
		// @param {Object} options.styleDefinition A template used to build each individual style definition based on entries.
		// The values should be obtained from ( CKEDITOR.config#fontSize_style | CKEDITOR.config#font_style )
		$: function( options ) {
			var entries = options.entries.split( ';' );

			this._.data = {};
			this._.names = [];

			for ( var i = 0; i < entries.length; i++ ) {
				var parts = entries[ i ],
					name,
					value,
					vars;

				if ( parts ) {
					parts = parts.split( '/' );
					name = parts[ 0 ];
					value = parts[ 1 ];
					vars = {};

					vars[ options.styleVariable ] = value || name;

					this._.data[ name ] = new CKEDITOR.style( options.styleDefinition, vars );
					this._.data[ name ]._.definition.name = name;

					this._.names.push( name );
				} else {
					entries.splice( i, 1 );
					i--;
				}
			}
		},

		proto: {
			getStyle: function( name ) {
				return this._.data[ name ];
			},

			addToCombo: function( combo ) {
				for ( var i = 0; i < this._.names.length; i++ ) {
					var name = this._.names[ i ];
					combo.add( name, this.getStyle( name ).buildPreview(), name );
				}
			},

			getMatchingValue: function( editor, path ) {
				var elements = path.elements;

				for ( var i = 0, element, value; i < elements.length; i++ ) {
					element = elements[ i ];

					// Check if the element is removable by any of the styles.
					value = this._.findMatchingStyleName( editor, element );

					if ( value ) {
						return value;
					}
				}

				return null;
			}
		},

		_: {
			findMatchingStyleName: function( editor, element ) {
				return CKEDITOR.tools.array.find( this._.names, function( name ) {
					return this.getStyle( name ).checkElementMatch( element, true, editor );
				}, this );
			}
		}
	} );

	// @param {CKEDITOR.editor} editor
	// @param {Object} definition
	// @param {String} definition.comboName
	// @oaram {String} definition.commandName The name used to register the command in the editor.
	// @param {String} definition.styleVariable It has 'size' or 'family' as a value.
	// @param {Object} definition.lang A reference to the language object used for a given combo.
	// @param {String} definition.entries Values used for given combo options.
	// @param {String} definition.defaultLabel The label used to describe the default value.
	// @param {Object} definition.styleDefinition An object representing the defintion for a given font combo obtained
	// from the the configuration.
	// @param {Number} definition.order A value used to position the icon in the toolbar.
	function addCombo( editor, definition ) {
		var config = editor.config,
			lang = definition.lang,
			defaultContentStyle = new CKEDITOR.style( definition.styleDefinition ),
			stylesData = new StyleData( {
				entries: definition.entries,
				styleVariable: definition.styleVariable,
				styleDefinition: definition.styleDefinition
			} ),
			command;

		editor.addCommand( definition.commandName , {
			exec: function( editor, data ) {
				var newStyle = data.newStyle,
					oldStyle = data.oldStyle,
					range = editor.getSelection().getRanges()[ 0 ],
					isRemove = newStyle === undefined;

				if ( !oldStyle && !newStyle ) {
					return;
				}

				// If the range is collapsed we can't simply use the editor.removeStyle method
				// because it will remove the entire element and we want to split it instead.
				if ( oldStyle && range.collapsed ) {
					splitElementOnCollapsedRange( {
						editor: editor,
						range: range,
						style: oldStyle
					} );
				}

				if ( isRemove ) {
					editor.removeStyle( oldStyle );
				} else {
					if ( oldStyle && !isEqualStyle( oldStyle, newStyle ) ) {
						editor.removeStyle( oldStyle );
					}

					editor.applyStyle( newStyle );
				}
			},

			refresh: function( editor, path ) {
				if ( !defaultContentStyle.checkApplicable( path, editor, editor.activeFilter ) ) {
					this.setState( CKEDITOR.TRISTATE_DISABLED );
				}
			}
		} );

		command = editor.getCommand( definition.commandName );

		editor.ui.addRichCombo( definition.comboName, {
			label: lang.label,
			title: lang.panelTitle,
			command: definition.commandName,
			toolbar: 'styles,' + definition.order,
			defaultValue: 'cke-default',
			allowedContent: defaultContentStyle,
			requiredContent: defaultContentStyle,
			contentTransformations: definition.styleDefinition.element === 'span' ? [
				[
					{
						element: 'font',
						check: 'span',
						left: function( element ) {
							return !!element.attributes.size ||
								!!element.attributes.align ||
								!!element.attributes.face;
						},
						right: function( element ) {
							var sizes = [
								'', // Non-existent size "0"
								'x-small',
								'small',
								'medium',
								'large',
								'x-large',
								'xx-large',
								'48px' // Closest value to what size="7" might mean.
							];

							element.name = 'span';

							if ( element.attributes.size ) {
								element.styles[ 'font-size' ] = sizes[ element.attributes.size ];
								delete element.attributes.size;
							}

							if ( element.attributes.align ) {
								element.styles[ 'text-align' ] = element.attributes.align;
								delete element.attributes.align;
							}

							if ( element.attributes.face ) {
								element.styles[ 'font-family' ] = element.attributes.face;
								delete element.attributes.face;
							}
						}
					}
				]
			] : null,
			panel: {
				css: [ CKEDITOR.skin.getPath( 'editor' ) ].concat( config.contentsCss ),
				multiSelect: false,
				attributes: { 'aria-label': lang.panelTitle }
			},

			init: function() {
				var defaultText = '(' + editor.lang.common.optionDefault + ')';

				this.startGroup( lang.panelTitle );

				// Add `(Default)` item as a first element on the drop-down list.
				this.add( this.defaultValue, defaultText, defaultText );

				stylesData.addToCombo( this );
			},

			onClick: onClickHandler,

			onRender: function() {
				editor.on( 'selectionChange', function( ev ) {
					var currentValue = this.getValue(),
						elementPath = ev.data.path,
						value = stylesData.getMatchingValue( editor, elementPath );

					if ( value ) {
						if ( value != currentValue ) {
							this.setValue( value );
						}

						return;
					}

					// If no styles match, just empty it.
					this.setValue( '', definition.defaultLabel );
				}, this );

				command.on( 'state', function() {
					this.setState( command.state );
				}, this );
			},

			refresh: function() {
				this.setState( command.state );
			}
		} );

		function onClickHandler( newValue ) {
			var oldValue = this.getValue();

			editor.focus();

			editor.fire( 'saveSnapshot' );

			editor.execCommand( definition.commandName, {
				newStyle: stylesData.getStyle( newValue ),
				oldStyle: stylesData.getStyle( oldValue )
			} );

			editor.fire( 'saveSnapshot' );
		}
	}

	function isEqualStyle( styleA, styleB ) {
		if ( !( styleA instanceof CKEDITOR.style ) || !( styleB instanceof CKEDITOR.style ) ) {
			return false;
		}

		var hasEqualAttributes = compareAttributes( styleA, styleB ),
			hasEqualStyles = compareStyles( styleA, styleB );

		return hasEqualAttributes && hasEqualStyles;

		function compareAttributes( styleA, styleB ) {
			var styleAAttributes = styleA.getDefinition().attributes,
				styleBAttributes = styleB.getDefinition().attributes;

			return CKEDITOR.tools.objectCompare( styleAAttributes, styleBAttributes );
		}

		function compareStyles( styleA, styleB ) {
			return CKEDITOR.style.getStyleText( styleA.getDefinition() ) === CKEDITOR.style.getStyleText( styleB.getDefinition() );
		}
	}

	//  * @param {Object} options
	//  * @param {CKEDITOR.editor} options.editor An instance of the editor.
	//  * @param {CKEDITOR.dom.range} options.range The analyzed range.
	//  * @param {CKEDITOR.style} options.style The old style which might already exist on this range.
	function splitElementOnCollapsedRange( options ) {
		var editor = options.editor,
			range = options.range,
			style = options.style,
			path,
			matching,
			startBoundary,
			endBoundary,
			node,
			bm;

		path = editor.elementPath();
		// Find the style element.
		matching = path.contains( function( el ) {
			return style.checkElementRemovable( el );
		} );

		if ( !matching ) {
			return;
		}

		startBoundary = range.checkBoundaryOfElement( matching, CKEDITOR.START );
		endBoundary = range.checkBoundaryOfElement( matching, CKEDITOR.END );

		// If we are at both boundaries it means that the element is empty.
		// Remove it but in a way that we won't lose other empty inline elements inside it.
		// Example: <p>x<span style="font-size:48px"><em>[]</em></span>x</p>
		// Result: <p>x<em>[]</em>x</p>
		if ( startBoundary && endBoundary ) {
			bm = range.createBookmark();
			// Replace the element with its children (TODO element.replaceWithChildren).
			while ( ( node = matching.getFirst() ) ) {
				node.insertBefore( matching );
			}
			matching.remove();
			range.moveToBookmark( bm );

		// If we are at the boundary of the style element, move out and copy nested styles/elements.
		} else if ( startBoundary || endBoundary ) {
			range.moveToPosition( matching, startBoundary ? CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_END );
			cloneSubtreeIntoRange( range, path.elements.slice(), matching );
		} else {
			// Split the element and clone the elements that were in the path
			// (between the startContainer and the matching element)
			// into the new place.
			range.splitElement( matching );
			range.moveToPosition( matching, CKEDITOR.POSITION_AFTER_END );
			cloneSubtreeIntoRange( range, path.elements.slice(), matching );
		}

		editor.getSelection().selectRanges( [ range ] );
	}

	// Clones the subtree between `subtreeStart` (exclusive) and the
	// leaf (inclusive) and inserts it into the range.
	//
	// @param range
	// @param {CKEDITOR.dom.element[]} elements Elements path in the standard order: leaf -> root.
	// @param {CKEDITOR.dom.element/null} substreeStart The start of the subtree.
	// If null, then the leaf belongs to the subtree.
	function cloneSubtreeIntoRange( range, elements, subtreeStart ) {
		var current = elements.pop();
		if ( !current ) {
			return;
		}
		// Rewind the elements array up to the subtreeStart and then start the real cloning.
		if ( subtreeStart ) {
			return cloneSubtreeIntoRange( range, elements, current.equals( subtreeStart ) ? null : subtreeStart );
		}

		var clone = current.clone();
		range.insertNode( clone );
		range.moveToPosition( clone, CKEDITOR.POSITION_AFTER_START );

		cloneSubtreeIntoRange( range, elements );
	}

	CKEDITOR.plugins.add( 'font', {
		requires: 'richcombo',
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		init: function( editor ) {
			var config = editor.config;

			addCombo( editor, {
				comboName: 'Font',
				commandName: 'font',
				styleVariable: 'family',
				lang: editor.lang.font,
				entries: config.font_names,
				defaultLabel: config.font_defaultLabel,
				styleDefinition: config.font_style,
				order: 30
			} );
			addCombo( editor, {
				comboName: 'FontSize',
				commandName: 'fontSize',
				styleVariable: 'size',
				lang: editor.lang.font.fontSize,
				entries: config.fontSize_sizes,
				defaultLabel: config.fontSize_defaultLabel,
				styleDefinition: config.fontSize_style,
				order: 40
			} );
		}
	} );
} )();

/**
 * The list of font names to be displayed in the Font combo in the toolbar.
 * Entries are separated by semi-colons (`';'`) and it is possible to have more
 * than one font for each entry, in the HTML way (separated by commas).
 *
 * A display name may be optionally defined by prefixing the entries with the
 * name and the slash character. For example, `'Arial/Arial, Helvetica, sans-serif'`
 * will be displayed as `'Arial'` in the list, but will be output as
 * `'Arial, Helvetica, sans-serif'`.
 *
 *		config.font_names =
 *			'Arial/Arial, Helvetica, sans-serif;' +
 *			'Times New Roman/Times New Roman, Times, serif;' +
 *			'Verdana';
 *
 *		config.font_names = 'Arial;Times New Roman;Verdana';
 *
 * @cfg {String} [font_names=see source]
 * @member CKEDITOR.config
 */
CKEDITOR.config.font_names = 'Arial/Arial, Helvetica, sans-serif;' +
	'Comic Sans MS/Comic Sans MS, cursive;' +
	'Courier New/Courier New, Courier, monospace;' +
	'Georgia/Georgia, serif;' +
	'Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;' +
	'Tahoma/Tahoma, Geneva, sans-serif;' +
	'Times New Roman/Times New Roman, Times, serif;' +
	'Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;' +
	'Verdana/Verdana, Geneva, sans-serif';

/**
 * The text to be displayed in the Font combo if none of the available values
 * matches the current cursor position or text selection.
 *
 *		// If the default site font is Arial, we may make it more explicit to the end user.
 *		config.font_defaultLabel = 'Arial';
 *
 * @cfg {String} [font_defaultLabel='']
 * @member CKEDITOR.config
 */
CKEDITOR.config.font_defaultLabel = '';

/**
 * The style definition to be used to apply the font in the text.
 *
 *		// This is actually the default value for it.
 *		config.font_style = {
 *			element:		'span',
 *			styles:			{ 'font-family': '#(family)' },
 *			overrides:		[ { element: 'font', attributes: { 'face': null } } ]
 *     };
 *
 * @cfg {Object} [font_style=see example]
 * @member CKEDITOR.config
 */
CKEDITOR.config.font_style = {
	element: 'span',
	styles: { 'font-family': '#(family)' },
	overrides: [ {
		element: 'font', attributes: { 'face': null }
	} ]
};

/**
 * The list of font sizes to be displayed in the Font Size combo in the
 * toolbar. Entries are separated by semi-colons (`';'`).
 *
 * Any kind of "CSS-like" size can be used, like `'12px'`, `'2.3em'`, `'130%'`,
 * `'larger'` or `'x-small'`.
 *
 * A display name may be optionally defined by prefixing the entries with the
 * name and the slash character. For example, `'Bigger Font/14px'` will be
 * displayed as `'Bigger Font'` in the list, but will be output as `'14px'`.
 *
 *		config.fontSize_sizes = '16/16px;24/24px;48/48px;';
 *
 *		config.fontSize_sizes = '12px;2.3em;130%;larger;x-small';
 *
 *		config.fontSize_sizes = '12 Pixels/12px;Big/2.3em;30 Percent More/130%;Bigger/larger;Very Small/x-small';
 *
 * @cfg {String} [fontSize_sizes=see source]
 * @member CKEDITOR.config
 */
CKEDITOR.config.fontSize_sizes = '8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px';

/**
 * The text to be displayed in the Font Size combo if none of the available
 * values matches the current cursor position or text selection.
 *
 *		// If the default site font size is 12px, we may make it more explicit to the end user.
 *		config.fontSize_defaultLabel = '12px';
 *
 * @cfg {String} [fontSize_defaultLabel='']
 * @member CKEDITOR.config
 */
CKEDITOR.config.fontSize_defaultLabel = '';

/**
 * The style definition to be used to apply the font size in the text.
 *
 *		// This is actually the default value for it.
 *		config.fontSize_style = {
 *			element:		'span',
 *			styles:			{ 'font-size': '#(size)' },
 *			overrides:		[ { element: 'font', attributes: { 'size': null } } ]
 *		};
 *
 * @cfg {Object} [fontSize_style=see example]
 * @member CKEDITOR.config
 */
CKEDITOR.config.fontSize_style = {
	element: 'span',
	styles: { 'font-size': '#(size)' },
	overrides: [ {
		element: 'font', attributes: { 'size': null }
	} ]
};
