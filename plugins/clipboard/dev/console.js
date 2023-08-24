/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/* global CKCONSOLE */

'use strict';

( function() {
	var pasteType, pasteValue;

	CKCONSOLE.add( 'paste', {
		panels: [
			{
				type: 'box',
				content:
				'<ul class="ckconsole_list">' +
					'<li>type: <span class="ckconsole_value" data-value="type"></span></li>' +
					'<li>value: <span class="ckconsole_value" data-value="value"></span></li>' +
				'</ul>',

				refresh: function() {
					return {
						header: 'Paste',
						type: pasteType,
						value: pasteValue
					};
				},

				refreshOn: function( editor, refresh ) {
					editor.on( 'paste', function( evt ) {
						pasteType = evt.data.type;
						pasteValue = CKEDITOR.tools.htmlEncode( evt.data.dataValue );
						refresh();
					} );
				}
			},
			{
				type: 'log',
				on: function( editor, log, logFn ) {
					editor.on( 'paste', function( evt ) {
						logFn( 'paste; type:' + evt.data.type )();
					} );
				}
			}
		]
	} );
} )();
