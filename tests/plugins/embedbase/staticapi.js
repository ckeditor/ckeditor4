/* bender-ckeditor-plugins: embedbase */

'use strict';

bender.test( {
	editorMock: {
		lang: {
			embedbase: {}
		}
	},

	'test CKEDITOR._.jsonpCallbacks exists': function() {
		assert.isObject( CKEDITOR._.jsonpCallbacks );
	},

	// https://dev.ckeditor.com/ticket/16919
	'test if dialog is explicitly required': function() {
		assert.areSame( 0, CKEDITOR.plugins.registered.embedbase.requires.indexOf( 'dialog,' ) );
	},

	'test embedBase.createWidgetBaseDefinition': function() {
		var def1 = CKEDITOR.plugins.embedBase.createWidgetBaseDefinition( this.editorMock ),
			def2 = CKEDITOR.plugins.embedBase.createWidgetBaseDefinition( this.editorMock );

		assert.areNotSame( def1, def2, 'new definition on every call' );
		assert.isObject( def1 );
	}
} );
