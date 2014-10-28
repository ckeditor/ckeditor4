/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
'use strict';

( function() {
	XMLHttpRequest.prototype.baseSend = XMLHttpRequest.prototype.send;

	XMLHttpRequest.prototype.send = function( data ) {
		var baseOnProgress = this.onprogress,
			baseOnLoad = this.onload;

		this.onprogress = function() {};

		this.onload = function( evt ) {
			var total = 1000 * 10,
				loaded = 0;

			function progress() {
				setTimeout( function() {
					loaded += 1000;

					if ( loaded < total ) {
						evt.loaded = loaded;
						baseOnProgress( evt );
						progress();
					} else {
						baseOnLoad( evt );
					}
				}, 300 );
			}

			progress();
		};

		this.baseSend( data );
	};
} )();