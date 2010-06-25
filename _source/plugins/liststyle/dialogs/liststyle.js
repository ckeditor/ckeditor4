/*
 * Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

(function() {
	function getListElement( editor, listTag ) {
		var range;
		try {
			range = editor.getSelection().getRanges()[ 0 ];
		} catch ( e ) {
			return null;
		}

		range.shrink( CKEDITOR.SHRINK_TEXT );
		return range.getCommonAncestor().getAscendant( listTag, true );
	}

	var mapListStyle = {
		'a': 'lower-alpha',
		'A': 'upper-alpha',
		'i': 'lower-roman',
		'I': 'upper-roman',
		'1': 'decimal',
		'disc': 'disc',
		'circle': 'circle',
		'square': 'square'
	};

	function listStyle( editor, startupPage ) {
		if ( startupPage == 'bulletedListStyle' ) {
			return {
				title: editor.lang.list.bulletedTitle,
				minWidth: 300,
				minHeight: 50,
				contents: [
					{
					id: 'info',
					accessKey: 'I',
					elements: [
						{
						type: 'select',
						label: editor.lang.list.type,
						id: 'type',
						style: 'width: 150px; margin: auto;',
						items: [
							[ editor.lang.list.notset, '' ],
							[ editor.lang.list.circle, 'circle' ],
							[ editor.lang.list.disc, 'disc' ],
							[ editor.lang.list.square, 'square' ]
							],
						setup: function( element ) {
							var value = element.getStyle( 'list-style-type' ) || mapListStyle[ element.getAttribute( 'type' ) ] || element.getAttribute( 'type' ) || '';

							this.setValue( value );
						},
						commit: function( element ) {
							var value = this.getValue();
							if ( value )
								element.setStyle( 'list-style-type', value );
							else
								element.removeStyle( 'list-style-type' );
						}
					}
					]
				}
				],
				onShow: function() {
					var editor = this.getParentEditor(),
						element = getListElement( editor, 'ul' );

					element && this.setupContent( element );
				},
				onOk: function() {
					var editor = this.getParentEditor(),
						element = getListElement( editor, 'ul' );

					element && this.commitContent( element );
				}
			};
		} else if ( startupPage == 'numberedListStyle' ) {

			var listStyleOptions = [
				[ editor.lang.list.notset, '' ],
				[ editor.lang.list.lowerRoman, 'lower-roman' ],
				[ editor.lang.list.upperRoman, 'upper-roman' ],
				[ editor.lang.list.lowerAlpha, 'lower-alpha' ],
				[ editor.lang.list.upperAlpha, 'upper-alpha' ],
				[ editor.lang.list.decimal, 'decimal' ]
				];

			if ( !CKEDITOR.env.ie || CKEDITOR.env.version > 7 ) {
				listStyleOptions.concat( [
					[ editor.lang.list.armenian, 'armenian' ],
					[ editor.lang.list.decimalLeadingZero, 'decimal-leading-zero' ],
					[ editor.lang.list.georgian, 'georgian' ],
					[ editor.lang.list.lowerGreek, 'lower-greek' ]
					] );
			}

			return {
				title: editor.lang.list.numberedTitle,
				minWidth: 300,
				minHeight: 50,
				contents: [
					{
					id: 'info',
					accessKey: 'I',
					elements: [
						{
						type: 'hbox',
						widths: [ '25%', '75%' ],
						children: [
							{
							label: editor.lang.list.start,
							type: 'text',
							id: 'start',
							validate: CKEDITOR.dialog.validate.integer( editor.lang.list.validateStartNumber ),
							setup: function( element ) {
								var value = element.getAttribute( 'start' ) || 1;
								value && this.setValue( value );
							},
							commit: function( element ) {
								element.setAttribute( 'start', this.getValue() );
							}
						},
							{
							type: 'select',
							label: editor.lang.list.type,
							id: 'type',
							style: 'width: 100%;',
							items: listStyleOptions,
							setup: function( element ) {
								var value = element.getStyle( 'list-style-type' ) || mapListStyle[ element.getAttribute( 'type' ) ] || element.getAttribute( 'type' ) || '';

								this.setValue( value );
							},
							commit: function( element ) {
								var value = this.getValue();
								if ( value )
									element.setStyle( 'list-style-type', value );
								else
									element.removeStyle( 'list-style-type' );
							}
						}
						]
					}
					]
				}
				],
				onShow: function() {
					var editor = this.getParentEditor(),
						element = getListElement( editor, 'ol' );

					element && this.setupContent( element );
				},
				onOk: function() {
					var editor = this.getParentEditor(),
						element = getListElement( editor, 'ol' );

					element && this.commitContent( element );
				}
			};
		}
	}

	CKEDITOR.dialog.add( 'numberedListStyle', function( editor ) {
		return listStyle( editor, 'numberedListStyle' );
	});

	CKEDITOR.dialog.add( 'bulletedListStyle', function( editor ) {
		return listStyle( editor, 'bulletedListStyle' );
	});
})();
