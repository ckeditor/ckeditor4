/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: listblock */

( function() {
	'use strict';

	function fixHtml( html ) {
		return bender.tools.compatHtml( html, 0, 1 );
	}

	bender.test( {
		'test double quote': function() {
			this.assertListBlockAdd(
				{ value: 'a"', html: 'b"', title: 'c"d' },
				{ value: 'a"', html: 'b"', title: 'c"d' }
			);
		},

		'test html markup': function() {
			this.assertListBlockAdd(
				{ value: 'foo<i>bar</i>', html: 'foo<i>bar</i>', title: 'foo<b>bar</b>' },
				{ value: 'foo<i>bar</i>', html: 'foo<i>bar</i>', title: 'foo<b>bar</b>' }
			);
		},

		'test single quote': function() {
			this.assertListBlockAdd(
				{ value: 'a\'', html: 'b\'', title: 'c\'d' },
				{ value: 'a\'', html: 'b\'', title: 'c\'d' }
			);
		},

		'test multiple single quotes': function() {
			this.assertListBlockAdd(
				{ value: 'a\'b\'c\'', html: 'd\'e\'\'f\'', title: 'g\'h\'j\'' },
				{ value: 'a\'b\'c\'', html: 'd\'e\'\'f\'', title: 'g\'h\'j\'' }
			);
		},

		// Expects both object to have following structure:
		// { value: 'foo', html: 'bar', title: 'baz' }
		//
		// * value is placed into a[onclick] and a[href] attributes,
		// * html is placed as inner html of anchor,
		// * title is saved to a[title] attribute.
		assertListBlockAdd: function( expected, input ) {
				// Mockup of listBlock object required by add() method.
			var mock = {
					_: {
						items: {},
						getClick: function() {},
						pendingList: []
					}
				};

			// Executed tested function in context of mock.
			CKEDITOR.ui.listBlock.prototype.add.call( mock, input.value, input.html, input.title );

			// Assert that count of entries created in pendingList is correct.
			assert.areEqual( 1, mock._.pendingList.length, 'Invalid count of strings moved to pending list' );

			var producedString = mock._.pendingList[ 0 ],
				// This element will be created only to parse html generated in producedString.
				elem = CKEDITOR.document.createElement( 'ul' );

			// Replace the remaining {clickFn} part of template with clickFnId label, to avoid incorrect JS
			// which makes IE8 cry.
			producedString = producedString.replace( /\{clickFn\}/, 'clickFnId'  );

			elem.setHtml( producedString );

			var anchor = elem.getFirst().getFirst(),
				// Note that both expected values needs to have single quotes escaped, since js string itself
				// is wrapped with single quotes.
				decoratedExpectedHref = 'javascript:void(\'' + this._escapeSingleQuote( expected.value ) + '\')', // jshint ignore:line
				decoratedExpectedOnclick = 'CKEDITOR.tools.callFunction(clickFnId,\'' + this._escapeSingleQuote( expected.value ) + '\'); return false;';

			// All IEs have changed onclick attr.
			if ( CKEDITOR.env.ie )
				decoratedExpectedOnclick = 'return false;';

			assert.areEqual( expected.title, anchor.getAttribute( 'title' ), 'Invalid value in to a[title] attribute' );
			// Checking expected.value, which occurs in 2 attributes.
			assert.areEqual( decoratedExpectedHref, anchor.getAttribute( 'href' ), 'Invalid value in to a[href] attribute' );
			assert.areEqual( decoratedExpectedOnclick, anchor.getAttribute( 'onclick' ), 'Invalid value in a[onclick] attribute' );

			assert.areSame( fixHtml( expected.html ), fixHtml( anchor.getHtml() ), 'Invalid inner HTML in anchor' );
		},

		// Escapes with slash all signle quotes in given string and returns it.
		_escapeSingleQuote: function( str ) {
			return str.replace( /\'/g, '\\\'' );
		}
	} );

} )();