'use strict';

/* exported embedTools */

var embedTools = {
	mockJsonp: function( fn ) {
		this.onPluginsLoaded( function() {
			CKEDITOR.plugins.embedBase._jsonp.sendRequest = function( urlTemplate, urlParams, callback, errorCallback ) {
				setTimeout( function() {
					if ( fn ) {
						fn( urlTemplate, urlParams, callback, errorCallback );
					} else {
						callback( {
							type: 'rich',
							html: '<p>url:' + urlParams.url + '</p>'
						} );
					}
				}, 100 );
				// This method is mainly used for automated tests, but the 100ms timeout gives
				// them a more realistic behaviour.

				return {
					cancel: function() {
						throw new Error( 'Not implemented.' );
					}
				};
			};
		} );
	},

	delayJsonp: function() {
		this.onPluginsLoaded( function() {
			var origSendRequest = CKEDITOR.plugins.embedBase._jsonp.sendRequest;

			CKEDITOR.plugins.embedBase._jsonp.sendRequest = function() {
				var args = arguments,
					that = this,
					timeout;

				timeout = setTimeout( function() {
					origSendRequest.apply( that, args );
				}, Math.random() * 1000 + 1000 );

				return {
					cancel: function() {
						clearTimeout( timeout );
					}
				};
			};
		} );
	},

	onPluginsLoaded: function( callback ) {
		CKEDITOR.once( 'instanceCreated', function( evt ) {
			evt.editor.on( 'pluginsLoaded', callback );
		} );
	}
};