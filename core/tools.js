/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.tools} object that contains
 *		utility functions.
 */

( function() {
	var functions = [],
		cssVendorPrefix =
			CKEDITOR.env.gecko ? '-moz-' :
			CKEDITOR.env.webkit ? '-webkit-' :
			CKEDITOR.env.ie ? '-ms-' :
			'',
		ampRegex = /&/g,
		gtRegex = />/g,
		ltRegex = /</g,
		quoteRegex = /"/g,
		tokenCharset = 'abcdefghijklmnopqrstuvwxyz0123456789',
		TOKEN_COOKIE_NAME = 'ckCsrfToken',
		TOKEN_LENGTH = 40,

		allEscRegex = /&(lt|gt|amp|quot|nbsp|shy|#\d{1,5});/g,
		namedEntities = {
			lt: '<',
			gt: '>',
			amp: '&',
			quot: '"',
			nbsp: '\u00a0',
			shy: '\u00ad'
		},
		allEscDecode = function( match, code ) {
			if ( code[ 0 ] == '#' ) {
				return String.fromCharCode( parseInt( code.slice( 1 ), 10 ) );
			} else {
				return namedEntities[ code ];
			}
		};

	CKEDITOR.on( 'reset', function() {
		functions = [];
	} );

	/**
	 * Utility functions.
	 *
	 * @class
	 * @singleton
	 */
	CKEDITOR.tools = {
		/**
		 * Compares the elements of two arrays.
		 *
		 *		var a = [ 1, 'a', 3 ];
		 *		var b = [ 1, 3, 'a' ];
		 *		var c = [ 1, 'a', 3 ];
		 *		var d = [ 1, 'a', 3, 4 ];
		 *
		 *		alert( CKEDITOR.tools.arrayCompare( a, b ) );  // false
		 *		alert( CKEDITOR.tools.arrayCompare( a, c ) );  // true
		 *		alert( CKEDITOR.tools.arrayCompare( a, d ) );  // false
		 *
		 * @param {Array} arrayA An array to be compared.
		 * @param {Array} arrayB The other array to be compared.
		 * @returns {Boolean} `true` if the arrays have the same length and
		 * their elements match.
		 */
		arrayCompare: function( arrayA, arrayB ) {
			if ( !arrayA && !arrayB )
				return true;

			if ( !arrayA || !arrayB || arrayA.length != arrayB.length )
				return false;

			for ( var i = 0; i < arrayA.length; i++ ) {
				if ( arrayA[ i ] != arrayB[ i ] )
					return false;
			}

			return true;
		},

		/**
		 * Finds the index of the first element in an array for which the `compareFunction` returns `true`.
		 *
		 *		CKEDITOR.tools.getIndex( [ 1, 2, 4, 3, 5 ], function( el ) {
		 *			return el >= 3;
		 *		} ); // 2
		 *
		 * @since 4.5.0
		 * @param {Array} array Array to search in.
		 * @param {Function} compareFunction Compare function.
		 * @returns {Number} The index of the first matching element or `-1` if none matches.
		 */
		getIndex: function( arr, compareFunction ) {
			for ( var i = 0; i < arr.length; ++i ) {
				if ( compareFunction( arr[ i ] ) )
					return i;
			}
			return -1;
		},

		/**
		 * Creates a deep copy of an object.
		 *
		 * **Note**: Recursive references are not supported.
		 *
		 *		var obj = {
		 *			name: 'John',
		 *			cars: {
		 *				Mercedes: { color: 'blue' },
		 *				Porsche: { color: 'red' }
		 *			}
		 *		};
		 *		var clone = CKEDITOR.tools.clone( obj );
		 *		clone.name = 'Paul';
		 *		clone.cars.Porsche.color = 'silver';
		 *
		 *		alert( obj.name );					// 'John'
		 *		alert( clone.name );				// 'Paul'
		 *		alert( obj.cars.Porsche.color );	// 'red'
		 *		alert( clone.cars.Porsche.color );	// 'silver'
		 *
		 * @param {Object} object The object to be cloned.
		 * @returns {Object} The object clone.
		 */
		clone: function( obj ) {
			var clone;

			// Array.
			if ( obj && ( obj instanceof Array ) ) {
				clone = [];

				for ( var i = 0; i < obj.length; i++ )
					clone[ i ] = CKEDITOR.tools.clone( obj[ i ] );

				return clone;
			}

			// "Static" types.
			if ( obj === null || ( typeof obj != 'object' ) || ( obj instanceof String ) || ( obj instanceof Number ) || ( obj instanceof Boolean ) || ( obj instanceof Date ) || ( obj instanceof RegExp ) )
				return obj;

			// DOM objects and window.
			if ( obj.nodeType || obj.window === obj )
				return obj;

			// Objects.
			clone = new obj.constructor();

			for ( var propertyName in obj ) {
				var property = obj[ propertyName ];
				clone[ propertyName ] = CKEDITOR.tools.clone( property );
			}

			return clone;
		},

		/**
		 * Turns the first letter of a string to upper-case.
		 *
		 * @param {String} str
		 * @param {Boolean} [keepCase] Keep the case of 2nd to last letter.
		 * @returns {String}
		 */
		capitalize: function( str, keepCase ) {
			return str.charAt( 0 ).toUpperCase() + ( keepCase ? str.slice( 1 ) : str.slice( 1 ).toLowerCase() );
		},

		/**
		 * Copies the properties from one object to another. By default, properties
		 * already present in the target object **are not** overwritten.
		 *
		 *		// Create the sample object.
		 *		var myObject = {
		 *			prop1: true
		 *		};
		 *
		 *		// Extend the above object with two properties.
		 *		CKEDITOR.tools.extend( myObject, {
		 *			prop2: true,
		 *			prop3: true
		 *		} );
		 *
		 *		// Alert 'prop1', 'prop2' and 'prop3'.
		 *		for ( var p in myObject )
		 *			alert( p );
		 *
		 * @param {Object} target The object to be extended.
		 * @param {Object...} source The object(s) from properties will be
		 * copied. Any number of objects can be passed to this function.
		 * @param {Boolean} [overwrite] If `true` is specified, it indicates that
		 * properties already present in the target object could be
		 * overwritten by subsequent objects.
		 * @param {Object} [properties] Only properties within the specified names
		 * list will be received from the source object.
		 * @returns {Object} The extended object (target).
		 */
		extend: function( target ) {
			var argsLength = arguments.length,
				overwrite, propertiesList;

			if ( typeof ( overwrite = arguments[ argsLength - 1 ] ) == 'boolean' )
				argsLength--;
			else if ( typeof ( overwrite = arguments[ argsLength - 2 ] ) == 'boolean' ) {
				propertiesList = arguments[ argsLength - 1 ];
				argsLength -= 2;
			}

			for ( var i = 1; i < argsLength; i++ ) {
				var source = arguments[ i ] || {};

				CKEDITOR.tools.array.forEach( CKEDITOR.tools.object.keys( source ), function( propertyName ) {
					// Only copy existed fields if in overwrite mode.
					if ( overwrite === true || target[ propertyName ] == null ) {
						// Only copy specified fields if list is provided.
						if ( !propertiesList || ( propertyName in propertiesList ) )
							target[ propertyName ] = source[ propertyName ];
					}

				} );
			}

			return target;
		},

		/**
		 * Creates an object which is an instance of a class whose prototype is a
		 * predefined object. All properties defined in the source object are
		 * automatically inherited by the resulting object, including future
		 * changes to it.
		 *
		 * @param {Object} source The source object to be used as the prototype for
		 * the final object.
		 * @returns {Object} The resulting copy.
		 */
		prototypedCopy: function( source ) {
			var copy = function() {};
			copy.prototype = source;
			return new copy();
		},

		/**
		 * Makes fast (shallow) copy of an object.
		 * This method is faster than {@link #clone} which does
		 * a deep copy of an object (including arrays).
		 *
		 * @since 4.1.0
		 * @param {Object} source The object to be copied.
		 * @returns {Object} Copy of `source`.
		 */
		copy: function( source ) {
			var obj = {},
				name;

			for ( name in source )
				obj[ name ] = source[ name ];

			return obj;
		},

		/**
		 * Checks if an object is an Array.
		 *
		 *		alert( CKEDITOR.tools.isArray( [] ) );		// true
		 *		alert( CKEDITOR.tools.isArray( 'Test' ) );	// false
		 *
		 * @param {Object} object The object to be checked.
		 * @returns {Boolean} `true` if the object is an Array, otherwise `false`.
		 */
		isArray: function( object ) {
			return Object.prototype.toString.call( object ) == '[object Array]';
		},

		/**
		 * Whether the object contains no properties of its own.
		 *
		 * @param object
		 * @returns {Boolean}
		 */
		isEmpty: function( object ) {
			for ( var i in object ) {
				if ( object.hasOwnProperty( i ) )
					return false;
			}
			return true;
		},

		/**
		 * Generates an object or a string containing vendor-specific and vendor-free CSS properties.
		 *
		 *		CKEDITOR.tools.cssVendorPrefix( 'border-radius', '0', true );
		 *		// On Firefox: '-moz-border-radius:0;border-radius:0'
		 *		// On Chrome: '-webkit-border-radius:0;border-radius:0'
		 *
		 * @param {String} property The CSS property name.
		 * @param {String} value The CSS value.
		 * @param {Boolean} [asString=false] If `true`, then the returned value will be a CSS string.
		 * @returns {Object/String} The object containing CSS properties or its stringified version.
		 */
		cssVendorPrefix: function( property, value, asString ) {
			if ( asString )
				return cssVendorPrefix + property + ':' + value + ';' + property + ':' + value;

			var ret = {};
			ret[ property ] = value;
			ret[ cssVendorPrefix + property ] = value;

			return ret;
		},

		/**
		 * Transforms a CSS property name to its relative DOM style name.
		 *
		 *		alert( CKEDITOR.tools.cssStyleToDomStyle( 'background-color' ) );	// 'backgroundColor'
		 *		alert( CKEDITOR.tools.cssStyleToDomStyle( 'float' ) );				// 'cssFloat'
		 *
		 * @method
		 * @param {String} cssName The CSS property name.
		 * @returns {String} The transformed name.
		 */
		cssStyleToDomStyle: ( function() {
			var test = document.createElement( 'div' ).style;

			var cssFloat = ( typeof test.cssFloat != 'undefined' ) ? 'cssFloat' : ( typeof test.styleFloat != 'undefined' ) ? 'styleFloat' : 'float';

			return function( cssName ) {
				if ( cssName == 'float' )
					return cssFloat;
				else {
					return cssName.replace( /-./g, function( match ) {
						return match.substr( 1 ).toUpperCase();
					} );
				}
			};
		} )(),

		/**
		 * Builds a HTML snippet from a set of `<style>/<link>`.
		 *
		 * @param {String/Array} css Each of which are URLs (absolute) of a CSS file or
		 * a trunk of style text.
		 * @returns {String}
		 */
		buildStyleHtml: function( css ) {
			css = [].concat( css );
			var item,
				retval = [];
			for ( var i = 0; i < css.length; i++ ) {
				if ( ( item = css[ i ] ) ) {
					// Is CSS style text ?
					if ( /@import|[{}]/.test( item ) )
						retval.push( '<style>' + item + '</style>' );
					else
						retval.push( '<link type="text/css" rel=stylesheet href="' + item + '">' );
				}
			}
			return retval.join( '' );
		},

		/**
		 * Replaces special HTML characters in a string with their relative HTML
		 * entity values.
		 *
		 *		alert( CKEDITOR.tools.htmlEncode( 'A > B & C < D' ) ); // 'A &gt; B &amp; C &lt; D'
		 *
		 * @param {String} text The string to be encoded.
		 * @returns {String} The encoded string.
		 */
		htmlEncode: function( text ) {
			// Backwards compatibility - accept also non-string values (casting is done below).
			// Since 4.4.8 we return empty string for null and undefined because these values make no sense.
			if ( text === undefined || text === null ) {
				return '';
			}

			return String( text ).replace( ampRegex, '&amp;' ).replace( gtRegex, '&gt;' ).replace( ltRegex, '&lt;' );
		},

		/**
		 * Decodes HTML entities that browsers tend to encode when used in text nodes.
		 *
		 *		alert( CKEDITOR.tools.htmlDecode( '&lt;a &amp; b &gt;' ) ); // '<a & b >'
		 *
		 * Read more about chosen entities in the [research](https://dev.ckeditor.com/ticket/13105#comment:8).
		 *
		 * @param {String} The string to be decoded.
		 * @returns {String} The decoded string.
		 */
		htmlDecode: function( text ) {
			// See:
			// * https://dev.ckeditor.com/ticket/13105#comment:8 and comment:9,
			// * http://jsperf.com/wth-is-going-on-with-jsperf JSPerf has some serious problems, but you can observe
			// that combined regexp tends to be quicker (except on V8). It will also not be prone to fail on '&amp;lt;'
			// (see https://dev.ckeditor.com/ticket/13105#DXWTF:CKEDITOR.tools.htmlEnDecodeAttr).
			return text.replace( allEscRegex, allEscDecode );
		},

		/**
		 * Replaces special HTML characters in HTMLElement attribute with their relative HTML entity values.
		 *
		 *		alert( CKEDITOR.tools.htmlEncodeAttr( '<a " b >' ) ); // '&lt;a &quot; b &gt;'
		 *
		 * @param {String} The attribute value to be encoded.
		 * @returns {String} The encoded value.
		 */
		htmlEncodeAttr: function( text ) {
			return CKEDITOR.tools.htmlEncode( text ).replace( quoteRegex, '&quot;' );
		},

		/**
		 * Decodes HTML entities that browsers tend to encode when used in attributes.
		 *
		 *		alert( CKEDITOR.tools.htmlDecodeAttr( '&lt;a &quot; b&gt;' ) ); // '<a " b>'
		 *
		 * Since CKEditor 4.5.0 this method simply executes {@link #htmlDecode} which covers
		 * all necessary entities.
		 *
		 * @param {String} text The text to be decoded.
		 * @returns {String} The decoded text.
		 */
		htmlDecodeAttr: function( text ) {
			return CKEDITOR.tools.htmlDecode( text );
		},

		/**
		 * Transforms text to valid HTML: creates paragraphs, replaces tabs with non-breaking spaces etc.
		 *
		 * @since 4.5.0
		 * @param {String} text Text to transform.
		 * @param {Number} enterMode Editor {@link CKEDITOR.config#enterMode Enter mode}.
		 * @returns {String} HTML generated from the text.
		 */
		transformPlainTextToHtml: function( text, enterMode ) {
			var isEnterBrMode = enterMode == CKEDITOR.ENTER_BR,
				// CRLF -> LF
				html = this.htmlEncode( text.replace( /\r\n/g, '\n' ) );

			// Tab -> &nbsp x 4;
			html = html.replace( /\t/g, '&nbsp;&nbsp; &nbsp;' );

			var paragraphTag = enterMode == CKEDITOR.ENTER_P ? 'p' : 'div';

			// Two line-breaks create one paragraphing block.
			if ( !isEnterBrMode ) {
				var duoLF = /\n{2}/g;
				if ( duoLF.test( html ) ) {
					var openTag = '<' + paragraphTag + '>', endTag = '</' + paragraphTag + '>';
					html = openTag + html.replace( duoLF, function() {
						return endTag + openTag;
					} ) + endTag;
				}
			}

			// One <br> per line-break.
			html = html.replace( /\n/g, '<br>' );

			// Compensate padding <br> at the end of block, avoid loosing them during insertion.
			if ( !isEnterBrMode ) {
				html = html.replace( new RegExp( '<br>(?=</' + paragraphTag + '>)' ), function( match ) {
					return CKEDITOR.tools.repeat( match, 2 );
				} );
			}

			// Preserve spaces at the ends, so they won't be lost after insertion (merged with adjacent ones).
			html = html.replace( /^ | $/g, '&nbsp;' );

			// Finally, preserve whitespaces that are to be lost.
			html = html.replace( /(>|\s) /g, function( match, before ) {
				return before + '&nbsp;';
			} ).replace( / (?=<)/g, '&nbsp;' );

			return html;
		},

		/**
		 * Gets a unique number for this CKEDITOR execution session. It returns
		 * consecutive numbers starting from 1.
		 *
		 *		alert( CKEDITOR.tools.getNextNumber() ); // (e.g.) 1
		 *		alert( CKEDITOR.tools.getNextNumber() ); // 2
		 *
		 * @method
		 * @returns {Number} A unique number.
		 */
		getNextNumber: ( function() {
			var last = 0;
			return function() {
				return ++last;
			};
		} )(),

		/**
		 * Gets a unique ID for CKEditor interface elements. It returns a
		 * string with the "cke_" prefix and a consecutive number.
		 *
		 *		alert( CKEDITOR.tools.getNextId() ); // (e.g.) 'cke_1'
		 *		alert( CKEDITOR.tools.getNextId() ); // 'cke_2'
		 *
		 * @returns {String} A unique ID.
		 */
		getNextId: function() {
			return 'cke_' + this.getNextNumber();
		},

		/**
		 * Gets a universally unique ID. It returns a random string
		 * compliant with ISO/IEC 11578:1996, without dashes, with the "e" prefix to
		 * make sure that the ID does not start with a number.
		 *
		 * @returns {String} A global unique ID.
		 */
		getUniqueId: function() {
			var uuid = 'e'; // Make sure that id does not start with number.
			for ( var i = 0; i < 8; i++ ) {
				uuid += Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 ).substring( 1 );
			}
			return uuid;
		},

		/**
		 * Creates a function override.
		 *
		 *		var obj = {
		 *			myFunction: function( name ) {
		 *				alert( 'Name: ' + name );
		 *			}
		 *		};
		 *
		 *		obj.myFunction = CKEDITOR.tools.override( obj.myFunction, function( myFunctionOriginal ) {
		 *			return function( name ) {
		 *				alert( 'Overriden name: ' + name );
		 *				myFunctionOriginal.call( this, name );
		 *			};
		 *		} );
		 *
		 * @param {Function} originalFunction The function to be overridden.
		 * @param {Function} functionBuilder A function that returns the new
		 * function. The original function reference will be passed to this function.
		 * @returns {Function} The new function.
		 */
		override: function( originalFunction, functionBuilder ) {
			var newFn = functionBuilder( originalFunction );
			newFn.prototype = originalFunction.prototype;
			return newFn;
		},

		/**
		 * Executes a function after a specified delay.
		 *
		 *		CKEDITOR.tools.setTimeout( function() {
		 *			alert( 'Executed after 2 seconds' );
		 *		}, 2000 );
		 *
		 * @param {Function} func The function to be executed.
		 * @param {Number} [milliseconds=0] The amount of time (in milliseconds) to wait
		 * to fire the function execution.
		 * @param {Object} [scope=window] The object to store the function execution scope
		 * (the `this` object).
		 * @param {Object/Array} [args] A single object, or an array of objects, to
		 * pass as argument to the function.
		 * @param {Object} [ownerWindow=window] The window that will be used to set the
		 * timeout.
		 * @returns {Object} A value that can be used to cancel the function execution.
		 */
		setTimeout: function( func, milliseconds, scope, args, ownerWindow ) {
			if ( !ownerWindow )
				ownerWindow = window;

			if ( !scope )
				scope = ownerWindow;

			return ownerWindow.setTimeout( function() {
				if ( args )
					func.apply( scope, [].concat( args ) );
				else
					func.apply( scope );
			}, milliseconds || 0 );
		},

		/**
		 * Creates a {@link CKEDITOR.tools.buffers.throttle throttle buffer} instance.
		 *
		 * See the {@link CKEDITOR.tools.buffers.throttle#method-input input method's} documentation for example listings.
		 *
		 * @since 4.10.0
		 * @inheritdoc CKEDITOR.tools.buffers.throttle#method-constructor
		 * @returns {CKEDITOR.tools.buffers.throttle}
		 */
		throttle: function( minInterval, output, contextObj ) {
			return new this.buffers.throttle( minInterval, output, contextObj );
		},

		/**
		 * Removes spaces from the start and the end of a string. The following
		 * characters are removed: space, tab, line break, line feed.
		 *
		 *		alert( CKEDITOR.tools.trim( '  example ' ); // 'example'
		 *
		 * @method
		 * @param {String} str The text from which the spaces will be removed.
		 * @returns {String} The modified string without the boundary spaces.
		 */
		trim: ( function() {
			// We are not using \s because we don't want "non-breaking spaces" to be caught.
			var trimRegex = /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;
			return function( str ) {
				return str.replace( trimRegex, '' );
			};
		} )(),

		/**
		 * Removes spaces from the start (left) of a string. The following
		 * characters are removed: space, tab, line break, line feed.
		 *
		 *		alert( CKEDITOR.tools.ltrim( '  example ' ); // 'example '
		 *
		 * @method
		 * @param {String} str The text from which the spaces will be removed.
		 * @returns {String} The modified string excluding the removed spaces.
		 */
		ltrim: ( function() {
			// We are not using \s because we don't want "non-breaking spaces" to be caught.
			var trimRegex = /^[ \t\n\r]+/g;
			return function( str ) {
				return str.replace( trimRegex, '' );
			};
		} )(),

		/**
		 * Removes spaces from the end (right) of a string. The following
		 * characters are removed: space, tab, line break, line feed.
		 *
		 *		alert( CKEDITOR.tools.ltrim( '  example ' ); // '  example'
		 *
		 * @method
		 * @param {String} str The text from which spaces will be removed.
		 * @returns {String} The modified string excluding the removed spaces.
		 */
		rtrim: ( function() {
			// We are not using \s because we don't want "non-breaking spaces" to be caught.
			var trimRegex = /[ \t\n\r]+$/g;
			return function( str ) {
				return str.replace( trimRegex, '' );
			};
		} )(),

		/**
		 * Returns the index of an element in an array.
		 *
		 *		var letters = [ 'a', 'b', 0, 'c', false ];
		 *		alert( CKEDITOR.tools.indexOf( letters, '0' ) );		// -1 because 0 !== '0'
		 *		alert( CKEDITOR.tools.indexOf( letters, false ) );		// 4 because 0 !== false
		 *
		 * @param {Array} array The array to be searched.
		 * @param {Object/Function} value The element to be found. This can be an
		 * evaluation function which receives a single parameter call for
		 * each entry in the array, returning `true` if the entry matches.
		 * @returns {Number} The (zero-based) index of the first entry that matches
		 * the entry, or `-1` if not found.
		 */
		indexOf: function( array, value ) {
			if ( typeof value == 'function' ) {
				for ( var i = 0, len = array.length; i < len; i++ ) {
					if ( value( array[ i ] ) )
						return i;
				}
			} else if ( array.indexOf )
				return array.indexOf( value );
			else {
				for ( i = 0, len = array.length; i < len; i++ ) {
					if ( array[ i ] === value )
						return i;
				}
			}
			return -1;
		},

		/**
		 * Returns the index of an element in an array.
		 *
		 *		var obj = { prop: true };
		 *		var letters = [ 'a', 'b', 0, obj, false ];
		 *
		 *		alert( CKEDITOR.tools.indexOf( letters, '0' ) ); // null
		 *		alert( CKEDITOR.tools.indexOf( letters, function( value ) {
		 *			// Return true when passed value has property 'prop'.
		 *			return value && 'prop' in value;
		 *		} ) );											// obj
		 *
		 * @param {Array} array The array to be searched.
		 * @param {Object/Function} value The element to be found. Can be an
		 * evaluation function which receives a single parameter call for
		 * each entry in the array, returning `true` if the entry matches.
		 * @returns Object The value that was found in an array.
		 */
		search: function( array, value ) {
			var index = CKEDITOR.tools.indexOf( array, value );
			return index >= 0 ? array[ index ] : null;
		},

		/**
		 * Creates a function that will always execute in the context of a
		 * specified object.
		 *
		 * ```js
		 * var obj = { text: 'My Object' };
		 *
		 * function alertText() {
		 * 	alert( this.text );
		 * }
		 *
		 * var newFunc = CKEDITOR.tools.bind( alertText, obj );
		 * newFunc(); // Alerts 'My Object'.
		 * ```
		 *
		 * Since 4.13.0 additional arguments can be bound to a function.
		 *
		 * ```js
		 * function logData( text, number1, number2 ) {
		 * 	console.log( text, number1, number2 );
		 * }
		 *
		 * var newFunc = CKEDITOR.tools.bind( logData, null, 'Foo', 1 );
		 * newFunc(); // Logs: 'Foo', 1, undefined.
		 * newFunc( 2 ); // Logs: 'Foo', 1, 2.
		 *
		 * ```
		 *
		 * @param {Function} func The function to be executed.
		 * @param {Object} obj The object to which the execution context will be bound.
		 * @param {*} [args] Arguments provided to the bound function when invoking the target function. Available since 4.13.0.
		 * @returns {Function} The function that can be used to execute the
		 * `func` function in the context of the specified `obj` object.
		 */
		bind: function( func, obj ) {
			var args = Array.prototype.slice.call( arguments, 2 );
			return function() {
				return func.apply( obj, args.concat( Array.prototype.slice.call( arguments ) ) );
			};
		},

		/**
		 * Class creation based on prototype inheritance which supports the
		 * following features:
		 *
		 * * Static fields
		 * * Private fields
		 * * Public (prototype) fields
		 * * Chainable base class constructor
		 *
		 * @param {Object} definition The class definition object.
		 * @returns {Function} A class-like JavaScript function.
		 */
		createClass: function( definition ) {
			var $ = definition.$,
				baseClass = definition.base,
				privates = definition.privates || definition._,
				proto = definition.proto,
				statics = definition.statics;

			// Create the constructor, if not present in the definition.
			!$ && ( $ = function() {
				baseClass && this.base.apply( this, arguments );
			} );

			if ( privates ) {
				var originalConstructor = $;
				$ = function() {
					// Create (and get) the private namespace.
					var _ = this._ || ( this._ = {} );

					// Make some magic so "this" will refer to the main
					// instance when coding private functions.
					for ( var privateName in privates ) {
						var priv = privates[ privateName ];

						_[ privateName ] = ( typeof priv == 'function' ) ? CKEDITOR.tools.bind( priv, this ) : priv;
					}

					originalConstructor.apply( this, arguments );
				};
			}

			if ( baseClass ) {
				$.prototype = this.prototypedCopy( baseClass.prototype );
				$.prototype.constructor = $;
				// Super references.
				$.base = baseClass;
				$.baseProto = baseClass.prototype;
				// Super constructor.
				$.prototype.base = function baseClassConstructor() {
					this.base = baseClass.prototype.base;
					baseClass.apply( this, arguments );
					this.base = baseClassConstructor;
				};
			}

			if ( proto )
				this.extend( $.prototype, proto, true );

			if ( statics )
				this.extend( $, statics, true );

			return $;
		},

		/**
		 * Creates a function reference that can be called later using
		 * {@link #callFunction}. This approach is especially useful to
		 * make DOM attribute function calls to JavaScript-defined functions.
		 *
		 *		var ref = CKEDITOR.tools.addFunction( function() {
		 *			alert( 'Hello!');
		 *		} );
		 *		CKEDITOR.tools.callFunction( ref ); // 'Hello!'
		 *
		 * @param {Function} fn The function to be executed on call.
		 * @param {Object} [scope] The object to have the context on `fn` execution.
		 * @returns {Number} A unique reference to be used in conjuction with
		 * {@link #callFunction}.
		 */
		addFunction: function( fn, scope ) {
			return functions.push( function() {
				return fn.apply( scope || this, arguments );
			} ) - 1;
		},

		/**
		 * Removes the function reference created with {@link #addFunction}.
		 *
		 * @param {Number} ref The function reference created with
		 * {@link #addFunction}.
		 */
		removeFunction: function( ref ) {
			functions[ ref ] = null;
		},

		/**
		 * Executes a function based on the reference created with {@link #addFunction}.
		 *
		 *		var ref = CKEDITOR.tools.addFunction( function() {
		 *			alert( 'Hello!');
		 *		} );
		 *		CKEDITOR.tools.callFunction( ref ); // 'Hello!'
		 *
		 * @param {Number} ref The function reference created with {@link #addFunction}.
		 * @param {Mixed} params Any number of parameters to be passed to the executed function.
		 * @returns {Mixed} The return value of the function.
		 */
		callFunction: function( ref ) {
			var fn = functions[ ref ];
			return fn && fn.apply( window, Array.prototype.slice.call( arguments, 1 ) );
		},

		/**
		 * Appends the `px` length unit to the size value if it is missing.
		 *
		 *		var cssLength = CKEDITOR.tools.cssLength;
		 *		cssLength( 42 );		// '42px'
		 *		cssLength( '42' );		// '42px'
		 *		cssLength( '42px' );	// '42px'
		 *		cssLength( '42%' );		// '42%'
		 *		cssLength( 'bold' );	// 'bold'
		 *		cssLength( false );		// ''
		 *		cssLength( NaN );		// ''
		 *
		 * @method
		 * @param {Number/String/Boolean} length
		 */
		cssLength: ( function() {
			var pixelRegex = /^-?\d+\.?\d*px$/,
				lengthTrimmed;

			return function( length ) {
				lengthTrimmed = CKEDITOR.tools.trim( length + '' ) + 'px';

				if ( pixelRegex.test( lengthTrimmed ) )
					return lengthTrimmed;
				else
					return length || '';
			};
		} )(),

		/**
		 * Converts the specified CSS length value to the calculated pixel length inside this page.
		 *
		 * Since 4.11.0 it also returns negative values.
		 *
		 * **Note:** Percentage-based value is left intact.
		 *
		 * @method
		 * @param {String} cssLength CSS length value.
		 * @returns {Number/String} A number representing the length in pixels or a string with a percentage value.
		 */
		convertToPx: ( function() {
			var calculator;

			return function( cssLength ) {
				if ( !calculator ) {
					calculator = CKEDITOR.dom.element.createFromHtml( '<div style="position:absolute;left:-9999px;' +
						'top:-9999px;margin:0px;padding:0px;border:0px;"' +
						'></div>', CKEDITOR.document );
					CKEDITOR.document.getBody().append( calculator );
				}

				if ( !( /%$/ ).test( cssLength ) ) {
					var isNegative = parseFloat( cssLength ) < 0,
						ret;

					if ( isNegative ) {
						cssLength = cssLength.replace( '-', '' );
					}

					calculator.setStyle( 'width', cssLength );
					ret = calculator.$.clientWidth;

					if ( isNegative ) {
						return -ret;
					}
					return ret;
				}

				return cssLength;
			};
		} )(),

		/**
		 * String specified by `str` repeats `times` times.
		 *
		 * @param {String} str
		 * @param {Number} times
		 * @returns {String}
		 */
		repeat: function( str, times ) {
			return new Array( times + 1 ).join( str );
		},

		/**
		 * Returns the first successfully executed return value of a function that
		 * does not throw any exception.
		 *
		 * @param {Function...} fn
		 * @returns {Mixed}
		 */
		tryThese: function() {
			var returnValue;
			for ( var i = 0, length = arguments.length; i < length; i++ ) {
				var lambda = arguments[ i ];
				try {
					returnValue = lambda();
					break;
				} catch ( e ) {}
			}
			return returnValue;
		},

		/**
		 * Generates a combined key from a series of params.
		 *
		 *		var key = CKEDITOR.tools.genKey( 'key1', 'key2', 'key3' );
		 *		alert( key ); // 'key1-key2-key3'.
		 *
		 * @param {String} subKey One or more strings used as subkeys.
		 * @returns {String}
		 */
		genKey: function() {
			return Array.prototype.slice.call( arguments ).join( '-' );
		},

		/**
		 * Creates a "deferred" function which will not run immediately,
		 * but rather runs as soon as the interpreter’s call stack is empty.
		 * Behaves much like `window.setTimeout` with a delay.
		 *
		 * **Note:** The return value of the original function will be lost.
		 *
		 * @param {Function} fn The callee function.
		 * @returns {Function} The new deferred function.
		 */
		defer: function( fn ) {
			return function() {
				var args = arguments,
					self = this;
				window.setTimeout( function() {
					fn.apply( self, args );
				}, 0 );
			};
		},

		/**
		 * Normalizes CSS data in order to avoid differences in the style attribute.
		 *
		 * @param {String} styleText The style data to be normalized.
		 * @param {Boolean} [nativeNormalize=false] Parse the data using the browser.
		 * @returns {String} The normalized value.
		 */
		normalizeCssText: function( styleText, nativeNormalize ) {
			var props = [],
				name,
				parsedProps = CKEDITOR.tools.parseCssText( styleText, true, nativeNormalize );

			for ( name in parsedProps )
				props.push( name + ':' + parsedProps[ name ] );

			props.sort();

			return props.length ? ( props.join( ';' ) + ';' ) : '';
		},

		/**
		 * Finds and converts `rgb(x,x,x)` color definition into a given string to hexadecimal notation.
		 *
		 * **Note**: For handling RGB string only (not within text) it is recommended
		 * to use {@link CKEDITOR.tools.color} to create color instance and
		 * {@link CKEDITOR.tools.color#getHex} method to get its hexadecimal representation:
		 *
		 * ```javascript
		 * var color = new CKEDITOR.tools.color( 'rgb( 225, 225, 225 )' ); // Create color instance.
		 * console.log( color.getHex() ); // #FFFFFF
		 * ```
		 *
		 * @param {String} styleText The style data (or just a string containing RGB colors) to be converted.
		 * @returns {String} The style data with RGB colors converted to hexadecimal equivalents.
		 */
		convertRgbToHex: function( styleText ) {
			return styleText.replace( /(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi, function( match, red, green, blue ) {
				var color = [ red, green, blue ];
				// Add padding zeros if the hex value is less than 0x10.
				for ( var i = 0; i < 3; i++ )
					color[ i ] = ( '0' + parseInt( color[ i ], 10 ).toString( 16 ) ).slice( -2 );
				return '#' + color.join( '' );
			} );
		},

		/**
		 * Normalizes hexadecimal notation so that the color string is always 6 characters long and lowercase.
		 *
		 * **Note**: This method is deprecated, instead use {@link CKEDITOR.tools.color} to create color and
		 * {@link CKEDITOR.tools.color#getHex} method to get its hexadecimal representation. Since it returns
		 * uppercase string, use `toLowerCase()` to get lowercase representation:
		 *
		 * ```javascript
		 * var color = new CKEDITOR.tools.color( '#FFF' ); // Create color instance.
		 * console.log( color.getHex().toLowerCase() ); // #ffffff
		 * ```
		 *
		 * @deprecated 4.16.0
		 * @param {String} styleText The style data (or just a string containing hex colors) to be converted.
		 * @returns {String} The style data with hex colors normalized.
		 */
		normalizeHex: function( styleText ) {
			return styleText.replace( /#(([0-9a-f]{3}){1,2})($|;|\s+)/gi, function( match, hexColor, hexColorPart, separator ) {
				var normalizedHexColor = hexColor.toLowerCase();
				if ( normalizedHexColor.length == 3 ) {
					var parts = normalizedHexColor.split( '' );
					normalizedHexColor = [ parts[ 0 ], parts[ 0 ], parts[ 1 ], parts[ 1 ], parts[ 2 ], parts[ 2 ] ].join( '' );
				}
				return '#' + normalizedHexColor + separator;
			} );
		},

		/**
		 * Validates color string correctness. Works for:
		 *
		 * * hexadecimal notation,
		 * * RGB or RGBA notation,
		 * * HSL or HSLA notation,
		 * * HTML color name.
		 *
		 * **Note:** This method is deprecated, instead use use {@link CKEDITOR.tools.color}
		 * to create color class and check if passed color string is valid.
		 *
         * **Note:** This method is intended mostly for the input validations.
		 * It performs no logical check e.g.: are the values in RGB format correct
		 * or does the passed color name actually exists?

		 * See the examples below:
		 *
		 * ```javascript
		 * CKEDITOR.tools._isValidColorFormat( '123456' ); // true
		 * CKEDITOR.tools._isValidColorFormat( '#4A2' ); // true
		 * CKEDITOR.tools._isValidColorFormat( 'rgb( 40, 40, 150 )' ); // true
		 * CKEDITOR.tools._isValidColorFormat( 'hsla( 180, 50%, 50%, 0.2 )' ); // true
		 *
		 * CKEDITOR.tools._isValidColorFormat( '333333;' ); // false
		 * CKEDITOR.tools._isValidColorFormat( '<833AF2>' ); // false
		 *
		 * // But also:
		 * CKEDITOR.tools._isValidColorFormat( 'ckeditor' ); // true
		 * CKEDITOR.tools._isValidColorFormat( '1234' ); // true
		 * CKEDITOR.tools._isValidColorFormat( 'hsrgb( 100 )' ); // true
		 * ```
		 *
		 * @deprecated 4.16.0
		 * @since 4.15.1
		 * @private
		 * @param {String} colorCode String to be validated.
		 * @returns {Boolean} Whether the input string contains only allowed characters.
		 */
		_isValidColorFormat: function( colorCode ) {
			if ( !colorCode ) {
				return false;
			}

			colorCode = colorCode.replace( /\s+/g, '' );

			return /^[a-z0-9()#%,./]+$/i.test( colorCode );
		},

		/**
		 * Turns inline style text properties into one hash.
		 *
		 * @param {String} styleText The style data to be parsed.
		 * @param {Boolean} [normalize=false] Normalize properties and values
		 * (e.g. trim spaces, convert to lower case).
		 * @param {Boolean} [nativeNormalize=false] Parse the data using the browser.
		 * @returns {Object} The object containing parsed properties.
		 */
		parseCssText: function( styleText, normalize, nativeNormalize ) {
			var retval = {};

			if ( nativeNormalize ) {
				// Injects the style in a temporary span object, so the browser parses it,
				// retrieving its final format.
				var temp = new CKEDITOR.dom.element( 'span' );
				styleText = temp.setAttribute( 'style', styleText ).getAttribute( 'style' ) || '';
			}

			// Normalize colors.
			if ( styleText ) {
				styleText = CKEDITOR.tools.normalizeHex( CKEDITOR.tools.convertRgbToHex( styleText ) );
			}

			// IE will leave a single semicolon when failed to parse the style text. (https://dev.ckeditor.com/ticket/3891)
			if ( !styleText || styleText == ';' )
				return retval;

			styleText.replace( /&quot;/g, '"' ).replace( /\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function( match, name, value ) {
				if ( normalize ) {
					name = name.toLowerCase();
					// Drop extra whitespacing from font-family.
					if ( name == 'font-family' )
						value = value.replace( /\s*,\s*/g, ',' );
					value = CKEDITOR.tools.trim( value );
				}

				retval[ name ] = value;
			} );
			return retval;
		},

		/**
		 * Serializes the `style name => value` hash to a style text.
		 *
		 *		var styleObj = CKEDITOR.tools.parseCssText( 'color: red; border: none' );
		 *		console.log( styleObj.color ); // -> 'red'
		 *		CKEDITOR.tools.writeCssText( styleObj ); // -> 'color:red; border:none'
		 *		CKEDITOR.tools.writeCssText( styleObj, true ); // -> 'border:none; color:red'
		 *
		 * @since 4.1.0
		 * @param {Object} styles The object contaning style properties.
		 * @param {Boolean} [sort] Whether to sort CSS properties.
		 * @returns {String} The serialized style text.
		 */
		writeCssText: function( styles, sort ) {
			var name,
				stylesArr = [];

			for ( name in styles )
				stylesArr.push( name + ':' + styles[ name ] );

			if ( sort )
				stylesArr.sort();

			return stylesArr.join( '; ' );
		},

		/**
		 * Compares two objects.
		 *
		 * **Note:** This method performs shallow, non-strict comparison.
		 *
		 * @since 4.1.0
		 * @param {Object} left
		 * @param {Object} right
		 * @param {Boolean} [onlyLeft] Check only the properties that are present in the `left` object.
		 * @returns {Boolean} Whether objects are identical.
		 */
		objectCompare: function( left, right, onlyLeft ) {
			var name;

			if ( !left && !right )
				return true;
			if ( !left || !right )
				return false;

			for ( name in left ) {
				if ( left[ name ] != right[ name ] )
					return false;

			}

			if ( !onlyLeft ) {
				for ( name in right ) {
					if ( left[ name ] != right[ name ] )
						return false;
				}
			}

			return true;
		},

		/**
		 * @inheritdoc CKEDITOR.tools.object#keys
		 * @since 4.1.0
		 * @deprecated 4.12.0 Use {@link CKEDITOR.tools.object#keys} instead.
		 */
		objectKeys: function( obj ) {
			return CKEDITOR.tools.object.keys( obj );
		},

		/**
		 * Converts an array to an object by rewriting array items
		 * to object properties.
		 *
		 *		var arr = [ 'foo', 'bar', 'foo' ];
		 *		console.log( CKEDITOR.tools.convertArrayToObject( arr ) );
		 *		// -> { foo: true, bar: true }
		 *		console.log( CKEDITOR.tools.convertArrayToObject( arr, 1 ) );
		 *		// -> { foo: 1, bar: 1 }
		 *
		 * @since 4.1.0
		 * @param {Array} arr The array to be converted to an object.
		 * @param [fillWith=true] Set each property of an object to `fillWith` value.
		 */
		convertArrayToObject: function( arr, fillWith ) {
			var obj = {};

			if ( arguments.length == 1 )
				fillWith = true;

			for ( var i = 0, l = arr.length; i < l; ++i )
				obj[ arr[ i ] ] = fillWith;

			return obj;
		},

		/**
		 * Finds all span {@link CKEDITOR.dom.element elements} styled with the given property in the editor contents.
		 *
		 * @since 4.15.0
		 * @param {String} property CSS property which will be used in query.
		 * @param {CKEDITOR.dom.element} source The element to be searched.
		 * @returns {Array} Returns an array of {@link CKEDITOR.dom.element}s.
		 */
		getStyledSpans: function( property, source ) {
			var testProperty = CKEDITOR.env.ie && CKEDITOR.env.version == 8 ? property.toUpperCase() : property,
				spans = source.find( 'span[style*=' + testProperty + ']' ).toArray();

			// This is to filter out spans e.g. with background color when we want text color.
			return CKEDITOR.tools.array.filter( spans, function( span ) {
				return !!( span.getStyle( property ) );
			} );
		},

		/**
		 * Tries to fix the `document.domain` of the current document to match the
		 * parent window domain, avoiding "Same Origin" policy issues.
		 * This is an Internet Explorer only requirement.
		 *
		 * @since 4.1.2
		 * @returns {Boolean} `true` if the current domain is already good or if
		 * it has been fixed successfully.
		 */
		fixDomain: function() {
			var domain;

			while ( 1 ) {
				try {
					// Try to access the parent document. It throws
					// "access denied" if restricted by the "Same Origin" policy.
					domain = window.parent.document.domain;
					break;
				} catch ( e ) {
					// Calculate the value to set to document.domain.
					domain = domain ?

						// If it is not the first pass, strip one part of the
						// name. E.g.  "test.example.com"  => "example.com"
						domain.replace( /.+?(?:\.|$)/, '' ) :

						// In the first pass, we'll handle the
						// "document.domain = document.domain" case.
						document.domain;

					// Stop here if there is no more domain parts available.
					if ( !domain )
						break;

					document.domain = domain;
				}
			}

			return !!domain;
		},

		/**
		 * Creates an {@link CKEDITOR.tools.buffers.event events buffer} instance.
		 *
		 * See the {@link CKEDITOR.tools.buffers.event#method-input input method's} documentation for example code listings.
		 *
		 * @since 4.2.1
		 * @inheritdoc CKEDITOR.tools.buffers.event#method-constructor
		 * @returns {CKEDITOR.tools.buffers.event}
		 */
		eventsBuffer: function( minInterval, output, contextObj ) {
			return new this.buffers.event( minInterval, output, contextObj );
		},

		/**
		 * Enables HTML5 elements for older browsers (IE8) in the passed document.
		 *
		 * In IE8 this method can also be executed on a document fragment.
		 *
		 * **Note:** This method has to be used in the `<head>` section of the document.
		 *
		 * @since 4.3.0
		 * @param {Object} doc Native `Document` or `DocumentFragment` in which the elements will be enabled.
		 * @param {Boolean} [withAppend] Whether to append created elements to the `doc`.
		 */
		enableHtml5Elements: function( doc, withAppend ) {
			var els = 'abbr,article,aside,audio,bdi,canvas,data,datalist,details,figcaption,figure,footer,header,hgroup,main,mark,meter,nav,output,progress,section,summary,time,video'.split( ',' ),
				i = els.length,
				el;

			while ( i-- ) {
				el = doc.createElement( els[ i ] );
				if ( withAppend )
					doc.appendChild( el );
			}
		},

		/**
		 * Checks if any of the `arr` items match the provided regular expression.
		 *
		 * @param {Array} arr The array whose items will be checked.
		 * @param {RegExp} regexp The regular expression.
		 * @returns {Boolean} Returns `true` for the first occurrence of the search pattern.
		 * @since 4.4.0
		 */
		checkIfAnyArrayItemMatches: function( arr, regexp ) {
			for ( var i = 0, l = arr.length; i < l; ++i ) {
				if ( arr[ i ].match( regexp ) )
					return true;
			}
			return false;
		},

		/**
		 * Checks if any of the `obj` properties match the provided regular expression.
		 *
		 * @param obj The object whose properties will be checked.
		 * @param {RegExp} regexp The regular expression.
		 * @returns {Boolean} Returns `true` for the first occurrence of the search pattern.
		 * @since 4.4.0
		 */
		checkIfAnyObjectPropertyMatches: function( obj, regexp ) {
			for ( var i in obj ) {
				if ( i.match( regexp ) )
					return true;
			}
			return false;
		},

		/**
		 * Converts a keystroke to its string representation. Returns exactly the same
		 * members as {@link #keystrokeToArray}, but the returned object contains strings of
		 * keys joined with "+" rather than an array of keystrokes.
		 *
		 * ```javascript
		 * var lang = editor.lang.common.keyboard;
		 * var shortcut = CKEDITOR.tools.keystrokeToString( lang, CKEDITOR.CTRL + 88 );
		 * console.log( shortcut.display ); // 'Ctrl + X', on Mac '⌘ + X'.
		 * console.log( shortcut.aria ); // 'Ctrl + X', on Mac 'Cmd + X'.
		 * ```
		 *
		 * @since 4.6.0
		 * @param {Object} lang A language object with the key name translation.
		 * @param {Number} keystroke The keystroke to convert.
		 * @returns {Object} See {@link #keystrokeToArray}.
		 * @returns {String} return.display
		 * @returns {String} return.aria
		 */
		keystrokeToString: function( lang, keystroke ) {
			var ret = this.keystrokeToArray( lang, keystroke );

			ret.display = ret.display.join( '+' );
			ret.aria = ret.aria.join( '+' );

			return ret;
		},

		/**
		 * Converts a keystroke to its string representation.
		 *
		 * ```javascript
		 * var lang = editor.lang.common.keyboard;
		 * var shortcut = CKEDITOR.tools.keystrokeToArray( lang, CKEDITOR.CTRL + 88 );
		 * console.log( shortcut.display ); // [ 'CTRL', 'X' ], on Mac [ '⌘', 'X' ].
		 * console.log( shortcut.aria ); // [ 'CTRL', 'X' ], on Mac [ 'COMMAND', 'X' ].
		 * ```
		 *
		 * @since 4.8.0
		 * @param {Object} lang A language object with the key name translation.
		 * @param {Number} keystroke The keystroke to convert.
		 * @returns {Object}
		 * @returns {String[]} return.display An array of strings that should be used for visible labels.
		 * For Mac devices it uses `⌥` for <kbd>Alt</kbd>, `⇧` for <kbd>Shift</kbd> and `⌘` for <kbd>Command</kbd>.
		 * @returns {String[]} return.aria An array of strings that should be used for ARIA descriptions.
		 * It does not use special characters such as `⌥`, `⇧` or `⌘`.
		 */
		keystrokeToArray: function( lang, keystroke ) {
			var special = keystroke & 0xFF0000,
				key = keystroke & 0x00FFFF,
				isMac = CKEDITOR.env.mac,
				CTRL = 17,
				CMD = 224,
				ALT = 18,
				SHIFT = 16,
				display = [],
				aria = [];


			if ( special & CKEDITOR.CTRL ) {
				display.push( isMac ? '⌘' : lang[ CTRL ] );
				aria.push( isMac ? lang[ CMD ] : lang[ CTRL ] );
			}

			if ( special & CKEDITOR.ALT ) {
				display.push( isMac ? '⌥' : lang[ ALT ] );
				aria.push( lang[ ALT ] );
			}

			if ( special & CKEDITOR.SHIFT ) {
				display.push( isMac ? '⇧' : lang[ SHIFT ] );
				aria.push( lang[ SHIFT ] );
			}

			if ( key ) {
				if ( lang[ key ] ) {
					display.push( lang[ key ] );
					aria.push( lang[ key ] );
				} else {
					display.push( String.fromCharCode( key ) );
					aria.push( String.fromCharCode( key ) );
				}
			}

			return {
				display: display,
				aria: aria
			};
		},

		/**
		 * The data URI of a transparent image. May be used e.g. in HTML as an image source or in CSS in `url()`.
		 *
		 * @since 4.4.0
		 * @readonly
		 */
		transparentImageData: 'data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==',


		/**
		 * Returns the value of the cookie with a given name or `null` if the cookie is not found.
		 *
		 * @since 4.5.6
		 * @param {String} name
		 * @returns {String}
		 */
		getCookie: function( name ) {
			name = name.toLowerCase();
			var parts = document.cookie.split( ';' );
			var pair, key;

			for ( var i = 0; i < parts.length; i++ ) {
				pair = parts[ i ].split( '=' );
				key = decodeURIComponent( CKEDITOR.tools.trim( pair[ 0 ] ).toLowerCase() );

				if ( key === name ) {
					return decodeURIComponent( pair.length > 1 ? pair[ 1 ] : '' );
				}
			}

			return null;
		},

		/**
		 * Sets the value of the cookie with a given name.
		 *
		 * @since 4.5.6
		 * @param {String} name
		 * @param {String} value
		 */
		setCookie: function( name, value ) {
			document.cookie = encodeURIComponent( name ) + '=' + encodeURIComponent( value ) + ';path=/';
		},

		/**
		 * Returns the CSRF token value. The value is a hash stored in `document.cookie`
		 * under the `ckCsrfToken` key. The CSRF token can be used to secure the communication
		 * between the web browser and the server, i.e. for the file upload feature in the editor.
		 *
		 * @since 4.5.6
		 * @returns {String}
		 */
		getCsrfToken: function() {
			var token = CKEDITOR.tools.getCookie( TOKEN_COOKIE_NAME );

			if ( !token || token.length != TOKEN_LENGTH ) {
				token = generateToken( TOKEN_LENGTH );
				CKEDITOR.tools.setCookie( TOKEN_COOKIE_NAME, token );
			}

			return token;
		},

		/**
		 * Returns an escaped CSS selector. `CSS.escape()` is used if defined, leading digit is escaped otherwise.
		 *
		 * @since 4.5.10
		 * @param {String} selector A CSS selector to escape.
		 * @returns {String} An escaped selector.
		 */
		escapeCss: function( selector ) {
			// Invalid input.
			if ( !selector ) {
				return '';
			}

			// CSS.escape() can be used.
			if ( window.CSS && CSS.escape ) {
				return CSS.escape( selector );
			}

			// Simple leading digit escape.
			if ( !isNaN( parseInt( selector.charAt( 0 ), 10 ) ) ) {
				return '\\3' + selector.charAt( 0 ) + ' ' + selector.substring( 1, selector.length );
			}

			return selector;
		},

		/**
		 * Detects which mouse button generated a given DOM event.
		 *
		 * @since 4.7.3
		 * @param {CKEDITOR.dom.event/Event} evt DOM event. Since 4.11.3 a native `MouseEvent` instance can be passed.
		 * @returns {Number|Boolean} Returns a number indicating the mouse button or `false`
		 * if the mouse button cannot be determined.
		 */
		getMouseButton: function( evt ) {
			var domEvent = evt && evt.data ? evt.data.$ : evt;

			if ( !domEvent ) {
				return false;
			}

			return CKEDITOR.tools.normalizeMouseButton( domEvent.button );
		},

		/**
		 * Normalizes mouse buttons across browsers.
		 *
		 * Only Internet Explorer 8 and Internet Explorer 9 in Quirks Mode or Compatibility View
		 * have different button mappings than other browsers:
		 *
		 * ```
		 * +--------------+--------------------------+----------------+
		 * | Mouse button | IE 8 / IE 9 CM / IE 9 QM | Other browsers |
		 * +--------------+--------------------------+----------------+
		 * | Left         |             1            |        0       |
		 * +--------------+--------------------------+----------------+
		 * | Middle       |             4            |        1       |
		 * +--------------+--------------------------+----------------+
		 * | Right        |             2            |        2       |
		 * +--------------+--------------------------+----------------+
		 * ```
		 *
		 * The normalization is conducted only in browsers that use non-standard button mappings,
		 * returning the passed parameter in every other browser. Therefore values for IE < 9 are mapped
		 * to values used in the rest of the browsers. For example, the code below will return the following results in IE8:
		 *
		 * ```js
		 * console.log( CKEDITOR.tools.normalizeMouseButton( 1 ) ); // 0
		 * console.log( CKEDITOR.tools.normalizeMouseButton( 4 ) ); // 1
		 * console.log( CKEDITOR.tools.normalizeMouseButton( 2 ) ); // 2
		 * ```
		 *
		 * In other browsers it will simply return the passed values.
		 *
		 * With the `reversed` parameter set to `true`, values from the rest of the browsers
		 * are mapped to IE < 9 values in IE < 9 browsers. This means that IE8 will return the following results:
		 *
		 * ```js
		 * console.log( CKEDITOR.tools.normalizeMouseButton( 0, true ) ); // 1
		 * console.log( CKEDITOR.tools.normalizeMouseButton( 1, true ) ); // 4
		 * console.log( CKEDITOR.tools.normalizeMouseButton( 2, true ) ); // 2
		 * ```
		 *
		 * In other browsers it will simply return the passed values.
		 *
		 * @since 4.13.0
		 * @param {Number} button Mouse button identifier.
		 * @param {Boolean} [reverse=false] If set to `true`, the conversion is reversed: values
		 * returned by other browsers are converted to IE8 values.
		 * @returns {Number} Normalized mouse button identifier.
		 */
		normalizeMouseButton: function( button, reverse ) {
			if ( !CKEDITOR.env.ie || ( CKEDITOR.env.version >= 9 && !CKEDITOR.env.ie6Compat ) ) {
				return button;
			}

			var mappings = [
				[ CKEDITOR.MOUSE_BUTTON_LEFT, 1 ],
				[ CKEDITOR.MOUSE_BUTTON_MIDDLE, 4 ],
				[ CKEDITOR.MOUSE_BUTTON_RIGHT, 2 ]
			];

			for ( var i = 0; i < mappings.length; i++ ) {
				var mapping = mappings[ i ];

				if ( mapping[ 0 ] === button && reverse ) {
					return mapping[ 1 ];
				}

				if ( !reverse && mapping[ 1 ] === button ) {
					return mapping[ 0 ];
				}
			}
		},

		/**
		 * Converts a hex string to an array containing 1 byte in each cell. Bytes are represented as Integer numbers.
		 *
		 * @since 4.8.0
		 * @param {String} hexString Contains an input string which represents bytes, e.g. `"08A11D8ADA2B"`.
		 * @returns {Number[]} Bytes stored in a form of Integer numbers, e.g. `[ 8, 161, 29, 138, 218, 43 ]`.
		 */
		convertHexStringToBytes: function( hexString ) {
			var bytesArray = [],
				bytesArrayLength = hexString.length / 2,
				i;

			for ( i = 0; i < bytesArrayLength; i++ ) {
				bytesArray.push( parseInt( hexString.substr( i * 2, 2 ), 16 ) );
			}
			return bytesArray;
		},

		/**
		 * Converts a bytes array into a a Base64-encoded string.
		 *
		 * @since 4.8.0
		 * @param {Number[]} bytesArray An array that stores 1 byte in each cell as an Integer number.
		 * @returns {String} Base64-encoded string that represents input bytes.
		 */
		convertBytesToBase64: function( bytesArray ) {
			// Bytes are `8bit` numbers, where base64 use `6bit` to store data. That's why we process 3 Bytes into 4 characters representing base64.
			//
			// Algorithm:
			// 1. Take `3 * 8bit`.
			// 2. If there is less than 3 bytes, fill empty bits with zeros.
			// 3. Transform `3 * 8bit` into `4 * 6bit` numbers.
			// 4. Translate those numbers to proper characters related to base64.
			// 5. If extra zero bytes were added fill them with `=` sign.
			//
			// Example:
			// 1. Bytes Array: [ 8, 161, 29, 138, 218, 43 ] -> binary: `0000 1000 1010 0001 0001 1101 1000 1010 1101 1010 0010 1011`.
			// 2. Binary: `0000 10|00 1010| 0001 00|01 1101| 1000 10|10 1101| 1010 00|10 1011` ← `|` (pipe) shows where base64 will cut bits during transformation.
			// 3. Now we have 6bit numbers (written in decimal values), which are translated to indexes in `base64characters` array.
			//    Decimal: `2 10 4 29 34 45 40 43` → base64: `CKEditor`.
			var base64characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
				base64string = '',
				bytesArrayLength = bytesArray.length,
				i;

			for ( i = 0; i < bytesArrayLength; i += 3 ) {
				var array3 = bytesArray.slice( i, i + 3 ),
					array3length = array3.length,
					array4 = [],
					j;

				if ( array3length < 3 ) {
					for ( j = array3length; j < 3; j++ ) {
						array3[ j ] = 0;
					}
				}

				// 0xFC -> 11111100 || 0x03 -> 00000011 || 0x0F -> 00001111 || 0xC0 -> 11000000 || 0x3F -> 00111111
				array4[ 0 ] = ( array3[ 0 ] & 0xFC ) >> 2;
				array4[ 1 ] = ( ( array3[ 0 ] & 0x03 ) << 4 ) | ( array3[ 1 ] >> 4 );
				array4[ 2 ] = ( ( array3[ 1 ] & 0x0F ) << 2 ) | ( ( array3[ 2 ] & 0xC0 ) >> 6 );
				array4[ 3 ] = array3[ 2 ] & 0x3F;

				for ( j = 0; j < 4; j++ ) {
					// Example: if array3length == 1, then we need to add 2 equal signs at the end of base64.
					// array3[ 0 ] is used to calculate array4[ 0 ] and array4[ 1 ], so there will be regular values,
					// next two ones have to be replaced with `=`, because array3[ 1 ] and array3[ 2 ] wasn't present in the input string.
					if ( j <= array3length ) {
						base64string += base64characters.charAt( array4[ j ] );
					} else {
						base64string += '=';
					}
				}

			}
			return base64string;
		},

		/**
		 * A set of functions for operations on styles.
		 *
		 * @property {CKEDITOR.tools.style}
		 */
		style: {
			/**
			 * Methods to parse miscellaneous CSS properties.
			 *
			 * @property {CKEDITOR.tools.style.parse}
			 * @member CKEDITOR.tools.style
			 */
			parse: {
				_borderStyle: [
					'none',
					'hidden',
					'dotted',
					'dashed',
					'solid',
					'double',
					'groove',
					'ridge',
					'inset',
					'outset'
				],

				_widthRegExp: /^(thin|medium|thick|[\+-]?\d+(\.\d+)?[a-z%]+|[\+-]?0+(\.0+)?|\.\d+[a-z%]+)$/,

				/**
				 * **Note**: This regexp is deprecated, use {@link CKEDITOR.tools.color} to handle colors.
				 *
				 * @deprecated 4.16.0
				 * @private
				 */
				_rgbaRegExp: /rgba?\(\s*\d+%?\s*,\s*\d+%?\s*,\s*\d+%?\s*(?:,\s*[0-9.]+\s*)?\)/gi,

				/**
				 * **Note**: This regexp is deprecated, use {@link CKEDITOR.tools.color} to handle colors.
				 *
				 * @deprecated 4.16.0
				 * @private
				 */
				_hslaRegExp: /hsla?\(\s*[0-9.]+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[0-9.]+\s*)?\)/gi,

				/**
				 * Parses the `value` used as a `background` property shorthand and returns information as an object.
				 *
				 * **Note:** Currently only the `color` property is extracted. Any other parts will go into the `unprocessed` property.
				 *
				 *		var background = CKEDITOR.tools.style.parse.background( '#0C0 url(foo.png)' );
				 *		console.log( background );
				 *		// Logs: { color: '#0C0', unprocessed: 'url(foo.png)' }
				 *
				 * @param {String} value The value of the `background` property.
				 * @returns {Object} An object with information extracted from the background.
				 * @returns {String} return.color The **first** color value found. The color format remains the same as in input.
				 * @returns {String} return.unprocessed The remaining part of the `value` that has not been processed.
				 * @member CKEDITOR.tools.style.parse
				 */
				background: function( value ) {
					var ret = {},
						colors = this._findColor( value );

					if ( colors.length ) {
						ret.color = colors[ 0 ];

						CKEDITOR.tools.array.forEach( colors, function( colorToken ) {
							value = value.replace( colorToken, '' );
						} );
					}

					value = CKEDITOR.tools.trim( value );

					if ( value ) {
						// If anything was left unprocessed include it as unprocessed part.
						ret.unprocessed = value;
					}

					return ret;
				},

				/**
				 * Parses the `margin` CSS property shorthand format.
				 *
				 * ```javascript
				 *	console.log( CKEDITOR.tools.parse.margin( '3px 0 2' ) );
				 *	// Logs: { top: "3px", right: "0", bottom: "2", left: "0" }
				 * ```
				 *
				 * @param {String} value The `margin` property value.
				 * @returns {Object.<String, String>}
				 * @returns {String} return.top Top margin.
				 * @returns {String} return.right Right margin.
				 * @returns {String} return.bottom Bottom margin.
				 * @returns {String} return.left Left margin.
				 * @member CKEDITOR.tools.style.parse
				 */
				margin: function( value ) {
					return CKEDITOR.tools.style.parse.sideShorthand( value, function( width ) {
						return width.match( /(?:\-?[\.\d]+(?:%|\w*)|auto|inherit|initial|unset|revert)/g ) || [ '0px' ];
					} );
				},

				/**
				 * Parses the CSS property shorthand format of all `top`, `right`, `bottom`, `left` sides.
				 *
				 * ```javascript
				 *	console.log( CKEDITOR.tools.style.parse.sideShorthand( 'solid dotted' ) );
				 *	// Logs: { top: 'solid', right: 'dotted', bottom: 'solid', left: 'dotted' }
				 *
				 * console.log( CKEDITOR.tools.style.parse.sideShorthand( 'foo baz', split ) );
				 * // Logs: { top: 'foo', right: 'baz', bottom: 'foo', left: 'baz' }
				 *
				 * console.log( CKEDITOR.tools.style.parse.sideShorthand( 'something else', split ) );
				 * // Logs: { top: 'bar', right: 'quix', bottom: 'bar', left: 'quix' }
				 *
				 * function split( value ) {
				 *  	return value.match( /(foo|baz)/g ) || [ 'bar', 'quix' ];
				 * }
				 * ```
				 *
				 * @since 4.12.0
				 * @param {String} value The shorthand property value.
				 * @param {Function} [split] The function used to split the CSS property shorthand.
				 * It should return an array of side shorthand parts (see the `split` function in the code listing).
				 * If not set, the property value will be split by spaces.
				 * @returns {Object.<String, String>}
				 * @returns {String} return.top Top value.
				 * @returns {String} return.right Right value.
				 * @returns {String} return.bottom Bottom value.
				 * @returns {String} return.left Left value.
				 * @member CKEDITOR.tools.style.parse
				 */
				sideShorthand: function( value, split ) {
					var ret = {},
						parts = split ? split( value ) : value.split( /\s+/ );

					switch ( parts.length ) {
						case 1:
							mapStyles( [ 0, 0, 0, 0 ] );
							break;
						case 2:
							mapStyles( [ 0, 1, 0, 1 ] );
							break;
						case 3:
							mapStyles( [ 0, 1, 2, 1 ] );
							break;
						case 4:
							mapStyles( [ 0, 1, 2, 3 ] );
							break;
					}

					function mapStyles( map ) {
						ret.top = parts[ map[ 0 ] ];
						ret.right = parts[ map[ 1 ] ];
						ret.bottom = parts[ map[ 2 ] ];
						ret.left = parts[ map[ 3 ] ];
					}

					return ret;
				},

				/**
				 * @param {String} value The `border` property value.
				 * @returns {CKEDITOR.tools.style.border} Border style.
				 * @deprecated 4.12.0 Use {@link CKEDITOR.tools.style.border#fromCssRule} instead.
				 * @member CKEDITOR.tools.style.parse
				 */
				border: function( value ) {
					return CKEDITOR.tools.style.border.fromCssRule( value );
				},

				/**
				 * Searches the `value` for any CSS color occurrences and returns it.
				 *
				 * @private
				 * @param {String} value
				 * @returns {String[]} An array of matched results.
				 * @member CKEDITOR.tools.style.parse
				 */
				_findColor: function( value ) {
					var ret = [],
						arrayTools = CKEDITOR.tools.array;


					// Check for rgb(a).
					ret = ret.concat( value.match( this._rgbaRegExp ) || [] );

					// Check for hsl(a).
					ret = ret.concat( value.match( this._hslaRegExp ) || [] );

					ret = ret.concat( arrayTools.filter( value.split( /\s+/ ), function( colorEntry ) {
						// Check for hex format.
						if ( colorEntry.match( /^\#[a-f0-9]{3}(?:[a-f0-9]{3})?$/gi ) ) {
							return true;
						}

						// Check for preset names.
						return colorEntry.toLowerCase() in CKEDITOR.tools.style.parse._colors;
					} ) );

					return ret;
				}
			}
		},

		/**
		 * A set of array helpers.
		 *
		 * @property {CKEDITOR.tools.array}
		 * @member CKEDITOR.tools
		 */
		array: {
			/**
			 * Returns a copy of `array` filtered using the `fn` function. Any elements that the `fn` will return `false` for
			 * will get removed from the returned array.
			 *
			 *		var filtered = this.array.filter( [ 0, 1, 2, 3 ], function( value ) {
			 *			// Leave only values equal or greater than 2.
			 *			return value >= 2;
			 *		} );
			 *		console.log( filtered );
			 *		// Logs: [ 2, 3 ]
			 *
			 * @param {Array} array
			 * @param {Function} fn A function that gets called with each `array` item. Any item that `fn`
			 * returned a `false`-alike value for will be filtered out of the `array`.
			 * @param {Mixed} fn.value The currently iterated array value.
			 * @param {Number} fn.index The index of the currently iterated value in an array.
			 * @param {Array} fn.array The original array passed as the `array` variable.
			 * @param {Mixed} [thisArg=undefined] A context object for `fn`.
			 * @returns {Array} The filtered array.
			 * @member CKEDITOR.tools.array
			 */
			filter: function( array, fn, thisArg ) {
				var ret = [];

				this.forEach( array, function( val, i ) {
					if ( fn.call( thisArg, val, i, array ) ) {
						ret.push( val );
					}
				} );

				return ret;
			},

			/**
			 * Returns the first element in the array for which the given callback `fn` returns `true`.
			 *
			 * ```js
			 * var array = [ 1, 2, 3, 4 ];
			 *
			 * CKEDITOR.tools.array.find( array, function( item ) {
			 *     return item > 2;
			 * } ); // returns 3.
			 * ```
			 *
			 * @param {Array} array An array to be iterated over.
			 * @param {Function} fn A function called for every `array` element until it returns `true`.
			 * @param {Mixed} fn.value The currently iterated array value.
			 * @param {Number} fn.index The index of the currently iterated value in an array.
			 * @param {Array} fn.array The original array passed as an `array` variable.
			 * @param {Mixed} [thisArg=undefined] The context object for `fn`.
			 * @returns {*} The first matched value or `undefined` otherwise.
			 * @member CKEDITOR.tools.array
			 * @since 4.12.0
			 */
			find: function( array, fn, thisArg ) {
				var length = array.length,
					i = 0;

				while ( i < length ) {
					if ( fn.call( thisArg, array[ i ], i, array ) ) {
						return array[ i ];
					}
					i++;
				}

				return undefined;
			},

			/**
			 * Iterates over every element in the `array`.
			 *
			 * @param {Array} array An array to be iterated over.
			 * @param {Function} fn The function called for every `array` element.
			 * @param {Mixed} fn.value The currently iterated array value.
			 * @param {Number} fn.index The index of the currently iterated value in an array.
			 * @param {Array} fn.array The original array passed as an `array` variable.
			 * @param {Mixed} [thisArg=undefined] The context object for `fn`.
			 * @member CKEDITOR.tools.array
			 */
			forEach: function( array, fn, thisArg ) {
				var len = array.length,
					i;

				for ( i = 0; i < len; i++ ) {
					fn.call( thisArg, array[ i ], i, array );
				}
			},

			/**
			 * Applies a function to each element of an array and returns the array of results in the same order.
			 * Note the order of the parameters.
			 *
			 * @param {Array} array An array of elements that `fn` is applied on.
			 * @param {Function} fn A function with the signature `a -> b`.
			 * @param {Mixed} [thisArg=undefined] The context object for `fn`.
			 * @returns {Array} An array of mapped elements.
			 * @member CKEDITOR.tools.array
			 * @since 4.6.2
			 */
			map: function( array, fn, thisArg ) {
				var result = [];
				for ( var i = 0; i < array.length; i++ ) {
					result.push( fn.call( thisArg, array[ i ], i, array ) );
				}
				return result;
			},

			/**
			 * Applies a function against each value in an array storing the result in an accumulator passed to the next iteration.
			 * Note the order of the parameters.
			 *
			 * @param {Array} array An array of elements that `fn` is applied on.
			 * @param {Function} fn A function with the signature `(accumulator, a, index, array) -> b`.
			 * @param {Mixed} initial Initial value of the accumulator.
			 * @param {Mixed} [thisArg=undefined] The context object for `fn`.
			 * @returns {Mixed} The final value of the accumulator.
			 * @member CKEDITOR.tools.array
			 * @since 4.6.2
			*/
			reduce: function( array, fn, initial, thisArg ) {
				var acc = initial;
				for ( var i = 0; i < array.length; i++ ) {
					acc = fn.call( thisArg, acc, array[ i ], i, array );
				}
				return acc;
			},

			/**
			 * Tests whether all elements in an array pass the test implemented by the provided function.
			 * Returns `true` if the provided array is empty.
			 *
			 * ```js
			 * var every = CKEDITOR.tools.array.every( [ 11, 22, 33, 44 ], function( value ) {
			 * 	return value > 10;
			 * } );
			 * console.log( every );
			 * // Logs: true
			 *```
			 *
			 * @param {Array} array
			 * @param {Function} fn A function that gets called with each `array` item.
			 * @param {Mixed} fn.value The currently iterated array value.
			 * @param {Number} fn.index The index of the currently iterated array value.
			 * @param {Array} fn.array The original array passed as the `array` variable.
			 * @param {Mixed} [thisArg=undefined] A context object for `fn`.
			 * @returns {Boolean} Information whether all elements pass the test.
			 * @member CKEDITOR.tools.array
			 * @since 4.8.0
			 */
			every: function( array, fn, thisArg ) {
				// Empty arrays always return true.
				if ( !array.length ) {
					return true;
				}

				var ret = this.filter( array, fn, thisArg );

				return array.length === ret.length;
			},

			/**
			 * Tests whether any element in an array passes the test implemented by the provided function.
			 * Returns `false` if the provided array is empty.
			 *
			 * ```js
			 * var some = CKEDITOR.tools.array.some( [ 11, 2, 3, 4 ], function( value ) {
			 * 	return value > 10;
			 * } );
			 * console.log( some );
			 * // Logs: true
			 * ```
			 *
			 * @param {Array} array
			 * @param {Function} fn A function that gets called with each `array` item.
			 * @param {Mixed} fn.value The currently iterated array value.
			 * @param {Number} fn.index The index of the currently iterated array value.
			 * @param {Array} fn.array The original array passed as the `array` variable.
			 * @param {Mixed} [thisArg=undefined] A context object for `fn`.
			 * @returns {Boolean} Information whether any element passes the test.
			 * @member CKEDITOR.tools.array
			 * @since 4.13.0
			 */
			some: function( array, fn, thisArg ) {
				for ( var i = 0; i < array.length; i++ ) {
					if ( fn.call( thisArg, array[ i ], i, array ) ) {
						return true;
					}
				}

				return false;
			},

			/**
			 * Zips corresponding objects from two arrays into a single array of object pairs.
			 *
			 * ```js
			 * var zip = CKEDITOR.tools.array.zip( [ 'foo', 'bar', 'baz' ], [ 1, 2, 3 ] );
			 * console.log( zip );
			 * // Logs: [ [ 'foo', 1 ], [ 'bar', 2 ], [ 'baz', 3 ] ];
			 * ```
			 *
			 * @since 4.15.1
			 * @member CKEDITOR.tools.array
			 * @param {Array} array1
			 * @param {Array} array2
			 * @returns {Array} A two-dimensional array of object pairs.
			 */
			zip: function( array1, array2 ) {
				return CKEDITOR.tools.array.map( array1, function( value, index ) {
					return [ value, array2[ index ] ];
				} );
			},

			/**
			 * Removes duplicates from the array.
			 *
			 * ```js
			 * var array = CKEDITOR.tools.array.unique( [ 1, 1, 2, 3, 2 ] );
			 * console.log( array );
			 * // Logs: [ 1, 2, 3 ]
			 * ```
			 *
			 * @since 4.16.0
			 * @member CKEDITOR.tools.array
			 * @param {Array} array Array from which duplicates should be removed.
			 * @returns {Array} The copy of the input array without duplicates.
			 */
			unique: function( array ) {
				return this.filter( array, function( item, index ) {
					return index === CKEDITOR.tools.array.indexOf( array, item );
				} );
			}
		},

		/**
		 * A set of object helpers.
		 *
		 * @property {CKEDITOR.tools.object}
		 * @member CKEDITOR.tools
		 */
		object: {

			/**
			 * List of ECMA3 object properties with obsolete
			 * [DontEnum](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Properties)
			 * attribute.
			 *
			 * @member CKEDITOR.tools.object
			 * @private
			 * @since 4.12.0
			 */
			DONT_ENUMS: [
				'toString',
				'toLocaleString',
				'valueOf',
				'hasOwnProperty',
				'isPrototypeOf',
				'propertyIsEnumerable',
				'constructor'
			],

			/**
			 * Returns an array of key-value pairs using enumerable string-keyed
			 * object properties.
			 *
			 * ```javascript
			 *	console.log( CKEDITOR.tools.object.entries( { foo: 1, bar: false } );
			 *	// -> [ [ 'foo', 1 ], [ 'bar', false ] ]
			 * ```
			 *
			 * @since 4.12.0
			 * @member CKEDITOR.tools.object
			 * @param {Object} obj
			 * @returns {Array} Object's key-value pairs.
			 */
			entries: function( obj ) {
				return CKEDITOR.tools.array.map( CKEDITOR.tools.object.keys( obj ), function( key ) {
					return [ key, obj[ key ] ];
				} );
			},

			/**
			 * Returns an array of passed object enumerable values.
			 *
			 * ```javascript
			 *	console.log( CKEDITOR.tools.object.values( { foo: 1, bar: false } );
			 *	// -> [ 1, false ]
			 * ```
			 *
			 * @since 4.12.0
			 * @member CKEDITOR.tools.object
			 * @param {Object} obj
			 * @returns {Array} Object's values.
			 */
			values: function( obj ) {
				return CKEDITOR.tools.array.map( CKEDITOR.tools.object.keys( obj ), function( key ) {
					return obj[ key ];
				} );
			},

			/**
			 * Returns an array of passed object keys.
			 *
			 * ```javascript
			 *	console.log( CKEDITOR.tools.object.keys( { foo: 1, bar: false } );
			 *	// -> [ 'foo', 'bar' ]
			 * ```
			 *
			 * @since 4.12.0
			 * @member CKEDITOR.tools.object
			 * @param {Object} obj
			 * @returns {Array} Object's keys.
			 */
			keys: function( obj ) {
				var hasOwnProperty = Object.prototype.hasOwnProperty,
					keys = [],
					dontEnums = CKEDITOR.tools.object.DONT_ENUMS,
					isNotObject = !obj || typeof obj !== 'object';

				// We must handle non-object types differently in IE 8,
				// due to the fact that it uses ES5 behaviour, not ES2015+ as other browsers (#3381).
				if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 && isNotObject ) {
					return createNonObjectKeys( obj );
				}

				for ( var prop in obj ) {
					keys.push( prop );
				}

				// Fix don't enum bug for IE < 9 browsers (#3120).
				if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
					for ( var i = 0; i < dontEnums.length; i++ ) {
						if ( hasOwnProperty.call( obj, dontEnums[ i ] ) ) {
							keys.push( dontEnums[ i ] );
						}
					}
				}

				return keys;

				function createNonObjectKeys( value ) {
					var keys = [],
						i;

					if ( typeof value !== 'string' ) {
						return keys;
					}

					for ( i = 0; i < value.length; i++ ) {
						keys.push( String( i ) );
					}

					return keys;
				}
			},

			/**
			 * Returns the first key from `obj` which has a given `value`.
			 *
			 * @param {Object} obj An object whose `key` is looked for.
			 * @param {Mixed} value An object's `value` to be looked for.
			 * @returns {String/null} Matched `key` or `null` if not found.
			 * @member CKEDITOR.tools.object
			 */

			findKey: function( obj, value ) {
				if ( typeof obj !== 'object' ) {
					return null;
				}

				var key;

				for ( key in obj ) {
					if ( obj[ key ] === value ) {
						return key;
					}
				}

				return null;
			},

			/**
			 * Merges two objects and returns the new one.
			 *
			 *		var obj1 = {
			 *				a: 1,
			 *				conflicted: 10,
			 *				obj: {
			 *					c: 1
			 *				}
			 *			},
			 *			obj2 = {
			 *				b: 2,
			 *				conflicted: 20,
			 *				obj: {
			 *					d: 2
			 *				}
			 *			};
			 *
			 *		CKEDITOR.tools.object.merge( obj1, obj2 );
			 *
			 * This code produces the following object:
			 *
			 *		{
			 *			a: 1,
			 *			b: 2,
			 *			conflicted: 20,
			 *			obj: {
			 *				c: 1,
			 *				d: 2
			 *			}
			 *		}
			 *
			 * @param {Object} obj1 The source object which will be used to create a new base object.
			 * @param {Object} obj2 An object whose properties will be merged into the base one.
			 * @returns {Object} The merged object.
			 * @member CKEDITOR.tools.object
			 */
			merge: function( obj1, obj2 ) {
				var tools = CKEDITOR.tools,
					copy1 = tools.clone( obj1 ),
					copy2 = tools.clone( obj2 );

				tools.array.forEach( tools.object.keys( copy2 ), function( key ) {
					if ( typeof copy2[ key ] === 'object' && typeof copy1[ key ] === 'object' ) {
						copy1[ key ] = tools.object.merge( copy1[ key ], copy2[ key ] );
					} else {
						copy1[ key ] = copy2[ key ];
					}
				} );

				return copy1;
			}
		},

		/**
		 * Converts relative positions inside a DOM rectangle into absolute ones using the given window as context.
		 * "Absolute" here means in relation to the upper-left corner of the topmost viewport.
		 *
		 * @since 4.10.0
		 * @param { CKEDITOR.dom.window } window The window containing an element for which the rectangle is passed.
		 * @param { CKEDITOR.dom.rect } rect A rectangle with a relative position.
		 * @returns { CKEDITOR.dom.rect } A rectangle with an absolute position.
		 */
		getAbsoluteRectPosition: function( window, rect ) {
			var newRect = CKEDITOR.tools.copy( rect );
			appendParentFramePosition( window.getFrame() );

			var winGlobalScroll = CKEDITOR.document.getWindow().getScrollPosition();

			newRect.top += winGlobalScroll.y;
			newRect.left += winGlobalScroll.x;

			// If there is no x or y, e.g. Microsoft browsers, don't return them, otherwise we will have rect.x = NaN.
			if ( ( 'x' in newRect ) && ( 'y' in newRect ) ) {
				newRect.y += winGlobalScroll.y;
				newRect.x += winGlobalScroll.x;
			}

			newRect.right = newRect.left + newRect.width;
			newRect.bottom = newRect.top + newRect.height;

			return newRect;

			function appendParentFramePosition( frame ) {
				if ( !frame ) {
					return;
				}

				var frameRect = frame.getClientRect();

				newRect.top += frameRect.top;
				newRect.left += frameRect.left;

				if ( ( 'x' in newRect ) && ( 'y' in newRect ) ) {
					newRect.x += frameRect.x;
					newRect.y += frameRect.y;
				}

				appendParentFramePosition( frame.getWindow().getFrame() );
			}
		}
	};

	// Generates a CSRF token with a given length.
	//
	// @since 4.5.6
	// @param {Number} length
	// @returns {string}
	function generateToken( length ) {
		var randValues = [];
		var result = '';

		if ( window.crypto && window.crypto.getRandomValues ) {
			randValues = new Uint8Array( length );
			window.crypto.getRandomValues( randValues );
		} else {
			for ( var i = 0; i < length; i++ ) {
				randValues.push( Math.floor( Math.random() * 256 ) );
			}
		}

		for ( var j = 0; j < randValues.length; j++ ) {
			var character = tokenCharset.charAt( randValues[ j ] % tokenCharset.length );
			result += Math.random() > 0.5 ? character.toUpperCase() : character;
		}

		return result;
	}

	/**
	 * Buffers `input` events (or any `input` calls) and triggers `output` not more often than once per `minInterval`.
	 *
	 * @since 4.11.0
	 * @class CKEDITOR.tools.buffers.event
	 * @member CKEDITOR.tools.buffers
	 * @constructor Creates a new instance of the buffer.
	 * @param {Number} minInterval The minimum interval between `output` calls in milliseconds.
	 * @param {Function} output The function that will be executed as `output`.
	 * @param {Object} [contextObj] The object used as context to the listener call (the `this` object).
	 */
	function EventsBuffer( minInterval, output, context ) {
		/**
		 * The minimal interval (in milliseconds) between the calls.
		 *
		 * @private
		 * @readonly
		 * @property {Number}
		 */
		this._minInterval = minInterval;

		/**
		 * The variable to be used as a context for the output calls.
		 *
		 * @private
		 * @readonly
		 * @property {Mixed}
		 */
		this._context = context;

		/**
		 * The ID of a delayed function call that will be called after the current interval frame.
		 *
		 * @private
		 */
		this._scheduledTimer = 0;

		this._lastOutput = 0;

		this._output = CKEDITOR.tools.bind( output, context || {} );

		var that = this;

		/**
		 * Acts as a proxy to the `output` function given in the consturctor, providing function throttling.
		 *
		 * Guarantees that the `output` function does not get called more often than
		 * indicated by the {@link #_minInterval}.
		 *
		 * The first `input` call is always executed asynchronously which means that the `output`
		 * call will be executed immediately.
		 *
		 * ```javascript
		 *	var buffer = new CKEDITOR.tools.buffers.event( 200, function() {
		 *		console.log( 'foo!' );
		 *	} );
		 *
		 *	buffer.input();
		 *	// 'foo!' logged immediately.
		 *	buffer.input();
		 *	// Nothing logged.
		 *	buffer.input();
		 *	// Nothing logged.
		 *	// … after 200ms a single 'foo!' will be logged.
		 * ```
		 *
		 * Can be easily used with events:
		 *
		 * ```javascript
		 *	var buffer = new CKEDITOR.tools.buffers.event( 200, function() {
		 *		console.log( 'foo!' );
		 *	} );
		 *
		 *	editor.on( 'key', buffer.input );
		 *	// Note: There is no need to bind the buffer as a context.
		 * ```
		 *
		 * @method
		 * @param {Mixed[]} [args]
		 */
		this.input = function() {
			// NOTE: This function needs to be created for each instance,
			// as there's a common practice to pass `buffer.input`
			// directly to a listener, and overwrite context object.
			if ( that._scheduledTimer && that._reschedule() === false ) {
				return;
			}

			var diff = ( new Date() ).getTime() - that._lastOutput;

			// If less than minInterval passed after last check,
			// schedule next for minInterval after previous one.
			if ( diff < that._minInterval ) {
				that._scheduledTimer = setTimeout( triggerOutput, that._minInterval - diff );
			} else {
				triggerOutput();
			}

			function triggerOutput() {
				that._lastOutput = ( new Date() ).getTime();
				that._scheduledTimer = 0;

				that._call();
			}
		};
	}

	EventsBuffer.prototype = {
		/**
		 * Resets the buffer state and cancels any pending calls.
		 */
		reset: function() {
			this._lastOutput = 0;
			this._clearTimer();
		},
		/**
		 * Called when the function call should be rescheduled.
		 *
		 * @private
		 * @returns {Boolean/undefined} If it returns `false`, the the parent call will be stopped.
		 */
		_reschedule: function() {
			return false;
		},
		/**
		 * Performs an actual call.
		 *
		 * @private
		 */
		_call: function() {
			this._output();
		},
		/**
		 * Cancels the deferred timeout.
		 *
		 * @private
		 */
		_clearTimer: function() {
			if ( this._scheduledTimer ) {
				clearTimeout( this._scheduledTimer );
			}

			this._scheduledTimer = 0;
		}
	};

	/**
	 * Throttles `input` events (or any `input` calls) and triggers `output` not more often than once per `minInterval`.
	 *
	 * Unlike {@link CKEDITOR.tools.buffers.event} this class allows passing custom parameters into the {@link #input}
	 * function. For more information see the
	 * [Throttling function issue](https://github.com/ckeditor/ckeditor4/issues/1993).
	 *
	 * @since 4.11.0
	 * @class CKEDITOR.tools.buffers.throttle
	 * @extends CKEDITOR.tools.buffers.event
	 */
	function ThrottleBuffer( minInterval, output, context ) {
		EventsBuffer.call( this, minInterval, output, context );

		/**
		 * Arguments for the last scheduled call.
		 *
		 * @property {Mixed[]}
		 * @private
		 */
		this._args = [];

		var that = this;

		/**
		 * Acts as a proxy to the `output` function given in the constructor, providing function throttling.
		 *
		 * Guarantees that the `output` function does not get called more often than
		 * indicated by the {@link #_minInterval}.
		 *
		 * If multiple calls occur within a single `minInterval` time,
		 * the most recent `input` call with its arguments will be used to schedule
		 * the next `output` call, and the previous throttled calls will be discarded.
		 *
		 * The first `input` call is always executed asynchronously which means that the `output`
		 * call will be executed immediately.
		 *
		 * ```javascript
		 *	var buffer = new CKEDITOR.tools.buffers.throttle( 200, function( message ) {
		 *		console.log( message );
		 *	} );
		 *
		 *	buffer.input( 'foo!' );
		 *	// 'foo!' logged immediately.
		 *	buffer.input( 'bar!' );
		 *	// Nothing logged.
		 *	buffer.input( 'baz!' );
		 *	// Nothing logged.
		 *	// … after 200ms a single 'baz!' will be logged.
		 * ```
		 *
		 * It can be easily used with events:
		 *
		 * ```javascript
		 *	var buffer = new CKEDITOR.tools.buffers.throttle( 200, function( evt ) {
		 *		console.log( evt.data.text );
		 *	} );
		 *
		 *	editor.on( 'key', buffer.input );
		 *	// Note: There is no need to bind the buffer as a context.
		 * ```
		 * @method
		 * @param {Mixed[]} [args]
		 */
		this.input = CKEDITOR.tools.override( this.input, function( originalInput ) {
			return function() {
				that._args = Array.prototype.slice.call( arguments );

				originalInput.call( this );
			};
		} );
	}

	ThrottleBuffer.prototype = CKEDITOR.tools.prototypedCopy( EventsBuffer.prototype );

	ThrottleBuffer.prototype._reschedule = function() {
		if ( this._scheduledTimer ) {
			this._clearTimer();
		}
	};

	ThrottleBuffer.prototype._call = function() {
		this._output.apply( this._context, this._args );
	};

	CKEDITOR.tools.buffers = {};
	CKEDITOR.tools.buffers.event = EventsBuffer;
	CKEDITOR.tools.buffers.throttle = ThrottleBuffer;

	/**
	 * Represents the CSS border style.
	 *
	 * @since 4.12.0
	 * @class CKEDITOR.tools.style.border
	 */
	CKEDITOR.tools.style.border = CKEDITOR.tools.createClass( {

		/**
		 * Creates a new instance of the border style.
		 * @constructor
		 * @param {Object} [props] Style-related properties.
		 * @param {String} [props.color] Border color.
		 * @param {String} [props.style] Border style.
		 * @param {String} [props.width] Border width.
		 */
		$: function( props ) {
			props = props || {};

			/**
			 * Represents the value of the CSS `width` property.
			 *
			 * @property {String} [width]
			 */
			this.width = props.width;

			/**
			 * Represents the value of the CSS `style` property.
			 *
			 * @property {String} [style]
			 */
			this.style = props.style;

			/**
			 * Represents the value of the CSS `color` property.
			 *
			 * @property {String} [color]
			 */
			this.color = props.color;

			this._.normalize();
		},

		_: {
			normalizeMap: {
				color: [
					[ /windowtext/g, 'black' ]
				]
			},

			normalize: function() {
				for ( var propName in this._.normalizeMap ) {
					var val = this[ propName ];

					if ( val ) {
						this[ propName ] = CKEDITOR.tools.array.reduce( this._.normalizeMap[ propName ], function( cur, rule ) {
							return cur.replace( rule[ 0 ], rule[ 1 ] );
						}, val );
					}
				}
			}
		},

		proto: {
			toString: function() {
				return CKEDITOR.tools.array.filter( [ this.width, this.style, this.color ], function( item ) {
					return !!item;
				} ).join( ' ' );
			}
		},

		statics: {
			/**
			 * Parses the CSS `border` property shorthand format.
			 * This CSS property [does not support inheritance](https://www.w3.org/TR/css3-background/#the-border-shorthands).
			 *
			 * ```javascript
			 *	console.log( CKEDITOR.tools.style.border.fromCssRule( '3px solid #ffeedd' ) );
			 *	// Logs: Border { width: '3px', style: 'solid', color: '#ffeedd' }
			 * ```
			 *
			 * @static
			 * @param {String} value The `border` property value.
			 * @returns {CKEDITOR.tools.style.border} Border style.
			 * @member CKEDITOR.tools.style.border
			 */
			fromCssRule: function( value ) {
				var props = {},
					input = value.split( /\s+/g ),
					parseColor = CKEDITOR.tools.style.parse._findColor( value );

				if ( parseColor.length ) {
					props.color = parseColor[ 0 ];
				}

				CKEDITOR.tools.array.forEach( input, function( val ) {
					if ( !props.style ) {
						if ( CKEDITOR.tools.indexOf( CKEDITOR.tools.style.parse._borderStyle, val ) !== -1 ) {
							props.style = val;
							return;
						}
					}

					if ( !props.width ) {
						if ( CKEDITOR.tools.style.parse._widthRegExp.test( val ) ) {
							props.width = val;
							return;
						}
					}

				} );

				return new CKEDITOR.tools.style.border( props );
			},

			/**
			 * Parses the `style`, `width` and `color` shorthand styles into
			 * border side shorthand styles.
			 *
			 * ```javascript
			 * var styles = {
			 *		'border-color': 'red blue',
			 *		'border-style': 'solid dotted solid',
			 *		'border-width': '1px 2px 3px 4px'
			 * };
			 *
			 * console.log( CKEDITOR.tools.style.border.splitCssValues( styles ) );
			 * // Logs:
			 * // {
			 * // 	'border-top': Border { width: '1px', style: 'solid', color: 'red' },
			 * // 	'border-right': Border { width: '2px', style: 'dotted', color: 'blue'},
			 * // 	'border-bottom': Border { width: '3px', style: 'solid', color: 'red' },
			 * // 	'border-left': Border { width: '4px', style: 'dotted', color: 'blue' }
			 * // }
			 *
			 * // Use fallback to fill up missing style:
			 * var partialStyles = {
			 * 		'border-style': 'solid',
			 * 		'border-width': '2px'
			 * 	},
			 * 	fallback = { color: 'red' };
			 *
			 * console.log( CKEDITOR.tools.style.border.splitCssValues( partialStyles, fallback ) );
			 * // Logs:
			 * // {
			 * // 	'border-top': Border { width: '2px', style: 'solid', color: 'red' },
			 * // 	'border-right': Border { width: '2px', style: 'solid', color: 'red' },
			 * // 	'border-bottom': Border { width: '2px', style: 'solid', color: 'red' },
			 * // 	'border-left': Border { width: '2px', style: 'solid', color: 'red' }
			 * // }
			 * ```
			 *
			 * Border side shorthands with greater style property specificity are preferred
			 * over more general shorthands.
			 *
			 * ```
			 * var styles = {
			 * 		'border-style': 'solid',
			 * 		'border-width': '2px',
			 * 		'border-color': 'red',
			 * 		'border-left-color': 'blue',
			 * 		'border-right-width': '10px',
			 * 		'border-top-style': 'dotted',
			 * 		'border-top-color': 'green'
			 * };
			 *
			 * console.log( CKEDITOR.tools.style.border.splitCssValues( styles ) );
			 * // Logs:
			 * // {
			 * // 	'border-top': Border { width: '2px', style: 'dotted', color: 'green' },
			 * // 	'border-right': Border { width: '10px', style: 'solid', color: 'red'},
			 * // 	'border-bottom': Border { width: '2px', style: 'solid', color: 'red' },
			 * // 	'border-left': Border { width: '2px', style: 'solid', color: 'blue' }
			 * // }
			 * ```
			 *
			 * @static
			 * @param {Object} styles Border styles shorthand object.
			 * @param {Object} [styles.border-color] Border color shorthand.
			 * @param {Object} [styles.border-style] Border style shorthand.
			 * @param {Object} [styles.border-width] Border width shorthand.
			 * @param {Object} [fallback] Fallback object used to fill up missing style.
			 * @param {Object} [fallback.color] Color CSS style used in absence of the `border-color` style.
			 * @param {Object} [fallback.style] Style CSS style used in absence of the `border-style` style.
			 * @param {Object} [fallback.width] Width CSS style used in absence of the `border-width` style.
			 * @returns {Object.<String, CKEDITOR.tools.style.border>}
			 * @returns {CKEDITOR.tools.style.border} return.border-top Border top style.
			 * @returns {CKEDITOR.tools.style.border} return.border-right Border right style.
			 * @returns {CKEDITOR.tools.style.border} return.border-bottom Border bottom style.
			 * @returns {CKEDITOR.tools.style.border} return.border-left Border left style.
			 * @member CKEDITOR.tools.style.border
			 */
			splitCssValues: function( styles, fallback ) {
				var types = [ 'width', 'style', 'color' ],
					sides = [ 'top', 'right', 'bottom', 'left' ];

				fallback = fallback || {};

				var stylesMap = CKEDITOR.tools.array.reduce( types, function( cur, type ) {
					var style = styles[ 'border-' + type ] || fallback[ type ];

					cur[ type ] = style ? CKEDITOR.tools.style.parse.sideShorthand( style ) : null;

					return cur;
				}, {} );

				return CKEDITOR.tools.array.reduce( sides, function( cur, side ) {
					var map = {};

					for ( var style in stylesMap ) {
						// Prefer property with greater specificity e.g
						// `border-top-color` over `border-color`.
						var sideProperty = styles[ 'border-' + side + '-' + style ];
						if ( sideProperty ) {
							map[ style ] = sideProperty;
						} else {
							map[ style ] = stylesMap[ style ] && stylesMap[ style ][ side ];
						}
					}

					cur[ 'border-' + side ] = new CKEDITOR.tools.style.border( map );

					return cur;
				}, {} );
			}
		}
	} );

	/**
	 * @member CKEDITOR.tools.array
	 * @method indexOf
	 * @inheritdoc CKEDITOR.tools#indexOf
	 */
	CKEDITOR.tools.array.indexOf = CKEDITOR.tools.indexOf;

	/**
	 * @member CKEDITOR.tools.array
	 * @method isArray
	 * @inheritdoc CKEDITOR.tools#isArray
	 */
	CKEDITOR.tools.array.isArray = CKEDITOR.tools.isArray;

	/**
	 * Left mouse button.
	 *
	 * @since 4.7.3
	 * @readonly
	 * @property {Number} [=0]
	 * @member CKEDITOR
	 */
	CKEDITOR.MOUSE_BUTTON_LEFT = 0;

	/**
	 * Middle mouse button.
	 *
	 * @since 4.7.3
	 * @readonly
	 * @property {Number} [=1]
	 * @member CKEDITOR
	 */
	CKEDITOR.MOUSE_BUTTON_MIDDLE = 1;

	/**
	 * Right mouse button.
	 *
	 * @since 4.7.3
	 * @readonly
	 * @property {Number} [=2]
	 * @member CKEDITOR
	 */
	CKEDITOR.MOUSE_BUTTON_RIGHT = 2;

	/**
	 * The namespace containing functions to work on CSS properties.
	 *
	 * @since 4.6.1
	 * @class CKEDITOR.tools.style
	 */

	/**
	 * The namespace with helper functions to parse some common CSS properties.
	 *
	 * @since 4.6.1
	 * @class CKEDITOR.tools.style.parse
	 */

	/**
	 * The namespace with helper functions and polyfills for arrays.
	 *
	 * @since 4.6.1
	 * @class CKEDITOR.tools.array
	 */

	/**
	 * The namespace with helper functions and polyfills for objects.
	 *
	 * @since 4.7.1
	 * @class CKEDITOR.tools.object
	 */
} )();

// PACKAGER_RENAME( CKEDITOR.tools )
