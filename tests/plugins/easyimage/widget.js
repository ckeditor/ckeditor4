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
		}
	};

	var tests = {
		'test upcasting image widget (figure)': function( editor, bot ) {
			widgetTestsTools.assertWidget( {
				count: editor.name === 'classicAllFigures' ? 2 : 1,
				widgetOffset: 0,
				nameCreated: 'easyimage',
				html: CKEDITOR.document.getById( 'mixedFigures' ).getHtml(),
				bot: bot
			} );
		},

		'test upcasting image widget (img)': function( editor, bot ) {
			widgetTestsTools.assertWidget( {
				count: 1,
				widgetOffset: 0,
				nameCreated: 'easyimage',
				html: CKEDITOR.document.getById( 'mixedImgs' ).getHtml(),
				bot: bot,
				assertCreated: function( widget ) {
					var element = widget.element;

					assert.areSame( 'figure', element.getName(), 'img is wrapped in figure' );

					if ( editor.name !== 'classicAllFigures' ) {
						assert.isTrue( element.hasClass( 'easyimage' ), 'figure has appropriate class' );
					} else {
						assert.isFalse( element.hasClass( 'easyimage' ), 'figure does not have class' );
					}
				}
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
