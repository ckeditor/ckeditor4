/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.xml} class, which represents a
 *		loaded XML document.
 */

( function() {
	/* global ActiveXObject */
	CKEDITOR.plugins.add( 'xml', {} );

	/**
	 * Represents a loaded XML document.
	 *
	 *		var xml = new CKEDITOR.xml( '<books><book title="My Book" /></books>' );
	 *
	 * @class
	 * @constructor Creates xml class instance.
	 * @param {Object/String} xmlObjectOrData A native XML (DOM document) object or
	 * a string containing the XML definition to be loaded.
	 */
	CKEDITOR.xml = function( xmlObjectOrData ) {
		var baseXml = null;

		if ( typeof xmlObjectOrData == 'object' )
			baseXml = xmlObjectOrData;
		else {
			var data = ( xmlObjectOrData || '' ).replace( /&nbsp;/g, '\xA0' );

			// Check ActiveXObject before DOMParser, because IE10+ support both, but
			// there's no XPath support in DOMParser instance.
			// Also, the only check for ActiveXObject which still works in IE11+ is with `in` operator.
			if ( 'ActiveXObject' in window ) {
				try {
					baseXml = new ActiveXObject( 'MSXML2.DOMDocument' );
				} catch ( e ) {
					try {
						baseXml = new ActiveXObject( 'Microsoft.XmlDom' );
					} catch ( err ) {}
				}

				if ( baseXml ) {
					baseXml.async = false;
					baseXml.resolveExternals = false;
					baseXml.validateOnParse = false;
					baseXml.loadXML( data );
				}
			}
			else if ( window.DOMParser ) {
				baseXml = ( new DOMParser() ).parseFromString( data, 'text/xml' );
			}
		}

		/**
		 * The native XML (DOM document) used by the class instance.
		 *
		 * @property {Object}
		 */
		this.baseXml = baseXml;
	};

	CKEDITOR.xml.prototype = {
		/**
		 * Get a single node from the XML document, based on a XPath query.
		 *
		 *		// Create the XML instance.
		 *		var xml = new CKEDITOR.xml( '<list><item id="test1" /><item id="test2" /></list>' );
		 *		// Get the first <item> node.
		 *		var itemNode = <b>xml.selectSingleNode( 'list/item' )</b>;
		 *		// Alert "item".
		 *		alert( itemNode.nodeName );
		 *
		 * @param {String} xpath The XPath query to execute.
		 * @param {Object} [contextNode] The XML DOM node to be used as the context
		 * for the XPath query. The document root is used by default.
		 * @returns {Object} A XML node element or null if the query has no results.
		 */
		selectSingleNode: function( xpath, contextNode ) {
			var baseXml = this.baseXml;

			if ( contextNode || ( contextNode = baseXml ) ) {
				if ( 'selectSingleNode' in contextNode ) // IEs
					return contextNode.selectSingleNode( xpath );
				else if ( baseXml.evaluate ) { // Others
					var result = baseXml.evaluate( xpath, contextNode, null, 9, null );
					return ( result && result.singleNodeValue ) || null;
				}
			}

			return null;
		},

		/**
		 * Gets a list node from the XML document, based on a XPath query.
		 *
		 *		// Create the XML instance.
		 *		var xml = new CKEDITOR.xml( '<list><item id="test1" /><item id="test2" /></list>' );
		 *		// Get all <item> nodes.
		 *		var itemNodes = xml.selectNodes( 'list/item' );
		 *		// Alert "item" twice, one for each <item>.
		 *		for ( var i = 0; i < itemNodes.length; i++ )
		 *			alert( itemNodes[i].nodeName );
		 *
		 * @param {String} xpath The XPath query to execute.
		 * @param {Object} [contextNode] The XML DOM node to be used as the context
		 * for the XPath query. The document root is used by default.
		 * @returns {Array} An array containing all matched nodes. The array will
		 * be empty if the query has no results.
		 */
		selectNodes: function( xpath, contextNode ) {
			var baseXml = this.baseXml,
				nodes = [];

			if ( contextNode || ( contextNode = baseXml ) ) {
				if ( 'selectNodes' in contextNode ) // IEs
					return contextNode.selectNodes( xpath );
				else if ( baseXml.evaluate ) { // Others
					var result = baseXml.evaluate( xpath, contextNode, null, 5, null );

					if ( result ) {
						var node;
						while ( ( node = result.iterateNext() ) )
							nodes.push( node );
					}
				}
			}

			return nodes;
		},

		/**
		 * Gets the string representation of hte inner contents of a XML node,
		 * based on a XPath query.
		 *
		 *		// Create the XML instance.
		 *		var xml = new CKEDITOR.xml( '<list><item id="test1" /><item id="test2" /></list>' );
		 *		// Alert "<item id="test1" /><item id="test2" />".
		 *		alert( xml.getInnerXml( 'list' ) );
		 *
		 * @param {String} xpath The XPath query to execute.
		 * @param {Object} [contextNode] The XML DOM node to be used as the context
		 * for the XPath query. The document root is used by default.
		 * @returns {String} The textual representation of the inner contents of
		 * the node or null if the query has no results.
		 */
		getInnerXml: function( xpath, contextNode ) {
			var node = this.selectSingleNode( xpath, contextNode ),
				xml = [];
			if ( node ) {
				node = node.firstChild;
				while ( node ) {
					if ( node.xml ) // IEs
						xml.push( node.xml );
					else if ( window.XMLSerializer ) // Others
						xml.push( ( new XMLSerializer() ).serializeToString( node ) );

					node = node.nextSibling;
				}
			}

			return xml.length ? xml.join( '' ) : null;
		}
	};
} )();
