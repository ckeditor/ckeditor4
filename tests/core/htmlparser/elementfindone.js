/* bender-tags: editor */

( function() {
	'use strict';

	var htmlString =
		'<div id="test-html">' +
			'<div>' +
				'Foo' +
				'<p>' +
					'Baz' +
					'<span class="faz">Faz</span>' +
					'<span class="baz">' +
					'<strong>Baz</strong>' +
				'</span>' +
				'</p>' +
				'Bar' +
			'</div>' +
			'<div class="faz">Faz</div>' +
		'</div>',
		testElement = CKEDITOR.htmlParser.fragment.fromHtml( htmlString ).children[ 0 ];

	bender.test( {
		'test findOne by tag name': function() {
			assert.areSame( testElement.children[ 0 ], testElement.findOne( 'div' ), 'testElement.children[ 0 ]' );
			assert.areSame( testElement.children[ 0 ].children[ 1 ], testElement.findOne( 'p', true ),
				'testElement.children[ 0 ].children[ 1 ]'
			);
		},

		'test findOne by function': function() {
			assert.areSame( testElement.children[ 1 ],
				testElement.findOne( function( element ) {
					return element.attributes && element.attributes[ 'class' ] === 'faz';
				} ), 'testElement.children[ 1 ]' );
			assert.areSame( testElement.children[ 0 ].children[ 1 ].children[ 1 ],
				testElement.findOne( function( element ) {
					return element.attributes && element.attributes[ 'class' ] === 'faz';
				}, true ),
				'testElement.children[ 0 ].children[ 1 ].children[ 1 ]'
			);
		},

		'test findOne deep nested child': function() {
			assert.areSame( testElement.children[ 0 ].children[ 1 ].children[ 2 ].children[ 0 ], testElement.findOne( 'strong', true ),
				'testElement.children[ 0 ].children [ 1 ].children[ 3 ].children[ 1 ]'
			);
		},

		'test findOne no match': function() {
			assert.isNull( testElement.findOne( 'p' ) );
			assert.isNull( testElement.findOne( 'header', true ) );
		}
	} );
} )();
