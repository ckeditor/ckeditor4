/* bender-tags: colorbuttons */
/* bender-ckeditor-plugins: colorbutton,toolbar,wysiwygarea,basicstyles,table,list */
/* bender-ui: collapsed */

( function() {
	'use strict';

	bender.editor = true;

	var textColor_style_template = {
			element: 'span',
			styles: { 'color': '#(color)' }
		},
		bgColor_style_template = {
			element: 'span',
			styles: { 'background-color': '#(color)' }
		},
		RED_TEXT = new CKEDITOR.style( textColor_style_template, { color: '#FF0000' } ),
		GREEN_TEXT = new CKEDITOR.style( textColor_style_template, { color: '#00FF00' } ),
		RED_BG = new CKEDITOR.style( bgColor_style_template, { color: '#FF0000' } ),
		GREEN_BG = new CKEDITOR.style( bgColor_style_template, { color: '#00FF00' } ),
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

	bender.test( {
		tearDown: function() {
			this.editor.setReadOnly( false );
		},

		'test should apply text color': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{foo}</p>' );

			assertColorCommand( {
				editor: editor,
				commandName: 'textColor',
				expected: '<p><span style="' + getStyleText( RED_TEXT ) + '">foo</span>@</p>',
				newStyle: RED_TEXT
			} );
		},

		'test should override existing text color': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( GREEN_TEXT ) + '">{foo}</span></p>' );

			assertColorCommand( {
				editor: editor,
				commandName: 'textColor',
				expected: '<p><span style="' + getStyleText( RED_TEXT ) + '">foo</span>@</p>',
				newStyle: RED_TEXT
			} );
		},

		'test should split element with text color command and override only selected fragment': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( RED_TEXT ) + '">fo{o}</span></p>' );

			assertColorCommand( {
				editor: editor,
				commandName: 'textColor',
				expected: '<p><span style="' + getStyleText( RED_TEXT ) + '">fo</span><span style="' + getStyleText( GREEN_TEXT ) + '">o</span>@</p>',
				newStyle: GREEN_TEXT
			} );
		},

		'test should remove text color, when newStyle is null': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( GREEN_TEXT ) + '">{foo}</span></p>' );

			assertColorCommand( {
				editor: editor,
				commandName: 'textColor',
				expected: '<p>foo@</p>',
				newStyle: null
			} );
		},

		'test should add empty span with text color style for collapsed selection': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>f{}oo</p>' );

			assertColorCommand( {
				editor: editor,
				commandName: 'textColor',
				expected: '<p>f<span style="' + getStyleText( RED_TEXT ) + '">ZWS</span>oo@</p>',
				newStyle: RED_TEXT,
				collapsed: true
			} );
		},

		'test should remove wrapping color and add empty span with text color style for collapsed selection': function() {
			// This is bug behaviour, expected value in test should be corrected after fixing #2932.
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( RED_TEXT ) + '">f{}oo</span></p>' );

			assertColorCommand( {
				editor: editor,
				commandName: 'textColor',
				expected: '<p>f<span style="' + getStyleText( GREEN_TEXT ) + '">ZWS</span>oo@</p>',
				newStyle: GREEN_TEXT,
				collapsed: true
			} );
		},

		'test should not nest text color': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( RED_TEXT ) + '">f{o}o</span></p>' );

			assertColorCommand( {
				editor: editor,
				commandName: 'textColor',
				expected: '<p>' +
						'<span style="' + getStyleText( RED_TEXT ) + '">f</span>' +
						'<span style="' + getStyleText( GREEN_TEXT ) + '">o</span>' +
						'<span style="' + getStyleText( RED_TEXT ) + '">o</span>@' +
					'</p>',
				newStyle: GREEN_TEXT
			} );
		},

		'test should merge text colors into one': function() {
			// Safari doesn't merge nodes.
			if ( CKEDITOR.env.safari ) {
				assert.ignore();
			}

			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>' +
				'<span style="' + getStyleText( RED_TEXT ) + '">f</span>' +
				'{o}' +
				'<span style="' + getStyleText( RED_TEXT ) + '">o</span>' +
			'</p>' );

			assertColorCommand( {
				editor: editor,
				commandName: 'textColor',
				expected: '<p>' +
						'<span style="' + getStyleText( RED_TEXT ) + '">foo</span>@' +
					'</p>',
				newStyle: RED_TEXT
			} );
		},

		'test should be possible to cancel text color command': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{foo}</p>' );

			editor.once( 'beforeCommandExec', function( evt ) {
				if ( evt.data.name === 'textColor' ) {
					evt.cancel();
				} else {
					assert.fail( 'There was called wrong command: ' + evt.data.name );
				}
			} );

			assertColorCommand( {
				editor: editor,
				commandName: 'textColor',
				expected: '<p>foo@</p>',
				newStyle: RED_TEXT
			} );
		},

		'test should not apply new text color when editor is in readonly mode': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{foo}</p>' );

			editor.setReadOnly( true );

			assertColorCommand( {
				editor: editor,
				commandName: 'textColor',
				expected: '<p>foo@</p>',
				newStyle: RED_TEXT
			} );
		},

		'test should apply text color command to multiple different elements': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, CONTENT_TEMPLATE.replace( /[\^\$@]/g, '' ) );

			assertColorCommand( {
				editor: editor,
				commandName: 'textColor',
				expected: CONTENT_TEMPLATE
					.replace( /[\[\]]/g, '' )
					.replace( /\^/g, '<span style="' + getStyleText( RED_TEXT ) + '">' )
					.replace( /\$/g, '</span>' ),
				newStyle: RED_TEXT
			} );
		},

		'test should apply background color': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{foo}</p>' );

			assertColorCommand( {
				editor: editor,
				commandName: 'bgColor',
				expected: '<p><span style="' + getStyleText( RED_BG ) + '">foo</span>@</p>',
				newStyle: RED_BG
			} );
		},

		'test should override existing background color': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( GREEN_BG ) + '">{foo}</span></p>' );

			assertColorCommand( {
				editor: editor,
				commandName: 'bgColor',
				expected: '<p><span style="' + getStyleText( RED_BG ) + '">foo</span>@</p>',
				newStyle: RED_BG
			} );
		},

		'test should split element background color command and override only selected fragment': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( RED_BG ) + '">fo{o}</span></p>' );

			assertColorCommand( {
				editor: editor,
				commandName: 'bgColor',
				expected: '<p><span style="' + getStyleText( RED_BG ) + '">fo</span><span style="' + getStyleText( GREEN_BG ) + '">o</span>@</p>',
				newStyle: GREEN_BG
			} );
		},

		'test should remove background color, when newStyle is null': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( GREEN_BG ) + '">{foo}</span></p>' );

			assertColorCommand( {
				editor: editor,
				commandName: 'bgColor',
				expected: '<p>foo@</p>',
				newStyle: null
			} );
		},

		'test should add empty span with background color style for collapsed selection': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>f{}oo</p>' );

			assertColorCommand( {
				editor: editor,
				commandName: 'bgColor',
				expected: '<p>f<span style="' + getStyleText( RED_BG ) + '">ZWS</span>oo@</p>',
				newStyle: RED_BG,
				collapsed: true
			} );
		},

		'test should remove wrapping color and add empty span with background color style for collapsed selection': function() {
			// This is bug behaviour, expected value in test should be corrected after fixing #2932.
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( RED_BG ) + '">f{}oo</span></p>' );

			assertColorCommand( {
				editor: editor,
				commandName: 'bgColor',
				expected: '<p>f<span style="' + getStyleText( GREEN_BG ) + '">ZWS</span>oo@</p>',
				newStyle: GREEN_BG,
				collapsed: true
			} );
		},

		'test should not nest background color': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p><span style="' + getStyleText( RED_BG ) + '">f{o}o</span></p>' );

			assertColorCommand( {
				editor: editor,
				commandName: 'bgColor',
				expected: '<p>' +
						'<span style="' + getStyleText( RED_BG ) + '">f</span>' +
						'<span style="' + getStyleText( GREEN_BG ) + '">o</span>' +
						'<span style="' + getStyleText( RED_BG ) + '">o</span>@' +
					'</p>',
				newStyle: GREEN_BG
			} );
		},

		'test should merge background colors into one': function() {
			// Safari doesn't merge nodes.
			if ( CKEDITOR.env.safari ) {
				assert.ignore();
			}

			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>' +
				'<span style="' + getStyleText( RED_BG ) + '">f</span>' +
				'{o}' +
				'<span style="' + getStyleText( RED_BG ) + '">o</span>' +
			'</p>' );

			assertColorCommand( {
				editor: editor,
				commandName: 'bgColor',
				expected: '<p>' +
						'<span style="' + getStyleText( RED_BG ) + '">foo</span>@' +
					'</p>',
				newStyle: RED_BG
			} );
		},

		'test should be possible to cancel background color command': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{foo}</p>' );

			editor.once( 'beforeCommandExec', function( evt ) {
				if ( evt.data.name === 'bgColor' ) {
					evt.cancel();
				} else {
					assert.fail( 'There was called wrong command: ' + evt.data.name );
				}
			} );

			assertColorCommand( {
				editor: editor,
				commandName: 'bgColor',
				expected: '<p>foo@</p>',
				newStyle: RED_BG
			} );
		},

		'test should not apply new background color when editor is in readonly mode': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>{foo}</p>' );

			editor.setReadOnly( true );

			assertColorCommand( {
				editor: editor,
				commandName: 'bgColor',
				expected: '<p>foo@</p>',
				newStyle: RED_BG
			} );
		},

		'test should apply background color command to multiple different elements': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, CONTENT_TEMPLATE.replace( /[\^\$@]/g, '' ) );

			assertColorCommand( {
				editor: editor,
				commandName: 'bgColor',
				expected: CONTENT_TEMPLATE
					.replace( /[\[\]]/g, '' )
					.replace( /\^/g, '<span style="' + getStyleText( RED_BG ) + '">' )
					.replace( /\$/g, '</span>' ),
				newStyle: RED_BG
			} );
		},

		'test color button should exec text color command': function() {
			var editor = this.editor,
				bot = this.editorBot,
				spy = sinon.spy( editor.getCommand( 'textColor' ), 'exec' );

			bender.tools.selection.setWithHtml( editor, '<p>{foo}</p>' );

			bot.panel( 'TextColor', function( panel ) {
				try {
					var firstColorElement = getFirstColorElement( panel );

					firstColorElement.$.click();

					spy.restore();

					sinon.assert.calledOnce( spy );
					assert.pass();
				} finally {
					panel.hide();
				}
			} );
		},

		'test color button should exec background color command': function() {
			var editor = this.editor,
				bot = this.editorBot,
				spy = sinon.spy( editor.getCommand( 'bgColor' ), 'exec' );

			bender.tools.selection.setWithHtml( editor, '<p>{foo}</p>' );

			bot.panel( 'BGColor', function( panel ) {
				try {
					var firstColorElement = getFirstColorElement( panel );

					firstColorElement.$.click();

					spy.restore();

					sinon.assert.calledOnce( spy );
					assert.pass();
				} finally {
					panel.hide();
				}
			} );
		},

		'test should update state of command and ui based on selection': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bender.tools.selection.setWithHtml( editor, '<p>[foo]</p>' );
			bot.fireSelectionChange();
			assertColorButtonStates( editor, {
				textColorState: CKEDITOR.TRISTATE_OFF,
				bgColorState: CKEDITOR.TRISTATE_OFF,
				message: 'Text OFF, background OFF'
			} );

			bender.tools.selection.setWithHtml( editor, '<p><span style="color:#c0392b">[foo]</span></p>' );
			bot.fireSelectionChange();
			assertColorButtonStates( editor, {
				textColorState: CKEDITOR.TRISTATE_ON,
				bgColorState: CKEDITOR.TRISTATE_OFF,
				message: 'Text ON, background OFF'
			} );

			bender.tools.selection.setWithHtml( editor, '<p><span style="background-color:#c0392b">[foo]</span></p>' );
			bot.fireSelectionChange();
			assertColorButtonStates( editor, {
				textColorState: CKEDITOR.TRISTATE_OFF,
				bgColorState: CKEDITOR.TRISTATE_ON,
				message: 'Text OFF, background ON'
			} );

			bender.tools.selection.setWithHtml( editor, '<p><span style="color:#ffffff"><span style="background-color:#c0392b">[foo]</span></span></p>' );
			bot.fireSelectionChange();
			assertColorButtonStates( editor, {
				textColorState: CKEDITOR.TRISTATE_ON,
				bgColorState: CKEDITOR.TRISTATE_ON,
				message: 'Text ON, background ON'
			} );

			editor.setReadOnly();

			assertColorButtonStates( editor, {
				textColorState: CKEDITOR.TRISTATE_DISABLED,
				bgColorState: CKEDITOR.TRISTATE_DISABLED,
				message: 'Text DISABLED, background DISABLED'
			} );

			editor.setReadOnly( false );
		}
	} );

	function getStyleText( style ) {
		return CKEDITOR.style.getStyleText( style.getDefinition() ).replace( ';', '' );
	}

	function assertColorCommand( options ) {
		var expected = options.expected,
			editor = options.editor,
			newStyle = options.newStyle,
			collapsed = options.collapsed || false,
			commandName = options.commandName;

		editor.execCommand( commandName, { newStyle: newStyle } );

		if ( collapsed ) {
			editor.insertText( 'ZWS' );
		}

		assert.isInnerHtmlMatching( expected, editor.editable().getHtml(), {
			fixStyles: true
		} );
	}

	function getFirstColorElement( panel ) {
		return panel._.panel._.currentBlock.element.findOne( '.cke_colorbox' );
	}

	function assertColorButtonStates( editor, options ) {
		var bgCommand = editor.getCommand( 'bgColor' ),
			textCommand = editor.getCommand( 'textColor' ),
			bgUi = editor.ui.get( 'BGColor' ),
			textUi = editor.ui.get( 'TextColor' ),
			message = options.message;

		assert.areEqual( options.textColorState, textCommand.state, message + ' (textColor command)' );
		assert.areEqual( options.textColorState, textUi.getState(), message + ' (textColor ui)' );
		assert.areEqual( options.bgColorState, bgCommand.state, message + ' (bgColor command)' );
		assert.areEqual( options.bgColorState, bgUi.getState(), message + ' (bgColor ui)' );
	}
} )();
