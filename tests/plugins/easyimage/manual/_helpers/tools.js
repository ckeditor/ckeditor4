/* exported getToken, easyImageTools, isUnsupportedEnvironment */
/* global console */

// WARNING: The URL below should not be used for any other purpose than Easy Image plugin development.
// Images uploaded using the testing token service may be deleted automatically at any moment.
// If you would like to try the Easy Image service, please wait until the official launch of Easy Image and sign up for a free trial.
// Images uploaded during the free trial will not be deleted for the whole trial period and additionally the trial service can be converted
// into a subscription at any moment, allowing you to preserve all uploaded images.
var CLOUD_SERVICES_TOKEN_URL = 'https://j2sns7jmy0.execute-api.eu-central-1.amazonaws.com/prod/token';

function getToken( callback ) {
	function uid() {
		var uuid = 'e'; // Make sure that id does not start with number.

		for ( var i = 0; i < 8; i++ ) {
			uuid += Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 ).substring( 1 );
		}

		return uuid;
	}

	var xhr = new XMLHttpRequest(),
		userId = uid();

	xhr.open( 'GET', CLOUD_SERVICES_TOKEN_URL + '?user.id=' + userId );

	xhr.onload = function() {
		if ( xhr.status >= 200 && xhr.status < 300 ) {
			var response = JSON.parse( xhr.responseText );

			callback( response.token );
		} else {
			console.error( xhr.status );
		}
	};

	xhr.onerror = function( error ) {
		console.error( error );
	};

	xhr.send( null );
}

var easyImageTools = {
	CLOUD_SERVICES_UPLOAD_GATEWAY: 'https://files.cke-cs.com/upload/'
};

function isUnsupportedEnvironment() {
	return CKEDITOR.env.ie && CKEDITOR.env.version < 11;
}
