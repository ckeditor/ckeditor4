/* exported pfwTools */

( function() {
	'use strict';

	window.pfwTools = {
		// Preferred editor config for generated tests.
		defaultConfig: {
			language: 'en',
			removePlugins: 'dialogadvtab,showborders,horizontalrule,language',
			colorButton_normalizeBackground: false,
			extraAllowedContent: 'span{line-height,background,font-weight,font-style,text-decoration,text-underline,display,' +
				'page-break-before,height,tab-stops,layout-grid-mode,text-justify,-ms-layout-grid-mode,-ms-text-justify,' +
				'unicode-bidi,direction,dir,lang,page-break-after};td[valign]',
			disallowedContent: 'td{vertical-align};p{text-indent};span{text-indent}'
		},
		// Preferred editor config for generated tests with PFW Image.
		imageDefaultConfig: {
			language: 'en',
			removePlugins: 'dialogadvtab,showborders,horizontalrule',
			colorButton_normalizeBackground: false,
			extraAllowedContent: 'span{line-height,background,font-weight,font-size,font-style,text-decoration,text-underline,display,' +
				'page-break-before,height,tab-stops,layout-grid-mode,text-justify,-ms-layout-grid-mode,-ms-text-justify,' +
				'unicode-bidi,direction,dir,lang,page-break-after};td[valign];img[src,alt]{height,width,float};a[href];td[colspan,rowspan]',
			disallowedContent: 'td{vertical-align};*[data-cke-*];span{font-family}'
		},

		// Filters for use in compatHtml in tests.
		filters: {
			span: new CKEDITOR.htmlParser.filter( {
				elements: {
					span: function sortStyles( element ) {
						var parent = element.parent,
							style;

						function isStyleElement( element ) {
							return !!element.attributes.style;
						}

						function isColorStyle( element ) {
							return element.attributes.style.indexOf( 'color' ) !== -1;
						}

						function needSorting( element ) {
							var parent = element.parent;

							if ( !isStyleElement( element ) || !isStyleElement( parent ) ||
								( isColorStyle( element ) && isColorStyle( parent ) ) ) {
								return false;
							}

							return element.attributes.style < parent.attributes.style;
						}

						if ( !parent || parent.name !== 'span' || !needSorting( element ) ) {
							return;
						}

						style = element.attributes.style;

						element.attributes.style = parent.attributes.style;
						parent.attributes.style = style;

						sortStyles( parent );
					}
				}
			} ),

			font: new CKEDITOR.htmlParser.filter( {
				elements: {
					font: function sortStyles( element ) {
						var parent = element.parent,
							attributes;

						function needSorting( element ) {
							var keys = CKEDITOR.tools.object.keys,
								parent = element.parent,
								parentAttrs = keys( parent.attributes ),
								elementAttrs = keys( element.attributes );

							if ( elementAttrs[ 0 ] === parentAttrs[ 0 ] ) {
								return element.attributes[ elementAttrs[ 0 ] ] < parent.attributes[ parentAttrs[ 0 ] ];
							}

							return elementAttrs[ 0 ] < parentAttrs[ 0 ];
						}

						if ( !parent || parent.name !== 'font' || !needSorting( element ) ) {
							return;
						}

						attributes = element.attributes;

						element.attributes = parent.attributes;
						parent.attributes = attributes;

						sortStyles( parent );
					}
				}
			} ),

			// Firefox adds quotes around all fonts in font-family.
			// Safari replaces `"` with `'` in quoted font names.
			style: new CKEDITOR.htmlParser.filter( {
				attributes: {
					style: function( attribute ) {
						if ( attribute.indexOf( 'font-family' ) === -1 ) {
							return;
						}

						return attribute.replace( /"/g, '' ).replace( /'/g, '' );
					}
				}
			} )
		}
	};
} )();

