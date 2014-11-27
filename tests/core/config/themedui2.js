/* bender-tags: editor,unit */
// jscs:disable maximumLineLength
/* bender-ckeditor-plugins: about,basicstyles,bidi,blockquote,clipboard,colorbutton,colordialog,div,elementspath,enterkey,entities,find,flash,font,format,forms,horizontalrule,image,iframe,indent,justify,link,list,maximize,newpage,pagebreak,pastefromword,pastetext,preview,print,removeformat,resize,toolbar,save,selectall,showblocks,showborders,smiley,sourcearea,specialchar,stylescombo,table,templates,undo,wysiwygarea */
// jscs:enable maximumLineLength

var doc = CKEDITOR.document;

bender.test( {
	'async:init': function() {
		var tc = this;
		tc.editor = CKEDITOR.replace( doc.getById( 'editor' ), {
			plugins: bender.plugins.join( ',' ),
			startupFocus: false,
			contentsLanguage: 'ar',
			language: 'ar',
			width: 789,
			height: 456,
			on: {
				instanceReady: function() {
					setTimeout( tc.callback, 200 );
				}
			}
		} );
	},

	test_startup_focus: function() {
		assert.isFalse( this.editor.focusManager.hasFocus );
	},

	test_contents_lang: function() {
		assert.areSame( 'rtl', this.editor.config.contentsLangDirection );
		var htmlElement = this.editor.editable().getParent();
		assert.areSame( 'rtl', htmlElement.getAttribute( 'dir' ) );

		assert.areSame( this.editor.config.contentsLanguage, htmlElement.getAttribute( 'lang' ) );
	},

	'test editor.config.(width|height)': function() {
		var container = this.editor.getResizable(),
			contents = this.editor.getResizable( true );

		assert.areSame( 789, Math.round( container.getComputedStyle( 'width' ).replace( 'px', '' ) ) );
		assert.areSame( 456, Math.round( contents.getComputedStyle( 'height' ).replace( 'px', '' ) ) );
	}
} );