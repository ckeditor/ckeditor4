/* exported lineutilsTestsTools */

var lineutilsTestsTools = ( function() {
	'use strict';

	return {
		/**
		 * Asserts relations created by CKEDITOR.plugins.lineutils#finder method.
		 *
		 * @param {CKEDITOR.editor} editor Editor instance.
		 * @param {CKEDITOR.plugins.lineutils.finder} finder Finder instance after search (when finder#relations is present).
		 * @param {String} expected Expected HTML with relations marked by "|".
		 */
		assertRelations: function( editor, finder, expected ) {
			var current, range,
				ranges = [],
				relations = finder.relations;

			for ( var r in relations ) {
				current = relations[ r ];

				if ( current.type & CKEDITOR.LINEUTILS_BEFORE )
					ranges.push( finder.getRange( { uid: r, type: CKEDITOR.LINEUTILS_BEFORE } ) );

				if ( current.type & CKEDITOR.LINEUTILS_AFTER )
					ranges.push( finder.getRange( { uid: r, type: CKEDITOR.LINEUTILS_AFTER } ) );

				if ( current.type & CKEDITOR.LINEUTILS_INSIDE )
					ranges.push( finder.getRange( { uid: r, type: CKEDITOR.LINEUTILS_INSIDE } ) );

				while ( ( range = ranges.pop() ) )
					range.insertNode( new CKEDITOR.dom.comment( 'R' ) );
			}

			assert.areSame( expected, editor.getData().replace( /<!--R-->/gi, '|' ), 'Relations discovered, collected and normalized correctly.' );
		}
	};
} )();