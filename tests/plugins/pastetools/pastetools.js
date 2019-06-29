/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: basicstyles, pastetools */
/* bender-include: ../clipboard/_helpers/pasting.js */
/* global createFixtures, assertPasteEvent */

( function() {
	'use strict';

	var basicConfig = {
		language: 'en',
		on: {
			pluginsLoaded: function( evt ) {
				var editor = evt.editor;

				editor.pasteTools.register( {
					canHandle: function( evt ) {
						return evt.data.type === 'html';
					},

					handle: function( evt ) {
						evt.data.dataValue = '<p><strong>SURPRISE!</strong></p>';
					}
				} );
			}
		}
	};

	bender.editors = {
		classic: {
			config: basicConfig
		},

		divarea: {
			config: CKEDITOR.tools.object.merge( basicConfig, { extraPlugins: 'divarea' } )
		},

		inline: {
			creator: 'inline',
			config: basicConfig
		}
	};

	var fixtures = createFixtures( {
			html: {
				type: 'html',
				dataValue: '<p><strong>SURPRISE!</strong></p>'
			},

			text: {
				type: 'text',
				dataValue: 'foobar'
			}
		} ),
		tests = {
			'test transforming pasted html content': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = fixtures.get( 'html' );

					assertPasteEvent( editor, { type: 'html', dataValue: '<p><s>Some striked text</s></p>' }, pasteData );
				} );
			},

			'test not transforming content of unregistered type': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = fixtures.get( 'text' );

					assertPasteEvent( editor, { type: 'text', dataValue: 'foobar' }, pasteData );
				} );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();
