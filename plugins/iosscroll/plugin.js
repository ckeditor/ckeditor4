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
					editable.attachListener( editable, 'keydown', inputListener, editable, null, 10000 );
				}
			} );
		}
	} );

	// Logic of this listener is quite convoluted:
	// 1. Scroll selection into view and reselect it (otherwise cursor position would be lost).
	// 2. Treat actual scroll position (after making selection visible) as value for setting margin-top.
	// If scrolling selection resetted scroll position, use old scroll position.
	// 3. Scroll editor's frame into view as it could be now hidden (Safari seems to have problems with setting
	// high values for editable's scroll position…).
	// 3. Disable scroll and simulate scroll position via margins.
	// 4. Restore scroll on first touch.
	function inputListener() {
		var contentsWrapper = CKEDITOR.document.findOne( '#' + this.editor.id + '_contents' ).$,
			frame = this.getWindow().getFrame(),
			selection = this.editor.getSelection(),
			bkms,
			oldScrollOffset = contentsWrapper.scrollTop,
			scrollOffset;

		if ( frame.getAttribute( 'scrolling' ) === 'no' ) {
			return;
		}

		bkms = selection.createBookmarks( true );
		selection.scrollIntoView();
		selection.selectBookmarks( bkms );
		scrollOffset = contentsWrapper.scrollTop > 5 ? contentsWrapper.scrollTop : oldScrollOffset;

		frame.setAttribute( 'scrolling', 'no' );
		frame.setStyle( 'height', contentsWrapper.clientHeight + 'px' );
		this.data( 'scroll-offset', scrollOffset );
		this.setStyle( 'margin-top', '-' + scrollOffset + 'px' );
		frame.scrollIntoView();

		this.once( 'touchstart', touchListener, this );
	}

	function touchListener() {
		var contentsWrapper = CKEDITOR.document.findOne( '#' + this.editor.id + '_contents' ).$,
			frame = this.getWindow().getFrame(),
			top = this.data( 'scroll-offset' );

		frame.setStyle( 'height', 'auto' );
		frame.setAttribute( 'scrolling', 'yes' );
		this.setStyle( 'margin-top', 0 );
		this.data( 'scroll-offset', false );
		contentsWrapper.scrollTop = top;
	}
} )();
