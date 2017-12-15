/* bender-tags: balloontoolbar */
/* bender-ckeditor-plugins: toolbar,balloontoolbar,floatingspace,image2,undo */
/* bender-include: _helpers/default.js */
/* global ignoreUnsupportedEnvironment */

( function() {
	'use strict';

	var commonConfig = {
		allowedContent: true,
		height: 200
	};

	bender.editors = {
		classic: {
			config: commonConfig
		},

		divarea: {
			config: CKEDITOR.tools.object.merge( commonConfig, { extraPlugins: 'divarea' } )
		},

		inline: {
			creator: 'inline',
			config: commonConfig
		}
	};

	var parentFrame = window.frameElement,
		originalHeight = parentFrame && parentFrame.style.height;

	var tests = {
		setUp: function() {
			// In IE8 tests are run in very small window which breaks positioning assertions and tests fails (#1076).
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}
			if ( parentFrame ) {
				parentFrame.style.height = '900px';
			}

			CKEDITOR.addCss( '.sideimage {' +
				'float: right;' +
				'width: 25%;' +
			'}' );
		},

		tearDown: function() {
			if ( parentFrame ) {
				parentFrame.style.height = originalHeight;
			}
		},

		// #1342
		'test panel refresh position': function( editor, bot ) {

			bot.setData( '<figure class="image"><img src="' + bender.basePath + '/_assets/lena.jpg"></figure>', function() {
				var balloonToolbar = new CKEDITOR.ui.balloonToolbarView( editor, {
					width: 100,
					height: 200
				} ),
				widget = editor.widgets.instances[ 0 ],
				markerElement = widget.element,
				initialPosition,
				currentPosition;

				balloonToolbar.attach( markerElement );
				initialPosition = balloonToolbar.parts.panel.getClientRect();

				editor.once( 'change', function() {
					resume( function() {
						currentPosition = balloonToolbar.parts.panel.getClientRect();
						assert.areNotSame( initialPosition.left, currentPosition.left, 'position of toolbar' );
					} );
				} );

				markerElement.setStyle( 'margin-left', '200px' );
				editor.fire( 'change' );

				wait();
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	ignoreUnsupportedEnvironment( tests );
	bender.test( tests );
} )();
