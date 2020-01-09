/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	var StyleData = CKEDITOR.tools.createClass( {
		// @param {Object} options
		// @param {String} options.entries Values from the configuration used to build richcombo.
		// Values should be obtained from ( CKEDITOR.config#fontSize_sizes | CKEDITOR.config#font_names )
		// @param {String} options.styleVariable variable name used in style definition to build proper CKEDITOR.style.
		// By default it should be: ( 'size' | 'family' )
		// @param {Object} options.styleDefinition template used to build each individual style definition based on entries.
		// Values should be obtained from ( CKEDITOR.config#fontSize_style | CKEDITOR.config#font_style )
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
			getStyle: function( value ) {
				return this._.data[ value ];
			},

			executeForEach: function( callback, context ) {
				CKEDITOR.tools.array.forEach( this._.names, function( name ) {
					callback.call( context, name, this.getStyle( name ) );
				}, this );
			},

			findMatchingStyleName: function( callback, context ) {
				return CKEDITOR.tools.array.find( this._.names, function( name ) {
					return callback.call( context, this.getStyle( name ) );
				}, this );
			}
		},

		_: {}
	} );

	// @param {CKEDITOR.editor} editor
	// @param {Object} definition
	// @param {String} definition.comboName
	// @oaram {String} definition.commandName name used to register command in editor
	// @param {String} definition.styleType it has value 'size' or 'family'
	// @param {Object} definition.lang reference to lang object used for given combo
	// @param {String} definition.entries values used for given combo options
	// @param {String} definition.defaultLabel label used to describe default value
	// @param {Object} definition.configStyleDefinition object representing defintion for given font combo
	// @param {Number} definition.order value used to position icon in toolbar
	function addCombo( editor, definition ) {
		var config = editor.config,
			lang = definition.lang,
			defaultContentStyle = new CKEDITOR.style( definition.configStyleDefinition ),
			stylesData = new StyleData( {
				entries: definition.entries,
				styleVariable: definition.styleType,
				styleDefinition: definition.configStyleDefinition
			} ),
			removeStyleValue = 'cke-remove-style',
			command;

		editor.addCommand( definition.commandName , {
			contextSensitive: true,
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
					if ( oldStyle ) {
						editor.removeStyle( oldStyle );
					}

					editor.applyStyle( newStyle );
				}
			},

			refresh: function( editor, path ) {
				if ( !defaultContentStyle.checkApplicable( path, editor, editor.activeFilter ) ) {
					this.setState( CKEDITOR.TRISTATE_DISABLED );
					return;
				}

				var value = getMatchingValue( editor, path, stylesData );

				if ( value === undefined ) {
					this.setState( CKEDITOR.TRISTATE_OFF );
				} else {
					this.setState( CKEDITOR.TRISTATE_ON );
				}
			}
		} );

		command = editor.getCommand( definition.commandName );

		editor.ui.addRichCombo( definition.comboName, {
			label: lang.label,
			title: lang.panelTitle,
			command: definition.commandName,
			toolbar: 'styles,' + definition.order,
			allowedContent: defaultContentStyle,
			requiredContent: defaultContentStyle,
			contentTransformations: definition.configStyleDefinition.element === 'span' ? [
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
				this.add( removeStyleValue, defaultText, defaultText );

				stylesData.executeForEach( function( name, styleValue ) {
					this.add( name, styleValue.buildPreview(), name );
				}, this );
			},

			onClick: onClickHandler,

			onRender: function() {
				editor.on( 'selectionChange', function( ev ) {
					var currentValue = this.getValue(),
						elementPath = ev.data.path,
						value = getMatchingValue( editor, elementPath, stylesData );

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
					if ( command.state === CKEDITOR.TRISTATE_DISABLED ) {
						this.setState( CKEDITOR.TRISTATE_DISABLED );
					} else {
						this.setState( CKEDITOR.TRISTATE_OFF );
					}
				}, this );
			},

			refresh: function() {
				if ( command.state === CKEDITOR.TRISTATE_DISABLED ) {
					this.setState( CKEDITOR.TRISTATE_DISABLED );
				}
			}
		} );

		function getMatchingValue( editor, path, stylesData ) {
			var elements = path.elements;

			for ( var i = 0, element, value; i < elements.length; i++ ) {
				element = elements[ i ];

				// Check if the element is removable by any of
				// the styles.
				value = stylesData.findMatchingStyleName( function( style ) {
					return style.checkElementMatch( element, true, editor );
				}, this );

				if ( value ) {
					return value;
				}
			}

			return;
		}

		function onClickHandler( newValue ) {
			editor.focus();

			var oldValue = this.getValue(),
				newStyle = stylesData.getStyle( newValue ),
				oldStyle = stylesData.getStyle( oldValue ),
				range = editor.getSelection().getRanges()[ 0 ],
				isRemoveOperation = newValue === removeStyleValue || newValue === undefined,
				styleToRemove,
				hasFragmentsWithoutNewStyle;

			styleToRemove = isRemoveOperation && hasStyleToRemove( {
				range: range,
				configStyleDefinition: definition.configStyleDefinition
			} );

			hasFragmentsWithoutNewStyle = !isRemoveOperation && !hasAlreadyAppliedNewStyle( {
				range: range,
				style: newStyle,
				configStyleDefinition: definition.configStyleDefinition
			} );

			if ( styleToRemove || hasFragmentsWithoutNewStyle ) {
				editor.fire( 'saveSnapshot' );

				editor.execCommand( definition.commandName, {
					newStyle: newStyle,
					oldStyle: oldStyle
				} );

				editor.fire( 'saveSnapshot' );
			}
		}
	}

	//  * @param {Object} options
	//  * @param {CKEDITOR.dom.range} options.range
	//  * @param {Object} options.configStyleDefinition object representing config option:
	//  * {@link CKEDITOR.config#fontSize_style } or {@link CKEDITOR.config#font_style}
	function hasStyleToRemove( options ) {
		var range = options.range,
			configStyleDefinition = options.configStyleDefinition,
			walker,
			textNode,
			nodeWithStyle;

		if ( range.collapsed ) {
			nodeWithStyle = range.startContainer.getAscendant( hasStyle( configStyleDefinition ), true );
			return !!nodeWithStyle;
		}

		walker = new CKEDITOR.dom.walker( range );
		walker.evaluator = CKEDITOR.dom.walker.nodeType( CKEDITOR.NODE_TEXT );

		textNode = walker.next();

		while ( textNode ) {
			nodeWithStyle = textNode.getAscendant( hasStyle( configStyleDefinition ) );

			if ( nodeWithStyle ) {
				return true;
			}

			textNode = walker.next();
		}

		return false;
	}


	//  * @param {Object} options
	//  * @param {CKEDITOR.dom.range} options.range,
	//  * @param {CKEDITOR.style} options.style style which is going to be applied over given range
	//  * @param {Object} options.configStyleDefinition object representing config option:
	//  * {@link CKEDITOR.config#fontSize_style } or {@link CKEDITOR.config#font_style}
	//  * @returns {Boolean}
	function hasAlreadyAppliedNewStyle( options ) {
		var range = options.range,
			style = options.style,
			configStyleDefinition = options.configStyleDefinition,
			walker,
			textNode,
			nodeWithStyle;

		if ( range.collapsed ) {
			nodeWithStyle = range.startContainer.getAscendant( hasStyle( configStyleDefinition ), true );
			return !!( nodeWithStyle && style.checkElementRemovable( nodeWithStyle ) );
		}

		walker = new CKEDITOR.dom.walker( range );
		walker.evaluator = CKEDITOR.dom.walker.nodeType( CKEDITOR.NODE_TEXT );

		textNode = walker.next();

		while ( textNode ) {
			nodeWithStyle = textNode.getAscendant( hasStyle( configStyleDefinition ) );

			if ( !nodeWithStyle || !style.checkElementMatch( nodeWithStyle ) ) {
				return false;
			}

			textNode = walker.next();
		}

		return true;
	}

	//  * @param {Object} configStyleDefinition object representing config option:
	//  * {@link CKEDITOR.config#fontSize_style } or {@link CKEDITOR.config#font_style}
	//  * @returns {Boolean}
	function hasStyle( configStyleDefinition ) {
		var styleDefinitions = getAvailableStyleDefinitions( configStyleDefinition );

		return function( el ) {
			return el.type === CKEDITOR.NODE_ELEMENT && matchElementToStyleDefinition( el, styleDefinitions );
		};
	}

	//  * @param {Object} configStyleDefinition object representing config option:
	//  * {@link CKEDITOR.config#fontSize_style } or {@link CKEDITOR.config#font_style}
	//  * @returns {Object[]} Array with objects defining what attributes describe given style e.g.:
	//  * 	[
	//  * 		{
	//  * 			element: 'span',
	//  * 			attributes: [],
	//  * 			styles: [ 'font-family' ]
	//  * 		},
	//  * 		{
	//  * 			element: 'font',
	//  * 			attributes: [ 'face' ],
	//  * 			styles: []
	//  * 		}
	//  * 	]
	function getAvailableStyleDefinitions( configStyleDefinition ) {
		var styleDefinitions = [],
			objKeys = CKEDITOR.tools.object.keys;

		// Default style types.
		styleDefinitions.push( {
			element: configStyleDefinition.element,
			attributes: objKeys( configStyleDefinition.attributes || {} ),
			styles: objKeys( configStyleDefinition.styles || {} )
		} );

		// Style types from override.
		if ( configStyleDefinition.overrides ) {
			CKEDITOR.tools.array.forEach( configStyleDefinition.overrides, function( value ) {
				styleDefinitions.push( {
					element: value.element,
					attributes: objKeys( value.attributes || {} ),
					styles: objKeys( value.styles || {} )
				} );
			} );
		}

		return styleDefinitions;
	}

	//  * @param {CKEDITOR.dom.element} el
	//  * @param {Object[]} availableStyleDefinitions - result from `getAvailableStyleDefinitions()` function
	function matchElementToStyleDefinition( el, availableStyleDefinitions ) {
		for ( var i = 0; i < availableStyleDefinitions.length; i++ ) {
			var currentStyleDefinition = availableStyleDefinitions[ i ];

			if ( !hasValidName( el, currentStyleDefinition ) ||
				!hasValidAttributes( el, currentStyleDefinition ) ||
				!hasValidStyles( el, currentStyleDefinition )
			) {
				continue;
			}

			return true;
		}

		return false;
	}

	//  * @param {CKEDITOR.dom.element} el
	//  * @param {Object} styleDefinition Single element from array obtained from `getAvailableStyleDefinitions()`
	function hasValidName( el, styleDefinition ) {
		return el.getName() === styleDefinition.element;
	}

	//  * @param {CKEDITOR.dom.element} el
	//  * @param {Object} styleDefinition Single element from array obtained from `getAvailableStyleDefinitions()`
	function hasValidAttributes( el, styleDefinition ) {
		var hasMatchingAttributes,
			attributes = styleDefinition.attributes;

		if ( !attributes.length ) {
			return true;
		}

		hasMatchingAttributes = CKEDITOR.tools.array.every( attributes, function( value ) {
			return el.hasAttribute( value );
		} );

		return hasMatchingAttributes;
	}


	//  * @param {CKEDITOR.dom.element} el
	//  * @param {Object} styleDefinition Single element from array obtained from `getAvailableStyleDefinitions()`
	function hasValidStyles( el, styleDefinition ) {
		var hasMatchingStyles,
			styles = styleDefinition.styles;

		if ( !styles.length ) {
			return true;
		}

		hasMatchingStyles = CKEDITOR.tools.array.every( styles, function( value ) {
			return el.getStyle( value );
		} );

		return hasMatchingStyles;
	}

	//  * @param {Object} config
	//  * @param {CKEDITOR.editor} config.editor instance of the editor
	//  * @param {CKEDITOR.dom.range} config.range analyzed range
	//  * @param {CKEDITOR.style} config.style old style which might already exist on this range
	function splitElementOnCollapsedRange( config ) {
		var editor = config.editor,
			range = config.range,
			style = config.style,
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

		if ( matching ) {
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
	}

	// Clones the subtree between subtreeStart (exclusive) and the
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
				styleType: 'family',
				lang: editor.lang.font,
				entries: config.font_names,
				defaultLabel: config.font_defaultLabel,
				configStyleDefinition: config.font_style,
				order: 30
			} );
			addCombo( editor, {
				comboName: 'FontSize',
				commandName: 'fontSize',
				styleType: 'size',
				lang: editor.lang.font.fontSize,
				entries: config.fontSize_sizes,
				defaultLabel: config.fontSize_defaultLabel,
				configStyleDefinition: config.fontSize_style,
				order: 40
			} );
		}
	} );
} )();

