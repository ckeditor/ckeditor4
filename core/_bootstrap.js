/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview API initialization code.
 */

( function() {
	// Check whether high contrast is active by creating a colored border.
	var hcDetect = CKEDITOR.dom.element.createFromHtml( '<div style="width:0;height:0;position:absolute;left:-10000px;' +
		'border:1px solid;border-color:red blue"></div>', CKEDITOR.document );

	hcDetect.appendTo( CKEDITOR.document.getHead() );

	// Update CKEDITOR.env.
	// Catch exception needed sometimes for FF. (https://dev.ckeditor.com/ticket/4230)
	try {
		var top = hcDetect.getComputedStyle( 'border-top-color' ),
			right = hcDetect.getComputedStyle( 'border-right-color' );

		// We need to check if getComputedStyle returned any value, because on FF
		// it returnes empty string if CKEditor is loaded in hidden iframe. (https://dev.ckeditor.com/ticket/11121)
		CKEDITOR.env.hc = !!( top && top == right );
	} catch ( e ) {
		CKEDITOR.env.hc = false;
	}

	hcDetect.remove();

	if ( CKEDITOR.env.hc )
		CKEDITOR.env.cssClass += ' cke_hc';

	// Initially hide UI spaces when relevant skins are loading, later restored by skin css.
	CKEDITOR.document.appendStyleText( '.cke{visibility:hidden;}' );

	// Mark the editor as fully loaded.
	CKEDITOR.status = 'loaded';
	CKEDITOR.fireOnce( 'loaded' );

	// Process all instances created by the "basic" implementation.
	var pending = CKEDITOR._.pending;
	if ( pending ) {
		delete CKEDITOR._.pending;

		for ( var i = 0; i < pending.length; i++ ) {
			CKEDITOR.editor.prototype.constructor.apply( pending[ i ][ 0 ], pending[ i ][ 1 ] );
			CKEDITOR.add( pending[ i ][ 0 ] );
		}
	}
} )();

/**
 * Indicates that CKEditor is running on a High Contrast environment.
 *
 *		if ( CKEDITOR.env.hc )
 *			alert( 'You\'re running on High Contrast mode. The editor interface will get adapted to provide you a better experience.' );
 *
 * @property {Boolean} hc
 * @member CKEDITOR.env
 */

/**
 * Fired when a CKEDITOR core object is fully loaded and ready for interaction.
 *
 * @event loaded
 * @member CKEDITOR
 */
