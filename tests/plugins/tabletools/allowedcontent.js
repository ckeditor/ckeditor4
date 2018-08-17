/* bender-tags: editor */
/* bender-ckeditor-plugins: dialog,tabletools,toolbar */

( function() {
	'use strict';

	var filterMap = {
		width: 'td{width,height}',
		wordWrap: 'td{white-space}',
		hAlign: 'td{text-align}',
		vAlign: 'td{vertical-align}',
		cellType: 'th',
		rowSpan: 'td[rowspan]',
		colSpan: 'td[colspan]',
		bgColor: 'td{background-color}',
		borderColor: 'td{border-color}'
	},
	tests = {
		'test dialog required content': function( editor, bot ) {
			bot.setData( '<table><tbody><tr><td>Cell</td></tr></tbody></table>', function() {
				var rng = new CKEDITOR.dom.range( editor.document );
				rng.setStart( editor.editable().findOne( 'td' ), CKEDITOR.POSITION_AFTER_START );
				rng.select();

				bot.dialog( 'cellProperties', function( dialog ) {
					for ( var key in filterMap ) {
						if ( key !== editor.name ) {
							assert.isTrue( isNotAllowed( key ), 'Dialog ' + key + ' should be disallowed.' );
							if ( key === 'width' ) {
								assert.isTrue( isNotAllowed( 'height' ), 'Dialog height should be disallowed.' );
							}
						} else {
							assert.isUndefined( isNotAllowed( key ), 'Dialog ' + key + ' shouldn\'t be disallowed.' );
							if ( key === 'width' ) {
								assert.isUndefined( isNotAllowed( 'height' ), 'Dialog height shouldn\'t be disallowed.' );
							}
						}
					}
					function isNotAllowed( key ) {
						return dialog._.contents.info[ key ].notAllowed;
					}
				} );
			} );
		}
	};

	bender.editors = {};

	for ( var key in filterMap ) {
		bender.editors[ key ] = {
			config: {
				allowedContent: 'table;tbody;thead;tr;td;',
				extraAllowedContent: filterMap[ key ]
			}
		};
	}

	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests ) );
} )();
