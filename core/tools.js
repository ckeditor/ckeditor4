/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
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
		 * @since 4.5
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
				var source = arguments[ i ];
				for ( var propertyName in source ) {
					// Only copy existed fields if in overwrite mode.
					if ( overwrite === true || target[ propertyName ] == null ) {
						// Only copy  specified fields if list is provided.
						if ( !propertiesList || ( propertyName in propertiesList ) )
							target[ propertyName ] = source[ propertyName ];

					}
				}
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
		 * @since 4.1
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
		 * Read more about chosen entities in the [research](http://dev.ckeditor.com/ticket/13105#comment:8).
		 *
		 * @param {String} The string to be decoded.
		 * @returns {String} The decoded string.
		 */
		htmlDecode: function( text ) {
			// See:
			// * http://dev.ckeditor.com/ticket/13105#comment:8 and comment:9,
			// * http://jsperf.com/wth-is-going-on-with-jsperf JSPerf has some serious problems, but you can observe
			// that combined regexp tends to be quicker (except on V8). It will also not be prone to fail on '&amp;lt;'
			// (see http://dev.ckeditor.com/ticket/13105#DXWTF:CKEDITOR.tools.htmlEnDecodeAttr).
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
		 * Since CKEditor 4.5 this method simply executes {@link #htmlDecode} which covers
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
		 * @since 4.5
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
		 *		var obj = { text: 'My Object' };
		 *
		 *		function alertText() {
		 *			alert( this.text );
		 *		}
		 *
		 *		var newFunc = CKEDITOR.tools.bind( alertText, obj );
		 *		newFunc(); // Alerts 'My Object'.
		 *
		 * @param {Function} func The function to be executed.
		 * @param {Object} obj The object to which the execution context will be bound.
		 * @returns {Function} The function that can be used to execute the
		 * `func` function in the context of `obj`.
		 */
		bind: function( func, obj ) {
			return function() {
				return func.apply( obj, arguments );
			};
		},

		/**
		 * Class creation based on prototype inheritance which supports of the
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
				$.prototype.base = function() {
					this.base = baseClass.prototype.base;
					baseClass.apply( this, arguments );
					this.base = arguments.callee;
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
		 * **Note:** Percentage-based value is left intact.
		 *
		 * @method
		 * @param {String} cssLength CSS length value.
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
					calculator.setStyle( 'width', cssLength );
					return calculator.$.clientWidth;
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
		 * Finds and converts `rgb(x,x,x)` color definition to hexadecimal notation.
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

			// IE will leave a single semicolon when failed to parse the style text. (#3891)
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
		 * @since 4.1
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
		 * @since 4.1
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
		 * Returns an array of passed object's keys.
		 *
		 *		console.log( CKEDITOR.tools.objectKeys( { foo: 1, bar: false } );
		 *		// -> [ 'foo', 'bar' ]
		 *
		 * @since 4.1
		 * @param {Object} obj
		 * @returns {Array} Object's keys.
		 */
		objectKeys: function( obj ) {
			var keys = [];
			for ( var i in obj )
				keys.push( i );

			return keys;
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
		 * @since 4.1
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
		 * Buffers `input` events (or any `input` calls)
		 * and triggers `output` not more often than once per `minInterval`.
		 *
		 *		var buffer = CKEDITOR.tools.eventsBuffer( 200, function() {
		 *			console.log( 'foo!' );
		 *		} );
		 *
		 *		buffer.input();
		 *		// 'foo!' logged immediately.
		 *		buffer.input();
		 *		// Nothing logged.
		 *		buffer.input();
		 *		// Nothing logged.
		 *		// ... after 200ms a single 'foo!' will be logged.
		 *
		 * Can be easily used with events:
		 *
		 *		var buffer = CKEDITOR.tools.eventsBuffer( 200, function() {
		 *			console.log( 'foo!' );
		 *		} );
		 *
		 *		editor.on( 'key', buffer.input );
		 *		// Note: There is no need to bind buffer as a context.
		 *
		 * @since 4.2.1
		 * @param {Number} minInterval Minimum interval between `output` calls in milliseconds.
		 * @param {Function} output Function that will be executed as `output`.
		 * @param {Object} [scopeObj] The object used to scope the listener call (the `this` object).
		 * @returns {Object}
		 * @returns {Function} return.input Buffer's input method.
		 * @returns {Function} return.reset Resets buffered events &mdash; `output` will not be executed
		 * until next `input` is triggered.
		 */
		eventsBuffer: function( minInterval, output, scopeObj ) {
			var scheduled,
				lastOutput = 0;

			function triggerOutput() {
				lastOutput = ( new Date() ).getTime();
				scheduled = false;
				if ( scopeObj ) {
					output.call( scopeObj );
				} else {
					output();
				}
			}

			return {
				input: function() {
					if ( scheduled )
						return;

					var diff = ( new Date() ).getTime() - lastOutput;

					// If less than minInterval passed after last check,
					// schedule next for minInterval after previous one.
					if ( diff < minInterval )
						scheduled = setTimeout( triggerOutput, minInterval - diff );
					else
						triggerOutput();
				},

				reset: function() {
					if ( scheduled )
						clearTimeout( scheduled );

					scheduled = lastOutput = 0;
				}
			};
		},

		/**
		 * Enables HTML5 elements for older browsers (IE8) in the passed document.
		 *
		 * In IE8 this method can also be executed on a document fragment.
		 *
		 * **Note:** This method has to be used in the `<head>` section of the document.
		 *
		 * @since 4.3
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
		 * @since 4.4
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
		 * @since 4.4
		 */
		checkIfAnyObjectPropertyMatches: function( obj, regexp ) {
			for ( var i in obj ) {
				if ( i.match( regexp ) )
					return true;
			}
			return false;
		},

		/**
		 * Converts a keystroke to its string representation. Returns an object with two fields:
		 *
		 * * `display` &ndash; A string that should be used for visible labels.
		 * For Mac devices it uses `⌥` for `ALT`, `⇧` for `SHIFT` and `⌘` for `COMMAND`.
		 * * `aria` &ndash; A string that should be used for ARIA descriptions.
		 * It does not use special characters such as `⌥`, `⇧` or `⌘`.
		 *
		 * 		var lang = editor.lang.common.keyboard;
		 * 		var shortcut = CKEDITOR.tools.keystrokeToString( lang, CKEDITOR.CTRL + 88 );
		 * 		console.log( shortcut.display ); // 'CTRL + X', on Mac '⌘ + X'.
		 * 		console.log( shortcut.aria ); // 'CTRL + X', on Mac 'COMMAND + X'.
		 *
		 * @since 4.6.0
		 * @param {Object} lang A language object with the key name translation.
		 * @param {Number} keystroke The keystroke to convert.
		 * @returns {{display: String, aria: String}}
		 */
		keystrokeToString: function( lang, keystroke ) {
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
				display: display.join( '+' ),
				aria: aria.join( '+' )
			};
		},

		/**
		 * The data URI of a transparent image. May be used e.g. in HTML as an image source or in CSS in `url()`.
		 *
		 * @since 4.4
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
				// Color list based on https://www.w3.org/TR/css-color-4/#named-colors.
				_colors: {
					aliceblue: '#F0F8FF',
					antiquewhite: '#FAEBD7',
					aqua: '#00FFFF',
					aquamarine: '#7FFFD4',
					azure: '#F0FFFF',
					beige: '#F5F5DC',
					bisque: '#FFE4C4',
					black: '#000000',
					blanchedalmond: '#FFEBCD',
					blue: '#0000FF',
					blueviolet: '#8A2BE2',
					brown: '#A52A2A',
					burlywood: '#DEB887',
					cadetblue: '#5F9EA0',
					chartreuse: '#7FFF00',
					chocolate: '#D2691E',
					coral: '#FF7F50',
					cornflowerblue: '#6495ED',
					cornsilk: '#FFF8DC',
					crimson: '#DC143C',
					cyan: '#00FFFF',
					darkblue: '#00008B',
					darkcyan: '#008B8B',
					darkgoldenrod: '#B8860B',
					darkgray: '#A9A9A9',
					darkgreen: '#006400',
					darkgrey: '#A9A9A9',
					darkkhaki: '#BDB76B',
					darkmagenta: '#8B008B',
					darkolivegreen: '#556B2F',
					darkorange: '#FF8C00',
					darkorchid: '#9932CC',
					darkred: '#8B0000',
					darksalmon: '#E9967A',
					darkseagreen: '#8FBC8F',
					darkslateblue: '#483D8B',
					darkslategray: '#2F4F4F',
					darkslategrey: '#2F4F4F',
					darkturquoise: '#00CED1',
					darkviolet: '#9400D3',
					deeppink: '#FF1493',
					deepskyblue: '#00BFFF',
					dimgray: '#696969',
					dimgrey: '#696969',
					dodgerblue: '#1E90FF',
					firebrick: '#B22222',
					floralwhite: '#FFFAF0',
					forestgreen: '#228B22',
					fuchsia: '#FF00FF',
					gainsboro: '#DCDCDC',
					ghostwhite: '#F8F8FF',
					gold: '#FFD700',
					goldenrod: '#DAA520',
					gray: '#808080',
					green: '#008000',
					greenyellow: '#ADFF2F',
					grey: '#808080',
					honeydew: '#F0FFF0',
					hotpink: '#FF69B4',
					indianred: '#CD5C5C',
					indigo: '#4B0082',
					ivory: '#FFFFF0',
					khaki: '#F0E68C',
					lavender: '#E6E6FA',
					lavenderblush: '#FFF0F5',
					lawngreen: '#7CFC00',
					lemonchiffon: '#FFFACD',
					lightblue: '#ADD8E6',
					lightcoral: '#F08080',
					lightcyan: '#E0FFFF',
					lightgoldenrodyellow: '#FAFAD2',
					lightgray: '#D3D3D3',
					lightgreen: '#90EE90',
					lightgrey: '#D3D3D3',
					lightpink: '#FFB6C1',
					lightsalmon: '#FFA07A',
					lightseagreen: '#20B2AA',
					lightskyblue: '#87CEFA',
					lightslategray: '#778899',
					lightslategrey: '#778899',
					lightsteelblue: '#B0C4DE',
					lightyellow: '#FFFFE0',
					lime: '#00FF00',
					limegreen: '#32CD32',
					linen: '#FAF0E6',
					magenta: '#FF00FF',
					maroon: '#800000',
					mediumaquamarine: '#66CDAA',
					mediumblue: '#0000CD',
					mediumorchid: '#BA55D3',
					mediumpurple: '#9370DB',
					mediumseagreen: '#3CB371',
					mediumslateblue: '#7B68EE',
					mediumspringgreen: '#00FA9A',
					mediumturquoise: '#48D1CC',
					mediumvioletred: '#C71585',
					midnightblue: '#191970',
					mintcream: '#F5FFFA',
					mistyrose: '#FFE4E1',
					moccasin: '#FFE4B5',
					navajowhite: '#FFDEAD',
					navy: '#000080',
					oldlace: '#FDF5E6',
					olive: '#808000',
					olivedrab: '#6B8E23',
					orange: '#FFA500',
					orangered: '#FF4500',
					orchid: '#DA70D6',
					palegoldenrod: '#EEE8AA',
					palegreen: '#98FB98',
					paleturquoise: '#AFEEEE',
					palevioletred: '#DB7093',
					papayawhip: '#FFEFD5',
					peachpuff: '#FFDAB9',
					peru: '#CD853F',
					pink: '#FFC0CB',
					plum: '#DDA0DD',
					powderblue: '#B0E0E6',
					purple: '#800080',
					rebeccapurple: '#663399',
					red: '#FF0000',
					rosybrown: '#BC8F8F',
					royalblue: '#4169E1',
					saddlebrown: '#8B4513',
					salmon: '#FA8072',
					sandybrown: '#F4A460',
					seagreen: '#2E8B57',
					seashell: '#FFF5EE',
					sienna: '#A0522D',
					silver: '#C0C0C0',
					skyblue: '#87CEEB',
					slateblue: '#6A5ACD',
					slategray: '#708090',
					slategrey: '#708090',
					snow: '#FFFAFA',
					springgreen: '#00FF7F',
					steelblue: '#4682B4',
					tan: '#D2B48C',
					teal: '#008080',
					thistle: '#D8BFD8',
					tomato: '#FF6347',
					turquoise: '#40E0D0',
					violet: '#EE82EE',
					wheat: '#F5DEB3',
					white: '#FFFFFF',
					whitesmoke: '#F5F5F5',
					yellow: '#FFFF00',
					yellowgreen: '#9ACD32'
				},

				_rgbaRegExp: /rgba?\(\s*\d+%?\s*,\s*\d+%?\s*,\s*\d+%?\s*(?:,\s*[0-9.]+\s*)?\)/gi,

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
					var ret = [],
						colors = [];

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
				 *		console.log( CKEDITOR.tools.parse.margin( '3px 0 2' ) );
				 *		// Logs: { top: "3px", right: "0", bottom: "2", left: "0" }
				 *
				 * @param {String} value The `margin` property value.
				 * @returns {Object}
				 * @returns {Number} return.top Top margin.
				 * @returns {Number} return.right Right margin.
				 * @returns {Number} return.bottom Bottom margin.
				 * @returns {Number} return.left Left margin.
				 * @member CKEDITOR.tools.style.parse
				 */
				margin: function( value ) {
					var ret = {};

					var widths = value.match( /(?:\-?[\.\d]+(?:%|\w*)|auto|inherit|initial|unset)/g ) || [ '0px' ];

					switch ( widths.length ) {
						case 1:
							// element.styles.margin = widths[0];
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
						ret.top = widths[ map[ 0 ] ];
						ret.right = widths[ map[ 1 ] ];
						ret.bottom = widths[ map[ 2 ] ];
						ret.left = widths[ map[ 3 ] ];
					}

					return ret;
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
} )();

// PACKAGER_RENAME( CKEDITOR.tools )
