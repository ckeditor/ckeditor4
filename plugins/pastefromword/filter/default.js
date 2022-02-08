/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals CKEDITOR */

( function() {
	'use strict';

	var tools = CKEDITOR.tools,
		pastetools = CKEDITOR.plugins.pastetools,
		commonFilter = pastetools.filters.common,
		Style = commonFilter.styles,
		createAttributeStack = commonFilter.createAttributeStack,
		getElementIndentation = commonFilter.lists.getElementIndentation,
		invalidTags = [
			'o:p',
			'xml',
			'script',
			'meta',
			'link'
		],
		shapeTags = [
			'v:arc',
			'v:curve',
			'v:line',
			'v:oval',
			'v:polyline',
			'v:rect',
			'v:roundrect',
			'v:group'
		],
		links = {},
		inComment = 0,
		plug = {},
		List,
		Heuristics;

	/**
	 * Set of Paste from Word plugin helpers.
	 *
	 * @since 4.13.0
	 * @private
	 * @member CKEDITOR.plugins.pastetools.filters
	 */
	CKEDITOR.plugins.pastetools.filters.word = plug;

	/**
	 * Set of Paste from Word plugin helpers.
	 *
	 * See {@link CKEDITOR.plugins.pastetools.filters.word}.
	 *
	 * @since 4.6.0
	 * @deprecated 4.13.0
	 * @private
	 * @member CKEDITOR.plugins
	 */
	CKEDITOR.plugins.pastefromword = plug;

	/**
	 * Rules for the Paste from Word filter.
	 *
	 * @since 4.13.0
	 * @private
	 * @member CKEDITOR.plugins.pastetools.filters.word
	 */
	plug.rules = function( html, editor, filter ) {
		var msoListsDetected = Boolean( html.match( /mso-list:\s*l\d+\s+level\d+\s+lfo\d+/ ) ),
			shapesIds = [],
			rules = {
				root: function( element ) {
					element.filterChildren( filter );

					CKEDITOR.plugins.pastefromword.lists.cleanup( List.createLists( element ) );
				},
				elementNames: [
					[ ( /^\?xml:namespace$/ ), '' ],
					[ /^v:shapetype/, '' ],
					[ new RegExp( invalidTags.join( '|' ) ), '' ] // Remove invalid tags.
				],
				elements: {
					'a': function( element ) {
						// Redundant anchor created by IE8.
						if ( element.attributes.name ) {
							if ( element.attributes.name == '_GoBack' ) {
								delete element.name;
								return;
							}

							// Garbage links that go nowhere.
							if ( element.attributes.name.match( /^OLE_LINK\d+$/ ) ) {
								delete element.name;
								return;
							}
						}

						if ( element.attributes.href && element.attributes.href.match( /#.+$/ ) ) {
							var name = element.attributes.href.match( /#(.+)$/ )[ 1 ];
							links[ name ] = element;
						}

						if ( element.attributes.name &&  links[ element.attributes.name ] ) {
							var link = links[ element.attributes.name ];
							link.attributes.href = link.attributes.href.replace( /.*#(.*)$/, '#$1' );
						}

					},
					'div': function( element ) {
						// Don't allow to delete page break element (#3220).
						if ( editor.plugins.pagebreak && element.attributes[ 'data-cke-pagebreak' ] ) {
							return element;
						}

						Style.createStyleStack( element, filter, editor );
					},
					'img': function( element ) {
						// If the parent is DocumentFragment it does not have any attributes. (https://dev.ckeditor.com/ticket/16912)
						if ( element.parent && element.parent.attributes ) {
							var attrs = element.parent.attributes,
								style = attrs.style || attrs.STYLE;
							if ( style && style.match( /mso\-list:\s?Ignore/ ) ) {
								element.attributes[ 'cke-ignored' ] = true;
							}
						}

						Style.mapCommonStyles( element );

						if ( element.attributes.src && element.attributes.src.match( /^file:\/\// ) &&
							element.attributes.alt && element.attributes.alt.match( /^https?:\/\// ) ) {
							element.attributes.src = element.attributes.alt;
						}

						var imgShapesIds = element.attributes[ 'v:shapes' ] ? element.attributes[ 'v:shapes' ].split( ' ' ) : [];
						// Check whether attribute contains shapes recognised earlier (stored in global list of shapesIds).
						// If so, add additional data-attribute to img tag.
						var isShapeFromList = CKEDITOR.tools.array.every( imgShapesIds, function( shapeId ) {
							return shapesIds.indexOf( shapeId ) > -1;
						} );
						if ( imgShapesIds.length && isShapeFromList ) {
							// As we don't know how to process shapes we can remove them.
							return false;
						}

					},
					'p': function( element ) {
						element.filterChildren( filter );

						if ( element.attributes.style && element.attributes.style.match( /display:\s*none/i ) ) {
							return false;
						}

						if ( List.thisIsAListItem( editor, element ) ) {
							if ( Heuristics.isEdgeListItem( editor, element ) ) {
								Heuristics.cleanupEdgeListItem( element );
							}

							List.convertToFakeListItem( editor, element );

							// IE pastes nested paragraphs in list items, which is different from other browsers. (https://dev.ckeditor.com/ticket/16826)
							// There's a possibility that list item will contain multiple paragraphs, in that case we want
							// to split them with BR.
							tools.array.reduce( element.children, function( paragraphsReplaced, node ) {
								if ( node.name === 'p' ) {
									// If there were already paragraphs replaced, put a br before this paragraph, so that
									// it's inline children are displayed in a next line.
									if ( paragraphsReplaced > 0 ) {
										var br = new CKEDITOR.htmlParser.element( 'br' );
										br.insertBefore( node );
									}

									node.replaceWithChildren();
									paragraphsReplaced += 1;
								}

								return paragraphsReplaced;
							}, 0 );
						} else {
							// In IE list level information is stored in <p> elements inside <li> elements.
							var container = element.getAscendant( function( element ) {
									return element.name == 'ul' || element.name == 'ol';
								} ),
								style = tools.parseCssText( element.attributes.style );
							if ( container &&
								!container.attributes[ 'cke-list-level' ] &&
								style[ 'mso-list' ] &&
								style[ 'mso-list' ].match( /level/ ) ) {
								container.attributes[ 'cke-list-level' ] = style[ 'mso-list' ].match( /level(\d+)/ )[1];
							}

							// Adapt paragraph formatting to editor's convention according to enter-mode (#423).
							if ( editor.config.enterMode == CKEDITOR.ENTER_BR ) {
								// We suffer from attribute/style lost in this situation.
								delete element.name;
								element.add( new CKEDITOR.htmlParser.element( 'br' ) );
							}

						}

						Style.createStyleStack( element, filter, editor );
					},
					'pre': function( element ) {
						if ( List.thisIsAListItem( editor, element ) ) List.convertToFakeListItem( editor, element );

						Style.createStyleStack( element, filter, editor );
					},
					'h1': function( element ) {
						if ( List.thisIsAListItem( editor, element ) ) List.convertToFakeListItem( editor, element );

						Style.createStyleStack( element, filter, editor );
					},
					'h2': function( element ) {
						if ( List.thisIsAListItem( editor, element ) ) List.convertToFakeListItem( editor, element );

						Style.createStyleStack( element, filter, editor );
					},
					'h3': function( element ) {
						if ( List.thisIsAListItem( editor, element ) ) List.convertToFakeListItem( editor, element );

						Style.createStyleStack( element, filter, editor );
					},
					'h4': function( element ) {
						if ( List.thisIsAListItem( editor, element ) ) List.convertToFakeListItem( editor, element );

						Style.createStyleStack( element, filter, editor );
					},
					'h5': function( element ) {
						if ( List.thisIsAListItem( editor, element ) ) List.convertToFakeListItem( editor, element );

						Style.createStyleStack( element, filter, editor );
					},
					'h6': function( element ) {
						if ( List.thisIsAListItem( editor, element ) ) List.convertToFakeListItem( editor, element );

						Style.createStyleStack( element, filter, editor );
					},
					'font': function( element ) {
						if ( element.getHtml().match( /^\s*$/ ) ) {
							// There might be font tag directly in document fragment, we cannot replace it with a textnode as this generates
							// superfluous spaces in output. What later might be transformed into empty paragraphs, so just remove such element.
							if ( element.parent.type === CKEDITOR.NODE_ELEMENT ) {
								new CKEDITOR.htmlParser.text( ' ' ).insertAfter( element );
							}
							return false;
						}

						if ( editor && editor.config.pasteFromWordRemoveFontStyles === true && element.attributes.size ) {
							// font[size] are still used by old IEs for font size.
							delete element.attributes.size;
						}

						// Create style stack for td/th > font if only class
						// and style attributes are present. Such markup is produced by Excel.
						if ( CKEDITOR.dtd.tr[ element.parent.name ] &&
							CKEDITOR.tools.arrayCompare( CKEDITOR.tools.object.keys( element.attributes ), [ 'class', 'style' ] ) ) {

							Style.createStyleStack( element, filter, editor );
						} else {
							createAttributeStack( element, filter );
						}
					},
					'ul': function( element ) {
						if ( !msoListsDetected ) {
							// List should only be processed if we're sure we're working with Word. (https://dev.ckeditor.com/ticket/16593)
							return;
						}

						// Edge case from 11683 - an unusual way to create a level 2 list.
						if ( element.parent.name == 'li' && tools.indexOf( element.parent.children, element ) === 0 ) {
							Style.setStyle( element.parent, 'list-style-type', 'none' );
						}

						List.dissolveList( element );
						return false;
					},
					'li': function( element ) {
						Heuristics.correctLevelShift( element );

						if ( !msoListsDetected ) {
							return;
						}

						element.attributes.style = Style.normalizedStyles( element, editor );

						Style.pushStylesLower( element );
					},
					'ol': function( element ) {
						if ( !msoListsDetected ) {
							// List should only be processed if we're sure we're working with Word. (https://dev.ckeditor.com/ticket/16593)
							return;
						}

						// Fix edge-case where when a list skips a level in IE11, the <ol> element
						// is implicitly surrounded by a <li>.
						if ( element.parent.name == 'li' && tools.indexOf( element.parent.children, element ) === 0 ) {
							Style.setStyle( element.parent, 'list-style-type', 'none' );
						}

						List.dissolveList( element );
						return false;
					},
					'span': function( element ) {
						element.filterChildren( filter );

						element.attributes.style = Style.normalizedStyles( element, editor );

						if ( !element.attributes.style ||
								// Remove garbage bookmarks that disrupt the content structure.
							element.attributes.style.match( /^mso\-bookmark:OLE_LINK\d+$/ ) ||
							element.getHtml().match( /^(\s|&nbsp;)+$/ ) ) {

							commonFilter.elements.replaceWithChildren( element );
							return false;
						}

						if ( element.attributes.style.match( /FONT-FAMILY:\s*Symbol/i ) ) {
							element.forEach( function( node ) {
								node.value = node.value.replace( /&nbsp;/g, '' );
							}, CKEDITOR.NODE_TEXT, true );
						}

						Style.createStyleStack( element, filter, editor );
					},

					'v:imagedata': remove,
					// This is how IE8 presents images.
					'v:shape': function( element ) {
						// There are 3 paths:
						// 1. There is regular `v:shape` (no `v:imagedata` inside).
						// 2. There is a simple situation with `v:shape` with `v:imagedata` inside. We can remove such element and rely on `img` tag found later on.
						// 3. There is a complicated situation where we cannot find proper `img` tag after `v:shape` or there is some canvas element.
						// 		a) If shape is a child of v:group, then most probably it belongs to canvas, so we need to treat it as in path 1.
						// 		b) In other cases, most probably there is no related `img` tag. We need to transform `v:shape` into `img` tag (IE8 integration).

						var duplicate = false,
							child = element.getFirst( 'v:imagedata' );

						// Path 1:
						if ( child === null ) {
							shapeTagging( element );
							return;
						}

						// Path 2:
						// Sometimes a child with proper ID might be nested in other tag.
						element.parent.find( function( child ) {
							if ( child.name == 'img' && child.attributes &&
								child.attributes[ 'v:shapes' ] == element.attributes.id ) {

								duplicate = true;
							}
						}, true );

						if ( duplicate ) {
							return false;
						} else {

							// Path 3:
							var src = '';

							// 3.a) Filter out situation when canvas is used. In such scenario there is v:group containing v:shape containing v:imagedata.
							// We streat such v:shapes as in Path 1.
							if ( element.parent.name === 'v:group' ) {
								shapeTagging( element );
								return;
							}

							// 3.b) Most probably there is no img tag later on, so we need to transform this v:shape into img. This should only happen on IE8.
							element.forEach( function( child ) {
								if ( child.attributes && child.attributes.src ) {
									src = child.attributes.src;
								}
							}, CKEDITOR.NODE_ELEMENT, true );

							element.filterChildren( filter );

							element.name = 'img';
							element.attributes.src = element.attributes.src || src;

							delete element.attributes.type;
						}

						return;
					},

					'style': function() {
						// We don't want to let any styles in. Firefox tends to add some.
						return false;
					},

					'object': function( element ) {
						// The specs about object `data` attribute:
						// 		Address of the resource as a valid URL. At least one of data and type must be defined.
						// If there is not `data`, skip the object element. (https://dev.ckeditor.com/ticket/17001)
						return !!( element.attributes && element.attributes.data );
					},

					// Integrate page breaks with `pagebreak` plugin (#2598).
					'br': function( element ) {
						if ( !editor.plugins.pagebreak ) {
							return;
						}

						var styles = tools.parseCssText( element.attributes.style, true );

						// Safari uses `break-before` instead of `page-break-before` to recognize page breaks.
						if ( styles[ 'page-break-before' ] === 'always' || styles[ 'break-before' ] === 'page' ) {
							var pagebreakEl = CKEDITOR.plugins.pagebreak.createElement( editor );
							return CKEDITOR.htmlParser.fragment.fromHtml( pagebreakEl.getOuterHtml() ).children[ 0 ];
						}
					}
				},
				attributes: {
					'style': function( styles, element ) {
						// Returning false deletes the attribute.
						return Style.normalizedStyles( element, editor ) || false;
					},
					'class': function( classes ) {
						// The (el\d+)|(font\d+) are default Excel classes for table cells and text.
						return falseIfEmpty( classes.replace( /(el\d+)|(font\d+)|msonormal|msolistparagraph\w*/ig, '' ) );
					},
					'cellspacing': remove,
					'cellpadding': remove,
					'border': remove,
					'v:shapes': remove,
					'o:spid': remove
				},
				comment: function( element ) {
					if ( element.match( /\[if.* supportFields.*\]/ ) ) {
						inComment++;
					}
					if ( element == '[endif]' ) {
						inComment = inComment > 0 ? inComment - 1 : 0;
					}
					return false;
				},
				text: function( content, node ) {
					if ( inComment ) {
						return '';
					}

					var grandparent = node.parent && node.parent.parent;

					if ( grandparent && grandparent.attributes && grandparent.attributes.style && grandparent.attributes.style.match( /mso-list:\s*ignore/i ) ) {
						return content.replace( /&nbsp;/g, ' ' );
					}

					return content;
				}
			};

		tools.array.forEach( shapeTags, function( shapeTag ) {
			rules.elements[ shapeTag ] = shapeTagging;
		} );

		return rules;

		function shapeTagging( element ) {
			// Check if regular or canvas shape (#1088).
			if ( element.attributes[ 'o:gfxdata' ] || element.parent.name === 'v:group' ) {
				shapesIds.push( element.attributes.id );
			}
		}
	};

	/**
	 * Namespace containing list-oriented helper methods.
	 *
	 * @private
	 * @since 4.13.0
	 * @member CKEDITOR.plugins.pastetools.filters.word
	 */
	plug.lists = {
		/**
		 * Checks if a given element is a list item-alike.
		 *
		 * @private
		 * @since 4.13.0
		 * @param {CKEDITOR.editor} editor
		 * @param {CKEDITOR.htmlParser.element} element
		 * @returns {Boolean}
		 * @member CKEDITOR.plugins.pastetools.filters.word.lists
		 */
		thisIsAListItem: function( editor, element ) {
			if ( Heuristics.isEdgeListItem( editor, element ) ) {
				return true;
			}

			/*jshint -W024 */
			// Normally a style of the sort that looks like "mso-list: l0 level1 lfo1"
			// indicates a list element, but the same style may appear in a <p> that's within a <li>.
			if ( ( element.attributes.style && element.attributes.style.match( /mso\-list:\s?l\d/ ) &&
				element.parent.name !== 'li' ) ||
				element.attributes[ 'cke-dissolved' ] ||
				element.getHtml().match( /<!\-\-\[if !supportLists]\-\->/ )
			) {
				return true;
			}

			return false;
			/*jshint +W024 */
		},

		/**
		 * Converts an element to an element with the `cke:li` tag name.
		 *
		 * @private
		 * @since 4.13.0
		 * @param {CKEDITOR.editor} editor
		 * @param {CKEDITOR.htmlParser.element} element
		 * @member CKEDITOR.plugins.pastetools.filters.word.lists
		 */
		convertToFakeListItem: function( editor, element ) {
			if ( Heuristics.isDegenerateListItem( editor, element ) ) {
				Heuristics.assignListLevels( editor, element );
			}

			// A dummy call to cache parsed list info inside of cke-list-* attributes.
			this.getListItemInfo( element );

			if ( !element.attributes[ 'cke-dissolved' ] ) {
				// The symbol is usually the first text node descendant
				// of the element that doesn't start with a whitespace character;
				var symbol;

				element.forEach( function( element ) {
					// Sometimes there are custom markers represented as images.
					// They can be recognized by the distinctive alt attribute value.
					if ( !symbol && element.name == 'img' &&
						element.attributes[ 'cke-ignored' ] &&
						element.attributes.alt == '*' ) {
						symbol = '·';
						// Remove the "symbol" now, since it's the best opportunity to do so.
						element.remove();
					}
				}, CKEDITOR.NODE_ELEMENT );

				element.forEach( function( element ) {
					if ( !symbol && !element.value.match( /^ / ) ) {
						symbol = element.value;
					}
				}, CKEDITOR.NODE_TEXT );

				// Without a symbol this isn't really a list item.
				if ( typeof symbol == 'undefined' ) {
					return;
				}

				element.attributes[ 'cke-symbol' ] = symbol.replace( /(?: |&nbsp;).*$/, '' );

				List.removeSymbolText( element );
			}

			var styles = element.attributes && tools.parseCssText( element.attributes.style );

			// Default list has 40px padding. To correct indentation we need to reduce margin-left by 40px for each list level.
			// Additionally margin has to be reduced by sum of margins of each parent, however it can't be done until list are structured in a tree (#2870).
			// Note margin left is absent in IE pasted content.
			if ( styles[ 'margin-left' ] ) {
				var margin = styles[ 'margin-left' ],
					level = element.attributes[ 'cke-list-level' ];

				// Ignore negative margins (#2870).
				margin = Math.max( CKEDITOR.tools.convertToPx( margin ) - 40 * level, 0 );

				if ( margin ) {
					styles[ 'margin-left' ] = margin + 'px';
				} else {
					delete styles[ 'margin-left' ];
				}

				element.attributes.style =  CKEDITOR.tools.writeCssText( styles );
			}

			// Converting to a normal list item would implicitly wrap the element around an <ul>.
			element.name = 'cke:li';
		},

		/**
		 * Converts any fake list items contained within `root` into real `<li>` elements.
		 *
		 * @private
		 * @since 4.13.0
		 * @param {CKEDITOR.htmlParser.element} root
		 * @returns {CKEDITOR.htmlParser.element[]} An array of converted elements.
		 * @member CKEDITOR.plugins.pastetools.filters.word.lists
		 */
		convertToRealListItems: function( root ) {
			var listElements = [];
			// Select and clean up list elements.
			root.forEach( function( element ) {
				if ( element.name == 'cke:li' ) {
					element.name = 'li';

					listElements.push( element );
				}
			}, CKEDITOR.NODE_ELEMENT, false );

			return listElements;
		},

		removeSymbolText: function( element ) { // ...from a list element.
			var symbol = element.attributes[ 'cke-symbol' ],
				// Find the first element which contains symbol to be replaced (#2690).
				node = element.findOne( function( node ) {
						// Since symbol may contains special characters we use `indexOf` (instead of RegExp) which is sufficient (#877).
						return node.value && node.value.indexOf( symbol ) > -1;
					}, true ),
				parent;

			if ( node ) {
				node.value = node.value.replace( symbol, '' );
				parent = node.parent;

				if ( parent.getHtml().match( /^(\s|&nbsp;)*$/ ) && parent !== element ) {
					parent.remove();
				} else if ( !node.value ) {
					node.remove();
				}
			}
		},

		setListSymbol: function( list, symbol, level ) {
			level = level || 1;

			var style = tools.parseCssText( list.attributes.style );

			if ( list.name == 'ol' ) {
				if ( list.attributes.type || style[ 'list-style-type' ] ) return;

				var typeMap = {
					'[ivx]': 'lower-roman',
					'[IVX]': 'upper-roman',
					'[a-z]': 'lower-alpha',
					'[A-Z]': 'upper-alpha',
					'\\d': 'decimal'
				};

				for ( var type in typeMap ) {
					if ( List.getSubsectionSymbol( symbol ).match( new RegExp( type ) ) ) {
						style[ 'list-style-type' ] = typeMap[ type ];
						break;
					}
				}

				list.attributes[ 'cke-list-style-type' ] = style[ 'list-style-type' ];
			} else {
				var symbolMap = {
					'·': 'disc',
					'o': 'circle',
					'§': 'square' // In Word this is a square.
				};

				if ( !style[ 'list-style-type' ] && symbolMap[ symbol ] ) {
					style[ 'list-style-type' ] = symbolMap[ symbol ];
				}

			}

			List.setListSymbol.removeRedundancies( style, level );

			( list.attributes.style = CKEDITOR.tools.writeCssText( style ) ) || delete list.attributes.style;
		},

		setListStart: function( list ) {
			var symbols = [],
				offset = 0;

			for ( var i = 0; i < list.children.length; i++ ) {
				symbols.push( list.children[ i ].attributes[ 'cke-symbol' ] || '' );
			}

			// When a list starts with a sublist, use the next element as a start indicator.
			if ( !symbols[ 0 ] ) {
				offset++;
			}

			// Attribute set in setListSymbol()
			switch ( list.attributes[ 'cke-list-style-type' ] ) {
				case 'lower-roman':
				case 'upper-roman':
					list.attributes.start = List.toArabic( List.getSubsectionSymbol( symbols[ offset ] ) ) - offset;
					break;
				case 'lower-alpha':
				case 'upper-alpha':
					list.attributes.start = List.getSubsectionSymbol( symbols[ offset ] ).replace( /\W/g, '' ).toLowerCase().charCodeAt( 0 ) - 96 - offset;
					break;
				case 'decimal':
					list.attributes.start = ( parseInt( List.getSubsectionSymbol( symbols[ offset ] ), 10 ) - offset ) || 1;
					break;
			}

			if ( list.attributes.start == '1' ) {
				delete list.attributes.start;
			}

			delete list.attributes[ 'cke-list-style-type' ];
		},

		/**
		 * Numbering helper.
		 *
		 * @since 4.13.0
		 * @member CKEDITOR.plugins.pastetools.filters.word.lists
		 */
		numbering: {
			/**
			 * Converts the list marker value into a decimal number.
			 *
			 *		 var toNumber = CKEDITOR.plugins.pastefromword.lists.numbering.toNumber;
			 *
			 *		 console.log( toNumber( 'XIV', 'upper-roman' ) ); // Logs 14.
			 *		 console.log( toNumber( 'd', 'lower-alpha' ) ); // Logs 4.
			 *		 console.log( toNumber( '35', 'decimal' ) ); // Logs 35.
			 *		 console.log( toNumber( '404', 'foo' ) ); // Logs 1.
			 *
			 * @param {String} marker
			 * @param {String} markerType Marker type according to CSS `list-style-type` values.
			 * @returns {Number}
			 * @member CKEDITOR.plugins.pastetools.filters.word.lists.numbering
			 */
			toNumber: function( marker, markerType ) {
				// Functions copied straight from old PFW implementation, no need to reinvent the wheel.
				function fromAlphabet( str ) {
					var alpahbets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

					str = str.toUpperCase();
					var l = alpahbets.length,
						retVal = 1;
					for ( var x = 1; str.length > 0; x *= l ) {
						retVal += alpahbets.indexOf( str.charAt( str.length - 1 ) ) * x;
						str = str.substr( 0, str.length - 1 );
					}
					return retVal;
				}

				function fromRoman( str ) {
					var romans = [
							[ 1000, 'M' ],
							[ 900, 'CM' ],
							[ 500, 'D' ],
							[ 400, 'CD' ],
							[ 100, 'C' ],
							[ 90, 'XC' ],
							[ 50, 'L' ],
							[ 40, 'XL' ],
							[ 10, 'X' ],
							[ 9, 'IX' ],
							[ 5, 'V' ],
							[ 4, 'IV' ],
							[ 1, 'I' ]
						];

					str = str.toUpperCase();
					var l = romans.length,
						retVal = 0;
					for ( var i = 0; i < l; ++i ) {
						for ( var j = romans[ i ], k = j[ 1 ].length; str.substr( 0, k ) == j[ 1 ]; str = str.substr( k ) )
							retVal += j[ 0 ];
					}
					return retVal;
				}

				if ( markerType == 'decimal' ) {
					return Number( marker );
				} else if ( markerType == 'upper-roman' || markerType == 'lower-roman' ) {
					return fromRoman( marker.toUpperCase() );
				} else if ( markerType == 'lower-alpha' || markerType == 'upper-alpha' ) {
					return fromAlphabet( marker );
				} else {
					return 1;
				}
			},

			/**
			 * Returns a list style based on the Word marker content.
			 *
			 *		var getStyle = CKEDITOR.plugins.pastefromword.lists.numbering.getStyle;
			 *
			 *		console.log( getStyle( '4' ) ); // Logs: "decimal"
			 *		console.log( getStyle( 'b' ) ); // Logs: "lower-alpha"
			 *		console.log( getStyle( 'P' ) ); // Logs: "upper-alpha"
			 *		console.log( getStyle( 'i' ) ); // Logs: "lower-roman"
			 *		console.log( getStyle( 'X' ) ); // Logs: "upper-roman"
			 *
			 *
			 * **Implementation note:** Characters `c` and `d` are not converted to roman on purpose. It is 100 and 500 respectively, so
			 * you rarely go with a list up until this point, while it is common to start with `c` and `d` in alpha.
			 *
			 * @param {String} marker Marker content retained from Word, e.g. `1`, `7`, `XI`, `b`.
			 * @returns {String} Resolved marker type.
			 * @member CKEDITOR.plugins.pastetools.filters.word.lists.numbering
			 */
			getStyle: function( marker ) {
				var typeMap = {
						'i': 'lower-roman',
						'v': 'lower-roman',
						'x': 'lower-roman',
						'l': 'lower-roman',
						'm': 'lower-roman',
						'I': 'upper-roman',
						'V': 'upper-roman',
						'X': 'upper-roman',
						'L': 'upper-roman',
						'M': 'upper-roman'
					},
					firstCharacter = marker.slice( 0, 1 ),
					type = typeMap[ firstCharacter ];

				if ( !type ) {
					type = 'decimal';

					if ( firstCharacter.match( /[a-z]/ ) ) {
						type = 'lower-alpha';
					}
					if ( firstCharacter.match( /[A-Z]/ ) ) {
						type = 'upper-alpha';
					}
				}

				return type;
			}
		},

		// Taking into account cases like "1.1.2." etc. - get the last element.
		getSubsectionSymbol: function( symbol ) {
			return ( symbol.match( /([\da-zA-Z]+).?$/ ) || [ 'placeholder', '1' ] )[ 1 ];
		},

		setListDir: function( list ) {
			var dirs = { ltr: 0, rtl: 0 };

			list.forEach( function( child ) {
				if ( child.name == 'li' ) {
					var dir = child.attributes.dir || child.attributes.DIR || '';
					if ( dir.toLowerCase() == 'rtl' ) {
						dirs.rtl++;
					} else {
						dirs.ltr++;
					}
				}
			}, CKEDITOR.ELEMENT_NODE );

			if ( dirs.rtl > dirs.ltr ) {
				list.attributes.dir = 'rtl';
			}
		},

		createList: function( element ) {
			// "o" symbolizes a circle in unordered lists.
			if ( ( element.attributes[ 'cke-symbol' ].match( /([\da-np-zA-NP-Z]).?/ ) || [] )[ 1 ] ) {
				return new CKEDITOR.htmlParser.element( 'ol' );
			}
			return new CKEDITOR.htmlParser.element( 'ul' );
		},

		/**
		 * @private
		 * @since 4.13.0
		 * @param {CKEDITOR.htmlParser.element} root An element to be looked through for lists.
		 * @returns {CKEDITOR.htmlParser.element[]} An array of created list items.
		 * @member CKEDITOR.plugins.pastetools.filters.word.lists
		 */
		createLists: function( root ) {
			var element, level, i, j,
				listElements = List.convertToRealListItems( root );

			if ( listElements.length === 0 ) {
				return [];
			}

			// Chop data into continuous lists.
			var lists = List.groupLists( listElements );

			// Create nested list structures.
			for ( i = 0; i < lists.length; i++ ) {
				var list = lists[ i ],
					firstLevel1Element = list[ 0 ];

				// To determine the type of the top-level list a level 1 element is needed.
				for ( j = 0; j < list.length; j++ ) {
					if ( list[ j ].attributes[ 'cke-list-level' ] == 1 ) {
						firstLevel1Element = list[ j ];
						break;
					}
				}

				var	containerStack = [ List.createList( firstLevel1Element ) ],
					// List wrapper (ol/ul).
					innermostContainer = containerStack[ 0 ],
					allContainers = [ containerStack[ 0 ] ];

				// Insert first known list item before the list wrapper.
				innermostContainer.insertBefore( list[ 0 ] );

				for ( j = 0; j < list.length; j++ ) {
					element = list[ j ];

					level = element.attributes[ 'cke-list-level' ];

					while ( level > containerStack.length ) {
						var content = List.createList( element );

						var children = innermostContainer.children;
						if ( children.length > 0 ) {
							children[ children.length - 1 ].add( content );
						} else {
							var container = new CKEDITOR.htmlParser.element( 'li', {
								style: 'list-style-type:none'
							} );
							container.add( content );
							innermostContainer.add( container );
						}

						containerStack.push( content );
						allContainers.push( content );
						innermostContainer = content;

						if ( level == containerStack.length ) {
							List.setListSymbol( content, element.attributes[ 'cke-symbol' ], level );
						}
					}

					while ( level < containerStack.length ) {
						containerStack.pop();
						innermostContainer = containerStack[ containerStack.length - 1 ];

						if ( level == containerStack.length ) {
							List.setListSymbol( innermostContainer, element.attributes[ 'cke-symbol' ], level );
						}
					}

					// For future reference this is where the list elements are actually put into the lists.
					element.remove();
					innermostContainer.add( element );
				}

				// Try to set the symbol for the root (level 1) list.
				var level1Symbol;
				if ( containerStack[ 0 ].children.length ) {
					level1Symbol = containerStack[ 0 ].children[ 0 ].attributes[ 'cke-symbol' ];

					if ( !level1Symbol && containerStack[ 0 ].children.length > 1 ) {
						level1Symbol = containerStack[0].children[1].attributes[ 'cke-symbol' ];
					}

					if ( level1Symbol ) {
						List.setListSymbol( containerStack[ 0 ], level1Symbol );
					}
				}

				// This can be done only after all the list elements are where they should be.
				for ( j = 0; j < allContainers.length; j++ ) {
					List.setListStart( allContainers[ j ] );
				}

				// Last but not least apply li[start] if needed, also this needs to be done once ols are final.
				for ( j = 0; j < list.length; j++ ) {
					this.determineListItemValue( list[ j ] );
				}
			}

			// Adjust left margin based on parents sum of parents left margin (#2870).
			CKEDITOR.tools.array.forEach( listElements, function( element ) {
				var listParents = getParentListItems( element ),
					leftOffset = getTotalMarginLeft( listParents ),
					styles, marginLeft;

				if ( !leftOffset ) {
					return;
				}

				element.attributes = element.attributes || {};

				styles = CKEDITOR.tools.parseCssText( element.attributes.style );

				marginLeft = styles[ 'margin-left' ] || 0;
				marginLeft = Math.max( parseInt( marginLeft, 10 ) - leftOffset, 0 );

				if ( marginLeft ) {
					styles[ 'margin-left' ] = marginLeft + 'px';
				} else {
					delete styles[ 'margin-left' ];
				}

				element.attributes.style = CKEDITOR.tools.writeCssText( styles );
			} );

			return listElements;

			function getParentListItems( element ) {
				var parents = [],
					parent = element.parent;

				while ( parent ) {
					if ( parent.name === 'li' ) {
						parents.push( parent );
					}
					parent = parent.parent;
				}

				return parents;
			}

			function getTotalMarginLeft( elements ) {
				return CKEDITOR.tools.array.reduce( elements, function( total, element ) {
					if ( element.attributes && element.attributes.style ) {
						var marginLeft = CKEDITOR.tools.parseCssText( element.attributes.style )[ 'margin-left' ];
					}
					return marginLeft ? total + parseInt( marginLeft, 10 ) : total;
				}, 0 );
			}
		},

		/**
		 * Final cleanup &mdash; removes all `cke-*` helper attributes.
		 *
		 * @private
		 * @since 4.13.0
		 * @param {CKEDITOR.htmlParser.element[]} listElements
		 * @member CKEDITOR.plugins.pastetools.filters.word.lists
		 */
		cleanup: function( listElements ) {
			var tempAttributes = [
					'cke-list-level',
					'cke-symbol',
					'cke-list-id',
					'cke-indentation',
					'cke-dissolved'
				],
				i,
				j;

			for ( i = 0; i < listElements.length; i++ ) {
				for ( j = 0; j < tempAttributes.length; j++ ) {
					delete listElements[ i ].attributes[ tempAttributes[ j ] ];
				}
			}
		},

		/**
		 * Tries to determine the `li[value]` attribute for a given list item. The `element` given must
		 * have a parent in order for this function to work properly.
		 *
		 * @private
		 * @since 4.13.0
		 * @param {CKEDITOR.htmlParser.element} element
		 * @member CKEDITOR.plugins.pastetools.filters.word.lists
		 */
		determineListItemValue: function( element ) {
			if ( element.parent.name !== 'ol' ) {
				// li[value] make sense only for list items in ordered list.
				return;
			}

			var assumedValue = this.calculateValue(  element ),
				cleanSymbol = element.attributes[ 'cke-symbol' ].match( /[a-z0-9]+/gi ),
				computedValue,
				listType;

			if ( cleanSymbol ) {
				// Note that we always want to use last match, just because of markers like "1.1.4" "1.A.a.IV" etc.
				cleanSymbol = cleanSymbol[ cleanSymbol.length - 1 ];

				// We can determine proper value only if we know what type of list is it.
				// So we need to check list wrapper if it has this information.
				listType = element.parent.attributes[ 'cke-list-style-type' ] || this.numbering.getStyle( cleanSymbol );

				computedValue = this.numbering.toNumber( cleanSymbol, listType );

				if ( computedValue !== assumedValue ) {
					element.attributes.value = computedValue;
				}
			}
		},

		/**
		 * Calculates the value for a given `<li>` element based on preceding list items (e.g. the `value`
		 * attribute). It could also look at the start attribute of its parent list (`<ol>`).
		 *
		 * @private
		 * @since 4.13.0
		 * @param {CKEDITOR.htmlParser.element} element The `<li>` element.
		 * @returns {Number}
		 * @member CKEDITOR.plugins.pastetools.filters.word.lists
		 */
		calculateValue: function( element ) {
			if ( !element.parent ) {
				return 1;
			}

			var list = element.parent,
				elementIndex = element.getIndex(),
				valueFound = null,
				// Index of the element with value attribute.
				valueElementIndex,
				curElement,
				i;

			// Look for any preceding li[value].
			for	( i = elementIndex; i >= 0 && valueFound === null; i-- ) {
				curElement = list.children[ i ];

				if ( curElement.attributes && curElement.attributes.value !== undefined ) {
					valueElementIndex = i;
					valueFound = parseInt( curElement.attributes.value, 10 );
				}
			}

			// Still if no li[value] was found, we'll check the list.
			if ( valueFound === null ) {
				valueFound = list.attributes.start !== undefined ? parseInt( list.attributes.start, 10 ) : 1;
				valueElementIndex = 0;
			}

			return valueFound + ( elementIndex - valueElementIndex );
		},

		/**
		 * @private
		 * @since 4.13.0
		 * @param {CKEDITOR.htmlParser.element} element
		 * @member CKEDITOR.plugins.pastetools.filters.word.lists
		 */
		dissolveList: function( element ) {
			var nameIs = function( name ) {
					return function( element ) {
						return element.name == name;
					};
				},
				isList = function( element ) {
					return nameIs( 'ul' )( element ) || nameIs( 'ol' )( element );
				},
				arrayTools = CKEDITOR.tools.array,
				elements = [],
				children,
				i;

			element.forEach( function( child ) {
				elements.push( child );
			}, CKEDITOR.NODE_ELEMENT, false );

			var items = arrayTools.filter( elements, nameIs( 'li' ) ),
				lists = arrayTools.filter( elements, isList );

			arrayTools.forEach( lists, function( list ) {
				var type = list.attributes.type,
					start = parseInt( list.attributes.start, 10 ) || 1,
					level = countParents( isList, list ) + 1;

				if ( !type ) {
					var style = tools.parseCssText( list.attributes.style );
					type = style[ 'list-style-type' ];
				}

				arrayTools.forEach( arrayTools.filter( list.children, nameIs( 'li' ) ), function( child, index ) {
					var symbol;

					switch ( type ) {
						case 'disc':
							symbol = '·';
							break;
						case 'circle':
							symbol = 'o';
							break;
						case 'square':
							symbol = '§';
							break;
						case '1':
						case 'decimal':
							symbol = ( start + index ) + '.';
							break;
						case 'a':
						case 'lower-alpha':
							symbol = String.fromCharCode( 'a'.charCodeAt( 0 ) + start - 1 + index ) + '.';
							break;
						case 'A':
						case 'upper-alpha':
							symbol = String.fromCharCode( 'A'.charCodeAt( 0 ) + start - 1 + index ) + '.';
							break;
						case 'i':
						case 'lower-roman':
							symbol = toRoman( start + index ) + '.';
							break;
						case 'I':
						case 'upper-roman':
							symbol = toRoman( start + index ).toUpperCase() + '.';
							break;
						default:
							symbol = list.name == 'ul' ? '·' : ( start + index ) + '.';
					}

					child.attributes[ 'cke-symbol' ] = symbol;
					child.attributes[ 'cke-list-level' ] = level;
				} );
			} );

			children = arrayTools.reduce( items, function( acc, listElement ) {
				var child = listElement.children[ 0 ];

				if ( child && child.name && child.attributes.style && child.attributes.style.match( /mso-list:/i ) ) {
					Style.pushStylesLower( listElement, {
						'list-style-type': true,
						'display': true
					} );

					var childStyle = tools.parseCssText( child.attributes.style, true );

					Style.setStyle( listElement, 'mso-list', childStyle[ 'mso-list' ], true );
					Style.setStyle( child, 'mso-list', '' );
					// mso-list takes precedence in determining the level.
					delete listElement[ 'cke-list-level' ];

					// If this style has a value it's usually "none". This marks such list elements for deletion.
					var styleName = childStyle.display ? 'display' : childStyle.DISPLAY ? 'DISPLAY' : '';
					if ( styleName ) {
						Style.setStyle( listElement, 'display', childStyle[ styleName ], true );
					}
				}

				// Don't include elements put there only to contain another list.
				if ( listElement.children.length === 1 && isList( listElement.children[ 0 ] ) ) {
					return acc;
				}

				listElement.name = 'p';
				listElement.attributes[ 'cke-dissolved' ] = true;
				acc.push( listElement );

				return acc;
			}, [] );

			for ( i = children.length - 1; i >= 0; i-- ) {
				children[ i ].insertAfter( element );
			}
			for ( i = lists.length - 1; i >= 0; i-- ) {
				delete lists[ i ].name;
			}

			function toRoman( number ) {
				if ( number >= 50 ) return 'l' + toRoman( number - 50 );
				if ( number >= 40 ) return 'xl' + toRoman( number - 40 );
				if ( number >= 10 ) return 'x' + toRoman( number - 10 );
				if ( number == 9 ) return 'ix';
				if ( number >= 5 ) return 'v' + toRoman( number - 5 );
				if ( number == 4 ) return 'iv';
				if ( number >= 1 ) return 'i' + toRoman( number - 1 );
				return '';
			}

			function countParents( condition, element ) {
				return count( element, 0 );

				function count( parent, number ) {
					if ( !parent || !parent.parent ) {
						return number;
					}

					if ( condition( parent.parent ) ) {
						return count( parent.parent, number + 1 );
					} else {
						return count( parent.parent, number );
					}
				}
			}

		},

		groupLists: function( listElements ) {
			// Chop data into continuous lists.
			var i, element,
				lists = [ [ listElements[ 0 ] ] ],
				lastList = lists[ 0 ];

			element = listElements[ 0 ];
			element.attributes[ 'cke-indentation' ] = element.attributes[ 'cke-indentation' ] || getElementIndentation( element );

			for ( i = 1; i < listElements.length; i++ ) {
				element = listElements[ i ];
				var previous = listElements[ i - 1 ];

				element.attributes[ 'cke-indentation' ] = element.attributes[ 'cke-indentation' ] || getElementIndentation( element );

				if ( element.previous !== previous ) {
					List.chopDiscontinuousLists( lastList, lists );
					lists.push( lastList = [] );
				}

				lastList.push( element );
			}

			List.chopDiscontinuousLists( lastList, lists );

			return lists;
		},

		/**
		 * Converts a single, flat list items array into an array with a hierarchy of items.
		 *
		 * As the list gets chopped, it will be forced to render as a separate list, even if it has a deeper nesting level.
		 * For example, for level 3 it will create a structure like `ol > li > ol > li > ol > li`.
		 *
		 * Note that list items within a single list but with different levels that did not get chopped
		 * will still be rendered as a list tree later.
		 *
		 * @private
		 * @since 4.13.0
		 * @param {CKEDITOR.htmlParser.element[]} list An array containing list items.
		 * @param {CKEDITOR.htmlParser.element[]} lists All the lists in the pasted content represented by an array of arrays
		 * of list items. Modified by this method.
		 * @member CKEDITOR.plugins.pastetools.filters.word.lists
		 */
		chopDiscontinuousLists: function( list, lists ) {
			var levelSymbols = {};
			var choppedLists = [ [] ],
				lastListInfo;

			for ( var i = 0; i < list.length; i++ ) {
				var lastSymbol = levelSymbols[ list[ i ].attributes[ 'cke-list-level' ] ],
					currentListInfo = this.getListItemInfo( list[ i ] ),
					currentSymbol,
					forceType;

				if ( lastSymbol ) {
					// An "h" before an "i".
					forceType = lastSymbol.type.match( /alpha/ ) && lastSymbol.index == 7 ? 'alpha' : forceType;
					// An "n" before an "o".
					forceType = list[ i ].attributes[ 'cke-symbol' ] == 'o' && lastSymbol.index == 14 ? 'alpha' : forceType;

					currentSymbol = List.getSymbolInfo( list[ i ].attributes[ 'cke-symbol' ], forceType );
					currentListInfo = this.getListItemInfo( list[ i ] );

					// Based on current and last index we'll decide if we want to chop list.
					if (
						// If the last list was a different list type then chop it!
						lastSymbol.type != currentSymbol.type ||
						// If those are logically different lists, and current list is not a continuation (https://dev.ckeditor.com/ticket/7918):
						( lastListInfo && currentListInfo.id != lastListInfo.id && !this.isAListContinuation( list[ i ] ) ) ) {
						choppedLists.push( [] );
					}
				} else {
					currentSymbol = List.getSymbolInfo( list[ i ].attributes[ 'cke-symbol' ] );
				}

				// Reset all higher levels
				for ( var j = parseInt( list[ i ].attributes[ 'cke-list-level' ], 10 ) + 1; j < 20; j++ ) {
					if ( levelSymbols[ j ] ) {
						delete levelSymbols[ j ];
					}
				}

				levelSymbols[ list[ i ].attributes[ 'cke-list-level' ] ] = currentSymbol;
				choppedLists[ choppedLists.length - 1 ].push( list[ i ] );

				lastListInfo = currentListInfo;
			}

			[].splice.apply( lists, [].concat( [ tools.indexOf( lists, list ), 1 ], choppedLists ) );
		},

		/**
		 * Checks if this list is a direct continuation of a list interrupted by a list with a different ID and
		 * with a different level. So if you look at the following list:
		 *
		 * * list1 level1
		 * * list1 level1
		 *		* list2 level2
		 *		* list2 level2
		 * * list1 level1
		 *
		 * It would return `true`, which means it is a continuation, and should not be chopped. However, if any paragraph or
		 * anything else appears in-between, it should be broken into different lists.
		 *
		 * You can see fixtures from issue https://dev.ckeditor.com/ticket/7918 as an example.
		 *
		 * @private
		 * @since 4.13.0
		 * @param {CKEDITOR.htmlParser.element} listElement The list to be checked.
		 * @returns {Boolean}
		 * @member CKEDITOR.plugins.pastetools.filters.word.lists
		 */
		isAListContinuation: function( listElement ) {
			var prev = listElement;

			do {
				prev = prev.previous;

				if ( prev && prev.type === CKEDITOR.NODE_ELEMENT ) {
					if ( prev.attributes[ 'cke-list-level' ] === undefined ) {
						// Not a list, so looks like an interrupted list.
						return false;
					}

					if ( prev.attributes[ 'cke-list-level' ] === listElement.attributes[ 'cke-list-level' ] ) {
						// Same level, so we want to check if this is a continuation.
						return prev.attributes[ 'cke-list-id' ] === listElement.attributes[ 'cke-list-id' ];
					}
				}

			} while ( prev );

			return false;
		},

		// Source: http://stackoverflow.com/a/17534350/3698944
		toArabic: function( symbol ) {
			if ( !symbol.match( /[ivxl]/i ) ) return 0;
			if ( symbol.match( /^l/i ) ) return 50 + List.toArabic( symbol.slice( 1 ) );
			if ( symbol.match( /^lx/i ) ) return 40 + List.toArabic( symbol.slice( 1 ) );
			if ( symbol.match( /^x/i ) ) return 10 + List.toArabic( symbol.slice( 1 ) );
			if ( symbol.match( /^ix/i ) ) return 9 + List.toArabic( symbol.slice( 2 ) );
			if ( symbol.match( /^v/i ) ) return 5 + List.toArabic( symbol.slice( 1 ) );
			if ( symbol.match( /^iv/i ) ) return 4 + List.toArabic( symbol.slice( 2 ) );
			if ( symbol.match( /^i/i ) ) return 1 + List.toArabic( symbol.slice( 1 ) );
			// Ignore other characters.
			return List.toArabic( symbol.slice( 1 ) );
		},

		/**
		 * Returns an object describing the given `symbol`.
		 *
		 * @private
		 * @since 4.13.0
		 * @param {String} symbol
		 * @param {String} type
		 * @returns {Object} ret
		 * @returns {Number} ret.index Identified numbering value
		 * @returns {String} ret.type One of: `decimal`, `disc`, `circle`, `square`, `roman`, `alpha`.
		 * @member CKEDITOR.plugins.pastetools.filters.word.lists
		 */
		getSymbolInfo: function( symbol, type ) {
			var symbolCase = symbol.toUpperCase() == symbol ? 'upper-' : 'lower-',
				symbolMap = {
					'·': [ 'disc', -1 ],
					'o': [ 'circle', -2 ],
					'§': [ 'square', -3 ]
				};

			if ( symbol in symbolMap || ( type && type.match( /(disc|circle|square)/ ) ) ) {
				return {
					index: symbolMap[ symbol ][ 1 ],
					type: symbolMap[ symbol ][ 0 ]
				};
			}

			if ( symbol.match( /\d/ ) ) {
				return {
					index: symbol ? parseInt( List.getSubsectionSymbol( symbol ) , 10 ) : 0,
					type: 'decimal'
				};
			}

			symbol = symbol.replace( /\W/g, '' ).toLowerCase();

			if ( ( !type && symbol.match( /[ivxl]+/i ) ) || ( type && type != 'alpha' ) || type == 'roman' ) {
				return {
					index: List.toArabic( symbol ),
					type: symbolCase + 'roman'
				};
			}

			if ( symbol.match( /[a-z]/i ) ) {
				return {
					index: symbol.charCodeAt( 0 ) - 97,
					type: symbolCase + 'alpha'
				};
			}

			return {
				index: -1,
				type: 'disc'
			};
		},

		/**
		 * Returns Word-generated information about the given list item, mainly by parsing the `mso-list`
		 * CSS property.
		 *
		 * Note: Paragraphs with `mso-list` are also counted as list items because Word serves
		 * list items as paragraphs.
		 *
		 * @private
		 * @since 4.13.0
		 * @param {CKEDITOR.htmlParser.element} list
		 * @returns ret
		 * @returns {String} ret.id List ID. Usually it is a decimal string.
		 * @returns {String} ret.level List nesting level. `0` means it is the outermost list. Usually it is
		 * a decimal string.
		 * @member CKEDITOR.plugins.pastetools.filters.word.lists
		 */
		getListItemInfo: function( list ) {
			if ( list.attributes[ 'cke-list-id' ] !== undefined ) {
				// List was already resolved.
				return {
					id: list.attributes[ 'cke-list-id' ],
					level: list.attributes[ 'cke-list-level' ]
				};
			}

			var propValue = tools.parseCssText( list.attributes.style )[ 'mso-list' ],
				ret = {
					id: '0',
					level: '1'
				};

			if ( propValue ) {
				// Add one whitespace so it's easier to match values assuming that all of these are separated with \s.
				propValue += ' ';

				ret.level = propValue.match( /level(.+?)\s+/ )[ 1 ];
				ret.id = propValue.match( /l(\d+?)\s+/ )[ 1 ];
			}

			// Store values. List level will be reused if present to prevent regressions.
			list.attributes[ 'cke-list-level' ] = list.attributes[ 'cke-list-level' ] !== undefined ? list.attributes[ 'cke-list-level' ] : ret.level;
			list.attributes[ 'cke-list-id' ] = ret.id;

			return ret;
		}
	};
	List = plug.lists;

	/**
	 * Namespace containing methods used to process the pasted content using heuristics.
	 *
	 * @private
	 * @since 4.13.0
	 * @member CKEDITOR.plugins.pastetools.filters.word
	*/
	plug.heuristics = {
		/**
		 * Decides if an `item` looks like a list item in Microsoft Edge.
		 *
		 * Note: It will return `false` when run in a browser other than Microsoft Edge, despite the configuration.
		 *
		 * @param {CKEDITOR.editor} editor
		 * @param {CKEDITOR.htmlParser.element} item
		 * @returns {Boolean}
		 * @member CKEDITOR.plugins.pastetools.filters.word.heuristics
		 * @private
		 */
		isEdgeListItem: function( editor, item ) {
			if ( !CKEDITOR.env.edge || !editor.config.pasteFromWord_heuristicsEdgeList ) {
				return false;
			}

			var innerText = '';

			// Edge doesn't provide any list-specific markup, so the only way to guess if it's a list is to check the text structure.
			item.forEach && item.forEach( function( text ) {
				innerText += text.value;
			}, CKEDITOR.NODE_TEXT );

			if ( innerText.match( /^(?: |&nbsp;)*\(?[a-zA-Z0-9]+?[\.\)](?: |&nbsp;){2,}/ ) ) {
				return true;
			}

			return Heuristics.isDegenerateListItem( editor, item );
		},

		/**
		 * Cleans up a given list `item`. It is needed to remove Edge pre-marker indentation, since Edge pastes
		 * list items as plain paragraphs with multiple `&nbsp;`s before the list marker.
		 *
		 * @since 4.7.0
		 * @param {CKEDITOR.htmlParser.element} item The pre-processed list-like item, like a paragraph.
		 * @member CKEDITOR.plugins.pastetools.filters.word.heuristics
		 * @private
		 */
		cleanupEdgeListItem: function( item ) {
			var textOccurred = false;

			item.forEach( function( node ) {
				if ( !textOccurred ) {
					node.value = node.value.replace( /^(?:&nbsp;|[\s])+/, '' );

					// If there's any remaining text beside nbsp it means that we can stop filtering.
					if ( node.value.length ) {
						textOccurred = true;
					}
				}
			}, CKEDITOR.NODE_TEXT );
		},

		/**
		 * Checks whether an element is a degenerate list item.
		 *
		 * Degenerate list items are elements that have some styles specific to list items,
		 * but lack the ones that could be used to determine their features (like list level etc.).
		 *
		 * @param {CKEDITOR.editor} editor
		 * @param {CKEDITOR.htmlParser.element} item
		 * @returns {Boolean}
		 * @member CKEDITOR.plugins.pastetools.filters.word.heuristics
		 * @private
		 * */
		isDegenerateListItem: function( editor, item ) {
			return !!item.attributes[ 'cke-list-level' ] || ( item.attributes.style && !item.attributes.style.match( /mso\-list/ ) && !!item.find( function( child ) {
					// In rare cases there's no indication that a heading is a list item other than
					// the fact that it has a child element containing only a list symbol.
					if ( child.type == CKEDITOR.NODE_ELEMENT && item.name.match( /h\d/i ) &&
						child.getHtml().match( /^[a-zA-Z0-9]+?[\.\)]$/ ) ) {
						return true;
					}

					var css = tools.parseCssText( child.attributes && child.attributes.style, true );

					if ( !css ) {
						return false;
					}
					var fontSize = css.font || css['font-size'] || '',
						fontFamily = css[ 'font-family' ] || '';

					return ( fontSize.match( /7pt/i ) && !!child.previous ) ||
						fontFamily.match( /symbol/i );
				}, true ).length );
		},

		/**
		 * Assigns list levels to the `item` and all directly subsequent nodes for which {@link #isEdgeListItem} returns `true`.
		 *
		 * The algorithm determines list item level based on the lowest common non-zero difference in indentation
		 * of two or more subsequent list-like elements.
		 *
		 * @param {CKEDITOR.editor} editor
		 * @param {CKEDITOR.htmlParser.element} item The first item of the list.
		 * @returns {Object/null} `null` if list levels were already applied, or an object used to verify results in tests.
		 * @returns {Number[]} return.indents
		 * @returns {Number[]} return.levels
		 * @returns {Number[]} return.diffs
		 * @member CKEDITOR.plugins.pastetools.filters.word.heuristics
		 * @private
		 */
		assignListLevels: function( editor, item ) {
			// If levels were already calculated, it means that this function was called for preceeding element. There's
			// no need to do this heavy work.
			if ( item.attributes && item.attributes[ 'cke-list-level' ] !== undefined ) {
				return;
			}

			var indents = [ getElementIndentation( item ) ],
				items = [ item ],
				levels = [],
				array = CKEDITOR.tools.array,
				map = array.map;

			while ( item.next && item.next.attributes && !item.next.attributes[ 'cke-list-level' ] && Heuristics.isDegenerateListItem( editor, item.next ) ) {
				item = item.next;
				indents.push( getElementIndentation( item ) );
				items.push( item );
			}

			// An array with indentation difference between n and n-1 list item. It's 0 for the first one.
			var indentationDiffs = map( indents, function( curIndent, i  ) {
					return i === 0 ? 0 : curIndent - indents[ i - 1 ];
				} ),
				// Guess indentation step, but it must not be equal to 0.
				indentationPerLevel = this.guessIndentationStep( array.filter( indents, function( val ) {
					return val !== 0;
				} ) );

			// Here's the tricky part, we need to magically figure out what is the indentation difference between list level.
			levels = map( indents, function( val ) {
				// Make sure that the level is a full number.
				return Math.round( val / indentationPerLevel );
			} );

			// Level can not be equal to 0, in case if it happens bump all the levels by 1,
			if ( array.indexOf( levels, 0 ) !== -1 ) {
				levels = map( levels, function( val ) {
					return val + 1;
				} );
			}

			// Assign levels to a proper place.
			array.forEach( items, function( curItem, index ) {
				curItem.attributes[ 'cke-list-level' ] = levels[ index ];
			} );

			return {
				indents: indents,
				levels: levels,
				diffs: indentationDiffs
			};
		},

		/**
		 * Given an array of list indentations, this method tries to guess what the indentation difference per list level is.
		 * E.g. assuming that you have something like:
		 *
		 *		* foo (indentation 30px)
		 *				* bar (indentation 90px)
		 *				* baz (indentation 90px)
		 *					* baz (indentation 115px)
		 *			* baz (indentation 60px)
		 *
		 * The method will return `30`.
		 *
		 * @param {Number[]} indentations An array of indentation sizes.
		 * @returns {Number/null} A number or `null` if empty `indentations` was given.
		 * @member CKEDITOR.plugins.pastetools.filters.word.heuristics
		 * @private
		 */
		guessIndentationStep: function( indentations ) {
			return indentations.length ? Math.min.apply( null, indentations ) : null;
		},

		/**
		 * Shifts lists that were deformed during pasting one level down
		 * so that the list structure matches the content copied from Word.
		 *
		 * @param {CKEDITOR.htmlParser.element} element
		 * @member CKEDITOR.plugins.pastetools.filters.word.heuristics
		 * @private
		 * */
		correctLevelShift: function( element ) {
			var isShiftedList = function( list ) {
				return list.children && list.children.length == 1 && Heuristics.isShifted( list.children[ 0 ] );
			};

			if ( this.isShifted( element ) ) {
				var lists = CKEDITOR.tools.array.filter( element.children, function( child ) {
					return ( child.name == 'ul' || child.name == 'ol' );
				} );

				var listChildren = CKEDITOR.tools.array.reduce( lists, function( acc, list ) {
					var preceding = isShiftedList( list ) ? [ list ] : list.children;
					return preceding.concat( acc );
				}, [] );

				CKEDITOR.tools.array.forEach( lists, function( list ) {
					list.remove();
				} );

				CKEDITOR.tools.array.forEach( listChildren, function( child ) {
					// `Add` method without index always append child at the end (#796).
					element.add( child );
				} );

				delete element.name;
			}
		},

		/**
		 * Determines if the list is malformed in a manner that its items
		 * are one level deeper than they should be.
		 *
		 * @param {CKEDITOR.htmlParser.element} element
		 * @returns {Boolean}
		 * @member CKEDITOR.plugins.pastetools.filters.word.heuristics
		 * @private
		 */
		isShifted: function( element ) {
			if ( element.name !== 'li' ) {
				return false;
			}

			return CKEDITOR.tools.array.filter( element.children, function( child ) {
				if ( child.name ) {
					if ( child.name == 'ul' || child.name == 'ol' ) {
						return false;
					}

					if ( child.name == 'p' && child.children.length === 0 ) {
						return false;
					}
				}
				return true;
			} ).length === 0;
		}
	};

	Heuristics = plug.heuristics;

	// Expose this function since it's useful in other places.
	List.setListSymbol.removeRedundancies = function( style, level ) {
		// 'disc' and 'decimal' are the default styles in some cases - remove redundancy.
		if ( ( level === 1 && style[ 'list-style-type' ] === 'disc' ) || style[ 'list-style-type' ] === 'decimal' ) {
			delete style[ 'list-style-type' ];
		}
	};

	function falseIfEmpty( value ) {
		if ( value === '' ) {
			return false;
		}
		return value;
	}

	// Used when filtering attributes - returning false deletes the attribute.
	function remove() {
		return false;
	}

	CKEDITOR.cleanWord = CKEDITOR.pasteFilters.word = pastetools.createFilter( {
		rules: [
			commonFilter.rules,
			plug.rules
		],
		additionalTransforms: function( html ) {
			// Before filtering inline all the styles to allow because some of them are available only in style
			// sheets. This step is skipped in IEs due to their flaky support for custom types in dataTransfer. (https://dev.ckeditor.com/ticket/16847)
			if ( CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
				html = commonFilter.styles.inliner.inline( html ).getBody().getHtml();
			}

			// Sometimes Word malforms the comments.
			return html.replace( /<!\[/g, '<!--[' ).replace( /\]>/g, ']-->' );
		}
	} );

	/**
	 * See {@link CKEDITOR.plugins.pastetools.filters.word.lists}.
	 *
	 * @property {Object} lists
	 * @private
	 * @deprecated 4.13.0
	 * @since 4.6.0
	 * @member CKEDITOR.plugins.pastefromword
	 */

	/**
	 * See {@link CKEDITOR.plugins.pastetools.filters.word.images}.
	 *
	 * @property {Object} images
	 * @private
	 * @deprecated 4.13.0
	 * @removed 4.16.0
	 * @since 4.8.0
	 * @member CKEDITOR.plugins.pastefromword
	 */

	/**
	 * See {@link CKEDITOR.plugins.pastetools.filters.image}.
	 *
	 * @property {Object} images
	 * @private
	 * @removed 4.16.0
	 * @since 4.13.0
	 * @member CKEDITOR.plugins.pastetools.filters.word
	 */

	/**
	 * See {@link CKEDITOR.plugins.pastetools.filters.image#extractFromRtf}.
	 *
	 * @property {Function} extractFromRtf
	 * @private
	 * @removed 4.16.0
	 * @since 4.13.0
	 * @member CKEDITOR.plugins.pastetools.filters.word.images
	 */

	/**
	 * See {@link CKEDITOR.plugins.pastetools.filters.image#extractTagsFromHtml}.
	 *
	 * @property {Function} extractTagsFromHtml
	 * @private
	 * @removed 4.16.0
	 * @since 4.13.0
	 * @member CKEDITOR.plugins.pastetools.filters.word.images
	 */

	/**
	 * See {@link CKEDITOR.plugins.pastetools.filters.word.heuristics}.
	 *
	 * @property {Object} heuristics
	 * @private
	 * @deprecated 4.13.0
	 * @since 4.6.2
	 * @member CKEDITOR.plugins.pastefromword
	*/

	/**
	 * See {@link CKEDITOR.plugins.pastetools.filters.common.styles}.
	 *
	 * @property {Object} styles
	 * @private
	 * @deprecated 4.13.0
	 * @since 4.6.0
	 * @member CKEDITOR.plugins.pastefromword
	 */



	/**
	 * See {@link #pasteTools_removeFontStyles}.
	 *
	 * **Important note:** Prior to version 4.6.0 this configuration option defaulted to `true`.
	 *
	 * @deprecated 4.13.0
	 * @since 3.1.0
	 * @cfg {Boolean} [pasteFromWordRemoveFontStyles=false]
	 * @member CKEDITOR.config
	 */

	/**
	 * Whether to transform Microsoft Word outline numbered headings into lists.
	 *
	 *		config.pasteFromWordNumberedHeadingToList = true;
	 *
	 * @removed 4.6.0
	 * @since 3.1.0
	 * @cfg {Boolean} [pasteFromWordNumberedHeadingToList=false]
	 * @member CKEDITOR.config
	 */

	/**
	 * Whether to remove element styles that cannot be managed with the editor. Note
	 * that this option does not handle font-specific styles, which depend on the
	 * {@link #pasteTools_removeFontStyles} setting instead.
	 *
	 *		config.pasteFromWordRemoveStyles = false;
	 *
	 * @removed 4.6.0
	 * @since 3.1.0
	 * @cfg {Boolean} [pasteFromWordRemoveStyles=true]
	 * @member CKEDITOR.config
	 */

	/**
	 * Activates a heuristic that helps detect lists pasted into the editor in Microsoft Edge.
	 *
	 * The reason why this heuristic is needed is that on pasting Microsoft Edge removes any Word-specific
	 * metadata allowing to identify lists.
	 *
	 *		// Disables list heuristics for Edge.
	 *		config.pasteFromWord_heuristicsEdgeList = false;
	 *
	 * @since 4.6.2
	 * @cfg {Boolean} [pasteFromWord_heuristicsEdgeList=true]
	 * @member CKEDITOR.config
	*/
	CKEDITOR.config.pasteFromWord_heuristicsEdgeList = true;
} )();
