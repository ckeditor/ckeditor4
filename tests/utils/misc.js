/* bender-tags: editor,unit,utils */

( function() {
	'use strict';

	bender.test( {
		'test assert.isMatching': function() {
			assert.isMatching( /abc/, 'abc' );
			assert.isMatching( /ab?c/i, 'AC' );

			var error = null;
			try {
				assert.isMatching( /ab?c/i, 'def', 'should fail' );
			} catch ( e ) {
				error = e;
			}

			assert.isNotNull( error );
			assert.areEqual( 'def', error.actual );
			assert.areEqual( '/ab?c/i', error.expected );
			assert.areEqual( 'should fail', error.message );

			error = null;
			try {
				assert.isMatching( /ab?c/i, undefined, 'should fail' );
			} catch ( e ) {
				error = e;
			}

			assert.isNotNull( error );
			assert.isUndefined( error.actual );
			assert.areEqual( '/ab?c/i', error.expected );
			assert.areEqual( 'should fail', error.message );
		},

		'test synchronous wait/resume': function() {
			var tc = this;

			function onTestResume( cb ) {
				cb.call( tc );
			}

			onTestResume( function() {
				this.resume( function() {
					assert.isTrue( true );
				} );
			} );

			this.wait();
		},

		'test compatHtml\'s noTempElements': function() {
			var sourceHtml = '<p><i data-cke-temp="1">a</i>b<img data-cke-temp="1" src="x" />c</p>';

			assert.areSame( '<p>bc</p>', bender.tools.compatHtml( sourceHtml, false, false, false, false, false, true ) );
			assert.areSame( sourceHtml, bender.tools.compatHtml( sourceHtml ) );
		},

		'test compatHtml\'s customFilters': function() {
			var input = '<p data-some-attr><span>Foo</span></p>',
				output = '<p><em>Foo</em></p>',
				filters = [
					new CKEDITOR.htmlParser.filter( {
						elements: {
							'p': function( element ) {
								delete element.attributes[ 'data-some-attr' ];
							}
						}
					} ),

					new CKEDITOR.htmlParser.filter( {
						elements: {
							'span': function( element ) {
								element.name = 'em';
							}
						}
					} )
				];

			assert.areSame( output, bender.tools.compatHtml( input, false, false, false, false, false, false, filters ) );
		},

		'test escapeRegExp': function() {
			var characters = '-[]/{}()*+?.\\^$|',
				expected = '\\' + characters.split( '' ).join( '\\' ),
				escaped = bender.tools.escapeRegExp( characters );

			assert.areSame( expected, escaped, 'all characters were escaped' );
		},

		'test escapeRegExp - escape only special characters': function() {
			var characters = 'a%#@b c',
				escaped = bender.tools.escapeRegExp( characters );

			assert.areSame( characters, escaped, 'all characters were left untouched' );
		}
	} );
} )();
