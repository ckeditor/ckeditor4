/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: easyimage,toolbar,contextmenu,undo */

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

	function assertCommandsState( editor, asserts ) {
		var command;

		for ( command in asserts ) {
			assert.areSame( asserts[ command ], editor.getCommand( command ).state,
				'Command ' + command + ' has appropriate state' );
		}
	}

	function getEasyImageBalloonContext( editor ) {
		return editor.balloonToolbars._contexts[ 0 ];
	}

	var widgetHtml = '<figure class="image easyimage"><img src="../image2/_assets/foo.png" alt="foo"><figcaption>Test image</figcaption></figure>',
		testSuiteIframe = CKEDITOR.document.getWindow().getFrame(),
		initialFrameHeight = null,
		tests = {
			setUp: function() {
				// This test checks real balloon panel positioning. To avoid affecting position with scroll offset, set the parent iframe height
				// enough to contain entire content. Note that some browsers like IE/Edge do not use the iframe but display results in a new
				// window, so this is not needed there.
				if ( testSuiteIframe ) {
					initialFrameHeight = testSuiteIframe.getStyle( 'height' );
					testSuiteIframe.setStyle( 'height', '3000px' );
				}
			},

			tearDown: function() {
				// testSuiteIframe = CKEDITOR.document.getWindow().getFrame();

				if ( testSuiteIframe ) {
					testSuiteIframe.setStyle( 'height', initialFrameHeight );
				}
			},

			'test balloontoolbar integration': function( editor, bot ) {
				bot.setData( widgetHtml, function() {
					var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) ),
						toolbar = getEasyImageBalloonContext( editor ).toolbar;

					toolbar._view.once( 'show', function() {
						assertCommandsState( editor, {
							easyimageFull: CKEDITOR.TRISTATE_ON,
							easyimageSide: CKEDITOR.TRISTATE_OFF,
							easyimageAlt: CKEDITOR.TRISTATE_OFF
						} );

						editor.once( 'afterCommandExec', function() {
							resume( function() {
								assertCommandsState( editor, {
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
				var source = '<figure class="image easyimage"><img src="../image2/_assets/bar.png" alt="foo"><figcaption></figcaption></figure>';

				bot.setData( source, function() {
					var widget = editor.widgets.getByElement( editor.editable().findOne( 'figure' ) ),
						toolbar = getEasyImageBalloonContext( editor ).toolbar;

					widget.once( 'focus', function() {
						setTimeout( function() {
							var wrapperRect = widget.element.getClientRect(),
								expectedY = wrapperRect.bottom + toolbar._view.triangleHeight,
								moveSpy = sinon.spy( toolbar._view, 'move' );

							if ( !editor.editable().isInline() ) {
								// In case of classic editor we also need to include position of the editor iframe too.
								expectedY += editor.window.getFrame().getClientRect().top;
							}

							widget.parts.caption.focus();

							widget.focus();

							setTimeout( function() {
								resume( function() {
									moveSpy.restore();

									// debugger;

									// We care only about y axis.
									// sinon.assert.calledWith( moveSpy, 120, sinon.match.any );
									// sinon.assert.calledWith( moveSpy, 161.5999984741211, sinon.match.any );
									sinon.assert.calledWith( moveSpy, expectedY, sinon.match.any );

									assert.isTrue( true );
								} );
							}, 0 );
						}, 0 );
					} );

					widget.focus();
					wait();
				} );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
