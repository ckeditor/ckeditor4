/* bender-tags: editor */
/* bender-ckeditor-remove-plugins: copyformatting, tableselection */
/* exported CKEDITOR_GETURL */

// Load contents.css from assets directory and all other files a default way.
var CKEDITOR_GETURL = function( url ) {
	if ( url.indexOf( 'contents.css' ) > -1 )
		return '%TEST_DIR%_assets/contents.css';
};

( function() {
	'use strict';

	bender.test( {
		'test default value': function() {
			bender.editorBot.create( {
				name: 'test_default'
			}, function( bot ) {
				var hrefs = getStylesheets( bot.editor.document );

				assert.isMatching( /\/apps\/ckeditor\/contents.css$/, hrefs.join() );
			} );
		}
	} );

	function getStylesheets( doc ) {
		var hrefs = [],
			links = doc.getElementsByTag( 'link' ),
			link;

		for ( var i = 0; i < links.count(); ++i ) {
			link = links.getItem( i );
			if ( link.getAttribute( 'rel' ) == 'stylesheet' )
				hrefs.push( link.getAttribute( 'href' ).replace( /\?t=[a-z0-9]+$/i, '' ) );
		}

		return hrefs;
	}
} )();
