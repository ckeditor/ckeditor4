/* bender-tags: editor */

var assetsPath = '%TEST_DIR%_assets/';

function initEditors( editors ) {
	var count = 0,
		instances = {};

	return function( callback ) {
		var total = CKEDITOR.tools.object.keys( editors ).length;

		for ( var editorName in editors ) {
			var config = CKEDITOR.tools.extend( editors[ editorName ], {
				plugins: 'wysiwygarea',
				on: {
					instanceReady: function() {
						count++;

						if ( count == total ) {
							resume( function() {
								callback( instances );
							} );
						}
					}
				}
			} );

			instances[ editorName ] = CKEDITOR.replace( editorName, config );
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
			assert.areSame( '200px', instances.editor1.config.width, 'editor1 instance should use its own custom config' );
			assert.areSame( '300px', instances.editor2.config.width, 'editor2 instance should use its own custom config' );
			assert.areSame( '200px', instances.editor3.config.width, 'editor3 instance should use its own custom config' );
		} );
	},

	'test race of customConfigs': function() {
		initEditors( {
			editor1: { customConfig: assetsPath + 'raceconfig1.js' },
			editor2: { customConfig: assetsPath + 'raceconfig2.js' },
			editor3: { customConfig: assetsPath + 'raceconfig3.js' }
		} )
		( function( instances ) {
			assert.areSame( '200px', instances.editor1.config.width, 'editor1 instance should use its own custom config' );
			assert.areSame( '300px', instances.editor2.config.width, 'editor2 instance should use its own custom config' );
			assert.areSame( '400px', instances.editor3.config.width, 'editor3 instance should use its own custom config' );
		} );
	}
} );
