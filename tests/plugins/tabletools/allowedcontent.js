/* bender-tags: editor */
/* bender-ckeditor-plugins: dialog,tabletools,toolbar */

( function() {
	'use strict';

	var filterMap = {
			width: [ 'td', 'styles', 'width' ],
			height: [ 'td', 'styles', 'height' ],
			wordWrap: [ 'td', 'styles', 'white-space' ],
			hAlign: [ 'td', 'styles', 'text-align' ],
			vAlign: [ 'td', 'styles', 'vertical-align' ],
			cellType: [ 'th' ],
			rowSpan: [ 'td', 'attributes', 'rowspan' ],
			colSpan: [ 'td', 'attributes', 'colspan' ],
			bgColor: [ 'td', 'styles', 'background-color' ],
			borderColor: [ 'td', 'styles', 'border-color' ]
		},
		extraAllowedContentList = [],
		tests = {
			'test dialog required content': function( editor, bot ) {
				bot.setData( '<table><tbody><tr><td>Cell</td></tr></tbody></table>', function() {
					var rng = new CKEDITOR.dom.range( editor.document );
					rng.setStart( editor.editable().findOne( 'td' ), CKEDITOR.POSITION_AFTER_START );
					rng.select();

					bot.contextmenu( function( menu ) {
						var tableCellSubmenu = CKEDITOR.tools.array.filter( menu.items, function( item ) {
								return item.name === 'tablecell';
							} )[ 0 ],
							items = tableCellSubmenu.getItems();

						assert[ editor.name === 'editor' ? 'isFalse' : 'isTrue' ]( 'tablecell_properties' in items );
						menu.hide();

						if ( editor.name === 'editor' ) {
							assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'cellProperties' ).state );
						} else {
							bot.dialog( 'cellProperties', function( dialog ) {
								for ( var key in filterMap ) {
									var filterArray = filterMap[ key ],
										elementName = filterArray[ 0 ],
										propertyName = filterArray[ 1 ],
										allowedStyleOrAttribute = filterArray[ 2 ],
										extraAllowedContent = editor.config.extraAllowedContent,
										shouldBeAllowed = extraAllowedContent[ elementName ];

									if ( filterArray.length === 1 ) {
										shouldBeAllowed = elementName in extraAllowedContent;
									} else if ( shouldBeAllowed ) {
										shouldBeAllowed = shouldBeAllowed[ propertyName ];

										if ( shouldBeAllowed ) {
											shouldBeAllowed = CKEDITOR.tools.indexOf( shouldBeAllowed, allowedStyleOrAttribute ) !== -1;
										} else {
											shouldBeAllowed = false;
										}
									} else {
										shouldBeAllowed = false;
									}

									shouldBeAllowed = !!shouldBeAllowed;

									assert[ shouldBeAllowed ? 'isUndefined' : 'isTrue' ]( isNotAllowed( key ), 'Dialog ' + key );
								}

								dialog.hide();

								function isNotAllowed( key ) {
									var item = dialog._.contents.info[ key ];
									return item === undefined || item.notAllowed;
								}
							} );
						}
					} );
				} );
			}
		};

	bender.editors = {};

	for ( var key in filterMap ) {
		if ( extraAllowedContentList.length ) {
			extraAllowedContentList.push( extraAllowedContentList[ extraAllowedContentList.length - 1 ].concat( [ key ] ) );
		}
		extraAllowedContentList.unshift( [ key ] );
	}

	bender.editors = {
		editor: {
			config: {
				allowedContent: 'table;tbody;thead;tr;td;'
			}
		}
	};

	CKEDITOR.tools.array.forEach( extraAllowedContentList, function( array, index ) {
		var extraAllowedContent = {};

		CKEDITOR.tools.array.forEach( array, function( key ) {
			var filterArray = filterMap[ key ],
				elementName = filterArray[ 0 ],
				propertyName = filterArray[ 1 ],
				allowedStyleOrAttribute = filterArray[ 2 ];

			if ( filterArray.length === 1 ) {
				extraAllowedContent[ elementName ] = true;
				return;
			} else if ( !extraAllowedContent[ filterArray [ 0 ] ] ) {
				extraAllowedContent[ elementName ] = {};
			}

			if ( !extraAllowedContent[ elementName ][ propertyName ] ) {
				extraAllowedContent[ elementName ][ propertyName ] = [ allowedStyleOrAttribute ];
			} else {
				extraAllowedContent[ elementName ][ propertyName ].push( allowedStyleOrAttribute );
			}
		} );

		bender.editors[ 'editor_' + index + '_allowed:' + array.join( ',' ) ] = {
			config: {
				allowedContent: bender.editors.editor.config.allowedContent,
				extraAllowedContent: extraAllowedContent
			}
		};
	} );
	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests ) );
} )();
