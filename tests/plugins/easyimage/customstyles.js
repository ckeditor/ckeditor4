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

		'test command only applies style': function( editor, bot ) {
			bot.setData( CKEDITOR.document.getById( 'standard' ).getHtml(), function() {
				var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

				editor.once( 'afterCommandExec', function() {
					editor.once( 'afterCommandExec', function() {
						resume( function() {
							easyimageTestsTools.assertCommandsState( editor, {
								easyimageTest: CKEDITOR.TRISTATE_ON
							} );
							assert.areSame( 'test', widget.data.style, 'Widget has correct style data' );
						} );
					} );

					easyimageTestsTools.assertCommandsState( editor, {
						easyimageTest: CKEDITOR.TRISTATE_ON
					} );
					assert.areSame( 'test', widget.data.style, 'Widget has correct style data' );

					editor.execCommand( 'easyimageTest' );
				} );

				widget.focus();
				editor.execCommand( 'easyimageTest' );
				wait();
			} );
		},

		'test styles being exclusive': function( editor, bot ) {
			bot.setData( CKEDITOR.document.getById( 'standard' ).getHtml(), function() {
				var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

				editor.once( 'afterCommandExec', function() {
					editor.once( 'afterCommandExec', function() {
						resume( function() {
							assert.isFalse( widget.hasClass( 'test' ), 'Style removed' );
							easyimageTestsTools.assertCommandsState( editor, {
								easyimageTest: CKEDITOR.TRISTATE_OFF,
								easyimageAlignLeft: CKEDITOR.TRISTATE_ON
							} );
						} );
					} );

					assert.isTrue( widget.hasClass( 'test' ), 'Style applied' );
					easyimageTestsTools.assertCommandsState( editor, {
						easyimageFull: CKEDITOR.TRISTATE_OFF,
						easyimageTest: CKEDITOR.TRISTATE_ON
					} );

					editor.execCommand( 'easyimageAlignLeft' );
				} );

				widget.focus();

				easyimageTestsTools.assertCommandsState( editor, {
					easyimageFull: CKEDITOR.TRISTATE_ON,
					easyimageTest: CKEDITOR.TRISTATE_OFF
				} );

				editor.execCommand( 'easyimageTest' );
				wait();
			} );
		},

		'test widget fallback to full style': function( editor, bot ) {
			bot.setData( CKEDITOR.document.getById( 'standard' ).getHtml(), function() {
				var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

				assert.areSame( 'full', widget.data.style, 'Widget has correct style data' );
				assert.isTrue( widget.hasClass( 'easyimage-full' ), 'Widget has correct style' );
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
