/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'copyformattingtext', {
		requires: 'copyformatting',

		init: function( editor ) {
			// Adding desired computed styles.
			editor.copyFormatting.on( 'extractFormatting', function( evt ) {
				var evtData = evt.data,
					element = evtData.element,
					styles = evtData.styleDef.styles,
					computedStyles = editor.config.copyFormatting_computedStyles || [],
					i;

				if ( !evtData.oldStyles ) {
					for ( i = 0; i < computedStyles.length; i++ ) {
						styles[ computedStyles[ i ] ] = element.getComputedStyle( computedStyles[ i ] );
					}
				}
			}, null, null, 20 );
		}
	} );

	/**
	 * Define which computed styles should be copied by the
	 * "Copy Formatting" feature.
	 *
	 *		config.copyFormatting_computedStyles = [
	 *			'font-size',
	 *			'font-weight',
	 *			'font-style',
	 *			'text-decoration'
	 *		];
	 *
	 * If you want to disable copying computed styles, pass
	 * empty array to this variable:
	 *
	 *		config.copyFormatting_computedStyles = [];
	 *
	 * @cfg [copyFormatting_computedStyles=[
	 *		'font-size',
	 *		'font-weight',
	 *		'font-style',
	 *		'text-decoration'
	 *	]]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.copyFormatting_computedStyles = [
		'font-size',
		'font-weight',
		'font-style',
		'text-decoration'
	];
} )();
