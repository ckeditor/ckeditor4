/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

( function() {
	var cssStyle = CKEDITOR.htmlParser.cssStyle,
		cssLength = CKEDITOR.tools.cssLength;

	var cssLengthRegex = /^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i;

	// Replacing the former CSS length value with the later one, with
	// adjustment to the length  unit.
	function replaceCssLength( length1, length2 ) {
		var parts1 = cssLengthRegex.exec( length1 ),
			parts2 = cssLengthRegex.exec( length2 );

		// Omit pixel length unit when necessary,
		// e.g. replaceCssLength( 10, '20px' ) -> 20
		if ( parts1 ) {
			if ( !parts1[ 2 ] && parts2[ 2 ] == 'px' )
				return parts2[ 1 ];
			if ( parts1[ 2 ] == 'px' && !parts2[ 2 ] )
				return parts2[ 1 ] + 'px';
		}

		return length2;
	}

	CKEDITOR.plugins.add( 'fakeobjects', {
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength

		init: function( editor ) {
			// Allow image with all styles and classes plus src, alt and title attributes.
			// We need them when fakeobject is pasted.
			editor.filter.allow( 'img[!data-cke-realelement,src,alt,title](*){*}', 'fakeobjects' );
		},

		afterInit: function( editor ) {
			var dataProcessor = editor.dataProcessor,
				htmlFilter = dataProcessor && dataProcessor.htmlFilter;

			if ( htmlFilter ) {
				htmlFilter.addRules( createHtmlFilterRules( editor ), {
					applyToAll: true
				} );
			}
		}
	} );

	/**
	 * Creates fake {@link CKEDITOR.dom.element} based on real element.
	 * Fake element is an img with special attributes, which keep real element properties.
	 *
	 * @member CKEDITOR.editor
	 * @param {CKEDITOR.dom.element} realElement Real element to transform.
	 * @param {String} className Class name which will be used as class of fake element.
	 * @param {String} realElementType Stores type of fake element.
	 * @param {Boolean} isResizable Keeps information if element is resizable.
	 * @returns {CKEDITOR.dom.element} Fake element.
	 */
	CKEDITOR.editor.prototype.createFakeElement = function( realElement, className, realElementType, isResizable ) {
		var lang = this.lang.fakeobjects,
			label = lang[ realElementType ] || lang.unknown;

		var attributes = {
			'class': className,
			'data-cke-realelement': encodeURIComponent( realElement.getOuterHtml() ),
			'data-cke-real-node-type': realElement.type,
			alt: label,
			title: label,
			align: realElement.getAttribute( 'align' ) || ''
		};

		// Do not set "src" on high-contrast so the alt text is displayed. (https://dev.ckeditor.com/ticket/8945)
		if ( !CKEDITOR.env.hc )
			attributes.src = CKEDITOR.tools.transparentImageData;

		if ( realElementType )
			attributes[ 'data-cke-real-element-type' ] = realElementType;

		if ( isResizable ) {
			attributes[ 'data-cke-resizable' ] = isResizable;

			var fakeStyle = new cssStyle();

			var width = realElement.getAttribute( 'width' ),
				height = realElement.getAttribute( 'height' );

			width && ( fakeStyle.rules.width = cssLength( width ) );
			height && ( fakeStyle.rules.height = cssLength( height ) );
			fakeStyle.populate( attributes );
		}

		return this.document.createElement( 'img', { attributes: attributes } );
	};

	/**
	 * Creates fake {@link CKEDITOR.htmlParser.element} based on real element.
	 *
	 * @member CKEDITOR.editor
	 * @param {CKEDITOR.dom.element} realElement Real element to transform.
	 * @param {String} className Class name which will be used as class of fake element.
	 * @param {String} realElementType Store type of fake element.
	 * @param {Boolean} isResizable Keep information if element is resizable.
	 * @returns {CKEDITOR.htmlParser.element} Fake htmlParser element.
	 */
	CKEDITOR.editor.prototype.createFakeParserElement = function( realElement, className, realElementType, isResizable ) {
		var lang = this.lang.fakeobjects,
			label = lang[ realElementType ] || lang.unknown,
			html;

		var writer = new CKEDITOR.htmlParser.basicWriter();
		realElement.writeHtml( writer );
		html = writer.getHtml();

		var attributes = {
			'class': className,
			'data-cke-realelement': encodeURIComponent( html ),
			'data-cke-real-node-type': realElement.type,
			alt: label,
			title: label,
			align: realElement.attributes.align || ''
		};

		// Do not set "src" on high-contrast so the alt text is displayed. (https://dev.ckeditor.com/ticket/8945)
		if ( !CKEDITOR.env.hc )
			attributes.src = CKEDITOR.tools.transparentImageData;

		if ( realElementType )
			attributes[ 'data-cke-real-element-type' ] = realElementType;

		if ( isResizable ) {
			attributes[ 'data-cke-resizable' ] = isResizable;
			var realAttrs = realElement.attributes,
				fakeStyle = new cssStyle();

			var width = realAttrs.width,
				height = realAttrs.height;

			width !== undefined && ( fakeStyle.rules.width = cssLength( width ) );
			height !== undefined && ( fakeStyle.rules.height = cssLength( height ) );
			fakeStyle.populate( attributes );
		}

		return new CKEDITOR.htmlParser.element( 'img', attributes );
	};

	/**
	 * Creates {@link CKEDITOR.dom.element} from fake element.
	 *
	 * @member CKEDITOR.editor
	 * @param {CKEDITOR.dom.element} fakeElement Fake element to transform.
	 * @returns {CKEDITOR.dom.element/null} Returns real element or `null` if transformed element wasn't fake.
	 */
	CKEDITOR.editor.prototype.restoreRealElement = function( fakeElement ) {
		if ( fakeElement.data( 'cke-real-node-type' ) != CKEDITOR.NODE_ELEMENT )
			return null;

		var realElementHtml = decodeURIComponent( fakeElement.data( 'cke-realelement' ) ),
			filteredHtml = filterHtml( this, realElementHtml ),
			realElement = CKEDITOR.dom.element.createFromHtml( filteredHtml, this.document );

		if ( fakeElement.data( 'cke-resizable' ) ) {
			var width = fakeElement.getStyle( 'width' ),
				height = fakeElement.getStyle( 'height' );

			width && realElement.setAttribute( 'width', replaceCssLength( realElement.getAttribute( 'width' ), width ) );
			height && realElement.setAttribute( 'height', replaceCssLength( realElement.getAttribute( 'height' ), height ) );
		}

		return realElement;
	};

	function createHtmlFilterRules( editor ) {
		return {
			elements: {
				$: function( element ) {
					var attributes = element.attributes,
						realHtml = attributes && attributes[ 'data-cke-realelement' ],
						filteredRealHtml = filterHtml( editor, decodeURIComponent( realHtml ) ),
						realFragment = realHtml && new CKEDITOR.htmlParser.fragment.fromHtml( filteredRealHtml ),
						realElement = realFragment && realFragment.children[ 0 ];

					// Width/height in the fake object are subjected to clone into the real element.
					if ( realElement && element.attributes[ 'data-cke-resizable' ] ) {
						var styles = new cssStyle( element ).rules,
							realAttrs = realElement.attributes,
							width = styles.width,
							height = styles.height;

						width && ( realAttrs.width = replaceCssLength( realAttrs.width, width ) );
						height && ( realAttrs.height = replaceCssLength( realAttrs.height, height ) );
					}

					return realElement;
				}
			}
		};
	}

	// Content stored inside fake element is raw and should be explicitly
	// passed to ACF filter. Additionally some elements can have prefixes in tag names,
	// which should be removed before filtering and added after it.
	function filterHtml( editor, html ) {
		var unprefixedElements = [],
			prefixRegex = /^cke:/i,
			dataFilter =  new CKEDITOR.htmlParser.filter( {
				elements: {
					'^': function( element ) {
						if ( prefixRegex.test( element.name ) ) {
							element.name = element.name.replace( prefixRegex, '' );

							unprefixedElements.push( element );
						}
					},
					iframe: function( element ) {
						element.children = [];
					}
				}
			} ),
			acfFilter = editor.activeFilter,
			writer = new CKEDITOR.htmlParser.basicWriter(),
			fragment = CKEDITOR.htmlParser.fragment.fromHtml( html );

		dataFilter.applyTo( fragment );
		acfFilter.applyTo( fragment );

		CKEDITOR.tools.array.forEach( unprefixedElements, function( element ) {
			element.name = 'cke:' + element.name;
		} );

		fragment.writeHtml( writer );

		return writer.getHtml();
	}
} )();
