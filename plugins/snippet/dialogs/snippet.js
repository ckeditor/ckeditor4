/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

( function() {
	CKEDITOR.dialog.add( 'snippet', function( editor ) {

		var snippetLangs = editor._.snippet.langs,
			lang = editor.lang.snippet,
			langSelectItems = [],
			langSelectDefaultValue,
			snippetLangId;

		for ( snippetLangId in snippetLangs )
			langSelectItems.push( [ snippetLangs[ snippetLangId ], snippetLangId ] );

		if ( langSelectItems.length )
			langSelectDefaultValue = langSelectItems[ 0 ][ 1 ];

		// Size adjustments.
		var size = CKEDITOR.document.getWindow().getViewPaneSize(),
			// Make it maximum 800px wide, but still fully visible in the viewport.
			width = Math.min( size.width - 70, 800 ),
			// Make it use 2/3 of the viewport height.
			height = size.height / 1.5;

		return  {
			title: lang.title,
			contents: [
				{
					id: 'info',
					elements: [
						{
							id: 'lang',
							type: 'select',
							label: lang.language,
							items: langSelectItems,
							'default': langSelectDefaultValue,
							setup: function( widget ) {
								if ( widget.ready )
									this.setValue( widget.data.lang );
							},
							commit: function( widget ) {
								widget.setData( 'lang', this.getValue() );
							}
						},
						{
							id: 'code',
							type: 'textarea',
							label: lang.codeContents,
							setup: function( widget ) {
								this.setValue( widget.data.code );
							},
							commit: function( widget ) {
								widget.setData( 'code', this.getValue() );
							},
							inputStyle: 'cursor:auto;' +
								'width:' + width + 'px;' +
								'height:' + height + 'px;' +
								'tab-size:4;' +
								'text-align:left;',
							'class': 'cke_source'
						}
					]
				}
			]
		};
	} );
}() );