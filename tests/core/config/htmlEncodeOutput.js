/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities */

bender.test( {
	createEditor: function( config, fn ) {
		if ( bender.editor )
			bender.editor.destroy();

		var tc = this;

		bender.editorBot.create( { startupData: '<p>foo&nbsp;bar</p>', config: config }, function( bot ) {
			var editor = bender.editor = tc.editor = bot.editor;
			editor.updateElement();

			// Only applicable to replace mode.
			if ( editor.elementMode != CKEDITOR.ELEMENT_MODE_REPLACE )
				assert.ignore();

			var val = bender.tools.compatHtml( editor.element.getValue() );
			fn.call( tc, val );
		} );
	},

	'test htmlEncodeOutput(true)': function() {
		this.createEditor( { htmlEncodeOutput: true }, function( val ) {
			assert.areSame( '&lt;p&gt;foo&amp;nbsp;bar&lt;/p&gt;', val );
		} );
	},

	'test htmlEncodeOutput(false)': function() {
		this.createEditor( { ignoreEmptyParagraph: false }, function( val ) {
			assert.areSame( '<p>foo&nbsp;bar</p>', val );
		} );
	}
} );