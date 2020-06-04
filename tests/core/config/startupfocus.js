/* bender-tags: editor */
// jscs:disable maximumLineLength
/* bender-ckeditor-plugins: about,basicstyles,bidi,blockquote,clipboard,colorbutton,colordialog,div,enterkey,entities,find,flash,font,format,forms,horizontalrule,iframe,indent,justify,link,list,newpage,pagebreak,pastefromword,pastetext,removeformat,resize,toolbar,save,selectall,showblocks,smiley,sourcearea,specialchar,stylescombo,table,templates,undo,wysiwygarea */
// jscs:enable maximumLineLength


( function() {
	'use strict';

	function assertStartupFocus( setup ) {
		bender.editorBot.create( {
			creator: 'replace',
			name: setup.name,
			config: CKEDITOR.tools.extend( {
				plugins: bender.plugins.join( ',' ),
				startupFocus: setup.startupFocus
			}, setup.extraConfig )
		}, function( bot ) {
			resume( function() {
				var options = {
					normalizeSelection: true,
					compareSelection: true,
					fixStyles: true
				};
				if ( setup.startupFocus ) {
					assert.isTrue( bot.editor.focusManager.hasFocus, 'editor is focused' );
				} else {
					assert.isFalse( bot.editor.focusManager.hasFocus, 'editor is not focused' );
				}
				if ( setup.startupFocus === 'end' ) {
					assert.isInnerHtmlMatching( setup.expected , bender.tools.selection.getWithHtml( bot.editor ), options );
				}
			} );
			wait();
		} );
	}

	bender.test( {
		// Mutliple cases invoked at same time shares focus. EditorBot prevent that by testing one case at time.
		'test startup focus': function() {
			assertStartupFocus( {
				name: 'editor',
				extraConfig: {
					contentsLangDirection: 'rtl',
					contentsLanguage: 'ar'
				},
				startupFocus: true
			} );
		},
		'test startup focus "end"': function() {
			assertStartupFocus( {
				name: 'editor_end',
				startupFocus: 'end',
				expected: '<p>foo@</p><p>foo^@</p>'
			} );
		},
		'test startup focus "end" table': function() {
			assertStartupFocus( {
				name: 'editor_table',
				startupFocus: 'end',
				expected: '<p>foo@</p><table><tbody><tr><td>cell^@</td></tr></tbody></table>'
			} );
		},
		'test startup focus "end" tailing bold': function() {
			assertStartupFocus( {
				name: 'editor_tailing_bold',
				startupFocus: 'end',
				expected: '<p>foo@</p><p><strong>baz^</strong>@</p>'
			} );
		},
		'test startup focus default': function() {
			assertStartupFocus( {
				name: 'editor_default',
				expected: '<p>foo</p><p>foo</p>'
			} );
		},
		'test startup focus "start"': function() {
			assertStartupFocus( {
				name: 'editor_start',
				startupFocus: 'start',
				expected: '<p>^foo</p>'
			} );
		},
		'test startup focus "end" img': function() {
			assertStartupFocus( {
				name: 'editor_img',
				startupFocus: 'end',
				expected: '<p>foo@</p><p><img alt="Saturn V" data-cke-saved-src="%BASE_PATH%_assets/logo.png" src="%BASE_PATH%_assets/logo.png" style="width:200px" />^@</p>',
				extraConfig: {
					extraPlugins: 'image'
				}
			} );
		}
	} );
} )();
