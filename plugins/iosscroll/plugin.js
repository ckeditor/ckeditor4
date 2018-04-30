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
					editable.attachListener( editable, 'input', inputListener, editable, null, 10000 );
				}
			} );
		}
	} );

	function inputListener() {
		var contentsWrapper = CKEDITOR.document.findOne( '#' + this.editor.id + '_contents' ),
			frame = this.getWindow().getFrame(),
			range = this.editor.getSelection().getRanges()[ 0 ],
			offset = range.startContainer.getAscendant( function( el ) {
					return el.type === CKEDITOR.NODE_ELEMENT;
				}, true ).getClientRect(),
			scrollOffset = offset.top - offset.height;

		if ( frame.getAttribute( 'scrolling' ) === 'no' ) {
			return;
		}

		frame.setAttribute( 'scrolling', 'no' );
		frame.setStyle( 'height', contentsWrapper.$.clientHeight + 'px' );
		this.data( 'scroll-offset', scrollOffset );
		this.setStyle( 'margin-top', '-' + scrollOffset + 'px' );

		this.once( 'touchstart', touchListener, this );
	}

	function touchListener() {
		var contentsWrapper = CKEDITOR.document.findOne( '#' + this.editor.id + '_contents' ),
			frame = this.getWindow().getFrame(),
			top = parseInt( this.data( 'scroll-offset' ), 10 );

		frame.setStyle( 'height', 'auto' );
		frame.setAttribute( 'scrolling', 'yes' );
		this.setStyle( 'margin-top', 0 );
		this.data( 'scroll-offset', false );
		contentsWrapper.$.scrollTop = top;
	}
} )();
