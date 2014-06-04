/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea */

CKEDITOR.replaceClass = 'ckeditor';
CKEDITOR.disableAutoInline = false;

var passed = false, onLoaded;

CKEDITOR.on( 'instanceCreated', function( evt ) {
	passed = !onLoaded;
} );

$( window ).on( 'load', function() {
	onLoaded =1;

	bender.test(
	{
		'check instances are created before "onload" event': function() {
			if ( CKEDITOR.env.ie && ( document.documentMode || CKEDITOR.env.version ) < 9 )
				assert.ignore();

			assert.isTrue( passed );
		}
	} );
} );

// Large image to delay the page loading.
document.write( '<img src="%BASE_PATH%_assets/large.jpg' + '?'+ encodeURI( new Date().getTime() ) + '" />' );