/* bender-tags: editor,imagebase */
/* bender-ckeditor-plugins: imagebase,link */


( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test adding new feature': function() {
			var plugin = CKEDITOR.plugins.imagebase,
				editor = this.editor,
				widgetDefinition = {},
				linkDefinition = plugin.featuresDefinitions.link,
				originalLinkDefinition = CKEDITOR.tools.clone( linkDefinition ),
				setUp = sinon.stub( linkDefinition, 'setUp' ),
				extendedDefinition;

			extendedDefinition = plugin.addFeature( editor, 'link', widgetDefinition );

			setUp.restore();

			objectAssert.areDeepEqual( originalLinkDefinition, plugin.featuresDefinitions.link,
				'Link feature definition is not modified' );
			assert.areNotSame( widgetDefinition, extendedDefinition, 'addFeature returns new definition' );
			assert.areSame( 1, setUp.callCount, 'setUp call count' );
			arrayAssert.itemsAreSame( [ 'link' ], extendedDefinition.widgetFeatures,
				'Widget definition has correct value for widgetFeatures property' );
		},

		'test feature.setUp parameters': function() {
			var plugin = CKEDITOR.plugins.imagebase,
				editor = this.editor,
				widgetDefinition = {},
				spy = sinon.spy();

			plugin.featuresDefinitions.foo = {
				setUp: spy
			};

			plugin.addFeature( editor, 'foo', widgetDefinition );

			delete plugin.featuresDefinitions.foo;

			assert.isTrue( spy.calledWithExactly( editor, widgetDefinition ),
				'setUp is called with appropriate parameters' );
		},

		'test widgetDefinition.widgetFeatures stacking': function() {
			var plugin = CKEDITOR.plugins.imagebase,
				inputDefinition = {
					widgetFeatures: [ 'bar' ]
				};

			plugin.featuresDefinitions.foo = {};
			plugin.featuresDefinitions.bar = {};

			var outputDefinition = plugin.addFeature( this.editor, 'foo', inputDefinition );

			// Cleanup.
			delete plugin.featuresDefinitions.foo;

			arrayAssert.itemsAreSame( [ 'bar', 'foo' ], outputDefinition.widgetFeatures );
		}
	} );
} )();
