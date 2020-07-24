/* bender-tags: editor */

var assetsPath = '%TEST_DIR%_assets/';

function initEditors( editors ) {
	var count = 0;
	var instances = {};

	return function( callback ) {
		var total = CKEDITOR.tools.object.keys( editors ).length;

		for ( var e in editors ) {
			instances[ e ] = CKEDITOR.replace( e,
				CKEDITOR.tools.extend( editors[ e ], {
					plugins: 'wysiwygarea',
					on: {
						instanceReady: function() {
							if ( ++count == total ) {
								resume( function() {
									callback( instances );
								} );
							}
						}
					}
				} )
			);
		}

		wait();
	};
}

bender.test( {
	tearDown: function() {
		for ( var editorName in CKEDITOR.instances ) {
			CKEDITOR.instances[ editorName ].destroy();
		}
	},

	// (#3361)
	'test race of customConfigs with reused config': function() {
		initEditors( {
			editor1: { customConfig: assetsPath + 'raceconfig1.js' },
			editor2: { customConfig: assetsPath + 'raceconfig2.js' },
			editor3: { customConfig: assetsPath + 'raceconfig1.js' }
		} )
		( function( instances ) {
			assert.areSame( '200px', instances.editor1.config.width, 'Instance uses own customConfig.' );
			assert.areSame( '300px', instances.editor2.config.width, 'Instance uses own customConfig.' );
			assert.areSame( '200px', instances.editor3.config.width, 'Instance uses own customConfig.' );
		} );
	},

	'test race of customConfigs': function() {
		initEditors( {
			editor1: { customConfig: assetsPath + 'raceconfig1.js' },
			editor2: { customConfig: assetsPath + 'raceconfig2.js' },
			editor3: { customConfig: assetsPath + 'raceconfig3.js' }
		} )
		( function( instances ) {
			assert.areSame( '200px', instances.editor1.config.width, 'Instance uses own customConfig.' );
			assert.areSame( '300px', instances.editor2.config.width, 'Instance uses own customConfig.' );
			assert.areSame( '400px', instances.editor3.config.width, 'Instance uses own customConfig.' );
		} );
	}
} );
