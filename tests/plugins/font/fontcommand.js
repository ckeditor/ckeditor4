/* bender-ckeditor-plugins: font,toolbar,basicstyles,table,list */

( function() {
	'use strict';

	var ARIAL = 'Arial',
		COMIC_SANS = 'Comic Sans MS',
		COURIER_NEW = 'Courier New',
		NONE = '',
		fontFamily = {};

	fontFamily[ ARIAL ] = 'Arial,Helvetica,sans-serif';
	fontFamily[ COMIC_SANS ] = 'Comic Sans MS,cursive';
	fontFamily[ COURIER_NEW ] = 'Courier New,Courier,monospace';

	var CONTENT_TEMPLATE = '[<p>^test$@</p>' +
		'<table border="1" cellpadding="1" cellspacing="1" style="width:500px">' +
			'<tbody>' +
				'<tr>' +
					'<td>^one$</td>' +
					'<td>^two$</td>' +
				'</tr>' +
				'<tr>' +
					'<td>^three$</td>' +
					'<td>^four$</td>' +
				'</tr>' +
			'</tbody>' +
		'</table>' +
		'<ul>' +
			'<li>^item1$</li>' +
			'<li>^item2$</li>' +
		'</ul>' +
		'<p>^<u><em><strong>Formatted text.</strong></em></u>$</p>]';

	bender.editor = {};


	function assertFontCommand( options ) {
		var expected = options.expected,
			editor = options.editor,
			oldValue = options.oldValue || '',
			newValue = options.newValue || '',
			message = options.message,
			collapsed = options.collapsed || false,
			commandName = options.commandName;


		editor.execCommand( commandName, { oldValue: oldValue, newValue: newValue } );

		if ( collapsed ) {
			editor.insertText( 'ZWS' );
		}

		assert.isInnerHtmlMatching( expected, editor.editable().getHtml(), {
			fixStyles: true
		}, message );
	}

	bender.test( {
		tearDown: function() {
			this.editor.setReadOnly( false );
		},

		'test should apply correct font': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{foo}</p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p><span style="font-family:' + fontFamily[ ARIAL ] + '">foo</span>@</p>',
				newValue: ARIAL
			} );
		},

		'test should override existing font': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="font-family:' + fontFamily[ COMIC_SANS ] + '">{foo}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p><span style="font-family:' + fontFamily[ ARIAL ] + '">foo</span>@</p>',
				newValue: ARIAL,
				oldValue: COMIC_SANS
			} );
		},

		'test should split element and apply new font to current selection': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="font-family:' + fontFamily[ COMIC_SANS ] + '">fo{o}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p>' +
						'<span style="font-family:' + fontFamily[ COMIC_SANS ] + '">fo</span>' +
						'<span style="font-family:' + fontFamily[ ARIAL ] + '">o</span>@' +
					'</p>',
				newValue: ARIAL,
				oldValue: COMIC_SANS
			} );
		},

		'test should remove font when newValue is empty': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="font-family:' + fontFamily[ COMIC_SANS ] + '">{foo}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p>foo@</p>',
				newValue: NONE,
				oldValue: COMIC_SANS
			} );
		},

		'test should remove selected part when newValue is empty': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="font-family:' + fontFamily[ COMIC_SANS ] + '">fo{o}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p><span style="font-family:' + fontFamily[ COMIC_SANS ] + '">fo</span>o@</p>',
				newValue: NONE,
				oldValue: COMIC_SANS
			} );
		},

		'test should add empty font span for collapsed selection': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>fo{}o</p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p>fo<span style="font-family:' + fontFamily[ COMIC_SANS ] + '">ZWS</span>o@</p>',
				newValue: COMIC_SANS,
				collapsed: true
			} );
		},

		'test should split nodes when newValue is empty': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="font-family:' + fontFamily[ ARIAL ] + '">f{}oo</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p>' +
						'<span style="font-family:' + fontFamily[ ARIAL ] + '">f</span>' +
						'ZWS' +
						'<span style="font-family:' + fontFamily[ ARIAL ] + '">oo</span>@' +
					'</p>',
				newValue: NONE,
				oldValue: ARIAL,
				collapsed: true
			} );
		},

		'test should split node when new font is added in the middle of another': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="font-family:' + fontFamily[ ARIAL ] + '">f{}oo</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p>' +
						'<span style="font-family:' + fontFamily[ ARIAL ] + '">f</span>' +
						'<span style="font-family:' + fontFamily[ COURIER_NEW ] + '">ZWS</span>' +
						'<span style="font-family:' + fontFamily[ ARIAL ] + '">oo</span>@' +
					'</p>',
				newValue: COURIER_NEW,
				oldValue: ARIAL,
				collapsed: true
			} );
		},

		'test should merge nodes into one when multiple nodes are selected': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>' +
					'<span style="font-family:' + fontFamily[ ARIAL ] + '">f</span>' +
					'{o}' +
					'<span style="font-family:' + fontFamily[ ARIAL ] + '">o</span>' +
				'</p>'
			);

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p><span style="font-family:' + fontFamily[ ARIAL ] + '">foo</span>@</p>',
				newValue: ARIAL
			} );
		},

		'test should merge nodes when selection start and ends outside of font': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{f<span style="font-family:' + fontFamily[ ARIAL ] + '">o</span>o}</p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p><span style="font-family:' + fontFamily[ ARIAL ] + '">foo</span>@</p>',
				newValue: ARIAL
			} );
		},

		'test should merge and transform nodes when selection start and ends outside of font': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{f<span style="font-family:' + fontFamily[ ARIAL ] + '">o</span>o}</p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p><span style="font-family:' + fontFamily[ COURIER_NEW ] + '">foo</span>@</p>',
				newValue: COURIER_NEW
			} );
		},

		'test should be posisble to cancel command': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{foo}</p>' );

			editor.once( 'beforeCommandExec', function( evt ) {
				if ( evt.data.name === 'font' ) {
					evt.cancel();
				} else {
					assert.fail( 'There was called wrong command: ' + evt.data.name );
				}
			} );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p>foo@</p>',
				newValue: ARIAL
			} );
		},

		'test should not apply new font when editor is in readonly mode': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{foo}</p>' );

			editor.setReadOnly( true );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p>foo@</p>',
				newValue: ARIAL
			} );
		},

		'test should apply font command to multiple different elements in editor': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, CONTENT_TEMPLATE.replace( /[\^\$@]/g, '' ) );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: CONTENT_TEMPLATE
					.replace( /[\[\]]/g, '' )
					.replace( /\^/g, '<span style="font-family:' + fontFamily[ ARIAL ] + '">' )
					.replace( /\$/g, '</span>' ),
				newValue: ARIAL
			} );
		},

		'test should apply correct font size': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{foo}</p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p><span style="font-size:24px">foo</span>@</p>',
				newValue: 24
			} );
		},

		'test should override existing font size': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="font-size:24px">{foo}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p><span style="font-size:48px">foo</span>@</p>',
				newValue: 48,
				oldValue: 24
			} );
		},

		'test should split element and apply new font size to current selection': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="font-size:24px">fo{o}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p>' +
						'<span style="font-size:24px">fo</span>' +
						'<span style="font-size:48px">o</span>@' +
					'</p>',
				newValue: 48,
				oldValue: 24
			} );
		},

		'test should remove font size when newValue is empty': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="font-size:24px">{foo}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p>foo@</p>',
				newValue: NONE,
				oldValue: 24
			} );
		},

		'test should remove selected part with font size when newValue is empty': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="font-size:24px">fo{o}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p><span style="font-size:24px">fo</span>o@</p>',
				newValue: NONE,
				oldValue: 24
			} );
		},

		'test should add empty font size span for collapsed selection': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>fo{}o</p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p>fo<span style="font-size:48px">ZWS</span>o@</p>',
				newValue: 48,
				collapsed: true
			} );
		},

		'test should split nodes when newValue of font size is empty': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="font-size:24px;">f{}oo</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p>' +
						'<span style="font-size:24px">f</span>' +
						'ZWS' +
						'<span style="font-size:24px">oo</span>@' +
					'</p>',
				newValue: NONE,
				oldValue: 24,
				collapsed: true
			} );
		},

		'test should split node when new font size is added in the middle of another': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="font-size:24px">f{}oo</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p>' +
						'<span style="font-size:24px">f</span>' +
						'<span style="font-size:48px">ZWS</span>' +
						'<span style="font-size:24px">oo</span>@' +
					'</p>',
				newValue: 48,
				oldValue: 24,
				collapsed: true
			} );
		},

		'test should merge nodes into one on font size command execution when multiple nodes are selected': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>' +
					'<span style="font-size:24px">f</span>' +
					'{o}' +
					'<span style="font-size:24px">o</span>' +
				'</p>'
			);

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p><span style="font-size:24px">foo</span>@</p>',
				newValue: 24
			} );
		},

		'test should merge nodes when selection start and ends outside of font size': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{f<span style="font-size:24px">o</span>o}</p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p><span style="font-size:24px">foo</span>@</p>',
				newValue: 24
			} );
		},

		'test should merge and transform nodes when selection start and ends outside of font size': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{f<span style="font-size:24px">o</span>o}</p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p><span style="font-size:48px">foo</span>@</p>',
				newValue: 48
			} );
		},

		'test should be posisble to cancel font size command': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{foo}</p>' );

			editor.once( 'beforeCommandExec', function( evt ) {
				if ( evt.data.name === 'fontSize' ) {
					evt.cancel();
				} else {
					assert.fail( 'There was called wrong command: ' + evt.data.name );
				}
			} );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p>foo@</p>',
				newValue: 24
			} );
		},

		'test should not apply new font size when editor is in readonly mode': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{foo}</p>' );

			editor.setReadOnly( true );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p>foo@</p>',
				newValue: 24
			} );
		},

		'test should apply font size command to multiple different elements in editor': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, CONTENT_TEMPLATE.replace( /[\^\$@]/g, '' ) );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: CONTENT_TEMPLATE
					.replace( /[\[\]]/g, '' )
					.replace( /\^/g, '<span style="font-size:24px">' )
					.replace( /\$/g, '</span>' ),
				newValue: 24
			} );
		}

	} );
} )();
