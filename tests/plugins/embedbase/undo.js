/* bender-ckeditor-plugins: embedbase,embed,toolbar,htmlwriter,entities,undo */
/* bender-include: ../widget/_helpers/tools.js, _helpers/tools.js */
/* global widgetTestsTools, embedTools */

'use strict';

bender.editors = {
	inline: {
		name: 'editor_inline',
		creator: 'inline'
	}
};

function echoJsonpCallback( urlTemplate, urlParams, callback ) {
	callback( {
		type: 'rich',
		html: '<p>url:' + urlParams.url + '</p>'
	} );
}

function assertCommands( editor, expectActiveUndo, expectActiveRedo, msg ) {
	msg += ' - ';

	assert.areSame( expectActiveUndo ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'undo' ).state, msg + 'undo' );
	assert.areSame( expectActiveRedo ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'redo' ).state, msg + 'redo' );
}

function setUpEditor( editor, htmlWithSel ) {
	editor.focus();
	bender.tools.selection.setWithHtml( editor, htmlWithSel );
	editor.widgets.checkWidgets();
	editor.resetUndo();
}

var obj2Array = widgetTestsTools.obj2Array,
	jsonpCallback = echoJsonpCallback;

embedTools.mockJsonp( function() {
	jsonpCallback.apply( this, arguments );
} );

