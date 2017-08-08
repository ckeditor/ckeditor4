/* bender-tags: editor */
/* bender-ckeditor-plugins: richcombo,toolbar */

bender.editor = true;

bender.test( {
	'test creating selection listener': function() {
		var editor = this.editor,
			spy = sinon.spy();

		CKEDITOR.plugins.richcombo.createSelectionListener( editor, {}, spy );

		editor.once( 'selectionChange', function( evt ) {
			resume( function() {
				var elements = evt.data.path.elements,
					i;

				assert.areSame( elements.length, spy.callCount, 'Spy was called for every node in path' );

				for ( i = 0; i < elements.length; i++ ) {
					assert.isTrue( elements[ i ].equals( spy.getCall( i ).args[ 0 ] ),
						'Appropriate node was passed to spy call #' + i );
				}
			} );
		}, null, null, 999 );

		bender.tools.selection.setWithHtml( editor, '<p>T{es}t</p>' );
		wait();
	}
} );