/**
 * The list of fonts names to be displayed in the Font combo in the toolbar.
 * Entries are separated by semi-colons (`';'`), while it's possible to have more
 * than one font for each entry, in the HTML way (separated by comma).
 *
 * A display name may be optionally defined by prefixing the entries with the
 * name and the slash character. For example, `'Arial/Arial, Helvetica, sans-serif'`
 * will be displayed as `'Arial'` in the list, but will be outputted as
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
 * The text to be displayed in the Font combo is none of the available values
 * matches the current cursor position or text selection.
 *
 *		// If the default site font is Arial, we may making it more explicit to the end user.
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
 * The list of fonts size to be displayed in the Font Size combo in the
 * toolbar. Entries are separated by semi-colons (`';'`).
 *
 * Any kind of "CSS like" size can be used, like `'12px'`, `'2.3em'`, `'130%'`,
 * `'larger'` or `'x-small'`.
 *
 * A display name may be optionally defined by prefixing the entries with the
 * name and the slash character. For example, `'Bigger Font/14px'` will be
 * displayed as `'Bigger Font'` in the list, but will be outputted as `'14px'`.
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
 * The text to be displayed in the Font Size combo is none of the available
 * values matches the current cursor position or text selection.
 *
 *		// If the default site font size is 12px, we may making it more explicit to the end user.
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
