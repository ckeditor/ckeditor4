/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: colorbutton,colordialog,toolbar,wysiwygarea */


( function() {
	'use strict';

	bender.editor = {};


	var test = {
		_createEditor: function( config, fn ) {
			if ( bender.editor ) {
				bender.editor.destroy();
			}

			var tc = this;

			bender.editorBot.create( { config: config }, function( bot ) {
				bender.editor = tc.editor = bot.editor;
				tc.editorBot = bot;
				fn.call( tc );
			} );
		},

		// We need fresh instance of editor every time (#565).
		'test adding hash (3) to color in background': function() {
			this._createEditor( { name: 'editor1' }, function() {
				var editor = this.editor,
					bot = this.editorBot,
					bgColorBtn = editor.ui.get( 'BGColor' );

				// open panel
				bgColorBtn.click( editor );
				bot.setHtmlWithSelection( '<p>[foo]</p>' );
				editor.once( 'dialogHide', function( evt ) {
					resume( function() {
						assert.areSame( '<p><span style="background-color:#aabbcc">foo</span></p>', evt.editor.getData() );
					} );
				} );

				var item = document.querySelector( '.cke_panel_frame' ).contentWindow.document.querySelector( '.cke_colormore' );

				item.click();

				wait( function() {
					editor.on( 'dialogShow', function( evt ) {
						var dialog = evt.data;
						dialog.setValueOf( 'picker', 'selectedColor', 'ABC' );
						dialog.getButton( 'ok' ).click();
					} );
				} );
			} );
		},

		'test adding hash (6) to color in background': function() {
			this._createEditor( { name: 'editor1' }, function() {
				var editor = this.editor,
					bot = this.editorBot,
					bgColorBtn = editor.ui.get( 'BGColor' );

				// open panel
				bgColorBtn.click( editor );
				bot.setHtmlWithSelection( '<p>[foo]</p>' );
				editor.once( 'dialogHide', function( evt ) {
					resume( function() {
						assert.areSame( '<p><span style="background-color:#123456">foo</span></p>', evt.editor.getData() );
					} );
				} );

				var item = document.querySelector( '.cke_panel_frame' ).contentWindow.document.querySelector( '.cke_colormore' );

				item.click();

				wait( function() {
					editor.on( 'dialogShow', function( evt ) {
						var dialog = evt.data;
						dialog.setValueOf( 'picker', 'selectedColor', '123456' );
						dialog.getButton( 'ok' ).click();
					} );
				} );
			} );
		},

		'test adding hash (3) to color in foreground': function() {
			this._createEditor( { name: 'editor1' }, function() {
				var editor = this.editor,
					bot = this.editorBot,
					txtColorBtn = editor.ui.get( 'TextColor' );

				// open panel
				txtColorBtn.click( editor );
				bot.setHtmlWithSelection( '<p>[foo]</p>' );
				editor.once( 'dialogHide', function( evt ) {
					resume( function() {
						assert.areSame( '<p><span style="color:#778899">foo</span></p>', evt.editor.getData() );
					} );
				} );

				var item = document.querySelector( '.cke_panel_frame' ).contentWindow.document.querySelector( '.cke_colormore' );

				item.click();

				wait( function() {
					editor.on( 'dialogShow', function( evt ) {
						var dialog = evt.data;
						dialog.setValueOf( 'picker', 'selectedColor', '789' );
						dialog.getButton( 'ok' ).click();
					} );
				} );
			} );
		},

		'test adding hash (6) to color in foreground': function() {
			this._createEditor( { name: 'editor1' }, function() {
				var editor = this.editor,
					bot = this.editorBot,
					txtColorBtn = editor.ui.get( 'TextColor' );

				// open panel
				txtColorBtn.click( editor );
				bot.setHtmlWithSelection( '<p>[foo]</p>' );
				editor.once( 'dialogHide', function( evt ) {
					resume( function() {
						assert.areSame( '<p><span style="color:#abcdef">foo</span></p>', evt.editor.getData() );
					} );
				} );

				var item = document.querySelector( '.cke_panel_frame' ).contentWindow.document.querySelector( '.cke_colormore' );

				item.click();

				wait( function() {
					editor.on( 'dialogShow', function( evt ) {
						var dialog = evt.data;
						dialog.setValueOf( 'picker', 'selectedColor', 'ABCDEF' );
						dialog.getButton( 'ok' ).click();
					} );
				} );
			} );
		},

		'test adding non hash color to background - color name': function() {
			this._createEditor( { name: 'editor1' }, function() {
				var editor = this.editor,
					bot = this.editorBot,
					bgColorBtn = editor.ui.get( 'BGColor' );

				// open panel
				bgColorBtn.click( editor );
				bot.setHtmlWithSelection( '<p>[foo]</p>' );
				editor.once( 'dialogHide', function( evt ) {
					resume( function() {
						assert.areSame( '<p><span style="background-color:blue">foo</span></p>', evt.editor.getData() );
					} );
				} );

				var item = document.querySelector( '.cke_panel_frame' ).contentWindow.document.querySelector( '.cke_colormore' );

				item.click();

				wait( function() {
					editor.on( 'dialogShow', function( evt ) {
						var dialog = evt.data;
						dialog.setValueOf( 'picker', 'selectedColor', 'blue' );
						dialog.getButton( 'ok' ).click();
					} );
				} );
			} );
		},

		'test adding non hash color to background - rgba()': function() {


			this._createEditor( { name: 'editor1' }, function() {
				var editor = this.editor,
					bot = this.editorBot,
					bgColorBtn = editor.ui.get( 'BGColor' );

				// open panel
				bgColorBtn.click( editor );
				bot.setHtmlWithSelection( '<p>[foo]</p>' );
				editor.once( 'dialogHide', function( evt ) {
					resume( function() {
						if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
							assert.areSame( '<p>foo</p>', evt.editor.getData() );
						} else {
							assert.areSame( '<p><span style="background-color:rgba(10, 20, 30, 0.4)">foo</span></p>', evt.editor.getData() );
						}
					} );
				} );

				var item = document.querySelector( '.cke_panel_frame' ).contentWindow.document.querySelector( '.cke_colormore' );

				item.click();

				wait( function() {
					editor.on( 'dialogShow', function( evt ) {
						var dialog = evt.data;
						dialog.setValueOf( 'picker', 'selectedColor', 'rgba(10, 20, 30, 0.4)' );
						dialog.getButton( 'ok' ).click();
					} );
				} );
			} );
		},

		'test adding non hash color to background - empty string': function() {
			this._createEditor( { name: 'editor1' }, function() {
				var editor = this.editor,
					bot = this.editorBot,
					bgColorBtn = editor.ui.get( 'BGColor' );

				// open panel
				bgColorBtn.click( editor );
				bot.setHtmlWithSelection( '<p>[foo]</p>' );
				editor.once( 'dialogHide', function( evt ) {
					resume( function() {
						assert.areSame( '<p>foo</p>', evt.editor.getData() );
					} );
				} );

				var item = document.querySelector( '.cke_panel_frame' ).contentWindow.document.querySelector( '.cke_colormore' );

				item.click();

				wait( function() {
					editor.on( 'dialogShow', function( evt ) {
						var dialog = evt.data;
						dialog.setValueOf( 'picker', 'selectedColor', '' );
						dialog.getButton( 'ok' ).click();
					} );
				} );
			} );
		}


	};

	bender.test( test );
} )();
