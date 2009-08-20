/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.test} object, inherited from
 * {@link CKTESTER.tools}, which encapsulates the CKEditor dedicating testing APIs.
 *
 */

CKEDITOR.test = {
	/**
	 * Retrieve the value of an element as normalized HTML.
	 * @param id {String} Id of the element.
	 */
	getValueAsHtml: function( id ) {
		return CKEDITOR.test.fixHtml( CKEDITOR.document.getById( id ).getValue(), false );
	},

	/**
	 * Fill the the target element with both html and the denoted selection range.
	 * @param element {CKEDITOR.dom.element} The element to fill.
	 * @param html {String} String presentation of the HTML along with the
	 * selection range marker to load.
	 * @example
	 * <p>single ^ selection</p>
	 * <p>[multiple]<span>[selection]</span></p>
	 */
	setHtmlWithSelection: function( element, html ) {
		if ( !CKEDITOR.dom.selection )
			throw new Error( 'selection plugin is required to use this method.' );

		var rangeCount = 0,
			replaceWithBookmark = function( match ) {
				var bookmark;
				switch ( match ) {
					case ']':
						bookmark = '<span id="E' + rangeCount + '"></span>';
						rangeCount++;
						break;
					case '^':
						bookmark = '<span id="S' + rangeCount + '"></span>';
						rangeCount++;
						break;
					case '[':
						bookmark = '<span id="S' + rangeCount + '"></span>';
				}
				return bookmark;
			};

		html = html.replace( /\^|\[|\]/g, replaceWithBookmark );
		element.setHtml( html );
		var doc = element.getDocument(),
			ranges = [],
			sel = doc.getSelection();

		for ( var i = 0; i < rangeCount; i++ ) {
			var range = new CKEDITOR.dom.range( doc );
			range.moveToBookmark({ startNode: 'S' + i, endNode: 'E' + i, serializable: true } );
			ranges.push( range );
		}

		sel.selectRanges( ranges );
	}

};

// Inherit generic testing APIs from CKTESTER.
YAHOO.lang.augmentObject( CKEDITOR.test, CKTESTER.tools );


// Provide a set of default test suites/test cases.
CKEDITOR.test.suites = {};
CKEDITOR.test.cases = {};
/**
 *  All test cases in this suite share a fully interacted 'playground' editor instance.
 */
YAHOO.lang.extend( ( CKEDITOR.test.suites.editorTestSuite = function( template ) {
	// The editor instance shared by all tests.
	this.editor = null;
	// The editor name to be used.
	this.editorName = '';
	// The editor instance config to be used.
	this.config = null;
	// The initial editor data loaded.
	this.startupData = null;

	CKEDITOR.test.suites.editorTestSuite.superclass.constructor.call( this, template );

}), YAHOO.tool.TestSuite, {
	setUp: function() {

		var editorName = this.editorName || 'test_editor';
		var element = CKEDITOR.document.getById( editorName ) || CKEDITOR.document.getBody().append( CKEDITOR.dom.element.createFromHtml( '<div id="' + editorName + '"></div>' ) );
		element.setValue( this.startupData );
		CKEDITOR.on( 'instanceReady', function( evt ) {
			if ( evt.editor.name == editorName ) {
				this.editor = evt.editor;
				this.editor.focus();
				this.resumeSetup();
			}
		}, this );
		CKEDITOR.replace( element.getAttribute( 'id' ), this.config );
		this.wait();
	},

	tearDown: function() {
		this.editor.destroy();
	}
});
