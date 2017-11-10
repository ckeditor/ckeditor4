/* bender-tags: editor,imagebase */
/* bender-ckeditor-plugins: imagebase,link */


( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'testing adding new feature': function() {
			var plugin = CKEDITOR.plugins.imagebase,
				editor = this.editor,
				widgetDefinition = {},
				linkDefinition = plugin.featuresDefinitions.link,
				originalSetUp = linkDefinition.setUp,
				callCount = 0,
				originalLinkDefinition,
				extendedDefinition;

			linkDefinition.setUp = function() {
				callCount++;
			};
			originalLinkDefinition = CKEDITOR.tools.clone( linkDefinition );

			extendedDefinition = plugin.addFeature( editor, 'link', widgetDefinition );

			objectAssert.areDeepEqual( originalLinkDefinition, plugin.featuresDefinitions.link,
				'Link feature definition is not modified' );
			assert.areNotSame( widgetDefinition, extendedDefinition, 'addFeature returns new definition' );
			assert.areSame( 1, callCount, 'setUp was called only once' );
			arrayAssert.itemsAreSame( [ 'link' ], extendedDefinition.widgetFeatures,
				'Widget definition has correct value for widgetFeatures property' );

			linkDefinition.setUp = originalSetUp;
		},

		'testing feature.setUp parameters': function() {
			var plugin = CKEDITOR.plugins.imagebase,
				editor = this.editor,
				widgetDefinition = {},
				spy = sinon.spy();

			plugin.featuresDefinitions.foo = {
				setUp: spy
			};

			plugin.addFeature( editor, 'foo', widgetDefinition );

			assert.isTrue( spy.calledWithExactly( editor, widgetDefinition ),
				'setUp is called with appropriate parameters' );

			delete plugin.featuresDefinitions.foo;
		}
	} );
} )();
