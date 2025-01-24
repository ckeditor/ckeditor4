/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.dom.document} class which
 *		represents a DOM document.
 */

/**
 * Represents a DOM document.
 *
 *		var document = new CKEDITOR.dom.document( document );
 *
 * @class
 * @extends CKEDITOR.dom.domObject
 * @constructor Creates a document class instance.
 * @param {Object} domDocument A native DOM document.
 */
CKEDITOR.dom.document = function( domDocument ) {
	CKEDITOR.dom.domObject.call( this, domDocument );
};

// PACKAGER_RENAME( CKEDITOR.dom.document )

CKEDITOR.dom.document.prototype = new CKEDITOR.dom.domObject();

CKEDITOR.tools.extend( CKEDITOR.dom.document.prototype, {
	/**
	 * The node type. This is a constant value set to {@link CKEDITOR#NODE_DOCUMENT}.
	 *
	 * @readonly
	 * @property {Number} [=CKEDITOR.NODE_DOCUMENT]
	 */
	type: CKEDITOR.NODE_DOCUMENT,

	/**
	 * Appends a CSS file to the document.
	 *
	 *		CKEDITOR.document.appendStyleSheet( '/mystyles.css' );
	 *
	 * @param {String} cssFileUrl The CSS file URL.
	 */
	appendStyleSheet: function( cssFileUrl ) {
		cssFileUrl = CKEDITOR.appendTimestamp( cssFileUrl );

		if ( this.$.createStyleSheet )
			this.$.createStyleSheet( cssFileUrl );
		else {
			var link = new CKEDITOR.dom.element( 'link' );
			link.setAttributes( {
				rel: 'stylesheet',
				type: 'text/css',
				href: cssFileUrl
			} );

			this.getHead().append( link );
		}
	},

	/**
	 * Creates a CSS stylesheet and inserts it into the document.
	 *
	 * @param cssStyleText {String} CSS style text.
	 * @returns {Object} The created DOM native stylesheet object.
	 */
	appendStyleText: function( cssStyleText ) {
		if ( this.$.createStyleSheet ) {
			var styleSheet = this.$.createStyleSheet( '' );
			styleSheet.cssText = cssStyleText;
		} else {
			var style = new CKEDITOR.dom.element( 'style', this );
			style.append( new CKEDITOR.dom.text( cssStyleText, this ) );
			this.getHead().append( style );
		}

		return styleSheet || style.$.sheet;
	},

	/**
	 * Creates a {@link CKEDITOR.dom.element} instance in this document.
	 *
	 * @param {String} name The name of the element.
	 * @param {Object} [attributesAndStyles]
	 * @param {Object} [attributesAndStyles.attributes] Attributes that will be set.
	 * @param {Object} [attributesAndStyles.styles] Styles that will be set.
	 * @returns {CKEDITOR.dom.element}
	 */
	createElement: function( name, attribsAndStyles ) {
		var element = new CKEDITOR.dom.element( name, this );

		if ( attribsAndStyles ) {
			if ( attribsAndStyles.attributes )
				element.setAttributes( attribsAndStyles.attributes );

			if ( attribsAndStyles.styles )
				element.setStyles( attribsAndStyles.styles );
		}

		return element;
	},

	/**
	 * Creates a {@link CKEDITOR.dom.text} instance in this document.
	 *
	 * @param {String} text Value of the text node.
	 * @returns {CKEDITOR.dom.element}
	 */
	createText: function( text ) {
		return new CKEDITOR.dom.text( text, this );
	},

	/**
	 * Moves the selection focus to this document's window.
	 */
	focus: function() {
		this.getWindow().focus();
	},

	/**
	 * Returns the element that is currently designated as the active element in the document.
	 *
	 * **Note:** Only one element can be active at a time in a document.
	 * An active element does not necessarily have focus,
	 * but an element with focus is always the active element in a document.
	 *
	 * @returns {CKEDITOR.dom.element} Active element or `null` if an IE8-9 bug is encountered.
	 * See [#10030](https://dev.ckeditor.com/ticket/10030).
	 */
	getActive: function() {
		var $active;
		try {
			$active = this.$.activeElement;
		} catch ( e ) {
			return null;
		}
		return new CKEDITOR.dom.element( $active );
	},

	/**
	 * Gets an element based on its ID.
	 *
	 *		var element = CKEDITOR.document.getById( 'myElement' );
	 *		alert( element.getId() ); // 'myElement'
	 *
	 * @param {String} elementId The element ID.
	 * @returns {CKEDITOR.dom.element} The element instance, or `null` if not found.
	 */
	getById: function( elementId ) {
		var $ = this.$.getElementById( elementId );
		return $ ? new CKEDITOR.dom.element( $ ) : null;
	},

	/**
	 * Gets a node based on its address. See {@link CKEDITOR.dom.node#getAddress}.
	 *
	 * @param {Array} address
	 * @param {Boolean} [normalized=false]
	 */
	getByAddress: function( address, normalized ) {
		var $ = this.$.documentElement;

		for ( var i = 0; $ && i < address.length; i++ ) {
			var target = address[ i ];

			if ( !normalized ) {
				$ = $.childNodes[ target ];
				continue;
			}

			var currentIndex = -1;

			for ( var j = 0; j < $.childNodes.length; j++ ) {
				var candidate = $.childNodes[ j ];

				if ( normalized === true && candidate.nodeType == 3 && candidate.previousSibling && candidate.previousSibling.nodeType == 3 )
					continue;

				currentIndex++;

				if ( currentIndex == target ) {
					$ = candidate;
					break;
				}
			}
		}

		return $ ? new CKEDITOR.dom.node( $ ) : null;
	},

	/**
	 * Gets elements list based on a given tag name.
	 *
	 * @param {String} tagName The element tag name.
	 * @returns {CKEDITOR.dom.nodeList} The nodes list.
	 */
	getElementsByTag: function( tagName, namespace ) {
		if ( !( CKEDITOR.env.ie && ( document.documentMode <= 8 ) ) && namespace )
			tagName = namespace + ':' + tagName;
		return new CKEDITOR.dom.nodeList( this.$.getElementsByTagName( tagName ) );
	},

	/**
	 * Gets the `<head>` element for this document.
	 *
	 *		var element = CKEDITOR.document.getHead();
	 *		alert( element.getName() ); // 'head'
	 *
	 * @returns {CKEDITOR.dom.element} The `<head>` element.
	 */
	getHead: function() {
		var head = this.$.getElementsByTagName( 'head' )[ 0 ];
		if ( !head )
			head = this.getDocumentElement().append( new CKEDITOR.dom.element( 'head' ), true );
		else
			head = new CKEDITOR.dom.element( head );

		return head;
	},

	/**
	 * Gets the `<body>` element for this document.
	 *
	 *		var element = CKEDITOR.document.getBody();
	 *		alert( element.getName() ); // 'body'
	 *
	 * @returns {CKEDITOR.dom.element} The `<body>` element.
	 */
	getBody: function() {
		return new CKEDITOR.dom.element( this.$.body );
	},

	/**
	 * Gets the DOM document element for this document.
	 *
	 * @returns {CKEDITOR.dom.element} The DOM document element.
	 */
	getDocumentElement: function() {
		return new CKEDITOR.dom.element( this.$.documentElement );
	},

	/**
	 * Gets the window object that stores this document.
	 *
	 * @returns {CKEDITOR.dom.window} The window object.
	 */
	getWindow: function() {
		return new CKEDITOR.dom.window( this.$.parentWindow || this.$.defaultView );
	},

	/**
	 * Defines the document content through `document.write`. Note that the
	 * previous document content will be lost (cleaned).
	 *
	 *		document.write(
	 *			'<html>' +
	 *				'<head><title>Sample Document</title></head>' +
	 *				'<body>Document content created by code.</body>' +
	 *			'</html>'
	 *		);
	 *
	 * @since 3.5.0
	 * @param {String} html The HTML defining the document content.
	 */
	write: function( html ) {
		// Don't leave any history log in IE. (https://dev.ckeditor.com/ticket/5657)
		this.$.open( 'text/html', 'replace' );

		// Support for custom document.domain in IE.
		//
		// The script must be appended because if placed before the
		// doctype, IE will go into quirks mode and mess with
		// the editable, e.g. by changing its default height.
		if ( CKEDITOR.env.ie )
			html = html.replace( /(?:^\s*<!DOCTYPE[^>]*?>)|^/i, '$&\n<script data-cke-temp="1">(' + CKEDITOR.tools.fixDomain + ')();</script>' );

		this.$.write( html );
		this.$.close();
	},

	/**
	 * Wrapper for `querySelectorAll`. Returns a list of elements within this document that match
	 * the specified `selector`.
	 *
	 * **Note:** The returned list is not a live collection (like the result of native `querySelectorAll`).
	 *
	 * @since 4.3.0
	 * @param {String} selector A valid [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).
	 * @returns {CKEDITOR.dom.nodeList}
	 */
	find: function( selector ) {
		return new CKEDITOR.dom.nodeList( this.$.querySelectorAll( selector ) );
	},

	/**
	 * Wrapper for `querySelector`. Returns the first element within this document that matches
	 * the specified `selector`.
	 *
	 * @since 4.3.0
	 * @param {String} selector A valid [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).
	 * @returns {CKEDITOR.dom.element}
	 */
	findOne: function( selector ) {
		var el = this.$.querySelector( selector );

		return el ? new CKEDITOR.dom.element( el ) : null;
	},

	/**
	 * Internet Explorer 8 only method. It returns a document fragment which has all HTML5 elements enabled.
	 *
	 * @since 4.3.0
	 * @private
	 * @returns DocumentFragment
	 */
	_getHtml5ShivFrag: function() {
		var $frag = this.getCustomData( 'html5ShivFrag' );

		if ( !$frag ) {
			$frag = this.$.createDocumentFragment();
			CKEDITOR.tools.enableHtml5Elements( $frag, true );
			this.setCustomData( 'html5ShivFrag', $frag );
		}

		return $frag;
	}
} );
