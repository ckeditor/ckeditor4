/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

'use strict';

/**
 * Block style type.
 *
 * Read more in the {@link CKEDITOR.style} class documentation.
 *
 * @readonly
 * @property {Number} [=1]
 * @member CKEDITOR
 */
CKEDITOR.STYLE_BLOCK = 1;

/**
 * Inline style type.
 *
 * Read more in the {@link CKEDITOR.style} class documentation.
 *
 * @readonly
 * @property {Number} [=2]
 * @member CKEDITOR
 */
CKEDITOR.STYLE_INLINE = 2;

/**
 * Object style type.
 *
 * Read more in the {@link CKEDITOR.style} class documentation.
 *
 * @readonly
 * @property {Number} [=3]
 * @member CKEDITOR
 */
CKEDITOR.STYLE_OBJECT = 3;

( function() {
	var blockElements = {
			address: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, p: 1,
			pre: 1, section: 1, header: 1, footer: 1, nav: 1, article: 1, aside: 1, figure: 1,
			dialog: 1, hgroup: 1, time: 1, meter: 1, menu: 1, command: 1, keygen: 1, output: 1,
			progress: 1, details: 1, datagrid: 1, datalist: 1
		},

		objectElements = {
			a: 1, blockquote: 1, embed: 1, hr: 1, img: 1, li: 1, object: 1, ol: 1, table: 1, td: 1,
			tr: 1, th: 1, ul: 1, dl: 1, dt: 1, dd: 1, form: 1, audio: 1, video: 1
		};

	var semicolonFixRegex = /\s*(?:;\s*|$)/,
		varRegex = /#\((.+?)\)/g;

	var notBookmark = CKEDITOR.dom.walker.bookmark( 0, 1 ),
		nonWhitespaces = CKEDITOR.dom.walker.whitespaces( 1 );

	/**
	 * A class representing a style instance for the specific style definition.
	 * In this approach, a style is a set of properties, like attributes and styles,
	 * which can be applied to and removed from a {@link CKEDITOR.dom.selection selection} through
	 * {@link CKEDITOR.editor editor} methods: {@link CKEDITOR.editor#applyStyle} and {@link CKEDITOR.editor#removeStyle},
	 * respectively.
	 *
	 * Three default style types are available: {@link CKEDITOR#STYLE_BLOCK STYLE_BLOCK}, {@link CKEDITOR#STYLE_INLINE STYLE_INLINE},
	 * and {@link CKEDITOR#STYLE_OBJECT STYLE_OBJECT}. Based on its type, a style heavily changes its behavior.
	 * You can read more about style types in the {@glink features/styles#style-types Style Types section of the Styles guide}.
	 *
	 * It is possible to define a custom style type by subclassing this class by using the {@link #addCustomHandler} method.
	 * However, because of great complexity of the styles handling job, it is only possible in very specific cases.
	 *
	 * ### Usage
	 *
	 * Basic usage:
	 *
	 *		// Define a block style.
	 *		var style = new CKEDITOR.style( { element: 'h1' } );
	 *
	 *		// Considering the following selection:
	 *		// <p>Foo</p><p>Bar^</p>
	 *		// Executing:
	 *		editor.applyStyle( style );
	 *		// Will give:
	 *		// <p>Foo</p><h1>Bar^</h1>
	 *		style.checkActive( editor.elementPath(), editor ); // -> true
	 *
	 *		editor.removeStyle( style );
	 *		// Will give:
	 *		// <p>Foo</p><p>Bar^</p>
	 *
	 *		style.checkActive( editor.elementPath(), editor ); // -> false
	 *
	 * Object style:
	 *
	 *		// Define an object style.
	 *		var style = new CKEDITOR.style( { element: 'img', attributes: { 'class': 'foo' } } );
	 *
	 *		// Considering the following selection:
	 *		// <p><img src="bar.png" alt="" />Foo^</p>
	 *		// Executing:
	 *		editor.applyStyle( style );
	 *		// Will not apply the style, because the image is not selected.
	 *		// You can check if a style can be applied on the current selection with:
	 *		style.checkApplicable( editor.elementPath(), editor ); // -> false
	 *
	 *		// Considering the following selection:
	 *		// <p>[<img src="bar.png" alt="" />]Foo</p>
	 *		// Executing
	 *		editor.applyStyle( style );
	 *		// Will give:
	 *		// <p>[<img src="bar.png" alt="" class="foo" />]Foo</p>
	 *
	 * ### API changes introduced in CKEditor 4.4.0
	 *
	 * Before CKEditor 4.4.0 all style instances had no access at all to the {@link CKEDITOR.editor editor instance}
	 * within which the style is used. Neither the style constructor, nor style methods were requiring
	 * passing the editor instance which made styles independent of the editor and hence its settings and state.
	 * This design decision came from CKEditor 3; it started causing problems and became an unsolvable obstacle for
	 * the {@link CKEDITOR.style.customHandlers.widget widget style handler} which we introduced in CKEditor 4.4.
	 *
	 * There were two possible solutions. Passing an editor instance to the style constructor or to every method.
	 * The first approach would be clean, however, having in mind the backward compatibility, we did not decide
	 * to go for it. It would bind the style to one editor instance, making it unusable with other editor instances.
	 * That could break many implementations reusing styles between editors. Therefore, we decided to take the longer
	 * but safer path &mdash; the editor instance became an argument for nearly all style methods, however,
	 * for backward compatibility reasons, all these methods will work without it. Even the newly
	 * implemented {@link CKEDITOR.style.customHandlers.widget widget style handler}'s methods will not fail,
	 * although they will also not work by aborting at an early stage.
	 *
	 * Therefore, you can safely upgrade to CKEditor 4.4.0 even if you use style methods without providing
	 * the editor instance. You must only align your code if your implementation should handle widget styles
	 * or any other custom style handler. Of course, we recommend doing this in any case to avoid potential
	 * problems in the future.
	 *
	 * @class
	 * @constructor Creates a style class instance.
	 * @param {CKEDITOR.style.definition} styleDefinition
	 * @param variablesValues
	 */
	CKEDITOR.style = function( styleDefinition, variablesValues ) {
		if ( typeof styleDefinition.type == 'string' )
			return new CKEDITOR.style.customHandlers[ styleDefinition.type ]( styleDefinition );

		// Inline style text as attribute should be converted
		// to styles object.
		var attrs = styleDefinition.attributes;
		if ( attrs && attrs.style ) {
			styleDefinition.styles = CKEDITOR.tools.extend( {},
				styleDefinition.styles, CKEDITOR.tools.parseCssText( attrs.style ) );
			delete attrs.style;
		}

		if ( variablesValues ) {
			styleDefinition = CKEDITOR.tools.clone( styleDefinition );

			replaceVariables( styleDefinition.attributes, variablesValues );
			replaceVariables( styleDefinition.styles, variablesValues );
		}

		var element = this.element = styleDefinition.element ?
			(
				typeof styleDefinition.element == 'string' ?
					styleDefinition.element.toLowerCase() : styleDefinition.element
			) : '*';

		this.type = styleDefinition.type ||
			(
				blockElements[ element ] ? CKEDITOR.STYLE_BLOCK :
				objectElements[ element ] ? CKEDITOR.STYLE_OBJECT :
				CKEDITOR.STYLE_INLINE
			);

		// If the 'element' property is an object with a set of possible element, it will be applied like an object style: only to existing elements
		if ( typeof this.element == 'object' )
			this.type = CKEDITOR.STYLE_OBJECT;

		this._ = {
			definition: styleDefinition
		};
	};

	CKEDITOR.style.prototype = {
		/**
		 * Applies the style on the editor's current selection.
		 *
		 * Before the style is applied, the method checks if the {@link #checkApplicable style is applicable}.
		 *
		 * **Note:** The recommended way of applying the style is by using the
		 * {@link CKEDITOR.editor#applyStyle} method, which is a shorthand for this method.
		 *
		 * @param {CKEDITOR.editor/CKEDITOR.dom.document} editor The editor instance in which
		 * the style will be applied.
		 * A {@link CKEDITOR.dom.document} instance is accepted for backward compatibility
		 * reasons, although since CKEditor 4.4.0 this type of argument is deprecated. Read more about
		 * the signature change in the {@link CKEDITOR.style} documentation.
		 */
		apply: function( editor ) {
			// Backward compatibility.
			if ( editor instanceof CKEDITOR.dom.document )
				return applyStyleOnSelection.call( this, editor.getSelection() );

			if ( this.checkApplicable( editor.elementPath(), editor ) ) {
				var initialEnterMode = this._.enterMode;

				// See comment in removeStyle.
				if ( !initialEnterMode )
					this._.enterMode = editor.activeEnterMode;
				applyStyleOnSelection.call( this, editor.getSelection(), 0, editor );
				this._.enterMode = initialEnterMode;
			}
		},

		/**
		 * Removes the style from the editor's current selection.
		 *
		 * Before the style is applied, the method checks if {@link #checkApplicable style could be applied}.
		 *
		 * **Note:** The recommended way of removing the style is by using the
		 * {@link CKEDITOR.editor#removeStyle} method, which is a shorthand for this method.
		 *
		 * @param {CKEDITOR.editor/CKEDITOR.dom.document} editor The editor instance in which
		 * the style will be removed.
		 * A {@link CKEDITOR.dom.document} instance is accepted for backward compatibility
		 * reasons, although since CKEditor 4.4.0 this type of argument is deprecated. Read more about
		 * the signature change in the {@link CKEDITOR.style} documentation.
		 */
		remove: function( editor ) {
			// Backward compatibility.
			if ( editor instanceof CKEDITOR.dom.document )
				return applyStyleOnSelection.call( this, editor.getSelection(), 1 );

			if ( this.checkApplicable( editor.elementPath(), editor ) ) {
				var initialEnterMode = this._.enterMode;

				// Before CKEditor 4.4.0 style knew nothing about editor, so in order to provide enterMode
				// which should be used developers were forced to hack the style object (see https://dev.ckeditor.com/ticket/10190).
				// Since CKEditor 4.4.0 style knows about editor (at least when it's being applied/removed), but we
				// use _.enterMode for backward compatibility with those hacks.
				// Note: we should not change style's enter mode if it was already set.
				if ( !initialEnterMode )
					this._.enterMode = editor.activeEnterMode;
				applyStyleOnSelection.call( this, editor.getSelection(), 1, editor );
				this._.enterMode = initialEnterMode;
			}
		},

		/**
		 * Applies the style on the provided range. Unlike {@link #apply} this
		 * method does not take care of setting the selection, however, the range
		 * is updated to the correct place.
		 *
		 * **Note:** If you want to apply the style on the editor selection,
		 * you probably want to use {@link CKEDITOR.editor#applyStyle}.
		 *
		 * @param {CKEDITOR.dom.range} range
		 * @param {CKEDITOR.editor} editor The editor instance. Required argument since
		 * CKEditor 4.4. The style system will work without it, but it is highly
		 * recommended to provide it for integration with all features.  Read more about
		 * the signature change in the {@link CKEDITOR.style} documentation.
		 */
		applyToRange: function( range ) {
			this.applyToRange =
				this.type == CKEDITOR.STYLE_INLINE ? applyInlineStyle :
				this.type == CKEDITOR.STYLE_BLOCK ? applyBlockStyle :
				this.type == CKEDITOR.STYLE_OBJECT ? applyObjectStyle :
				null;

			return this.applyToRange( range );
		},

		/**
		 * Removes the style from the provided range. Unlike {@link #remove} this
		 * method does not take care of setting the selection, however, the range
		 * is updated to the correct place.
		 *
		 * **Note:** If you want to remove the style from the editor selection,
		 * you probably want to use {@link CKEDITOR.editor#removeStyle}.
		 *
		 * @param {CKEDITOR.dom.range} range
		 * @param {CKEDITOR.editor} editor The editor instance. Required argument since
		 * CKEditor 4.4. The style system will work without it, but it is highly
		 * recommended to provide it for integration with all features. Read more about
		 * the signature change in the {@link CKEDITOR.style} documentation.
		 */
		removeFromRange: function( range ) {
			this.removeFromRange =
				this.type == CKEDITOR.STYLE_INLINE ? removeInlineStyle :
				this.type == CKEDITOR.STYLE_BLOCK ? removeBlockStyle :
				this.type == CKEDITOR.STYLE_OBJECT ? removeObjectStyle :
				null;

			return this.removeFromRange( range );
		},

		/**
		 * Applies the style to the element. This method bypasses all checks
		 * and applies the style attributes directly on the provided element. Use with caution.
		 *
		 * See {@link CKEDITOR.editor#applyStyle}.
		 *
		 * @param {CKEDITOR.dom.element} element
		 * @param {CKEDITOR.editor} editor The editor instance. Required argument since
		 * CKEditor 4.4. The style system will work without it, but it is highly
		 * recommended to provide it for integration with all features. Read more about
		 * the signature change in the {@link CKEDITOR.style} documentation.
		 */
		applyToObject: function( element ) {
			setupElement( element, this );
		},

		/**
		 * Gets the style state inside the elements path.
		 *
		 * @param {CKEDITOR.dom.elementPath} elementPath
		 * @param {CKEDITOR.editor} editor The editor instance. Required argument since
		 * CKEditor 4.4. The style system will work without it, but it is highly
		 * recommended to provide it for integration with all features. Read more about
		 * the signature change in the {@link CKEDITOR.style} documentation.
		 * @returns {Boolean} `true` if the element is active in the elements path.
		 */
		checkActive: function( elementPath, editor ) {
			switch ( this.type ) {
				case CKEDITOR.STYLE_BLOCK:
					return this.checkElementRemovable( elementPath.block || elementPath.blockLimit, true, editor );

				case CKEDITOR.STYLE_OBJECT:
				case CKEDITOR.STYLE_INLINE:

					var elements = elementPath.elements;

					for ( var i = 0, element; i < elements.length; i++ ) {
						element = elements[ i ];

						if ( this.type == CKEDITOR.STYLE_INLINE && ( element == elementPath.block || element == elementPath.blockLimit ) )
							continue;

						if ( this.type == CKEDITOR.STYLE_OBJECT ) {
							var name = element.getName();
							if ( !( typeof this.element == 'string' ? name == this.element : name in this.element ) )
								continue;
						}

						if ( this.checkElementRemovable( element, true, editor ) )
							return true;
					}
			}
			return false;
		},

		/**
		 * Whether this style can be applied at the specified elements path.
		 *
		 * @param {CKEDITOR.dom.elementPath} elementPath The elements path to
		 * check the style against.
		 * @param {CKEDITOR.editor} editor The editor instance. Required argument since
		 * CKEditor 4.4. The style system will work without it, but it is highly
		 * recommended to provide it for integration with all features. Read more about
		 * the signature change in the {@link CKEDITOR.style} documentation.
		 * @param {CKEDITOR.filter} [filter] If defined, the style will be
		 * checked against this filter as well.
		 * @returns {Boolean} `true` if this style can be applied at the elements path.
		 */
		checkApplicable: function( elementPath, editor, filter ) {
			// Backward compatibility.
			if ( editor && editor instanceof CKEDITOR.filter )
				filter = editor;

			if ( filter && !filter.check( this ) )
				return false;

			switch ( this.type ) {
				case CKEDITOR.STYLE_OBJECT:
					return !!elementPath.contains( this.element );
				case CKEDITOR.STYLE_BLOCK:
					return !!elementPath.blockLimit.getDtd()[ this.element ];
			}

			return true;
		},

		/**
		 * Checks if the element matches the current style definition.
		 *
		 * @param {CKEDITOR.dom.element} element
		 * @param {Boolean} fullMatch
		 * @param {CKEDITOR.editor} editor The editor instance. Required argument since
		 * CKEditor 4.4. The style system will work without it, but it is highly
		 * recommended to provide it for integration with all features. Read more about
		 * the signature change in the {@link CKEDITOR.style} documentation.
		 * @returns {Boolean}
		 */
		checkElementMatch: function( element, fullMatch ) {
			var def = this._.definition;

			if ( !element || !def.ignoreReadonly && element.isReadOnly() )
				return false;

			var attribs,
				name = element.getName();

			// If the element name is the same as the style name.
			if ( typeof this.element == 'string' ? name == this.element : name in this.element ) {
				// If no attributes are defined in the element.
				if ( !fullMatch && !element.hasAttributes() )
					return true;

				attribs = getAttributesForComparison( def );

				if ( attribs._length ) {
					for ( var attName in attribs ) {
						if ( attName == '_length' )
							continue;

						var elementAttr = element.getAttribute( attName ) || '';

						// Special treatment for 'style' attribute is required.
						if ( attName == 'style' ? compareCssText( attribs[ attName ], elementAttr ) : attribs[ attName ] == elementAttr ) {
							if ( !fullMatch )
								return true;
						} else if ( fullMatch ) {
							return false;
						}
					}
					if ( fullMatch )
						return true;
				} else {
					return true;
				}
			}

			return false;
		},

		/**
		 * Checks if an element, or any of its attributes, is removable by the
		 * current style definition.
		 *
		 * @param {CKEDITOR.dom.element} element
		 * @param {Boolean} fullMatch
		 * @param {CKEDITOR.editor} editor The editor instance. Required argument since
		 * CKEditor 4.4. The style system will work without it, but it is highly
		 * recommended to provide it for integration with all features. Read more about
		 * the signature change in the {@link CKEDITOR.style} documentation.
		 * @returns {Boolean}
		 */
		checkElementRemovable: function( element, fullMatch, editor ) {
			// Check element matches the style itself.
			if ( this.checkElementMatch( element, fullMatch, editor ) )
				return true;

			// Check if the element matches the style overrides.
			var override = getOverrides( this )[ element.getName() ];
			if ( override ) {
				var attribs, attName;

				// If no attributes have been defined, remove the element.
				if ( !( attribs = override.attributes ) )
					return true;

				for ( var i = 0; i < attribs.length; i++ ) {
					attName = attribs[ i ][ 0 ];
					var actualAttrValue = element.getAttribute( attName );
					if ( actualAttrValue ) {
						var attValue = attribs[ i ][ 1 ];

						// Remove the attribute if:
						//    - The override definition value is null;
						//    - The override definition value is a string that
						//      matches the attribute value exactly.
						//    - The override definition value is a regex that
						//      has matches in the attribute value.
						if ( attValue === null )
							return true;
						if ( typeof attValue == 'string' ) {
							if ( actualAttrValue == attValue )
								return true;
						} else if ( attValue.test( actualAttrValue ) ) {
							return true;
						}
					}
				}
			}
			return false;
		},

		/**
		 * Builds the preview HTML based on the styles definition.
		 *
		 * @param {String} [label] The label used in the style preview.
		 * @return {String} The HTML of preview.
		 */
		buildPreview: function( label ) {
			var styleDefinition = this._.definition,
				html = [],
				elementName = styleDefinition.element;

			// Avoid <bdo> in the preview.
			if ( elementName == 'bdo' )
				elementName = 'span';

			html = [ '<', elementName ];

			// Assign all defined attributes.
			var attribs = styleDefinition.attributes;
			if ( attribs ) {
				for ( var att in attribs )
					html.push( ' ', att, '="', attribs[ att ], '"' );
			}

			// Assign the style attribute.
			var cssStyle = CKEDITOR.style.getStyleText( styleDefinition );
			if ( cssStyle )
				html.push( ' style="', cssStyle, '"' );

			html.push( '>', ( label || styleDefinition.name ), '</', elementName, '>' );

			return html.join( '' );
		},

		/**
		 * Returns the style definition.
		 *
		 * @since 4.1.0
		 * @returns {Object}
		 */
		getDefinition: function() {
			return this._.definition;
		}

		/**
		 * If defined (for example by {@link CKEDITOR.style#addCustomHandler custom style handler}), it returns
		 * the {@link CKEDITOR.filter.allowedContentRules allowed content rules} which should be added to the
		 * {@link CKEDITOR.filter} when enabling this style.
		 *
		 * **Note:** This method is not defined in the {@link CKEDITOR.style} class.
		 *
		 * @since 4.4.0
		 * @method toAllowedContentRules
		 * @param {CKEDITOR.editor} [editor] The editor instance.
		 * @returns {CKEDITOR.filter.allowedContentRules} The rules that should represent this style in the {@link CKEDITOR.filter}.
		 */
	};

	/**
	 * Builds the inline style text based on the style definition.
	 *
	 * @static
	 * @param styleDefinition
	 * @returns {String} Inline style text.
	 */
	CKEDITOR.style.getStyleText = function( styleDefinition ) {
		// If we have already computed it, just return it.
		var stylesDef = styleDefinition._ST;
		if ( stylesDef )
			return stylesDef;

		stylesDef = styleDefinition.styles;

		// Builds the StyleText.
		var stylesText = ( styleDefinition.attributes && styleDefinition.attributes.style ) || '',
			specialStylesText = '';

		if ( stylesText.length )
			stylesText = stylesText.replace( semicolonFixRegex, ';' );

		for ( var style in stylesDef ) {
			var styleVal = stylesDef[ style ],
				text = ( style + ':' + styleVal ).replace( semicolonFixRegex, ';' );

			// Some browsers don't support 'inherit' property value, leave them intact. (https://dev.ckeditor.com/ticket/5242)
			if ( styleVal == 'inherit' )
				specialStylesText += text;
			else
				stylesText += text;
		}

		// Browsers make some changes to the style when applying them. So, here
		// we normalize it to the browser format.
		if ( stylesText.length )
			stylesText = CKEDITOR.tools.normalizeCssText( stylesText, true );

		stylesText += specialStylesText;

		// Return it, saving it to the next request.
		return ( styleDefinition._ST = stylesText );
	};

	/**
	 * Namespace containing custom style handlers added with {@link CKEDITOR.style#addCustomHandler}.
	 *
	 * @since 4.4.0
	 * @class
	 * @singleton
	 */
	CKEDITOR.style.customHandlers = {};

	/**
	 * List of all elements that are ignored during styling.
	 *
	 * @since 4.15.0
	 * @property {String[]} [unstylableElements=[]]
	 * @member CKEDITOR.style
	*/
	CKEDITOR.style.unstylableElements = [];

	/**
	 * Creates a {@link CKEDITOR.style} subclass and registers it in the style system.
	 * Registered class will be used as a handler for a style of this type. This allows
	 * to extend the styles system, which by default uses only the {@link CKEDITOR.style}, with
	 * new functionality. Registered classes are accessible in the {@link CKEDITOR.style.customHandlers}.
	 *
	 * ### The Style Class Definition
	 *
	 * The definition object is used to override properties in a prototype inherited
	 * from the {@link CKEDITOR.style} class. It must contain a `type` property which is
	 * a name of the new type and therefore it must be unique. The default style types
	 * ({@link CKEDITOR#STYLE_BLOCK STYLE_BLOCK}, {@link CKEDITOR#STYLE_INLINE STYLE_INLINE},
	 * and {@link CKEDITOR#STYLE_OBJECT STYLE_OBJECT}) are integers, but for easier identification
	 * it is recommended to use strings as custom type names.
	 *
	 * Besides `type`, the definition may contain two more special properties:
	 *
	 *  * `setup {Function}` &ndash; An optional callback executed when a style instance is created.
	 * Like the style constructor, it is executed in style context and with the style definition as an argument.
	 *  * `assignedTo {Number}` &ndash; Can be set to one of the default style types. Some editor
	 * features like the Styles drop-down assign styles to one of the default groups based on
	 * the style type. By using this property it is possible to notify them to which group this
	 * custom style should be assigned. It defaults to the {@link CKEDITOR#STYLE_OBJECT}.
	 *
	 * Other properties of the definition object will just be used to extend the prototype inherited
	 * from the {@link CKEDITOR.style} class. So if the definition contains an `apply` method, it will
	 * override the {@link CKEDITOR.style#apply} method.
	 *
	 * ### Usage
	 *
	 * Registering a basic handler:
	 *
	 *		var styleClass = CKEDITOR.style.addCustomHandler( {
	 *			type: 'custom'
	 *		} );
	 *
	 *		var style = new styleClass( { ... } );
	 *		style instanceof styleClass; // -> true
	 *		style instanceof CKEDITOR.style; // -> true
	 *		style.type; // -> 'custom'
	 *
	 * The {@link CKEDITOR.style} constructor used as a factory:
	 *
	 *		var styleClass = CKEDITOR.style.addCustomHandler( {
	 *			type: 'custom'
	 *		} );
	 *
	 *		// Style constructor accepts style definition (do not confuse with style class definition).
	 *		var style = new CKEDITOR.style( { type: 'custom', attributes: ... } );
	 *		style instanceof styleClass; // -> true
	 *
	 * Thanks to that, integration code using styles does not need to know
	 * which style handler it should use. It is determined by the {@link CKEDITOR.style} constructor.
	 *
	 * Overriding existing {@link CKEDITOR.style} methods:
	 *
	 *		var styleClass = CKEDITOR.style.addCustomHandler( {
	 *			type: 'custom',
	 *			apply: function( editor ) {
	 *				console.log( 'apply' );
	 *			},
	 *			remove: function( editor ) {
	 *				console.log( 'remove' );
	 *			}
	 *		} );
	 *
	 *		var style = new CKEDITOR.style( { type: 'custom', attributes: ... } );
	 *		editor.applyStyle( style ); // logged 'apply'
	 *
	 *		style = new CKEDITOR.style( { element: 'img', attributes: { 'class': 'foo' } } );
	 *		editor.applyStyle( style ); // style is really applied if image was selected
	 *
	 * ### Practical Recommendations
	 *
	 * The style handling job, which includes such tasks as applying, removing, checking state, and
	 * checking if a style can be applied, is very complex. Therefore without deep knowledge
	 * about DOM and especially {@link CKEDITOR.dom.range ranges} and {@link CKEDITOR.dom.walker DOM walker} it is impossible
	 * to implement a completely custom style handler able to handle block, inline, and object type styles.
	 * However, it is possible to customize the default implementation by overriding default methods and
	 * reusing them.
	 *
	 * The only style handler which can be implemented from scratch without huge effort is a style
	 * applicable to objects ({@glink features/styles#style-types read more about types}).
	 * Such style can only be applied when a specific object is selected. An example implementation can
	 * be found in the [widget plugin](https://github.com/ckeditor/ckeditor4/blob/master/plugins/widget/plugin.js).
	 *
	 * When implementing a style handler from scratch at least the following methods must be defined:
	 *
	 * * {@link CKEDITOR.style#apply apply} and {@link CKEDITOR.style#remove remove},
	 * * {@link CKEDITOR.style#checkElementRemovable checkElementRemovable} and
	 * {@link CKEDITOR.style#checkElementMatch checkElementMatch} &ndash; Note that both methods reuse the same logic,
	 * * {@link CKEDITOR.style#checkActive checkActive} &ndash; Reuses
	 * {@link CKEDITOR.style#checkElementMatch checkElementMatch},
	 * * {@link CKEDITOR.style#toAllowedContentRules toAllowedContentRules} &ndash; Not required, but very useful in
	 * case of a custom style that has to notify the {@link CKEDITOR.filter} which rules it allows when registered.
	 *
	 * @since 4.4.0
	 * @static
	 * @member CKEDITOR.style
	 * @param definition The style class definition.
	 * @returns {CKEDITOR.style} The new style class created for the provided definition.
	 */
	CKEDITOR.style.addCustomHandler = function( definition ) {
		var styleClass = function( styleDefinition ) {
			this._ = {
				definition: styleDefinition
			};

			if ( this.setup )
				this.setup( styleDefinition );
		};

		styleClass.prototype = CKEDITOR.tools.extend(
			// Prototype of CKEDITOR.style.
			CKEDITOR.tools.prototypedCopy( CKEDITOR.style.prototype ),
			// Defaults.
			{
				assignedTo: CKEDITOR.STYLE_OBJECT
			},
			// Passed definition - overrides.
			definition,
			true
		);

		this.customHandlers[ definition.type ] = styleClass;

		return styleClass;
	};

	// Gets the parent element which blocks the styling for an element. This
	// can be done through read-only elements (contenteditable=false) or
	// elements with the "data-nostyle" attribute.
	function getUnstylableParent( element, root ) {
		var unstylable, editable;

		while ( ( element = element.getParent() ) ) {
			if ( element.equals( root ) )
				break;

			if ( element.getAttribute( 'data-nostyle' ) )
				unstylable = element;
			else if ( !editable ) {
				var contentEditable = element.getAttribute( 'contentEditable' );

				if ( contentEditable == 'false' )
					unstylable = element;
				else if ( contentEditable == 'true' )
					editable = 1;
			}
		}

		return unstylable;
	}

	var posPrecedingIdenticalContained =
			CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED,
		posFollowingIdenticalContained =
			CKEDITOR.POSITION_FOLLOWING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED;

	// Checks if the current node can be a child of the style element.
	function checkIfNodeCanBeChildOfStyle( def, currentNode, lastNode, nodeName, dtd, nodeIsNoStyle, nodeIsReadonly, includeReadonly ) {
		// Style can be applied to text node.
		if ( !nodeName )
			return 1;

		// Style definitely cannot be applied if DTD or data-nostyle do not allow.
		if ( !dtd[ nodeName ] || nodeIsNoStyle  )
			return 0;

		// Non-editable element cannot be styled is we shouldn't include readonly elements.
		if ( nodeIsReadonly && !includeReadonly  )
			return 0;

		// Check that we haven't passed lastNode yet and that style's childRule allows this style on current element.
		return checkPositionAndRule( currentNode, lastNode, def, posPrecedingIdenticalContained );
	}

	// Check if the style element can be a child of the current
	// node parent or if the element is not defined in the DTD.
	function checkIfStyleCanBeChildOf( def, currentParent, elementName, isUnknownElement ) {
		return currentParent &&
			( ( currentParent.getDtd() || CKEDITOR.dtd.span )[ elementName ] || isUnknownElement ) &&
			( !def.parentRule || def.parentRule( currentParent ) );
	}

	function checkIfStartsRange( nodeName, currentNode, lastNode ) {
		return (
			!nodeName || !CKEDITOR.dtd.$removeEmpty[ nodeName ] ||
			( currentNode.getPosition( lastNode ) | posPrecedingIdenticalContained ) == posPrecedingIdenticalContained
		);
	}

	function checkIfTextOrReadonlyOrEmptyElement( currentNode, nodeIsReadonly ) {
		var nodeType = currentNode.type;
		return nodeType == CKEDITOR.NODE_TEXT || nodeIsReadonly || ( nodeType == CKEDITOR.NODE_ELEMENT && !currentNode.getChildCount() );
	}

	// Checks if position is a subset of posBitFlags and that nodeA fulfills style def rule.
	function checkPositionAndRule( nodeA, nodeB, def, posBitFlags ) {
		return ( nodeA.getPosition( nodeB ) | posBitFlags ) == posBitFlags &&
			( !def.childRule || def.childRule( nodeA ) );
	}

	function applyInlineStyle( range ) {
		var document = range.document;

		if ( range.collapsed ) {
			// Create the element to be inserted in the DOM.
			var collapsedElement = getElement( this, document );

			// Insert the empty element into the DOM at the range position.
			range.insertNode( collapsedElement );

			// Place the selection right inside the empty element.
			range.moveToPosition( collapsedElement, CKEDITOR.POSITION_BEFORE_END );

			return;
		}

		var elementName = this.element,
			def = this._.definition,
			isUnknownElement;

		// Indicates that fully selected read-only elements are to be included in the styling range.
		var ignoreReadonly = def.ignoreReadonly,
			includeReadonly = ignoreReadonly || def.includeReadonly;

		// If the read-only inclusion is not available in the definition, try
		// to get it from the root data (most often it's the editable).
		if ( includeReadonly == null )
			includeReadonly = range.root.getCustomData( 'cke_includeReadonly' );

		// Get the DTD definition for the element. Defaults to "span".
		var dtd = CKEDITOR.dtd[ elementName ];
		if ( !dtd ) {
			isUnknownElement = true;
			dtd = CKEDITOR.dtd.span;
		}

		// Expand the range.
		range.enlarge( CKEDITOR.ENLARGE_INLINE, 1 );
		range.trim();

		// Get the first node to be processed and the last, which concludes the processing.
		var boundaryNodes = range.createBookmark(),
			firstNode = boundaryNodes.startNode,
			lastNode = boundaryNodes.endNode,
			currentNode = firstNode,
			styleRange;

		if ( !ignoreReadonly ) {
			// Check if the boundaries are inside non stylable elements.
			var root = range.getCommonAncestor(),
				firstUnstylable = getUnstylableParent( firstNode, root ),
				lastUnstylable = getUnstylableParent( lastNode, root );

			// If the first element can't be styled, we'll start processing right
			// after its unstylable root.
			if ( firstUnstylable )
				currentNode = firstUnstylable.getNextSourceNode( true );

			// If the last element can't be styled, we'll stop processing on its
			// unstylable root.
			if ( lastUnstylable )
				lastNode = lastUnstylable;
		}

		// Do nothing if the current node now follows the last node to be processed.
		if ( currentNode.getPosition( lastNode ) == CKEDITOR.POSITION_FOLLOWING )
			currentNode = 0;

		while ( currentNode ) {
			var applyStyle = false;

			if ( currentNode.equals( lastNode ) ) {
				currentNode = null;
				applyStyle = true;
			} else {
				var nodeName = currentNode.type == CKEDITOR.NODE_ELEMENT ? currentNode.getName() : null,
					nodeIsReadonly = nodeName && ( currentNode.getAttribute( 'contentEditable' ) == 'false' ),
					nodeIsUnstylable = nodeName &&
						CKEDITOR.tools.array.indexOf( CKEDITOR.style.unstylableElements, nodeName ) !== -1,
					nodeIsNoStyle = nodeName && ( currentNode.getAttribute( 'data-nostyle' ) || nodeIsUnstylable );

				// Skip bookmarks or comments.
				if ( ( nodeName && currentNode.data( 'cke-bookmark' ) ) || currentNode.type === CKEDITOR.NODE_COMMENT ) {
					currentNode = currentNode.getNextSourceNode( true );
					continue;
				}

				// Find all nested editables of a non-editable block and apply this style inside them.
				if ( nodeIsReadonly && includeReadonly && CKEDITOR.dtd.$block[ nodeName ] )
					applyStyleOnNestedEditables.call( this, currentNode );

				// Check if the current node can be a child of the style element.
				if ( checkIfNodeCanBeChildOfStyle( def, currentNode, lastNode, nodeName, dtd, nodeIsNoStyle, nodeIsReadonly, includeReadonly ) ) {
					var currentParent = currentNode.getParent();

					// Check if the style element can be a child of the current
					// node parent or if the element is not defined in the DTD.
					if ( checkIfStyleCanBeChildOf( def, currentParent, elementName, isUnknownElement ) ) {
						// This node will be part of our range, so if it has not
						// been started, place its start right before the node.
						// In the case of an element node, it will be included
						// only if it is entirely inside the range.
						if ( !styleRange && checkIfStartsRange( nodeName, currentNode, lastNode ) ) {
							styleRange = range.clone();
							styleRange.setStartBefore( currentNode );
						}

						// Non element nodes, readonly elements, or empty
						// elements can be added completely to the range.
						if ( checkIfTextOrReadonlyOrEmptyElement( currentNode, nodeIsReadonly ) ) {
							var includedNode = currentNode;
							var parentNode;

							// This node is about to be included completely, but,
							// if this is the last node in its parent, we must also
							// check if the parent itself can be added completely
							// to the range, otherwise apply the style immediately.
							while (
								( applyStyle = !includedNode.getNext( notBookmark ) ) &&
								( parentNode = includedNode.getParent(), dtd[ parentNode.getName() ] ) &&
								checkPositionAndRule( parentNode, firstNode, def, posFollowingIdenticalContained )
							) {
								includedNode = parentNode;
							}

							styleRange.setEndAfter( includedNode );

						}
					} else {
						applyStyle = true;
					}
				}
				// Style isn't applicable to current element, so apply style to
				// range ending at previously chosen position, or nowhere if we haven't
				// yet started styleRange.
				else {
					applyStyle = true;
				}

				// Get the next node to be processed.
				// If we're currently on a non-editable element or non-styleable element,
				// then we'll be moved to current node's sibling (or even further), so we'll
				// avoid messing up its content.
				currentNode = currentNode.getNextSourceNode( nodeIsNoStyle || nodeIsReadonly );
			}

			// Apply the style if we have something to which apply it.
			if ( applyStyle && styleRange && !styleRange.collapsed ) {
				// Build the style element, based on the style object definition.
				var styleNode = getElement( this, document ),
					styleHasAttrs = styleNode.hasAttributes();

				// Get the element that holds the entire range.
				var parent = styleRange.getCommonAncestor();

				var removeList = {
					styles: {},
					attrs: {},
					// Styles cannot be removed.
					blockedStyles: {},
					// Attrs cannot be removed.
					blockedAttrs: {}
				};

				var attName, styleName, value;

				// Loop through the parents, removing the redundant attributes
				// from the element to be applied.
				while ( styleNode && parent ) {
					if ( parent.getName() == elementName ) {
						for ( attName in def.attributes ) {
							if ( removeList.blockedAttrs[ attName ] || !( value = parent.getAttribute( styleName ) ) )
								continue;

							if ( styleNode.getAttribute( attName ) == value )
								removeList.attrs[ attName ] = 1;
							else
								removeList.blockedAttrs[ attName ] = 1;
						}

						for ( styleName in def.styles ) {
							if ( removeList.blockedStyles[ styleName ] || !( value = parent.getStyle( styleName ) ) )
								continue;

							if ( styleNode.getStyle( styleName ) == value )
								removeList.styles[ styleName ] = 1;
							else
								removeList.blockedStyles[ styleName ] = 1;
						}
					}

					parent = parent.getParent();
				}

				for ( attName in removeList.attrs )
					styleNode.removeAttribute( attName );

				for ( styleName in removeList.styles )
					styleNode.removeStyle( styleName );

				if ( styleHasAttrs && !styleNode.hasAttributes() )
					styleNode = null;

				if ( styleNode ) {
					// Move the contents of the range to the style element.
					styleRange.extractContents().appendTo( styleNode );

					// Insert it into the range position (it is collapsed after
					// extractContents.
					styleRange.insertNode( styleNode );

					// Here we do some cleanup, removing all duplicated
					// elements from the style element.
					removeFromInsideElement.call( this, styleNode );

					// Let's merge our new style with its neighbors, if possible.
					styleNode.mergeSiblings();

					// As the style system breaks text nodes constantly, let's normalize
					// things for performance.
					// With IE, some paragraphs get broken when calling normalize()
					// repeatedly. Also, for IE, we must normalize body, not documentElement.
					// IE is also known for having a "crash effect" with normalize().
					// We should try to normalize with IE too in some way, somewhere.
					if ( !CKEDITOR.env.ie )
						styleNode.$.normalize();
				}
				// Style already inherit from parents, left just to clear up any internal overrides. (https://dev.ckeditor.com/ticket/5931)
				else {
					styleNode = new CKEDITOR.dom.element( 'span' );
					styleRange.extractContents().appendTo( styleNode );
					styleRange.insertNode( styleNode );
					removeFromInsideElement.call( this, styleNode );
					styleNode.remove( true );
				}

				// Style applied, let's release the range, so it gets
				// re-initialization in the next loop.
				styleRange = null;
			}
		}

		// Remove the bookmark nodes.
		range.moveToBookmark( boundaryNodes );

		// Minimize the result range to exclude empty text nodes. (https://dev.ckeditor.com/ticket/5374)
		range.shrink( CKEDITOR.SHRINK_TEXT );

		// Get inside the remaining element if range.shrink( TEXT ) has failed because of non-editable elements inside.
		// E.g. range.shrink( TEXT ) will not get inside:
		// [<b><i contenteditable="false">x</i></b>]
		// but range.shrink( ELEMENT ) will.
		range.shrink( CKEDITOR.NODE_ELEMENT, true );
	}

	function removeInlineStyle( range ) {
		// Make sure our range has included all "collpased" parent inline nodes so
		// that our operation logic can be simpler.
		range.enlarge( CKEDITOR.ENLARGE_INLINE, 1 );

		var bookmark = range.createBookmark(),
			startNode = bookmark.startNode,
			alwaysRemoveElement = this._.definition.alwaysRemoveElement;

		if ( range.collapsed ) {
			var startPath = new CKEDITOR.dom.elementPath( startNode.getParent(), range.root ),
				// The topmost element in elements path which we should jump out of.
				boundaryElement;

			for ( var i = 0, element; i < startPath.elements.length && ( element = startPath.elements[ i ] ); i++ ) {
				// 1. If it's collaped inside text nodes, try to remove the style from the whole element.
				//
				// 2. Otherwise if it's collapsed on element boundaries, moving the selection
				//  outside the styles instead of removing the whole tag,
				//  also make sure other inner styles were well preserved.(https://dev.ckeditor.com/ticket/3309)
				//
				// 3. Force removing the element even if it's an boundary element when alwaysRemoveElement is true.
				// Without it, the links won't be unlinked if the cursor is placed right before/after it. (https://dev.ckeditor.com/ticket/13062)
				if ( element == startPath.block || element == startPath.blockLimit ) {
					break;
				}

				if ( this.checkElementRemovable( element ) ) {
					var isStart;

					if ( !alwaysRemoveElement && range.collapsed && ( range.checkBoundaryOfElement( element, CKEDITOR.END ) || ( isStart = range.checkBoundaryOfElement( element, CKEDITOR.START ) ) ) ) {
						boundaryElement = element;
						boundaryElement.match = isStart ? 'start' : 'end';
					} else {
						// Before removing the style node, there may be a sibling to the style node
						// that's exactly the same to the one to be removed. To the user, it makes
						// no difference that they're separate entities in the DOM tree. So, merge
						// them before removal.
						element.mergeSiblings();
						if ( element.is( this.element ) ) {
							removeFromElement.call( this, element );
						} else {
							removeOverrides( element, getOverrides( this )[ element.getName() ] );
						}
					}
				}
			}

			// Re-create the style tree after/before the boundary element,
			// the replication start from bookmark start node to define the
			// new range.
			if ( boundaryElement ) {
				var clonedElement = startNode;
				for ( i = 0; ; i++ ) {
					var newElement = startPath.elements[ i ];
					if ( newElement.equals( boundaryElement ) )
						break;
					// Avoid copying any matched element.
					else if ( newElement.match )
						continue;
					else
						newElement = newElement.clone();
					newElement.append( clonedElement );
					clonedElement = newElement;
				}
				clonedElement[ boundaryElement.match == 'start' ? 'insertBefore' : 'insertAfter' ]( boundaryElement );
			}
		} else {
			// Now our range isn't collapsed. Lets walk from the start node to the end
			// node via DFS and remove the styles one-by-one.
			var endNode = bookmark.endNode,
				me = this;

			breakNodes();

			// Now, do the DFS walk.
			var currentNode = startNode;
			while ( !currentNode.equals( endNode ) ) {
				// Need to get the next node first because removeFromElement() can remove
				// the current node from DOM tree.
				var nextNode = currentNode.getNextSourceNode();
				if ( currentNode.type == CKEDITOR.NODE_ELEMENT && this.checkElementRemovable( currentNode ) ) {
					// Remove style from element or overriding element.
					if ( currentNode.getName() == this.element )
						removeFromElement.call( this, currentNode );
					else
						removeOverrides( currentNode, getOverrides( this )[ currentNode.getName() ] );

					// removeFromElement() may have merged the next node with something before
					// the startNode via mergeSiblings(). In that case, the nextNode would
					// contain startNode and we'll have to call breakNodes() again and also
					// reassign the nextNode to something after startNode.
					if ( nextNode.type == CKEDITOR.NODE_ELEMENT && nextNode.contains( startNode ) ) {
						breakNodes();
						nextNode = startNode.getNext();
					}
				}
				currentNode = nextNode;
			}
		}

		range.moveToBookmark( bookmark );
		// See the comment for range.shrink in applyInlineStyle.
		range.shrink( CKEDITOR.NODE_ELEMENT, true );

		// Find out the style ancestor that needs to be broken down at startNode
		// and endNode.
		function breakNodes() {
			var startPath = new CKEDITOR.dom.elementPath( startNode.getParent() ),
				endPath = new CKEDITOR.dom.elementPath( endNode.getParent() ),
				breakStart = null,
				breakEnd = null;

			for ( var i = 0; i < startPath.elements.length; i++ ) {
				var element = startPath.elements[ i ];

				if ( element == startPath.block || element == startPath.blockLimit )
					break;

				if ( me.checkElementRemovable( element, true ) )
					breakStart = element;
			}

			for ( i = 0; i < endPath.elements.length; i++ ) {
				element = endPath.elements[ i ];

				if ( element == endPath.block || element == endPath.blockLimit )
					break;

				if ( me.checkElementRemovable( element, true ) )
					breakEnd = element;
			}

			if ( breakEnd )
				endNode.breakParent( breakEnd );
			if ( breakStart )
				startNode.breakParent( breakStart );
		}
	}

	// Apply style to nested editables inside editablesContainer.
	// @param {CKEDITOR.dom.element} editablesContainer
	// @context CKEDITOR.style
	function applyStyleOnNestedEditables( editablesContainer ) {
		var editables = findNestedEditables( editablesContainer ),
			editable,
			l = editables.length,
			i = 0,
			range = l && new CKEDITOR.dom.range( editablesContainer.getDocument() );

		for ( ; i < l; ++i ) {
			editable = editables[ i ];
			// Check if style is allowed by this editable's ACF.
			if ( checkIfAllowedInEditable( editable, this ) ) {
				range.selectNodeContents( editable );
				applyInlineStyle.call( this, range );
			}
		}
	}

	// Finds nested editables within container. Does not return
	// editables nested in another editable (twice).
	function findNestedEditables( container ) {
		var editables = [];

		container.forEach( function( element ) {
			if ( element.getAttribute( 'contenteditable' ) == 'true' ) {
				editables.push( element );
				return false; // Skip children.
			}
		}, CKEDITOR.NODE_ELEMENT, true );

		return editables;
	}

	// Checks if style is allowed in this editable.
	function checkIfAllowedInEditable( editable, style ) {
		var filter = CKEDITOR.filter.instances[ editable.data( 'cke-filter' ) ];

		return filter ? filter.check( style ) : 1;
	}

	// Checks if style is allowed by iterator's active filter.
	function checkIfAllowedByIterator( iterator, style ) {
		return iterator.activeFilter ? iterator.activeFilter.check( style ) : 1;
	}

	function applyObjectStyle( range ) {
		// Selected or parent element. (https://dev.ckeditor.com/ticket/9651)
		var start = range.getEnclosedNode() || range.getCommonAncestor( false, true ),
			element = new CKEDITOR.dom.elementPath( start, range.root ).contains( this.element, 1 );

		element && !element.isReadOnly() && setupElement( element, this );
	}

	function removeObjectStyle( range ) {
		var parent = range.getCommonAncestor( true, true ),
			element = new CKEDITOR.dom.elementPath( parent, range.root ).contains( this.element, 1 );

		if ( !element )
			return;

		var style = this,
			def = style._.definition,
			attributes = def.attributes;

		// Remove all defined attributes.
		if ( attributes ) {
			for ( var att in attributes )
				element.removeAttribute( att, attributes[ att ] );
		}

		// Assign all defined styles.
		if ( def.styles ) {
			for ( var i in def.styles ) {
				if ( def.styles.hasOwnProperty( i ) )
					element.removeStyle( i );
			}
		}
	}

	function applyBlockStyle( range ) {
		// Serializible bookmarks is needed here since
		// elements may be merged.
		var bookmark = range.createBookmark( true );

		var iterator = range.createIterator();
		iterator.enforceRealBlocks = true;

		// make recognize <br /> tag as a separator in ENTER_BR mode (https://dev.ckeditor.com/ticket/5121)
		if ( this._.enterMode )
			iterator.enlargeBr = ( this._.enterMode != CKEDITOR.ENTER_BR );

		var block,
			doc = range.document,
			newBlock;

		while ( ( block = iterator.getNextParagraph() ) ) {
			if ( !block.isReadOnly() && checkIfAllowedByIterator( iterator, this ) ) {
				newBlock = getElement( this, doc, block );
				replaceBlock( block, newBlock );
			}
		}

		range.moveToBookmark( bookmark );
	}

	function removeBlockStyle( range ) {
		// Serializible bookmarks is needed here since
		// elements may be merged.
		var bookmark = range.createBookmark( 1 );

		var iterator = range.createIterator();
		iterator.enforceRealBlocks = true;
		iterator.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;

		var block,
			newBlock;

		while ( ( block = iterator.getNextParagraph() ) ) {
			if ( this.checkElementRemovable( block ) ) {
				// <pre> get special treatment.
				if ( block.is( 'pre' ) ) {
					newBlock = this._.enterMode == CKEDITOR.ENTER_BR ? null :
							range.document.createElement( this._.enterMode == CKEDITOR.ENTER_P ? 'p' : 'div' );

					newBlock && block.copyAttributes( newBlock );
					replaceBlock( block, newBlock );
				} else {
					removeFromElement.call( this, block );
				}
			}
		}

		range.moveToBookmark( bookmark );
	}

	// Replace the original block with new one, with special treatment
	// for <pre> blocks to make sure content format is well preserved, and merging/splitting adjacent
	// when necessary. (https://dev.ckeditor.com/ticket/3188)
	function replaceBlock( block, newBlock ) {
		// Block is to be removed, create a temp element to
		// save contents.
		var removeBlock = !newBlock;
		if ( removeBlock ) {
			newBlock = block.getDocument().createElement( 'div' );
			block.copyAttributes( newBlock );
		}

		var newBlockIsPre = newBlock && newBlock.is( 'pre' ),
			blockIsPre = block.is( 'pre' ),
			isToPre = newBlockIsPre && !blockIsPre,
			isFromPre = !newBlockIsPre && blockIsPre;

		if ( isToPre )
			newBlock = toPre( block, newBlock );
		else if ( isFromPre )
			// Split big <pre> into pieces before start to convert.
			newBlock = fromPres( removeBlock ? [ block.getHtml() ] : splitIntoPres( block ), newBlock );
		else
			block.moveChildren( newBlock );

		newBlock.replace( block );

		if ( newBlockIsPre ) {
			// Merge previous <pre> blocks.
			mergePre( newBlock );
		} else if ( removeBlock ) {
			removeNoAttribsElement( newBlock );
		}
	}

	// Merge a <pre> block with a previous sibling if available.
	function mergePre( preBlock ) {
		var previousBlock;
		if ( !( ( previousBlock = preBlock.getPrevious( nonWhitespaces ) ) && previousBlock.type == CKEDITOR.NODE_ELEMENT && previousBlock.is( 'pre' ) ) )
			return;

		// Merge the previous <pre> block contents into the current <pre>
		// block.
		//
		// Another thing to be careful here is that currentBlock might contain
		// a '\n' at the beginning, and previousBlock might contain a '\n'
		// towards the end. These new lines are not normally displayed but they
		// become visible after merging.
		var mergedHtml = replace( previousBlock.getHtml(), /\n$/, '' ) + '\n\n' +
			replace( preBlock.getHtml(), /^\n/, '' );

		// Krugle: IE normalizes innerHTML from <pre>, breaking whitespaces.
		if ( CKEDITOR.env.ie )
			preBlock.$.outerHTML = '<pre>' + mergedHtml + '</pre>';
		else
			preBlock.setHtml( mergedHtml );

		previousBlock.remove();
	}

	// Split into multiple <pre> blocks separated by double line-break.
	function splitIntoPres( preBlock ) {
		// Exclude the ones at header OR at tail,
		// and ignore bookmark content between them.
		var duoBrRegex = /(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi,
			pres = [],
			splitedHtml = replace( preBlock.getOuterHtml(), duoBrRegex, function( match, charBefore, bookmark ) {
				return charBefore + '</pre>' + bookmark + '<pre>';
			} );

		splitedHtml.replace( /<pre\b.*?>([\s\S]*?)<\/pre>/gi, function( match, preContent ) {
			pres.push( preContent );
		} );
		return pres;
	}

	// Wrapper function of String::replace without considering of head/tail bookmarks nodes.
	function replace( str, regexp, replacement ) {
		var headBookmark = '',
			tailBookmark = '';

		str = str.replace( /(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi, function( str, m1, m2 ) {
			m1 && ( headBookmark = m1 );
			m2 && ( tailBookmark = m2 );
			return '';
		} );
		return headBookmark + str.replace( regexp, replacement ) + tailBookmark;
	}

	// Converting a list of <pre> into blocks with format well preserved.
	function fromPres( preHtmls, newBlock ) {
		var docFrag;
		if ( preHtmls.length > 1 )
			docFrag = new CKEDITOR.dom.documentFragment( newBlock.getDocument() );

		for ( var i = 0; i < preHtmls.length; i++ ) {
			var blockHtml = preHtmls[ i ];

			// 1. Trim the first and last line-breaks immediately after and before <pre>,
			// they're not visible.
			blockHtml = blockHtml.replace( /(\r\n|\r)/g, '\n' );
			blockHtml = replace( blockHtml, /^[ \t]*\n/, '' );
			blockHtml = replace( blockHtml, /\n$/, '' );
			// 2. Convert spaces or tabs at the beginning or at the end to &nbsp;
			blockHtml = replace( blockHtml, /^[ \t]+|[ \t]+$/g, function( match, offset ) {
				if ( match.length == 1 ) // one space, preserve it
					return '&nbsp;';
				else if ( !offset ) // beginning of block
					return CKEDITOR.tools.repeat( '&nbsp;', match.length - 1 ) + ' ';
				else // end of block
					return ' ' + CKEDITOR.tools.repeat( '&nbsp;', match.length - 1 );
			} );

			// 3. Convert \n to <BR>.
			// 4. Convert contiguous (i.e. non-singular) spaces or tabs to &nbsp;
			blockHtml = blockHtml.replace( /\n/g, '<br>' );
			blockHtml = blockHtml.replace( /[ \t]{2,}/g, function( match ) {
				return CKEDITOR.tools.repeat( '&nbsp;', match.length - 1 ) + ' ';
			} );

			if ( docFrag ) {
				var newBlockClone = newBlock.clone();
				newBlockClone.setHtml( blockHtml );
				docFrag.append( newBlockClone );
			} else {
				newBlock.setHtml( blockHtml );
			}
		}

		return docFrag || newBlock;
	}

	// Converting from a non-PRE block to a PRE block in formatting operations.
	function toPre( block, newBlock ) {
		var bogus = block.getBogus();
		bogus && bogus.remove();

		// First trim the block content.
		var preHtml = block.getHtml();

		// 1. Trim head/tail spaces, they're not visible.
		preHtml = replace( preHtml, /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, '' );
		// 2. Delete ANSI whitespaces immediately before and after <BR> because
		//    they are not visible.
		preHtml = preHtml.replace( /[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi, '$1' );
		// 3. Compress other ANSI whitespaces since they're only visible as one
		//    single space previously.
		// 4. Convert &nbsp; to spaces since &nbsp; is no longer needed in <PRE>.
		preHtml = preHtml.replace( /([ \t\n\r]+|&nbsp;)/g, ' ' );
		// 5. Convert any <BR /> to \n. This must not be done earlier because
		//    the \n would then get compressed.
		preHtml = preHtml.replace( /<br\b[^>]*>/gi, '\n' );

		// Krugle: IE normalizes innerHTML to <pre>, breaking whitespaces.
		if ( CKEDITOR.env.ie ) {
			var temp = block.getDocument().createElement( 'div' );
			temp.append( newBlock );
			newBlock.$.outerHTML = '<pre>' + preHtml + '</pre>';
			newBlock.copyAttributes( temp.getFirst() );
			newBlock = temp.getFirst().remove();
		} else {
			newBlock.setHtml( preHtml );
		}

		return newBlock;
	}

	// Removes a style from an element itself, don't care about its subtree.
	function removeFromElement( element, keepDataAttrs ) {
		var def = this._.definition,
			attributes = def.attributes,
			styles = def.styles,
			overrides = getOverrides( this )[ element.getName() ],
			// If the style is only about the element itself, we have to remove the element.
			removeEmpty = CKEDITOR.tools.isEmpty( attributes ) && CKEDITOR.tools.isEmpty( styles );

		// Remove definition attributes/style from the elemnt.
		for ( var attName in attributes ) {
			// The 'class' element value must match (https://dev.ckeditor.com/ticket/1318).
			if ( ( attName == 'class' || this._.definition.fullMatch ) && element.getAttribute( attName ) != normalizeProperty( attName, attributes[ attName ] ) )
				continue;

			// Do not touch data-* attributes (https://dev.ckeditor.com/ticket/11011) (https://dev.ckeditor.com/ticket/11258).
			if ( keepDataAttrs && attName.slice( 0, 5 ) == 'data-' )
				continue;

			removeEmpty = element.hasAttribute( attName );
			element.removeAttribute( attName );
		}

		for ( var styleName in styles ) {
			// Full match style insist on having fully equivalence. (https://dev.ckeditor.com/ticket/5018)
			if ( this._.definition.fullMatch && element.getStyle( styleName ) != normalizeProperty( styleName, styles[ styleName ], true ) )
				continue;

			removeEmpty = removeEmpty || !!element.getStyle( styleName );
			element.removeStyle( styleName );
		}

		// Remove overrides, but don't remove the element if it's a block element
		removeOverrides( element, overrides, blockElements[ element.getName() ] );

		if ( removeEmpty ) {
			if ( this._.definition.alwaysRemoveElement )
				removeNoAttribsElement( element, 1 );
			else {
				if ( !CKEDITOR.dtd.$block[ element.getName() ] || this._.enterMode == CKEDITOR.ENTER_BR && !element.hasAttributes() )
					removeNoAttribsElement( element );
				else
					element.renameNode( this._.enterMode == CKEDITOR.ENTER_P ? 'p' : 'div' );
			}
		}
	}

	// Removes a style from inside an element. Called on applyStyle to make cleanup
	// before apply. During clean up this function keep data-* attribute in contrast
	// to removeFromElement.
	function removeFromInsideElement( element ) {
		var overrides = getOverrides( this ),
			innerElements = element.getElementsByTag( this.element ),
			innerElement;

		for ( var i = innerElements.count(); --i >= 0; ) {
			innerElement = innerElements.getItem( i );

			// Do not remove elements which are read only (e.g. duplicates inside widgets).
			if ( !innerElement.isReadOnly() )
				removeFromElement.call( this, innerElement, true );
		}

		// Now remove any other element with different name that is
		// defined to be overriden.
		for ( var overrideElement in overrides ) {
			if ( overrideElement != this.element ) {
				innerElements = element.getElementsByTag( overrideElement );

				for ( i = innerElements.count() - 1; i >= 0; i-- ) {
					innerElement = innerElements.getItem( i );

					// Do not remove elements which are read only (e.g. duplicates inside widgets).
					if ( !innerElement.isReadOnly() )
						removeOverrides( innerElement, overrides[ overrideElement ] );
				}
			}
		}
	}

	// Remove overriding styles/attributes from the specific element.
	// Note: Remove the element if no attributes remain.
	// @param {Object} element
	// @param {Object} overrides
	// @param {Boolean} Don't remove the element
	function removeOverrides( element, overrides, dontRemove ) {
		var attributes = overrides && overrides.attributes;

		if ( attributes ) {
			for ( var i = 0; i < attributes.length; i++ ) {
				var attName = attributes[ i ][ 0 ],
					actualAttrValue;

				if ( ( actualAttrValue = element.getAttribute( attName ) ) ) {
					var attValue = attributes[ i ][ 1 ];

					// Remove the attribute if:
					//    - The override definition value is null ;
					//    - The override definition valie is a string that
					//      matches the attribute value exactly.
					//    - The override definition value is a regex that
					//      has matches in the attribute value.
					if ( attValue === null || ( attValue.test && attValue.test( actualAttrValue ) ) || ( typeof attValue == 'string' && actualAttrValue == attValue ) )
						element.removeAttribute( attName );
				}
			}
		}

		if ( !dontRemove )
			removeNoAttribsElement( element );
	}

	// If the element has no more attributes, remove it.
	function removeNoAttribsElement( element, forceRemove ) {
		// If no more attributes remained in the element, remove it,
		// leaving its children.
		if ( !element.hasAttributes() || forceRemove ) {
			if ( CKEDITOR.dtd.$block[ element.getName() ] ) {
				var previous = element.getPrevious( nonWhitespaces ),
					next = element.getNext( nonWhitespaces );

				if ( previous && ( previous.type == CKEDITOR.NODE_TEXT || !previous.isBlockBoundary( { br: 1 } ) ) )
					element.append( 'br', 1 );
				if ( next && ( next.type == CKEDITOR.NODE_TEXT || !next.isBlockBoundary( { br: 1 } ) ) )
					element.append( 'br' );

				element.remove( true );
			} else {
				// Removing elements may open points where merging is possible,
				// so let's cache the first and last nodes for later checking.
				var firstChild = element.getFirst();
				var lastChild = element.getLast();

				element.remove( true );

				if ( firstChild ) {
					// Check the cached nodes for merging.
					firstChild.type == CKEDITOR.NODE_ELEMENT && firstChild.mergeSiblings();

					if ( lastChild && !firstChild.equals( lastChild ) && lastChild.type == CKEDITOR.NODE_ELEMENT )
						lastChild.mergeSiblings();
				}

			}
		}
	}

	function getElement( style, targetDocument, element ) {
		var el,
			elementName = style.element;

		// The "*" element name will always be a span for this function.
		if ( elementName == '*' )
			elementName = 'span';

		// Create the element.
		el = new CKEDITOR.dom.element( elementName, targetDocument );

		// https://dev.ckeditor.com/ticket/6226: attributes should be copied before the new ones are applied
		if ( element )
			element.copyAttributes( el );

		el = setupElement( el, style );

		// Avoid ID duplication.
		if ( targetDocument.getCustomData( 'doc_processing_style' ) && el.hasAttribute( 'id' ) )
			el.removeAttribute( 'id' );
		else
			targetDocument.setCustomData( 'doc_processing_style', 1 );

		return el;
	}

	function setupElement( el, style ) {
		var def = style._.definition,
			attributes = def.attributes,
			styles = CKEDITOR.style.getStyleText( def );

		// Assign all defined attributes.
		if ( attributes ) {
			for ( var att in attributes )
				el.setAttribute( att, attributes[ att ] );
		}

		// Assign all defined styles.
		if ( styles )
			el.setAttribute( 'style', styles );

		el.getDocument().removeCustomData( 'doc_processing_style' );

		return el;
	}

	function replaceVariables( list, variablesValues ) {
		for ( var item in list ) {
			list[ item ] = list[ item ].replace( varRegex, function( match, varName ) {
				return variablesValues[ varName ];
			} );
		}
	}

	// Returns an object that can be used for style matching comparison.
	// Attributes names and values are all lowercased, and the styles get
	// merged with the style attribute.
	function getAttributesForComparison( styleDefinition ) {
		// If we have already computed it, just return it.
		var attribs = styleDefinition._AC;
		if ( attribs )
			return attribs;

		attribs = {};

		var length = 0;

		// Loop through all defined attributes.
		var styleAttribs = styleDefinition.attributes;
		if ( styleAttribs ) {
			for ( var styleAtt in styleAttribs ) {
				length++;
				attribs[ styleAtt ] = styleAttribs[ styleAtt ];
			}
		}

		// Includes the style definitions.
		var styleText = CKEDITOR.style.getStyleText( styleDefinition );
		if ( styleText ) {
			if ( !attribs.style )
				length++;
			attribs.style = styleText;
		}

		// Appends the "length" information to the object.
		attribs._length = length;

		// Return it, saving it to the next request.
		return ( styleDefinition._AC = attribs );
	}

	// Get the the collection used to compare the elements and attributes,
	// defined in this style overrides, with other element. All information in
	// it is lowercased.
	// @param {CKEDITOR.style} style
	function getOverrides( style ) {
		if ( style._.overrides )
			return style._.overrides;

		var overrides = ( style._.overrides = {} ),
			definition = style._.definition.overrides;

		if ( definition ) {
			// The override description can be a string, object or array.
			// Internally, well handle arrays only, so transform it if needed.
			if ( !CKEDITOR.tools.isArray( definition ) )
				definition = [ definition ];

			// Loop through all override definitions.
			for ( var i = 0; i < definition.length; i++ ) {
				var override = definition[ i ],
					elementName,
					overrideEl,
					attrs;

				// If can be a string with the element name.
				if ( typeof override == 'string' )
					elementName = override.toLowerCase();
				// Or an object.
				else {
					elementName = override.element ? override.element.toLowerCase() : style.element;
					attrs = override.attributes;
				}

				// We can have more than one override definition for the same
				// element name, so we attempt to simply append information to
				// it if it already exists.
				overrideEl = overrides[ elementName ] || ( overrides[ elementName ] = {} );

				if ( attrs ) {
					// The returning attributes list is an array, because we
					// could have different override definitions for the same
					// attribute name.
					var overrideAttrs = ( overrideEl.attributes = overrideEl.attributes || [] );
					for ( var attName in attrs ) {
						// Each item in the attributes array is also an array,
						// where [0] is the attribute name and [1] is the
						// override value.
						overrideAttrs.push( [ attName.toLowerCase(), attrs[ attName ] ] );
					}
				}
			}
		}

		return overrides;
	}

	// Make the comparison of attribute value easier by standardizing it.
	function normalizeProperty( name, value, isStyle ) {
		var temp = new CKEDITOR.dom.element( 'span' );
		temp[ isStyle ? 'setStyle' : 'setAttribute' ]( name, value );
		return temp[ isStyle ? 'getStyle' : 'getAttribute' ]( name );
	}

	// Compare two bunch of styles, with the speciality that value 'inherit'
	// is treated as a wildcard which will match any value.
	// @param {Object/String} source
	// @param {Object/String} target
	// @returns {Boolean}
	function compareCssText( source, target ) {
		function filter( string, propertyName ) {
			// In case of font-families we'll skip quotes. (https://dev.ckeditor.com/ticket/10750)
			return propertyName.toLowerCase() == 'font-family' ? string.replace( /["']/g, '' ) : string;
		}

		if ( typeof source == 'string' )
			source = CKEDITOR.tools.parseCssText( source );
		if ( typeof target == 'string' )
			target = CKEDITOR.tools.parseCssText( target, true );

		for ( var name in source ) {
			if ( !( name in target ) ) {
				return false;
			}

			if ( !( filter( target[ name ], name ) == filter( source[ name ], name ) ||
				source[ name ] == 'inherit' ||
				target[ name ] == 'inherit' ) ) {
				return false;
			}
		}
		return true;
	}

	function applyStyleOnSelection( selection, remove, editor ) {
		var ranges = selection.getRanges(),
			func = remove ? this.removeFromRange : this.applyToRange,
			range;

		var iterator = ranges.createIterator();
		while ( ( range = iterator.getNextRange() ) )
			func.call( this, range, editor );

		selection.selectRanges( ranges );
	}
} )();

/**
 * Generic style command. It applies a specific style when executed.
 *
 *		var boldStyle = new CKEDITOR.style( { element: 'strong' } );
 *		// Register the "bold" command, which applies the bold style.
 *		editor.addCommand( 'bold', new CKEDITOR.styleCommand( boldStyle ) );
 *
 * @class
 * @constructor Creates a styleCommand class instance.
 * @extends CKEDITOR.commandDefinition
 * @param {CKEDITOR.style} style The style to be applied when command is executed.
 * @param {Object} [ext] Additional command definition's properties.
 */
CKEDITOR.styleCommand = function( style, ext ) {
	this.style = style;
	this.allowedContent = style;
	this.requiredContent = style;

	CKEDITOR.tools.extend( this, ext, true );
};

/**
 * @param {CKEDITOR.editor} editor
 * @todo
 */
CKEDITOR.styleCommand.prototype.exec = function( editor ) {
	editor.focus();

	if ( this.state == CKEDITOR.TRISTATE_OFF )
		editor.applyStyle( this.style );
	else if ( this.state == CKEDITOR.TRISTATE_ON )
		editor.removeStyle( this.style );
};

/**
 * Manages styles registration and loading. See also {@link CKEDITOR.config#stylesSet}.
 *
 * **Note** This object is an instance of {@link CKEDITOR.resourceManager}.
 *
 *		// The set of styles for the <b>Styles</b> drop-down list.
 *		CKEDITOR.stylesSet.add( 'default', [
 *			// Block Styles
 *			{ name: 'Blue Title',		element: 'h3',		styles: { 'color': 'Blue' } },
 *			{ name: 'Red Title',		element: 'h3',		styles: { 'color': 'Red' } },
 *
 *			// Inline Styles
 *			{ name: 'Marker: Yellow',	element: 'span',	styles: { 'background-color': 'Yellow' } },
 *			{ name: 'Marker: Green',	element: 'span',	styles: { 'background-color': 'Lime' } },
 *
 *			// Object Styles
 *			{
 *				name: 'Image on Left',
 *				element: 'img',
 *				attributes: {
 *					style: 'padding: 5px; margin-right: 5px',
 *					border: '2',
 *					align: 'left'
 *				}
 *			}
 *		] );
 *
 * @since 3.2.0
 * @class
 * @singleton
 * @extends CKEDITOR.resourceManager
 */
CKEDITOR.stylesSet = new CKEDITOR.resourceManager( '', 'stylesSet' );

// Backward compatibility (https://dev.ckeditor.com/ticket/5025).
CKEDITOR.addStylesSet = CKEDITOR.tools.bind( CKEDITOR.stylesSet.add, CKEDITOR.stylesSet );
CKEDITOR.loadStylesSet = function( name, url, callback ) {
	CKEDITOR.stylesSet.addExternal( name, url, '' );
	CKEDITOR.stylesSet.load( name, callback );
};

CKEDITOR.tools.extend( CKEDITOR.editor.prototype, {
	/**
	 * Registers a function to be called whenever the selection position changes in the
	 * editing area. The current state is passed to the function. The possible
	 * states are {@link CKEDITOR#TRISTATE_ON} and {@link CKEDITOR#TRISTATE_OFF}.
	 *
	 *		// Create a style object for the <b> element.
	 *		var style = new CKEDITOR.style( { element: 'b' } );
	 *		var editor = CKEDITOR.instances.editor1;
	 *		editor.attachStyleStateChange( style, function( state ) {
	 *			if ( state == CKEDITOR.TRISTATE_ON )
	 *				alert( 'The current state for the B element is ON' );
	 *			else
	 *				alert( 'The current state for the B element is OFF' );
	 *		} );
	 *
	 * @member CKEDITOR.editor
	 * @param {CKEDITOR.style} style The style to be watched.
	 * @param {Function} callback The function to be called.
	 */
	attachStyleStateChange: function( style, callback ) {
		// Try to get the list of attached callbacks.
		var styleStateChangeCallbacks = this._.styleStateChangeCallbacks;

		// If it doesn't exist, it means this is the first call. So, let's create
		// all the structure to manage the style checks and the callback calls.
		if ( !styleStateChangeCallbacks ) {
			// Create the callbacks array.
			styleStateChangeCallbacks = this._.styleStateChangeCallbacks = [];

			// Attach to the selectionChange event, so we can check the styles at
			// that point.
			this.on( 'selectionChange', function( ev ) {
				// Loop throw all registered callbacks.
				for ( var i = 0; i < styleStateChangeCallbacks.length; i++ ) {
					var callback = styleStateChangeCallbacks[ i ];

					// Check the current state for the style defined for that callback.
					var currentState = callback.style.checkActive( ev.data.path, this ) ?
						CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;

					// Call the callback function, passing the current state to it.
					callback.fn.call( this, currentState );
				}
			} );
		}

		// Save the callback info, so it can be checked on the next occurrence of
		// selectionChange.
		styleStateChangeCallbacks.push( { style: style, fn: callback } );
	},

	/**
	 * Applies the style upon the editor's current selection. Shorthand for
	 * {@link CKEDITOR.style#apply}.
	 *
	 * @member CKEDITOR.editor
	 * @param {CKEDITOR.style} style
	 */
	applyStyle: function( style ) {
		style.apply( this );
	},

	/**
	 * Removes the style from the editor's current selection. Shorthand for
	 * {@link CKEDITOR.style#remove}.
	 *
	 * @member CKEDITOR.editor
	 * @param {CKEDITOR.style} style
	 */
	removeStyle: function( style ) {
		style.remove( this );
	},

	/**
	 * Gets the current `stylesSet` for this instance.
	 *
	 *		editor.getStylesSet( function( stylesDefinitions ) {} );
	 *
	 * See also {@link CKEDITOR.editor#stylesSet} event.
	 *
	 * @member CKEDITOR.editor
	 * @param {Function} callback The function to be called with the styles data.
	 */
	getStylesSet: function( callback ) {
		if ( !this._.stylesDefinitions ) {
			var editor = this,
				// Respect the backwards compatible definition entry
				configStyleSet = editor.config.stylesCombo_stylesSet || editor.config.stylesSet;

			// The false value means that none styles should be loaded.
			if ( configStyleSet === false ) {
				callback( null );
				return;
			}

			// https://dev.ckeditor.com/ticket/5352 Allow to define the styles directly in the config object
			if ( configStyleSet instanceof Array ) {
				editor._.stylesDefinitions = configStyleSet;
				callback( configStyleSet );
				return;
			}

			// Default value is 'default'.
			if ( !configStyleSet )
				configStyleSet = 'default';

			var partsStylesSet = configStyleSet.split( ':' ),
				styleSetName = partsStylesSet[ 0 ],
				externalPath = partsStylesSet[ 1 ];

			CKEDITOR.stylesSet.addExternal( styleSetName, externalPath ? partsStylesSet.slice( 1 ).join( ':' ) : CKEDITOR.getUrl( 'styles.js' ), '' );

			CKEDITOR.stylesSet.load( styleSetName, function( stylesSet ) {
				editor._.stylesDefinitions = stylesSet[ styleSetName ];
				callback( editor._.stylesDefinitions );
			} );
		} else {
			callback( this._.stylesDefinitions );
		}
	}
} );

/**
 * Indicates that fully selected read-only elements will be included when
 * applying the style (for inline styles only).
 *
 * @since 3.5.0
 * @property {Boolean} [includeReadonly=false]
 * @member CKEDITOR.style
 */

/**
 * Indicates that any matches element of this style will be eventually removed
 * when calling {@link CKEDITOR.editor#removeStyle}.
 *
 * @since 4.0.0
 * @property {Boolean} [alwaysRemoveElement=false]
 * @member CKEDITOR.style
 */

/**
 * Disables inline styling on read-only elements.
 *
 * @since 3.5.0
 * @cfg {Boolean} [disableReadonlyStyling=false]
 * @member CKEDITOR.config
 */

/**
 * The "styles definition set" to use in the editor. They will be used in the
 * styles combo and the style selector of the div container.
 *
 * The styles may be defined in the page containing the editor, or can be
 * loaded on demand from an external file. In the second case, if this setting
 * contains only a name, the `styles.js` file will be loaded from the
 * CKEditor root folder (what ensures backward compatibility with CKEditor 4.0).
 *
 * Otherwise, this setting has the `name:url` syntax, making it
 * possible to set the URL from which the styles file will be loaded.
 * Note that the `name` has to be equal to the name used in
 * {@link CKEDITOR.stylesSet#add} while registering the styles set.
 *
 * **Note**: Since 4.1.0 it is possible to set `stylesSet` to `false`
 * to prevent loading any styles set.
 *
 * Read more in the {@glink features/styles documentation}
 * and see the {@glink examples/styles example}.
 *
 *		// Do not load any file. The styles set is empty.
 *		config.stylesSet = false;
 *
 *		// Load the 'mystyles' styles set from the styles.js file.
 *		config.stylesSet = 'mystyles';
 *
 *		// Load the 'mystyles' styles set from a relative URL.
 *		config.stylesSet = 'mystyles:/editorstyles/styles.js';
 *
 *		// Load the 'mystyles' styles set from a full URL.
 *		config.stylesSet = 'mystyles:http://www.example.com/editorstyles/styles.js';
 *
 *		// Load from a list of definitions.
 *		config.stylesSet = [
 *			{ name: 'Strong Emphasis', element: 'strong' },
 *			{ name: 'Emphasis', element: 'em' },
 *			...
 *		];
 *
 * @since 3.3.0
 * @cfg {String/Array/Boolean} [stylesSet='default']
 * @member CKEDITOR.config
 */

/**
 * Abstract class describing the definition of a style.
 *
 * This virtual class illustrates the properties that developers can use to define and create
 * style definitions.
 *
 * A style definition object represents a style as a set of properties defining the element structure, its attributes and CSS styles.
 * The {@link CKEDITOR.style} based on such definition can be applied to and removed from the selection
 * through various {@link CKEDITOR.style} methods.
 *
 * ```javascript
 * {
 *		name: 'Special Title',
 *		element: 'h1',
 *		attributes: { class: 'my_class' },
 *		styles: { color: 'red', 'font-size': '16px', 'font-width': 'bold' }
 * }
 * ```
 *
 *	Refer to the {@glink guide/dev_howtos_styles Styles guide} for more information about how editor content styles are handled.
 *
 * @class CKEDITOR.style.definition
 * @abstract
 */

/**
 * Defines the style type.
 *
 * There are three standard style types:
 *
 * * {@link CKEDITOR#STYLE_INLINE},
 * * {@link CKEDITOR#STYLE_BLOCK},
 * * {@link CKEDITOR#STYLE_OBJECT}.
 *
 * Each type is related to the element used in the style rule and the types of elements to which a specific style can be applied.
 *
 * Plugins may define {@link CKEDITOR.style.customHandlers special style handlers} to customize style operations.
 * To use a special style handler, the `type` property should be set to the name of the style handler, e.g. `widget`.
 *
 * Refer to the {@glink features/styles#style-types Style Types section of the Applying Styles to Editor Content guide} for more information about style types.
 *
 * ```javascript
 * { type: CKEDITOR.STYLE_INLINE }
 * ```
 *
 * @property {String/Number} type=CKEDITOR.STYLE_INLINE
 */

/**
 * A unique style definition name. It can be used to differentiate style definitions, like in the {@glink features/styles Styles Combo} plugin
 * drop-down where it represents item labels.
 *
 * ```javascript
 * { name: 'Special title' }
 * ```
 *
 * @property {String} name
 */

/**
 * A set of properties specifying attributes of the HTML style element.
 * If the `style` attribute is present, it will be merged with the existing {@link CKEDITOR.style.definition#styles} property.
 *
 * ```javascript
 * {
 *		attributes: {
 *			style: 'color: red',
 *			class: 'link'
 *		}
 * }
 * ```
 *
 * @property {Object.<String, String>} attributes
 */

/**
 * An element type that will be applied to the selection when applying a style. It should be a valid HTML element, for example `span`.
 *
 * ```javascript
 * { element: 'h1' }
 * ```
 *
 * @property {String} element
 */

/**
 * A set of properties specifying CSS style rules of the HTML style element.
 *
 * ```javascript
 * {
 *		styles: {
 *			color: 'red',
 *			'font-size': '12px'
 *			'font-weight': 'bold'
 *		}
 * }
 * ```
 *
 * @property {Object.<String, String>} styles
 */
