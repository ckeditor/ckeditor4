/* bender-tags: editor */
// jscs:disable maximumLineLength
/* bender-ckeditor-plugins: about,basicstyles,bidi,blockquote,clipboard,colorbutton,colordialog,div,enterkey,entities,find,flash,font,format,forms,horizontalrule,image,iframe,indent,justify,link,list,newpage,pagebreak,pastefromword,pastetext,removeformat,resize,toolbar,save,selectall,showblocks,smiley,sourcearea,specialchar,stylescombo,table,templates,undo,wysiwygarea */
// jscs:enable maximumLineLength


( function() {
	'use strict';


	bender.test( {
		// Mutliple cases invoked at same time shares focus. EditorBot prevent that by testing one case at time.
		'test startup focus': function() {
			bender.editorBot.create( {
				creator: 'inline',
				name: 'editor',
				config: {
					plugins: bender.plugins.join( ',' ),
					// Configurations for test go below.
					startupFocus: true,
					contentsLangDirection: 'rtl',
					contentsLanguage: 'ar'
				}
			}, function( bot ) {
				resume( function() {
					assert.isTrue( bot.editor.focusManager.hasFocus, 'config.startupFocus' );
				} );
				wait();
			} );

		},
		'test startup focus end': function() {
			bender.editorBot.create( {
				creator: 'inline',
				name: 'editor_end',
				config: {
					plugins: bender.plugins.join( ',' ),
					// Configurations for test go below.
					startupFocus: 'end'
				}
			}, function( bot ) {
					resume( function() {
						assert.beautified.html( '<p>foo</p><p>foo{}</p>' , bender.tools.selection.getWithHtml( bot.editor ) );
					} );
					wait();

				} );
		},
		'test startup focus end table': function() {
			bender.editorBot.create( {
				creator: 'inline',
				name: 'editor_table',
				config: {
					plugins: bender.plugins.join( ',' ),
					// Configurations for test go below.
					startupFocus: 'end'
				}
			}, function( bot ) {
					resume( function() {
						assert.beautified.html( '<p>foo</p><table><tbody><tr><td>cell{}</td></tr></tbody></table>' , bender.tools.selection.getWithHtml( bot.editor ) );
					} );
					wait();

				} );
		},
		'test startup focus end tailing bold': function() {
			bender.editorBot.create( {
				creator: 'inline',
				name: 'editor_tailing_bold',
				config: {
					plugins: bender.plugins.join( ',' ),
					// Configurations for test go below.
					startupFocus: 'end'
				}
			}, function( bot ) {
					resume( function() {
						assert.beautified.html( '<p>foo</p><p><strong>baz{}</strong></p>' , bender.tools.selection.getWithHtml( bot.editor ) );
					} );
					wait();

				} );
		}
	} );
} )();
