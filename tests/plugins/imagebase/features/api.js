/* bender-tags: editor,imagebase */
/* bender-ckeditor-plugins: imagebase,link,easyimage */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'easyimage' );
		},

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
			arrayAssert.itemsAreSame( [ 'link' ], extendedDefinition.features,
				'Widget definition has correct value for features property' );
		},

		'test baseWidget functions remain called': function() {
			var plugin = CKEDITOR.plugins.imagebase,
				editor = this.editor,
				inputDefinition = {
					init: sinon.stub(),
					data: sinon.stub()
				},
				dummyFeature = {
					init: sinon.stub(),
					data: sinon.stub()
				},
				outputDefinition;

			plugin.featuresDefinitions.dummy = dummyFeature;

			outputDefinition = plugin.addFeature( editor, 'dummy', inputDefinition );

			delete plugin.featuresDefinitions.dummy;

			outputDefinition.init( 1 );
			outputDefinition.data( 2 );

			assert.areSame( 1, inputDefinition.init.callCount, 'inputDefinition.init call count' );
			assert.areSame( 1, inputDefinition.data.callCount, 'inputDefinition.data call count' );
			assert.areSame( 1, dummyFeature.init.callCount, 'dummyFeature.init call count' );
			assert.areSame( 1, dummyFeature.data.callCount, 'dummyFeature.data call count' );

			sinon.assert.alwaysCalledWithExactly( inputDefinition.init, 1 );
			sinon.assert.alwaysCalledWithExactly( inputDefinition.data, 2 );
			sinon.assert.alwaysCalledWithExactly( dummyFeature.init, 1 );
			sinon.assert.alwaysCalledWithExactly( dummyFeature.data, 2 );
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

		'test widgetDefinition.features stacking': function() {
			var plugin = CKEDITOR.plugins.imagebase,
				inputDefinition = {
					features: [ 'bar' ]
				};

			plugin.featuresDefinitions.foo = {};
			plugin.featuresDefinitions.bar = {};

			var outputDefinition = plugin.addFeature( this.editor, 'foo', inputDefinition );

			// Cleanup.
			delete plugin.featuresDefinitions.foo;
			delete plugin.featuresDefinitions.bar;

			arrayAssert.itemsAreSame( [ 'bar', 'foo' ], outputDefinition.features );
		}
	} );
} )();
