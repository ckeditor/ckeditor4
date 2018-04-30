/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Plugin contains workaround for issue with iOS scrolling (#498).
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'iosscroll', {
		init: function( editor ) {
			editor.on( 'contentDom', function() {
				var editable = editor.editable();

				if ( !editable.isInline() && CKEDITOR.env.iOS && CKEDITOR.env.safari ) {
					editable.attachListener( editable, 'keydown', handleInput, editable, null, 10000 );
				}
			} );
		}
	} );

	function handleInput() {
		var contentsWrapper = CKEDITOR.document.findOne( '#' + this.editor.id + '_contents' ),
			frame = this.getWindow().getFrame();

		// Don't register same listener many times.
		if ( frame.getAttribute( 'scrolling' ) !== 'no' ) {
			contentsWrapper.on( 'scroll', scrollListener, this );
			this.once( 'touchstart', touchListener, this );
		}
	}

	function scrollListener() {
		var contentsWrapper = CKEDITOR.document.findOne( '#' + this.editor.id + '_contents' ),
			frame = this.getWindow().getFrame(),
			range = this.editor.getSelection().getRanges()[ 0 ],
			offset = range.startContainer.getAscendant( function( el ) {
					return el.type === CKEDITOR.NODE_ELEMENT;
				}, true ).getClientRect( true );

		frame.setAttribute( 'scrolling', 'no' );
		frame.setStyle( 'height', contentsWrapper.$.clientHeight + 'px' );
		this.setStyle( 'margin-top', '-' + ( offset.top - offset.height ) + 'px' );
	}

	function touchListener() {
		var contentsWrapper = CKEDITOR.document.findOne( '#' + this.editor.id + '_contents' ),
			frame = this.getWindow().getFrame(),
			top = parseInt( this.getStyle( 'margin-top' ), 10 ) * -1;

		frame.setStyle( 'height', 'auto' );
		frame.setAttribute( 'scrolling', 'yes' );
		this.setStyle( 'margin-top', 0 );
		contentsWrapper.$.scrollTop = top;
		contentsWrapper.removeListener( 'scroll', scrollListener );
	}
} )();
