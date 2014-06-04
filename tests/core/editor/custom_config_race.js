/* bender-tags: editor,unit */

var assetsPath = '%TEST_DIR%_assets/',
	instances = {},
	initEditors = ( function() {
		var count = 0;

		return function( editors, callback ) {
			var total = CKEDITOR.tools.objectKeys( editors ).length;

			for ( var e in editors ) {
				instances[ e ] = CKEDITOR.replace( e,
					CKEDITOR.tools.extend( editors[ e ], {
						plugins: 'wysiwygarea',
						on: {
							instanceReady: function() {
								if ( ++count == total )
									callback();
							}
						}
					} )
				);
			}
		};
	} )();

bender.test( {
	'async:init': function() {
		initEditors( {
			editor1: { customConfig: assetsPath + 'raceConfig1.js' },
			editor2: { customConfig: assetsPath + 'raceConfig2.js' },
			editor3: { customConfig: assetsPath + 'raceConfig3.js' }
		}, this.callback );
	},

	'test race of customConfigs': function() {
		assert.areSame( '200px', instances.editor1.config.width, 'Instance uses own customConfig.' );
		assert.areSame( '300px', instances.editor2.config.width, 'Instance uses own customConfig.' );
		assert.areSame( '400px', instances.editor3.config.width, 'Instance uses own customConfig.' );
	}
} );