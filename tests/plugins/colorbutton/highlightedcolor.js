/* bender-tags: editor */
/* bender-ckeditor-plugins: colorbutton,toolbar,wysiwygarea */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test highlighted color with text color button': function() {
			var editor = this.editor,
				bot = this.editorBot,
				txtColorBtn = editor.ui.get( 'TextColor' );

			resume( function() {
				assert.areSame( 'true', txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.find( 'a.cke_colorbox' ).$[ 23 ].getAttribute( 'aria-selected' ) );
				assert.areSame( 'Black', txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.find( 'a.cke_colorbox' ).$[ 23 ].title );
				assert.areSame( '000000', txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.find( 'a.cke_colorbox' ).$[ 23 ].dataset.value );
			} );

			bot.setHtmlWithSelection( '[<h1 style="color: #000000;">Moo</h1>]' );
			txtColorBtn.click( editor );

			wait();
		},

		'test highlighted color with background color button': function() {
			var editor = this.editor,
				bot = this.editorBot,
				bgColorBtn = editor.ui.get( 'BGColor' );

			resume( function() {
				assert.areSame( 'true', bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.find( 'a.cke_colorbox' ).$[ 22 ].getAttribute( 'aria-selected' ) );
				assert.areSame( 'Dark Gray', bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.find( 'a.cke_colorbox' ).$[ 22 ].title );
				assert.areSame( '999999', bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.find( 'a.cke_colorbox' ).$[ 22 ].dataset.value );
			} );

			bot.setHtmlWithSelection( '[<h1 style="background: #999999">Moo</h1>]' );
			bgColorBtn.click( editor );

			wait();
		},

		'test highlighted color with background and text color button': function() {
			var editor = this.editor,
				bot = this.editorBot,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				bgColorBtn = editor.ui.get( 'BGColor' );

			resume( function() {
				assert.areSame( 'true', bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.find( 'a.cke_colorbox' ).$[ 16 ].getAttribute( 'aria-selected' ) );
				assert.areSame( 'Light Gray', bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.find( 'a.cke_colorbox' ).$[ 16 ].title );
				assert.areSame( 'DDDDDD', bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.find( 'a.cke_colorbox' ).$[ 16 ].dataset.value );

				txtColorBtn.click( editor );
				assert.areSame( 'true', txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.find( 'a.cke_colorbox' ).$[ 17 ].getAttribute( 'aria-selected' ) );
				assert.areSame( 'White', txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.find( 'a.cke_colorbox' ).$[ 17 ].title );
				assert.areSame( 'FFFFFF', txtColorBtn._.panel.getBlock( txtColorBtn._.id ).element.find( 'a.cke_colorbox' ).$[ 17 ].dataset.value );
			} );

			bot.setHtmlWithSelection( '[<h1 style="color: #ffffff; background: #dddddd">Moo</h1>]' );
			bgColorBtn.click( editor );

			wait();
		}
	} );
} )();
