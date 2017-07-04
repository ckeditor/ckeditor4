/* bender-tags: editor,dom */
/* global appendDomObjectTests */

bender.test( appendDomObjectTests(
	( function() {
		var nodes = {};

		return function( id ) {
			var node = nodes[ id ];
			if ( !node ) {
				nodes[ id ] = node = new CKEDITOR.dom.comment( id );
			}

			return node;
		};
	} )(),
	{
		test_getOuterHtml: function() {
			var comments1 = CKEDITOR.document.getById( 'c' ).getChildren(),
				comments2 = [ '<!--abc-->', '<!--\\\\-->', '<!--&gt;&lt;-->' ];

			for ( var i = 0 ; i < comments1.count() ; ++i ) {
				assert.areSame(
					comments1.getItem( i ).getOuterHtml(),
					comments2[ i ]
				);
			}
		}
	}
) );
