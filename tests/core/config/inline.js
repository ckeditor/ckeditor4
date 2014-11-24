/* bender-tags: editor,unit */
// jscs:disable maximumLineLength
/* bender-ckeditor-plugins: about,basicstyles,bidi,blockquote,clipboard,colorbutton,colordialog,div,enterkey,entities,find,flash,font,format,forms,horizontalrule,image,iframe,indent,justify,link,list,newpage,pagebreak,pastefromword,pastetext,removeformat,resize,toolbar,save,selectall,showblocks,showborders,smiley,sourcearea,specialchar,stylescombo,table,templates,undo,wysiwygarea */
// jscs:enable maximumLineLength

var doc = CKEDITOR.document;

bender.test( {
	'async:init': function() {
		var tc = this;
		tc.editor = CKEDITOR.inline( doc.getById( 'editor' ), {
			plugins: bender.plugins.join( ',' ),
			// Configurations for test go below.
			startupFocus: true,
			contentsLangDirection: 'rtl',
			contentsLanguage: 'ar',
			on: {
				instanceReady: function() {
					setTimeout( tc.callback, 0 );
				}
			}
		} );
	},

	test_startup_focus: function() {
		assert.isTrue( this.editor.focusManager.hasFocus, 'config.startupFocus' );
	},

	test_contents_lang: function() {
		assert.areSame( this.editor.config.contentsLangDirection, 'rtl' );
		assert.areSame( 'rtl', this.editor.editable().getAttribute( 'dir' ) );
	}
} );