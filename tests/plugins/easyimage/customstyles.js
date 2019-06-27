/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: floatingspace,easyimage,toolbar */
/* bender-include: ../widget/_helpers/tools.js, _helpers/tools.js */
/* global easyImageTools */

( function() {
	'use strict';

	var commonConfig = {
		toolbar: [ [ 'Paste', 'EasyImageFull', 'EasyImageSide' ] ],
		easyimage_styles: {
			test: {
				attributes: {
					'class': 'test'
				}
			},

			divTest: {
				element: 'div',
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
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'easyimage' );
		},

		'test style is integrated with ACF': function( editor ) {
			assert.isTrue( editor.filter.check( 'figure(test)' ) );
		},

		'test default styles are always defined': function( editor ) {
			editor.focus();
			easyImageTools.assertCommandsState( editor, {
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

				easyImageTools.assertCommandsState( editor, {
					easyimageTest: CKEDITOR.TRISTATE_DISABLED
				} );

				widget.focus();

				easyImageTools.assertCommandsState( editor, {
					easyimageTest: CKEDITOR.TRISTATE_OFF
				} );
			} );
		},

		'test style command state on widget with predefined style': function( editor, bot ) {
			bot.setData( CKEDITOR.document.getById( 'predefined' ).getHtml(), function() {
				var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

				widget.focus();

				easyImageTools.assertCommandsState( editor, {
					easyimageTest: CKEDITOR.TRISTATE_ON
				} );
			} );
		},

		'test command only applies style': function( editor, bot ) {
			bot.setData( CKEDITOR.document.getById( 'standard' ).getHtml(), function() {
				var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

				widget.focus();
				editor.execCommand( 'easyimageTest' );

				easyImageTools.assertCommandsState( editor, {
					easyimageTest: CKEDITOR.TRISTATE_ON
				} );

				editor.execCommand( 'easyimageTest' );

				easyImageTools.assertCommandsState( editor, {
					easyimageTest: CKEDITOR.TRISTATE_ON
				} );
			} );
		},

		'test styles being exclusive': function( editor, bot ) {
			bot.setData( CKEDITOR.document.getById( 'standard' ).getHtml(), function() {
				var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

				editor.once( 'afterCommandExec', function() {
					editor.once( 'afterCommandExec', function() {
						resume( function() {
							assert.isFalse( widget.hasClass( 'test' ), 'Style removed' );
							easyImageTools.assertCommandsState( editor, {
								easyimageTest: CKEDITOR.TRISTATE_OFF,
								easyimageAlignLeft: CKEDITOR.TRISTATE_ON
							} );
						} );
					} );

					assert.isTrue( widget.hasClass( 'test' ), 'Style applied' );
					easyImageTools.assertCommandsState( editor, {
						easyimageFull: CKEDITOR.TRISTATE_OFF,
						easyimageTest: CKEDITOR.TRISTATE_ON
					} );

					editor.execCommand( 'easyimageAlignLeft' );
				} );

				widget.focus();

				easyImageTools.assertCommandsState( editor, {
					easyimageFull: CKEDITOR.TRISTATE_ON,
					easyimageTest: CKEDITOR.TRISTATE_OFF
				} );

				editor.execCommand( 'easyimageTest' );
				wait();
			} );
		},

		'test style command does not change element tag name': function( editor, bot ) {
			bot.setData( CKEDITOR.document.getById( 'standard' ).getHtml(), function() {
				var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

				editor.once( 'afterCommandExec', function() {
					resume( function() {
						assert.areSame( 'figure', widget.element.getName(), 'Widget element type' );
					} );
				} );

				widget.focus();

				editor.execCommand( 'easyimageDivTest' );
				wait();
			} );
		},

		'test widget fallback to full style': function( editor, bot ) {
			bot.setData( CKEDITOR.document.getById( 'standard' ).getHtml(), function() {
				var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

				assert.isTrue( widget.hasClass( 'easyimage-full' ), 'Widget has correct style' );
			} );
		},

		'test custom style widget does not get the default style': function( editor, bot ) {
			bot.setData( CKEDITOR.document.getById( 'predefined' ).getHtml(), function() {
				var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

				assert.isFalse( widget.hasClass( 'easyimage-full' ), 'Default class is not added' );
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	tests[ 'test override default styles' ] = function() {
		return bender.editorBot.create( {
			name: 'test_override',
			config: {
				easyimage_styles: {
					alignLeft: {
						attributes: {
							'class': 'customClass'
						}
					}
				}
			}
		}, function( bot ) {
			var editor = bot.editor;

			bot.setData( CKEDITOR.document.getById( 'standard' ).getHtml(), function() {
				var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) );

				editor.once( 'afterCommandExec', function() {
					resume( function() {
						easyImageTools.assertCommandsState( editor, {
							easyimageAlignLeft: CKEDITOR.TRISTATE_ON
						} );
						assert.isTrue( widget.hasClass( 'customClass' ), 'Widget has appropriate class' );
					} );
				} );

				widget.focus();
				editor.execCommand( 'easyimageAlignLeft' );
				wait();
			} );
		} );
	};

	bender.test( tests );
} )();
