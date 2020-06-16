/* bender-ckeditor-plugins: font,toolbar,basicstyles,table,list */
/* bender-tags: font, command, 3728 */
/* bender-include: ./_helpers/tools.js */
/* global fontTools */

( function() {
	'use strict';

	var font_style = {
			element: 'span',
			styles: { 'font-family': '#(family)' }
		},
		fontSize_style = {
			element: 'span',
			styles: { 'font-size': '#(size)' }
		},
		ARIAL = new CKEDITOR.style( font_style, { family: 'Arial,Helvetica,sans-serif' } ),
		COMIC_SANS = new CKEDITOR.style( font_style, { family: 'Comic Sans MS,cursive' } ),
		COURIER_NEW = new CKEDITOR.style( font_style, { family: 'Courier New,Courier,monospace' } ),
		SIZE_24PX = new CKEDITOR.style( fontSize_style, { size: '24px' } ),
		SIZE_48PX = new CKEDITOR.style( fontSize_style, { size: '48px' } ),
		CONTENT_TEMPLATE = '[<p>^test$@</p>' +
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

	function getStyleText( style ) {
		return CKEDITOR.style.getStyleText( style.getDefinition() ).replace( ';', '' );
	}

	function assertFontCommand( options ) {
		var expected = options.expected,
			editor = options.editor,
			oldStyle = options.oldStyle,
			newStyle = options.newStyle,
			message = options.message,
			collapsed = options.collapsed || false,
			commandName = options.commandName;


		editor.execCommand( commandName, { oldStyle: oldStyle, newStyle: newStyle } );

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
				expected: '<p><span style="' + getStyleText( ARIAL ) + '">foo</span>@</p>',
				newStyle: ARIAL
			} );
		},

		'test should override existing font': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( COMIC_SANS ) + '">{foo}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p><span style="' + getStyleText( ARIAL ) + '">foo</span>@</p>',
				newStyle: ARIAL,
				oldStyle: COMIC_SANS
			} );
		},

		'test should split element and apply new font to current selection': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( COMIC_SANS ) + '">fo{o}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p>' +
						'<span style="' + getStyleText( COMIC_SANS ) + '">fo</span>' +
						'<span style="' + getStyleText( ARIAL ) + '">o</span>@' +
					'</p>',
				newStyle: ARIAL,
				oldStyle: COMIC_SANS
			} );
		},

		'test should remove font when newStyle is empty': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( COMIC_SANS ) + '">{foo}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p>foo@</p>',
				newStyle: undefined,
				oldStyle: COMIC_SANS
			} );
		},

		'test should remove selected part when newStyle is empty': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( COMIC_SANS ) + '">fo{o}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p><span style="' + getStyleText( COMIC_SANS ) + '">fo</span>o@</p>',
				newStyle: undefined,
				oldStyle: COMIC_SANS
			} );
		},

		'test should do nothing when the same font style is applied': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( COMIC_SANS ) + '">{foo}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p><span style="' + getStyleText( COMIC_SANS ) + '">foo</span>@</p>',
				newStyle: COMIC_SANS,
				oldStyle: COMIC_SANS
			} );
		},

		'test should add empty font span for collapsed selection': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>fo{}o</p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p>fo<span style="' + getStyleText( COMIC_SANS ) + '">ZWS</span>o@</p>',
				newStyle: COMIC_SANS,
				collapsed: true
			} );
		},

		'test should split nodes when newStyle is empty': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( ARIAL ) + '">f{}oo</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p>' +
						'<span style="' + getStyleText( ARIAL ) + '">f</span>' +
						'ZWS' +
						'<span style="' + getStyleText( ARIAL ) + '">oo</span>@' +
					'</p>',
				newStyle: undefined,
				oldStyle: ARIAL,
				collapsed: true
			} );
		},

		'test should split node when new font is added in the middle of another': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( ARIAL ) + '">f{}oo</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p>' +
						'<span style="' + getStyleText( ARIAL ) + '">f</span>' +
						'<span style="' + getStyleText( COURIER_NEW ) + '">ZWS</span>' +
						'<span style="' + getStyleText( ARIAL ) + '">oo</span>@' +
					'</p>',
				newStyle: COURIER_NEW,
				oldStyle: ARIAL,
				collapsed: true
			} );
		},

		'test should merge nodes into one when multiple nodes are selected': function() {
			// Safari doesn't merge nodes.
			if ( CKEDITOR.env.safari ) {
				assert.ignore();
			}

			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>' +
					'<span style="' + getStyleText( ARIAL ) + '">f</span>' +
					'{o}' +
					'<span style="' + getStyleText( ARIAL ) + '">o</span>' +
				'</p>'
			);

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p><span style="' + getStyleText( ARIAL ) + '">foo</span>@</p>',
				newStyle: ARIAL
			} );
		},

		'test should merge nodes when selection start and ends outside of font': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{f<span style="' + getStyleText( ARIAL ) + '">o</span>o}</p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p><span style="' + getStyleText( ARIAL ) + '">foo</span>@</p>',
				newStyle: ARIAL
			} );
		},

		'test should merge and transform nodes when selection start and ends outside of font': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{f<span style="' + getStyleText( ARIAL ) + '">o</span>o}</p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p><span style="' + getStyleText( COURIER_NEW ) + '">foo</span>@</p>',
				newStyle: COURIER_NEW
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
				newStyle: ARIAL
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
				newStyle: ARIAL
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
					.replace( /\^/g, '<span style="' + getStyleText( ARIAL ) + '">' )
					.replace( /\$/g, '</span>' ),
				newStyle: ARIAL
			} );
		},

		'test should apply correct font size': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{foo}</p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p><span style="font-size:24px">foo</span>@</p>',
				newStyle: SIZE_24PX
			} );
		},

		'test should override existing font size': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="font-size:24px">{foo}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p><span style="font-size:48px">foo</span>@</p>',
				newStyle: SIZE_48PX,
				oldStyle: SIZE_24PX
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
				newStyle: SIZE_48PX,
				oldStyle: SIZE_24PX
			} );
		},

		'test should remove font size when newStyle is empty': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="font-size:24px">{foo}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p>foo@</p>',
				newStyle: undefined,
				oldStyle: SIZE_24PX
			} );
		},

		'test should remove selected part with font size when newStyle is empty': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="font-size:24px">fo{o}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p><span style="font-size:24px">fo</span>o@</p>',
				newStyle: undefined,
				oldStyle: SIZE_24PX
			} );
		},

		'test should do nothing when the same fontSize style is applied': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="font-size:24px">{foo}</span></p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'font',
				expected: '<p><span style="font-size:24px">foo</span>@</p>',
				newStyle: SIZE_24PX,
				oldStyle: SIZE_24PX
			} );
		},

		'test should add empty font size span for collapsed selection': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>fo{}o</p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p>fo<span style="font-size:48px">ZWS</span>o@</p>',
				newStyle: SIZE_48PX,
				collapsed: true
			} );
		},

		'test should split nodes when newStyle of font size is empty': function() {
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
				newStyle: undefined,
				oldStyle: SIZE_24PX,
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
				newStyle: SIZE_48PX,
				oldStyle: SIZE_24PX,
				collapsed: true
			} );
		},

		'test should merge nodes into one on font size command execution when multiple nodes are selected': function() {
			// Safari doesn't merge nodes.
			if ( CKEDITOR.env.safari ) {
				assert.ignore();
			}

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
				newStyle: SIZE_24PX
			} );
		},

		'test should merge nodes when selection start and ends outside of font size': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{f<span style="font-size:24px">o</span>o}</p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p><span style="font-size:24px">foo</span>@</p>',
				newStyle: SIZE_24PX
			} );
		},

		'test should merge and transform nodes when selection start and ends outside of font size': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{f<span style="font-size:24px">o</span>o}</p>' );

			assertFontCommand( {
				editor: editor,
				commandName: 'fontSize',
				expected: '<p><span style="font-size:48px">foo</span>@</p>',
				newStyle: SIZE_48PX
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
				newStyle: SIZE_24PX
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
				newStyle: SIZE_24PX
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
				newStyle: SIZE_24PX
			} );
		},

		'test should apply font command when style match to selected one': function() {
			var editor = this.editor,
				spy = sinon.spy( editor.getCommand( 'font' ), 'exec' );

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( COURIER_NEW ) + '">[Hello]</span> world!</p>' );

			editor.ui.get( 'Font' ).onClick( 'Courier New' );

			spy.restore();

			sinon.assert.calledOnce( spy );
			assert.pass();
		},

		'test should apply font command when style match to selected one with collapsed selection': function() {
			var editor = this.editor,
				spy = sinon.spy( editor.getCommand( 'font' ), 'exec' );

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( COURIER_NEW ) + '">He[]llo</span> world!</p>' );

			editor.ui.get( 'Font' ).onClick( 'Courier New' );

			spy.restore();

			sinon.assert.calledOnce( spy );
			assert.pass();
		},

		'test should apply font command over the same selection': function() {
			var editor = this.editor,
				spy = sinon.spy( editor.getCommand( 'font' ), 'exec' );

			bender.tools.selection.setWithHtml( editor, '<p>[Hello] world!</p>' );

			editor.ui.get( 'Font' ).onClick( 'Courier New' );
			editor.ui.get( 'Font' ).onClick( 'Courier New' );
			editor.ui.get( 'Font' ).onClick( 'Courier New' );
			editor.ui.get( 'Font' ).onClick( 'Courier New' );

			spy.restore();

			sinon.assert.called( spy );

			assert.isInnerHtmlMatching(
				'<p><span style="' + getStyleText( COURIER_NEW ) + '">Hello</span> world!@</p>',
				editor.editable().getHtml(),
				{ fixStyles: true }
			);
		},

		'test should run remove font command for not styled content': function() {
			var editor = this.editor,
				spy = sinon.spy( editor.getCommand( 'font' ), 'exec' );

			bender.tools.selection.setWithHtml( editor, '<p>[Hello] world!</p>' );

			editor.ui.get( 'Font' ).onClick( fontTools.defaultValue );

			spy.restore();

			sinon.assert.calledOnce( spy );
			assert.pass();
		},

		'test should apply font command for not styled content with collapsed selection': function() {
			var editor = this.editor,
				spy = sinon.spy( editor.getCommand( 'font' ), 'exec' );

			bender.tools.selection.setWithHtml( editor, '<p>Hel[]lo world!</p>' );

			editor.ui.get( 'Font' ).onClick( fontTools.defaultValue );

			spy.restore();

			sinon.assert.calledOnce( spy );
			assert.pass();
		},

		'test should run remove font command only once over the same content': function() {
			var editor = this.editor,
				spy = sinon.spy( editor.getCommand( 'font' ), 'exec' );

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( COURIER_NEW ) + '">[Hello]</span> world!</p>' );

			editor.ui.get( 'Font' ).onClick( fontTools.defaultValue );

			spy.restore();

			sinon.assert.calledOnce( spy );

			assert.isInnerHtmlMatching(
				'<p>Hello world!@</p>',
				editor.editable().getHtml(),
				{ fixStyles: true }
			);
		},

		'test should apply font command when style doesn\'t match': function() {
			var editor = this.editor,
				spy = sinon.spy( editor.getCommand( 'font' ), 'exec' );

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( COURIER_NEW ) + '">[Hello]</span> world!</p>' );

			editor.ui.get( 'Font' ).onClick( 'Arial' );
			editor.ui.get( 'Font' ).onClick( 'Arial' );

			spy.restore();

			sinon.assert.called( spy );

			assert.isInnerHtmlMatching(
				'<p><span style="' + getStyleText( ARIAL ) + '">Hello</span> world!@</p>',
				editor.editable().getHtml(),
				{ fixStyles: true }
			);
		},

		'test should apply font command when inner content has unstyled fragment': function() {
			var editor = this.editor,
				spy = sinon.spy( editor.getCommand( 'font' ), 'exec' );

			bender.tools.selection.setWithHtml( editor, '<p>' +
				'<span style="' + getStyleText( COURIER_NEW ) + '">[Hel</span>' +
				'lo wor' +
				'<span style="' + getStyleText( COURIER_NEW ) + '">ld!]</span></p>' );

			editor.ui.get( 'Font' ).onClick( 'Courier New' );
			editor.ui.get( 'Font' ).onClick( 'Courier New' );

			spy.restore();

			sinon.assert.called( spy );

			assert.isInnerHtmlMatching(
				'<p><span style="' + getStyleText( COURIER_NEW ) + '">Hello world!</span>@</p>',
				editor.editable().getHtml(),
				{ fixStyles: true }
			);
		},

		'test should apply font size command multiple times over the same selection': function() {
			var editor = this.editor,
				spy = sinon.spy( editor.getCommand( 'fontSize' ), 'exec' );

			bender.tools.selection.setWithHtml( editor, '<p>[Hello] world!</p>' );

			editor.ui.get( 'FontSize' ).onClick( '24' );
			editor.ui.get( 'FontSize' ).onClick( '24' );
			editor.ui.get( 'FontSize' ).onClick( '24' );
			editor.ui.get( 'FontSize' ).onClick( '24' );

			spy.restore();

			sinon.assert.called( spy );

			assert.isInnerHtmlMatching(
				'<p><span style="' + getStyleText( SIZE_24PX ) + '">Hello</span> world!@</p>',
				editor.editable().getHtml(),
				{ fixStyles: true }
			);
		},

		'test should run remove font size command for not styled content': function() {
			var editor = this.editor,
				spy = sinon.spy( editor.getCommand( 'fontSize' ), 'exec' );

			bender.tools.selection.setWithHtml( editor, '<p>[Hello] world!</p>' );

			editor.ui.get( 'FontSize' ).onClick( fontTools.defaultValue );

			spy.restore();

			sinon.assert.calledOnce( spy );
			assert.pass();
		},

		'test should run remove font size command for not styled content collapsed selection': function() {
			var editor = this.editor,
				spy = sinon.spy( editor.getCommand( 'fontSize' ), 'exec' );

			bender.tools.selection.setWithHtml( editor, '<p>Hel[]lo world!</p>' );

			editor.ui.get( 'FontSize' ).onClick( fontTools.defaultValue );

			spy.restore();

			sinon.assert.calledOnce( spy );
			assert.pass();
		},

		'test should run remove font size command over the same content': function() {
			var editor = this.editor,
				spy = sinon.spy( editor.getCommand( 'fontSize' ), 'exec' );

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( SIZE_24PX ) + '">[Hello]</span> world!</p>' );

			editor.ui.get( 'FontSize' ).onClick( fontTools.defaultValue );

			spy.restore();

			sinon.assert.calledOnce( spy );

			assert.isInnerHtmlMatching(
				'<p>Hello world!@</p>',
				editor.editable().getHtml(),
				{ fixStyles: true }
			);
		},

		'test should apply font size command when style doesn\'t match': function() {
			var editor = this.editor,
				spy = sinon.spy( editor.getCommand( 'fontSize' ), 'exec' );

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( SIZE_24PX ) + '">[Hello]</span> world!</p>' );

			editor.ui.get( 'FontSize' ).onClick( '48' );
			editor.ui.get( 'FontSize' ).onClick( '48' );

			spy.restore();

			sinon.assert.called( spy );

			assert.isInnerHtmlMatching(
				'<p><span style="' + getStyleText( SIZE_48PX ) + '">Hello</span> world!@</p>',
				editor.editable().getHtml(),
				{ fixStyles: true }
			);
		},

		'test should apply font size command when inner content has unstyled fragment': function() {
			var editor = this.editor,
				spy = sinon.spy( editor.getCommand( 'fontSize' ), 'exec' );

			bender.tools.selection.setWithHtml( editor, '<p>' +
				'<span style="' + getStyleText( SIZE_24PX ) + '">[Hel</span>' +
				'lo wor' +
				'<span style="' + getStyleText( SIZE_24PX ) + '">ld!]</span></p>' );

			editor.ui.get( 'FontSize' ).onClick( '24' );
			editor.ui.get( 'FontSize' ).onClick( '24' );

			spy.restore();

			sinon.assert.called( spy );

			assert.isInnerHtmlMatching(
				'<p><span style="' + getStyleText( SIZE_24PX ) + '">Hello world!</span>@</p>',
				editor.editable().getHtml(),
				{ fixStyles: true }
			);
		}
	} );
} )();
