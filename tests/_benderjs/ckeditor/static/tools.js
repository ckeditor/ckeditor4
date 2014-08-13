/**
 * Copyright (c) 2014, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 */

( function( bender ) {
	'use strict';

	function browserHtmlFix( html ) {
		if ( CKEDITOR.env.ie && ( document.documentMode || CKEDITOR.env.version ) < 9 ) {
			// Fix output base href on anchored link.
			html = html.replace( /href="(.*?)#(.*?)"/gi,
				function( m, base, anchor ) {
					if ( base == window.location.href.replace( window.location.hash, '' ) ) {
						return 'href="#' + anchor + '"';
					}

					return m;
				} );

			// Fix output line break after HR.
			html = html.replace( /(<HR>)\r\n/gi, function( m, hr ) {
				return hr;
			} );
		}

		return html;
	}


	var textBlockTags;

	function getAllTextBlocks() {
		if ( !textBlockTags ) {
			var block = CKEDITOR.dtd.$block,
				list = [],
				tag;

			for ( tag in block ) {
				if ( CKEDITOR.dtd[ tag ][ '#' ] ) {
					list.push( tag );
				}
			}

			textBlockTags = list.join( '|' );
		}
		return textBlockTags;
	}

	var selectionMarkers = /(\[|\]|\{|\}|\^)/g,
		selectionMarkerComments = /<!--cke-range-marker-(.)-->/gi,
		noTempElementsFilter = new CKEDITOR.htmlParser.filter( {
			elements: {
				'^': function( el ) {
					if ( el.attributes[ 'data-cke-temp' ] )
						return false;
				}
			}
		} );

	bender.tools = {
		/**
		 * Gets the inner HTML of an element, for testing purposes.
		 * @param {Boolean} stripLineBreaks Assign 'false' to avoid trimming line-breaks.
		 */
		getInnerHtml: function( elementOrId, stripLineBreaks ) {
			var html;

			if ( typeof elementOrId == 'string' ) {
				html = document.getElementById( elementOrId ).innerHTML;
			} else if ( elementOrId.getHtml ) {
				html = elementOrId.getHtml();
			} else {
				html = elementOrId.innerHTML || // retrieve from innerHTML
				elementOrId.value; // retrieve from value
			}

			return bender.tools.fixHtml( html, stripLineBreaks );
		},

		fixHtml: function( html, stripLineBreaks, toLowerCase ) {
			if ( toLowerCase !== false ) {
				html = html.toLowerCase();
			}

			html = browserHtmlFix( html );

			if ( stripLineBreaks !== false ) {
				html = html.replace( /[\n\r]/g, '' );
			} else {
				html = html.replace( /\r/g, '' ); // Normalize CRLF.
			}

			function sorter( a, b ) {
				var nameA = a[ 0 ],
					nameB = b[ 0 ];

				return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
			}

			html = html.replace( /(<\b(?!!)[^>\s]*)(.*?)(\s*\/?>)/g, function( match, start, body, end ) {
				var attribs = [],
					hasClass;

				body = body.replace( /\s([^\s=]+)=((?:"[^"]*")|(?:'[^']*')|(?:[^\s]+))/g, function( match,
					attName, attValue ) {
					if ( attName == 'style' ) {
						// Reorganize the style rules so they are sorted by name.
						var rules = [];

						// Push all rules into an Array.
						attValue.replace( /(?:"| |;|^ )\s*([^ :]+?)\s*:\s*([^;"]+?)\s*(?=;|"|$)/g, function(
							match, name, value ) {
							// 1. Avoid spaces after commas which separating family names.
							// 2. Remove quotes around family names.
							if ( name == 'font-family' ) {
								value = value.replace( /,\s*/g, ',' )
									.replace( /['"]/g, '' );
							}

							rules.push( [ name, value ] );
						} );

						// Sort the Array.
						rules.sort( sorter );

						// Transform each rule entry into a string name:value.
						for ( var i = 0; i < rules.length; i++ ) {
							rules[ i ] = rules[ i ].join( ':' );
						}

						// Join all rules with commas, removing spaces and adding an extra comma to the end.
						attValue = '"' + rules && ( rules.join( ';' ) + ( rules.length ? ';' : '' ) );
					}

					// IE may have 'class' more than once.
					if ( attName == 'class' ) {
						if ( hasClass ) {
							return '';
						}

						hasClass = true;
					}

					if ( attName != 'data-cke-expando' && attValue ) {
						attribs.push( [ attName, attValue ] );
					}

					return '';
				} );

				attribs.sort( sorter );

				var ret = start;

				for ( var i = 0; i < attribs.length; i++ ) {
					ret += ' ' + attribs[ i ][ 0 ] + '=';
					ret += ( /^["']/ ).test( attribs[ i ][ 1 ] ) ? attribs[ i ][ 1 ] : '"' + attribs[ i ][ 1 ] +
						'"';
				}

				ret += end;

				return ret;
			} );

			// Remove old IEs outputted expando properties.
			html = html.replace( /\s*data-cke-expando=".*?"/g, '' );

			// For easier tests redability and to align development and release
			// versions of the tests, replace non-breaking-space char with &nbsp;
			html = html.replace( /\u00a0/g, '&nbsp;' );

			return html;
		},

		/**
		 * Move focus to the focusable and resume the test, after focus has received.
		 * @param obj
		 * @param cb
		 */
		focus: function( obj, cb ) {
			obj.once( 'focus', function() {
				resume( cb );
			} );

			obj.focus();
			wait();
		},

		/**
		 * Reset DOM focus to the document's body element.
		 * @param [callback]
		 * @example
		 * // Use inside of test.
		 * bender.tools.resetFocus(function(){
		 *   bender.tools.focus(...);
		 * });
		 * // Used as asynchronous setup method.
		 * {
		 *  async:setUp : bender.tools.resetFocus,
		 *  testXXX : function(){...}
		 * }
		 */
		resetFocus: function( callback ) {
			var that = this;

			function onFocus() {
				if ( typeof callback == 'function' ) {
					callback.call( that );
				} else {
					that.callback();
				}
			}

			var body = CKEDITOR.document.getBody();

			// Make body element focusable.
			if ( !body.hasAttribute( 'tabIndex' ) ) {
				body.setAttribute( 'tabIndex', '-1' );
			}

			// Check focus on body otherwise move focus to it.
			var active = CKEDITOR.document.getActive();

			if ( !active.equals( body ) ) {
				bender.tools.focus( body, onFocus );
			} else {
				onFocus();
			}
		},

		/**
		 * Parse the HTML with {@link CKEDITOR.htmlParser} and output in
		 * compact format without any additional spaces, mainly used for html comparison.
		 * @param {String} html The HTML string.
		 * @param {Boolean} [noInterWS] Whether to remove all intermediate whitespaces between elements.
		 * @param {Boolean} [sortAttributes]
		 * @param {Boolean} [fixZWS] Remove zero-width spaces (\u200b).
		 * @param {Boolean} [fixStyles] Pass inline styles through {@link CKEDITOR.tools#parseCssText}.
		 * @param {Boolean} [fixNbsp] Encode `\u00a0`.
		 * @param {Boolean} [noTempElements] Strip elements with `data-cke-temp` attributes (e.g. hidden selection container).
		 */
		compatHtml: function( html, noInterWS, sortAttributes, fixZWS, fixStyles, fixNbsp, noTempElements ) {
			// Remove all indeterminate white spaces.
			if ( noInterWS ) {
				html = html.replace( /[\t\n\r ]+(?=<)/g, '' ).replace( />[\t\n\r ]+/g, '>' );
			}

			var fragment = CKEDITOR.htmlParser.fragment.fromHtml( html ),
				writer = new CKEDITOR.htmlParser.basicWriter();

			if ( noTempElements ) {
				fragment.filterChildren( noTempElementsFilter );
			}

			if ( sortAttributes ) {
				writer.sortAttributes = true;
			}

			fragment.writeHtml( writer );
			html = writer.getHtml( true );

			if ( fixZWS ) {
				html = html.replace( /\u200b/g, '' );
			}

			if ( fixNbsp ) {
				html = html.replace( /\u00a0/g, '&nbsp;' );
			}

			if ( fixStyles ) {
				html = html.replace( / style="([^"]+)"/g, function( match, style ) {
					style = CKEDITOR.tools.writeCssText( CKEDITOR.tools.parseCssText( style, true ) );
					// Encode e.g. "" in urls().
					style = CKEDITOR.tools.htmlEncodeAttr( style );

					return ' style="' + style + '"';
				} );
			}

			return html;
		},

		/**
		 * Wrapper of bender.dom.element::getAttribute for style text normalization.
		 * @param element
		 * @param attrName
		 */
		getAttribute: function( element, attrName ) {
			var retval = element.getAttribute( attrName );
			if ( attrName == 'style' ) {
				// 1. Lower case property name.
				// 2. Add space after colon.
				// 3. Strip whitepsaces around semicolon.
				// 4. Always end with semicolon
				return retval.replace( /(?:^|;)\s*([A-Z-_]+)(:\s*)/ig,
						function( match, property, colon ) {
							return property.toLowerCase() + ': ';
						} )
					.replace( /\s+(?:;\s*|$)/g, ';' )
					.replace( /([^;])$/g, '$1;' );
			}

			return retval;
		},

		/**
		 * Retrieve the value of an element as normalized HTML.
		 * @param id {String} Id of the element.
		 */
		getValueAsHtml: function( id ) {
			return bender.tools.fixHtml( CKEDITOR.document.getById( id ).getValue(), false );
		},

		/**
		 * Make assertion for typical test that receives an input and verify against the output,
		 * all from a textarea.
		 * @param {String} playground of playground textarea element.
		 * @param {Function} fn The function for test, which will be fed with both input and output.
		 * @example
		 * // With the following HTML, note the "=>" denotation as divider line from input to output.
		 * <textarea id="sample1">
		 * <p>foo^bar</p>
		 * =>
		 * <p>foobar</p>
		 * </textarea>
		 *
		 * // Then test will look like:
		 * bender.testInputOut( 'sample1', function( input, output ){ ...test and assertion... });
		 */
		testInputOut: function( playground, fn ) {
			var source = bender.tools.getValueAsHtml( playground ).split( '=>' ),
				input = source[ 0 ],
				output = /\(no change\)/.test( source[ 1 ] ) ? input.replace( /\^|\[|\]/g, '' ) : source[ 1 ];

			fn( input, output );
		},

		testExternalInputOutput: function( url, fn ) {
			assert.isObject( CKEDITOR.ajax, 'Ajax plugin is required' );

			CKEDITOR.ajax.load( url, function( data ) {
				resume( function() {
					assert.isNotNull( data, 'Error while loading external data' );

					var source = data.split( '=>' );

					fn( source[ 0 ], source[ 1 ] );
				} );
			} );

			wait();
		},

		/**
		 * Creates a function override.
		 * @param {Function} originalFunction The function to be overridden.
		 * @param {Function} functionBuilder A function that returns the new
		 *      function. The original function reference will be passed to this
		 *      function.
		 * @returns {Function} The new function.
		 * @example
		 * var example =
		 * {
		 *     myFunction : function( name )
		 *     {
		 *         alert( 'Name: ' + name );
		 *     }
		 * };
		 *
		 * example.myFunction = bender.tools.override( example.myFunction, function( myFunctionOriginal )
		 *     {
		 *         return function( name )
		 *             {
		 *                 alert( 'Override Name: ' + name );
		 *                 myFunctionOriginal.call( this, name );
		 *             };
		 *     });
		 */
		override: function( originalFunction, functionBuilder ) {
			return functionBuilder( originalFunction );
		},

		/**
		 * Replaces object's method with given one and allows
		 * to revert the replacement.
		 *
		 *      var example = {
		 *          foo: function() {
		 *          }
		 *      };
		 *
		 *      var revert = bender.tools.replaceMethod( example, 'foo', function() {
		 *          assert.something();
		 *      } );
		 *
		 *      // Test foo.
		 *      example.foo();
		 *      // Revert back to original method.
		 *      revert();
		 */
		replaceMethod: function( obj, methodName, newMethod ) {
			var originalMethod = obj[ methodName ];

			obj[ methodName ] = newMethod;

			return function() {
				obj[ methodName ] = originalMethod;
			};
		},

		/**
		 * Fill the the target editor or DOM element with the specified html
		 * and make document selection denoted by the range marker.
		 *
		 *		<p>single ^ selection</p>
		 *		<p>[multiple]<span>[selection]</span></p>
		 *
		 * @deprecated Use {@link bender.tools.selection#setWithHtml} instead.
		 * @param element {CKEDITOR.editor|CKEDITOR.dom.element} The editor or element to fill.
		 * @param html {String} String presentation of the HTML along with the
		 * selection range marker to load.
		 * @param [root] {CKEDITOR.dom.element|CKEDITOR.dom.document} The element/document
		 * in which the range/selection scopes, when the {@param element} has been
		 * as an editor instance, this param is ignored, otherwise it defaults to the
		 * current document when not specified.
		 */
		setHtmlWithSelection: function( editorOrElement, html, root ) {
			var isEditor = editorOrElement instanceof CKEDITOR.editor,
				element = isEditor ? editorOrElement.editable() : editorOrElement;

			if ( isEditor ) {
				// (#9848) Prevent additional selectionChange due to editor.focus().
				// This fix isn't required by IE < 9.
				if ( CKEDITOR.env.ie ? CKEDITOR.env.version > 8 : 1 ) {
					editorOrElement.once( 'selectionChange', function( event ) {
						event.cancel();
					}, null, null, 0 );
				}

				element.focus();
			}

			root = isEditor ? element :
				root instanceof CKEDITOR.dom.document ?
				root.getBody() : root || CKEDITOR.document.getBody();

			var fixCursor;

			// We're unable to put a collapsed cursor at exact position in some edge cases,
			// e.g. <li>foo^<ol><li>bar</li></ol></li>
			// due to browser selection limitation, the above case will always result
			// in following actual visual range:
			// <li>foo<ol><li>^bar</li></ol></li>
			// Making instead a range selection and mark it to be deleted later.
			html = html.replace( /\^(?=\s*<(?:ol|ul).*?>)/, function() {
				fixCursor = true;
				return '[@]' + ( CKEDITOR.env.needsNbspFiller ? '&nbsp;' : '<br />' );
			} );


			// [Opera] It's mandatory to fill empty text block with bogus BR in Opera, otherwise
			// an extra BR will be produced at the start of the editable.
			if ( CKEDITOR.env.opera && element.is( 'body' ) ) {
				html = html.replace( new RegExp( '<(' + getAllTextBlocks() + ')>\\^</\\1>' ), '<$1>^<br /></$1>' );
			}

			// Create the ranges.
			var ranges = bender.tools.setHtmlWithRange( element, html, root ),
				// Make the selection.
				sel = isEditor ? editorOrElement.getSelection() : new CKEDITOR.dom.selection( root );

			sel.selectRanges( ranges );

			// Remove the temporary text range for collapsed selection.
			if ( fixCursor ) {
				var doc = root.getDocument();
				doc.$.execCommand( 'Delete', false, null );
			}

			// If we're setting the editor data, it's better to force a
			// "selectionChange" event so the editor commands statuses get updated.
			if ( isEditor && sel.getType() != CKEDITOR.SELECTION_NONE ) {
				var firstElement = sel.getStartElement(),
					currentPath = new CKEDITOR.dom.elementPath( firstElement, root );

				editorOrElement.fire( 'selectionChange', {
					selection: sel,
					path: currentPath,
					element: firstElement
				} );
			}

			return sel;
		},

		/**
		 * Retrieve the data/HTML of the editor/element with it's selection ranges
		 * marked in the output.
		 *
		 * @deprecated Use {@link bender.tools.selection#getWithHtml} instead.
		 */
		getHtmlWithSelection: function( editorOrElement, root ) {
			var isEditor = editorOrElement instanceof CKEDITOR.editor,
				element = isEditor ? editorOrElement.editable() : editorOrElement;

			root = isEditor ? element :
				root instanceof CKEDITOR.dom.document ?
				root.getBody() : root || CKEDITOR.document.getBody();

			function replaceWithBookmark( match, startOrEnd ) {
				var bookmark;
				switch ( startOrEnd ) {
					case 'S':
						bookmark = '[';
						break;
					case 'E':
						bookmark = ']';
						break;
					case 'C':
						bookmark = '^';
						break;
				}
				return bookmark;
			}

			// Hack: force remove the filling char hack in Webkit.
			if ( isEditor && CKEDITOR.env.webkit ) {
				editorOrElement.fire( 'beforeSetMode' );
			}

			var sel = isEditor ? editorOrElement.getSelection() : new CKEDITOR.dom.selection( root ),
				doc = sel.document,
				ranges = sel.getRanges(),
				range,
				bms = [],
				iter = ranges.createIterator();

			while ( ( range = iter.getNextRange() ) ) {
				bms.push( range.createBookmark( 1 ) );
			}

			var html = browserHtmlFix( isEditor ? editorOrElement.getData() : element.getHtml() );
			html = html.replace( /<span\b[^>]*?id="?cke_bm_\d+(\w)"?\b[^>]*?>.*?<\/span>/gi,
				replaceWithBookmark );

			for ( var i = 0, bm; i < bms.length; i++ ) {
				bm = bms[ i ];
				var start = doc.getById( bm.startNode ),
					end = doc.getById( bm.endNode );

				if ( start ) {
					start.remove();
				}

				if ( end ) {
					end.remove();
				}
			}

			return bender.tools.compatHtml( html );
		},

		/**
		 * @deprecated Use {@link bender.tools.range#setWithHtml} instead.
		 */
		setHtmlWithRange: function( element, html, root ) {
			root = root instanceof CKEDITOR.dom.document ?
				root.getBody() : root || CKEDITOR.document.getBody();

			function getRange( getNew ) {
				if ( getNew ) {
					ranges.push( new CKEDITOR.dom.range( root ) );
				}

				return ranges[ ranges.length - 1 ];
			}

			// Translate range markers into HTML comments.
			html = html.replace( /\^|\[|\]/g, function( marker ) {
				return [ '<!--cke-bm', marker, '->' ].join( '-' );
			} );


			// Parse the source HTML to compact it after the selection denotation
			// has been replace, which will otherwise bother parser.
			html = bender.tools.compatHtml( html );

			// Avoid having IE drop the comment nodes before any actual text. (#3801)
			if ( CKEDITOR.env.ie && ( document.documentMode || CKEDITOR.env.version ) < 9 ) {
				element.setHtml( '<span>a</span>' + html );
				element.getFirst().remove();
			} else {
				element.setHtml( html );
			}

			var doc = element.getDocument(),
				ranges = [],
				// Walk prepared to traverse the inner dom tree of this element.
				walkerRange = new CKEDITOR.dom.range( root );

			walkerRange.selectNodeContents( element );
			var wallker = new CKEDITOR.dom.walker( walkerRange ),
				toRemove = [];

			// Check through all comments node, transforming them into dom ranges.
			wallker.evaluator = function( node ) {
				if ( node.type == CKEDITOR.NODE_COMMENT ) {
					var marker = node.$.nodeValue.match( /cke-bm-(.)/ );
					if ( marker ) {
						marker = marker[ 1 ];
						var range = getRange( marker != ']' );
						range[ marker == '[' ? 'setStartAt' :
							marker == ']' ? 'setEndAt' :
							'moveToPosition' ]( node,
							CKEDITOR.POSITION_BEFORE_START );

						// We're not able to remove the bookmark nodes right now when walking,
						// mark it to be deleted later, so have to update range position to
						// anticipate removed bookmark nodes.
						for ( var i = 0, bm; i < toRemove.length; i++ ) {
							bm = toRemove[ i ];

							// Range start update needed.
							if ( bm.getParent().equals( range.startContainer ) &&
								bm.getIndex() < range.startOffset ) {
								range.startOffset--;
							}

							// Range end update needed.
							if ( bm.getParent().equals( range.endContainer ) &&
								bm.getIndex() < range.endOffset ) {
								range.endOffset--;
							}
						}

						toRemove.push( node );
					}
				}
			};

			wallker.lastForward();

			// Eventually remove the comment nodes from DOM.
			for ( var i = 0; i < toRemove.length; i++ ) {
				toRemove[ i ].remove();
			}

			return new CKEDITOR.dom.rangeList( ranges );
		},

		/**
		 * @deprecated Use {@link bender.tools.range#getWithHtml} instead.
		 */
		getHtmlWithRanges: function( element, ranges, root ) {
			root = root instanceof CKEDITOR.dom.document ?
				root.getBody() : root || CKEDITOR.document.getBody();

			function replaceWithBookmark( match, startOrEnd ) {
				var bookmark;
				switch ( startOrEnd ) {
					case 'S':
						bookmark = '[';
						break;
					case 'E':
						bookmark = ']';
						break;
					case 'C':
						bookmark = '^';
						break;
				}
				return bookmark;
			}

			var doc = element.getDocument(),
				range,
				bms = [],
				iter = ranges.createIterator();

			while ( ( range = iter.getNextRange() ) ) {
				bms.push( range.createBookmark( 1 ) );
			}

			var html = browserHtmlFix( element instanceof CKEDITOR.editable ? element.getData() : element.getHtml() );
			html = html.replace( /<span\b[^>]*?id="?cke_bm_\d+(\w)"?\b[^>]*?>.*?<\/span>/gi, replaceWithBookmark );

			for ( var i = 0, bm; i < bms.length; i++ ) {
				bm = bms[ i ];
				var start = doc.getById( bm.startNode ),
					end = doc.getById( bm.endNode );

				if ( start ) {
					start.remove();
				}

				if ( end ) {
					end.remove();
				}
			}

			return bender.tools.compatHtml( html );
		},

		/**
		 * Attaches event listeners to an editor instance to assert both the presence
		 * and the order of given events.
		 *
		 * Returns an event recorder object which must be reset before another
		 * recording starts.
		 *
		 * @param {CKEDITOR.editor} editor Editor instance to be checked.
		 * @param {Array} events Array of event names.
		 * @returns {Object} Functions to assert events and reset the recorder.
		 */
		recordEvents: function( editor, events ) {
			var i,
				fired = [],
				paused = false;

			for ( i = 0; i < events.length; ++i ) {
				editor.on( events[ i ], function( evt ) {
					if ( !paused ) {
						fired.push( evt.name );
					}
				}, null, null, -100 );
			}

			return {
				assert: function( expectedOrder, msg ) {
					arrayAssert.itemsAreEqual( expectedOrder, fired, ( msg ? msg + ' ' : '' ) + '(actual: ' + fired
						.join( ',' ) + ' || expected: ' + expectedOrder.join( ',' ) + ')' );
				},

				reset: function() {
					fired = [];
				},

				pause: function() {
					paused = true;
				}
			};
		},

		/**
		 * Returns an object which `show`, `ok` and `cancel` methods
		 * will cause events firing like on dialog instance without really
		 * opening the dialog.
		 *
		 * More methods may be added in the future to mimic more dialog behavior.
		 */
		mockDialog: function() {
			var dialog = new CKEDITOR.event();

			dialog.show = function() {
				this.fire( 'show' );
			};

			dialog.ok = function() {
				this.fire( 'ok' );
				this.fire( 'hide' );
			};

			dialog.cancel = function() {
				this.fire( 'cancel' );
				this.fire( 'hide' );
			};

			return dialog;
		},

		/**
		 * Paste given html into given editor.
		 *
		 * @param {CKEDITOR.editor} editor Editor instance.
		 * @param {String} html Html to be pasted.
		 */
		emulatePaste: function( editor, html ) {
			var el = editor.editable(),
				doc = el.getDocument(),
				evt = CKEDITOR.env.ie ? 'beforepaste' : 'paste';

			el.fire( evt, {
				// Clipboard is checking for existance of evt.data.$.clipboardData.
				// Do not fail there.
				$: {
					ctrlKey: true
				}
			} );

			// Insert given HTML into the current selection, which should be in pastebin.
			// IE>=11 doesn't support neither msieRange#pasteHtml nor inserhtml command,
			// so for simplicity on all IEs use custom way.
			if ( !CKEDITOR.env.ie ) {
				doc.$.execCommand( 'inserthtml', false, html );
			} else {
				var frag = new CKEDITOR.dom.element( 'div', doc );
				frag.setHtml( html );

				var range = doc.getSelection().getRanges()[ 0 ];

				for ( var i = frag.getChildCount() - 1; i >= 0; i-- ) {
					range.insertNode( frag.getChild( i ) );
					range.collapse( true );
				}
			}
		},

		/**
		 * Escapes characters which are special characters in RegExp.
		 *
		 * @param {String} str
		 * @returns {String}
		 */
		escapeRegExp: function( str ) {
			// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
			return str.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' );
		},

		/**
		 * Creates editors defined in `editorsDefinitions` and passes them along with editorBots to the callback.
		 *
		 * @param {Object} editors Definitions map of the editors definitions in the same format as `editorBot` use.
		 * @param {Function} callback Function called when all of the editors will be created.
		 */
		setUpEditors: function( editorsDefinitions, callback ) {
			var names = [],
				editors = {},
				bots = {};

			for ( var e in editorsDefinitions ) {
				names.push( e );
			}

			next();

			function next() {
				var name = names.shift();

				if ( !name ) {
					callback( editors, bots );
					return;
				}

				bender.editorBot.create( editorsDefinitions[ name ], function( bot ) {
					bots[ name ] = bot;
					editors[ name ] = bot.editor;
					next();
				} );
			}
		},

		/**
		 * Multiplies inputTests for every editor.
		 *
		 * @param {Object} editors
		 * @param {Object} inputTests Tests to apply on every editor.
		 * @returns {Object} Created tests for every editor.
		 */
		createTestsForEditors: function( editors, inputTests ) {
			var outputTests = {},
				specificTestName,
				specialMethods = {
					'init': 1,
					'async:init': 1,
					'setUp': 1,
					'tearDown': 1
				};

			for ( var method in specialMethods ) {
				if ( inputTests[ method ] ) {
					outputTests[ method ] = inputTests[ method ];
				}
			}

			for ( var editorName in editors ) {
				for ( var testName in inputTests ) {
					if ( specialMethods[ testName ] ) {
						continue;
					}

					specificTestName = testName + ' (' + editors[ editorName ].name + ')';

					// Avoid silent failure.
					if ( outputTests[ specificTestName ] ) {
						throw new Error( 'Test named "' + specificTestName + '" already exists' );
					}

					outputTests[ specificTestName ] = ( function( testName, editorName ) {
						return function() {
							inputTests[ testName ]( editors[ editorName ] );
						};
					} )( testName, editorName );
				}
			}

			return outputTests;
		}

	};

	bender.tools.range = {
		/**
		 * Sets HTML of an element and returns a range, which reflects defined range markers.
		 *
		 * This method supports range markers of two different types:
		 * * Text markers `{` and `}`, which indicate that range should be anchored in a text node.
		 * * Element markers `[` and `]`, which indicate that range should be anchored in an element.
		 *
		 * Examples:
		 *
		 * 	// Range anchored in "foo" text node (startOffset is 0, endOffset is 3).
		 * 	<p>{foo}</p>
		 *
		 * 	// Range anchored in <p> element (startOffset is 0, endOffset is 1).
		 * 	<p>[foo]</p>
		 *
		 * 	// Collapsed range, anchored in "foobar" text node (startOffset and endOffset are 3).
		 * 	<p>foo{}bar</p>
		 *
		 * 	// Collapsed range, anchored in <p> element (startOffset and endOffset are 1).
		 * 	<p>foo[]bar</p>
		 *
		 * 	// startContainer is "foo" text node (startOffset is 0) but endContainer is <p> element (endOffset is 1).
		 * 	<p>{foo]</p>
		 *
		 * **Notes**:
		 * * This method accepts HTML with a single range definition only.
		 * * Range markers (`{`, `}`, `[`, `]`) are not visible in DOM.
		 *
		 * @method setWithHtml
		 * @param {CKEDITOR.dom.element} element An element, which `innerHTML` is to be set.
		 * @param {String} html HTML with range markers.
		 * @returns {CKEDITOR.dom.range} A range reflecting range markers in `html`.
		 * @see #getWithHtml
		 */
		setWithHtml: ( function() {
			var markerReplaceRegex = /(\[|\])/g,
				markerDetectRegex = /cke-range-marker-(\[|\])/,

				range, walkerRange, walker,
				removed, marker, text, root,
				markerIndex, markerFound;

			function replaceTextMarker( m, i ) {
				markerFound = m;
				markerIndex = i;
				return '';
			}

			// This evaluator looks for text nodes containing { or } and comment
			// nodes containing [ or ]. If one is found, the range is anchored at
			// corresponding position.
			function evaluator( node ) {
				if ( node.type == CKEDITOR.NODE_TEXT ) {
					markerFound = markerIndex = null;

					if ( ( text = node.getText().replace( '{}', replaceTextMarker ) ) && markerFound == '{}' ) {
						range = new CKEDITOR.dom.range( root );
						range.setStart( node, markerIndex );
						range.collapse( 1 );
					}

					if ( ( text = text.replace( '{', replaceTextMarker ) ) && markerFound == '{' ) {
						range = new CKEDITOR.dom.range( root );
						range.setStart( node, markerIndex );
					}

					// There must be existing range to set its end.
					if ( ( text = text.replace( '}', replaceTextMarker ) ) && markerFound == '}' && range ) {
						range.setEnd( node, markerIndex );
					}

					if ( markerFound ) {
						node.setText( text );

						// There will be no more ranges.
						return false;
					}
				} else if ( node.type == CKEDITOR.NODE_COMMENT ) {
					marker = node.$.nodeValue.match( markerDetectRegex );

					if ( marker ) {
						// Set start marker.
						if ( marker[ 1 ] == '[' ) {
							range = new CKEDITOR.dom.range( root );
							range.setStartAt( node, CKEDITOR.POSITION_BEFORE_START );

							// We cannot remove nodes while walking.
							removed.push( node );

							// Set end marker.
						} else {
							range.setEndAt( node, CKEDITOR.POSITION_BEFORE_START );

							// We cannot remove nodes while walking.
							removed.push( node );

							// It's over. There won't be more than one range.
							return false;
						}
					}
				}
			};

			return function( element, html ) {
				root = element.getDocument().getBody();

				// First, let's assume that there will be no range.
				range = null;

				// Translate range markers into HTML comments.
				html = html.replace( markerReplaceRegex, '<!--cke-range-marker-$1-->' );

				// Set clean HTML without {, }, [, ] but with adequate comments.
				// Prevent IE from purging comment nodes before any actual text (#3801).
				if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
					element.setHtml( '<span>!</span>' + html );
					element.getFirst().remove();
				} else {
					element.setHtml( html );
				}

				removed = [];

				// Let's go for a walk.
				walkerRange = new CKEDITOR.dom.range( root );
				walkerRange.selectNodeContents( element );
				walker = new CKEDITOR.dom.walker( walkerRange ),
				walker.evaluator = evaluator;
				walker.lastForward();

				// If "start comments" were removed, then the range endOffset may need to be updated
				// because there's one less node (comment) before the end.
				if ( removed.length && range.startContainer.equals( range.endContainer ) ) {
					range.setEnd( range.endContainer, range.endOffset - 1 );
				}

				// Remove comments, which used to replace [ and ].
				while ( removed.length ) {
					removed.pop().remove();
				}

				return range;
			}
		} )(),

		/**
		 * Returns the HTML of an element with range markers reflecting given range.
		 *
		 * **Note**: Unlike {@link #getHtmlWithRanges}, this method keeps the DOM structure
		 * of the element untouched, e.g. it operates on detached clone.
		 *
		 * @method getWithHtml
		 * @param {CKEDITOR.dom.element} element An element, which `innerHTML` is to be returned.
		 * @param {CKEDITOR.dom.range} range A range corresponding with `element` to be marked in the output HTML.
		 * @returns {String} HTML containing range markers.
		 * @see #setWithHtml
		 */
		getWithHtml: ( function() {
			// Injects a comment according to the given marker type, node and offset.
			// Text nodes are split if necessary to put a comment at desired position.
			function injectComment( marker, node, offset ) {
				var comment = new CKEDITOR.dom.comment( 'cke-range-marker-' + marker );

				if ( marker == '{' || marker == '}' ) {
					comment.insertBefore( node.split( offset ) );
				} else {
					var child = node.getChild( offset );

					if ( child ) {
						comment.insertBefore( child );
					} else {
						comment.appendTo( node );
					}
				}

				return comment;
			}

			function relativeAddress( element, level ) {
				return element.getAddress().slice( level );
			}

			// Creates a deep clone of a node.
			function cloneNode( node ) {
				var clone;

				if ( node.type == CKEDITOR.NODE_TEXT ) {
					return new CKEDITOR.dom.text( node.getText() );
				} else {
					// Make sure ids are cloned (#12130).
					clone = node.clone( 0, 1 );
				}

				if ( clone.type == CKEDITOR.NODE_ELEMENT ) {
					var children = node.getChildren(),
						i = 0,
						child;

					while ( ( child = children.getItem( i++ ) ) ) {
						cloneNode( child ).appendTo( clone );
					}
				}

				return clone;
			}

			var html, clone,
				startMarker, endMarker,
				addressLength, startAddress, endAddress,
				startContainer, endContainer;

			return function( element, range ) {
				// No range, no marker to display.
				if ( !range ) {
					return element.getHtml();
				}

				// Get length of element address.
				addressLength = element.getAddress().length;

				// Obtain addresses of start/endContainers relative to the element.
				startAddress = relativeAddress( range.startContainer, addressLength );
				endAddress = relativeAddress( range.endContainer, addressLength );

				// Deep element clone. This way the original element will remain untouched.
				// Note: IE8 wouldn't make for a living on Kamino. It's a very bad cloner.
				//       It joins adjacent text nodes when using deep clone, which is pretty annoying.
				// Note: IE9-11 aren't any better. They lose empty text nodes between elements when cloning.
				// See 'test special #1' in tests.
				// Make sure ids are cloned (#12130).
				clone = CKEDITOR.env.ie ? cloneNode( element ) : element.clone( 1, 1 );

				startContainer = clone.getChild( startAddress );
				endContainer = clone.getChild( endAddress );

				// Determine marker characters for start and end containers.
				startMarker = startContainer.type == CKEDITOR.NODE_TEXT ? '{' : '[';
				endMarker = endContainer.type == CKEDITOR.NODE_TEXT ? '}' : ']';

				injectComment( endMarker, endContainer, range.endOffset );
				injectComment( startMarker, startContainer, range.startOffset );

				// Replace comments with corresponding range markers.
				return browserHtmlFix( clone.getHtml() ).replace( selectionMarkerComments, '$1' );
			};
		} )()
	};

	bender.tools.selection = {
		/**
		 * Sets HTML of the editor and returns a range, which reflects defined range markers.
		 *
		 * @param editor {CKEDITOR.editor} The editor instance.
		 * @param html {String}
		 * @returns {CKEDITOR.dom.selection}
		 * @see bender.tools.range#setWithHtml
		 * @see bender.tools.range#getWithHtml
		 */
		setWithHtml: function( editor, html ) {
			var editable = editor.editable(),
				listener;

			// Prevent from firing selectionChange for any reason (i.e. editor.focus())
			// until selection.selectRanges().
			listener = editor.on( 'selectionChange', function( evt ) {
				evt.cancel();
			}, null, null, -1000 );

			editable.focus();

			listener.removeListener();

			var range = bender.tools.range.setWithHtml( editable, html ),
				sel = editor.getSelection();

			if ( range ) {
				sel.selectRanges( [ range ] );
			}

			return sel;
		},

		/**
		 * Retrieve the data of the editor with selection ranges marked in the output.
		 *
		 * @param {CKEDITOR.editor} editor Editor instance.
		 * @returns {String} Editor data with selection range markers.
		 * @see bender.tools.range#setWithHtml
		 * @see bender.tools.range#getWithHtml
		 */
		getWithHtml: function( editor ) {
			var ranges = editor.getSelection().getRanges();

			if ( ranges.length > 1 ) {
				throw new Error( 'There are ' + ranges.length + ' ranges in editor\'s selection, while only one was expected.' );
			}

			return bender.tools.range.getWithHtml( editor.editable(), ranges[ 0 ] );
		},
	};

	bender.tools.html = {
		/**
		 * Compares `innerHTML`-like HTML strings. "Inner" indicates that this HTML has not been
		 * output by editor (has not been passed through {@link CKEDITOR.dataProcessor#toDataFormat}).
		 * Common unwelcomed assertion breakers like bogus `<br>`s, zero width spaces, unsorted attributes,
		 * not encoded `&nbsp;`s, etc. will be normalized by this function.
		 *
		 * Special characters:
		 *
		 * * `[`, `]`, `{`, `}`, `^` &ndash; will be treated like range/selection markers, so for a time when
		 * `actual` is processed by a parser they will be replaced by comments. Therefore these characters can't
		 * appear in attributes and other places where comments will be lost. Set `options.compareSelection` to `true`
		 * in order to enable selection markers special handling.
		 * * `@` &ndash; will be treated like a possible bogus `<br>` marker. "Possible" means that
		 * assertion will pass regardless of whether bogus `<br>` is found or not in the `actual`.
		 *
		 * @param {String} expected
		 * @param {String} actual
		 * @param {Object} [options]
		 * @param {Boolean} [options.sortAttributes=true] {@link bender.tools#compatHtml}'s option.
		 * @param {Boolean} [options.fixZWS=true] {@link bender.tools#compatHtml}'s option.
		 * @param {Boolean} [options.fixNbsp=true] {@link bender.tools#compatHtml}'s option.
		 * @param {Boolean} [options.noInterWS=false] {@link bender.tools#compatHtml}'s option.
		 * @param {Boolean} [options.fixStyles=false] {@link bender.tools#compatHtml}'s option.
		 * @param {Boolean} [options.noTempElements=false] {@link bender.tools#compatHtml}'s option.
		 * @param {Boolean} [options.compareSelection=false] If set to `true` selection markers in `expected` and
		 * `actual` will be handled in special way. This may conflict with these characters usage in attributes and
		 * other places where comments are not allowed.
		 * @param {Boolean} [options.normalizeSelection=true] Whether `{` and `}` should be treated like `[` and `]`
		 * Additionally, collapsed selection will be replaced with `^`. This options works only if `compareSelection`
		 * is set to `true`.
		 */
		compareInnerHtml: function( expected, actual, options ) {
			var htmlTools = bender.tools.html,
				pattern = htmlTools.prepareInnerHtmlPattern( expected );

			actual = htmlTools.prepareInnerHtmlForComparison( actual, options );

			return pattern.test( actual );
		},

		/**
		 * Prepares inner HTML for comparison with pattern generated by {@link #prepareInnerHtmlPattern}.
		 *
		 * See {@link #compareInnerHtml} for detailed documentation.
		 *
		 * @param {String} innerHtml
		 * @param {Object} [options] See {@link #compareInnerHtml}'s options.
		 * @returns {String} HTML prepared for comparison.
		 */
		prepareInnerHtmlForComparison: function( innerHtml, options ) {
			if ( !options ) {
				options = {};
			}

			var sortAttributes = ( 'sortAttributes' in options ) ? options.sortAttributes : true,
				fixZWS = ( 'fixZWS' in options ) ? options.fixZWS : true,
				fixNbsp = ( 'fixNbsp' in options ) ? options.fixNbsp : true;

			if ( options.compareSelection ) {
				innerHtml = innerHtml.replace( selectionMarkers, '<!--cke-range-marker-$1-->' );
			}

			innerHtml = bender.tools.compatHtml( innerHtml,
				options.noInterWS, sortAttributes, fixZWS, options.fixStyles, fixNbsp, options.noTempElements );

			if ( options.compareSelection ) {
				innerHtml = innerHtml.replace( selectionMarkerComments, '$1' );
				if ( options.normalizeSelection ) {
					innerHtml = innerHtml.replace( /\{/g, '[' ).replace( /\}/g, ']' ).replace( /\[\]/g, '^' );
				}
			}

			return innerHtml;
		},

		/**
		 * Prepares pattern for comparison with inner HTML prepared by {@link #prepareInnerHtmlForComparison}.
		 *
		 * See {@link #compareInnerHtml} for detailed documentation.
		 *
		 * @param {String} pattern
		 * @returns {RegExp} Pattern.
		 */
		prepareInnerHtmlPattern: function( pattern ) {
			pattern = bender.tools.escapeRegExp( pattern )
				.replace( /@/g, CKEDITOR.env.needsBrFiller ? '(<br />)?' : '(&nbsp;)?' );

			return new RegExp( '^' + pattern + '$' );
		}
	};

} )( bender );
