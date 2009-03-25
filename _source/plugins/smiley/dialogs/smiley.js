/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.dialog.add( 'smiley', function( editor ) {
	var config = editor.config,
		images = config.smiley_images,
		columns = config.smiley_columns,
		i;

	// Build the HTML for the smiley images table.
	var html = [ '<table cellspacing="2" cellpadding="2"><tbody>' ];

	for ( i = 0; i < images.length; i++ ) {
		if ( i % columns === 0 )
			html.push( '<tr>' );

		html.push( '<td class="dark_background hand centered" style="vertical-align: middle;">' +
			'<img border="0" class="hand" title="', config.smiley_descriptions[ i ], '"' +
				' src="', CKEDITOR.tools.htmlEncode( config.smiley_path + images[ i ] ), '"',
		// IE BUG: Below is a workaround to an IE image loading bug to ensure the image sizes are correct.
		( CKEDITOR.env.ie ? ' onload="this.setAttribute(\'width\', 2); this.removeAttribute(\'width\');" ' : '' ), '>' +
			'</td>' );

		if ( i % columns == columns - 1 )
			html.push( '</tr>' );
	}

	if ( i < columns - 1 ) {
		for ( ; i < columns - 1; i++ )
			html.push( '<td></td>' );
		html.push( '</tr>' );
	}

	html.push( '</tbody></table>' );

	var smileySelector = {
		type: 'html',
		html: html.join( '' ),
		onClick: function( evt ) {
			var target = evt.data.getTarget(),
				targetName = target.getName();

			if ( targetName == 'td' )
				target = target.getChild( 0 );
			else if ( targetName != 'img' )
				return;

			this.getDialog().restoreSelection();

			var src = target.getAttribute( 'src' ),
				title = target.getAttribute( 'title' );

			var img = editor.document.createElement( 'img', {
				attributes: {
					src: src,
					_cke_saved_src: src,
					title: title,
					alt: title
				}
			});

			editor.insertElement( img );

			this.getDialog().hide();
		},
		style: 'width: 100%; height: 100%; border-collapse: separate;'
	};

	return {
		title: editor.lang.smiley.title,
		minWidth: 270,
		minHeight: 120,
		contents: [
			{
			id: 'tab1',
			label: '',
			title: '',
			expand: true,
			padding: 0,
			elements: [
				smileySelector
				]
		}
		],
		buttons: [ CKEDITOR.dialog.cancelButton ]
	};
});
