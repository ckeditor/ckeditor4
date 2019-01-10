/* bender-tags: editor */

( function() {
	'use strict';

	var testElement = CKEDITOR.htmlParser.fragment.fromHtml(
		'<body>' +
			'<div>' +
				'Foo' +
				'<p>' +
					'Baz' +
					'<span class="faz">Faz</span>' +
				'</p>' +
				'Bar' +
			'</div>' +
			'<div class="faz">Faz</div>' +
		'</body>'
	).children[ 0 ];

	bender.test( {
		'test findOne by tag name': function() {
			assert.areSame( testElement.children[ 0 ], testElement.findOne( 'div' ) );
			assert.areSame( testElement.children[ 0 ].children[ 1 ], testElement.findOne( 'p', true ) );
		},

		'test findOne by function': function() {
			assert.areSame( testElement.children[ 1 ],
				testElement.findOne( function( element ) {
					return element.attributes && element.attributes[ 'class' ] === 'faz';
				} )
			);
			assert.areSame( testElement.children[ 0 ].children[ 1 ].children[ 1 ],
				testElement.findOne( function( element ) {
					return element.attributes && element.attributes[ 'class' ] === 'faz';
				}, true )
			);
		},

		'test findOne no match': function() {
			assert.isNull( testElement.findOne( 'p' ) );
			assert.isNull( testElement.findOne( 'header', true ) );
		}
	} );
} )();
