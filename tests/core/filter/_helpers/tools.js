/* exported acfTestTools */

'use strict';

var acfTestTools = ( function() {
	/**
	 * Creates filtering test function based on passed rules and additional arguments.
	 * The returned function accepts input, which is passed through parser, filter and writer
	 * and compared to provided output.
	 *
	 * See filter.html and blacklisting.html
	 */
	function createFilter( rules, toHtml, enterMode ) {
		var filter = rules instanceof CKEDITOR.filter ? rules : new CKEDITOR.filter( rules ),
			writer = new CKEDITOR.htmlParser.basicWriter(),
			number = 1;

		writer.sortAttributes = 1;

		var fn = function( input, output, msg ) {
			var fragment = CKEDITOR.htmlParser.fragment.fromHtml( input );
			writer.reset();

			filter.applyTo( fragment, toHtml, false, enterMode );
			fragment.writeHtml( writer );

			assert.areSame( output, writer.getHtml(), msg || ( 'Assertion (' + number + ') failed.' ) );
			number += 1;
		};

		fn.filter = filter;

		fn.allow = function( rules ) {
			filter.allow( rules );
		};

		fn.disallow = function( rules ) {
			filter.disallow( rules );
		};

		return fn;
	}

	/**
	 * Shorthand for creating style instances.
	 */
	function st( styleDef ) {
		return new CKEDITOR.style( styleDef );
	}

	/**
	 * Replaces '@' character with bogus character/element based on the environment.
	 */
	function replaceAtWithBogus( html ) {
		return html.replace( /@/g, function() {
			return CKEDITOR.env.needsNbspFiller ? ( CKEDITOR.env.ie ? '' : '\xa0' ) : '<br />';
		} );
	}

	/**
	 * Returns a function which will test editor's data processor. It executes
	 * `toHtml` or `toDataFormat` method based on second argument.
	 *
	 * See filter.html tests.
	 */
	function createFilterTester( editor, toDF, dontFilter ) {
		return function( input, expected, msg ) {
			if ( !toDF ) {
				expected = replaceAtWithBogus( expected );
				var html = editor.dataProcessor.toHtml( input, '', false, dontFilter );

				// Use compatHtml to sortAttrubtes, because toHtml doesn't use external, configurable writer.
				assert.areSame( expected, bender.tools.compatHtml( html, false, true ), msg );
			} else {
				assert.areSame( expected, editor.dataProcessor.toDataFormat( input ), msg );
			}
		};
	}

	return {
		createFilter: createFilter,
		st: st,
		replaceAtWithBogus: replaceAtWithBogus,
		createFilterTester: createFilterTester
	};
} )();