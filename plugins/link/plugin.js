/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

( function() {
	CKEDITOR.plugins.add( 'link', {
		requires: 'dialog,fakeobjects',
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'anchor,anchor-rtl,link,unlink', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		onLoad: function() {
			// Add the CSS styles for anchor placeholders.
			var iconPath = CKEDITOR.getUrl( this.path + 'images' + ( CKEDITOR.env.hidpi ? '/hidpi' : '' ) + '/anchor.png' ),
				baseStyle = 'background:url(' + iconPath + ') no-repeat %1 center;border:1px dotted #00f;background-size:16px;';

			var template = '.%2 a.cke_anchor,' +
				'.%2 a.cke_anchor_empty' +
				',.cke_editable.%2 a[name]' +
				',.cke_editable.%2 a[data-cke-saved-name]' +
				'{' +
					baseStyle +
					'padding-%1:18px;' +
					// Show the arrow cursor for the anchor image (FF at least).
					'cursor:auto;' +
				'}' +
				'.%2 img.cke_anchor' +
				'{' +
					baseStyle +
					'width:16px;' +
					'min-height:15px;' +
					// The default line-height on IE.
					'height:1.15em;' +
					// Opera works better with "middle" (even if not perfect)
					'vertical-align:text-bottom;' +
				'}';

			// Styles with contents direction awareness.
			function cssWithDir( dir ) {
				return template.replace( /%1/g, dir == 'rtl' ? 'right' : 'left' ).replace( /%2/g, 'cke_contents_' + dir );
			}

			CKEDITOR.addCss( cssWithDir( 'ltr' ) + cssWithDir( 'rtl' ) );
		},

		init: function( editor ) {
			var allowed = 'a[!href]',
				required = 'a[href]';

			if ( CKEDITOR.dialog.isTabEnabled( editor, 'link', 'advanced' ) ) {
				allowed = allowed.replace( ']', ',accesskey,charset,dir,id,lang,name,rel,tabindex,title,type,download]{*}(*)' );
			}
			if ( CKEDITOR.dialog.isTabEnabled( editor, 'link', 'target' ) ) {
				allowed = allowed.replace( ']', ',target,onclick]' );
			}

			// Add the link and unlink buttons.
			editor.addCommand( 'link', new CKEDITOR.dialogCommand( 'link', {
				allowedContent: allowed,
				requiredContent: required
			} ) );
			editor.addCommand( 'anchor', new CKEDITOR.dialogCommand( 'anchor', {
				allowedContent: 'a[!name,id]',
				requiredContent: 'a[name]'
			} ) );
			editor.addCommand( 'unlink', new CKEDITOR.unlinkCommand() );
			editor.addCommand( 'removeAnchor', new CKEDITOR.removeAnchorCommand() );

			editor.setKeystroke( CKEDITOR.CTRL + 76 /*L*/, 'link' );

			// (#2478)
			editor.setKeystroke( CKEDITOR.CTRL + 75 /*K*/, 'link' );

			if ( editor.ui.addButton ) {
				editor.ui.addButton( 'Link', {
					label: editor.lang.link.toolbar,
					command: 'link',
					toolbar: 'links,10'
				} );
				editor.ui.addButton( 'Unlink', {
					label: editor.lang.link.unlink,
					command: 'unlink',
					toolbar: 'links,20'
				} );
				editor.ui.addButton( 'Anchor', {
					label: editor.lang.link.anchor.toolbar,
					command: 'anchor',
					toolbar: 'links,30'
				} );
			}

			CKEDITOR.dialog.add( 'link', this.path + 'dialogs/link.js' );
			CKEDITOR.dialog.add( 'anchor', this.path + 'dialogs/anchor.js' );

			editor.on( 'doubleclick', function( evt ) {
				// If the link has descendants and the last part of it is also a part of a word partially
				// unlinked, clicked element may be a descendant of the link, not the link itself (https://dev.ckeditor.com/ticket/11956).
				// The evt.data.element.getAscendant( 'img', 1 ) condition allows opening anchor dialog if the anchor is empty (#501).
				var element = evt.data.element.getAscendant( { a: 1, img: 1 }, true );

				if ( element && !element.isReadOnly() ) {
					if ( element.is( 'a' ) ) {
						evt.data.dialog = ( element.getAttribute( 'name' ) && ( !element.getAttribute( 'href' ) || !element.getChildCount() ) ) ? 'anchor' : 'link';

						// Pass the link to be selected along with event data.
						evt.data.link = element;
					} else if ( CKEDITOR.plugins.link.tryRestoreFakeAnchor( editor, element ) ) {
						evt.data.dialog = 'anchor';
					}
				}
			}, null, null, 0 );

			// If event was cancelled, link passed in event data will not be selected.
			editor.on( 'doubleclick', function( evt ) {
				// Make sure both links and anchors are selected (https://dev.ckeditor.com/ticket/11822).
				if ( evt.data.dialog in { link: 1, anchor: 1 } && evt.data.link ) {
					editor.getSelection().selectElement( evt.data.link );
				}
			}, null, null, 20 );

			// If the "menu" plugin is loaded, register the menu items.
			if ( editor.addMenuItems ) {
				editor.addMenuItems( {
					anchor: {
						label: editor.lang.link.anchor.menu,
						command: 'anchor',
						group: 'anchor',
						order: 1
					},

					removeAnchor: {
						label: editor.lang.link.anchor.remove,
						command: 'removeAnchor',
						group: 'anchor',
						order: 5
					},

					link: {
						label: editor.lang.link.menu,
						command: 'link',
						group: 'link',
						order: 1
					},

					unlink: {
						label: editor.lang.link.unlink,
						command: 'unlink',
						group: 'link',
						order: 5
					}
				} );
			}

			// If the "contextmenu" plugin is loaded, register the listeners.
			if ( editor.contextMenu ) {
				editor.contextMenu.addListener( function( element ) {
					if ( !element || element.isReadOnly() ) {
						return null;
					}

					var anchor = CKEDITOR.plugins.link.tryRestoreFakeAnchor( editor, element );

					if ( !anchor && !( anchor = CKEDITOR.plugins.link.getSelectedLink( editor ) ) ) {
						return null;
					}

					var menu = {};

					if ( anchor.getAttribute( 'href' ) && anchor.getChildCount() ) {
						menu = { link: CKEDITOR.TRISTATE_OFF, unlink: CKEDITOR.TRISTATE_OFF };
					}

					if ( anchor && anchor.hasAttribute( 'name' ) ) {
						menu.anchor = menu.removeAnchor = CKEDITOR.TRISTATE_OFF;
					}

					return menu;
				} );
			}

			this.compiledProtectionFunction = getCompiledProtectionFunction( editor );
		},

		afterInit: function( editor ) {
			// Empty anchors upcasting to fake objects.
			editor.dataProcessor.dataFilter.addRules( {
				elements: {
					a: function( element ) {
						if ( !element.attributes.name ) {
							return null;
						}

						if ( !element.children.length ) {
							return editor.createFakeParserElement( element, 'cke_anchor', 'anchor' );
						}

						return null;
					}
				}
			} );

			var pathFilters = editor._.elementsPath && editor._.elementsPath.filters;
			if ( pathFilters ) {
				pathFilters.push( function( element, name ) {
					if ( name == 'a' ) {
						if ( CKEDITOR.plugins.link.tryRestoreFakeAnchor( editor, element ) || ( element.getAttribute( 'name' ) && ( !element.getAttribute( 'href' ) || !element.getChildCount() ) ) ) {
							return 'anchor';
						}
					}
				} );
			}
		}
	} );

	// Loads the parameters in a selected link to the link dialog fields.
	var javascriptProtocolRegex = /^javascript:/,
		emailRegex = /^(?:mailto)(?:(?!\?(subject|body)=).)+/i,
		emailSubjectRegex = /subject=([^;?:@&=$,\/]*)/i,
		emailBodyRegex = /body=([^;?:@&=$,\/]*)/i,
		anchorRegex = /^#(.*)$/,
		urlRegex = /^((?:http|https|ftp|news):\/\/)?(.*)$/,
		selectableTargets = /^(_(?:self|top|parent|blank))$/,
		encodedEmailLinkRegex = /^javascript:void\(location\.href='mailto:'\+String\.fromCharCode\(([^)]+)\)(?:\+'(.*)')?\)$/,
		functionCallProtectedEmailLinkRegex = /^javascript:([^(]+)\(([^)]+)\)$/,
		popupRegex = /\s*window.open\(\s*this\.href\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*;\s*return\s*false;*\s*/,
		popupFeaturesRegex = /(?:^|,)([^=]+)=(\d+|yes|no)/gi,
		telRegex = /^tel:(.*)$/;

	var advAttrNames = {
		id: 'advId',
		dir: 'advLangDir',
		accessKey: 'advAccessKey',
		// 'data-cke-saved-name': 'advName',
		name: 'advName',
		lang: 'advLangCode',
		tabindex: 'advTabIndex',
		title: 'advTitle',
		type: 'advContentType',
		'class': 'advCSSClasses',
		charset: 'advCharset',
		style: 'advStyles',
		rel: 'advRel'
	};

	function unescapeSingleQuote( str ) {
		return str.replace( /\\'/g, '\'' );
	}

	function escapeSingleQuote( str ) {
		return str.replace( /'/g, '\\$&' );
	}

	function protectEmailAddressAsEncodedString( address ) {
		var length = address.length,
			encodedChars = [],
			charCode;

		for ( var i = 0; i < length; i++ ) {
			charCode = address.charCodeAt( i );
			encodedChars.push( charCode );
		}

		return 'String.fromCharCode(' + encodedChars.join( ',' ) + ')';
	}

	function protectEmailLinkAsFunction( editor, email ) {
		var plugin = editor.plugins.link,
			name = plugin.compiledProtectionFunction.name,
			params = plugin.compiledProtectionFunction.params,
			retval = [ name, '(' ],
			paramName,
			paramValue;

		for ( var i = 0; i < params.length; i++ ) {
			paramName = params[ i ].toLowerCase();
			paramValue = email[ paramName ];

			i > 0 && retval.push( ',' );
			retval.push( '\'', paramValue ? escapeSingleQuote( encodeURIComponent( email[ paramName ] ) ) : '', '\'' );
		}
		retval.push( ')' );
		return retval.join( '' );
	}

	function getCompiledProtectionFunction( editor ) {
		var emailProtection = editor.config.emailProtection || '',
			compiledProtectionFunction;

		// Compile the protection function pattern.
		if ( emailProtection && emailProtection != 'encode' ) {
			compiledProtectionFunction = {};

			emailProtection.replace( /^([^(]+)\(([^)]+)\)$/, function( match, funcName, params ) {
				compiledProtectionFunction.name = funcName;
				compiledProtectionFunction.params = [];
				params.replace( /[^,\s]+/g, function( param ) {
					compiledProtectionFunction.params.push( param );
				} );
			} );
		}

		return compiledProtectionFunction;
	}

	/**
	 * Set of Link plugin helpers.
	 *
	 * @class
	 * @singleton
	 */
	CKEDITOR.plugins.link = {
		/**
		 * Get the surrounding link element of the current selection.
		 *
		 *		CKEDITOR.plugins.link.getSelectedLink( editor );
		 *
		 *		// The following selections will all return the link element.
		 *
		 *		<a href="#">li^nk</a>
		 *		<a href="#">[link]</a>
		 *		text[<a href="#">link]</a>
		 *		<a href="#">li[nk</a>]
		 *		[<b><a href="#">li]nk</a></b>]
		 *		[<a href="#"><b>li]nk</b></a>
		 *
		 * @since 3.2.1
		 * @param {CKEDITOR.editor} editor
		 * @param {Boolean} [returnMultiple=false] Indicates whether the function should return only the first selected link or all of them.
		 * @returns {CKEDITOR.dom.element/CKEDITOR.dom.element[]/null} A single link element or an array of link
		 * elements relevant to the current selection.
		 */
		getSelectedLink: function( editor, returnMultiple ) {
			var selection = editor.getSelection(),
				selectedElement = selection.getSelectedElement(),
				ranges = selection.getRanges(),
				links = [],
				link,
				range;

			if ( !returnMultiple && selectedElement && selectedElement.is( 'a' ) ) {
				return selectedElement;
			}

			for ( var i = 0; i < ranges.length; i++ ) {
				range = selection.getRanges()[ i ];

				// Skip bogus to cover cases of multiple selection inside tables (#tp2245).
				// Shrink to element to prevent losing anchor (#859).
				range.shrink( CKEDITOR.SHRINK_ELEMENT, true, { skipBogus: true } );
				link = editor.elementPath( range.getCommonAncestor() ).contains( 'a', 1 );

				if ( link && returnMultiple ) {
					links.push( link );
				} else if ( link ) {
					return link;
				}
			}

			return returnMultiple ? links : null;
		},

		/**
		 * Collects anchors available in the editor (i.e. used by the Link plugin).
		 * Note that the scope of search is different for inline (the "global" document) and
		 * classic (`iframe`-based) editors (the "inner" document).
		 *
		 * @since 4.3.3
		 * @param {CKEDITOR.editor} editor
		 * @returns {CKEDITOR.dom.element[]} An array of anchor elements.
		 */
		getEditorAnchors: function( editor ) {
			var editable = editor.editable(),

				// The scope of search for anchors is the entire document for inline editors
				// and editor's editable for classic editor/divarea (https://dev.ckeditor.com/ticket/11359).
				scope = ( editable.isInline() && !editor.plugins.divarea ) ? editor.document : editable,

				links = scope.getElementsByTag( 'a' ),
				imgs = scope.getElementsByTag( 'img' ),
				anchors = [],
				iterator = 0,
				item;

			// Retrieve all anchors within the scope.
			while ( ( item = links.getItem( iterator++ ) ) ) {
				if ( item.data( 'cke-saved-name' ) || item.hasAttribute( 'name' ) ) {
					anchors.push( {
						name: item.data( 'cke-saved-name' ) || item.getAttribute( 'name' ),
						id: item.getAttribute( 'id' )
					} );
				}
			}
			// Retrieve all "fake anchors" within the scope.
			iterator = 0;

			while ( ( item = imgs.getItem( iterator++ ) ) ) {
				if ( ( item = this.tryRestoreFakeAnchor( editor, item ) ) ) {
					anchors.push( {
						name: item.getAttribute( 'name' ),
						id: item.getAttribute( 'id' )
					} );
				}
			}

			return anchors;
		},

		/**
		 * Opera and WebKit do not make it possible to select empty anchors. Fake
		 * elements must be used for them.
		 *
		 * @readonly
		 * @deprecated 4.3.3 It is set to `true` in every browser.
		 * @property {Boolean}
		 */
		fakeAnchor: true,

		/**
		 * For browsers that do not support CSS3 `a[name]:empty()`. Note that IE9 is included because of https://dev.ckeditor.com/ticket/7783.
		 *
		 * @readonly
		 * @deprecated 4.3.3 It is set to `false` in every browser.
		 * @property {Boolean} synAnchorSelector
		 */

		/**
		 * For browsers that have editing issues with an empty anchor.
		 *
		 * @readonly
		 * @deprecated 4.3.3 It is set to `false` in every browser.
		 * @property {Boolean} emptyAnchorFix
		 */

		/**
		 * Returns an element representing a real anchor restored from a fake anchor.
		 *
		 * @param {CKEDITOR.editor} editor
		 * @param {CKEDITOR.dom.element} element
		 * @returns {CKEDITOR.dom.element} Restored anchor element or nothing if the
		 * passed element was not a fake anchor.
		 */
		tryRestoreFakeAnchor: function( editor, element ) {
			if ( element && element.data( 'cke-real-element-type' ) && element.data( 'cke-real-element-type' ) == 'anchor' ) {
				var link = editor.restoreRealElement( element );
				if ( link.data( 'cke-saved-name' ) ) {
					return link;
				}
			}
		},

		/**
		 * Parses attributes of the link element and returns an object representing
		 * the current state (data) of the link. This data format is a plain object accepted
		 * e.g. by the Link dialog window and {@link #getLinkAttributes}.
		 *
		 * **Note:** Data model format produced by the parser must be compatible with the Link
		 * plugin dialog because it is passed directly to {@link CKEDITOR.dialog#setupContent}.
		 *
		 * @since 4.4.0
		 * @param {CKEDITOR.editor} editor
		 * @param {CKEDITOR.dom.element} element
		 * @returns {Object} An object of link data.
		 */
		parseLinkAttributes: function( editor, element ) {
			var href = ( element && ( element.data( 'cke-saved-href' ) || element.getAttribute( 'href' ) ) ) || '',
				compiledProtectionFunction = editor.plugins.link.compiledProtectionFunction,
				emailProtection = editor.config.emailProtection,
				retval = {},
				javascriptMatch = href.match( javascriptProtocolRegex ),
				emailMatch,
				anchorMatch,
				urlMatch,
				telMatch;

			if ( javascriptMatch ) {
				if ( emailProtection == 'encode' ) {
					href = href.replace( encodedEmailLinkRegex, function( match, protectedAddress, rest ) {
						// Without it 'undefined' is appended to e-mails without subject and body (https://dev.ckeditor.com/ticket/9192).
						rest = rest || '';

						return 'mailto:' +
							String.fromCharCode.apply( String, protectedAddress.split( ',' ) ) +
							unescapeSingleQuote( rest );
					} );
				}
				// Protected email link as function call.
				else if ( emailProtection ) {
					href.replace( functionCallProtectedEmailLinkRegex, function( match, funcName, funcArgs ) {
						if ( funcName == compiledProtectionFunction.name ) {
							retval.type = 'email';

							var email = retval.email = {},
								paramRegex = /[^,\s]+/g,
								paramQuoteRegex = /(^')|('$)/g,
								paramsMatch = funcArgs.match( paramRegex ),
								paramsMatchLength = paramsMatch.length,
								paramName,
								paramVal;

							for ( var i = 0; i < paramsMatchLength; i++ ) {
								paramVal = decodeURIComponent( unescapeSingleQuote( paramsMatch[ i ].replace( paramQuoteRegex, '' ) ) );
								paramName = compiledProtectionFunction.params[ i ].toLowerCase();
								email[ paramName ] = paramVal;
							}
							email.address = [ email.name, email.domain ].join( '@' );
						}
					} );
				}
			}

			if ( !retval.type ) {
				if ( ( anchorMatch = href.match( anchorRegex ) ) ) {
					retval.type = 'anchor';
					retval.anchor = {};
					retval.anchor.name = retval.anchor.id = anchorMatch[ 1 ];
				} else if ( ( telMatch = href.match( telRegex ) ) ) {
					retval.type = 'tel';
					retval.tel = telMatch[ 1 ];
				}
				// Protected email link as encoded string.
				else if ( ( emailMatch = href.match( emailRegex ) ) ) {
					var subjectMatch = href.match( emailSubjectRegex ),
						bodyMatch = href.match( emailBodyRegex ),
						email = ( retval.email = {} );

					retval.type = 'email';
					email.address = emailMatch[ 0 ].replace( 'mailto:', '' );
					subjectMatch && ( email.subject = decodeURIComponent( subjectMatch[ 1 ] ) );
					bodyMatch && ( email.body = decodeURIComponent( bodyMatch[ 1 ] ) );
				}
				// urlRegex matches empty strings, so need to check for href as well.
				else if ( href && ( urlMatch = href.match( urlRegex ) ) ) {
					retval.type = 'url';
					retval.url = {};
					retval.url.protocol = urlMatch[ 1 ];
					retval.url.url = urlMatch[ 2 ];
				}
			}

			// Load target and popup settings.
			if ( element ) {
				var target = element.getAttribute( 'target' );

				// IE BUG: target attribute is an empty string instead of null in IE if it's not set.
				if ( !target ) {
					var onclick = element.data( 'cke-pa-onclick' ) || element.getAttribute( 'onclick' ),
						onclickMatch = onclick && onclick.match( popupRegex );

					if ( onclickMatch ) {
						retval.target = {
							type: 'popup',
							name: onclickMatch[ 1 ]
						};

						var featureMatch;
						while ( ( featureMatch = popupFeaturesRegex.exec( onclickMatch[ 2 ] ) ) ) {
							// Some values should remain numbers (https://dev.ckeditor.com/ticket/7300)
							if ( ( featureMatch[ 2 ] == 'yes' || featureMatch[ 2 ] == '1' ) && !( featureMatch[ 1 ] in { height: 1, width: 1, top: 1, left: 1 } ) ) {
								retval.target[ featureMatch[ 1 ] ] = true;
							} else if ( isFinite( featureMatch[ 2 ] ) ) {
								retval.target[ featureMatch[ 1 ] ] = featureMatch[ 2 ];
							}
						}
					}
				} else {
					retval.target = {
						type: target.match( selectableTargets ) ? target : 'frame',
						name: target
					};
				}

				var download = element.getAttribute( 'download' );
				if ( download !== null ) {
					retval.download = true;
				}

				var advanced = {};
				for ( var a in advAttrNames ) {
					var val = element.getAttribute( a );

					if ( val ) {
						advanced[ advAttrNames[ a ] ] = val;
					}
				}

				var advName = element.data( 'cke-saved-name' ) || advanced.advName;
				if ( advName ) {
					advanced.advName = advName;
				}

				if ( !CKEDITOR.tools.isEmpty( advanced ) ) {
					retval.advanced = advanced;
				}
			}

			return retval;
		},

		/**
		 * Converts link data produced by {@link #parseLinkAttributes} into an object which consists
		 * of attributes to be set (with their values) and an array of attributes to be removed.
		 * This method can be used to compose or to update any link element with the given data.
		 *
		 * @since 4.4.0
		 * @param {CKEDITOR.editor} editor
		 * @param {Object} data Data in {@link #parseLinkAttributes} format.
		 * @returns {Object} An object consisting of two keys, i.e.:
		 *
		 *		{
		 *			// Attributes to be set.
		 *			set: {
		 *				href: 'http://foo.bar',
		 *				target: 'bang'
		 *			},
		 *			// Attributes to be removed.
		 *			removed: [
		 *				'id', 'style'
		 *			]
		 *		}
		 *
		 */
		getLinkAttributes: function( editor, data ) {
			var emailProtection = editor.config.emailProtection || '',
				set = {};

			// Compose the URL.
			switch ( data.type ) {
				case 'url':
					var protocol = ( data.url && data.url.protocol !== undefined ) ? data.url.protocol : 'http://',
						url = ( data.url && CKEDITOR.tools.trim( data.url.url ) ) || '';

					set[ 'data-cke-saved-href' ] = ( url.indexOf( '/' ) === 0 ) ? url : protocol + url;
					break;

				case 'anchor':
					var name = ( data.anchor && data.anchor.name ),
						id = ( data.anchor && data.anchor.id );

					set[ 'data-cke-saved-href' ] = '#' + ( name || id || '' );
					break;

				case 'email':
					var email = data.email,
						address = email.address,
						linkHref;

					switch ( emailProtection ) {
						case '':
						case 'encode':
							var subject = encodeURIComponent( email.subject || '' ),
								body = encodeURIComponent( email.body || '' ),
								argList = [];

							// Build the e-mail parameters first.
							subject && argList.push( 'subject=' + subject );
							body && argList.push( 'body=' + body );
							argList = argList.length ? '?' + argList.join( '&' ) : '';

							if ( emailProtection == 'encode' ) {
								linkHref = [
									'javascript:void(location.href=\'mailto:\'+', // jshint ignore:line
									protectEmailAddressAsEncodedString( address )
								];
								// parameters are optional.
								argList && linkHref.push( '+\'', escapeSingleQuote( argList ), '\'' );

								linkHref.push( ')' );
							} else {
								linkHref = [ 'mailto:', address, argList ];
							}
							break;

						default:
							// Separating name and domain.
							var nameAndDomain = address.split( '@', 2 );
							email.name = nameAndDomain[ 0 ];
							email.domain = nameAndDomain[ 1 ];

							linkHref = [ 'javascript:', protectEmailLinkAsFunction( editor, email ) ]; // jshint ignore:line
					}
					set[ 'data-cke-saved-href' ] = linkHref.join( '' );
					break;

				case 'tel':
					set[ 'data-cke-saved-href' ] = 'tel:' + data.tel;
					break;
			}

			// Popups and target.
			if ( data.target ) {
				if ( data.target.type == 'popup' ) {
					var onclickList = [
							'window.open(this.href, \'', data.target.name || '', '\', \''
						],
						featureList = [
							'resizable', 'status', 'location', 'toolbar', 'menubar', 'fullscreen', 'scrollbars', 'dependent'
						],
						featureLength = featureList.length,
						addFeature = function( featureName ) {
							if ( data.target[ featureName ] ) {
								featureList.push( featureName + '=' + data.target[ featureName ] );
							}
						};

					for ( var i = 0; i < featureLength; i++ ) {
						featureList[ i ] = featureList[ i ] + ( data.target[ featureList[ i ] ] ? '=yes' : '=no' );
					}

					addFeature( 'width' );
					addFeature( 'left' );
					addFeature( 'height' );
					addFeature( 'top' );

					onclickList.push( featureList.join( ',' ), '\'); return false;' );
					set[ 'data-cke-pa-onclick' ] = onclickList.join( '' );
				}
				else if ( data.target.type != 'notSet' && data.target.name ) {
					set.target = data.target.name;
				}
			}

			// Force download attribute.
			if ( data.download ) {
				set.download = '';
			}

			// Advanced attributes.
			if ( data.advanced ) {
				for ( var a in advAttrNames ) {
					var val = data.advanced[ advAttrNames[ a ] ];

					if ( val ) {
						set[ a ] = val;
					}
				}

				if ( set.name ) {
					set[ 'data-cke-saved-name' ] = set.name;
				}
			}

			// Browser need the "href" fro copy/paste link to work. (https://dev.ckeditor.com/ticket/6641)
			if ( set[ 'data-cke-saved-href' ] ) {
				set.href = set[ 'data-cke-saved-href' ];
			}

			var removed = {
				target: 1,
				onclick: 1,
				'data-cke-pa-onclick': 1,
				'data-cke-saved-name': 1,
				'download': 1
			};

			if ( data.advanced ) {
				CKEDITOR.tools.extend( removed, advAttrNames );
			}

			// Remove all attributes which are not currently set.
			for ( var s in set ) {
				delete removed[ s ];
			}

			return {
				set: set,
				removed: CKEDITOR.tools.object.keys( removed )
			};
		},


		/**
		 * Determines whether an element should have a "Display Text" field in the Link dialog.
		 *
		 * @since 4.5.11
		 * @param {CKEDITOR.dom.element/null} element Selected element, `null` if none selected or if a ranged selection
		 * is made.
		 * @param {CKEDITOR.editor} editor The editor instance for which the check is performed.
		 * @returns {Boolean}
		 */
		showDisplayTextForElement: function( element, editor ) {
			var undesiredElements = {
					img: 1,
					table: 1,
					tbody: 1,
					thead: 1,
					tfoot: 1,
					input: 1,
					select: 1,
					textarea: 1
				},
				selection = editor.getSelection();

			// Widget duck typing, we don't want to show display text for widgets.
			if ( editor.widgets && editor.widgets.focused ) {
				return false;
			}

			if ( selection && selection.getRanges().length > 1 ) {
				return false;
			}

			return !element || !element.getName || !element.is( undesiredElements );
		}
	};

	// TODO Much probably there's no need to expose these as public objects.

	CKEDITOR.unlinkCommand = function() {};
	CKEDITOR.unlinkCommand.prototype = {
		exec: function( editor ) {
			// IE/Edge removes link from selection while executing "unlink" command when cursor
			// is right before/after link's text. Therefore whole link must be selected and the
			// position of cursor must be restored to its initial state after unlinking. (https://dev.ckeditor.com/ticket/13062)
			if ( CKEDITOR.env.ie ) {
				var range = editor.getSelection().getRanges()[ 0 ],
					link = ( range.getPreviousEditableNode() && range.getPreviousEditableNode().getAscendant( 'a', true ) ) ||
						( range.getNextEditableNode() && range.getNextEditableNode().getAscendant( 'a', true ) ),
					bookmark;

				if ( range.collapsed && link ) {
					bookmark = range.createBookmark();
					range.selectNodeContents( link );
					range.select();
				}
			}

			var style = new CKEDITOR.style( { element: 'a', type: CKEDITOR.STYLE_INLINE, alwaysRemoveElement: 1 } );
			editor.removeStyle( style );

			if ( bookmark ) {
				range.moveToBookmark( bookmark );
				range.select();
			}
		},

		refresh: function( editor, path ) {
			// Despite our initial hope, document.queryCommandEnabled() does not work
			// for this in Firefox. So we must detect the state by element paths.

			var element = path.lastElement && path.lastElement.getAscendant( 'a', true );

			if ( element && element.getName() == 'a' && element.getAttribute( 'href' ) && element.getChildCount() ) {
				this.setState( CKEDITOR.TRISTATE_OFF );
			} else {
				this.setState( CKEDITOR.TRISTATE_DISABLED );
			}
		},

		contextSensitive: 1,
		startDisabled: 1,
		requiredContent: 'a[href]',
		editorFocus: 1
	};

	CKEDITOR.removeAnchorCommand = function() {};
	CKEDITOR.removeAnchorCommand.prototype = {
		exec: function( editor ) {
			var sel = editor.getSelection(),
				bms = sel.createBookmarks(),
				anchor;

			if ( sel && ( anchor = sel.getSelectedElement() ) && ( !anchor.getChildCount() ? CKEDITOR.plugins.link.tryRestoreFakeAnchor( editor, anchor ) : anchor.is( 'a' ) ) ) {
				anchor.remove( 1 );
			} else {
				if ( ( anchor = CKEDITOR.plugins.link.getSelectedLink( editor ) ) ) {
					if ( anchor.hasAttribute( 'href' ) ) {
						anchor.removeAttributes( { name: 1, 'data-cke-saved-name': 1 } );
						anchor.removeClass( 'cke_anchor' );
					} else {
						anchor.remove( 1 );
					}
				}
			}
			sel.selectBookmarks( bms );
		},
		requiredContent: 'a[name]'
	};

	CKEDITOR.tools.extend( CKEDITOR.config, {
		/**
		 * Whether to show the Advanced tab in the Link dialog window.
		 *
		 * @cfg {Boolean} [linkShowAdvancedTab=true]
		 * @member CKEDITOR.config
		 */
		linkShowAdvancedTab: true,

		/**
		 * Whether to show the Target tab in the Link dialog window.
		 *
		 * @cfg {Boolean} [linkShowTargetTab=true]
		 * @member CKEDITOR.config
		 */
		linkShowTargetTab: true,

		/**
		 * Default URL protocol used for the Link dialog.
		 *
		 * Available values are:
		 *
		 * * `'http://'`
		 * * `'https://'`
		 * * `'ftp://'`
		 * * `'news://'`
		 * * `''` &mdash; An empty string for the `<other>` option.
		 *
		 * ```js
		 * config.linkDefaultProtocol = 'https://';
		 * ```
		 *
		 * @cfg {String}
		 * @member CKEDITOR.config
		 * @since 4.13.0
		 */
		linkDefaultProtocol: 'http://'

		/**
		 * Whether JavaScript code is allowed as a `href` attribute in an anchor tag.
		 * With this option enabled it is possible to create links like:
		 *
		 * ```html
		 * <a href="javascript:alert('Hello world!')">hello world</a>
		 * ```
		 *
		 * By default JavaScript links are not allowed and will not pass
		 * the Link dialog window validation.
		 *
		 * @since 4.4.1
		 * @cfg {Boolean} [linkJavaScriptLinksAllowed=false]
		 * @member CKEDITOR.config
		 */

		/**
		 * Optional JavaScript regular expression used whenever phone numbers in the Link dialog should be validated.
		 *
		 * ```js
		 * config.linkPhoneRegExp = /^[0-9]{9}$/;
		 * ```
		 *
		 * @since 4.11.0
		 * @cfg {RegExp} [linkPhoneRegExp]
		 * @member CKEDITOR.config
		 */

		/**
		 * Optional message for the alert popup used when the phone number in the Link dialog does not pass the validation.
		 *
		 * ```js
		 * config.linkPhoneMsg = "Invalid number";
		 * ```
		 *
		 * @since 4.11.0
		 * @cfg {String} [linkPhoneMsg]
		 * @member CKEDITOR.config
		 */
	} );
} )();
