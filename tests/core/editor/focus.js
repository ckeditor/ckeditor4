/* bender-tags: editor */

function logFn( msg ) {
	return function() {
		window.console && console.log( msg ); // jshint ignore:line
	};
}

function isElement( node ) {
	return node.type == CKEDITOR.NODE_ELEMENT;
}

var config = {
	on: {
		instanceReady: function( evt ) {
			var editor = evt.editor;
			editor.on( 'focus', logFn( '--- editor#focus ---' ), null, null, 0 );
			editor.on( 'blur', logFn( '--- editor#blur ---' ), null, null, 0 );

			editor.on( 'contentDom', function() {
				var editable = editor.editable();

				editable.attachListener( editor.document, 'focus', logFn( 'document#focus' ), null, null, 0 );
				editable.attachListener( editor.document, 'blur', logFn( 'document#blur' ), null, null, 0 );

				editable.attachListener( editor.document.getWindow(), 'focus', logFn( 'window#focus' ), null, null, 0 );
				editable.attachListener( editor.document.getWindow(), 'blur', logFn( 'window#blur' ), null, null, 0 );

				editable.attachListener( editable, 'focus', logFn( 'editable#focus' ), null, null, 0 );
				editable.attachListener( editable, 'blur', logFn( 'editable#blur' ), null, null, 0 );
			} );
		}
	}
};

bender.editor = {
	config: config
};

bender.test( {
	'test blur after setData': function() {
		var editor = this.editor;

		this.editorBot.setData( 'foo', function() {
			// Make really sure that we've got the focus&selection.
			editor.focus();
			editor.getSelection().selectElement( editor.editable().getFirst( isElement ) );
			assert.isTrue( editor.focusManager.hasFocus, 'editor has focus' );

			this.editorBot.setData( 'bar', function() {
				assert.isTrue( editor.focusManager.hasFocus, 'editor has focus after setData' );
				CKEDITOR.document.getById( 'input1' ).focus();

				wait( function() {
					assert.isFalse( editor.focusManager.hasFocus, 'editor lost focus' );
				}, 210 );
			} );
		} );
	},

	'test blur after setData - inline editor': function() {
		bender.editorBot.create( {
			name: 'test_editor_inline1',
			creator: 'inline',
			config: config
		}, function( bot ) {
			var editor = bot.editor;

			// Make really sure that we've got the focus&selection.
			editor.focus();
			editor.getSelection().selectElement( editor.editable().getFirst( isElement ) );
			assert.isTrue( editor.focusManager.hasFocus, 'editor has focus' );

			bot.setData( 'bar', function() {
				assert.isTrue( editor.focusManager.hasFocus, 'editor has focus after setData' );
				CKEDITOR.document.getById( 'input1' ).focus();

				wait( function() {
					assert.isFalse( editor.focusManager.hasFocus, 'editor lost focus' );
				}, 210 );
			} );
		} );
	}
} );
