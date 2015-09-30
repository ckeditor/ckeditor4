/* globals CKEDITOR, CKEDITOR_MOCK */

( function( CKEDITOR ) {
	var tools = CKEDITOR.tools;
	var invalidTags = [
		'o:p',
		'xml',
		'script',
		'meta',
		'link'
	];

	CKEDITOR.cleanWord = function( mswordHtml ) {

		var fragment = CKEDITOR.htmlParser.fragment.fromHtml( mswordHtml );

		var filter = new CKEDITOR.htmlParser.filter( {
			// Each element is processed through the '^' function, then
			// any matching pattern and finally through the '$' function.
			elements: {
				'^': function( element ) {

					normalizeStyles( element );

					/*jshint -W024 */
					element.attributes.class = ( element.attributes.class || '' ).replace( /msonormal/i, '' );
					/*jshint +W024 */

					deleteEmptyAttributes( element );
				}
			},
			elementNames: [
				[ new RegExp( invalidTags.join( '|' ) ), '' ] // Remove invalid tags.
			],
			comment: function() {

			}
		} );

		var writer = new CKEDITOR.htmlParser.basicWriter();

		filter.applyTo( fragment );
		fragment.writeHtml( writer );

		return writer.getHtml();
	};

	function normalizeStyles( element ) {
		var styles = tools.parseCssText( element.attributes.style );

		var keys = tools.objectKeys( styles );

		for ( var i = keys.length - 1; i >= 0; i-- ) {
			if ( keys[ i ].match( /^mso\-/ ) ) {
				delete styles[ keys[ i ] ];
			}
		}

		element.attributes.style = CKEDITOR.tools.writeCssText( styles );
	}

	function deleteEmptyAttributes( element ) {
		var deleteWhenEmpty = [
			'style',
			'class'
		];

		for ( var i = 0; i < deleteWhenEmpty.length; i++ ) {
			var attribute = deleteWhenEmpty[ i ];

			if ( !element.attributes[ attribute ] ) {
				delete element.attributes[ attribute ];
			}
		}
	}

} )( typeof CKEDITOR_MOCK !== 'undefined' ? CKEDITOR_MOCK : CKEDITOR ); // Testability, yeah!
