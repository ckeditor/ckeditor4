/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

(function() {

	var doc = CKEDITOR.document;
	var tags;

	// Check for sample compliance.
	CKEDITOR.on( 'instanceReady', function( ev ) {

		// Read sample tags.
		if ( tags === undefined )
		{
			var tagMeta = doc.$.getElementsByName( 'ckeditor-sample-tags' ),
			tags = tagMeta.length && CKEDITOR.dom.element.get( tagMeta[ 0 ] ).getAttribute( 'content' ).split( ',' );
		}

		var editor = ev.editor,
			// To collect missing plugins.
			missing = [];

		// Check if 'sourcearea' plugin mode is available in themed UI instance,
		// on sample pages where source view is required.
		if ( CKEDITOR.tools.indexOf( tags, 'output' ) > -1 &&
				 !editor._.modes.source &&
				 editor.elementMode != CKEDITOR.ELEMENT_MODE_INLINE ) {
				missing.push( 'sourcearea' );
		}

		// Inject a warning info above the editor if missing found.
		if ( missing.length )
		{
			for ( var i = 0 ; i < missing.length ; i++ ) {
				missing[ i ] = '<code>' + missing[ i ] + '</code>'
			}

			var warn = CKEDITOR.dom.element.createFromHtml(
				'<div class="warning">' +
				'<span>To fully experience this demo, the ' + missing.join( ',' ) + ' plugin(s) is required.</span>'+
				'</div>'
			);
			warn.insertBefore( editor.container );
		}
	});

})();
