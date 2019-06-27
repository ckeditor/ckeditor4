/* bender-tags: editor */
/* bender-ckeditor-plugins: link,toolbar */

( function() {
	'use strict';

	bender.editors = {
		enter_p: {
			config: {
				enterMode: CKEDITOR.ENTER_P,
				extraAllowedContent: 'strong'
			}
		},
		enter_div: {
			config: {
				enterMode: CKEDITOR.ENTER_DIV,
				extraAllowedContent: 'strong'
			}
		},
		enter_br: {
			config: {
				enterMode: CKEDITOR.ENTER_BR,
				extraAllowedContent: 'strong'
			}
		}
	};

	var tagMapping = {};

	tagMapping[ CKEDITOR.ENTER_DIV ] = 'div';
	tagMapping[ CKEDITOR.ENTER_P ] = 'p';

	var tests = {
		'test overriding whole block': function( editor, bot ) {
			// If we have whole block selected, we need to make sure that by overriding the selection with new anchor it
			// will be wrapped with a block instead of be put directly into editable (body).
			var initialValue = 'aaa',
				expected = '<a href="http://ckeditor.com">bbb</a>',
				wrappingTemplate = new CKEDITOR.template( '<{tag}>{content}</{tag}>' );

			if ( tagMapping[ editor.activeEnterMode ] ) {
				initialValue = wrappingTemplate.output( {
					tag: tagMapping[ editor.activeEnterMode ],
					content: initialValue
				} );

				expected = wrappingTemplate.output( {
					tag: tagMapping[ editor.activeEnterMode ],
					content: expected
				} );
			}

			bot.setHtmlWithSelection( '[' + initialValue + ']' );

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'linkDisplayText', 'bbb' );
				dialog.setValueOf( 'info', 'url', 'http://ckeditor.com' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( expected, bot.getData( true ) );
			} );
		},

		'test block with nested inline element': function( editor, bot ) {
			var initialValue = '<strong>aaa</strong>',
				expected = '<a href="http://ckeditor.com">bbb</a>',
				wrappingTemplate = new CKEDITOR.template( '<{tag}>{content}</{tag}>' );

			if ( tagMapping[ editor.activeEnterMode ] ) {
				initialValue = wrappingTemplate.output( {
					tag: tagMapping[ editor.activeEnterMode ],
					content: initialValue
				} );

				expected = wrappingTemplate.output( {
					tag: tagMapping[ editor.activeEnterMode ],
					content: expected
				} );
			}

			bot.setHtmlWithSelection( '[' + initialValue + ']' );

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'linkDisplayText', 'bbb' );
				dialog.setValueOf( 'info', 'url', 'http://ckeditor.com' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( expected, bot.getData( true ) );
			} );
		}
	};

	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests ) );
} )();
