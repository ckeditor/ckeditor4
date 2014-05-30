/* bender-tags: editor,unit */

var doc = CKEDITOR.document,
	tools = bender.tools;

CKEDITOR.focusManager._.blurDelay = 0;

bender.test( {
	'put focus in editable before editor creation': function() {
		var editable = doc.getById( 'editable' );
		// Pre-focus the editable.
		editable.focus();

		var editor = new CKEDITOR.editor();
		editor.on( 'loaded', function() {
			editable = editor.editable( editable );
			editor.fire( 'contentDom' );
			resume( function() {
				assert.isTrue( editable.hasFocus, 'editable.hasFocus' );
				assert.isTrue( editor.focusManager.hasFocus, 'focusManager.hasFocus' );
				// Destroy editor, because this poor mock will not handle blur correctly.
				editor.destroy();
			} );
		} );

		// Focus manager blurring is asynchronous.
		wait();
	},

	setupIframe : function( callback ) {
		var tc = this;
		var frame = CKEDITOR.dom.element.createFromHtml( '<iframe id="editable_frame"></iframe>' );
		frame.on( 'load', function( evt ) {
			evt.removeListener();
			var doc = frame.getFrameDocument();
			doc.write( '<body contenteditable="true">foo</body>' );
			setTimeout( function() {
							tc.resume( callback );
						}, 200 );
		} );

		doc.getBody().append( frame );
		tc.wait();
	},

	'test add focus targets': function() {
		this.setupIframe( function() {
			  var el1 = doc.getById( 'editable2' ),
			  el2 = doc.getById( 'text_input' ),
			  el3 = doc.getById( 'editable_frame' ).getFrameDocument().getBody(),
			  el4 = doc.getById( 'btn_input' );

			  var ed1 = new CKEDITOR.editor();
			  CKEDITOR.add( ed1 );
			  ed1.name = 'editor1';
			  ed1.focusManager.add( el1 );
			  ed1.focusManager.add( el2 );
			  ed1.focusManager.add( el3 );

			  var ed2 = new CKEDITOR.editor();
			  CKEDITOR.add( ed2 );
			  ed2.name = 'editor2';
			  ed2.focusManager.add( el2 );

			  bender.tools.focus( el1, function() {
				  // el2 should delegate focus to editor2, which registers it
				  // after editor1.
				  bender.tools.focus( el2, function() {
					  assert.isFalse( ed1.focusManager.hasFocus );
					  assert.isTrue( ed2.focusManager.hasFocus );

					  bender.tools.focus( el3, function() {
						  assert.isTrue( ed1.focusManager.hasFocus );

						  // Other element will blur both of the editors.
						  bender.tools.focus( el4, function() {
							  assert.isFalse( ed1.focusManager.hasFocus );
							  assert.isFalse( ed2.focusManager.hasFocus );
						  } );
					  } );

				  } );
			  } );
		  } );
	}
} );