/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* global CKCONSOLE */

'use strict';

( function() {

	CKCONSOLE.add( 'focus', {
		panels: [
			{
				type: 'box',
				content:
					'<ul class="ckconsole_list">' +
						'<li>active by fM: <span class="ckconsole_value" data-value="activeFM"></span></li>' +
						'<li>active inner: <span class="ckconsole_value" data-value="activeInner"></span></li>' +
						'<li>active host: <span class="ckconsole_value" data-value="activeHost"></span></li>' +
					'</ul>',

				refresh: function( editor ) {
					var focusManager = editor.focusManager;

					return {
						header: 'Focus (' + ( focusManager.hasFocus ? 'focused' : 'blurred' ) + ')',
						activeFM: focusManager.hasFocus ? active2Str( focusManager.currentActive ) : '-',
						activeInner: editor.document ? active2Str( editor.document.getActive() ) : '-',
						activeHost: active2Str( CKEDITOR.document.getActive() )
					};
				},

				refreshOn: function( editor, refresh ) {
					editor.on( 'focus', refresh );
					editor.on( 'blur', refresh );
					editor.on( 'contentDom', function() {
						editor.editable().attachListener( editor.document, 'mouseup', function() {
							// Some changes (e.g. iframe creation) need time.
							setTimeout( refresh, 100 );
						} );
					} );
					CKEDITOR.document.on( 'mouseup', function() {
						// Some changes (e.g. iframe creation) need time.
						setTimeout( refresh, 100 );
					} );
					editor.on( 'instanceReady', refresh );
				}
			},
			{
				type: 'log',
				on: function( editor, log, logFn ) {
					editor.on( 'focus', logFn( '--- editor#focus ---' ) );
					editor.on( 'blur', logFn( '--- editor#blur ---' ) );

					editor.on( 'contentDom', function() {
						var editable = editor.editable();

						editable.attachListener( editor.document, 'focus', logFn( 'document#focus' ) );
						editable.attachListener( editor.document, 'blur', logFn( 'document#blur' ) );

						editable.attachListener( editor.document.getWindow(), 'focus', logFn( 'window#focus' ) );
						editable.attachListener( editor.document.getWindow(), 'blur', logFn( 'window#blur' ) );

						editable.attachListener( editable, 'focus', logFn( 'editable#focus' ) );
						editable.attachListener( editable, 'blur', logFn( 'editable#blur' ) );
					} );
				}
			}
		]
	} );

	// Get <name ...>.
	function element2Str( element ) {
		var str = element.getOuterHtml().split( '>' )[ 0 ] + '>';

		if ( str.length > 40 )
			str = str.slice( 0, 35 ) + '...>';

		return str.replace( '<', '&lt;' );
	}

	function active2Str( active ) {
		if ( active instanceof CKEDITOR.dom.window )
			return 'window (' + element2Str( new CKEDITOR.dom.element( active.$.document.body ) ) + ')';
		else
			return element2Str( active );
	}

} )();
