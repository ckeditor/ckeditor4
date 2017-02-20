/* exported pfwTools */

( function() {
	'use strict';

	window.pfwTools = {
		// Preferred editor config for generated tests.
		defaultConfig: {
			language: 'en',
			removePlugins: 'dialogadvtab,flash,showborders,horizontalrule',
			colorButton_normalizeBackground: false,
			extraAllowedContent: 'span{line-height,background,font-weight,font-style,text-decoration,text-underline,display,' +
				'page-break-before,height,tab-stops,layout-grid-mode,text-justify,-ms-layout-grid-mode,-ms-text-justify,' +
				'unicode-bidi,direction,dir,lang,page-break-after};td[valign]',
			disallowedContent: 'td{vertical-align}'
		},

		// Filters for use in compatHtml in tests.
		filters: [
			new CKEDITOR.htmlParser.filter( {
				elements: {
					span: function sortStyles( element ) {
						var parent = element.parent,
							style;

						if ( !parent || parent.name !== 'span' ) {
							return;
						}

						if ( element.attributes.style && parent.attributes.style &&
							element.attributes.style < parent.attributes.style ) {
							style = element.attributes.style;

							element.attributes.style = parent.attributes.style;
							parent.attributes.style = style;

							sortStyles( parent );
						}
					}
				}
			} )
		]
	};
} )();

