/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: imagebase,toolbar */

( function() {
	'use strict';

	function assertUpcast( bot, data, widget, expectedWidgetCount ) {
		var editor = bot.editor;

		if ( typeof expectedWidgetCount === 'undefined' ) {
			expectedWidgetCount = 1;
		}

		bot.setData( data, function() {
			var widgets = editor.editable().find( '[data-widget="' + widget + '"]' );

			assert.areSame( expectedWidgetCount, widgets.count(), 'Widgets count' );
		} );
	}


	bender.editors = {
		classic: {
			config: {
				extraAllowedContent: 'figure img[data-cke-realelement]'
			}
		},

		divarea: {
			config: {
				extraPlugins: 'divarea',
				extraAllowedContent: 'figure img[data-cke-realelement]'
			}
		},

		inline: {
			creator: 'inline',
			config: {
				extraAllowedContent: 'figure img[data-cke-realelement]'
			}
		}
	};

	var tests = {
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

		'test default upcast': function( editor, bot ) {
			assertUpcast( bot, '<figure></figure>', 'testWidget' );
		},

		'test does not upcast fake objects': function( editor, bot ) {
			CKEDITOR.plugins.imagebase.addImageWidget( editor, 'imgWidget', {
				upcast: function( element ) {
					if ( !this._isValidImageElement( element ) ) {
						return;
					}


					return element.name === 'img';
				}
			} );

			assertUpcast( bot, '<img data-cke-realelement="foo" src="test" />', 'imgWidget', 0 );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
