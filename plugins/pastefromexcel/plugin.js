/**
 * @license For licensing, see LICENSE.md.
 */

/**
 * @fileOverview This plugin is to fix a issue, related to copy from excel,
 *				 which some styles like background color or font color are
 *				 not copied into CKEditor area.
 *				 This plugin is replacing getData function which is part of
 *				 `clipboard` plugin for converting internal styles described
 *				 in `style` tag to inline style of respective node of
 *				 the document.
 *
 */
CKEDITOR.plugins.add( 'pastefromexcel', {
	requires: 'clipboard',
	init: function( editor ) {

		// Load for non-IE.
		if ( CKEDITOR.env.ie )
			return;

		var getDataFn =  function( type ) {
			function isEmpty( data ) {
				return data === undefined || data === null || data === '';
			}

			type = this._.normalizeType( type );

			var data = this._.data[ type ],
				result;

			if ( isEmpty( data ) ) {
				try {
					data = this.$.getData( type );
				} catch ( e ) {}
			}

			if ( isEmpty( data ) ) {
				data = '';
			}

			// Some browsers add <meta http-equiv="content-type" content="text/html; charset=utf-8"> at the begging of the HTML data
			// or surround it with <html><head>...</head><body>(some content)<!--StartFragment--> and <!--EndFragment-->(some content)</body></html>
			// This code removes meta tags and returns only the contents of the <body> element if found. Note that
			// some significant content may be placed outside Start/EndFragment comments so it's kept.
			//
			// See #13583 for more details.
			if ( type == 'text/html' ) {
				data = data.replace( this._.metaRegExp, '' );

				// Check whether pasted from MS Excel and Word.
				if ( data.search( /<meta.*?Microsoft Excel\s[\d].*?>/ ) != -1 ||
					data.search( /<meta.*?Microsoft Word\s[\d].*?>/ ) != -1 ) {
					data = renderStyles( data );
				}

				// Keep only contents of the <body> element
				result = this._.bodyRegExp.exec( data );
				if ( result && result.length ) {
					data = result[ 1 ];

					// Remove also comments.
					data = data.replace( this._.fragmentRegExp, '' );
				}
			}
			// Firefox on Linux put files paths as a text/plain data if there are files
			// in the dataTransfer object. We need to hide it, because files should be
			// handled on paste only if dataValue is empty.
			else if ( type == 'Text' && CKEDITOR.env.gecko && this.getFilesCount() &&
				data.substring( 0, 7 ) == 'file://' ) {
				data = '';
			}

			return data;
		};

		editor.on( 'instanceReady', function() {
			// Replace exsiting getData function with modified getData function.
			CKEDITOR.plugins.clipboard.dataTransfer.prototype.getData = getDataFn;
		} );


		// Function for converting internal styles to inline style of respective node.
		function renderStyles( htmlString ) {
			// Trim unnecessary parts.
			htmlString = htmlString.substring( htmlString.indexOf( '<html ' ), htmlString.length );
			htmlString = htmlString.substring( 0, htmlString.lastIndexOf( '</html>' ) + '</html>'.length );

			// Add temporary iframe.
			var iframe = document.createElement( 'iframe' );
			iframe.style.display = 'none';
			document.body.appendChild( iframe );

			var iframeDoc = ( iframe.contentDocument ||  iframe.contentWindow.document );
			iframeDoc.open();
			iframeDoc.write( htmlString );
			iframeDoc.close();

			var convertedString,
				collection,
				pointer,
				rules = iframeDoc.styleSheets[ iframeDoc.styleSheets.length - 1 ].cssRules;

			// Convert internal styles to inline style of respective node.
			for ( var idx = 0; idx < rules.length; idx++ ) {
				if ( rules[idx].selectorText === '' )
					continue;
				collection = iframeDoc.body.querySelectorAll( rules[idx].selectorText );
				pointer = 0;

				for ( pointer = 0; pointer < collection.length; pointer++ ) {
					collection[pointer].style.cssText += rules[idx].style.cssText;
				}
			}

			convertedString = iframeDoc.firstChild.outerHTML;
			// Remove temporary ifrme.
			iframe.parentNode.removeChild( iframe );

			return convertedString;
		}
	}
} );
