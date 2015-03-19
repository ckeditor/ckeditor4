/* bender-ckeditor-plugins: embedbase */

'use strict';

bender.editors = {
	classic: {
		name: 'editor_classic',
		creator: 'replace'
	}
};

bender.test( {
	'test CKEDITOR._.jsonpCallbacks exists': function() {
		assert.isObject( CKEDITOR._.jsonpCallbacks );
	},

	'test embedBase.createWidgetBaseDefinition': function() {
		var def1 = CKEDITOR.plugins.embedBase.createWidgetBaseDefinition( this.editors.classic ),
			def2 = CKEDITOR.plugins.embedBase.createWidgetBaseDefinition( this.editors.classic );

		assert.areNotSame( def1, def2, 'new definition on every call' );
		assert.isObject( def1 );
	}
} );