bender.test( {
	_should: {
		ignore: {
			'test undo and redo after creation': CKEDITOR.env.webkit && !CKEDITOR.env.chrome,
			'test undo and redo after creation and edition': CKEDITOR.env.webkit && !CKEDITOR.env.chrome,
			'test undo and redo after edition': CKEDITOR.env.webkit && !CKEDITOR.env.chrome
		}
	},

	spies: [],
	listeners: [],

	init: function() {
		this.editors.inline.dataProcessor.writer.sortAttributes = true;
	},

	tearDown: function() {
		var spy;

		while ( spy = this.spies.pop() ) {
			spy.restore();
		}

		var listener;

		while ( listener = this.listeners.pop() ) {
			listener.removeListener();
		}
	},

	'test undo and redo after creation': function() {
		var bot = this.editorBots.inline,
			editor = bot.editor;

		editor.once( 'dialogShow', function( evt ) {
			var dialog = evt.data;
			setTimeout( function() {
				dialog.setValueOf( 'info', 'url', '//after/creation' );
				dialog.getButton( 'ok' ).click();
			}, 50 );
		} );

		editor.once( 'dialogHide', function() {
			resume( function() {
				assert.areSame( 1, obj2Array( editor.widgets.instances ).length, '1 widget after insert' );
				assertCommands( editor, true, false, 'after insert' );

				editor.execCommand( 'undo' );
				assert.areSame( 0, obj2Array( editor.widgets.instances ).length, '0 widgets after undo' );
				assertCommands( editor, false, true, 'after undo' );
				assert.areSame( '<p>foo</p>', editor.getData(), 'data after undo' );

				editor.execCommand( 'redo' );
				assert.areSame( 1, obj2Array( editor.widgets.instances ).length, '1 widget after redo' );
				assertCommands( editor, true, false, 'after redo' );
				assert.areSame( '<p>foo</p><div data-oembed-url="//after/creation"><p>url:%2F%2Fafter%2Fcreation</p></div><p>&nbsp;</p>',
					editor.getData(), 'data after redo' );
			} );
		} );

		setUpEditor( editor, '<p>foo[]</p>' );

		wait( function() {
			editor.execCommand( 'embed' );
		} );
	},

	'test undo and redo after edition': function() {
		var bot = this.editorBots.inline,
			editor = bot.editor;

		editor.once( 'dialogShow', function( evt ) {
			var dialog = evt.data;
			setTimeout( function() {
				dialog.setValueOf( 'info', 'url', '//after/edition' );
				dialog.getButton( 'ok' ).click();
			}, 50 );
		} );

		editor.once( 'dialogHide', function() {
			resume( function() {
				assert.areSame( '//after/edition', obj2Array( editor.widgets.instances )[ 0 ].data.url, 'widget url after edition' );
				assertCommands( editor, true, false, 'after edition' );

				editor.execCommand( 'undo' );
				assertCommands( editor, false, true, 'after undo' );
				assert.areSame( '<p>foo</p><div data-oembed-url="//before/edition"><p>url:%2F%2Fbefore%2Fedition</p></div><p>&nbsp;</p>',
					editor.getData(), 'data after undo' );

				editor.execCommand( 'redo' );
				assertCommands( editor, true, false, 'after redo' );
				assert.areSame( '<p>foo</p><div data-oembed-url="//after/edition"><p>url:%2F%2Fafter%2Fedition</p></div><p>&nbsp;</p>',
					editor.getData(), 'data after redo' );
			} );
		} );

		bot.setData( '<p>foo</p><div data-oembed-url="//before/edition"><p>url:%2F%2Fbefore%2Fedition</p></div><p>&nbsp;</p>', function() {
			obj2Array( editor.widgets.instances )[ 0 ].focus();
			editor.resetUndo();

			wait( function() {
				editor.execCommand( 'embed' );
			} );
		} );
	},

	'test undo and redo after creation and edition': function() {
		var bot = this.editorBots.inline,
			editor = bot.editor,
			urls = [ '//creation/edition/1', '//creation/edition/2' ],
			stage = 0;

		this.listeners.push( editor.on( 'dialogShow', function( evt ) {
			var dialog = evt.data;
			setTimeout( function() {
				dialog.setValueOf( 'info', 'url', urls[ stage ] );
				stage += 1;
				dialog.getButton( 'ok' ).click();
			}, 50 );
		} ) );

		this.listeners.push( editor.on( 'dialogHide', function() {
			// Edit freshly created widget.
			if ( stage == 1 ) {
				setTimeout( function() {
					editor.execCommand( 'embed' );
				}, 50 );

				return;
			}

			resume( function() {
				assert.areSame( 1, obj2Array( editor.widgets.instances ).length, '1 widget after creation and edition' );
				assert.areSame( urls[ 1 ], obj2Array( editor.widgets.instances )[ 0 ].data.url, 'widget url after edition' );
				assertCommands( editor, true, false, 'after edition' );

				editor.execCommand( 'undo' );
				assert.areSame( 1, obj2Array( editor.widgets.instances ).length, '1 widget after 1st undo' );
				assert.areSame( urls[ 0 ], obj2Array( editor.widgets.instances )[ 0 ].data.url, 'widget url after 1st undo' );
				assertCommands( editor, true, true, 'after 1st undo' );

				editor.execCommand( 'undo' );
				assert.areSame( 0, obj2Array( editor.widgets.instances ).length, '0 widgets after 2nd undo' );
				assertCommands( editor, false, true, 'after 2nd undo' );
				assert.areSame( '<p>foo</p>', editor.getData(), 'data after 2nd undo' );

				editor.execCommand( 'redo' );
				assert.areSame( 1, obj2Array( editor.widgets.instances ).length, '1 widget after 1st redo' );
				assert.areSame( urls[ 0 ], obj2Array( editor.widgets.instances )[ 0 ].data.url, 'widget url after 1st redo' );
				assertCommands( editor, true, true, 'after 1st redo' );

				editor.execCommand( 'redo' );
				assert.areSame( 1, obj2Array( editor.widgets.instances ).length, '1 widget after 2nd redo' );
				assert.areSame( urls[ 1 ], obj2Array( editor.widgets.instances )[ 0 ].data.url, 'widget url after 2nd redo' );
				assertCommands( editor, true, false, 'after 2nd redo' );
			} );
		} ) );

		setUpEditor( editor, '<p>foo[]</p>' );

		wait( function() {
			editor.execCommand( 'embed' );
		} );
	}
} );
