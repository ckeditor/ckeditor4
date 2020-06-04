/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: easyimage,toolbar,contextmenu,undo */
/* bender-include: ./_helpers/tools.js */
/* global easyImageTools */

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

	function getEasyImageBalloonContext( editor ) {
		return editor.balloonToolbars._contexts[ 0 ];
	}

	/*
	 * Returns an expected balloon Y position for a given widget.
	 *
	 * @param {CKEDITOR.plugins.widget} widget
	 * @returns {Number}
	 */
	function getExpectedYOffset( widget ) {
		var editor = widget.editor,
			wrapperPosition = widget.element.getDocumentPosition( CKEDITOR.document ),
			wrapperRect = widget.element.getClientRect(),
			toolbar = getEasyImageBalloonContext( editor ).toolbar,
			ret = wrapperPosition.y + wrapperRect.height + toolbar._view.triangleHeight;

		return ret;
	}

	var testSuiteIframe = CKEDITOR.document.getWindow().getFrame(),
		initialFrameHeight = testSuiteIframe && testSuiteIframe.getStyle( 'height' ),
		tests = {
			setUp: function() {
				bender.tools.ignoreUnsupportedEnvironment( 'easyimage' );
				// This test checks real balloon panel positioning. To avoid affecting position with scroll offset, set the parent iframe height
				// enough to contain entire content. Note that iframe is not present if the test suite is open in a separate window, or ran on IEs.
				if ( testSuiteIframe ) {
					testSuiteIframe.setStyle( 'height', '3000px' );
				} else {
					CKEDITOR.document.getDocumentElement().setStyle( 'height', '3000px' );
				}
			},

			tearDown: function() {
				if ( testSuiteIframe ) {
					testSuiteIframe.setStyle( 'height', initialFrameHeight );
				}
			},

			'test balloontoolbar integration': function( editor, bot ) {
				var widgetHtml = '<figure class="image easyimage"><img src="../image2/_assets/foo.png" alt="foo"><figcaption>Test image</figcaption></figure>';

				bot.setData( widgetHtml, function() {
					var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) ),
						toolbar = getEasyImageBalloonContext( editor ).toolbar;

					toolbar._view.once( 'show', function() {
						easyImageTools.assertCommandsState( editor, {
							easyimageFull: CKEDITOR.TRISTATE_ON,
							easyimageSide: CKEDITOR.TRISTATE_OFF,
							easyimageAlt: CKEDITOR.TRISTATE_OFF
						} );

						editor.once( 'afterCommandExec', function() {
							resume( function() {
								easyImageTools.assertCommandsState( editor, {
									easyimageFull: CKEDITOR.TRISTATE_OFF,
									easyimageSide: CKEDITOR.TRISTATE_ON,
									easyimageAlt: CKEDITOR.TRISTATE_OFF
								} );
							} );
						} );

						editor.execCommand( 'easyimageSide' );
					} );

					widget.focus();
					wait();
				} );
			},

			'test balloontoolbar positioning': function( editor, bot ) {
				// Ignore test with builded editor in travis.
				if ( bender.config.isTravis && bender.tools.env.isBuild ) {
					assert.ignore();
				}
				// Force toolbar to always appear under the widget.
				editor.container.getWindow().$.scroll( 0, editor.container.getDocumentPosition().y );

				var source = '<figure class="image easyimage"><img src="../image2/_assets/bar.png" alt="foo"><figcaption></figcaption></figure>';

				bot.setData( source, function() {
					var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) ),
						toolbar = getEasyImageBalloonContext( editor ).toolbar;

					widget.once( 'focus', function() {
						setTimeout( function() {
							var expectedY = getExpectedYOffset( widget ),
								moveSpy = sinon.spy( toolbar._view, 'move' );

							widget.parts.caption.focus();

							widget.focus();

							setTimeout( function() {
								resume( function() {
									moveSpy.restore();
									// We care only about y axis.
									var actual = moveSpy.args[ 0 ][ 0 ];

									if ( CKEDITOR.env.ie && CKEDITOR.env.ie <= 11 || CKEDITOR.env.iOS ) {
										// IE11 and Safari tends to be off by a fraction of a pixel on high DPI displays.
										assert.isNumberInRange( actual, expectedY - 1, expectedY + 1, 'Balloon y position' );
									} else {
										assert.areSame( expectedY, actual, 'Balloon y position' );
									}
								} );
							}, 0 );
						}, 0 );
					} );

					widget.focus();
					wait();
				} );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );
	bender.test( tests );
} )();
