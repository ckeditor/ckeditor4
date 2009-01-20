/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/*jsl:import yuitest.js*/

// Inject the YUI Test files into the page.
// URLs copied from http://developer.yahoo.com/yui/yuitest/
document.write( '<script type="text/javascript" src="' +
	CKEDITOR.basePath +
	'_source/' + // %REMOVE_LINE%
	'tests/yuitest.js"></script>' );

document.write( '<script type="text/javascript" src="' +
	CKEDITOR.basePath +
	'_source/' +
	'core/test.js"></script>' );

(function() {
	var createLogger = function() {
			document.body.appendChild( document.createElement( 'div' ) ).id = 'testLogger';
		};

	var outputResult = function( text ) {
			var div = document.getElementById( 'testLogger' ).appendChild( document.createElement( 'div' ) );
			div.className = 'testEntry';
			div.innerHTML = text;
		};

	var htmlEncode = function( data ) {
			if ( typeof data != 'string' )
				return data;

			return data.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' );
		};

	window.onload = function() {
		createLogger();
		var runner = YAHOO.tool.TestRunner;

		var handleTestResult = function( data ) {
				switch ( data.type ) {
					case runner.TEST_FAIL_EVENT:

						var expected = data.error.expected;
						if ( expected && expected.nodeType )
							expected += ' (' + ( expected.nodeType == 1 ? expected.nodeName : expected.nodeValue ) + ')';

						var actual = data.error.actual;
						if ( actual && actual.nodeType )
							actual += ' (' + ( actual.nodeType == 1 ? actual.nodeName : actual.nodeValue ) + ')';

						outputResult( '<span class="testFail">FAIL</span> Test named "' + data.testName +
													'" failed with message: "' + htmlEncode( data.error.message ) +
													'".<div>Expected:</div><pre>' + htmlEncode( expected ) +
													'<br></pre><div>Actual:</div><pre>' + htmlEncode( actual ) + '<br></pre>' );
						break;
					case runner.TEST_PASS_EVENT:
						outputResult( '<span class="testPass">PASS</span> Test named "' + data.testName + '" passed.' );
						break;
					case runner.TEST_IGNORE_EVENT:
						outputResult( '<span class="testIgnore">IGNORE</span> Test named "' + data.testName + '" was ignored.' );
						break;
				}
			};

		runner.subscribe( runner.TEST_FAIL_EVENT, handleTestResult );
		runner.subscribe( runner.TEST_IGNORE_EVENT, handleTestResult );
		runner.subscribe( runner.TEST_PASS_EVENT, handleTestResult );

		if ( window.parent && window.parent.onTestStart ) {
			runner.subscribe( runner.TEST_CASE_BEGIN_EVENT, window.parent.onTestStart );
			runner.subscribe( runner.TEST_CASE_COMPLETE_EVENT, window.parent.onTestComplete );
		}

		runner.run();
	};
})();
