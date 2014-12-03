/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: floatingspace,toolbar,basicstyles,list,link,about */

function testToolbarExpanded( bot ) {
	var editor = bot.editor,
		collapser = editor.ui.space( 'toolbar_collapser' );

	if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
		return testInline( editor, collapser );

	var toolbox = collapser.getPrevious();

	assert.areEqual( '', toolbox.getStyle( 'display' ) );
	assert.isFalse( collapser.hasClass( 'cke_toolbox_collapser_min' ) );

	editor.execCommand( 'toolbarCollapse' );

	assert.areEqual( 'none', toolbox.getStyle( 'display' ) );
	assert.isTrue( collapser.hasClass( 'cke_toolbox_collapser_min' ) );
}

function testInline( editor, collapser ) {
	assert.isNull( collapser, 'No collapser for inline editor' );
	var toolboxInner = editor.ui.space( 'toolbox' ).getFirst( function( node ) {
		return node.type == CKEDITOR.NODE_ELEMENT;
	} );
	assert.isFalse( toolboxInner.hasClass( 'cke_toolbox_main' ), 'There should be no .cke_toolbox_main inside toolbox space' );
}

bender.editor = {
	config: {
		toolbar: 'Basic'
	}
};

bender.test( {
	'test toolbar': function() {
		assert.isNotNull( this.editor.ui.space( 'toolbox' ) );

		assert.isNull( this.editor.ui.space( 'toolbar_collapser' ), 'No collapser by default' );
	},

	'test toolbarStartupExpanded=false': function() {
		bender.editorBot.create(
			{
				name: 'editor1',
				config: {
					toolbarCanCollapse: true,
					toolbarStartupExpanded: false
				}
			},
			function( bot ) {
				var editor = bot.editor,
					collapser = editor.ui.space( 'toolbar_collapser' );

				if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
					return testInline( editor, collapser );

				var toolbox = collapser.getPrevious();

				assert.areEqual( 'none', toolbox.getStyle( 'display' ) );
				assert.isTrue( collapser.hasClass( 'cke_toolbox_collapser_min' ) );

				editor.execCommand( 'toolbarCollapse' );

				assert.areEqual( '', toolbox.getStyle( 'display' ) );
				assert.isFalse( collapser.hasClass( 'cke_toolbox_collapser_min' ) );
			}
		);
	},

	'test toolbarStartupExpanded=true': function() {
		bender.editorBot.create(
			{
				name: 'editor2',
				config: {
					toolbarCanCollapse: true,
					toolbarStartupExpanded: true
				}
			},
			testToolbarExpanded
		);
	},

	'test toolbarCanCollapse=true': function() {
		bender.editorBot.create(
			{
				name: 'editor3',
				config: {
					toolbarCanCollapse: true
				}
			},
			testToolbarExpanded
		);
	}
} );