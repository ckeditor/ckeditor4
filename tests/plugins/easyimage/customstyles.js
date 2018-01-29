/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: floatingspace,easyimage,toolbar */
/* bender-include: ../widget/_helpers/tools.js, _helpers/tools.js */
/* global easyimageTestsTools */

( function() {
	'use strict';

	var commonConfig = {
		easyimage_styles: {
			test: {
				attributes: {
					'class': 'test'
				}
			}
		}
	};

	bender.editors = {
		classic: {
			config: commonConfig
		},

		divarea: {
			config: CKEDITOR.tools.object.merge( {
				extraPlugins: 'divarea'
			}, commonConfig )
		},

		inline: {
			creator: 'inline',
			config: commonConfig
		}
	};

	var tests = {
		'test style is integrated with ACF': function( editor ) {
			assert.isTrue( editor.filter.check( 'figure(test)' ) );
		},

		'test default styles are always defined': function( editor ) {
			easyimageTestsTools.assertCommandsState( editor, {
				easyimageFull: CKEDITOR.TRISTATE_DISABLED,
				easyimageSide: CKEDITOR.TRISTATE_DISABLED,
				easyimageAlignLeft: CKEDITOR.TRISTATE_DISABLED,
				easyimageAlignCenter: CKEDITOR.TRISTATE_DISABLED,
				easyimageAlignRight: CKEDITOR.TRISTATE_DISABLED
			} );
		},

		'test style command is available only on widget': function( editor, bot ) {
			bot.setData( CKEDITOR.document.getById( 'standard' ).getHtml(), function() {
				var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

				easyimageTestsTools.assertCommandsState( editor, {
					easyimageTest: CKEDITOR.TRISTATE_DISABLED
				} );

				widget.focus();

				easyimageTestsTools.assertCommandsState( editor, {
					easyimageTest: CKEDITOR.TRISTATE_OFF
				} );
			} );
		},

		'test style command state on widget with predefined style': function( editor, bot ) {
			bot.setData( CKEDITOR.document.getById( 'predefined' ).getHtml(), function() {
				var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

				widget.focus();

				easyimageTestsTools.assertCommandsState( editor, {
					easyimageTest: CKEDITOR.TRISTATE_ON
				} );
			} );
		},

		'test adding and removing style': function( editor, bot ) {
			bot.setData( CKEDITOR.document.getById( 'standard' ).getHtml(), function() {
				var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

				editor.once( 'afterCommandExec', function() {
					editor.once( 'afterCommandExec', function() {
						resume( function() {
							assert.isFalse( widget.hasClass( 'test' ), 'Style removed' );
							easyimageTestsTools.assertCommandsState( editor, {
								easyimageTest: CKEDITOR.TRISTATE_OFF
							} );
						} );
					} );

					assert.isTrue( widget.hasClass( 'test' ), 'Style applied' );
					easyimageTestsTools.assertCommandsState( editor, {
						easyimageTest: CKEDITOR.TRISTATE_ON
					} );

					editor.execCommand( 'easyimageTest' );
				} );

				widget.focus();
				editor.execCommand( 'easyimageTest' );
				wait();
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
