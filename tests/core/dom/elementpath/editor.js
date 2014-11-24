/* bender-tags: editor,unit */

var tools = bender.tools;

function assertPath( path, tags, block, blockLimit ) {
	assert.areSame( block, path.block ? path.block.getName() : '', 'path block' );
	assert.areSame( blockLimit, path.blockLimit ? path.blockLimit.getName() : '', 'path block limit' );
	var elements = path.elements;
	for ( var i = 0, element, length = elements.length;
			element = elements[ i ], i < length; i++ ) {
		assert.areSame( tags[ i ], element.getName(), 'path element of index: ' + i );
	}
}

bender.editor = {
	creator: 'inline',
	startupData: '<p>foo</p>'
};

bender.test( {
	'test elementPath': function() {
		var editor = this.editor;

		editor.editable().focus();
		tools.setHtmlWithSelection( editor, '<p><b><i><u>foo^</u></i></b></p>' );

		var path = editor.elementPath();
		assertPath( path, [ 'u', 'i', 'b', 'p', 'div' ], 'p', 'div' );
	},

	'test elementPath in source mode': function() {
		var editor = this.editor,
			initMode = editor.mode;

		editor.mode = 'source';
		var path = editor.elementPath();
		editor.mode = initMode;

		assert.areSame( null, path );
	}
} );