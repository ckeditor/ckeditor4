/* bender-tags: editor */

bender.test( {
	createEditor: function( config, fn ) {
		if ( bender.editor )
			bender.editor.destroy();

		var tc = this;
		bender.editorBot.create( { creator: 'replace', config: config }, function( bot ) {
			bender.editor = tc.editor = bot.editor;
			tc.editorBot = bot;
			fn.call( tc );
		} );
	},

	assertEditorSize: function( expectWidth, expectHeight, width, height, msg ) {
		var config = {};
		width && ( config.width = width );
		height && ( config.height = height );

		this.createEditor( config, function() {
			var widthSpace = this.editor.container, heightSpace = this.editor.ui.space( 'contents' );
			assert.areSame( expectWidth, widthSpace.getStyle( 'width' ), 'check editor width: ' + msg );
			assert.areSame( expectHeight, heightSpace.getStyle( 'height' ), 'check editor content height: ' + msg );
		} );
	},

	'test no configured width/height': function() {
		this.assertEditorSize( '', '200px', '', '',  'auto width and height' );
	},

	'test pixel width/height': function() {
		this.assertEditorSize( '600px', '300px', 600, 300,  'width set to 600px, height set to 300px' );
	},

	'test percentage width': function() {
		this.assertEditorSize( '50%', '200px', '50%', '',  'width set to 50%, auto height' );
	},

	'test relative width': function() {
		this.assertEditorSize( '20em', '10em', '20em', '10em',  'width set to 20em, height set to 10em' );
	}
} );
