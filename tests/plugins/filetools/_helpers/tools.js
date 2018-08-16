'use strict';

/* exported fileTools */

var fileTools = {
	// A mockup type that should replace File constructor.
	fileMock: function( data, name ) {
		var file = new Blob( data , {} );
		file.name = name;

		return file;
	},

	// Replaces window.File constructor with a callable constructor replacement, that
	// returns file instances mock.
	mockFileType: function() {
		if ( typeof MSBlobBuilder === 'function' || !window.File ) {
			window.File = fileTools.fileMock;
		}
	}
};