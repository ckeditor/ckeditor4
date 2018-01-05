/* bender-tags: editor */
// jscs:disable maximumLineLength
/* bender-ckeditor-plugins: about,basicstyles,bidi,blockquote,clipboard,colorbutton,colordialog,div,enterkey,entities,find,flash,font,format,forms,horizontalrule,image,iframe,indent,justify,link,list,newpage,pagebreak,pastefromword,pastetext,removeformat,resize,toolbar,save,selectall,showblocks,smiley,sourcearea,specialchar,stylescombo,table,templates,undo,wysiwygarea */
// jscs:enable maximumLineLength


( function() {
	'use strict';

	function botInitializer( setup ) {
		bender.editorBot.create( {
			creator: 'replace',
			name: setup.name,
			config: Object.assign({
				plugins: bender.plugins.join( ',' ),
				startupFocus: setup.startupFocus
			}, setup.extraConfig )
		}, function( bot ) {
			resume( function() {
				if ( setup.startupFocus ) {
					assert.isTrue( bot.editor.focusManager.hasFocus, 'editor is focused');
				} else {
					assert.isFalse( bot.editor.focusManager.hasFocus, 'editor is not focused' );
				}
				if ( focus === 'end' ) {
					assert.beautified.html( setup.expected , bender.tools.selection.getWithHtml( bot.editor ) );
				}
			} );
			wait();
		} );
	}

	bender.test( {
		// Mutliple cases invoked at same time shares focus. EditorBot prevent that by testing one case at time.
		'test startup focus': function() {
			botInitializer( {
				name: 'editor',
				extraConfig: {
					contentsLangDirection: 'rtl',
					contentsLanguage: 'ar'
				},
				startupFocus: true
			} );
		},
		'test startup focus end': function() {
			botInitializer( {
				name: 'editor_end',
				startupFocus: 'end',
				expected: '<p>foo</p><p>foo{}</p>'
			} );
		},
		'test startup focus end table': function() {
			botInitializer( {
				name: 'editor_table',
				startupFocus: 'end',
				expected: '<p>foo</p><table><tbody><tr><td>cell{}</td></tr></tbody></table>'
			} );
		},
		'test startup focus end tailing bold': function() {
			botInitializer( {
				name: 'editor_tailing_strong',
				startupFocus: 'end',
				expected: '<p>foo</p><p><strong>baz{}</strong></p>'
			} );
		},
		'test startup focus default': function() {
			botInitializer( {
				name: 'editor_default',
				expected: '<p>foo</p><p>foo</p>'
			} );
		}
	} );
} )();
