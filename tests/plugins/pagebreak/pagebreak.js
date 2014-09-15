/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: pagebreak,toolbar,clipboard */

( function() {
	'use strict';

	bender.editor = {
		creator: 'inline' // Speeeeeed...
	};

	bender.test( {
		'test load data': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>x</p><div style="page-break-after:always"><span style="display:none">&nbsp;</span></div><p>x</p>', function() {
				var breaks = editor.document.find( 'div[contenteditable=false]' );
				assert.areSame( 1, breaks.count(), 'there is one non editable div' );
				assert.isTrue( breaks.getItem( 0 ).hasClass( 'cke_pagebreak' ), 'has cke_pagebreak class' );
			} );
		},

		'test get data': function() {
			var editor = this.editor;

			this.editorBot.setData( '<p>x</p><div style="page-break-after:always"><span style="display:none">&nbsp;</span></div><p>x</p>', function() {
				assert.isMatching( /^<p>x<\/p><div style="page-break-after: ?always;?"><span style="display: ?none;?">&nbsp;<\/span><\/div><p>x<\/p>$/, editor.getData() );
			} );
		},

		'test paste': function() {
			var bot = this.editorBot,
				editor = this.editor,
				editable = editor.editable();

			function assertPagebreak( prefix ) {
				prefix += ': ';

				var elements = editor.document.find( 'div[contenteditable=false]' );

				assert.areSame( 1, elements.count(), prefix + 'There is one non-editable div in the contents' );

				var element = elements.getItem( 0 );

				assert.areSame( 'always', element.getStyle( 'page-break-after' ), prefix + 'Pagebreak holds page-break-after style' );
				assert.isTrue( element.hasClass( 'cke_pagebreak' ), prefix + 'Pagebreak holds cke_pagebreak class' );
				assert.isNotUndefined( element.data( 'cke-pagebreak' ), prefix + 'Pagebreak is marked with an attribute' );
			}

			bot.setHtmlWithSelection( '<p>x^x</p>' );
			bot.execCommand( 'pagebreak' );

			assertPagebreak( 'after insert' );

			var html = editable.getHtml();
			editable.setHtml( '' );

			editor.once( 'afterPaste', function() {
				resume( function() {
					assertPagebreak( 'after paste' );
				} );
			} );

			editor.execCommand( 'paste', html );

			wait();
		},

		// #12411
		'test span as a direct child no break': function() {
			bender.editorBot.create( {
				name: 'editor2',
				startupData: '<span>he?</span>',
				config: {
					autoParagraph: false,
					extraPlugins: 'divarea'
				}
			},
			function( bot ) {
				// If we get here it means that nothing fails :)
				assert.pass();
			} );
		}
	} );
} )();