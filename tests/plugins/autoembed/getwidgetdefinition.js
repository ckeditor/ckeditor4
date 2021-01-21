/* bender-tags: editor */
/* bender-ckeditor-plugins: autoembed,embed,embedsemantic,link */
/* bender-include: ../embedbase/_helpers/tools.js */

/* global embedTools */

'use strict';

embedTools.mockJsonp( function( urlTemplate, urlParams, callback ) {
	callback( {
		'url': decodeURIComponent( urlParams.url ),
		'type': 'rich',
		'version': '1.0',
		'html': '<img src="' + decodeURIComponent( urlParams.url ) + '">'
	} );
} );

bender.editor = {
	creator: 'inline'
};

var WIDGET_FOO = {},
	WIDGET_BAR = {};

function mockEditor( opt ) {
	return {
		widgets: {
			registered: {
				foo: WIDGET_FOO,
				bar: WIDGET_BAR
			}
		},

		config: {
			autoEmbed_widget: opt
		}
	};
}

bender.test( {
	'test getWidgetDefinition with default config': function() {
		assert.areSame( this.editor.widgets.registered.embed, CKEDITOR.plugins.autoEmbed.getWidgetDefinition( this.editor, 'url' ) );
	},

	'test getWidgetDefinition with default config and no embed widget': function() {
		var EMBED_SEMANTIC = {},
			editorMock = {
				widgets: {
					registered: {
						foo: WIDGET_FOO,
						embedSemantic: EMBED_SEMANTIC
					}
				},
				config: {} // No value defined, so default should be used.
			};

		assert.areSame( EMBED_SEMANTIC, CKEDITOR.plugins.autoEmbed.getWidgetDefinition( editorMock, 'url' ) );
	},

	'test getWidgetDefinition with string config - first used': function() {
		var editorMock = mockEditor( 'foo,embed' );

		assert.areSame( WIDGET_FOO, CKEDITOR.plugins.autoEmbed.getWidgetDefinition( editorMock, 'url' ) );
	},

	'test getWidgetDefinition with string config - first existing used': function() {
		var editorMock = mockEditor( 'xxx,yyy,bar,foo' );

		assert.areSame( WIDGET_BAR, CKEDITOR.plugins.autoEmbed.getWidgetDefinition( editorMock, 'url' ) );
	},

	'test getWidgetDefinition with string config - null if none found': function() {
		var editorMock = mockEditor( 'xxx,yyy' );

		assert.isNull( CKEDITOR.plugins.autoEmbed.getWidgetDefinition( editorMock, 'url' ) );
	},

	'test getWidgetDefinition with function config': function() {
		var editorMock = mockEditor( function( url ) {
			assert.areSame( 'http://foo.bar/bom', url, 'called with the URL' );
			return 'bar';
		} );

		assert.areSame( WIDGET_BAR, CKEDITOR.plugins.autoEmbed.getWidgetDefinition( editorMock, 'http://foo.bar/bom' ) );
	},

	'test getWidgetDefinition is used by the plugin': function() {
		// Autolink plugin is disabled in IE to avoid feature duplication,
		// which causes the test to fail (#4500).
		if ( CKEDITOR.env.ie ) {
			assert.ignore();
		}

		var editor = this.editor,
			mock = sinon.stub( CKEDITOR.plugins.autoEmbed, 'getWidgetDefinition' ).returns( editor.widgets.registered.embedSemantic );

		bender.tools.selection.setWithHtml( editor, '<p>foo{}bar</p>' );
		editor.execCommand( 'paste', 'http://foo.bar/100' );

		wait( function() {
			mock.restore();

			assert.areSame( '<p>foo</p><oembed>http://foo.bar/100</oembed><p>bar</p>', editor.getData(), 'embedsemantic was used' );
			assert.isTrue( mock.calledOnce, 'getWidgetDefinition was called once' );
			assert.areSame( 'http://foo.bar/100', mock.args[ 0 ][ 1 ], 'getWidgetDefinition was called with the URL being embedded' );
		}, 400 );
	}
} );
