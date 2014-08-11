/* bender-tags: editor,unit,utils */

( function() {
	'use strict';

	var compatHtmlArgs,
		originalCompatHtml = bender.tools.compatHtml,
		htmlTools = bender.tools.html,
		filler = CKEDITOR.env.needsBrFiller ? '<br />' : '&nbsp;';

	bender.tools.compatHtml = function( html, noInterWS, sortAttributes, fixZWS, fixStyles, fixNbsp, noTempElements ) {
		compatHtmlArgs = {
			noInterWS: !!noInterWS,
			sortAttributes: !!sortAttributes,
			fixZWS: !!fixZWS,
			fixStyles: !!fixStyles,
			fixNbsp: !!fixNbsp,
			noTempElements: !!noTempElements
		};

		return originalCompatHtml.call( bender.tools, html, noInterWS, sortAttributes, fixZWS, fixStyles, fixNbsp, noTempElements );
	};

	// Tests compareInnerHtml and options forwarding to compatHtml.
	function t( ret, expected, actual, options, expectedCompatHtmlArgs ) {
		return function() {
			// In case compatHtml was not called at all.
			compatHtmlArgs = {};
			assert.areSame( ret, htmlTools.compareInnerHtml( expected, actual, options ), 'returned value' );

			if ( expectedCompatHtmlArgs ) {
				for ( var arg in expectedCompatHtmlArgs ) {
					assert.areSame( expectedCompatHtmlArgs[ arg ], compatHtmlArgs[ arg ],
						'compatHtml\'s argument: ' + arg );
				}
			}
		};
	}

	// Tests prepareInnerHtmlForComparison.
	function th( expected, innerHtmlToPrepare, options ) {
		return function() {
			assert.areSame( expected, htmlTools.prepareInnerHtmlForComparison( innerHtmlToPrepare, options ) );
		};
	}

	// Tests prepareInnerHtmlPattern.
	function tp( expected, patternSource ) {
		return function() {
			var actual = htmlTools.prepareInnerHtmlPattern( patternSource ).toString()
				// FF escapes '/' and Chrome does not - unify this.
				.replace( /\\\//g, '/' );

			assert.areSame( expected.toString(), actual );
		};
	}

	bender.test( {
		// Options ------------------------------------------------------------

		'opts.noInterWS defaults to false':			t( true, '', '', null, { noInterWS: false } ),
		'opts.noInterWS defaults to false 2':		t( true, '', '', {}, { noInterWS: false } ),
		'opts.noInterWS is passed':					t( true, '', '', { noInterWS: true }, { noInterWS: true } ),

		'opts.fixStyles defaults to false':			t( true, '', '', null, { fixStyles: false } ),
		'opts.fixStyles is passed':					t( true, '', '', { fixStyles: true }, { fixStyles: true } ),

		'opts.sortAttributes defaults to true':		t( true, '', '', null, { sortAttributes: true } ),
		'opts.fixZWS defaults to true':				t( true, '', '', null, { fixZWS: true } ),
		'opts.fixNbsp defaults to true':			t( true, '', '', null, { fixNbsp: true } ),
		'opts.noTempElements defaults to false':	t( true, '', '', null, { noTempElements: false } ),

		'multiple opts':							t( true, '', '', { fixNbsp: false, fixStyles: true }, { fixZWS: true, fixNbsp: false, fixStyles: true } ),

		// Passing ------------------------------------------------------------

		'simple string':									t( true, 'foo', 'foo' ),
		'simple element':									t( true, '<b>foo</b>', '<B>foo</B>' ),
		'bogus expected, not exists':						t( true, 'a@', 'a' ),
		// Obvious simplification - &nbsp; can't be a filler in this place, but that
		// is developer's duty to use @ correctly.
		'bogus expected, exists':							t( true, 'a@', 'a' + filler ),
		'multiple boguses':									t( true, '<p>a@</p><p>b@</p><p>c@</p>', '<p>a' + filler + '</p><p>b</p><p>c' + filler + '</p>' ),
		'regexp conflict [':								t( true, 'ba[r', 'ba[r' ),

		'markers 1 - no opts.compareSelection':				t( true, 'ba[r]', 'ba[r]' ),
		'markers 2 - no opts.compareSelection':				t( true, 'ba{}r', 'ba{}r' ),
		'markers 3 - no opts.compareSelection':				t( true, '<ul><li>[</li><li>a</li></ul>', '<ul>[<li>a</li></ul>' ),

		'markers 1 - opts.compareSelection':				t( true, 'ba[r}', 'ba[r}', { compareSelection: true } ),
		'markers 2 - opts.compareSelection':				t( true, 'ba{}r', 'ba{}r', { compareSelection: true } ),
		'markers 3 - opts.compareSelection':				t( true, 'ba[]r', 'ba[]r', { compareSelection: true } ),
		'markers 4 - opts.compareSelection':				t( true, '<ul>[<li>a</li>]</ul>', '<ul>[<li>a</li>]</ul>', { compareSelection: true } ),

		'markers 1 - opts.compare&normalizeSelection':		t( true, 'ba[r]', 'ba{r}', { compareSelection: true, normalizeSelection: true } ),
		'markers 2 - opts.compare&normalizeSelection':		t( true, 'ba^r', 'ba{}r', { compareSelection: true, normalizeSelection: true } ),
		'markers 3 - opts.compare&normalizeSelection':		t( true, 'ba^r', 'ba[]r', { compareSelection: true, normalizeSelection: true } ),
		'markers 4 - opts.compare&normalizeSelection':		t( true, '<ul>[<li>a</li>]</ul>', '<ul>[<li>a</li>]</ul>', { compareSelection: true, normalizeSelection: true } ),

		// Failing ------------------------------------------------------------

		'simple string - fail':								t( false, 'foo', 'bar' ),
		'simple element - fail':							t( false, '<b>foo</b>', '<I>foo</I>' ),
		'not expected bogus - fail':						t( false, '<p>foo<br /></p>', '<p>foo</p>' ),

		// Expected part has to be regexified if special characters are not escaped
		// bad things may happen.
		'regexp conflict * - fail':							t( false, 'ba*r', 'br' ),
		'regexp - partial match - start - fail':			t( false, 'bar', 'barx' ),
		'regexp - partial match - end - fail':				t( false, 'bar', 'xbar' ),

		'markers 1 - no opts.compareSelection - fail':		t( false, 'bar', 'ba[]r' ),
		'markers 2 - no opts.compareSelection - fail':		t( false, 'ba{}r', 'ba[]r' ),
		'markers - opts.compareSelection - fail':			t( false, 'ba{}r', 'ba[]r', { compareSelection: true } ),
		'markers - opts.compare&normalizeSelection - fail': t( false, 'ba[]r', 'ba[]r', { compareSelection: true, normalizeSelection: true } ),

		// Prepare inner HTML (because compareInnerHtml's tests cover most cases these are simpler).

		'prep inner HTML - basic':						th( 'foo', 'foo' ),
		'prep inner HTML - HTML is processed':			th( '<b>foo</b>', '<B >foo</b>' ),
		'prep inner HTML - attributes sorting':			th( '<b bar="2" foo="1">foo</b>', '<b foo="1" bar="2">foo</b>' ),
		'prep inner HTML - no attributes sorting':		th( '<b foo="1" bar="2">foo</b>', '<b foo="1" bar="2">foo</b>', { sortAttributes: false } ),
		'prep inner HTML - no interws default':			th( '<b>foo <img src="x" /></b> bar', '<b>foo <img src="x" /></b> bar' ),
		'prep inner HTML - no interws':					th( '<b>foo<img src="x" /></b>bar', '<b>foo <img src="x" /></b> bar', { noInterWS: true } ),
		'prep inner HTML - no compare sel':				th( '<ul><li>[</li><li>a</li><li>]</li></ul>', '<ul>[<li>a</li>]</ul>' ),
		'prep inner HTML - compare sel':				th( '<ul>[<li>a</li>]</ul>', '<ul>[<li>a</li>]</ul>', { compareSelection: true } ),
		'prep inner HTML - no normalize sel':			th( '<p>[]a{b}c</p>', '<p>[]a{b}c</p>' ),
		'prep inner HTML - normalize sel':				th( '<p>^a[b]c</p>', '<p>[]a{b}c</p>', { compareSelection: true, normalizeSelection: true } ),
		'prep inner HTML - no strip temp':				th( 'a<i data-cke-temp="1">b</i>', 'a<i data-cke-temp="1">b</i>' ),
		'prep inner HTML - strip temp':					th( 'a', 'a<i data-cke-temp="1">b</i>', { noTempElements: true } ),

		// Prepare pattern (because compareInnerHtml's tests cover most cases these are simpler).

		'prep pattern - basic':							tp( '/^foo$/', 'foo' ),
		'prep pattern - escaping':						tp( '/^f\\.o\\*o$/', 'f.o*o' ),
		'prep pattern - boguses':						tp( '/^f(' + filler + ')?oo(' + filler + ')?$/', 'f@oo@' ),

		// Misc ---------------------------------------------------------------

		'test does not modify options object': function() {
			var opts = {
					fixStyles: true
				},
				strOpts = JSON.stringify( opts );

			htmlTools.compareInnerHtml( 'a', 'a', opts );

			assert.areSame( strOpts, JSON.stringify( opts ), 'options object has not been modified' );
		}
	} );
} )();