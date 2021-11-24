/* bender-tags: editor */
// jscs:disable maximumLineLength
/* bender-ckeditor-plugins: about,basicstyles,bidi,blockquote,clipboard,colorbutton,colordialog,div,elementspath,enterkey,entities,find,font,format,forms,horizontalrule,image,iframe,indent,justify,link,list,maximize,newpage,pagebreak,pastefromword,pastetext,preview,print,removeformat,resize,toolbar,save,selectall,showblocks,showborders,smiley,sourcearea,specialchar,stylescombo,table,templates,undo,wysiwygarea */
// jscs:enable maximumLineLength

var doc = CKEDITOR.document;

bender.test( {
	'async:init': function() {
		var tc = this;
		tc.editor = CKEDITOR.replace( doc.getById( 'editor' ), {
			plugins: bender.plugins.join( ',' ),
			// Configurations for test go below.
			startupFocus: true,
			contentsLangDirection: 'ltr',
			contentsLanguage: 'ar',
			on: {
				instanceReady: function() {
					setTimeout( tc.callback, 200 );
				}
			}
		} );
	},

	// (#4918)
	test_startup_computed_state_value: function() {
		assert.isTrue( this.editor.config.useComputedState, 'config.useComputedState should return true as default' );
	},

	test_startup_focus: function() {
		assert.isTrue( this.editor.focusManager.hasFocus, 'config.startupFocus' );
		// TODO: Check cursor position at the beginning of document.
	},

	test_contents_lang: function() {
		assert.areSame( 'ltr', this.editor.config.contentsLangDirection );
		var htmlElement = this.editor.editable().getParent();
		assert.areSame( 'ltr', htmlElement.getDirection() );

		assert.areSame( this.editor.config.contentsLanguage, htmlElement.getAttribute( 'lang' ) );
	}
} );
