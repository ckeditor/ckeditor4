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
	},

	'test toolbar collapse/expand fire resize event': function() {
		bender.editorBot.create( {
				name: 'editor4',
				config: {
					toolbarCanCollapse: true,
					// Set the empty toolbar, so bazillions of buttons in the build mode will not
					// break this test (the height comparison).
					toolbar: [ [ 'Bold' ] ]
				}
			},
			function( bot ) {
				var resizeData = [],
					editor = bot.editor;

				editor.on( 'resize', function( e ) {
					resizeData.push( e.data );
				} );

				editor.resize( 200, 400 );
				assert.areEqual( 200, resizeData[ 0 ].outerWidth, 'Width should be set properly.' );
				assert.areEqual( 400, resizeData[ 0 ].outerHeight, 'Height should be set properly.' );

				editor.execCommand( 'toolbarCollapse' );
				assert.isTrue( resizeData[ 1 ].outerHeight < resizeData[ 0 ].outerHeight, 'Height after collapse should be less.' );

				editor.execCommand( 'toolbarCollapse' );
				assert.areSame( resizeData[ 0 ].outerHeight, resizeData[ 2 ].outerHeight, 'Height should properly restore to same value.' );
			}
		);
	}
} );