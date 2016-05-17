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
					indexOf = CKEDITOR.tools.indexOf,
					computedStyles,
					i;

				if ( indexOf( [ 'ul', 'ol', 'li' ], element.getName() ) !== -1 ) {
					computedStyles = editor.config.copyFormatting_listsComputedStyles;
				} else if ( indexOf( [ 'table', 'thead', 'tbody', 'tr', 'th', 'td' ], element.getName() ) !== -1 ) {
					computedStyles = editor.config.copyFormatting_tableComputedStyles;
				} else {
					computedStyles = editor.config.copyFormatting_computedStyles;
				}

				if ( !CKEDITOR.tools.isArray( computedStyles ) ) {
					return;
				}

				for ( i = 0; i < computedStyles.length; i++ ) {
					styles[ computedStyles[ i ] ] = element.getComputedStyle( computedStyles[ i ] );
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
		'color',
		'font-size',
		'font-weight',
		'font-style',
		'text-decoration'
	];

	/**
	 * Define which computed styles should be copied by the
	 * "Copy Formatting" feature from list elements and items.
	 *
	 *		config.copyFormatting_listsComputedStyles = [
	 *			'color',
	 *			'background',
	 *			'font-size',
	 *			'font-weight',
	 *			'font-style',
	 *			'text-decoration'
	 *		];
	 *
	 * If you want to disable copying computed styles from list
	 * elements and items, pass empty array to this variable:
	 *
	 *		config.copyFormatting_listsComputedStyles = [];
	 *
	 * @cfg [copyFormatting_listsComputedStyles=[
	 *		'color',
	 *		'background',
	 *		'font-size',
	 *		'font-weight',
	 *		'font-style',
	 *		'text-decoration'
	 *	]]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.copyFormatting_listsComputedStyles = [
		'color',
		'background',
		'font-size',
		'font-weight',
		'font-style',
		'text-decoration'
	];

	/**
	 * Define which computed styles should be copied by the
	 * "Copy Formatting" feature from table elements.
	 *
	 *		config.copyFormatting_tableComputedStyles = [
	 *			'color',
	 *			'background',
	 *			'font-size',
	 *			'font-weight',
	 *			'font-style',
	 *			'text-decoration'
	 *		];
	 *
	 * If you want to disable copying computed styles from table
	 * elements, pass empty array to this variable:
	 *
	 *		config.copyFormatting_tableComputedStyles = [];
	 *
	 * @cfg [copyFormatting_tableComputedStyles=[
	 *		'color',
	 *		'background',
	 *		'font-size',
	 *		'font-weight',
	 *		'font-style',
	 *		'text-decoration'
	 *	]]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.copyFormatting_tableComputedStyles = [
		'color',
		'background',
		'font-size',
		'font-weight',
		'font-style',
		'text-decoration'
	];
} )();
