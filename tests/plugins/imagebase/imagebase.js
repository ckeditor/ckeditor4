/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: imagebase,toolbar,easyimage */
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
		}
	};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'easyimage' );
		},

		'test adding image widget': function( editor ) {
			var expectedParts = {
				caption: 'figcaption',
				image: 'img',
				loader: 'progress'
			};

			CKEDITOR.plugins.imagebase.addImageWidget( editor, 'testWidget', {
				parts: {
					loader: 'progress'
				}
			} );

			objectAssert.ownsKeys( [ 'testWidget' ], editor.widgets.registered );
			objectAssert.areDeepEqual( expectedParts, editor.widgets.registered.testWidget.parts );
		},

		'test upcasting image widget': function( editor, bot ) {
			assert.areSame( 'figure', editor.widgets.registered.testWidget.upcast );

			widgetTestsTools.assertWidget( {
				count: 1,
				widgetOffset: 0,
				nameCreated: 'testWidget',
				html: CKEDITOR.document.getById( 'upcastTest' ).getHtml(),
				bot: bot
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );
	bender.test( tests );
} )();
