/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: easyimage,toolbar */
/* bender-include: ../widget/_helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editors = {
		classic: {},

		divarea: {
			config: {
				extraPlugins: 'divarea'
			}
		},

		inline: {
			creator: 'inline'
		},

		// This instance upcasts all figures, despite figure[class] value.
		classicAllFigures: {
			config: {
				easyimage_class: null
			}
		},

		linkEditor: {
			config: {
				extraPlugins: 'link'
			}
		}
	};

	var tests = {
		'test upcasting image widget (figure)': function( editor, bot ) {
			widgetTestsTools.assertWidget( {
				count: editor.name === 'classicAllFigures' ? 2 : 1,
				widgetOffset: 0,
				nameCreated: 'easyimage',
				html: CKEDITOR.document.getById( 'mixedFigures' ).getHtml(),
				bot: bot,

				assertCreated: function( widget ) {
					if ( editor.name === 'linkEditor' ) {
						assert.isNull( widget.parts.link, 'Widget does have link part if the editor has link plugin' );
					} else {
						assert.isUndefined( widget.parts.link,
							'Widget does not have link part if the editor does not have link plugin' );
					}
				}
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
