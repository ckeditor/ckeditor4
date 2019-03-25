/* bender-tags: editor */
( function() {
	'use strict';

	bender.test( {
		// Script listeners should be removed because it might cause memory leaks (#589).
		'test script load listeners removed': function() {
			var loader = CKEDITOR.loader;

			if ( !loader ) {
				// All core modules are bundled in release version, so we can't and don't need to test it there.
				assert.ignore();
			}

			var scriptName = loader.loadedScripts.pop();

			getScript().remove();

			delete loader.loadedScripts[ 's:' + scriptName ];

			loader.load( scriptName, false );

			var script = getScript();

			script.on( script.$.onload ? 'load' : 'readystatechange', function() {
				setTimeout( function() {
					resume( function() {
						assert.isFalse( !!script.$.onreadystatechange );
						assert.isFalse( !!script.$.onload );
					} );
				}, 50 );
			} );

			wait();

			function getScript() {
				return CKEDITOR.document.findOne( 'script[src="' + CKEDITOR.getUrl( 'core/' + scriptName + '.js' ) + '"]' );
			}
		}
	} );
} )();
