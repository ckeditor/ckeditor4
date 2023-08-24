( function() {
	if ( 'CKEDITOR' in window ) {
		// Add CKEditor 4 LTS license key to activate editor for testing.
		CKEDITOR.config.licenseKey = bender.config.licenseKey;
	}
} )();
