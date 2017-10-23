/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: imagebase,toolbar */

( function() {
	'use strict';

	function assertUpcast( bot, data, widget ) {
		var editor = bot.editor;

		bot.setData( data, function() {
			var widgets = editor.editable().find( '[data-widget="' + widget + '"]' );

			assert.areSame( 1, widgets.count(), 'Widget is properly upcasted' );
		} );
	}


	bender.editors = {
		classic: {
			config: {
				extraAllowedContent: 'figure img'
			}
		},

		divarea: {
			config: {
				extraPlugins: 'divarea',
				extraAllowedContent: 'figure img'
			}
		},

		inline: {
			creator: 'inline',
			config: {
				extraAllowedContent: 'figure img'
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

		'test custom upcast': function( editor, bot ) {
			CKEDITOR.plugins.imagebase.addImageWidget( editor, 'customUpcastWidget', {
				upcasts: {
					img: function( element ) {
						return element;
					}
				}
			} );

			assertUpcast( bot, '<img src="test" />', 'customUpcastWidget' );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
