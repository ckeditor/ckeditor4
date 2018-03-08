/* bender-tags: editor, splitbutton */
/* bender-ckeditor-plugins: toolbar, splitbutton, basicstyles */

bender.editor = {
	config: {
		on: {
			pluginsLoaded: function( evt ) {
				var editor = evt.editor;
				editor.ui.add( 'teststylesplit', CKEDITOR.UI_SPLITBUTTON, {
					label: 'Basic Styles',
					items: [ {
						command: 'bold',
						icon: 'bold',
						'default': true
					}, {
						command: 'italic',
						icon: 'italic'
					}, {
						command: 'underline',
						icon: 'underline'
					}, {
						command: 'strike',
						icon: 'strike'
					}, {
						command: 'subscript',
						icon: 'subscript'
					}, {
						command: 'superscript',
						icon: 'superscript'
					} ]
				} );
			}
		}
	}
};

bender.test( {
	'test splitbutton in toolbar': function() {
		var splitButton = this.editor.ui.get( 'teststylesplit' ),
			arrow = CKEDITOR.document.getById( splitButton._.id ),
			cl,
			i,
			item,
			items = {},
			key;

		assert.isTrue( arrow.getParent().hasClass( 'cke_splitbutton' ) );

		var children = arrow.getParent().$.childNodes;
		for ( i = 0; i < children.length; i++ ) {
			item = children[ i ];
			cl = item.classList[ 1 ].substring( 12, item.classList[ 1 ].length );
			items[ cl ] = cl;
		}
		for ( key in splitButton.items ) {
			key = key.substring( 0, key.length - 1 );
			assert.isTrue( key in items );
		}
	}
} );
