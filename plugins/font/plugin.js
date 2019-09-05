/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	function addCombo( editor, comboName, styleType, lang, entries, defaultLabel, configStyleDefinition, order ) {
		var config = editor.config,
			allowedAndRequiredContent = new CKEDITOR.style( configStyleDefinition ),
			commandName = comboName.slice( 0, 1 ).toLowerCase() + comboName.slice( 1 ),
			preparedStylesAndNames = _prepareStylesAndNames( {
				entries: entries,
				styleType: styleType,
				configStyleDefinition: configStyleDefinition
			} ),
			styles = preparedStylesAndNames.styles,
			names = preparedStylesAndNames.names,
			defaultValue = '';

		editor.addCommand( commandName , {
			exec: function( editor, data ) {
				if ( editor.readOnly ) {
					return;
				}

				var newValue = data.newValue,
					oldValue = data.oldValue,
					range = editor.getSelection().getRanges()[ 0 ],
					isRemove = newValue === defaultValue,
					oldStyle = styles[ oldValue ],
					newStyle = styles[ newValue ];

				// If the range is collapsed we can't simply use the editor.removeStyle method
				// because it will remove the entire element and we want to split it instead.
				if ( oldValue && range.collapsed ) {
					_splitElementOnCollapsedRange( {
						editor: editor,
						range: range,
						style: oldStyle
					} );
				}

				// Prevent of using remove multiple times
				if ( isRemove ) {
					editor.removeStyle( oldStyle );
				}

				if ( !isRemove ) {
					if ( oldStyle ) {
						editor.removeStyle( oldStyle );
					}
					editor.applyStyle( newStyle );
				}
			}
		} );

		editor.ui.addRichCombo( comboName, {
			label: lang.label,
			title: lang.panelTitle,
			toolbar: 'styles,' + order,
			defaultValue: defaultValue,
			allowedContent: allowedAndRequiredContent,
			requiredContent: allowedAndRequiredContent,
			contentTransformations: configStyleDefinition.element === 'span' ? [
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
				var name,
					defaultText = '(' + editor.lang.common.optionDefault + ')';

				this.startGroup( lang.panelTitle );

				// Add `(Default)` item as a first element on the drop-down list.
				this.add( this.defaultValue, defaultText, defaultText );

				for ( var i = 0; i < names.length; i++ ) {
					name = names[ i ];
					// Add the tag entry to the panel list.
					this.add( name, styles[ name ].buildPreview(), name );
				}
			},

			onClick: onClickHandler,

			onRender: function() {
				editor.on( 'selectionChange', function( ev ) {
					var currentValue = this.getValue();

					var elementPath = ev.data.path,
						elements = elementPath.elements;

					// For each element into the elements path.
					for ( var i = 0, element; i < elements.length; i++ ) {
						element = elements[ i ];

						// Check if the element is removable by any of
						// the styles.
						for ( var value in styles ) {
							if ( styles[ value ].checkElementMatch( element, true, editor ) ) {
								if ( value != currentValue )
									this.setValue( value );
								return;
							}
						}
					}

					// If no styles match, just empty it.
					this.setValue( '', defaultLabel );
				}, this );
			},

			refresh: function() {
				if ( !editor.activeFilter.check( allowedAndRequiredContent ) )
					this.setState( CKEDITOR.TRISTATE_DISABLED );
			}
		} );

		editor.once( 'instanceReady', function() {
			_registerStateSyncronization( editor.getCommand( commandName ), editor.ui.get( comboName ) );
		} );

		function onClickHandler( newValue ) {
			editor.focus();

			var oldValue = this.getValue(),
				newStyle = styles[ newValue ],
				range = editor.getSelection().getRanges()[ 0 ],
				isRemoveOperation = newValue === defaultValue,
				hasStyleToRemove,
				hasFragmentsWithoutNewStyle;

			hasStyleToRemove = isRemoveOperation && _hasStyleToRemove( {
				range: range,
				configStyleDefinition: configStyleDefinition
			} );

			hasFragmentsWithoutNewStyle = !isRemoveOperation && !_hasAlreadyAppliedNewStyle( {
				range: range,
				style: newStyle,
				configStyleDefinition: configStyleDefinition
			} );

			if ( hasStyleToRemove || hasFragmentsWithoutNewStyle ) {
				editor.fire( 'saveSnapshot' );

				editor.execCommand( commandName, {
					newValue: newValue,
					oldValue: oldValue
				} );

				editor.fire( 'saveSnapshot' );
			}
		}
	}

	function _registerStateSyncronization( command, richcombo ) {
		command.on( 'state', function() {
			if ( this.state !== richcombo.getState() ) {
				richcombo.setState( this.state );
			}
		} );

		// This method is overwritten here, because init is run only after opening richcombo panel.
		// That's stata would remain desynchronized after editor's initialization.
		richcombo.setState = function( state ) {
			richcombo.constructor.prototype.setState.call( richcombo, state );

			if ( command.state !== state ) {
				command.setState( state );
			}
		};
	}

	//  * @param {Object} config
	//  * @param {CKEDITOR.dom.range} config.range
	//  * @param {Object} config.configStyleDefinition object representing config option:
	//  * {@link CKEDITOR.config#fontSize_style } or {@link CKEDITOR.config#font_style}
	function _hasStyleToRemove( config ) {
		var range = config.range,
			configStyleDefinition = config.configStyleDefinition,
			walker,
			textNode,
			nodeWithStyle;

		if ( range.collapsed ) {
			nodeWithStyle = range.startContainer.getAscendant( _hasStyle( configStyleDefinition ), true );
			return !!nodeWithStyle;
		}

		walker = new CKEDITOR.dom.walker( range );
		walker.evaluator = CKEDITOR.dom.walker.nodeType( CKEDITOR.NODE_TEXT );

		textNode = walker.next();

		while ( textNode ) {
			nodeWithStyle = textNode.getAscendant( _hasStyle( configStyleDefinition ) );

			if ( nodeWithStyle ) {
				return true;
			}

			textNode = walker.next();
		}

		return false;
	}


	//  * @param {Object} config
	//  * @param {CKEDITOR.dom.range} config.range,
	//  * @param {CKEDITOR.style} config.style style which is going to be applied over given range
	//  * @param {Object} config.configStyleDefinition object representing config option:
	//  * {@link CKEDITOR.config#fontSize_style } or {@link CKEDITOR.config#font_style}
	//  * @returns {Boolean}
	function _hasAlreadyAppliedNewStyle( config ) {
		var range = config.range,
			style = config.style,
			configStyleDefinition = config.configStyleDefinition,
			walker,
			textNode,
			nodeWithStyle;

		if ( range.collapsed ) {
			nodeWithStyle = range.startContainer.getAscendant( _hasStyle( configStyleDefinition ), true );
			return !!( nodeWithStyle && style.checkElementRemovable( nodeWithStyle ) );
		}

		walker = new CKEDITOR.dom.walker( range );
		walker.evaluator = CKEDITOR.dom.walker.nodeType( CKEDITOR.NODE_TEXT );

		textNode = walker.next();

		while ( textNode ) {
			nodeWithStyle = textNode.getAscendant( _hasStyle( configStyleDefinition ) );

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
	function _hasStyle( configStyleDefinition ) {
		var styleDefinitions = _getAvailableStyleDefinitions( configStyleDefinition );

		return function( el ) {
			return el.type === CKEDITOR.NODE_ELEMENT && _matchElementToStyleDefinition( el, styleDefinitions );
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
	function _getAvailableStyleDefinitions( configStyleDefinition ) {
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
	//  * @param {Object[]} availableStyleDefinitions - result from `_getAvailableStyleDefinitions()` function
	function _matchElementToStyleDefinition( el, availableStyleDefinitions ) {
		for ( var i = 0; i < availableStyleDefinitions.length; i++ ) {
			var currentStyleDefinition = availableStyleDefinitions[ i ];

			if ( !_hasValidName( el, currentStyleDefinition ) ) {
				continue;
			}

			if ( !_hasValidAttributes( el, currentStyleDefinition ) ) {
				continue;
			}

			if ( !_hasValidStyles( el, currentStyleDefinition ) ) {
				continue;
			}

			return true;
		}

		return false;
	}

	//  * @param {CKEDITOR.dom.element} el
	//  * @param {Object} styleDefinition Single element from array obtained from `_getAvailableStyleDefinitions()`
	function _hasValidName( el, styleDefinition ) {
		return el.getName() === styleDefinition.element;
	}

	//  * @param {CKEDITOR.dom.element} el
	//  * @param {Object} styleDefinition Single element from array obtained from `_getAvailableStyleDefinitions()`
	function _hasValidAttributes( el, styleDefinition ) {
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
	//  * @param {Object} styleDefinition Single element from array obtained from `_getAvailableStyleDefinitions()`
	function _hasValidStyles( el, styleDefinition ) {
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
	//  * @param {String} config.entries Entries from richcombo, came from {@link CKEDITOR.config#font_names} or {@link CKEDITOR.config#fontSize_sizes}
	//  * @param {'family'|'size'} config.styleType string defined by `addCombo()` in this case its `family` or `size` string,
	//  * @param {Object} config.configStyleDefinition object representing config option:
	//  * {@link CKEDITOR.config#fontSize_style } or {@link CKEDITOR.config#font_style}
	//  * @returns {Object} return.styles - object containing list of defined styles
	//  * @returns {Array} return.names array with style names
	function _prepareStylesAndNames( config ) {
		// Gets the list of fonts from the settings.
		var names = config.entries.split( ';' ),
			values = [];

		// Create style objects for all fonts.
		var styles = {};
		for ( var i = 0; i < names.length; i++ ) {
			var parts = names[ i ];

			if ( parts ) {
				parts = parts.split( '/' );

				var vars = {},
					name = names[ i ] = parts[ 0 ];

				vars[ config.styleType ] = values[ i ] = parts[ 1 ] || name;

				styles[ name ] = new CKEDITOR.style( config.configStyleDefinition, vars );
				styles[ name ]._.definition.name = name;
			} else {
				names.splice( i--, 1 );
			}
		}

		return { styles: styles, names: names };
	}


	//  * @param {Object} config
	//  * @param {CKEDITOR.editor} config.editor instance of the editor
	//  * @param {CKEDITOR.dom.range} config.range analyzed range
	//  * @param {CKEDITOR.style} config.style old style which might already exist on this range
	function _splitElementOnCollapsedRange( config ) {
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

			addCombo( editor, 'Font', 'family', editor.lang.font, config.font_names, config.font_defaultLabel, config.font_style, 30 );
			addCombo( editor, 'FontSize', 'size', editor.lang.font.fontSize, config.fontSize_sizes, config.fontSize_defaultLabel, config.fontSize_style, 40 );
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
